"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Compass, CheckCircle2 } from "lucide-react";

interface ActionGuidanceProps {
  whyDangerous?: string[] | string;
  whySafe?: string[] | string;
  actionGuidance?: string[] | string;
  verdict?: string;
  overallRiskLevel?: string;
}

export function ActionGuidance({
  whyDangerous,
  whySafe,
  actionGuidance,
  verdict,
  overallRiskLevel,
}: ActionGuidanceProps) {
  const dangerousList = Array.isArray(whyDangerous)
    ? whyDangerous
    : whyDangerous
    ? [whyDangerous]
    : [];

  const safeList = Array.isArray(whySafe)
    ? whySafe
    : whySafe
    ? [whySafe]
    : [];

  let guidanceList = Array.isArray(actionGuidance)
    ? actionGuidance
    : actionGuidance
    ? [actionGuidance]
    : [];

  const normVerdict = (verdict || "").toUpperCase();
  const normRisk = (overallRiskLevel || "").toUpperCase();

  // If backend returned no explicit action guidance, provide tailored safe-action recommendations based on findings
  if (guidanceList.length === 0) {
    if (
      normRisk === "HIGH" ||
      normRisk === "CRITICAL" ||
      normRisk === "MALICIOUS" ||
      normVerdict === "MALICIOUS"
    ) {
      guidanceList = [
        "Do not enter passwords, OTPs, recovery codes, or financial account details.",
        "Avoid downloading any files or granting browser/notification permissions.",
        "Verify unexpected messages with the sender through an independent, trusted channel.",
      ];
    } else if (
      normRisk === "MEDIUM" ||
      normRisk === "SUSPICIOUS" ||
      normVerdict === "SUSPICIOUS"
    ) {
      guidanceList = [
        "Do not enter passwords or payment information into unfamiliar or flagged pages.",
        "Open the official website by typing its known address directly into your browser.",
        "Verify unexpected requests with the sender through a separate, trusted channel.",
      ];
    } else if (
      normRisk === "UNKNOWN" ||
      normRisk === "INCONCLUSIVE" ||
      normVerdict === "INCONCLUSIVE"
    ) {
      guidanceList = [
        "If provider analysis is pending, wait for more information before interacting.",
        "Avoid sharing confidential information until the destination is independently verified.",
        "Search for the organization's official website rather than relying on link redirects.",
      ];
    } else {
      guidanceList = [
        "Always confirm you typed the exact expected domain name in your browser address bar.",
        "Remember that even authentic sites can be compromised; never share MFA verification codes.",
        "Review unfamiliar forms carefully before submitting personal information.",
      ];
    }
  }

  const sectionCount =
    (dangerousList.length > 0 ? 1 : 0) +
    (safeList.length > 0 ? 1 : 0) +
    (guidanceList.length > 0 ? 1 : 0);

  const gridColsClass =
    sectionCount === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : sectionCount === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1";

  return (
    <div className={`grid ${gridColsClass} gap-4 text-slate-900`}>
      {/* 1. Recommended Actions (Prominent) */}
      {guidanceList.length > 0 && (
        <div className="bg-white border border-slate-300 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm uppercase tracking-wider font-mono">
              <Compass className="w-5 h-5 text-[#1C4839] shrink-0" />
              <span>Recommended Safe Actions</span>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              {guidanceList.map((guideline, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1C4839] shrink-0 mt-1" />
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs font-mono text-slate-500 pt-3 border-t border-slate-200">
            *Safe actions tailored to observed threat level
          </div>
        </div>
      )}

      {/* 2. Risk Factors */}
      {dangerousList.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-red-900 font-bold text-sm uppercase tracking-wider font-mono">
              <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
              <span>Observed Warning Factors</span>
            </div>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-800 list-disc list-inside leading-relaxed font-medium">
              {dangerousList.map((reason, idx) => (
                <li key={idx} className="pl-1">
                  {reason}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs font-mono text-red-700/80 pt-3 border-t border-red-200">
            *Identified by participating threat feeds or heuristics
          </div>
        </div>
      )}

      {/* 3. Verification & Positive Safety Factors */}
      {safeList.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm uppercase tracking-wider font-mono">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Verification & Safety Signals</span>
            </div>
            <ul className="space-y-2.5 text-sm sm:text-base text-slate-800 list-disc list-inside leading-relaxed font-medium">
              {safeList.map((factor, idx) => (
                <li key={idx} className="pl-1">
                  {factor}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs font-mono text-emerald-700/80 pt-3 border-t border-emerald-200">
            *Positive indicators (*not a permanent safety guarantee)
          </div>
        </div>
      )}
    </div>
  );
}

