import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileCode,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { UploadedFileState } from "../types/index.ts";

interface DocumentInputProps {
  onAnalyze: (fileState: UploadedFileState | null, textContent: string, notes: string) => void;
  isLoading: boolean;
  loadingStep: string;
  initialPresetContent?: string;
  initialPresetTitle?: string;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
  initialPresetContent,
  initialPresetTitle,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");
  const [fileState, setFileState] = useState<UploadedFileState | null>(null);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [rawText, setRawText] = useState<string>(initialPresetContent || "");
  const [researcherNotes, setResearcherNotes] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if initialPresetContent changes
  React.useEffect(() => {
    if (initialPresetContent) {
      setRawText(initialPresetContent);
      setActiveTab("text");
      setFileState(null);
    }
  }, [initialPresetContent]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setInputError(null);
    const validMimes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
      "text/plain",
      "text/markdown",
      "application/json",
      "text/csv",
    ];

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");
    const isText =
      file.type.startsWith("text/") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".json") ||
      file.name.endsWith(".csv");

    if (!isPdf && !isImage && !isText && !validMimes.includes(file.type)) {
      setInputError("Unsupported file type. Please upload a PDF, image (PNG/JPG/WEBP), or text document.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setInputError("File size exceeds 25MB limit. Please upload a smaller file.");
      return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();

    if (isText) {
      reader.onload = (e) => {
        setIsReadingFile(false);
        const textResult = (e.target?.result as string) || "";
        setFileState({
          file,
          name: file.name,
          size: file.size,
          type: file.type || "text/plain",
        });
        setRawText(textResult);
      };
      reader.onerror = () => {
        setIsReadingFile(false);
        setInputError("Failed to read the file. Please try again.");
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        setIsReadingFile(false);
        const dataUrl = (e.target?.result as string) || "";
        const parts = dataUrl.split(",");
        const base64Data = parts.length > 1 ? parts[1] : "";
        const inferredType =
          file.type ||
          (isPdf ? "application/pdf" : isImage ? "image/jpeg" : "application/octet-stream");

        setFileState({
          file,
          name: file.name,
          size: file.size,
          type: inferredType,
          base64: base64Data,
          previewUrl: isImage ? dataUrl : undefined,
        });
      };
      reader.onerror = () => {
        setIsReadingFile(false);
        setInputError("Failed to read the binary file data. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFileState(null);
    setInputError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleStartAnalysis = () => {
    setInputError(null);
    if (isReadingFile) {
      setInputError("Please wait for the file to finish reading.");
      return;
    }
    if (activeTab === "upload" && !fileState && !rawText.trim()) {
      setInputError("Please select a PDF/image file or switch to Paste Text tab before analyzing.");
      return;
    }
    if (activeTab === "text" && !rawText.trim()) {
      setInputError("Please enter or paste the text content to analyze.");
      return;
    }

    onAnalyze(fileState, rawText, researcherNotes);
  };

  return (
    <div
      id="document-input-container"
      className="max-w-4xl mx-auto bg-white dark:bg-[#1e1f23] rounded-2xl border border-[#dadce0] dark:border-[#3c4043] shadow-xs overflow-hidden mb-12"
    >
      {/* Header & Segmented Tabs */}
      <div className="p-6 border-b border-[#dadce0] dark:border-[#3c4043] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#f8fafd] dark:bg-[#1a1b1e]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#202124] dark:text-[#f1f3f4] tracking-tight">
            Source Material Input
          </h2>
          <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
            Ingest research publications, technical memos, or raw text for automated claim extraction.
          </p>
        </div>

        {/* Input Mode Segmented Button */}
        <div className="flex items-center p-1 bg-[#f1f3f4] dark:bg-[#282a2d] rounded-full border border-[#dadce0] dark:border-[#3c4043] text-xs font-semibold">
          <button
            id="tab-upload-btn"
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-white dark:bg-[#1e1f23] text-[#1a73e8] dark:text-[#8ab4f8] shadow-xs font-bold"
                : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#f1f3f4]"
            }`}
          >
            Upload Document (PDF / Image)
          </button>
          <button
            id="tab-text-btn"
            onClick={() => setActiveTab("text")}
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === "text"
                ? "bg-white dark:bg-[#1e1f23] text-[#1a73e8] dark:text-[#8ab4f8] shadow-xs font-bold"
                : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#f1f3f4]"
            }`}
          >
            Paste Text / Markdown
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-7 space-y-6">
        {inputError && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#fce8e6] dark:bg-[#371e1e] border border-[#fad2cf] dark:border-[#5c2b29] text-xs text-[#c5221f] dark:text-[#f28b82]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{inputError}</span>
          </div>
        )}

        {/* Tab 1: Upload Dropzone */}
        {activeTab === "upload" && (
          <div>
            {!fileState ? (
              <div
                id="file-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#1a73e8] bg-[#e8f0fe]/60 dark:border-[#8ab4f8] dark:bg-[#1e293b]/60"
                    : "border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8] dark:hover:border-[#8ab4f8] bg-[#f8fafd] dark:bg-[#18191c]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,image/png,image/jpeg,image/webp,.txt,.md,.json,.csv"
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-[#e8f0fe] dark:bg-[#1e293b] flex items-center justify-center text-[#1a73e8] dark:text-[#8ab4f8] mb-3 border border-[#d2e3fc] dark:border-[#2b3a55]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-[#202124] dark:text-[#f1f3f4] mb-1">
                  Drag and drop research document, or click to browse
                </h3>
                <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] max-w-md mx-auto mb-4">
                  Supports PDF publications, reports, image charts (PNG, JPG, WEBP), and markdown files (up to 25MB).
                </p>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-[#282a2d] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#dadce0] dark:border-[#3c4043] shadow-xs">
                  <FolderOpen className="w-3.5 h-3.5" />
                  Select Local File
                </span>
              </div>
            ) : (
              /* Selected File Card */
              <div className="p-4 rounded-xl bg-[#f8fafd] dark:bg-[#18191c] border border-[#dadce0] dark:border-[#3c4043]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] dark:bg-[#1e293b] flex items-center justify-center text-[#1a73e8] dark:text-[#8ab4f8] shrink-0 border border-[#d2e3fc] dark:border-[#2b3a55]">
                      {fileState.type.includes("pdf") ? (
                        <FileCheck className="w-5 h-5 text-[#c5221f] dark:text-[#f28b82]" />
                      ) : fileState.type.startsWith("image/") ? (
                        <ImageIcon className="w-5 h-5 text-[#1a73e8] dark:text-[#8ab4f8]" />
                      ) : (
                        <FileCode className="w-5 h-5 text-[#137333] dark:text-[#81c995]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#202124] dark:text-[#f1f3f4] line-clamp-1">
                        {fileState.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
                        <span className="uppercase font-semibold text-[11px] px-1.5 py-0.2 bg-[#f1f3f4] dark:bg-[#282a2d] rounded">
                          {fileState.type.split("/")[1] || "DOC"}
                        </span>
                        <span>•</span>
                        <span>{formatFileSize(fileState.size)}</span>
                        <span>•</span>
                        <span className="text-[#137333] dark:text-[#81c995] flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Analysis
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    id="clear-file-btn"
                    onClick={handleClearFile}
                    className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] dark:hover:text-[#f1f3f4] hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Thumbnail for images */}
                {fileState.previewUrl && (
                  <div className="mt-4 pt-3 border-t border-[#dadce0] dark:border-[#3c4043]">
                    <p className="text-xs font-semibold text-[#5f6368] dark:text-[#9aa0a6] mb-2">
                      Image Preview:
                    </p>
                    <div className="max-h-48 rounded-xl overflow-hidden border border-[#dadce0] dark:border-[#3c4043] inline-block bg-[#202124]">
                      <img
                        src={fileState.previewUrl}
                        alt="Preview"
                        className="max-h-48 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Raw Text / Markdown */}
        {activeTab === "text" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="text-input-field"
                className="text-xs font-bold text-[#202124] dark:text-[#e8eaed]"
              >
                {initialPresetTitle ? `Preset: ${initialPresetTitle}` : "Document Content / Plain Text"}
              </label>
              <span className="text-[11px] font-mono text-[#5f6368] dark:text-[#9aa0a6]">
                {rawText.length.toLocaleString()} characters
              </span>
            </div>
            <textarea
              id="text-input-field"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste article, technical whitepaper, meeting notes, research claims, or press release text here..."
              rows={9}
              className="w-full p-4 text-xs font-mono leading-relaxed rounded-xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#18191c] text-[#202124] dark:text-[#f1f3f4] placeholder-[#80868b] focus:outline-hidden focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all"
            />
          </div>
        )}

        {/* Optional Research Focus Notes */}
        <div>
          <label
            htmlFor="researcher-notes-field"
            className="block text-xs font-bold text-[#202124] dark:text-[#e8eaed] mb-1.5"
          >
            Optional: Research Focus or Custom Questions
          </label>
          <input
            id="researcher-notes-field"
            type="text"
            value={researcherNotes}
            onChange={(e) => setResearcherNotes(e.target.value)}
            placeholder="e.g. 'Scrutinize the 1,200 Wh/kg claim and verify manufacturing readiness'"
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#18191c] text-[#202124] dark:text-[#f1f3f4] placeholder-[#80868b] focus:outline-hidden focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 transition-all"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#5f6368] dark:text-[#9aa0a6] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" />
            <span>Gemini 3.7 Flash multimodal extraction pipeline</span>
          </div>

          <button
            id="analyze-with-gemini-btn"
            onClick={handleStartAnalysis}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{loadingStep || "Analyzing with Gemini..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

