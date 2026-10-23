import {
  ProviderStatusMap,
  ProvidersMap,
  SecurityReport,
} from "@/types/scanner";

export interface ProviderVerdictResult {
  status: "malicious" | "suspicious" | "clean" | "unknown" | "unavailable";
  label: string;
  badgeClass: string;
  detailsSummary?: string;
}

export function evaluatePhishGuard(
  data: Record<string, unknown> | undefined,
  isAvailable: boolean
): ProviderVerdictResult {
  if (!isAvailable || !data || Object.keys(data).length === 0) {
    return {
      status: "unavailable",
      label: "Unavailable",
      badgeClass: "text-amber-500",
      detailsSummary: "Provider feed unavailable",
    };
  }

  const riskLevel = String(data.riskLevel || "").toUpperCase();
  const verdictSummary = String(
    data.verdictSummary || data.verdict || ""
  ).toUpperCase();
  const riskScore =
    typeof data.riskScore === "number"
      ? data.riskScore
      : typeof data.score === "number"
      ? data.score
      : null;

  // Prioritize explicit provider verdict & risk level
  if (
    riskLevel === "CRITICAL" ||
    verdictSummary.includes("MALICIOUS") ||
    (riskLevel === "" && riskScore !== null && riskScore >= 75)
  ) {
    return {
      status: "malicious",
      label: riskLevel ? `Threat (${riskLevel})` : "Threat Flagged",
      badgeClass: "text-red-500",
      detailsSummary:
        riskScore !== null ? `Risk Score: ${riskScore}/100` : undefined,
    };
  }

  if (
    riskLevel === "HIGH" ||
    riskLevel === "MEDIUM" ||
    verdictSummary.includes("SUSPICIOUS") ||
    (riskLevel === "" && riskScore !== null && riskScore >= 30)
  ) {
    return {
      status: "suspicious",
      label: "Suspicious",
      badgeClass: "text-amber-500",
      detailsSummary:
        riskScore !== null ? `Risk Score: ${riskScore}/100` : undefined,
    };
  }

  if (data.status === "partial" || data.status === "queued") {
    return {
      status: "unknown",
      label: "Queued (Partial)",
      badgeClass: "text-amber-700",
      detailsSummary: "PhishGuard heuristic evaluation in progress",
    };
  }

  const isExplicitlyClean =
    riskLevel === "LOW" ||
    verdictSummary.includes("CLEAN") ||
    verdictSummary.includes("BENIGN") ||
    verdictSummary.includes("SAFE") ||
    (riskLevel === "" && riskScore !== null && riskScore < 25);

  if (isExplicitlyClean) {
    return {
      status: "clean",
      label: "Clean",
      badgeClass: "text-emerald-600",
      detailsSummary:
        riskScore !== null ? `Risk Score: ${riskScore}/100` : undefined,
    };
  }

  return {
    status: "unknown",
    label: "Unknown (No Data)",
    badgeClass: "text-amber-600",
    detailsSummary: "Provider returned insufficient evaluation data",
  };
}

