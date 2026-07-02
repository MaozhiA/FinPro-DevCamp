import { useState, useRef } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
} from "use-file-picker/validators";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import axios from "axios";

const FilePicker = ({ type, onUploadSuccess, customerId }) => {
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

    return url;
  };
  const handleCameraCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadFile(file, file.name);
    localStorage.setItem(`uploaded_${type}`, "true");
    onUploadSuccess(type); // ← add this
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

    streamRef.current.getTracks().forEach((t) => t.stop());
    setShowCamera(false);

    canvas.toBlob((blob) => {
      const previewURL = URL.createObjectURL(blob);
      setCapturedImage({ blob, previewURL }); // ← store for preview
    }, "image/png");
  };

  const handleSubmit = async () => {
    await uploadFile(capturedImage.blob, `selfie-${Date.now()}.png`);
    URL.revokeObjectURL(capturedImage.previewURL);
    setCapturedImage(null);
    localStorage.setItem(`uploaded_${type}`, "true");
    onUploadSuccess(type);
  };

  const handleRetake = () => {
    URL.revokeObjectURL(capturedImage.previewURL);
    setCapturedImage(null);
    openWebcam();
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
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
      const token = localStorage.getItem("loginAccessKey");
      const base64Content = file.content.split(",")[1];
      const extension = file.name.split(".").pop().toUpperCase();
      const typeMap = { PDF: "PDF", PNG: "PNG", JPG: "JPEG", JPEG: "JPEG" };
      const fileType = typeMap[extension] || "PDF";

      const blob = await fetch(file.content).then((r) => r.blob());
      await uploadFile(blob, file.name);

      try {
        await axios.post(
          `/v1/customer/${customerId}/documents`,
          { document: base64Content, type: fileType },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch (error) {
        console.error("Backend document save failed:", error);
      }

      localStorage.setItem(`uploaded_${type}`, "true");
      onUploadSuccess(type);
    },
  });

  const handlePick = () => {
    setTimeout(() => openFilePicker(), 0);
  };

  if (loading) return <div>Loading...</div>;
  if (errors.length) return <div>Error...</div>;

  return (
    <div className="space-y-3">
      {type === "document" && (
        <button
          onClick={() => handlePick()}
          className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-left"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Upload Document
            </p>
            <p className="text-xs text-slate-500">PDF, DOC up to 10MB</p>
          </div>
        </button>
      )}

      <button
        onClick={() => handlePick()}
        className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-left"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">Upload Photo</p>
          <p className="text-xs text-slate-500">JPG, PNG up to 10MB</p>
        </div>
      </button>

      <input
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
        ref={cameraInputRef}
        onChange={handleCameraCapture}
      />

      <button
        onClick={handleSelfieClick}
        className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-left"
      >
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Take photo with camera
          </p>
          <p className="text-xs text-slate-500">Use your device camera</p>
        </div>
      </button>

      {showCamera && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <p style={{ color: "white" }}>
            Move into the frame, check the lighting, then tap the shutter
          </p>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: 400, borderRadius: 8 }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={capturePhoto}>Capture</button>
            <button onClick={closeCamera}>Cancel</button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <p style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Review your photo
          </p>
          <p style={{ color: "#aaa", fontSize: 12, marginBottom: 16 }}>
            Make sure your face is well-lit, clear and your entire face is
            visible
          </p>

          <div
            style={{
              width: 280,
              height: 360,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid white",
            }}
          >
            <img
              src={capturedImage.previewURL}
              alt="Captured selfie"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
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
