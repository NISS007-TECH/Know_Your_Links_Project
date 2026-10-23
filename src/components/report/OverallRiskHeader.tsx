"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle, Globe, Compass, CheckCircle2 } from "lucide-react";

interface OverallRiskHeaderProps {
  domain: string;
  overallRiskLevel: string;
  overallRiskScore: number;
  overallRiskScoreMethod?: string;
  verdictSummary: string;
  providerVerdict: string;
  providerRiskScore: number;
  providerRiskLevel: string;
  confidence?: string | number;
  confidenceScore?: number;
  confidenceScoreBasis?: string;
  checkedProvidersCount?: number;
  allProvidersAvailable?: boolean;
}

export function OverallRiskHeader({
  domain,
  overallRiskLevel,
  overallRiskScore,
  overallRiskScoreMethod,
  verdictSummary,
  providerVerdict,
  providerRiskScore,
  providerRiskLevel,
  confidence,
  confidenceScore,
  confidenceScoreBasis,
  checkedProvidersCount = 6,
  allProvidersAvailable = true,
}: OverallRiskHeaderProps) {
  const normOverallLevel = (overallRiskLevel || "UNKNOWN").toUpperCase();
  const normVerdict = (providerVerdict || "").toUpperCase();
  const isInconclusive =
    normOverallLevel === "INCONCLUSIVE" ||
    normOverallLevel === "UNKNOWN" ||
    normVerdict === "INCONCLUSIVE" ||
    verdictSummary.toUpperCase().includes("INCONCLUSIVE");

  let badgeColor = "bg-slate-100 text-slate-800 border-slate-300";
  let icon = <HelpCircle className="w-5 h-5 text-slate-600 shrink-0" />;
  let plainEnglishSummary = "";
  let actionBannerClass = "bg-slate-50 border-slate-300 text-slate-800";
  let actionIcon = <Compass className="w-4 h-4 text-[#1C4839] shrink-0" />;
  let recommendedActionText = "";

  if (isInconclusive) {
    badgeColor = "bg-amber-50 text-amber-900 border-amber-300";
    icon = <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />;
    plainEnglishSummary =
      "There is not enough reliable information to make a confident assessment. One or more security provider checks remain pending, incomplete, or unavailable.";
    actionBannerClass = "bg-amber-50 border-amber-300 text-amber-950";
    actionIcon = <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />;
    recommendedActionText =
      "Do not enter passwords or sensitive information until verified. Type the known official website address directly into your browser.";
  } else if (normOverallLevel === "LOW" || normOverallLevel === "BENIGN" || normOverallLevel === "CLEAN") {
    badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-300";
    icon = <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />;
    plainEnglishSummary =
      "No major threats were detected by the available checks. This does not guarantee that the destination is permanently safe or incapable of being compromised.";
    actionBannerClass = "bg-emerald-50 border-emerald-300 text-emerald-950";
    actionIcon = <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />;
    recommendedActionText =
      "Safe to proceed with normal awareness. Always ensure you typed the expected address correctly and look out for unexpected login prompts.";
  } else if (normOverallLevel === "MEDIUM" || normOverallLevel === "SUSPICIOUS") {
    badgeColor = "bg-amber-50 text-amber-900 border-amber-300";
    icon = <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />;
    plainEnglishSummary =
      "Some warning signals require caution. Verify the destination before entering credentials, making payments, or interacting with unexpected content.";
    actionBannerClass = "bg-amber-50 border-amber-300 text-amber-950";
    actionIcon = <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />;
    recommendedActionText =
      "Do not enter passwords, OTPs, or payment details. If this was sent in an unsolicited message or email, verify with the sender through a trusted separate channel.";
  } else if (
    normOverallLevel === "HIGH" ||
    normOverallLevel === "CRITICAL" ||
    normOverallLevel === "MALICIOUS"
  ) {
    badgeColor = "bg-red-50 text-red-900 border-red-300";
    icon = <ShieldAlert className="w-5 h-5 text-red-700 shrink-0" />;
    plainEnglishSummary =
      "Strong warning signals were reported by security engines. Avoid interacting with this destination unless independently verified through trusted channels.";
    actionBannerClass = "bg-red-50 border-red-300 text-red-950";
    actionIcon = <ShieldAlert className="w-4 h-4 text-red-700 shrink-0" />;
    recommendedActionText =
      "Do not open or interact with this link. Never bypass security warnings, enter personal information, or download files from this location.";
  } else {
    plainEnglishSummary =
      "The security inspection completed with limited data. Review provider breakdowns below for individual findings.";
    recommendedActionText =
      "Exercise standard caution. Type the official destination manually rather than relying on unverified links.";
  }

  const boundedOverallScore = Math.max(0, Math.min(100, Math.round(overallRiskScore)));
  const boundedProviderScore = Math.max(0, Math.min(100, Math.round(providerRiskScore)));

  return (
    <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm text-slate-900 print:p-4 print:shadow-none">
      {/* 1. Scanned Target & Provider Coverage Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#1C4839] shrink-0" />
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-slate-500">
            Destination Domain:
          </span>
          <span className="font-mono text-base sm:text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
            {domain}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {allProvidersAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              All 6 Providers Responded
            </span>
          ) : !isInconclusive && (normOverallLevel === "LOW" || normOverallLevel === "CLEAN" || normOverallLevel === "BENIGN") ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {checkedProvidersCount}/6 Providers Responded (Provisional Safe)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono bg-amber-50 text-amber-900 border border-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              {checkedProvidersCount}/6 Providers Responded (Pending / Partial)
            </span>
          )}
        </div>
      </div>

      {/* 2. Overall Verdict Assessment Details */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-700 uppercase tracking-wider">
            Composite Security Assessment
          </span>
          {overallRiskScoreMethod && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-medium">
              Method: {overallRiskScoreMethod}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`py-2 px-4 rounded-xl border ${badgeColor} flex items-center gap-2 font-mono font-bold tracking-tight text-sm sm:text-base`}
          >
            {icon}
            <span>
              {isInconclusive
                ? "INCONCLUSIVE CONSENSUS"
                : `${normOverallLevel} RISK`}
            </span>
          </div>
          <div className="text-sm font-mono text-slate-700 font-medium">
            Primary Model Verdict: <strong className="text-slate-900 font-bold">{providerVerdict}</strong>
          </div>
        </div>

        {/* Plain-English summary takeaway */}
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-sans font-medium pt-1">
          {plainEnglishSummary}
        </p>

        <p className="text-sm text-slate-600 leading-relaxed font-serif italic border-l-2 border-[#1C4839]/40 pl-3">
          &ldquo;{verdictSummary}&rdquo;
        </p>
      </div>

      {/* 3. Prominent Recommended Next Action Callout */}
      <div className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 ${actionBannerClass}`}>
        {actionIcon}
        <div className="space-y-1 text-sm">
          <span className="font-bold uppercase tracking-wider font-mono text-xs block text-slate-900">
            Recommended Action:
          </span>
          <p className="font-medium leading-relaxed text-slate-800 text-sm sm:text-base">{recommendedActionText}</p>
        </div>
      </div>

      {/* 4. Metric Breakdown Cards (Risk Score vs Overall Risk Score vs Confidence) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200">
        {/* Composite Score */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-1.5">
          <div className="text-xs sm:text-sm font-mono uppercase text-slate-700 font-bold">
            Composite Risk Index
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{boundedOverallScore}</span>
            <span className="text-sm text-slate-600 font-semibold">
              ({isInconclusive ? "Inconclusive" : normOverallLevel})
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 leading-snug">
            Synthesized across responding engines
          </div>
        </div>

        {/* Primary Model Score */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-1.5">
          <div className="text-xs sm:text-sm font-mono uppercase text-slate-700 font-bold">
            Primary Score (risk_score)
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{boundedProviderScore}</span>
            <span className="text-sm text-slate-600 font-semibold">({providerRiskLevel || "Unknown"})</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 leading-snug">
            Direct score from primary pipeline model
          </div>
        </div>

        {/* Heuristic Confidence */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-1.5">
          <div className="text-xs sm:text-sm font-mono uppercase text-slate-700 font-bold">
            Heuristic Confidence
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {typeof confidenceScore === "number"
                ? `${confidenceScore}%`
                : confidence
                ? String(confidence).toUpperCase()
                : "Heuristic"}
            </span>
            {typeof confidenceScore === "number" && confidence && (
              <span className="text-sm text-slate-600 font-semibold">({String(confidence)})</span>
            )}
          </div>
          <div className="text-xs sm:text-sm text-slate-600 leading-snug truncate" title={confidenceScoreBasis || "Heuristic evidence-strength score; not a calibrated probability"}>
            {confidenceScoreBasis || "Heuristic evidence-strength score; not a calibrated probability"}
          </div>
        </div>
      </div>
    </div>
  );
}
