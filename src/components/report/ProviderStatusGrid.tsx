"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Server,
  ExternalLink,
} from "lucide-react";
import { ProviderStatusMap, ProvidersMap } from "@/types/scanner";
import {
  evaluatePhishGuard,
  evaluateGoogleSafeBrowsing,
  evaluateUrlhaus,
  evaluateVirusTotal,
  evaluateUrlscan,
  evaluateLinkGuardML,
  ProviderVerdictResult,
} from "@/lib/providerEvaluator";

interface ProviderStatusGridProps {
  providerStatus: ProviderStatusMap;
  providers: ProvidersMap;
  checkedProvidersCount: number;
  allProvidersAvailable: boolean;
}

interface ProviderMeta {
  key: string;
  displayName: string;
  type: "Reputation Feed" | "Threat Intelligence" | "Machine Learning" | "Heuristic Sandbox";
  description: string;
}

const PROVIDER_LIMITATION_NOTES: Record<string, string> = {
  phishGuard: "Evaluates phishing lures, domain age, and heuristic tokens; verified safe list prevents false positives.",
  googleSafeBrowsing: "Absence from Google Safe Browsing does not guarantee zero-day safety for new evasion campaigns.",
  urlhaus: "Dedicated malware URL database; clean indicates no current active threat distribution listing in abuse.ch.",
  virusTotal: "Aggregates 70+ antivirus engines. A provisional queued state indicates background multi-engine processing.",
  urlscan: "Sandbox DOM inspection captures page title and network redirects; does not execute deep interactive scripts.",
  linkGuardML: "Statistical gradient boosting classifier. A benign prediction is an indicator, not a safety guarantee.",
};

const PROVIDERS_CATALOG: ProviderMeta[] = [
  {
    key: "phishGuard",
    displayName: "PhishGuard",
    type: "Reputation Feed",
    description: "Targeted phishing registry, credential-harvesting lure inspection, and risk scoring.",
  },
  {
    key: "googleSafeBrowsing",
    displayName: "Google Safe Browsing",
    type: "Threat Intelligence",
    description: "Industry threat list for malware, deceptive social engineering, and unwanted software.",
  },
  {
    key: "urlhaus",
    displayName: "URLhaus (abuse.ch)",
    type: "Threat Intelligence",
    description: "Cyber threat intelligence database sharing active malware distribution sites and payloads.",
  },
  {
    key: "virusTotal",
    displayName: "VirusTotal",
    type: "Threat Intelligence",
    description: "Multi-scanner threat aggregator analyzing domain reputation across 70+ antivirus engines.",
  },
  {
    key: "urlscan",
    displayName: "urlscan.io",
    type: "Heuristic Sandbox",
    description: "Automated URL sandbox inspecting page DOM, redirects, and network requests.",
  },
  {
    key: "linkGuardML",
    displayName: "LinkGuard ML",
    type: "Machine Learning",
    description: "Gradient boosting lexical classifier inspecting brand impersonation, entropy, and structural anomalies.",
  },
];

