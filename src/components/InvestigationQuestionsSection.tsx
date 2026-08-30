import React, { useState } from "react";
import { HelpCircle, MessageSquare, Lightbulb, Copy, Check, SearchCode } from "lucide-react";
import { InvestigationQuestion } from "../types/index.ts";

interface InvestigationQuestionsSectionProps {
  questions: InvestigationQuestion[];
  onAskQuestionInChat: (questionText: string) => void;
  onVerifySearchQuery: (query: string, rationale: string) => void;
}

export const InvestigationQuestionsSection: React.FC<InvestigationQuestionsSectionProps> = ({
  questions,
  onAskQuestionInChat,
  onVerifySearchQuery,
}) => {
  const [copiedQueryIndex, setCopiedQueryIndex] = useState<number | null>(null);

  const handleCopyQuery = (query: string, index: number) => {
    navigator.clipboard.writeText(query);
    setCopiedQueryIndex(index);
    setTimeout(() => setCopiedQueryIndex(null), 2000);
  };

  return (
    <div id="investigation-questions-container" className="space-y-6">
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f1f3f4] dark:border-[#303134]">
          <div className="w-9 h-9 rounded-xl bg-[#fef7e0] dark:bg-[#332b00] flex items-center justify-center text-[#b06000] dark:text-[#fdd663]">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
              Strategic Investigation Questions
            </h2>
            <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
              {questions.length} targeted research angles to rigorously test methodology, unearth hidden biases, and verify metrics
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-5 sm:p-6 rounded-2xl bg-[#f8f9fa] dark:bg-[#282a2d]/60 border border-[#e8eaed] dark:border-[#3c4043] hover:border-[#dadce0] dark:hover:border-[#5f6368] transition-all flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#e8eaed] dark:bg-[#3c4043] text-[#3c4043] dark:text-[#bdc1c6] text-xs font-bold flex items-center justify-center tabular-nums">
                    #{idx + 1}
                  </span>
                  {q.focusArea && (
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white dark:bg-[#1e1f20] text-[#3c4043] dark:text-[#bdc1c6] border border-[#dadce0] dark:border-[#3c4043] shadow-2xs">
                      {q.focusArea}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#e8eaed] leading-snug">
                  "{q.question}"
                </h4>

                <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed bg-white/80 dark:bg-[#1e1f20]/80 p-3.5 rounded-xl border border-[#edf0f2] dark:border-[#303134]">
                  <span className="font-semibold text-[#202124] dark:text-[#e8eaed]">
                    Investigative Rationale:{" "}
                  </span>
                  {q.rationale}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e8eaed] dark:border-[#3c4043] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5f6368] dark:text-[#9aa0a6] max-w-full truncate">
                  <SearchCode className="w-3.5 h-3.5 text-[#80868b] shrink-0" />
                  <span className="truncate" title={q.suggestedSearchQuery}>
                    {q.suggestedSearchQuery}
                  </span>
                  <button
                    onClick={() => handleCopyQuery(q.suggestedSearchQuery, idx)}
                    className="p-1 text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] rounded cursor-pointer"
                    title="Copy query"
                  >
                    {copiedQueryIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#137333] dark:text-[#81c995]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => onAskQuestionInChat(q.question)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] bg-[#e8f0fe] dark:bg-[#1a2e4c] hover:bg-[#d2e3fc] dark:hover:bg-[#174ea6]/70 rounded-lg border border-[#1a73e8]/20 dark:border-[#8ab4f8]/30 transition-colors cursor-pointer shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" />
                  <span>Investigate with AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
