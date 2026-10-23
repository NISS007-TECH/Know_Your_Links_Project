"use client";

import React from "react";
import { FileText, ShieldAlert } from "lucide-react";
import { SecurityEvidenceItem } from "@/types/scanner";

interface EvidenceTableProps {
  evidence: SecurityEvidenceItem[];
  warningSources?: string[];
  verdict?: string;
  overallRiskLevel?: string;
}

function getEvidenceBadge(severity: string | undefined): { label: string; badgeClass: string } {
  const norm = (severity || "info").toLowerCase();
  switch (norm) {
    case "critical":
      return {
        label: "CRITICAL",
        badgeClass: "bg-red-50 text-red-900 border-red-300",
      };
    case "high":
      return {
        label: "HIGH",
        badgeClass: "bg-red-50 text-red-900 border-red-300",
      };
    case "medium":
      return {
        label: "MEDIUM",
        badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
      };
    case "low":
      return {
        label: "LOW",
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
      };
    default:
      return {
        label: "INFO",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
      };
  }
}

export function EvidenceTable({
  evidence,
  warningSources,
  verdict,
  overallRiskLevel,
}: EvidenceTableProps) {
  const safeEvidence = Array.isArray(evidence) ? evidence : [];
  const normVerdict = (verdict || "").toUpperCase();
  const normRisk = (overallRiskLevel || "").toUpperCase();
  const isNonClean =
    (warningSources && warningSources.length > 0) ||
    normVerdict.includes("SUSPICIOUS") ||
    normVerdict.includes("MALICIOUS") ||
    normRisk === "MEDIUM" ||
    normRisk === "HIGH" ||
    normRisk === "CRITICAL";

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-7 space-y-5 shadow-sm text-slate-900 print:p-4 print:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1C4839]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Evidence & Observed Threat Signals
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-mono text-slate-600">
            Discovered artifacts, heuristic detections, and telemetry indicators
          </p>
        </div>

        {warningSources && warningSources.length > 0 && (
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-red-900 bg-red-50 border border-red-300 px-3 py-1.5 rounded-lg font-bold">
            <ShieldAlert className="w-4 h-4 text-red-700" />
            <span>Active warnings from: {warningSources.join(", ")}</span>
          </div>
        )}
      </div>

      {safeEvidence.length === 0 ? (
        <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-300 space-y-2">
          <div className="text-sm sm:text-base font-bold text-slate-900">
            {isNonClean
              ? "No structured telemetry evidence rows returned."
              : "No specific negative threat indicators flagged."}
          </div>
          <div className="text-xs sm:text-sm font-mono text-slate-600 max-w-xl mx-auto leading-relaxed">
            {isNonClean ? (
              <span>
                The backend assigned a non-clean composite risk assessment (
                <strong className="text-slate-800 font-bold">{verdict || overallRiskLevel}</strong>
                ), but returned an empty structured evidence table. Explanatory context is limited to
                provider verdict summaries and warning sources.
              </span>
            ) : (
              "Participating reputation and ML providers did not log known malicious patterns for this target."
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-300 rounded-xl shadow-xs">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-slate-100 text-slate-700 font-mono text-xs sm:text-sm uppercase tracking-wider border-b border-slate-300">
              <tr>
                <th className="py-3 px-4 font-bold">Severity</th>
                <th className="py-3 px-4 font-bold">Source</th>
                <th className="py-3 px-4 font-bold">Signal / Observation</th>
                <th className="py-3 px-4 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono">
              {safeEvidence.map((item, index) => {
                const { label, badgeClass } = getEvidenceBadge(item.severity);
                const detailsStr =
                  typeof item.details === "object" && item.details !== null
                    ? JSON.stringify(item.details)
                    : item.details || "—";

                return (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs sm:text-sm font-bold border ${badgeClass}`}>
                        {label}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-900 font-bold text-xs sm:text-sm">
                      {item.source}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-sans font-medium text-sm sm:text-base">
                      {item.signal}
                    </td>
                    <td
                      className="py-3 px-4 text-slate-600 text-xs sm:text-sm max-w-sm font-medium"
                      title={String(detailsStr)}
                    >
                      {detailsStr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
