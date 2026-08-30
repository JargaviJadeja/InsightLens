import React from "react";
import { Sparkles, FileSearch, ShieldCheck, Sun, Moon, RefreshCw, Compass } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onReset: () => void;
  hasActiveAnalysis: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onReset,
  hasActiveAnalysis,
}) => {
  return (
    <header
      id="app-navbar"
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/95 dark:bg-[#1a1b1e]/95 border-b border-[#e0e3e7] dark:border-[#2d3135] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div
            id="brand-logo-btn"
            onClick={onReset}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Custom geometric logo icon with Google Blue accent */}
            <div className="w-8.5 h-8.5 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1557b0] transition-colors">
              <Compass className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#202124] dark:text-[#f1f3f4] tracking-tight text-base sm:text-lg">
                  InsightLens
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-[#e8f0fe] dark:bg-[#1e293b] text-[#1a73e8] dark:text-[#8ab4f8] rounded-full border border-[#d2e3fc] dark:border-[#2b3a55]">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini & Search Grounding
                </span>
              </div>
              <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] font-normal hidden sm:block -mt-0.5">
                Multimodal Document Understanding & Adversarial Claim Verification
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {hasActiveAnalysis && (
            <button
              id="new-analysis-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] bg-[#f1f3f4] hover:bg-[#e8f0fe] dark:bg-[#282a2d] dark:hover:bg-[#303338] rounded-full border border-transparent hover:border-[#d2e3fc] dark:hover:border-[#3b4758] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          )}

          {/* Technology Grounding Status */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-[#137333] dark:text-[#81c995] px-2.5 py-1 rounded-full bg-[#e6f4ea] dark:bg-[#0d2a1a] border border-[#ceead6] dark:border-[#1e462d]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#137333] dark:bg-[#81c995] animate-pulse" />
            <span>Search Grounding Active</span>
          </div>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#e8eaed] hover:bg-[#f1f3f4] dark:hover:bg-[#282a2d] transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

