"use client";

import React, { useState } from "react";
import { Globe, Copy, Check, Clock } from "lucide-react";
import { defangUrl } from "@/lib/urlUtils";

interface TargetMetadataProps {
  url: string;
  domain: string;
  scanId?: string;
  analysisTimeSeconds?: number;
  fromCache?: boolean;
  cacheAgeMinutes?: number;
  category?: string;
  context?: string;
  technicalSummary?: Record<string, unknown>;
  ctData?: { certificates_found?: number; issuers?: string[]; oldest_cert?: string };
  blacklistStats?: { total_domains?: number; total_urls?: number };
  communityReports?: { phishing_reports?: number; safe_reports?: number; total_reports?: number };
}

export function TargetMetadata({
  url,
  domain,
  scanId,
  analysisTimeSeconds,
  fromCache,
  cacheAgeMinutes,
  category,
  context,
  technicalSummary,
  ctData,
  blacklistStats,
  communityReports,
}: TargetMetadataProps) {
  const [copiedType, setCopiedType] = useState<"defanged" | "raw" | null>(null);
  const defanged = defangUrl(url);

  const handleCopy = async (text: string, type: "defanged" | "raw") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // Ignore copy error
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-7 space-y-5 shadow-sm text-slate-900 print:p-4 print:shadow-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#1C4839]" />
          <span className="text-base sm:text-lg font-mono font-bold uppercase tracking-wider text-slate-800">
            Target Inspection Record
          </span>
          {fromCache && (
            <span className="text-xs sm:text-sm font-mono px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
              Cached Telemetry {cacheAgeMinutes ? `(${cacheAgeMinutes}m ago)` : ""}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-slate-600">
          {scanId && (
            <span className="px-3 py-1 bg-slate-100 rounded border border-slate-300 text-xs sm:text-sm text-slate-700 font-semibold">
              ID: {scanId.substring(0, 12)}...
            </span>
          )}
          {analysisTimeSeconds !== undefined && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded border border-slate-300 text-xs sm:text-sm text-slate-700 font-semibold">
              <Clock className="w-4 h-4 text-slate-500" />
              {analysisTimeSeconds}s
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="text-base font-bold font-mono text-slate-800">
          Defanged Target Representation (Safe for logging & sharing):
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1 bg-slate-100 font-mono text-base sm:text-lg text-slate-900 p-3.5 rounded-xl border border-slate-300 break-all select-all font-bold">
            {defanged}
          </div>

          <div className="flex items-center gap-2 shrink-0 print:hidden">
            <button
              type="button"
              onClick={() => handleCopy(defanged, "defanged")}
              className="px-4 py-2.5 text-sm sm:text-base font-mono bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-800 font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              title="Copy defanged safe URL"
            >
              {copiedType === "defanged" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Defanged</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleCopy(url, "raw")}
              className="px-4 py-2.5 text-sm sm:text-base font-mono bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-800 font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              title="Copy raw destination string"
            >
              {copiedType === "raw" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Raw</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm sm:text-base font-mono text-slate-700 pt-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-slate-900 font-bold">Registered Host / Domain:</span>{" "}
          <span className="text-[#1C4839] font-bold text-base sm:text-lg underline decoration-[#91C7B7]">{domain}</span>

          {category && (
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm">
              {category}
            </span>
          )}

          {context && (
            <span className="px-3 py-1 rounded-full bg-[#1C4839]/10 text-[#1C4839] border border-[#1C4839]/20 font-bold text-xs sm:text-sm">
              Context: {context}
            </span>
          )}
        </div>

        {/* Telemetry quick indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold">
          {ctData?.certificates_found !== undefined && (
            <span className="px-3 py-1 rounded bg-slate-50 border border-slate-300 text-slate-700">
              CT Logs: {ctData.certificates_found} certs
            </span>
          )}
          {communityReports && (
            <span className="px-3 py-1 rounded bg-slate-50 border border-slate-300 text-slate-700">
              Community: {communityReports.phishing_reports || 0} flags
            </span>
          )}
        </div>
      </div>

      {/* Technical Infrastructure Summary */}
      {technicalSummary && typeof technicalSummary === "object" && Object.keys(technicalSummary).length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <div className="text-sm sm:text-base font-mono font-bold text-slate-800 uppercase tracking-wider mb-3">
            Host & Certificate Telemetry
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
            {Boolean(technicalSummary.server_ip) && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200" title="Public IP address hosting this destination">
                <div className="text-slate-600 text-xs sm:text-sm font-semibold">Server IP</div>
                <div className="font-extrabold text-slate-900 truncate text-sm sm:text-base mt-0.5" title={String(technicalSummary.server_ip)}>
                  {String(technicalSummary.server_ip)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Hosting node</div>
              </div>
            )}
            {typeof technicalSummary.domain_age_days === "number" && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200" title="Days since domain registration; brand-new domains have higher phishing risk">
                <div className="text-slate-600 text-xs sm:text-sm font-semibold">Domain Age</div>
                <div className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                  {technicalSummary.domain_age_days}d ({Math.floor(technicalSummary.domain_age_days / 365)}y)
                </div>
                <div className="text-xs text-slate-500 mt-1">Registered age</div>
              </div>
            )}
            {Boolean(technicalSummary.registrar) && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200" title="Organization managing domain registration">
                <div className="text-slate-600 text-xs sm:text-sm font-semibold">Registrar</div>
                <div className="font-extrabold text-slate-900 truncate text-sm sm:text-base mt-0.5" title={String(technicalSummary.registrar)}>
                  {String(technicalSummary.registrar)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Authority</div>
              </div>
            )}
            {Boolean(technicalSummary.ssl_version) && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200" title="Transport Layer Security version encrypting data in transit">
                <div className="text-slate-600 text-xs sm:text-sm font-semibold">TLS Version</div>
                <div className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                  {String(technicalSummary.ssl_version)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Transport cipher</div>
              </div>
            )}
            {typeof technicalSummary.days_until_expiry === "number" && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200" title="Days until SSL certificate must be renewed">
                <div className="text-slate-600 text-xs sm:text-sm font-semibold">SSL Expiry</div>
                <div className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                  {technicalSummary.days_until_expiry}d remaining
                </div>
                <div className="text-xs text-slate-500 mt-1">Cert validity</div>
              </div>
            )}
            {(technicalSummary.has_spf !== undefined || technicalSummary.has_dmarc !== undefined) && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200" title="Email authentication protecting domain from sender spoofing">
                <div className="text-slate-600 text-xs sm:text-sm font-semibold">Mail Records</div>
                <div className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                  {technicalSummary.has_spf ? "SPF ✓" : "SPF ✗"} {technicalSummary.has_dmarc ? "DMARC ✓" : "DMARC ✗"}
                </div>
                <div className="text-xs text-slate-500 mt-1">Spoof defense</div>
              </div>
            )}
          </div>
          <div className="text-xs sm:text-sm font-mono text-slate-600 mt-3 leading-relaxed">
            *Host telemetry reflects network and transport-level configuration. Valid SSL encryption does not guarantee website trustworthiness.
          </div>
        </div>
      )}
    </div>
  );
}