export function evaluateVirusTotal(
  data: Record<string, unknown> | undefined,
  isAvailable: boolean
): ProviderVerdictResult {
  if (!data || Object.keys(data).length === 0) {
    return {
      status: "unavailable",
      label: "Unavailable",
      badgeClass: "text-slate-500",
      detailsSummary: "Provider feed unavailable",
    };
  }

  // Support partial or queued VirusTotal telemetry
  if (!isAvailable && (data.status === "partial" || data.analysisStatus === "queued" || data.verdict === "PROVISIONAL_NO_FLAGS")) {
    return {
      status: "unknown",
      label: "Queued (Partial)",
      badgeClass: "text-amber-700",
      detailsSummary: String(data.message || "Provisional analysis queued; 0 flags flagged so far"),
    };
  }

  if (!isAvailable) {
    return {
      status: "unavailable",
      label: "Unavailable",
      badgeClass: "text-slate-500",
      detailsSummary: "Provider feed unavailable",
    };
  }

  const stats = (data.stats ||
    data.last_analysis_stats ||
    data.analysis_stats) as Record<string, number> | undefined;

  const malicious =
    typeof stats?.malicious === "number"
      ? stats.malicious
      : typeof data.malicious === "number"
      ? data.malicious
      : 0;

  const suspicious =
    typeof stats?.suspicious === "number"
      ? stats.suspicious
      : typeof data.suspicious === "number"
      ? data.suspicious
      : 0;

  const harmless =
    typeof stats?.harmless === "number"
      ? stats.harmless
      : typeof data.harmless === "number"
      ? data.harmless
      : 0;

  const undetected =
    typeof stats?.undetected === "number"
      ? stats.undetected
      : typeof data.undetected === "number"
      ? data.undetected
      : 0;

  const verdict = String(data.verdict || "").toUpperCase();

  if (malicious > 0 || verdict === "MALICIOUS") {
    return {
      status: "malicious",
      label: malicious > 0 ? `${malicious} Malicious Flags` : "Threat Flagged",
      badgeClass: "text-red-500",
      detailsSummary: `${malicious} malicious / ${suspicious} suspicious`,
    };
  }

  if (suspicious > 0 || verdict === "SUSPICIOUS") {
    return {
      status: "suspicious",
      label: `${suspicious} Suspicious Flags`,
      badgeClass: "text-amber-500",
      detailsSummary: `${suspicious} engines flagged suspicious`,
    };
  }

  const totalScanned = harmless + undetected;
  if (
    malicious === 0 &&
    suspicious === 0 &&
    (totalScanned > 0 || verdict === "CLEAN" || data.clean === true)
  ) {
    return {
      status: "clean",
      label: "Clean",
      badgeClass: "text-emerald-600",
      detailsSummary:
        totalScanned > 0 ? `Clean across ${totalScanned} engines` : "0 engines flagged",
    };
  }

  return {
    status: "unknown",
    label: "Unknown (No Data)",
    badgeClass: "text-amber-600",
    detailsSummary: "VirusTotal returned incomplete engine statistics",
  };
}

export function evaluateGoogleSafeBrowsing(
  data: Record<string, unknown> | undefined,
  isAvailable: boolean
): ProviderVerdictResult {
  if (!isAvailable || !data || Object.keys(data).length === 0) {
    return {
      status: "unavailable",
      label: "Unavailable",
      badgeClass: "text-amber-500",
      detailsSummary: "Provider feed unavailable",
    };
  }

  const matches = data.matches || data.threatMatches || data.threats;
  const isThreat = data.isThreat === true || data.isMalicious === true || data.threatFound === true;
  const verdict = String(data.verdict || "").toUpperCase();
  const threatType = data.threatType ? String(data.threatType) : null;

  if (
    (Array.isArray(matches) && matches.length > 0) ||
    isThreat ||
    verdict === "MALICIOUS" ||
    verdict === "THREAT" ||
    threatType
  ) {
    return {
      status: "malicious",
      label: threatType ? `Threat (${threatType})` : "Threat Flagged",
      badgeClass: "text-red-500",
      detailsSummary: threatType || "Listed in Safe Browsing blacklist",
    };
  }

  const hasEmptyMatches = Array.isArray(matches) && matches.length === 0;
  const isExplicitlySafe =
    data.threatFound === false ||
    hasEmptyMatches ||
    data.safe === true ||
    data.isThreat === false ||
    verdict === "CLEAN" ||
    data.clean === true;

  if (isExplicitlySafe) {
    return {
      status: "clean",
      label: "Clean",
      badgeClass: "text-emerald-600",
      detailsSummary: "No blacklisted matches found",
    };
  }

  if (data.status === "queued" || data.status === "pending") {
    return {
      status: "unknown",
      label: "Queued (Pending)",
      badgeClass: "text-amber-700",
      detailsSummary: "Google Safe Browsing check in progress",
    };
  }

  return {
    status: "unknown",
    label: "Unknown (No Data)",
    badgeClass: "text-amber-600",
    detailsSummary: "No definitive match data returned",
  };
}

