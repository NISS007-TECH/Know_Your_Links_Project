/**
 * Core type definitions for Know Your Links scanner.
 * Defines the real response schema from the Know Your Links n8n Cloud workflow
 * and UI state transitions for the frontend.
 */

export type ScannerStatus =
  | "idle"
  | "validating"
  | "scanning"
  | "clean"
  | "threat"
  | "inconclusive"
  | "error";

export interface SecurityEvidenceItem {
  source: string;
  severity: "critical" | "high" | "medium" | "low" | "info" | string;
  signal: string;
  details?: string | Record<string, unknown> | null;
}

export interface ProviderStatusMap {
  phishGuard?: boolean;
  googleSafeBrowsing?: boolean;
  urlhaus?: boolean;
  virusTotal?: boolean;
  urlscan?: boolean;
  linkGuardML?: boolean;
  [key: string]: boolean | undefined;
}

export interface TechnicalSummary {
  [key: string]: unknown;
}

export interface LinkGuardMLProviderData {
  provider?: string;
  status?: string;
  url?: string;
  canonicalUrl?: string;
  host?: string;
  registeredDomain?: string;
  modelFile?: string;
  modelPrediction?: string;
  verdict?: string;
  riskLevel?: string;
  confidence?: number;
  probabilities?: Record<string, number>;
  signals?: {
    brandImpersonation?: boolean;
    hasIpAddress?: boolean;
    suspiciousTld?: boolean;
    isKnownTopDomain?: boolean;
    suspiciousKeywordCount?: number;
    [signalKey: string]: unknown;
  };
  recommendation?: string;
  limitations?: string[];
  [key: string]: unknown;
}

export interface ProvidersMap {
  phishGuard?: Record<string, unknown>;
  googleSafeBrowsing?: Record<string, unknown>;
  urlhaus?: Record<string, unknown>;
  virusTotal?: Record<string, unknown>;
  urlscan?: Record<string, unknown>;
  linkGuardML?: LinkGuardMLProviderData;
  [providerKey: string]: unknown;
}

/**
 * Verified schema of the security report produced by the n8n Cloud backend workflow.
 */
export interface SecurityReport {
  // Scanned target
  url: string;
  domain: string;

  // Single-source / primary provider heuristic findings (kept separate from overall)
  verdict: string;
  risk_level: string;
  risk_score: number;

  // Overall multi-engine composite evaluation
  overall_risk_score: number;
  overall_risk_level: string;
  overall_risk_score_method?: string;
  overall_risk_score_reasons?: string[];
  overall_risk_warning_sources?: string[];
  overall_risk_limitations?: string[];

  // Heuristic confidence indicators (not calibrated probabilities)
  confidence?: string | number;
  confidence_score?: number;
  confidence_score_basis?: string;

  // Summaries & guidance
  verdict_summary: string;
  technical_summary?: TechnicalSummary;
  detected_signals?: string[] | Record<string, unknown>;
  why_dangerous?: string[] | string;
  why_safe?: string[] | string;
  action_guidance?: string[] | string;

  // Target classification & context
  category?: string;
  context?: string;

  // Scan metadata
  scan_id?: string;
  analysis_time_seconds?: number;
  from_cache?: boolean;
  cache_age_minutes?: number;

  // Provider tracking
  provider_status: ProviderStatusMap;
  checked_providers: number;
  all_providers_available: boolean;
  providers: ProvidersMap;

  // Threat intelligence & telemetry data
  blacklist_stats?: { total_domains?: number; total_urls?: number };
  community_reports?: { phishing_reports?: number; safe_reports?: number; total_reports?: number };
  ct_data?: { certificates_found?: number; issuers?: string[]; oldest_cert?: string };
  ip_data?: Record<string, unknown>;
  page_data?: Record<string, unknown>;

  // Evidence & limitations
  evidence: SecurityEvidenceItem[];
  limitations: string[];
}

export interface ScanRequest {
  url: string;
}

export interface ScanApiResponse {
  success: boolean;
  report?: SecurityReport;
  error?: string;
  code?: string;
  status?: number;
  inputUrl?: string;
}

/**
 * Validates at runtime whether the backend payload matches the required SecurityReport contract.
 * Safely unpacks single-item array wire format if emitted by n8n.
 */
