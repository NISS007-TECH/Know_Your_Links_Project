"use client";

import React, { useState, FormEvent } from "react";
import { validateUrl, defangUrl } from "@/lib/urlUtils";
import { ScannerStatus } from "@/types/scanner";

interface UrlScannerFormProps {
  status: ScannerStatus;
  onSubmitScan: (url: string) => void;
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

export function UrlScannerForm({
  status,
  onSubmitScan,
  onValidationChange,
}: UrlScannerFormProps) {
  const [urlInput, setUrlInput] = useState<string>("");
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Derive dynamic defanged preview
  const defangedDisplay = urlInput.trim()
    ? defangUrl(urlInput.trim())
    : "awaiting-url-input[.]com";

  const isBusy = status === "validating" || status === "scanning";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);

    if (inlineError) {
      setInlineError(null);
    }
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text.trim());
          setInlineError(null);
        }
      }
    } catch {
      // Graceful fallback if clipboard permission is denied
      const inputEl = document.getElementById("url-input-field");
      if (inputEl) {
        inputEl.focus();
      }
    }
  };

  const handleCopyDefanged = async () => {
    if (!urlInput.trim()) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(defangedDisplay);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      }
    } catch {
      // Ignore copy error
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isBusy) return;

    const validation = validateUrl(urlInput);

    if (!validation.isValid) {
      const errorMsg = validation.error || "Please enter a valid URL.";
      setInlineError(errorMsg);
      if (onValidationChange) {
        onValidationChange(false, errorMsg);
      }
      return;
    }

    setInlineError(null);
    if (onValidationChange) {
      onValidationChange(true);
    }

    if (validation.normalizedUrl) {
      onSubmitScan(validation.normalizedUrl);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800 border border-white/20"
      data-purpose="scanner-input-card"
    >
      {/* Card Sub-header */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-400 mb-3">
        <span className="font-semibold text-slate-600">PASTE UNFAMILIAR URL</span>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium lowercase">
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Never auto-opens</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* URL Input Box with scheme badge */}
        <div
          className={`relative flex items-center bg-[#F3F4F1] rounded-xl px-4 py-3.5 sm:py-4 mb-2 border transition-all ${
            inlineError
              ? "border-red-400 ring-2 ring-red-400/20"
              : "border-slate-200/90 focus-within:ring-2 focus-within:ring-[#1C4839]/30"
          }`}
        >
          <svg
            className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            id="url-input-field"
            className="bg-transparent border-0 p-0 text-slate-900 font-mono text-base sm:text-lg w-full focus:ring-0 focus:outline-none placeholder-slate-400"
            type="url"
            disabled={isBusy}
            placeholder="https://example.com/login"
            value={urlInput}
            onChange={handleInputChange}
            autoComplete="off"
            spellCheck="false"
          />
          <span className="bg-[#E5E7DF] text-slate-600 text-xs sm:text-sm font-mono px-2.5 py-1 rounded ml-2 flex-shrink-0 select-none">
            https://
          </span>
        </div>

        {/* Inline Error Notice */}
        {inlineError && (
          <div
            className="flex items-center gap-1.5 text-sm text-red-600 font-mono mb-3"
            role="alert"
          >
            <svg
              className="w-4 h-4 text-red-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{inlineError}</span>
          </div>
        )}

        {/* Button Row: Analyze & Paste */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <button
            type="submit"
            disabled={isBusy}
            className={`sm:col-span-2 font-semibold text-base sm:text-lg rounded-xl py-3.5 sm:py-4 px-6 flex items-center justify-center gap-2 transition-all shadow-sm ${
              isBusy
                ? "bg-[#17251F] text-white ring-1 ring-lime-accent/40 cursor-wait"
                : "bg-[#17251F] hover:bg-black text-white active:scale-[0.99]"
            }`}
          >
            {isBusy ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-lime-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-mono text-base tracking-wide">
                  Inspecting link...
                </span>
              </>
            ) : (
              <>
                <span>Analyze link</span>
                <span className="text-xl">→</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePaste}
            disabled={isBusy}
            className="bg-lime-accent hover:bg-lime-accent-dark text-[#152B21] font-bold text-base sm:text-lg rounded-xl py-3.5 sm:py-4 px-4 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect height="4" rx="1" ry="1" width="8" x="8" y="2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
            <span>Paste</span>
          </button>
        </div>
      </form>

      {/* Privacy / Security Disclaimer */}
      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 mb-4 pb-4 border-b border-slate-200/80 leading-relaxed">
        <svg
          className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>Sent to 6 analysis sources. Never auto-opens. URLs may be shared per provider terms.</span>
      </div>

      {/* Defanged preview & Copy safe link */}
      <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono text-slate-600 gap-2">
        <div className="truncate max-w-[280px] sm:max-w-[360px]">
          <span className="text-slate-500">Defanged preview: </span>
          <span className="text-slate-900 font-semibold">{defangedDisplay}</span>
        </div>
        <button
          type="button"
          onClick={handleCopyDefanged}
          disabled={!urlInput.trim()}
          className={`underline decoration-slate-400 font-semibold transition-colors cursor-pointer text-xs sm:text-sm ${
            copyFeedback
              ? "text-emerald-700 font-bold"
              : "hover:text-slate-900 text-slate-700"
          }`}
        >
          {copyFeedback ? "Copied safe link!" : "Copy safe link"}
        </button>
      </div>
    </div>
  );
}
