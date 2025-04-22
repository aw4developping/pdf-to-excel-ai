
import React from "react";
import { FileText, Upload } from "lucide-react";

const UploadedFilePreview: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
  return (
    <div className="w-full flex items-center gap-4 px-4 py-3 border rounded-xl bg-[#f4f0ff]">
      <FileText className="w-7 h-7 text-[#7E69AB]" />
      <div className="flex-1 flex flex-col truncate">
        <span className="font-medium truncate">{file.name}</span>
        <span className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
      </div>
      <button
        className="text-[#9b87f5] font-bold rounded px-3 py-1 text-sm hover:bg-[#e5deff] transition"
        type="button"
        onClick={onRemove}
        aria-label="Remove file"
      >
        Remove
      </button>
    </div>
  );
};

export default UploadedFilePreview;