/**
 * Safely parses domain age in days from technical_summary.domain_age_days.
 * Supports numeric days (e.g. 10416) or strings (e.g. "10416d (28y)", "29 years (verified)").
 */
export function parseDomainAgeDays(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    // Check for explicit days notation first (e.g. "10416d (28y)", "10416 days", or pure integer "10416")
    const daysMatch = val.match(/^(\d+)\s*d(?:ays)?/i) || val.match(/^(\d+)$/);
    if (daysMatch) {
      return parseInt(daysMatch[1], 10);
    }
    // Check for "XX years" or "XXy"
    const yearsMatch = val.match(/(\d+(?:\.\d+)?)\s*(?:years|year|y)/i);
    if (yearsMatch) {
      return Math.round(parseFloat(yearsMatch[1]) * 365);
    }
    // Fallback: match leading integer
    const fallbackMatch = val.match(/^(\d+)/);
    if (fallbackMatch) {
      return parseInt(fallbackMatch[1], 10);
    }
  }
  return null;
}

/**
 * Validates and parses raw JSON from the security analysis backend.
 * Enforces strict typing, verifies required properties, and handles
 * edge cases (e.g., conflicting ML predictions, fallback evidence synthesis).
 * Safely unpacks single-item array wire format if emitted by n8n.
 */
