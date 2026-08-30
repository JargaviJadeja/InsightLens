import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Layers,
  SearchCode,
  ShieldCheck,
  RefreshCw,
  Globe,
  Quote,
  Check,
  Copy,
  Clock,
  Scale,
} from "lucide-react";
import { ChallengeClaim, VerificationResult } from "../types/index.ts";

interface ChallengeModeSectionProps {
  challengeClaims: ChallengeClaim[];
  verificationResults: Record<string, VerificationResult>;
  isVerifying: Record<string, boolean>;
  onVerifyClaim: (claim: ChallengeClaim) => void;
}

export const ChallengeModeSection: React.FC<ChallengeModeSectionProps> = ({
  challengeClaims,
  verificationResults,
  isVerifying,
  onVerifyClaim,
}) => {
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(
    challengeClaims.length > 0 ? challengeClaims[0].id : null
  );
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  const handleCopyQuery = (query: string, claimId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(query);
    setCopiedQueryId(claimId);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  const getCategoryBadge = (category: ChallengeClaim["challengeCategory"]) => {
    switch (category) {
      case "outdated":
        return {
          label: "Potentially Outdated",
          color: "bg-[#fef7e0] dark:bg-[#332a15] text-[#b06000] dark:text-[#fdd663] border-[#fce8b2] dark:border-[#574419]",
        };
      case "unsupported":
        return {
          label: "Unsupported Assertion",
          color: "bg-[#fce8e6] dark:bg-[#371e1e] text-[#c5221f] dark:text-[#f28b82] border-[#fad2cf] dark:border-[#5c2b29]",
        };
      case "contradictory":
        return {
          label: "Potential Contradiction",
          color: "bg-[#f3e8fd] dark:bg-[#2e1d3d] text-[#8430ce] dark:text-[#d7aefb] border-[#e9d2fd] dark:border-[#522b6d]",
        };
      case "unusually_specific":
        return {
          label: "Unusually Specific Metric",
          color: "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border-[#d2e3fc] dark:border-[#2b4169]",
        };
      case "potentially_misleading":
        return {
          label: "Potentially Misleading",
          color: "bg-[#fce8e6] dark:bg-[#371e1e] text-[#c5221f] dark:text-[#f28b82] border-[#fad2cf] dark:border-[#5c2b29]",
        };
      case "difficult_to_verify":
      default:
        return {
          label: "Difficult to Verify",
          color: "bg-[#f1f3f4] dark:bg-[#282a2d] text-[#5f6368] dark:text-[#9aa0a6] border-[#dadce0] dark:border-[#3c4043]",
        };
    }
  };

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes("verified") || normalized.includes("supported")) {
      return {
        label: "Supported",
        icon: CheckCircle2,
        className:
          "bg-[#e6f4ea] dark:bg-[#133320] text-[#137333] dark:text-[#81c995] border-[#ceead6] dark:border-[#1d5332]",
      };
    }

    if (normalized.includes("conflict") || normalized.includes("contradicted") || normalized.includes("refuted")) {
      return {
        label: "Contradicted",
        icon: AlertTriangle,
        className:
          "bg-[#fce8e6] dark:bg-[#371e1e] text-[#c5221f] dark:text-[#f28b82] border-[#fad2cf] dark:border-[#5c2b29]",
      };
    }

    if (normalized.includes("inconclusive") || normalized.includes("unclear")) {
      return {
        label: "Inconclusive",
        icon: Scale,
        className:
          "bg-[#f1f3f4] dark:bg-[#282a2d] text-[#5f6368] dark:text-[#9aa0a6] border-[#dadce0] dark:border-[#3c4043]",
      };
    }

    // Default: Needs Verification
    return {
      label: "Needs Verification",
      icon: Clock,
      className:
        "bg-[#fef7e0] dark:bg-[#332a15] text-[#b06000] dark:text-[#fdd663] border-[#fce8b2] dark:border-[#574419]",
    };
  };

  // Calculate quick stats
  const verifiedCount = Object.values(verificationResults).filter(
    (v) => v.status.toLowerCase().includes("supported") || v.status.toLowerCase().includes("verified")
  ).length;
  const conflictCount = Object.values(verificationResults).filter(
    (v) => v.status.toLowerCase().includes("conflict") || v.status.toLowerCase().includes("contradicted")
  ).length;
  const pendingCount = challengeClaims.length - Object.keys(verificationResults).length;

  return (
    <div id="challenge-mode-container" className="space-y-6">
      {/* Visual Centerpiece Banner */}
      <div className="p-6 rounded-2xl bg-[#fff8e1] dark:bg-[#2c2413] border-2 border-[#ffe082] dark:border-[#66501c] shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#f29900] text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#202124] dark:text-[#f1f3f4] tracking-tight">
                  Challenge Mode
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e37400] text-white shadow-xs">
                  Visual Centerpiece
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-[#1e1f23] text-[#3c4043] dark:text-[#bdc1c6] border border-[#dadce0] dark:border-[#3c4043]">
                  {challengeClaims.length} High-Scrutiny Targets
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5f6368] dark:text-[#bdc1c6] mt-1 leading-normal">
                Targeted adversarial scrutiny of unsupported assertions, potential contradictions, and metrics requiring external empirical verification.
              </p>
            </div>
          </div>

          {/* Right Status Badge / Grounding Tag */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-start lg:justify-end">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Search Grounding</span>
            </div>

            {/* Quick Status Tally */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {pendingCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[#fef7e0] dark:bg-[#332a15] text-[#b06000] dark:text-[#fdd663] font-bold tabular-nums border border-[#fce8b2] dark:border-[#574419]">
                  {pendingCount} Pending
                </span>
              )}
              {verifiedCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] dark:bg-[#133320] text-[#137333] dark:text-[#81c995] font-bold tabular-nums border border-[#ceead6] dark:border-[#1d5332]">
                  {verifiedCount} Supported
                </span>
              )}
              {conflictCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[#fce8e6] dark:bg-[#371e1e] text-[#c5221f] dark:text-[#f28b82] font-bold tabular-nums border border-[#fad2cf] dark:border-[#5c2b29]">
                  {conflictCount} Contradicted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {challengeClaims.length === 0 && (
        <div className="p-8 rounded-2xl bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-[#137333] dark:text-[#81c995] mx-auto" />
          <h3 className="text-base font-bold text-[#202124] dark:text-[#f1f3f4]">
            No Critical Challenge Targets Flagged
          </h3>
          <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] max-w-md mx-auto">
            The document assertions appear self-contained or standard without requiring active adversarial Challenge Mode scrutiny.
          </p>
        </div>
      )}

      {/* Claims List with Required 6-Layer Hierarchy */}
      <div className="space-y-4">
        {challengeClaims.map((claim, idx) => {
          const isExpanded = expandedClaimId === claim.id;
          const verification = verificationResults[claim.id];
          const verifying = isVerifying[claim.id] || false;
          const categoryMeta = getCategoryBadge(claim.challengeCategory);
          const currentStatus = verification ? verification.status : claim.initialStatus;
          const statusMeta = getStatusBadge(currentStatus);
          const StatusIcon = statusMeta.icon;

          return (
            <div
              key={claim.id || idx}
              id={`challenge-card-${claim.id}`}
              className={`rounded-2xl border transition-all overflow-hidden bg-white dark:bg-[#1e1f23] ${
                verification
                  ? "border-[#dadce0] dark:border-[#3c4043] shadow-xs"
                  : "border-[#dadce0] dark:border-[#3c4043] hover:border-[#bdc1c6] dark:hover:border-[#5f6368]"
              }`}
            >
              {/* Card Container with Structured Hierarchy */}
              <div className="p-6 space-y-4">
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#202124] text-white dark:bg-[#f1f3f4] dark:text-[#202124] text-xs font-bold flex items-center justify-center tabular-nums">
                      {idx + 1}
                    </span>

                    {/* Category Badge */}
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${categoryMeta.color}`}
                    >
                      {categoryMeta.label}
                    </span>

                    {/* Prominent Verification Status */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border transition-colors ${statusMeta.className}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{statusMeta.label}</span>
                    </span>

                    {/* Confidence Pill (if verified) */}
                    {verification && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          verification.confidence === "High"
                            ? "bg-[#e6f4ea] dark:bg-[#133320] text-[#137333] dark:text-[#81c995] border border-[#ceead6] dark:border-[#1d5332]"
                            : verification.confidence === "Medium"
                            ? "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#d2e3fc] dark:border-[#2b4169]"
                            : "bg-[#fef7e0] dark:bg-[#332a15] text-[#b06000] dark:text-[#fdd663] border border-[#fce8b2] dark:border-[#574419]"
                        }`}
                      >
                        {verification.confidence} Confidence
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                    className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] dark:hover:text-[#f1f3f4] hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] transition-colors cursor-pointer"
                    title={isExpanded ? "Collapse details" : "Expand details"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* 1. HIERARCHY LEVEL 1: The Claim */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] mb-1 block">
                    Target Claim Under Scrutiny
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#202124] dark:text-[#f1f3f4] leading-snug">
                    "{claim.claim}"
                  </h3>
                </div>

                {/* 2. HIERARCHY LEVEL 2: Why it needs verification */}
                <div className="p-3.5 rounded-xl bg-[#f8fafd] dark:bg-[#18191c] border border-[#dadce0] dark:border-[#3c4043] space-y-2">
                  <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                    <Info className="w-4 h-4 text-[#e37400] dark:text-[#fdd663] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#202124] dark:text-[#f1f3f4]">
                        Why verification is required:{" "}
                      </span>
                      <span className="text-[#3c4043] dark:text-[#bdc1c6]">
                        {claim.reason}
                      </span>
                    </div>
                  </div>

                  {claim.documentExcerpt && (
                    <div className="pt-2 border-t border-[#dadce0]/60 dark:border-[#3c4043]/60 text-xs text-[#5f6368] dark:text-[#9aa0a6] flex items-start gap-2 italic">
                      <Quote className="w-3.5 h-3.5 text-[#80868b] shrink-0 not-italic mt-0.5" />
                      <div>
                        <span className="font-semibold not-italic text-[#202124] dark:text-[#f1f3f4]">Source Document Excerpt: </span>
                        <span>"{claim.documentExcerpt}"</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. HIERARCHY LEVEL 3: Search Query & Verification Trigger */}
                <div className="p-3 rounded-xl bg-[#f1f3f4] dark:bg-[#282a2d] border border-[#dadce0] dark:border-[#3c4043] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#202124] dark:text-[#f1f3f4] overflow-hidden w-full sm:w-auto">
                    <SearchCode className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6] shrink-0" />
                    <span className="text-[#5f6368] dark:text-[#9aa0a6] font-sans font-semibold shrink-0">Search Query:</span>
                    <span className="truncate bg-white dark:bg-[#1e1f23] px-2.5 py-1 rounded-md border border-[#dadce0] dark:border-[#3c4043] text-[#202124] dark:text-[#f1f3f4] select-all">
                      {claim.suggestedQuery}
                    </span>
                    <button
                      onClick={(e) => handleCopyQuery(claim.suggestedQuery, claim.id, e)}
                      className="p-1 text-[#5f6368] hover:text-[#202124] dark:hover:text-[#f1f3f4] rounded cursor-pointer"
                      title="Copy search query"
                    >
                      {copiedQueryId === claim.id ? (
                        <Check className="w-3.5 h-3.5 text-[#137333] dark:text-[#81c995]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Verification Action Button */}
                  <button
                    id={`verify-btn-${claim.id}`}
                    onClick={() => onVerifyClaim(claim)}
                    disabled={verifying}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-full shadow-xs transition-all cursor-pointer shrink-0 ${
                      verifying
                        ? "bg-[#f1f3f4] dark:bg-[#282a2d] text-[#80868b] cursor-not-allowed"
                        : verification
                        ? "bg-white dark:bg-[#1e1f23] hover:bg-[#f8fafd] dark:hover:bg-[#282a2d] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#dadce0] dark:border-[#3c4043]"
                        : "bg-[#1a73e8] hover:bg-[#1557b0] text-white"
                    }`}
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1a73e8]" />
                        <span>Searching Google & Evaluating...</span>
                      </>
                    ) : verification ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-Verify Grounding</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Verify with Google Search Grounding</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 4, 5, 6. EXPANDED VERIFICATION DETAILS: Hierarchy Levels 4 (Status & Confidence), 5 (Evidence), 6 (Sources) */}
              {isExpanded && verification && (
                <div className="p-6 border-t border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#18191c] space-y-5">
                  {/* Status & Confidence Summary Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">
                        Evaluated Status:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${statusMeta.className}`}
                      >
                        <StatusIcon className="w-4 h-4 shrink-0" />
                        <span>{statusMeta.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#5f6368] dark:text-[#9aa0a6] font-medium">Confidence Level:</span>
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-xs ${
                          verification.confidence === "High"
                            ? "bg-[#e6f4ea] dark:bg-[#133320] text-[#137333] dark:text-[#81c995] border border-[#ceead6] dark:border-[#1d5332]"
                            : verification.confidence === "Medium"
                            ? "bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#d2e3fc] dark:border-[#2b4169]"
                            : "bg-[#fef7e0] dark:bg-[#332a15] text-[#b06000] dark:text-[#fdd663] border border-[#fce8b2] dark:border-[#574419]"
                        }`}
                      >
                        {verification.confidence} Confidence
                      </span>
                    </div>
                  </div>

                  {/* 5. HIERARCHY LEVEL 5: External Evidence Assessment */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#202124] dark:text-[#f1f3f4] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" />
                      External Evidence Assessment
                    </h4>

                    {/* Summary narrative */}
                    <div className="text-xs sm:text-sm text-[#202124] dark:text-[#f1f3f4] leading-relaxed bg-white dark:bg-[#1e1f23] p-4 rounded-xl border border-[#dadce0] dark:border-[#3c4043] whitespace-pre-line shadow-xs">
                      {verification.summary}
                    </div>

                    {/* Side-by-side Evidence Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Supporting Evidence */}
                      <div className="p-4 rounded-xl bg-[#e6f4ea]/40 dark:bg-[#133320]/30 border border-[#ceead6] dark:border-[#1d5332] space-y-2">
                        <h5 className="text-xs font-bold text-[#137333] dark:text-[#81c995] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#137333] dark:text-[#81c995] shrink-0" />
                          <span>Supporting Evidence</span>
                        </h5>
                        {verification.supportingEvidence && verification.supportingEvidence.length > 0 ? (
                          <ul className="space-y-2 text-xs text-[#202124] dark:text-[#f1f3f4]">
                            {verification.supportingEvidence.map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-[#137333] dark:text-[#81c995] font-bold shrink-0 mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] italic">No direct external supporting points confirmed.</p>
                        )}
                      </div>

                      {/* Contradicting / Cautionary Findings */}
                      <div className="p-4 rounded-xl bg-[#fce8e6]/40 dark:bg-[#371e1e]/30 border border-[#fad2cf] dark:border-[#5c2b29] space-y-2">
                        <h5 className="text-xs font-bold text-[#c5221f] dark:text-[#f28b82] flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-[#c5221f] dark:text-[#f28b82] shrink-0" />
                          <span>Contradicting / Cautionary Findings</span>
                        </h5>
                        {verification.contradictingEvidence && verification.contradictingEvidence.length > 0 ? (
                          <ul className="space-y-2 text-xs text-[#202124] dark:text-[#f1f3f4]">
                            {verification.contradictingEvidence.map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-[#c5221f] dark:text-[#f28b82] font-bold shrink-0 mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] italic">No direct contradictory evidence flagged by live search sources.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 6. HIERARCHY LEVEL 6: Live Google Search Sources */}
                  {verification.sources && verification.sources.length > 0 && (
                    <div className="space-y-2.5 pt-2 border-t border-[#dadce0] dark:border-[#3c4043]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#202124] dark:text-[#f1f3f4] flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" />
                          Grounded Web Sources & Citations
                        </h4>
                        <span className="text-[11px] font-semibold text-[#5f6368] dark:text-[#9aa0a6] bg-[#f1f3f4] dark:bg-[#282a2d] px-2 py-0.5 rounded-full">
                          {verification.sources.length} live source{verification.sources.length > 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {verification.sources.map((src, sIdx) => {
                          let hostname = "";
                          try {
                            hostname = new URL(src.uri).hostname.replace("www.", "");
                          } catch {
                            hostname = src.uri;
                          }

                          return (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 rounded-xl bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8] dark:hover:border-[#8ab4f8] transition-all flex items-start justify-between gap-3 group text-xs shadow-xs cursor-pointer"
                            >
                              <div className="space-y-1 min-w-0">
                                <span className="font-semibold text-[#202124] dark:text-[#f1f3f4] group-hover:text-[#1a73e8] dark:group-hover:text-[#8ab4f8] line-clamp-1 block">
                                  {src.title || src.uri}
                                </span>
                                <span className="text-[11px] font-mono text-[#5f6368] dark:text-[#9aa0a6] block truncate">
                                  {hostname}
                                </span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-[#80868b] group-hover:text-[#1a73e8] shrink-0 mt-0.5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

