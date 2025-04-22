
import React, { useRef, useState } from "react";
import { Upload, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadedFilePreview from "./UploadedFilePreview";
import ConvertResultArea from "./ConvertResultArea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

const AI_MODELS = [
  { label: "OpenAI GPT-4o", value: "gpt-4o" },
  { label: "Perplexity Llama-3", value: "llama-3" },
  { label: "Claude 3 Sonnet", value: "claude-3-sonnet" },
  { label: "Gemini 1.5 Pro", value: "gemini-1-5-pro" },
];

const PdfToExcelCard: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [aiModel, setAiModel] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [excelLink, setExcelLink] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") setPdfFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") setPdfFile(file);
    }
  };

  const handleCardClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPdfFile(null);
    setExcelLink("");
  };

  const onConvert = () => {
    setIsConverting(true);
    // Simulate async processing and output link (stub)
    setTimeout(() => {
      setExcelLink("https://example.com/fake-converted-file.xlsx");
      setIsConverting(false);
    }, 2000);
  };

  const canConvert = pdfFile && aiModel && instructions.trim().length > 0 && !isConverting;

  const currentModel = AI_MODELS.find((m) => m.value === aiModel);

  return (
    <div className="w-full max-w-md shadow-2xl rounded-3xl bg-white px-7 py-8 animate-fade-in flex flex-col gap-5">
      <h1 className="text-3xl font-bold text-center mb-2 text-[#9b87f5] tracking-tight">KDH LV-App</h1>

      {/* PDF UPLOAD */}
      {pdfFile ? (
        <UploadedFilePreview file={pdfFile} onRemove={handleRemove} />
      ) : (
        <label
          className="relative w-full border-2 border-dashed border-[#9b87f5] rounded-xl flex items-center justify-center h-36 cursor-pointer hover:bg-[#f4f0ff] transition group"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleCardClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center text-center">
            <Upload className="w-10 h-10 text-[#9b87f5] mb-2 group-hover:scale-110 transition" />
            <span className="font-semibold text-[#8E9196]">Click or drag PDF here</span>
            <span className="text-xs text-gray-400 mt-1">Max 10MB • PDF only</span>
          </div>
        </label>
      )}

      {/* MODEL SELECT with settings */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#6E59A5]">AI Model</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent className="z-20 bg-white">
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-[#9b87f5] hover:bg-[#f4f0ff] ml-1"
            title="AI Model settings"
            onClick={() => setSettingsOpen(true)}
            disabled={!aiModel}
            aria-label="AI Model settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        {/* Settings dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentModel ? `${currentModel.label} Settings` : "AI Model Settings"}
              </DialogTitle>
              <DialogDescription>
                Here you can configure settings for the selected AI model.<br />
                <span className="text-xs text-gray-500">
                  (Settings placeholder)
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col gap-2">
              {/* Placeholder area for future settings */}
              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center text-gray-500 text-sm">
                No configurable settings for this model yet.
              </div>
            </div>
            <DialogClose asChild>
              <Button className="mt-6 w-full" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      {/* INSTRUCTIONS */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#6E59A5]">Instructions</label>
        <Textarea
          className="resize-none h-24"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Describe how you'd like the AI to extract or organize the data..."
        />
      </div>

      {/* CONVERT BUTTON */}
      <Button
        type="button"
        className="w-full mt-2 bg-[#9b87f5] text-white font-semibold text-lg py-2 rounded-lg shadow hover:bg-[#7E69AB] transition-all"
        disabled={!canConvert}
        onClick={onConvert}
      >
        {isConverting ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Converting...
          </span>
        ) : (
          <>
            <FileText className="inline mr-2 w-5 h-5" /> Convert to Excel
          </>
        )}
      </Button>

      {/* RESULT AREA */}
      <ConvertResultArea excelLink={excelLink} pdfFileName={pdfFile?.name} />
    </div>
  );
};

export default PdfToExcelCard;