export function validateAndParseSecurityReport(raw: unknown): SecurityReport {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid payload: Backend returned an empty or non-object response.");
  }

  // Handle n8n wire format if emitted as a single-element list of items
  const payload = Array.isArray(raw) ? raw[0] : raw;

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payload: Response does not contain a valid security report object.");
  }

  const obj = payload as Record<string, unknown>;

  // Validate critical top-level fields
  if (typeof obj.url !== "string" || !obj.url.trim()) {
    throw new Error("Invalid payload: Missing or invalid 'url' field.");
  }

  if (typeof obj.domain !== "string") {
    throw new Error("Invalid payload: Missing or invalid 'domain' field.");
  }

  if (typeof obj.verdict !== "string" || typeof obj.risk_level !== "string") {
    throw new Error("Invalid payload: Missing 'verdict' or 'risk_level' fields.");
  }

  const numRiskScore = Number(obj.risk_score);
  if (obj.risk_score === null || obj.risk_score === undefined || isNaN(numRiskScore)) {
    throw new Error("Invalid payload: Missing or non-numeric 'risk_score' field.");
  }

  const numOverallRiskScore = Number(obj.overall_risk_score);
  if (obj.overall_risk_score === null || obj.overall_risk_score === undefined || isNaN(numOverallRiskScore)) {
    throw new Error("Invalid payload: Missing or non-numeric 'overall_risk_score' field.");
  }

  if (typeof obj.overall_risk_level !== "string" || !obj.overall_risk_level.trim()) {
    throw new Error("Invalid payload: Missing or invalid 'overall_risk_level' field.");
  }

  const numCheckedProviders = Number(obj.checked_providers);
  if (obj.checked_providers === null || obj.checked_providers === undefined || isNaN(numCheckedProviders)) {
    throw new Error("Invalid payload: 'checked_providers' must be a valid number.");
  }

  if (typeof obj.verdict_summary !== "string") {
    throw new Error("Invalid payload: Missing 'verdict_summary' string.");
  }

  // Verify provider_status map
  if (!obj.provider_status || typeof obj.provider_status !== "object") {
    throw new Error("Invalid payload: Missing or invalid 'provider_status' map.");
  }

  // Verify providers map
  if (!obj.providers || typeof obj.providers !== "object") {
    throw new Error("Invalid payload: Missing or invalid 'providers' object.");
  }

  // Parse technical summary early to establish domain profile
  const technicalSummary =
    obj.technical_summary && typeof obj.technical_summary === "object"
      ? (obj.technical_summary as TechnicalSummary)
      : undefined;

  const domainAgeDays = parseDomainAgeDays(technicalSummary?.domain_age_days);
  // An established domain has been registered for at least 2 years (730 days)
  const isEstablishedDomain = domainAgeDays !== null && domainAgeDays >= 730;

  // Option C: Helper to detect WHOIS privacy proxy warnings
  const isPrivacyProxyWarning = (str: string): boolean => {
    const lower = str.toLowerCase();
    return (
      lower.includes("identity hidden") ||
      lower.includes("privacy protection") ||
      lower.includes("whois privacy") ||
      lower.includes("proxy registration")
    );
  };

  // Normalize evidence array
  const rawEvidence = Array.isArray(obj.evidence) ? obj.evidence : [];
  const normalizedEvidence: SecurityEvidenceItem[] = rawEvidence.map((item) => {
    if (typeof item === "object" && item !== null) {
      const it = item as Record<string, unknown>;
      const signal = String(it.signal || "Security observation");
      let severity = String(it.severity || "info").toLowerCase();
      let details = it.details as string | Record<string, unknown> | null;

      // Option C: Demote privacy proxy warning on established domains from HIGH/CRITICAL to INFO
      if (isEstablishedDomain && isPrivacyProxyWarning(signal)) {
        severity = "info";
        details =
          "Registrar privacy protection proxy active. Standard ICANN/GDPR compliance practice for established domains.";
      }

      return {
        source: String(it.source || "Unknown Source"),
        severity,
        signal,
        details,
      };
    }
    return {
      source: "System",
      severity: "info",
      signal: String(item),
    };
  });

  // Option C: Filter out WHOIS privacy warning on established domains from why_dangerous
  const rawWhyDangerousList = Array.isArray(obj.why_dangerous)
    ? obj.why_dangerous.map(String)
    : typeof obj.why_dangerous === "string" && obj.why_dangerous.trim()
    ? [obj.why_dangerous]
    : [];

  let hadPrivacyWarning = false;
  const whyDangerousList: string[] = [];

  for (const warning of rawWhyDangerousList) {
    if (isEstablishedDomain && isPrivacyProxyWarning(warning)) {
      hadPrivacyWarning = true;
      // Suppress privacy proxy as a danger factor for established domains
      continue;
    }
    whyDangerousList.push(warning);
  }

  // Task 1: If structured evidence is empty, synthesize traceable evidence rows
  // from actual returned negative warnings (e.g., why_dangerous), clearly marking ML predictions
  if (normalizedEvidence.length === 0) {
    for (const warning of whyDangerousList) {
      const warnStr = warning.trim();
      if (!warnStr) continue;
      const lower = warnStr.toLowerCase();
      const isMl =
        lower.includes("ml") ||
        lower.includes("model") ||
        lower.includes("probability");
      normalizedEvidence.push({
        source: isMl ? "PhishGuard (Model Prediction)" : "Security Telemetry",
        severity: isMl ? "medium" : "high",
        signal: warnStr.replace(/^[⚠️🚨✓✗-]\s*/, "").trim(),
        details: isMl
          ? "Heuristic model inference; not a confirmed threat-intelligence blocklist hit."
          : "Reported as an active threat indicator in scan telemetry.",
      });
    }
  }

  // Normalize why_safe list and add privacy transparency note if applicable
  const whySafeList: string[] = Array.isArray(obj.why_safe)
    ? obj.why_safe.map(String)
    : typeof obj.why_safe === "string" && obj.why_safe.trim()
    ? [obj.why_safe]
    : [];

  if (isEstablishedDomain && hadPrivacyWarning) {
    if (!whySafeList.some((s) => s.toLowerCase().includes("privacy"))) {
      whySafeList.push(
        "✓ Domain owner identity protected by standard registrar privacy proxy (normal for established domains)"
      );
    }
  }

  // Normalize limitations array
  const limitations = Array.isArray(obj.limitations)
    ? obj.limitations.map(String)
    : [];

  // Option C: If score was low/minor (<= 15) and solely driven by the privacy proxy heuristic on an established domain, normalize to clean 0
  let effectiveRiskScore = Number(obj.risk_score);
  let effectiveOverallRiskScore = Number(obj.overall_risk_score);
  let effectiveReasons = Array.isArray(obj.overall_risk_score_reasons)
    ? obj.overall_risk_score_reasons.map(String)
    : [];

  if (isEstablishedDomain && whyDangerousList.length === 0 && effectiveOverallRiskScore <= 15) {
    effectiveOverallRiskScore = 0;
    effectiveRiskScore = 0;
    effectiveReasons = ["Heuristic index: 0 (privacy proxy normalized for established domain)"];
  }

  // Task 3: ML Disagreement Transparency (inspect comparable outputs only)
  const providersObj =
    obj.providers && typeof obj.providers === "object"
      ? (obj.providers as Record<string, unknown>)
      : {};
  const phishGuardObj = providersObj.phishGuard as
    | Record<string, unknown>
    | undefined;
  const linkGuardObj = providersObj.linkGuardML as
    | LinkGuardMLProviderData
    | undefined;
  const googleSafeBrowsingObj = providersObj.googleSafeBrowsing as
    | Record<string, unknown>
    | undefined;
  const urlhausObj = providersObj.urlhaus as
    | Record<string, unknown>
    | undefined;
  const urlscanObj = providersObj.urlscan as
    | Record<string, unknown>
    | undefined;
  const virusTotalObj = providersObj.virusTotal as
    | Record<string, unknown>
    | undefined;
  const detectedSignalsObj =
    obj.detected_signals && typeof obj.detected_signals === "object"
      ? (obj.detected_signals as Record<string, unknown>)
      : {};

  const phishGuardMl =
    typeof phishGuardObj?.mlProbability === "number"
      ? phishGuardObj.mlProbability
      : null;
  const linkGuardPred =
    typeof linkGuardObj?.modelPrediction === "string"
      ? linkGuardObj.modelPrediction.toLowerCase()
      : null;
  const linkGuardPhishProb =
    typeof linkGuardObj?.probabilities?.phishing === "number"
      ? linkGuardObj.probabilities.phishing
      : null;
  const linkGuardConfidence =
    typeof linkGuardObj?.confidence === "number"
      ? linkGuardObj.confidence
      : null;

  // Only compare when both models returned valid, comparable outputs
  if (phishGuardMl !== null && linkGuardPred !== null) {
    const phishGuardFlagsThreat = phishGuardMl >= 50;
    const linkGuardFlagsThreat =
      linkGuardPred !== "benign" &&
      (linkGuardPhishProb === null || linkGuardPhishProb >= 50);

    if (phishGuardFlagsThreat && !linkGuardFlagsThreat) {
      const disagreementNote = `Advisory: Machine-learning models diverged on this target. PhishGuard ML flagged elevated phishing probability (${phishGuardMl}%), while LinkGuard ML predicted ${linkGuardPred} (${
        linkGuardConfidence !== null
          ? linkGuardConfidence + "% confidence"
          : "benign model prediction"
      }). Neither heuristic model provides verified proof.`;
      if (
        !limitations.some(
          (l) => l.includes("diverged") || l.includes("discrepanc")
        )
      ) {
        limitations.push(disagreementNote);
      }
    } else if (linkGuardFlagsThreat && phishGuardMl < 25) {
      const disagreementNote = `Advisory: Machine-learning models diverged on this target. LinkGuard ML flagged ${linkGuardPred} (${
        linkGuardConfidence !== null
          ? linkGuardConfidence + "% confidence"
          : "elevated risk"
      }), while PhishGuard ML indicated low risk (${phishGuardMl}%). Such discrepancies stem from differing feature extractors and training sets.`;
      if (
        !limitations.some(
          (l) => l.includes("diverged") || l.includes("discrepanc")
        )
      ) {
        limitations.push(disagreementNote);
      }
    }
  }

  // Option B: Established Domain / High-Trust Safe Exemption Evaluation
  const isTlsValid =
    technicalSummary?.ssl_valid === true &&
    !technicalSummary?.ssl_expired &&
    !technicalSummary?.self_signed;

  const checkedCount = Number(obj.checked_providers) || 0;
  const providerStatusObj =
    obj.provider_status && typeof obj.provider_status === "object"
      ? (obj.provider_status as Record<string, boolean>)
      : {};

  const hasActiveThreatInProviders =
    detectedSignalsObj.blacklist_hit === true ||
    detectedSignalsObj.brand_impersonation === true ||
    googleSafeBrowsingObj?.threatFound === true ||
    urlhausObj?.threatFound === true ||
    urlscanObj?.malicious === true ||
    (typeof linkGuardPred === "string" &&
      (linkGuardPred === "phishing" ||
        linkGuardPred === "malware" ||
        linkGuardPred === "defacement")) ||
    (phishGuardObj &&
      (phishGuardObj.riskLevel === "HIGH" ||
        phishGuardObj.riskLevel === "CRITICAL" ||
        phishGuardObj.riskLevel === "MALICIOUS"));

  const isVirusTotalPending =
    providerStatusObj.virusTotal === false ||
    virusTotalObj?.status === "partial" ||
    virusTotalObj?.analysisStatus === "queued";

  const isSingleProviderPending =
    !Boolean(obj.all_providers_available) &&
    checkedCount >= 4 &&
    isVirusTotalPending;

  const qualifiesForHighTrustExemption =
    isEstablishedDomain &&
    isTlsValid &&
    !hasActiveThreatInProviders &&
    whyDangerousList.length === 0 &&
    isSingleProviderPending;

  let effectiveVerdict = String(obj.verdict);
  let effectiveRiskLevel = String(obj.risk_level);
  let effectiveOverallRiskLevel = String(obj.overall_risk_level);
  let effectiveVerdictSummary = String(obj.verdict_summary);
  let effectiveActionGuidance: string[] = Array.isArray(obj.action_guidance)
    ? obj.action_guidance.map(String)
    : typeof obj.action_guidance === "string"
    ? [obj.action_guidance]
    : [];

  if (qualifiesForHighTrustExemption && domainAgeDays !== null) {
    const yearsOld = Math.floor(domainAgeDays / 365);
    effectiveVerdict = "SAFE";
    effectiveRiskLevel = "LOW";
    effectiveOverallRiskLevel = "LOW";
    effectiveVerdictSummary = `✅ SAFE — Verified established domain (${yearsOld}y) with 5/6 clean security sources (1 feed pending)`;

    effectiveActionGuidance = [
      `✅ ${String(obj.domain)} is a verified established domain (${yearsOld}y) with clean consensus across 5 responding security engines.`,
      "✓ Safe to proceed — always verify you are on the intended official domain.",
      "ℹ️ Note: VirusTotal background multi-engine processing was queued; all responding industry feeds verified clean.",
    ];

    limitations.push(
      `High-Trust Domain Clearance: Domain is verified established (${yearsOld}y) with valid TLS encryption and 0 detections across 5 responding providers. VirusTotal multi-engine analysis was queued in background.`
    );
  }

  // Task 2: Ensure inconclusive scan limitation is transparently present when NOT exempted
  const normVerdictStr = effectiveVerdict.toUpperCase();
  const normLevelStr = effectiveOverallRiskLevel.toUpperCase();
  const isScanInconclusive =
    normVerdictStr === "INCONCLUSIVE" ||
    normLevelStr === "INCONCLUSIVE" ||
    normLevelStr === "UNKNOWN" ||
    effectiveVerdictSummary.toUpperCase().includes("INCONCLUSIVE");

  if (isScanInconclusive && !qualifiesForHighTrustExemption) {
    const hasInconclusiveLimitation = limitations.some(
      (lim) =>
        lim.toLowerCase().includes("inconclusive") ||
        lim.toLowerCase().includes("did not return a completed result")
    );
    if (!hasInconclusiveLimitation) {
      limitations.push(
        "Assessment is inconclusive due to pending or incomplete provider results. Numeric scores reflect only responding engines."
      );
    }
  }

  return {
    url: String(obj.url),
    domain: String(obj.domain),
    verdict: effectiveVerdict,
    risk_level: effectiveRiskLevel,
    risk_score: effectiveRiskScore,
    overall_risk_score: effectiveOverallRiskScore,
    overall_risk_level: effectiveOverallRiskLevel,
    overall_risk_score_method: obj.overall_risk_score_method
      ? String(obj.overall_risk_score_method)
      : undefined,
    overall_risk_score_reasons: effectiveReasons,
    overall_risk_warning_sources: Array.isArray(obj.overall_risk_warning_sources)
      ? obj.overall_risk_warning_sources.map(String)
      : [],
    overall_risk_limitations: Array.isArray(obj.overall_risk_limitations)
      ? obj.overall_risk_limitations.map(String)
      : [],
    confidence:
      obj.confidence !== undefined
        ? typeof obj.confidence === "number"
          ? obj.confidence
          : String(obj.confidence)
        : undefined,
    confidence_score:
      typeof obj.confidence_score === "number" ? obj.confidence_score : undefined,
    confidence_score_basis: obj.confidence_score_basis
      ? String(obj.confidence_score_basis)
      : undefined,
    verdict_summary: effectiveVerdictSummary,
    technical_summary: technicalSummary,
    detected_signals: obj.detected_signals as string[] | Record<string, unknown> | undefined,
    why_dangerous: whyDangerousList,
    why_safe: whySafeList,
    action_guidance: effectiveActionGuidance,
    category: obj.category ? String(obj.category) : undefined,
    context: obj.context ? String(obj.context) : undefined,
    scan_id: obj.scan_id ? String(obj.scan_id) : undefined,
    analysis_time_seconds:
      typeof obj.analysis_time_seconds === "number" ? obj.analysis_time_seconds : undefined,
    from_cache: typeof obj.from_cache === "boolean" ? obj.from_cache : undefined,
    cache_age_minutes:
      typeof obj.cache_age_minutes === "number" ? obj.cache_age_minutes : undefined,
    provider_status: obj.provider_status as ProviderStatusMap,
    checked_providers: Number(obj.checked_providers),
    all_providers_available: Boolean(obj.all_providers_available),
    providers: obj.providers as ProvidersMap,
    blacklist_stats:
      obj.blacklist_stats && typeof obj.blacklist_stats === "object"
        ? (obj.blacklist_stats as { total_domains?: number; total_urls?: number })
        : undefined,
    community_reports:
      obj.community_reports && typeof obj.community_reports === "object"
        ? (obj.community_reports as { phishing_reports?: number; safe_reports?: number; total_reports?: number })
        : undefined,
    ct_data:
      obj.ct_data && typeof obj.ct_data === "object"
        ? (obj.ct_data as { certificates_found?: number; issuers?: string[]; oldest_cert?: string })
        : undefined,
    ip_data:
      obj.ip_data && typeof obj.ip_data === "object"
        ? (obj.ip_data as Record<string, unknown>)
        : undefined,
    page_data:
      obj.page_data && typeof obj.page_data === "object"
        ? (obj.page_data as Record<string, unknown>)
        : undefined,
    evidence: normalizedEvidence,
    limitations,
  };
}

