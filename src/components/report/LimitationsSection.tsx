"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

interface LimitationsSectionProps {
  overallRiskLimitations?: string[];
  limitations?: string[];
  overallRiskScoreReasons?: string[];
}

export function LimitationsSection({
  overallRiskLimitations,
  limitations,
  overallRiskScoreReasons,
}: LimitationsSectionProps) {
  const allLimitations = Array.from(
    new Set([...(overallRiskLimitations || []), ...(limitations || [])])
  );

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-xl p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-800 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
        <HelpCircle className="w-5 h-5 text-slate-600 shrink-0" />
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs sm:text-sm font-mono">
          Methodology & Analysis Limitations
        </h4>
      </div>

      {overallRiskScoreReasons && overallRiskScoreReasons.length > 0 ? (
        <div className="space-y-2">
          <div className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
            Algorithm Scoring Rationale:
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {overallRiskScoreReasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
            Algorithm Scoring Rationale:
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-600 italic">
            No specific algorithmic scoring rationale strings returned in backend response payload.
          </p>
        </div>
      )}

      {allLimitations.length > 0 && (
        <div className="space-y-2">
          <div className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
            Documented Technical Limitations:
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {allLimitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-3 text-xs sm:text-sm font-mono text-slate-600 border-t border-slate-200 leading-relaxed">
        <strong className="text-slate-900">Trust Research Note:</strong> The overall risk score is calculated via rule-based multi-engine consensus and heuristic feature weighting. It must not be interpreted as a statistical probability of compromise. Newly registered malicious domains and zero-day phishing campaigns may not appear on threat intelligence feeds immediately.
      </div>
    </div>
  );
}
