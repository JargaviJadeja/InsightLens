import React, { useState, useEffect } from "react";
import {
  FileSearch,
  Sparkles,
  ShieldAlert,
  Search,
  CheckSquare,
  AlertCircle,
  Users,
  Lightbulb,
  MessageSquare,
  Download,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Layers,
  FileText,
} from "lucide-react";
import { Navbar } from "./components/Navbar.tsx";
import { LandingHero } from "./components/LandingHero.tsx";
import { DocumentInput } from "./components/DocumentInput.tsx";
import { ExecutiveSummarySection } from "./components/ExecutiveSummarySection.tsx";
import { ChallengeModeSection } from "./components/ChallengeModeSection.tsx";
import { MainClaimsSection } from "./components/MainClaimsSection.tsx";
import { PotentialIssuesSection } from "./components/PotentialIssuesSection.tsx";
import { KeyEntitiesSection } from "./components/KeyEntitiesSection.tsx";
import { InvestigationQuestionsSection } from "./components/InvestigationQuestionsSection.tsx";
import { FollowUpChatSection } from "./components/FollowUpChatSection.tsx";
import { ExportModal } from "./components/ExportModal.tsx";

import {
  AnalysisResult,
  ChallengeClaim,
  VerificationResult,
  ChatMessage,
  UploadedFileState,
} from "./types/index.ts";
import { PresetDocument } from "./data/samplePresets.ts";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("insightlens_theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "summary" | "challenge" | "claims" | "issues" | "entities" | "questions" | "chat"
  >("summary");
  const [documentTitle, setDocumentTitle] = useState<string>("Document Analysis");
  const [rawTextContext, setRawTextContext] = useState<string>("");

  // Loading & Step state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Challenge mode verifications
  const [verificationResults, setVerificationResults] = useState<Record<string, VerificationResult>>({});
  const [isVerifying, setIsVerifying] = useState<Record<string, boolean>>({});

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatGenerating, setIsChatGenerating] = useState(false);

  // Export Modal
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Preset Selection
  const [selectedPresetContent, setSelectedPresetContent] = useState<string>("");
  const [selectedPresetTitle, setSelectedPresetTitle] = useState<string>("");

  // Handle Dark Mode toggle and persistence
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("insightlens_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("insightlens_theme", "light");
      }
    } catch (e) {
      console.error("Failed to update theme storage", e);
    }
  }, [darkMode]);

  const handleStartAnalysisClick = () => {
    const inputElement = document.getElementById("document-input-container");
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectPreset = (preset: PresetDocument) => {
    setSelectedPresetTitle(preset.title);
    setSelectedPresetContent(preset.content);
    const inputElement = document.getElementById("document-input-container");
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAnalyze = async (
    fileState: UploadedFileState | null,
    textContent: string,
    notes: string
  ) => {
    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalyzingStep("Connecting to Gemini 3.7 Flash...");

    try {
      const payload: any = {};
      let docName = "Submitted Text";

      if (fileState && fileState.base64) {
        payload.file = {
          name: fileState.name,
          mimeType: fileState.type,
          base64: fileState.base64,
          size: fileState.size,
        };
        docName = fileState.name;
      }

      if (textContent.trim()) {
        payload.text = notes ? `[INVESTIGATION FOCUS / NOTES]: ${notes}\n\n${textContent}` : textContent;
        if (!fileState) {
          docName = selectedPresetTitle || "Uploaded Content";
        }
      }

      setDocumentTitle(docName);
      setRawTextContext(textContent || (fileState ? `File: ${fileState.name}` : ""));

      setAnalyzingStep("Extracting key facts, entities, and claims...");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error ${response.status}`);
      }

      setAnalyzingStep("Formulating Challenge Mode and research questions...");
      const result: AnalysisResult = await response.json();

      setAnalysisResult(result);
      setActiveTab("summary");
      setVerificationResults({});

      // Scroll smoothly to top so results are immediately in view
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Initialize chat with welcome message
      setChatMessages([
        {
          id: "welcome-msg",
          role: "assistant",
          content: `I've completed the analytical breakdown of "${docName}".\n\nI identified **${
            result.mainClaims?.length || 0
          } core claims**, flagged **${
            result.challengeClaims?.length || 0
          } claims for Challenge Mode scrutiny**, and extracted **${
            result.potentialIssues?.length || 0
          } potential issues**.\n\nHow would you like to proceed? You can ask me to evaluate any specific claim or probe the evidence.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      console.error("Analysis Failed:", err);
      setErrorMessage(err.message || "An error occurred during Gemini analysis. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsAnalyzing(false);
      setAnalyzingStep("");
    }
  };

  const handleVerifyClaim = async (claim: ChallengeClaim) => {
    const claimId = claim.id;
    setIsVerifying((prev) => ({ ...prev, [claimId]: true }));

    try {
      const response = await fetch("/api/verify-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim: claim.claim,
          context: claim.reason || claim.documentExcerpt,
          searchQuery: claim.suggestedQuery,
          claimId,
          documentContext: rawTextContext || analysisResult?.executiveSummary || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to verify claim with search grounding.");
      }

      const verification: VerificationResult = await response.json();
      setVerificationResults((prev) => ({
        ...prev,
        [claimId]: verification,
      }));
    } catch (err: any) {
      console.error("Verification failed for claim:", claim.id, err);
      alert(`Verification failed: ${err.message || "Network error"}`);
    } finally {
      setIsVerifying((prev) => ({ ...prev, [claimId]: false }));
    }
  };

  const handleChallengeClaimFromList = (claimText: string, context?: string) => {
    // Switch to Challenge tab and trigger or find claim
    setActiveTab("challenge");
    // If not in challenge claims, create an ad-hoc challenge claim
    const existing = analysisResult?.challengeClaims.find((c) => c.claim === claimText);
    if (existing) {
      handleVerifyClaim(existing);
    } else {
      const customClaim: ChallengeClaim = {
        id: `custom-claim-${Date.now()}`,
        claim: claimText,
        reason: context || "Identified from main claims list for external verification.",
        challengeCategory: "difficult_to_verify",
        initialStatus: "Needs Verification",
        suggestedQuery: claimText,
      };

      setAnalysisResult((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          challengeClaims: [customClaim, ...prev.challengeClaims],
        };
      });

      handleVerifyClaim(customClaim);
    }
  };

  const handleSendChatMessage = async (content: string, useSearchGrounding: boolean) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...chatMessages, userMessage];
    setChatMessages(newHistory);
    setIsChatGenerating(true);

    try {
      let docContext = "";
      if (analysisResult) {
        const claimsList = (analysisResult.mainClaims || [])
          .map(
            (c, i) =>
              `${i + 1}. [${(c.importance || "medium").toUpperCase()} IMPORTANCE | Category: ${c.category}] "${c.claim}"\n   Context: ${c.context}`
          )
          .join("\n");

        const challengeList = (analysisResult.challengeClaims || [])
          .map(
            (c, i) =>
              `${i + 1}. "${c.claim}"\n   - Scrutiny Reason: ${c.reason}\n   - Category: ${c.challengeCategory}\n   - Verification Status: ${
                verificationResults[c.id]?.status || c.initialStatus || "Needs Verification"
              }`
          )
          .join("\n");

        const issuesList = (analysisResult.potentialIssues || [])
          .map(
            (iss, i) =>
              `${i + 1}. [${(iss.severity || "medium").toUpperCase()} SEVERITY] ${iss.title}: ${iss.description}\n   Recommendation: ${iss.recommendation}`
          )
          .join("\n");

        docContext = `=== EXECUTIVE SUMMARY ===\n${analysisResult.executiveSummary}\n\n=== EXTRACTED MAIN CLAIMS ===\n${claimsList}\n\n=== CHALLENGE CLAIMS & VERIFICATION STATUS ===\n${challengeList}\n\n=== POTENTIAL ISSUES & VULNERABILITIES ===\n${issuesList}\n\n=== DOCUMENT RAW TEXT ===\n${rawTextContext.slice(0, 8000)}`;
      } else {
        docContext = `=== DOCUMENT RAW TEXT ===\n${rawTextContext.slice(0, 8000)}`;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          documentContext: docContext,
          useSearchGrounding,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response from assistant.");
      }

      const result = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.reply,
        sources: result.sources,
        searchQueries: result.searchQueries,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `Error: ${err.message || "Failed to process question with Gemini."}`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatGenerating(false);
    }
  };

  const handleAskQuestionFromSection = (questionText: string) => {
    setActiveTab("chat");
    handleSendChatMessage(questionText, true);
  };

  const handleResetAnalysis = () => {
    setAnalysisResult(null);
    setVerificationResults({});
    setChatMessages([]);
    setSelectedPresetContent("");
    setSelectedPresetTitle("");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#131314] text-[#202124] dark:text-[#e8eaed] flex flex-col font-sans transition-colors">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onReset={handleResetAnalysis}
        hasActiveAnalysis={Boolean(analysisResult)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Full-screen Loading Overlay for Analysis */}
        {isAnalyzing && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[#dadce0] dark:border-[#3c4043] text-center space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f0fe] dark:bg-[#1a2e4c] border border-[#1a73e8]/20 dark:border-[#8ab4f8]/30 flex items-center justify-center mx-auto text-[#1a73e8] dark:text-[#8ab4f8]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#202124] dark:text-[#e8eaed]">
                  Investigative Analysis in Progress
                </h3>
                <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1 font-mono">
                  {analyzingStep || "Processing source document with Gemini 3.7 Flash..."}
                </p>
              </div>

              {/* Progress Steps Indicators */}
              <div className="space-y-2 text-left bg-[#f8f9fa] dark:bg-[#171819] p-4 rounded-xl text-xs border border-[#e8eaed] dark:border-[#282a2d]">
                <div className="flex items-center gap-2.5 text-[#3c4043] dark:text-[#bdc1c6]">
                  <div className="w-2 h-2 rounded-full bg-[#137333] dark:bg-[#81c995] animate-pulse" />
                  <span>Multimodal Document Ingestion & Parsing</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#3c4043] dark:text-[#bdc1c6]">
                  <div className="w-2 h-2 rounded-full bg-[#1a73e8] dark:bg-[#8ab4f8] animate-pulse" />
                  <span>Claims & Entity Extraction</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#3c4043] dark:text-[#bdc1c6]">
                  <div className="w-2 h-2 rounded-full bg-[#e37400] dark:bg-[#fdd663] animate-pulse" />
                  <span>Challenge Mode Scrutiny Formulation</span>
                </div>
              </div>

              <p className="text-[11px] text-[#80868b] dark:text-[#9aa0a6]">
                Evaluating assertions, metrics, references, and evidence...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#fce8e6] dark:bg-[#3c1e1e] border border-[#f28b82] dark:border-[#5c2b29] text-[#c5221f] dark:text-[#f28b82] flex items-start justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-[#c5221f] dark:text-[#f28b82]" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold underline hover:no-underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Landing & Input Screen */}
        {!analysisResult && (
          <div className="space-y-8">
            <LandingHero
              onStartAnalysis={handleStartAnalysisClick}
              onSelectPreset={handleSelectPreset}
            />

            <DocumentInput
              onAnalyze={handleAnalyze}
              isLoading={isAnalyzing}
              loadingStep={analyzingStep}
              initialPresetContent={selectedPresetContent}
              initialPresetTitle={selectedPresetTitle}
            />
          </div>
        )}

        {/* View 2: Active Results Dashboard */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Dashboard Header Bar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] border border-[#1a73e8]/20 dark:border-[#8ab4f8]/30">
                    <Sparkles className="w-3 h-3 text-[#1a73e8] dark:text-[#8ab4f8]" />
                    Analysis Active
                  </span>
                  <span className="text-xs text-[#dadce0] dark:text-[#3c4043]">•</span>
                  <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] font-normal">
                    Gemini 3.7 Flash & Google Search Grounding
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
                  {documentTitle}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="export-dossier-btn"
                  onClick={() => setIsExportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-[#f1f3f4] hover:bg-[#e8eaed] dark:bg-[#282a2d] dark:hover:bg-[#303134] text-[#3c4043] dark:text-[#e8eaed] border border-[#dadce0] dark:border-[#3c4043] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                  <span>Export Dossier</span>
                </button>

                <button
                  id="reset-dashboard-btn"
                  onClick={handleResetAnalysis}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Analysis</span>
                </button>
              </div>
            </div>

            {/* Top Summary Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Metric 1: Claims Extracted */}
              <div
                onClick={() => setActiveTab("claims")}
                className={`p-4 rounded-xl bg-white dark:bg-[#1e1f20] border transition-all cursor-pointer group shadow-2xs ${
                  activeTab === "claims"
                    ? "border-[#1a73e8] dark:border-[#8ab4f8] ring-1 ring-[#1a73e8]"
                    : "border-[#dadce0] dark:border-[#3c4043] hover:border-[#bdc1c6] dark:hover:border-[#5f6368]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
                    Claims Extracted
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#e8f0fe] dark:bg-[#1a2e4c] text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#202124] dark:text-[#e8eaed] tabular-nums">
                    {analysisResult.mainClaims?.length || 0}
                  </span>
                  <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">assertions parsed</span>
                </div>
              </div>

              {/* Metric 2: Need Verification (Challenge Mode Highlight) */}
              <div
                onClick={() => setActiveTab("challenge")}
                className={`p-4 rounded-xl bg-[#fef7e0]/60 dark:bg-[#332b00]/30 border transition-all cursor-pointer group shadow-2xs ${
                  activeTab === "challenge"
                    ? "border-[#e37400] dark:border-[#fdd663] ring-1 ring-[#e37400]"
                    : "border-[#fdd663] dark:border-[#594a00] hover:border-[#f9ab00] dark:hover:border-[#7c6900]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b06000] dark:text-[#fdd663]">
                    Need Verification
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#e37400] text-white flex items-center justify-center shadow-2xs">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#b06000] dark:text-[#fdd663] tabular-nums">
                    {analysisResult.challengeClaims?.length || 0}
                  </span>
                  <span className="text-xs text-[#b06000]/80 dark:text-[#fdd663]/80">
                    high-priority targets
                  </span>
                </div>
              </div>

              {/* Metric 3: Potential Issues */}
              <div
                onClick={() => setActiveTab("issues")}
                className={`p-4 rounded-xl bg-white dark:bg-[#1e1f20] border transition-all cursor-pointer group shadow-2xs ${
                  activeTab === "issues"
                    ? "border-[#c5221f] dark:border-[#f28b82] ring-1 ring-[#c5221f]"
                    : "border-[#dadce0] dark:border-[#3c4043] hover:border-[#bdc1c6] dark:hover:border-[#5f6368]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
                    Potential Issues
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#fce8e6] dark:bg-[#3c1e1e] text-[#c5221f] dark:text-[#f28b82] flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#c5221f] dark:text-[#f28b82] tabular-nums">
                    {analysisResult.potentialIssues?.length || 0}
                  </span>
                  <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">risks & ambiguities</span>
                </div>
              </div>

              {/* Metric 4: Identified Entities */}
              <div
                onClick={() => setActiveTab("entities")}
                className={`p-4 rounded-xl bg-white dark:bg-[#1e1f20] border transition-all cursor-pointer group shadow-2xs ${
                  activeTab === "entities"
                    ? "border-[#1a73e8] dark:border-[#8ab4f8] ring-1 ring-[#1a73e8]"
                    : "border-[#dadce0] dark:border-[#3c4043] hover:border-[#bdc1c6] dark:hover:border-[#5f6368]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
                    Identified Entities
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#f1f3f4] dark:bg-[#303134] text-[#3c4043] dark:text-[#bdc1c6] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#202124] dark:text-[#e8eaed] tabular-nums">
                    {analysisResult.keyEntities?.length || 0}
                  </span>
                  <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">orgs, specs & tech</span>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs Navigator */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-medium border-b border-[#dadce0] dark:border-[#3c4043]">
              <button
                id="tab-challenge"
                onClick={() => setActiveTab("challenge")}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "challenge"
                    ? "bg-[#fef7e0] dark:bg-[#332b00] text-[#b06000] dark:text-[#fdd663] border-b-2 border-[#e37400] dark:border-[#fdd663] font-semibold"
                    : "text-[#b06000] dark:text-[#fdd663] hover:bg-[#fef7e0]/60 dark:hover:bg-[#332b00]/40"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#e37400] dark:text-[#fdd663]" />
                <span>Challenge Mode</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#e37400] text-white font-bold tabular-nums">
                  {analysisResult.challengeClaims?.length || 0}
                </span>
              </button>

              <button
                id="tab-summary"
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-white dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] font-semibold"
                    : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#f1f3f4]/60 dark:hover:bg-[#282a2d]/40"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Executive Summary</span>
              </button>

              <button
                id="tab-claims"
                onClick={() => setActiveTab("claims")}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "claims"
                    ? "bg-white dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] font-semibold"
                    : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#f1f3f4]/60 dark:hover:bg-[#282a2d]/40"
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Main Claims ({analysisResult.mainClaims?.length || 0})</span>
              </button>

              <button
                id="tab-issues"
                onClick={() => setActiveTab("issues")}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "issues"
                    ? "bg-white dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] font-semibold"
                    : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#f1f3f4]/60 dark:hover:bg-[#282a2d]/40"
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Potential Issues ({analysisResult.potentialIssues?.length || 0})</span>
              </button>

              <button
                id="tab-entities"
                onClick={() => setActiveTab("entities")}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "entities"
                    ? "bg-white dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] font-semibold"
                    : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#f1f3f4]/60 dark:hover:bg-[#282a2d]/40"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Key Entities ({analysisResult.keyEntities?.length || 0})</span>
              </button>

              <button
                id="tab-questions"
                onClick={() => setActiveTab("questions")}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "questions"
                    ? "bg-white dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] font-semibold"
                    : "text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed] hover:bg-[#f1f3f4]/60 dark:hover:bg-[#282a2d]/40"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Questions ({analysisResult.investigationQuestions?.length || 0})</span>
              </button>

              <button
                id="tab-chat"
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-white dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] border-b-2 border-[#1a73e8] dark:border-[#8ab4f8] font-semibold"
                    : "text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#e8f0fe]/50 dark:hover:bg-[#1a2e4c]/30"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask InsightLens</span>
              </button>
            </div>

            {/* Active Tab Content */}
            <div className="pt-2">
              {activeTab === "summary" && (
                <ExecutiveSummarySection analysis={analysisResult} />
              )}

              {activeTab === "challenge" && (
                <ChallengeModeSection
                  challengeClaims={analysisResult.challengeClaims || []}
                  verificationResults={verificationResults}
                  isVerifying={isVerifying}
                  onVerifyClaim={handleVerifyClaim}
                />
              )}

              {activeTab === "claims" && (
                <MainClaimsSection
                  claims={analysisResult.mainClaims || []}
                  onChallengeClaim={handleChallengeClaimFromList}
                />
              )}

              {activeTab === "issues" && (
                <PotentialIssuesSection
                  issues={analysisResult.potentialIssues || []}
                />
              )}

              {activeTab === "entities" && (
                <KeyEntitiesSection
                  entities={analysisResult.keyEntities || []}
                />
              )}

              {activeTab === "questions" && (
                <InvestigationQuestionsSection
                  questions={analysisResult.investigationQuestions || []}
                  onAskQuestionInChat={handleAskQuestionFromSection}
                  onVerifySearchQuery={(q) => handleAskQuestionFromSection(`Investigate this query with Search Grounding: ${q}`)}
                />
              )}

              {activeTab === "chat" && (
                <FollowUpChatSection
                  messages={chatMessages}
                  onSendMessage={handleSendChatMessage}
                  isGenerating={isChatGenerating}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Export Report Modal */}
      {analysisResult && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={analysisResult}
          verificationResults={verificationResults}
          documentName={documentTitle}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#dadce0] dark:border-[#3c4043] bg-white/80 dark:bg-[#1a1b1e]/80 backdrop-blur-xs py-6 text-center text-xs text-[#5f6368] dark:text-[#9aa0a6]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#202124] dark:text-[#e8eaed]">
              InsightLens
            </span>
            <span>—</span>
            <span>AI-Powered Evidence & Insight Explorer</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#5f6368] dark:text-[#9aa0a6]">
            <Sparkles className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#8ab4f8]" />
            <span>Powered by Google Gemini & Google Search Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
