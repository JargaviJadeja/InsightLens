import React from "react";
import { Sparkles, ArrowRight, ShieldAlert, SearchCheck, Layers, FileText, Zap, Search, ShieldCheck } from "lucide-react";
import { SAMPLE_PRESETS, PresetDocument } from "../data/samplePresets.ts";

interface LandingHeroProps {
  onStartAnalysis: () => void;
  onSelectPreset: (preset: PresetDocument) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartAnalysis,
  onSelectPreset,
}) => {
  return (
    <div id="landing-hero-section" className="py-8 md:py-14">
      <div className="text-center max-w-3xl mx-auto px-4">
        {/* Research Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] bg-[#e8f0fe] dark:bg-[#1e293b] rounded-full border border-[#d2e3fc] dark:border-[#2b3a55]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Analysis & Real-Time Search Grounding</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#202124] dark:text-[#f1f3f4] tracking-tight leading-tight mb-3">
          InsightLens
        </h1>
        <p className="text-lg sm:text-xl font-medium text-[#5f6368] dark:text-[#bdc1c6] tracking-tight mb-4">
          Understand with Gemini. Challenge with Rigor. Verify with Google Search.
        </p>

        {/* Short Description */}
        <p className="text-sm sm:text-base text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          An AI-powered research and evidence validation workspace. Ingest documents and complex text to extract structured summaries, isolate atomic assertions, and put high-stakes claims under adversarial scrutiny using Gemini 3.7 Flash and live Google Search grounding.
        </p>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <button
            id="start-analysis-btn"
            onClick={onStartAnalysis}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <span>Analyze New Document</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Core Pillars Cards (Material 3 Surface style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left mb-12">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] shadow-xs hover:border-[#bdc1c6] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#e8f0fe] dark:bg-[#1e293b] text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124] dark:text-[#e8eaed] mb-1">
              1. Multimodal Synthesis
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">
              Extracts executive summaries, empirical anchors, and entity networks from PDFs, research papers, and technical memos.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] shadow-xs hover:border-[#bdc1c6] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#fef7e0] dark:bg-[#332b00] text-[#b06000] dark:text-[#fdd663] flex items-center justify-center mb-3">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124] dark:text-[#e8eaed] mb-1">
              2. Challenge Mode
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">
              Isolates atomic claims and formulates targeted adversarial search queries for claims needing external verification.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] shadow-xs hover:border-[#bdc1c6] transition-colors">
            <div className="w-8 h-8 rounded-xl bg-[#e6f4ea] dark:bg-[#0d2a1a] text-[#137333] dark:text-[#81c995] flex items-center justify-center mb-3">
              <SearchCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#202124] dark:text-[#e8eaed] mb-1">
              3. Search Grounding
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed">
              Audits claims against live web sources, surfacing supporting evidence, contradicting findings, and confidence ratings.
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="text-left border-t border-[#dadce0] dark:border-[#3c4043] pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#1a73e8] dark:text-[#8ab4f8]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124] dark:text-[#e8eaed]">
                Or Load a Curated Showcase Document
              </h2>
            </div>
            <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">Instant 1-click test</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                id={`preset-card-${preset.id}`}
                onClick={() => onSelectPreset(preset)}
                className="p-4 rounded-xl bg-white dark:bg-[#1e1f23] border border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8] dark:hover:border-[#8ab4f8] text-left transition-all group flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#f1f3f4] dark:bg-[#282a2d] text-[#3c4043] dark:text-[#bdc1c6]">
                      {preset.category}
                    </span>
                    <FileText className="w-3.5 h-3.5 text-[#5f6368] group-hover:text-[#1a73e8] dark:group-hover:text-[#8ab4f8] transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-[#202124] dark:text-[#f1f3f4] line-clamp-2 mb-1.5 leading-snug">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#f1f3f4] dark:border-[#282a2d] flex items-center justify-between text-[11px] font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
                  <span>Load Document</span>
                  <ArrowRight className="w-3 h-3 text-[#1a73e8] dark:text-[#8ab4f8] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

