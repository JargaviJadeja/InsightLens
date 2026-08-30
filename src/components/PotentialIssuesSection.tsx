import React, { useState } from "react";
import { AlertCircle, Filter, CheckCircle2, Quote, Lightbulb } from "lucide-react";
import { IssueItem } from "../types/index.ts";

interface PotentialIssuesSectionProps {
  issues: IssueItem[];
}

export const PotentialIssuesSection: React.FC<PotentialIssuesSectionProps> = ({
  issues,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const filteredIssues = issues.filter((issue) => {
    if (selectedSeverity === "all") return true;
    return issue.severity === selectedSeverity;
  });

  const getSeverityBadge = (severity: IssueItem["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-[#fce8e6] dark:bg-[#3c1e1e] text-[#c5221f] dark:text-[#f28b82] border-[#f28b82] dark:border-[#5c2b29]";
      case "medium":
        return "bg-[#fef7e0] dark:bg-[#332b00] text-[#b06000] dark:text-[#fdd663] border-[#fdd663] dark:border-[#594a00]";
      case "low":
      default:
        return "bg-[#f1f3f4] dark:bg-[#303134] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043]";
    }
  };

  const getTypeBadge = (type: IssueItem["type"]) => {
    switch (type) {
      case "contradiction":
        return "bg-[#f3e8fd] dark:bg-[#301c41] text-[#8430ce] dark:text-[#d7aefb] border-[#d7aefb] dark:border-[#532b79]";
      case "unsupported":
        return "bg-[#fce8e6] dark:bg-[#3c1e1e] text-[#c5221f] dark:text-[#f28b82] border-[#f28b82] dark:border-[#5c2b29]";
      case "ambiguity":
        return "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border-[#8ab4f8] dark:border-[#174ea6]";
      case "suspicious":
        return "bg-[#fef7e0] dark:bg-[#332b00] text-[#b06000] dark:text-[#fdd663] border-[#fdd663] dark:border-[#594a00]";
      case "outdated":
      default:
        return "bg-[#f1f3f4] dark:bg-[#303134] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043]";
    }
  };

  return (
    <div id="potential-issues-container" className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f3f4] dark:border-[#303134]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fce8e6] dark:bg-[#3c1e1e] flex items-center justify-center text-[#c5221f] dark:text-[#f28b82]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
                Potential Issues & Methodological Red Flags
              </h2>
              <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                {filteredIssues.length} of {issues.length} identified methodological vulnerabilities, ambiguities, or contradictions
              </span>
            </div>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Severity:
            </span>
            {["all", "high", "medium", "low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedSeverity === sev
                    ? "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#1a73e8]/30 dark:border-[#8ab4f8]/30 font-semibold"
                    : "bg-[#f1f3f4] dark:bg-[#282a2d] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#e8eaed] dark:hover:bg-[#3c4043]"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredIssues.length === 0 && (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#137333] dark:text-[#81c995] mx-auto" />
            <p className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">
              No issues found matching selected filter.
            </p>
          </div>
        )}

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.map((issue, idx) => (
            <div
              key={issue.id || idx}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] hover:border-[#bdc1c6] dark:hover:border-[#5f6368] transition-all space-y-3.5 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#f1f3f4] dark:bg-[#303134] text-[#3c4043] dark:text-[#bdc1c6] text-xs font-bold flex items-center justify-center tabular-nums">
                    #{idx + 1}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${getTypeBadge(
                      issue.type
                    )}`}
                  >
                    {issue.type}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${getSeverityBadge(
                      issue.severity
                    )}`}
                  >
                    {issue.severity} Severity
                  </span>
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#e8eaed] leading-snug">
                {issue.title}
              </h4>

              <p className="text-xs sm:text-sm text-[#3c4043] dark:text-[#bdc1c6] leading-relaxed">
                {issue.description}
              </p>

              {issue.excerpt && (
                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#171819] border border-[#e8eaed] dark:border-[#282a2d] text-xs text-[#5f6368] dark:text-[#9aa0a6] flex items-start gap-2.5 italic">
                  <Quote className="w-3.5 h-3.5 text-[#80868b] shrink-0 not-italic mt-0.5" />
                  <div>
                    <span className="font-semibold not-italic text-[#3c4043] dark:text-[#bdc1c6]">
                      Source Excerpt:{" "}
                    </span>
                    <span>"{issue.excerpt}"</span>
                  </div>
                </div>
              )}

              {issue.recommendation && (
                <div className="p-3.5 rounded-xl bg-[#e8f0fe]/60 dark:bg-[#1a2e4c]/40 border border-[#d2e3fc] dark:border-[#174ea6]/60 text-xs text-[#185abc] dark:text-[#8ab4f8] flex items-start gap-2.5 leading-relaxed">
                  <Lightbulb className="w-4 h-4 text-[#1a73e8] dark:text-[#8ab4f8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#174ea6] dark:text-[#a8c7fa]">Analyst Recommendation: </span>
                    <span>{issue.recommendation}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
