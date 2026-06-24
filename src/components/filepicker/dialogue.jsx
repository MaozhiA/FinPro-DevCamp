import { useState, useRef } from "react";
import { useFilePicker } from "use-file-picker";
import { FileAmountLimitValidator, FileSizeValidator } from "use-file-picker/validators";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const FilePicker = ({ type, onUploadSuccess }) => {

  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // ← new
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  const uploadFile = async (fileBlob, fileName) => {
    const fileRef = ref(storage, `uploads/${fileName}`);
    await uploadBytes(fileRef, fileBlob);
    const url = await getDownloadURL(fileRef);
    console.log("Uploaded:", url);
    onUploadSuccess(type); 
    
    return url;
  };

  const handleCameraCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file, file.name);
  };

  const openWebcam = async () => {
    setShowCamera(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    setTimeout(() => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }, 100);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    streamRef.current.getTracks().forEach(t => t.stop());
    setShowCamera(false);

    canvas.toBlob((blob) => {
      const previewURL = URL.createObjectURL(blob);
      setCapturedImage({ blob, previewURL }); // ← store for preview
    }, "image/png");
  };

 
  const handleSubmit = async () => {
    await uploadFile(capturedImage.blob, `selfie-${Date.now()}.png`);
    URL.revokeObjectURL(capturedImage.previewURL); // ← free memory
    setCapturedImage(null);
  };


  const handleRetake = () => {
    URL.revokeObjectURL(capturedImage.previewURL);
    setCapturedImage(null);
    openWebcam();
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
  };

  const handleSelfieClick = () => {
    if (isMobile) {
      cameraInputRef.current.click();
    } else {
      openWebcam();
    }
  };

  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: "DataURL",
    accept: type === "document" ? ".pdf,.doc,.docx" : "image/*",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileSizeValidator({ maxFileSize: 10 * 1024 * 1024 }),
    ],
    onFilesSuccessfullySelected: async ({ filesContent }) => {
      const file = filesContent[0];
      const blob = await fetch(file.content).then(r => r.blob());
      await uploadFile(blob, file.name);
    },
  });

  const handlePick = () => {
    setTimeout(() => openFilePicker(), 0);
  };

  if (loading) return <div>Loading...</div>;
  if (errors.length) return <div>Error...</div>;

  return (
    <div>
      <ul>
        {type === "document" && (
          <li>
            <button onClick={() => handlePick("document")}>Upload Document</button>
          </li>
        )}

        <li>
          <button onClick={() => handlePick("photo")}>Upload Photo</button>
          <input
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: "none" }}
            ref={cameraInputRef}
            onChange={handleCameraCapture}
          />
        </li>

        <li>
          <button onClick={handleSelfieClick}>Take photo with camera</button>
        </li>
      </ul>


      {showCamera && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.9)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <p style={{ color: "white" }}>Move into the frame, check the lighting, then tap the shutter</p>
          <video ref={videoRef} autoPlay playsInline style={{ width: 400, borderRadius: 8 }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={capturePhoto}>Capture</button>
            <button onClick={closeCamera}>Cancel</button>
          </div>
        </div>
      )}

    
      {capturedImage && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.9)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <p style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Review your photo</p>
          <p style={{ color: "#aaa", fontSize: 12, marginBottom: 16 }}>
            Make sure your face is well-lit, clear and your entire face is visible
          </p>


          <div style={{
            width: 280, height: 360,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid white"
          }}>
            <img
              src={capturedImage.previewURL}
              alt="Captured selfie"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={handleSubmit}>Submit selfie</button>
            <button onClick={handleRetake}>Retake selfie</button>
          </div>
        </div>
      )}

      {filesContent.map((file, index) => (
        <div key={index}>
          <h2>{file.name}</h2>
          {file.content.startsWith("data:image") && (
            <img alt={file.name} src={file.content} />
          )}
        </div>
      ))}
    </div>
  );
};

export default FilePicker;