export function evaluateUrlhaus(
  data: Record<string, unknown> | undefined,
  isAvailable: boolean
): ProviderVerdictResult {
  if (!isAvailable || !data || Object.keys(data).length === 0) {
    return {
      status: "unavailable",
      label: "Unavailable",
      badgeClass: "text-amber-500",
      detailsSummary: "Provider feed unavailable",
    };
  }

  const queryStatus = String(data.queryStatus || data.query_status || "").toLowerCase();
  const threat = data.threat ? String(data.threat) : null;
  const urlStatus = data.urlStatus || data.url_status ? String(data.urlStatus || data.url_status) : null;
  const verdict = String(data.verdict || "").toUpperCase();
  const isMalicious =
    data.threatFound === true ||
    data.isMalicious === true ||
    verdict === "MALICIOUS" ||
    queryStatus === "ok";

  if (isMalicious || threat || urlStatus === "online") {
    return {
      status: "malicious",
      label: threat ? `Malware (${threat})` : "Malware Listed",
      badgeClass: "text-red-500",
      detailsSummary:
        threat || (urlStatus ? `Status: ${urlStatus}` : "Found in URLhaus database"),
    };
  }

  const isExplicitlyClean =
    data.threatFound === false ||
    queryStatus === "no_results" ||
    data.isMalicious === false ||
    verdict === "CLEAN" ||
    data.clean === true;

  if (isExplicitlyClean) {
    return {
      status: "clean",
      label: "Clean",
      badgeClass: "text-emerald-600",
      detailsSummary: "Not listed in URLhaus database",
    };
  }

  if (data.status === "queued" || data.status === "pending" || queryStatus === "pending" || data.status === "partial") {
    return {
      status: "unknown",
      label: "Queued (Partial)",
      badgeClass: "text-amber-700",
      detailsSummary: "URLhaus malware lookup in progress",
    };
  }

  return {
    status: "unknown",
    label: "Unknown (No Data)",
    badgeClass: "text-amber-600",
    detailsSummary: "URLhaus returned unrecognized query status",
  };
}

export function evaluateUrlscan(
  data: Record<string, unknown> | undefined,
  isAvailable: boolean
): ProviderVerdictResult {
  if (!isAvailable || !data || Object.keys(data).length === 0) {
    return {
      status: "unavailable",
      label: "Unavailable",
      badgeClass: "text-amber-500",
      detailsSummary: "Provider feed unavailable",
    };
  }

  const verdicts = data.verdicts as
    | {
        overall?: { malicious?: boolean; score?: number };
        engines?: { maliciousTotal?: number; suspiciousTotal?: number };
      }
    | undefined;

  const score =
    typeof data.score === "number" ? data.score : verdicts?.overall?.score;
  const verdictStr = String(data.verdict || "").toUpperCase();

  const isMalicious =
    data.malicious === true ||
    verdicts?.overall?.malicious === true ||
    verdictStr === "MALICIOUS" ||
    (typeof score === "number" && score >= 50) ||
    (verdicts?.engines?.maliciousTotal !== undefined &&
      verdicts.engines.maliciousTotal > 0);

  const isSuspicious =
    (typeof score === "number" && score > 0 && score < 50) ||
    (verdicts?.engines?.suspiciousTotal !== undefined &&
      verdicts.engines.suspiciousTotal > 0) ||
    verdictStr === "SUSPICIOUS";

  if (isMalicious) {
    return {
      status: "malicious",
      label: "Threat Flagged",
      badgeClass: "text-red-500",
      detailsSummary:
        score !== undefined ? `Risk Score: ${score}` : "Flagged by urlscan engines",
    };
  }

  if (isSuspicious) {
    return {
      status: "suspicious",
      label: "Suspicious",
      badgeClass: "text-amber-500",
      detailsSummary:
        score !== undefined ? `Risk Score: ${score}` : "Heuristic flags detected",
    };
  }

  const isExplicitlyCompleted =
    verdicts !== undefined ||
    data.status === "completed" ||
    data.malicious === false ||
    score === 0 ||
    data.clean === true ||
    verdictStr === "CLEAN" ||
    verdictStr === "NO_THREAT_DETECTED";

  if (isExplicitlyCompleted) {
    return {
      status: "clean",
      label: "No Flags*",
      badgeClass: "text-emerald-600",
      detailsSummary: "No sandbox anomalies observed (*not a safety guarantee)",
    };
  }

  if (data.status === "queued" || data.status === "pending" || data.analysisStatus === "queued") {
    return {
      status: "unknown",
      label: "Queued (Pending)",
      badgeClass: "text-amber-700",
      detailsSummary: "urlscan sandbox render queued or pending",
    };
  }

  return {
    status: "unknown",
    label: "Unknown (No Data)",
    badgeClass: "text-amber-600",
    detailsSummary: "urlscan returned insufficient scan data",
  };
}