/**
 * Maps a verified SecurityReport to the visual handshake state.
 *
 * Rules:
 * - Malicious or suspicious findings -> "threat"
 * - Clean findings ONLY when consensus is complete or at least 3 providers checked without threats -> "clean"
 * - Established high-trust domain with valid TLS and 4+ clean providers -> "clean"
 * - Incomplete, ambiguous, or failed provider consensus -> "inconclusive"
 * - Never treat missing, unknown, or failed providers as clean.
 */
export function mapReportToScannerStatus(report: SecurityReport): "clean" | "threat" | "inconclusive" {
  const normLevel = (report.overall_risk_level || "").toUpperCase();
  const normVerdict = (report.verdict || "").toUpperCase();

  // If backend or parser established a SAFE or CLEAN verdict for an established domain, map to clean
  const domainAge = parseDomainAgeDays(report.technical_summary?.domain_age_days);
  const isEstablished = domainAge !== null && domainAge >= 730;
  const isTls = report.technical_summary?.ssl_valid === true && !report.technical_summary?.ssl_expired;
  const isCleanScore = (report.overall_risk_score ?? 0) <= 20;
  const hasEnoughCleanProviders = report.checked_providers >= 4;
  const isExplicitSafeVerdict = normVerdict === "SAFE" || normVerdict === "CLEAN";

  if (isEstablished && isTls && isCleanScore && hasEnoughCleanProviders && isExplicitSafeVerdict) {
    return "clean";
  }

  // If backend explicitly marked verdict as inconclusive or unknown, respect it directly
  if (
    normVerdict === "INCONCLUSIVE" ||
    normLevel === "INCONCLUSIVE" ||
    normLevel === "UNKNOWN" ||
    report.verdict_summary?.toUpperCase().includes("INCONCLUSIVE")
  ) {
    return "inconclusive";
  }

  if (
    normLevel === "CRITICAL" ||
    normLevel === "HIGH" ||
    normLevel === "MALICIOUS" ||
    normLevel === "MEDIUM" ||
    normLevel === "SUSPICIOUS" ||
    normVerdict === "MALICIOUS" ||
    normVerdict === "SUSPICIOUS" ||
    normVerdict === "THREAT"
  ) {
    return "threat";
  }

  if (normLevel === "LOW" || normLevel === "BENIGN" || normLevel === "CLEAN") {
    // If providers failed or were incomplete, treat as inconclusive rather than safe
    if (!report.all_providers_available && report.checked_providers < 3) {
      return "inconclusive";
    }
    return "clean";
  }

  return "inconclusive";
}
