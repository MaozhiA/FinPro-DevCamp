import FilePicker from "./dialogue";

const FileDialogue = ({ onClose, type, onUploadSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4">
        <FilePicker type={type} onUploadSuccess={onUploadSuccess} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FileDialogue;