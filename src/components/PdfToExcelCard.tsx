
import React, { useRef, useState } from "react";
import { Upload, FileText, Settings, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadedFilePreview from "./UploadedFilePreview";
import ConvertResultArea from "./ConvertResultArea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const I18N = {
  de: {
    appTitle: "KDH LV-App",
    uploadLabel: "PDF hier klicken oder ziehen",
    uploadSubLabel: "Max 10MB • Nur PDF",
    aiModel: "KI-Modell",
    modelSettings: "KI-Modell-Einstellungen",
    instructions: "Anweisungen",
    instrPlaceholder: "Beschreiben Sie, wie die KI die Daten extrahieren oder organisieren soll...",
    btnConvert: "In Excel umwandeln",
    btnConverting: "Umwandeln...",
    settingsTitle: "Einstellungen",
    settingsDesc: "Legen Sie Zugangsdaten und andere Informationen für das ausgewählte KI-Modell fest.",
    close: "Schließen",
    selectModel: "KI-Modell auswählen",
    setCredNotice: "Anmeldedaten werden nur in Ihrem Browser verwendet und nirgendwohin gesendet, es sei denn, Sie verwenden das Modell.",
    fieldApiKey: "API-Schlüssel",
    fieldOrgId: "Organisations-ID (optional)",
    convComplete: "Umwandlung abgeschlossen!",
    download: "Excel-Datei herunterladen",
    remove: "Entfernen",
    pleaseSelectModel: "Bitte wählen Sie zuerst ein KI-Modell aus.",
    openaiKeyPH: "sk-...",
    openaiOrgPH: "org-...",
    perplexityKeyPH: "pk-...",
    claudeKeyPH: "...",
    geminiKeyPH: "AIza...",
  },
  en: {
    appTitle: "KDH LV-App",
    uploadLabel: "Click or drag PDF here",
    uploadSubLabel: "Max 10MB • PDF only",
    aiModel: "AI Model",
    modelSettings: "AI Model settings",
    instructions: "Instructions",
    instrPlaceholder: "Describe how you'd like the AI to extract or organize the data...",
    btnConvert: "Convert to Excel",
    btnConverting: "Converting...",
    settingsTitle: "Settings",
    settingsDesc: "Set credentials and other info for the selected AI model.",
    close: "Close",
    selectModel: "Select AI model",
    setCredNotice: "Credentials are used only in your browser and are not sent anywhere unless you use the model.",
    fieldApiKey: "API Key",
    fieldOrgId: "Organization ID (optional)",
    convComplete: "Conversion complete!",
    download: "Download Excel File",
    remove: "Remove",
    pleaseSelectModel: "Please select an AI model first.",
    openaiKeyPH: "sk-...",
    openaiOrgPH: "org-...",
    perplexityKeyPH: "pk-...",
    claudeKeyPH: "...",
    geminiKeyPH: "AIza...",
  },
  ru: {
    appTitle: "KDH LV-App",
    uploadLabel: "Нажмите или перетащите PDF сюда",
    uploadSubLabel: "Макс 10MB • Только PDF",
    aiModel: "Модель ИИ",
    modelSettings: "Настройки Модели ИИ",
    instructions: "Инструкции",
    instrPlaceholder: "Опишите, как вы хотите, чтобы ИИ извлек или организовал данные...",
    btnConvert: "Преобразовать в Excel",
    btnConverting: "Преобразование...",
    settingsTitle: "Настройки",
    settingsDesc: "Укажите учетные данные и другую информацию для выбранной модели ИИ.",
    close: "Закрыть",
    selectModel: "Выберите модель ИИ",
    setCredNotice: "Учетные данные используются только в вашем браузере и не передаются, если вы не используете модель.",
    fieldApiKey: "API Ключ",
    fieldOrgId: "ID Организации (необязательно)",
    convComplete: "Преобразование завершено!",
    download: "Скачать Excel-файл",
    remove: "Удалить",
    pleaseSelectModel: "Пожалуйста, сначала выберите модель ИИ.",
    openaiKeyPH: "sk-...",
    openaiOrgPH: "org-...",
    perplexityKeyPH: "pk-...",
    claudeKeyPH: "...",
    geminiKeyPH: "AIza...",
  },
  zh: {
    appTitle: "KDH LV-App",
    uploadLabel: "点击或拖拽PDF至此",
    uploadSubLabel: "最大10MB • 仅限PDF",
    aiModel: "AI模型",
    modelSettings: "AI模型设置",
    instructions: "说明",
    instrPlaceholder: "描述你希望AI如何提取或整理数据...",
    btnConvert: "转换为Excel",
    btnConverting: "正在转换...",
    settingsTitle: "设置",
    settingsDesc: "为所选AI模型设置凭据和其它信息。",
    close: "关闭",
    selectModel: "选择AI模型",
    setCredNotice: "凭据仅在您的浏览器中使用，除非您使用该模型，否则不会发送到其他地方。",
    fieldApiKey: "API密钥",
    fieldOrgId: "组织ID（可选）",
    convComplete: "转换完成！",
    download: "下载Excel文件",
    remove: "移除",
    pleaseSelectModel: "请先选择AI模型。",
    openaiKeyPH: "sk-...",
    openaiOrgPH: "org-...",
    perplexityKeyPH: "pk-...",
    claudeKeyPH: "...",
    geminiKeyPH: "AIza...",
  },
};

const LANGUAGES = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
];

const AI_MODELS = [
  { label: "OpenAI GPT-4o", value: "gpt-4o", type: "openai" },
  { label: "Perplexity Llama-3", value: "llama-3", type: "perplexity" },
  { label: "Claude 3 Sonnet", value: "claude-3-sonnet", type: "claude" },
  { label: "Gemini 1.5 Pro", value: "gemini-1-5-pro", type: "gemini" },
];