export function ProviderStatusGrid({
  providerStatus,
  providers,
  checkedProvidersCount,
  allProvidersAvailable,
}: ProviderStatusGridProps) {
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedProviders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getProviderVerdict = (key: string): ProviderVerdictResult => {
    const isAvailable = Boolean(providerStatus?.[key]);
    const data = providers?.[key] as Record<string, unknown> | undefined;

    switch (key) {
      case "phishGuard":
        return evaluatePhishGuard(data, isAvailable);
      case "googleSafeBrowsing":
        return evaluateGoogleSafeBrowsing(data, isAvailable);
      case "urlhaus":
        return evaluateUrlhaus(data, isAvailable);
      case "virusTotal":
        return evaluateVirusTotal(data, isAvailable);
      case "urlscan":
        return evaluateUrlscan(data, isAvailable);
      case "linkGuardML":
        return evaluateLinkGuardML(data, isAvailable);
      default:
        return {
          status: "unknown",
          label: "Unknown",
          badgeClass: "text-ink-subtle",
        };
    }
  };

  const renderBadge = (res: ProviderVerdictResult) => {
    switch (res.status) {
      case "malicious":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold bg-red-50 text-red-900 border border-red-300">
            <AlertOctagon className="w-4 h-4 shrink-0 text-red-700" />
            <span>{res.label}</span>
          </span>
        );
      case "suspicious":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
            <span>{res.label}</span>
          </span>
        );
      case "clean":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>{res.label}</span>
          </span>
        );
      case "unavailable":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            <XCircle className="w-4 h-4 shrink-0 text-slate-500" />
            <span>{res.label}</span>
          </span>
        );
      default: {
        const isQueued =
          res.label.toLowerCase().includes("queued") ||
          res.label.toLowerCase().includes("pending");
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-semibold ${
              isQueued
                ? "bg-amber-50 text-amber-900 border border-amber-300"
                : "bg-slate-100 text-slate-700 border border-slate-300"
            }`}
          >
            <HelpCircle
              className={`w-4 h-4 shrink-0 ${
                isQueued ? "text-amber-700" : "text-slate-500"
              }`}
            />
            <span>{res.label}</span>
          </span>
        );
      }
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-6 space-y-6 shadow-sm text-slate-900 print:p-4 print:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#1C4839]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Threat Intelligence & Provider Status
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-600">
            Consolidated consensus from 6 independent security inspection engines
          </p>
        </div>

        <div className="flex items-center gap-2">
          {allProvidersAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              All 6 Providers Responded
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono bg-amber-50 text-amber-900 border border-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              {checkedProvidersCount}/6 Providers Responded
            </span>
          )}
        </div>
      </div>

      {/* 6 Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROVIDERS_CATALOG.map((provider) => {
          const result = getProviderVerdict(provider.key);
          const rawData = providers?.[provider.key];
          const isExpanded = Boolean(expandedProviders[provider.key]);
          const hasDetails = Boolean(rawData && typeof rawData === "object" && Object.keys(rawData).length > 0);

          return (
            <div
              key={provider.key}
              className="bg-slate-50 border border-slate-300 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:border-slate-400 transition-colors shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                      {provider.displayName}
                    </h4>
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      {provider.type}
                    </span>
                  </div>
                  {renderBadge(result)}
                </div>

                {result.detailsSummary && (
                  <p className="text-xs sm:text-sm font-mono text-slate-900 font-bold">
                    • {result.detailsSummary}
                  </p>
                )}

                {/* Provider-specific rich telemetry */}
                {Boolean(provider.key === "linkGuardML" && rawData && typeof rawData === "object" && "probabilities" in rawData && (rawData as Record<string, unknown>).probabilities) && (
                  <div className="text-xs font-mono bg-white p-2.5 rounded border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-700">Model Predictions:</div>
                    <div className="flex flex-wrap gap-1.5 text-slate-600">
                      {Object.entries((rawData as Record<string, unknown>).probabilities as Record<string, number>).map(([lbl, val]) => (
                        <span key={lbl} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {lbl}: {typeof val === "number" ? val.toFixed(1) : String(val)}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Boolean(provider.key === "urlscan" && rawData && typeof rawData === "object" && "pageTitle" in rawData && (rawData as Record<string, unknown>).pageTitle) && (
                  <div className="text-xs sm:text-sm font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-500 text-xs block">Captured Page Title:</span>
                    <span className="font-bold text-slate-900 truncate block">{String((rawData as Record<string, unknown>).pageTitle)}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {provider.description}
                </p>

                {/* Important Signal or Limitation Note (Section 4) */}
                {PROVIDER_LIMITATION_NOTES[provider.key] && (
                  <div className="text-xs font-mono text-slate-600 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                    <span className="font-bold text-slate-800 uppercase text-xs tracking-wider block mb-0.5">
                      Coverage Note:
                    </span>
                    <span>{PROVIDER_LIMITATION_NOTES[provider.key]}</span>
                  </div>
                )}

                {/* External Provider Report Link (Section 4) */}
                {Boolean(rawData && typeof rawData === "object" && "reportUrl" in rawData && (rawData as Record<string, unknown>).reportUrl) && (
                  <div className="pt-1">
                    <a
                      href={String((rawData as Record<string, unknown>).reportUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono text-[#1C4839] hover:underline font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs hover:border-slate-400 transition-colors"
                      title={`Open verified external scan report on ${provider.displayName}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#1C4839]" />
                      <span>View Full {provider.displayName} Report ↗</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Collapsible raw details */}
              <div className="pt-2 border-t border-slate-200 print:hidden">
                <button
                  type="button"
                  onClick={() => toggleExpand(provider.key)}
                  disabled={!hasDetails}
                  className={`w-full flex items-center justify-between text-xs sm:text-sm font-mono transition-colors cursor-pointer ${
                    hasDetails
                      ? "text-[#1C4839] hover:text-black font-bold"
                      : "text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>
                    {hasDetails
                      ? isExpanded
                        ? "Collapse output"
                        : "Inspect provider output"
                      : "No raw payload returned"}
                  </span>
                {hasDetails ? (
                  isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )
                ) : null}
              </button>

              {isExpanded && hasDetails ? (
                <div className="mt-2.5 p-3 bg-white rounded-lg border border-slate-300 max-h-48 overflow-y-auto text-xs font-mono text-slate-800 select-all break-all">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(rawData, null, 2)}
                  </pre>
                </div>
              ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
