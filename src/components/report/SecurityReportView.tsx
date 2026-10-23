"use client";

import React from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { SecurityReport } from "@/types/scanner";
import { RiskSpeedometer } from "./RiskSpeedometer";
import { TargetMetadata } from "./TargetMetadata";
import { OverallRiskHeader } from "./OverallRiskHeader";
import { ProviderStatusGrid } from "./ProviderStatusGrid";
import { EvidenceTable } from "./EvidenceTable";
import { ActionGuidance } from "./ActionGuidance";
import { LimitationsSection } from "./LimitationsSection";
import { TechnicalGlossary } from "./TechnicalGlossary";

interface SecurityReportViewProps {
  report: SecurityReport;
  onReset: () => void;
}

export function SecurityReportView({ report, onReset }: SecurityReportViewProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const normOverallLevel = (report.overall_risk_level || "UNKNOWN").toUpperCase();
  const normVerdict = (report.verdict || "").toUpperCase();
  const isInconclusive =
    normOverallLevel === "INCONCLUSIVE" ||
    normOverallLevel === "UNKNOWN" ||
    normVerdict === "INCONCLUSIVE" ||
    (report.verdict_summary || "").toUpperCase().includes("INCONCLUSIVE");

  return (
    <div className="w-full">
      {/* 1. Cockpit & Risk Meter Stage: EXACT SAME BACKGROUND AS HERO SECTION (#1C4839 / bg-deep-jade) */}
      <section
        aria-label="Speedometer Cockpit Stage"
        className="w-full bg-[#1C4839] text-white pt-2 sm:pt-4 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-16 print:hidden"
      >
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Top Report Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#285746] print:hidden">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-white bg-[#153428] hover:bg-[#122820] px-4 py-2.5 rounded-xl border border-[#275945] transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8FD14F]" />
              <span>Analyze Another Link</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-white bg-[#153428] hover:bg-[#122820] px-4 py-2.5 rounded-xl border border-[#275945] transition-all shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#8FD14F]" />
                <span>Print Security Report</span>
              </button>
            </div>
          </div>

          {/* Automotive Radial Risk Gauge Cockpit Dashboard */}
          <div className="w-full">
            <RiskSpeedometer
              score={report.overall_risk_score}
              riskLevel={normOverallLevel}
              isInconclusive={isInconclusive}
            />
          </div>
        </div>
      </section>

      {/* 2. Detailed Security Assessment & Evidence Breakdown (Starts after riskmeter) */}
      <section
        aria-label="Security Analysis Report"
        className="w-full bg-[#F1F5F2] text-slate-900 py-10 sm:py-16 px-6 sm:px-10 lg:px-16 border-t border-[#245745]/60 print:p-0 print:border-none print:bg-white [color-scheme:light]"
        style={{ color: "#0F172A" }}
      >
        <div className="max-w-[1400px] mx-auto space-y-6 text-slate-900">
          {/* Quick Security Summary (Composite Assessment & Provider Coverage) */}
          <OverallRiskHeader
            domain={report.domain}
            overallRiskLevel={report.overall_risk_level}
            overallRiskScore={report.overall_risk_score}
            overallRiskScoreMethod={report.overall_risk_score_method}
            verdictSummary={report.verdict_summary}
            providerVerdict={report.verdict}
            providerRiskScore={report.risk_score}
            providerRiskLevel={report.risk_level}
            confidence={report.confidence}
            confidenceScore={report.confidence_score}
            confidenceScoreBasis={report.confidence_score_basis}
            checkedProvidersCount={report.checked_providers}
            allProvidersAvailable={report.all_providers_available}
          />

        {/* 2. Prominent Recommended Safe Actions & Observed Factors */}
        <ActionGuidance
          whyDangerous={report.why_dangerous}
          whySafe={report.why_safe}
          actionGuidance={report.action_guidance}
          verdict={report.verdict}
          overallRiskLevel={report.overall_risk_level}
        />

        {/* 3. Target Record & Infrastructure Telemetry */}
        <TargetMetadata
          url={report.url}
          domain={report.domain}
          scanId={report.scan_id}
          analysisTimeSeconds={report.analysis_time_seconds}
          fromCache={report.from_cache}
          cacheAgeMinutes={report.cache_age_minutes}
          category={report.category}
          context={report.context}
          technicalSummary={report.technical_summary}
          ctData={report.ct_data}
          blacklistStats={report.blacklist_stats}
          communityReports={report.community_reports}
        />

        {/* 4. Plain-English Security Glossary (Educational & Term Help) */}
        <TechnicalGlossary />

        {/* 5. Six Independent Threat Intelligence Providers */}
        <ProviderStatusGrid
          providerStatus={report.provider_status}
          providers={report.providers}
          checkedProvidersCount={report.checked_providers}
          allProvidersAvailable={report.all_providers_available}
        />

        {/* 6. Discovered Artifacts & Threat Evidence */}
        <EvidenceTable
          evidence={report.evidence}
          warningSources={report.overall_risk_warning_sources}
          verdict={report.verdict}
          overallRiskLevel={report.overall_risk_level}
        />

        {/* 7. Methodology, Scoring Rationale & Technical Limitations */}
        <LimitationsSection
          overallRiskLimitations={report.overall_risk_limitations}
          limitations={report.limitations}
          overallRiskScoreReasons={report.overall_risk_score_reasons}
        />
      </div>
    </section>
  </div>
  );
}
