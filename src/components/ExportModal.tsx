import React, { useState } from "react";
import { X, Download, Copy, Check, FileJson, FileText } from "lucide-react";
import { AnalysisResult, VerificationResult } from "../types/index.ts";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
  verificationResults: Record<string, VerificationResult>;
  documentName?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  verificationResults,
  documentName,
}) => {
  const [exportFormat, setExportFormat] = useState<"markdown" | "json">("markdown");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = (): string => {
    let md = `# InsightLens Analysis Dossier: ${documentName || "Analyzed Material"}\n`;
    md += `*Generated on: ${new Date().toLocaleString()} | Powered by Google Gemini*\n\n`;

    md += `## Executive Summary\n${analysis.executiveSummary}\n\n`;

    if (analysis.keyFacts && analysis.keyFacts.length > 0) {
      md += `## Key Facts\n`;
      analysis.keyFacts.forEach((f, i) => {
        md += `${i + 1}. ${f}\n`;
      });
      md += `\n`;
    }

    if (analysis.mainClaims && analysis.mainClaims.length > 0) {
      md += `## Main Claims\n`;
      analysis.mainClaims.forEach((c) => {
        md += `- **[${c.importance.toUpperCase()} / ${c.category}]**: ${c.claim}\n`;
        if (c.context) md += `  - *Context:* ${c.context}\n`;
      });
      md += `\n`;
    }

    if (analysis.challengeClaims && analysis.challengeClaims.length > 0) {
      md += `## Challenge Mode: Claims Under Scrutiny\n`;
      analysis.challengeClaims.forEach((cc, i) => {
        const v = verificationResults[cc.id];
        md += `### ${i + 1}. "${cc.claim}"\n`;
        md += `- **Challenge Category:** ${cc.challengeCategory}\n`;
        md += `- **Reason for Scrutiny:** ${cc.reason}\n`;
        md += `- **Status:** ${v ? v.status : cc.initialStatus}\n`;
        if (v) {
          md += `- **Confidence:** ${v.confidence}\n`;
          md += `- **Verification Summary:** ${v.summary}\n`;
          if (v.supportingEvidence.length > 0) {
            md += `- **Supporting Evidence:**\n`;
            v.supportingEvidence.forEach((pt) => (md += `  - ${pt}\n`));
          }
          if (v.contradictingEvidence.length > 0) {
            md += `- **Contradicting/Cautionary Evidence:**\n`;
            v.contradictingEvidence.forEach((pt) => (md += `  - ${pt}\n`));
          }
          if (v.sources.length > 0) {
            md += `- **Sources:**\n`;
            v.sources.forEach((s) => (md += `  - [${s.title}](${s.uri})\n`));
          }
        }
        md += `\n`;
      });
    }

    if (analysis.potentialIssues && analysis.potentialIssues.length > 0) {
      md += `## Potential Issues & Concerns\n`;
      analysis.potentialIssues.forEach((issue) => {
        md += `- **${issue.title}** (${issue.severity.toUpperCase()} severity, ${issue.type}): ${issue.description}\n`;
        if (issue.excerpt) md += `  - *Excerpt:* "${issue.excerpt}"\n`;
        if (issue.recommendation) md += `  - *Recommendation:* ${issue.recommendation}\n`;
      });
      md += `\n`;
    }

    if (analysis.keyEntities && analysis.keyEntities.length > 0) {
      md += `## Key Entities\n`;
      analysis.keyEntities.forEach((e) => {
        md += `- **${e.name}** (${e.type}): ${e.description}\n`;
      });
      md += `\n`;
    }

    if (analysis.investigationQuestions && analysis.investigationQuestions.length > 0) {
      md += `## Strategic Investigation Questions\n`;
      analysis.investigationQuestions.forEach((q, i) => {
        md += `${i + 1}. **${q.question}**\n   - *Rationale:* ${q.rationale}\n   - *Search Query:* \`${q.suggestedSearchQuery}\`\n`;
      });
      md += `\n`;
    }

    return md;
  };

  const generateJsonReport = (): string => {
    const data = {
      title: documentName || "InsightLens Analysis",
      generatedAt: new Date().toISOString(),
      analysis,
      verificationResults,
    };
    return JSON.stringify(data, null, 2);
  };

  const contentToExport = exportFormat === "markdown" ? generateMarkdownReport() : generateJsonReport();

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToExport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = exportFormat === "markdown" ? "md" : "json";
    const mime = exportFormat === "markdown" ? "text/markdown" : "application/json";
    const blob = new Blob([contentToExport], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insightlens-analysis-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e1f20] rounded-2xl border border-[#dadce0] dark:border-[#3c4043] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#f1f3f4] dark:border-[#303134] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#202124] dark:text-[#e8eaed]">
              Export Analysis Dossier
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
              Download or copy the structured report and grounded evidence
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#e8eaed] hover:bg-[#f1f3f4] dark:hover:bg-[#303134] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-4 border-b border-[#f1f3f4] dark:border-[#303134] flex items-center gap-3 bg-[#f8f9fa] dark:bg-[#171819]">
          <span className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6]">Format:</span>
          <button
            onClick={() => setExportFormat("markdown")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              exportFormat === "markdown"
                ? "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#1a73e8]/30 dark:border-[#8ab4f8]/30 font-semibold"
                : "bg-white dark:bg-[#282a2d] text-[#5f6368] dark:text-[#9aa0a6] border border-[#dadce0] dark:border-[#3c4043]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Markdown (.md)
          </button>
          <button
            onClick={() => setExportFormat("json")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              exportFormat === "json"
                ? "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#1a73e8]/30 dark:border-[#8ab4f8]/30 font-semibold"
                : "bg-white dark:bg-[#282a2d] text-[#5f6368] dark:text-[#9aa0a6] border border-[#dadce0] dark:border-[#3c4043]"
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            JSON (.json)
          </button>
        </div>

        {/* Code Preview */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#f8f9fa] dark:bg-[#171819] font-mono text-xs text-[#202124] dark:text-[#e8eaed] whitespace-pre-wrap leading-relaxed border-b border-[#dadce0] dark:border-[#3c4043]">
          {contentToExport}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white dark:bg-[#1e1f20] flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#f1f3f4] hover:bg-[#e8eaed] dark:bg-[#282a2d] dark:hover:bg-[#303134] text-[#3c4043] dark:text-[#e8eaed] border border-[#dadce0] dark:border-[#3c4043] transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#137333] dark:text-[#81c995]" />
            ) : (
              <Copy className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6]" />
            )}
            <span>{copied ? "Copied to Clipboard!" : "Copy Content"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-[#1a73e8] hover:bg-[#1557b0] text-white transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
