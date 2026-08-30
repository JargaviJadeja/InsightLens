import React, { useState } from "react";
import { CheckSquare, Search, Filter, ShieldAlert, ArrowUpRight } from "lucide-react";
import { ClaimItem } from "../types/index.ts";

interface MainClaimsSectionProps {
  claims: ClaimItem[];
  onChallengeClaim: (claimText: string, context?: string) => void;
}

export const MainClaimsSection: React.FC<MainClaimsSectionProps> = ({
  claims,
  onChallengeClaim,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["all", ...Array.from(new Set(claims.map((c) => c.category).filter(Boolean)))];

  const filteredClaims = claims.filter((c) => {
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      c.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.context?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getImportanceBadge = (importance: ClaimItem["importance"]) => {
    switch (importance) {
      case "high":
        return "bg-[#fce8e6] dark:bg-[#3c1e1e] text-[#c5221f] dark:text-[#f28b82] border-[#f28b82] dark:border-[#5c2b29]";
      case "medium":
        return "bg-[#fef7e0] dark:bg-[#332b00] text-[#b06000] dark:text-[#fdd663] border-[#fdd663] dark:border-[#594a00]";
      case "low":
      default:
        return "bg-[#f1f3f4] dark:bg-[#303134] text-[#3c4043] dark:text-[#bdc1c6] border-[#dadce0] dark:border-[#3c4043]";
    }
  };

  return (
    <div id="main-claims-container" className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f3f4] dark:border-[#303134]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] dark:bg-[#1a2e4c] flex items-center justify-center text-[#1a73e8] dark:text-[#8ab4f8]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
                Main Claims Asserted
              </h2>
              <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                {filteredClaims.length} of {claims.length} total core claims parsed from document
              </span>
            </div>
          </div>

          {/* Search filter input */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims or context..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#171819] text-[#202124] dark:text-[#e8eaed] placeholder-[#80868b] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8] dark:focus:ring-[#8ab4f8] focus:bg-white dark:focus:bg-[#1e1f20]"
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#1a73e8]/30 dark:border-[#8ab4f8]/30 font-semibold"
                    : "bg-[#f1f3f4] dark:bg-[#282a2d] text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#e8eaed] dark:hover:bg-[#3c4043]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Claims List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredClaims.map((item, index) => (
          <div
            key={item.id || index}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] hover:border-[#bdc1c6] dark:hover:border-[#5f6368] transition-all space-y-3.5 shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#f1f3f4] dark:bg-[#303134] text-[#3c4043] dark:text-[#bdc1c6] text-xs font-bold flex items-center justify-center tabular-nums">
                  #{index + 1}
                </span>
                {item.category && (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#f1f3f4] dark:bg-[#303134] text-[#5f6368] dark:text-[#9aa0a6] border border-[#dadce0] dark:border-[#3c4043]">
                    {item.category}
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider border ${getImportanceBadge(
                    item.importance
                  )}`}
                >
                  {item.importance} Importance
                </span>
              </div>

              <button
                onClick={() => onChallengeClaim(item.claim, item.context)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#b06000] dark:text-[#fdd663] bg-[#fef7e0] dark:bg-[#332b00]/60 hover:bg-[#feefc3] dark:hover:bg-[#483d00] border border-[#fdd663] dark:border-[#594a00] transition-colors cursor-pointer self-start sm:self-auto"
                title="Send to Challenge Mode with Search Grounding"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#e37400] dark:text-[#fdd663]" />
                <span>Verify in Challenge Mode</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>

            <p className="text-sm sm:text-base font-medium text-[#202124] dark:text-[#e8eaed] leading-relaxed">
              "{item.claim}"
            </p>

            {item.context && (
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed bg-[#f8f9fa] dark:bg-[#171819] p-3.5 rounded-xl border border-[#edf0f2] dark:border-[#282a2d]">
                <span className="font-semibold text-[#3c4043] dark:text-[#bdc1c6]">Analytical Context: </span>
                {item.context}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
