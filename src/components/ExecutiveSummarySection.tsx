import React, { useState } from "react";
import { FileText, CheckCircle2, Copy, Check, Sparkles, Layers } from "lucide-react";
import { AnalysisResult } from "../types/index.ts";

interface ExecutiveSummarySectionProps {
  analysis: AnalysisResult;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({
  analysis,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopyFact = (fact: string, index: number) => {
    navigator.clipboard.writeText(fact);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopySummary = () => {
    if (!analysis.executiveSummary) return;
    navigator.clipboard.writeText(analysis.executiveSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div id="executive-summary-container" className="space-y-6">
      {/* Executive Summary Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f3f4] dark:border-[#303134]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] dark:bg-[#1a2e4c] flex items-center justify-center text-[#1a73e8] dark:text-[#8ab4f8]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
                Executive Synthesis
              </h2>
              <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                Core narrative, claims context, and analytical overview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {analysis.contentType && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f1f3f4] dark:bg-[#303134] text-[#3c4043] dark:text-[#bdc1c6] border border-[#dadce0] dark:border-[#3c4043]">
                {analysis.contentType}
              </span>
            )}
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] bg-white dark:bg-[#282a2d] hover:bg-[#f8f9fa] dark:hover:bg-[#303134] border border-[#dadce0] dark:border-[#3c4043] transition-colors cursor-pointer shadow-2xs"
              title="Copy executive summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#137333] dark:text-[#81c995]" />
                  <span className="text-[#137333] dark:text-[#81c995]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-[#3c4043] dark:text-[#bdc1c6] whitespace-pre-line font-normal bg-[#f8f9fa] dark:bg-[#171819] p-5 sm:p-6 rounded-xl border border-[#edf0f2] dark:border-[#282a2d]">
          {analysis.executiveSummary}
        </div>
      </div>

      {/* Key Empirical Facts Card */}
      {analysis.keyFacts && analysis.keyFacts.length > 0 && (
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f4] dark:border-[#303134]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f4ea] dark:bg-[#133824] flex items-center justify-center text-[#137333] dark:text-[#81c995]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
                  Key Facts & Empirical Anchors
                </h3>
                <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                  {analysis.keyFacts.length} core factual assertions and metric data points stated in the source
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.keyFacts.map((fact, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#282a2d]/60 border border-[#e8eaed] dark:border-[#3c4043] flex items-start justify-between gap-3 group hover:border-[#dadce0] dark:hover:border-[#5f6368] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-[#202124] dark:text-[#e8eaed] leading-relaxed font-normal">
                    {fact}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyFact(fact, index)}
                  className="p-1.5 rounded-md text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#e8eaed] dark:hover:bg-[#3c4043] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                  title="Copy fact"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-[#137333] dark:text-[#81c995]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