export function evaluateLinkGuardML(
  data: Record<string, unknown> | undefined,
  isAvailable: boolean
): ProviderVerdictResult {
  if (!isAvailable || !data || Object.keys(data).length === 0) {
    return {
      status: "unavailable",
      label: "Unavailable",
      badgeClass: "text-amber-500",
      detailsSummary: "Provider feed unavailable",
    };
  }

  const verdict = String(data.verdict || data.modelPrediction || "").toUpperCase();
  const riskLevel = String(data.riskLevel || "").toUpperCase();
  const signals = data.signals as Record<string, unknown> | undefined;
  const brandImpersonation = Boolean(signals?.brandImpersonation);
  const confidence =
    typeof data.confidence === "number" ? data.confidence : null;

  if (verdict === "MALICIOUS" || riskLevel === "HIGH") {
    return {
      status: "malicious",
      label: "High Risk ML",
      badgeClass: "text-red-500",
      detailsSummary:
        confidence !== null
          ? `Model confidence: ${confidence}%`
          : "ML classifier flagged target",
    };
  }

  if (verdict === "SUSPICIOUS" || riskLevel === "MEDIUM" || brandImpersonation) {
    return {
      status: "suspicious",
      label: brandImpersonation ? "Brand Impersonation" : "Suspicious ML",
      badgeClass: "text-amber-500",
      detailsSummary: brandImpersonation
        ? "Potential brand impersonation detected"
        : confidence !== null
        ? `Model confidence: ${confidence}%`
        : undefined,
    };
  }

  if (verdict === "BENIGN" || riskLevel === "LOW") {
    return {
      status: "clean",
      label: "Benign ML*",
      badgeClass: "text-emerald-600",
      detailsSummary:
        confidence !== null
          ? `Model confidence: ${confidence}% (*not a guarantee)`
          : "Classified benign (*not a guarantee)",
    };
  }

  if (data.status === "queued" || data.status === "pending") {
    return {
      status: "unknown",
      label: "Queued (Pending)",
      badgeClass: "text-amber-700",
      detailsSummary: "LinkGuard ML inference in progress",
    };
  }

  return {
    status: "unknown",
    label: "Unknown (No Data)",
    badgeClass: "text-amber-600",
    detailsSummary: "ML classifier returned insufficient feature data",
  };
}

export function resolveProviderVerdict(
  providerKey: string,
  report: SecurityReport | null | undefined
): ProviderVerdictResult | null {
  if (!report) return null;

  const isAvailable = Boolean(report.provider_status?.[providerKey]);
  const data = report.providers?.[providerKey] as
    | Record<string, unknown>
    | undefined;

  switch (providerKey) {
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
      return null;
  }
}