type ModelType = "openai" | "perplexity" | "claude" | "gemini";

type ModelSettings = {
  [key: string]: {
    apiKey?: string;
    orgId?: string;
    [key: string]: string | undefined;
  };
};

const PdfToExcelCard: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [aiModel, setAiModel] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [excelLink, setExcelLink] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [modelSettings, setModelSettings] = useState<ModelSettings>({});
  const [lang, setLang] = useState<keyof typeof I18N>("de");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const t = I18N[lang];

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

  const handleSettingsChange = (field: string, value: string) => {
    if (!aiModel) return;
    setModelSettings((prev) => ({
      ...prev,
      [aiModel]: {
        ...prev[aiModel],
        [field]: value,
      },
    }));
  };

  const onConvert = () => {
    setIsConverting(true);
    setTimeout(() => {
      setExcelLink("https://example.com/fake-converted-file.xlsx");
      setIsConverting(false);
    }, 2000);
  };

  const canConvert = pdfFile && aiModel && instructions.trim().length > 0 && !isConverting;

  const currentModel = AI_MODELS.find((m) => m.value === aiModel);

  // Show the correct settings fields per model type
  const renderSettingsFields = () => {
    if (!aiModel) {
      return (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center text-gray-500 text-sm">
          {t.pleaseSelectModel}
        </div>
      );
    }
    const modelType = currentModel?.type as ModelType;
    const values = modelSettings[aiModel] || {};

    switch (modelType) {
      case "openai":
        return (
          <div className="flex flex-col gap-3">
            <label className="block text-xs text-gray-500">{t.fieldApiKey}</label>
            <Input
              type="text"
              placeholder={t.openaiKeyPH}
              value={values.apiKey || ""}
              onChange={(e) => handleSettingsChange("apiKey", e.target.value)}
            />
            <label className="block text-xs text-gray-500">{t.fieldOrgId}</label>
            <Input
              type="text"
              placeholder={t.openaiOrgPH}
              value={values.orgId || ""}
              onChange={(e) => handleSettingsChange("orgId", e.target.value)}
            />
          </div>
        );
      case "perplexity":
        return (
          <div className="flex flex-col gap-3">
            <label className="block text-xs text-gray-500">{t.fieldApiKey}</label>
            <Input
              type="text"
              placeholder={t.perplexityKeyPH}
              value={values.apiKey || ""}
              onChange={(e) => handleSettingsChange("apiKey", e.target.value)}
            />
          </div>
        );
      case "claude":
        return (
          <div className="flex flex-col gap-3">
            <label className="block text-xs text-gray-500">{t.fieldApiKey}</label>
            <Input
              type="text"
              placeholder={t.claudeKeyPH}
              value={values.apiKey || ""}
              onChange={(e) => handleSettingsChange("apiKey", e.target.value)}
            />
          </div>
        );
      case "gemini":
        return (
          <div className="flex flex-col gap-3">
            <label className="block text-xs text-gray-500">{t.fieldApiKey}</label>
            <Input
              type="text"
              placeholder={t.geminiKeyPH}
              value={values.apiKey || ""}
              onChange={(e) => handleSettingsChange("apiKey", e.target.value)}
            />
          </div>
        );
      default:
        return <div>No configurable settings for this model.</div>;
    }
  };

  return (
    <div className="w-full max-w-md shadow-2xl rounded-3xl bg-white px-7 py-8 animate-fade-in flex flex-col gap-5">
      {/* LANGUAGE SELECTOR */}
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-[#7E69AB]" />
          <Select value={lang} onValueChange={(v) => setLang(v as keyof typeof I18N)}>
            <SelectTrigger className="w-28 h-7 px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="bottom" align="end" className="bg-white">
              {LANGUAGES.map(l => (
                <SelectItem key={l.code} value={l.code}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2 text-[#9b87f5] tracking-tight">{t.appTitle}</h1>

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
            <span className="font-semibold text-[#8E9196]">{t.uploadLabel}</span>
            <span className="text-xs text-gray-400 mt-1">{t.uploadSubLabel}</span>
          </div>
        </label>
      )}

      {/* MODEL SELECT with settings */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#6E59A5]">{t.aiModel}</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.selectModel} />
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
            title={t.modelSettings}
            onClick={() => setSettingsOpen(true)}
            disabled={!aiModel}
            aria-label={t.modelSettings}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        {/* Settings dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentModel ? `${currentModel.label} ${t.settingsTitle}` : t.modelSettings}
              </DialogTitle>
              <DialogDescription>
                {t.settingsDesc}
                <br />
                <span className="text-xs text-gray-500">
                  {t.setCredNotice}
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex flex-col gap-2">
              {renderSettingsFields()}
            </div>
            <DialogClose asChild>
              <Button className="mt-6 w-full" variant="outline">
                {t.close}
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      {/* INSTRUCTIONS */}
      <div>
        <label className="block mb-1 text-sm font-medium text-[#6E59A5]">{t.instructions}</label>
        <Textarea
          className="resize-none h-24"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={t.instrPlaceholder}
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
            {t.btnConverting}
          </span>
        ) : (
          <>
            <FileText className="inline mr-2 w-5 h-5" /> {t.btnConvert}
          </>
        )}
      </Button>

      {/* RESULT AREA */}
      {/* ConvertResultArea and UploadedFilePreview use their own texts. For brevity, those remain English but can be updated if needed. */}
      <ConvertResultArea excelLink={excelLink} pdfFileName={pdfFile?.name} />
    </div>
  );
};

export default PdfToExcelCard;
