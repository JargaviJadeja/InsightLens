import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import {
  MessageSquare,
  Send,
  Loader2,
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { ChatMessage } from "../types/index.ts";

interface FollowUpChatSectionProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, useSearchGrounding: boolean) => void;
  isGenerating: boolean;
  onSelectPromptStarter?: (starter: string) => void;
}

const STARTER_PROMPTS = [
  "Which claim in this document should I verify first, and why? Compare based on impact and evidence.",
  "What are the main potential contradictions or unsupported assertions?",
  "Synthesize the methodology and evaluate whether the reported sample size is statistically robust.",
  "Which technical figures or metrics are unusually specific or potentially outdated?",
];

export const FollowUpChatSection: React.FC<FollowUpChatSectionProps> = ({
  messages,
  onSendMessage,
  isGenerating,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSendMessage(inputValue.trim(), useSearchGrounding);
    setInputValue("");
  };

  const handleStarterClick = (prompt: string) => {
    if (isGenerating) return;
    onSendMessage(prompt, useSearchGrounding);
  };

  return (
    <div
      id="follow-up-chat-container"
      className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] shadow-xs space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f3f4] dark:border-[#303134]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] dark:bg-[#1a2e4c] flex items-center justify-center text-[#1a73e8] dark:text-[#8ab4f8]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#202124] dark:text-[#e8eaed] tracking-tight">
              Ask InsightLens
            </h2>
            <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
              Interactive conversational researcher grounded in document analysis and live web evidence
            </span>
          </div>
        </div>

        {/* Search Grounding Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] bg-[#f8f9fa] dark:bg-[#282a2d] px-3.5 py-2 rounded-xl border border-[#dadce0] dark:border-[#3c4043] select-none hover:bg-[#f1f3f4] dark:hover:bg-[#303134] transition-colors">
          <input
            type="checkbox"
            checked={useSearchGrounding}
            onChange={(e) => setUseSearchGrounding(e.target.checked)}
            className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8] focus:ring-[#1a73e8] cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#137333] dark:text-[#81c995]" />
            Live Search Grounding
          </span>
        </label>
      </div>

      {/* Starter Prompts chips if chat has few messages */}
      {messages.length <= 1 && (
        <div className="space-y-2.5 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
            Suggested Research Inquiries
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                id={`starter-chip-${idx}`}
                onClick={() => handleStarterClick(prompt)}
                disabled={isGenerating}
                className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#282a2d]/60 hover:bg-[#f1f3f4] dark:hover:bg-[#303134] border border-[#e8eaed] dark:border-[#3c4043] text-xs text-[#3c4043] dark:text-[#bdc1c6] font-normal transition-all text-left disabled:opacity-50 cursor-pointer shadow-2xs leading-relaxed"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Box */}
      <div className="min-h-[300px] max-h-[520px] overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#f8f9fa]/80 dark:bg-[#171819]/60 border border-[#e8eaed] dark:border-[#3c4043]">
        {messages.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-center text-[#80868b] dark:text-[#9aa0a6] space-y-2">
            <Bot className="w-9 h-9 opacity-40 text-[#1a73e8]" />
            <p className="text-xs max-w-sm">
              Ask any follow-up question to probe this document, compare claims, or verify assertions against live sources.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1a73e8] text-white font-medium rounded-tr-xs shadow-xs"
                    : "bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] text-[#202124] dark:text-[#e8eaed] rounded-tl-xs shadow-2xs"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none space-y-2.5 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1.5 [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:mt-2.5 [&_h3]:mb-1 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-[#1a73e8] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2.5 [&_blockquote]:text-[#5f6368] dark:[&_blockquote]:text-[#9aa0a6]">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-line">{msg.content}</div>
                )}

                {/* Grounding Web Sources in Assistant messages */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-[#f1f3f4] dark:border-[#303134] text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5f6368] dark:text-[#9aa0a6] mb-2">
                      <Globe className="w-3.5 h-3.5 text-[#1a73e8]" />
                      <span>Grounded Search Citations ({msg.sources.length}):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((src, sIdx) => {
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
                            className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#282a2d] hover:bg-[#f1f3f4] dark:hover:bg-[#303134] text-[#1a73e8] dark:text-[#8ab4f8] text-xs font-medium border border-[#dadce0] dark:border-[#3c4043] transition-all flex items-center justify-between gap-2 group shadow-2xs"
                          >
                            <span className="truncate" title={src.title || src.uri}>
                              {src.title || hostname}
                            </span>
                            <ExternalLink className="w-3 h-3 text-[#80868b] group-hover:text-[#1a73e8] dark:group-hover:text-[#8ab4f8] shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#e8eaed] dark:bg-[#3c4043] text-[#3c4043] dark:text-[#e8eaed] flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1a73e8] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 text-xs text-[#5f6368] dark:text-[#9aa0a6] flex items-center gap-2.5 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#1a73e8]" />
              <span className="font-medium">
                {useSearchGrounding
                  ? "Searching Google & formulating evidence-grounded response..."
                  : "Synthesizing document context..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        <input
          id="chat-query-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a follow-up question or request verification on any topic..."
          disabled={isGenerating}
          className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#171819] text-[#202124] dark:text-[#e8eaed] placeholder-[#80868b] focus:outline-hidden focus:ring-1 focus:ring-[#1a73e8] dark:focus:ring-[#8ab4f8] focus:bg-white dark:focus:bg-[#1e1f20]"
        />
        <button
          id="send-chat-btn"
          type="submit"
          disabled={!inputValue.trim() || isGenerating}
          className="inline-flex items-center justify-center p-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs shrink-0"
          title="Send message"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
