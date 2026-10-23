import React from "react";
import { ScannerStatus, SecurityReport } from "@/types/scanner";
import { resolveProviderVerdict, ProviderVerdictResult } from "@/lib/providerEvaluator";

interface ProviderNetworkGridProps {
  status: ScannerStatus;
  report?: SecurityReport | null;
}

export function ProviderNetworkGrid({ status, report }: ProviderNetworkGridProps) {
  const isScanning = status === "scanning";

  const renderProviderStatusBadge = (providerKey: string) => {
    if (isScanning) {
      return (
        <span className="flex items-center gap-1 text-amber-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          checking...
        </span>
      );
    }

    if (report) {
      const verdict: ProviderVerdictResult | null = resolveProviderVerdict(providerKey, report);
      if (verdict) {
        let dotColor = "bg-slate-400";
        let textColor = "text-slate-600";

        if (verdict.status === "clean") {
          dotColor = "bg-[#10B981]";
          textColor = "text-emerald-700 font-semibold";
        } else if (verdict.status === "malicious") {
          dotColor = "bg-[#EF4444]";
          textColor = "text-red-700 font-bold";
        } else if (verdict.status === "suspicious") {
          dotColor = "bg-[#D97706]";
          textColor = "text-amber-700 font-semibold";
        } else if (verdict.status === "unavailable") {
          dotColor = "bg-slate-400";
          textColor = "text-slate-500 font-medium";
        } else {
          dotColor = "bg-[#D97706]";
          textColor = "text-amber-700 font-medium";
        }

        return (
          <span className={`flex items-center gap-1.5 ${textColor} truncate`} title={verdict.detailsSummary || verdict.label}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
            <span className="truncate">{verdict.label}</span>
          </span>
        );
      }
    }

    return <span className="text-slate-400">○ standby</span>;
  };

  return (
    <section
      aria-label="Provider Verification Network"
      className="bg-[#F4F5F0] text-slate-800 px-6 sm:px-10 lg:px-16 py-10 sm:py-12 border-t border-[#14362A]"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Title & Legend Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 mb-7 gap-3">
          <h3 className="text-xs font-mono font-medium tracking-[0.14em] text-slate-500 uppercase">
            ONE PASTE ⛶ SIX INDEPENDENT CHECKS + EVIDENCE
          </h3>
          {/* Status Legend Indicators */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>clean</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span>threat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>unknown ≠ safe</span>
            </div>
          </div>
        </div>

        {/* 6 Provider Cards Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-7"
          data-purpose="provider-grid"
        >
          {/* Provider 1: PhishGuard */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-6 h-6 text-slate-700 mb-3">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">PhishGuard</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">reputation</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono">
              {renderProviderStatusBadge("phishGuard")}
            </div>
          </div>

          {/* Provider 2: Safe Browsing */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-6 h-6 text-slate-700 mb-3">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" x2="22" y1="12" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">Safe Browsing</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Google signal</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono">
              {renderProviderStatusBadge("googleSafeBrowsing")}
            </div>
          </div>

          {/* Provider 3: URLhaus */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-6 h-6 text-slate-700 mb-3">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="12" rx="4" width="8" x="8" y="6" />
                  <path d="m19 7-3 2" />
                  <path d="m5 7 3 2" />
                  <path d="m19 17-3-2" />
                  <path d="m5 17 3-2" />
                  <line x1="12" x2="12" y1="2" y2="6" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">URLhaus</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">malware dist.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono">
              {renderProviderStatusBadge("urlhaus")}
            </div>
          </div>

          {/* Provider 4: VirusTotal */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-6 h-6 text-slate-700 mb-3">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">VirusTotal</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">multi-engine</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono">
              {renderProviderStatusBadge("virusTotal")}
            </div>
          </div>

          {/* Provider 5: urlscan.io */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-6 h-6 text-slate-700 mb-3">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">urlscan.io</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">page render</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono">
              {renderProviderStatusBadge("urlscan")}
            </div>
          </div>

          {/* Provider 6: LinkGuard ML */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-6 h-6 text-slate-700 mb-3">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">LinkGuard ML</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">lexical model</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-mono">
              {renderProviderStatusBadge("linkGuardML")}
            </div>
          </div>
        </div>

        {/* Two Callout Clarity Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-purpose="clarity-banners">
          {/* Caution Callout Banner */}
          <div className="bg-[#FBF4E4] border border-[#F1E0B9] rounded-2xl p-4 sm:px-5 sm:py-4 flex items-center gap-3.5 text-xs sm:text-[13px] text-[#7A4B0E] leading-snug">
            <svg
              className="w-5 h-5 flex-shrink-0 text-[#9E6412]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <div>
              <span className="font-bold">Unknown stays amber.</span> Failed or missing provider data is never shown as clean. No-threats-detected is not a guarantee of safety.
            </div>
          </div>

          {/* Protocol / Integrity Callout Banner */}
          <div className="bg-[#EAECE6] border border-[#D8DBD2] rounded-2xl p-4 sm:px-5 sm:py-4 flex items-center gap-3.5 text-xs sm:text-[13px] text-slate-700 leading-snug">
            <svg
              className="w-5 h-5 flex-shrink-0 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <div>
              <span className="font-bold text-slate-900">Evidence before claims.</span> Overall index (out of 100) is kept separate from each provider score, with guidance and limitations attached.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
