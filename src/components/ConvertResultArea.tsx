
import React from "react";
import { FileText, Upload } from "lucide-react";

interface Props {
  excelLink: string;
  pdfFileName?: string;
}

const ConvertResultArea: React.FC<Props> = ({ excelLink, pdfFileName }) => {
  if (!excelLink) return null;

  return (
    <div className="w-full mt-3 p-4 rounded-md bg-[#F2FCE2] border border-[#D6BCFA] flex flex-col items-center animate-fade-in">
      <div className="flex items-center gap-2 text-[#1A1F2C] font-semibold">
        <FileText className="w-6 h-6" />
        <span>Conversion complete!</span>
      </div>
      <a
        href={excelLink}
        download={pdfFileName ? pdfFileName.replace(/\.pdf$/i, ".xlsx") : "converted.xlsx"}
        className="mt-3 bg-[#9b87f5] px-5 py-2 rounded-lg shadow text-white font-semibold hover:bg-[#7E69AB] transition"
      >
        Download Excel File
      </a>
    </div>
  );
};

export default ConvertResultArea;
