import FilePicker from "./dialogue";

const FileDialogue = ({ onClose, type, onUploadSuccess, customerId }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            {type === "document" ? "Upload Proof of Residence" : "Upload Selfie"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition text-xl font-light"
          >
            ✕
          </button>
        </div>

        <FilePicker
          type={type}
          onUploadSuccess={onUploadSuccess}
          customerId={customerId}
        />

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default FileDialogue;