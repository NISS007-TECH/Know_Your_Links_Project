import assert from "node:assert";
import {
  validateAndParseSecurityReport,
  mapReportToScannerStatus,
  parseDomainAgeDays,
} from "../types/scanner";

console.log("==========================================");
console.log("RUNNING OPTION B & C ESTABLISHED DOMAIN TESTS");
console.log("==========================================");

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// -------------------------------------------------------------
// Test 1: parseDomainAgeDays utility
// -------------------------------------------------------------
runTest("parseDomainAgeDays parses numeric and string domain ages correctly", () => {
  assert.strictEqual(parseDomainAgeDays(10416), 10416);
  assert.strictEqual(parseDomainAgeDays("10416d (28y)"), 10416);
  assert.strictEqual(parseDomainAgeDays("28 years"), 28 * 365);
  assert.strictEqual(parseDomainAgeDays("29 years (verified)"), 29 * 365);
  assert.strictEqual(parseDomainAgeDays(undefined), null);
  assert.strictEqual(parseDomainAgeDays(null), null);
});

// -------------------------------------------------------------
// Test 2: Booking.com scan (Option B & C verification)
// -------------------------------------------------------------
runTest("Booking.com payload: Option C suppresses WHOIS privacy danger and Option B promotes to SAFE", () => {
  const bookingPayload = {
    url: "https://www.booking.com/",
    domain: "booking.com",
    verdict: "INCONCLUSIVE",
    risk_level: "UNKNOWN",
    risk_score: 14,
    overall_risk_score: 14,
    overall_risk_level: "UNKNOWN",
    overall_risk_score_reasons: ["PhishGuard base risk score: 14."],
    verdict_summary: "⚠️ INCONCLUSIVE — Not enough reliable information",
    technical_summary: {
      domain_age_days: 10416,
      registrar: "MarkMonitor Inc.",
      ssl_valid: true,
      ssl_version: "TLSv1.3",
      ssl_expired: false,
      self_signed: false,
    },
    detected_signals: {
      blacklist_hit: false,
      brand_impersonation: false,
    },
    why_dangerous: ["⚠️ Domain owner identity hidden (privacy protection)"],
    why_safe: [
      "✓ Established domain (10416 days old)",
      "✓ Valid SSL certificate",
      "✓ Registrar: MarkMonitor Inc.",
    ],
    checked_providers: 5,
    all_providers_available: false,
    provider_status: {
      phishGuard: true,
      googleSafeBrowsing: true,
      urlhaus: true,
      virusTotal: false,
      urlscan: true,
      linkGuardML: true,
    },
    providers: {
      phishGuard: { riskLevel: "LOW", riskScore: 14 },
      googleSafeBrowsing: { threatFound: false },
      urlhaus: { threatFound: false },
      urlscan: { malicious: false },
      linkGuardML: { modelPrediction: "benign" },
      virusTotal: { status: "partial", analysisStatus: "queued" },
    },
  };

  const parsed = validateAndParseSecurityReport(bookingPayload);

  // Option C Checks:
  // 1. why_dangerous must NOT contain the privacy protection warning
  const whyDangerous = Array.isArray(parsed.why_dangerous) ? parsed.why_dangerous : [];
  assert.strictEqual(whyDangerous.length, 0);
  // 2. why_safe must contain the normal privacy proxy transparency note
  const whySafe = Array.isArray(parsed.why_safe) ? parsed.why_safe : [];
  assert(whySafe.some((s: string) => s.toLowerCase().includes("privacy")));
  // 3. Evidence table must NOT have a HIGH severity threat item for privacy proxy
  assert(!parsed.evidence.some((e) => e.severity === "high" && e.signal.includes("identity hidden")));
  // 4. Minor risk score of 14 was normalized to 0
  assert.strictEqual(parsed.overall_risk_score, 0);

  // Option B Checks:
  // 1. Verdict promoted to SAFE
  assert.strictEqual(parsed.verdict, "SAFE");
  assert.strictEqual(parsed.overall_risk_level, "LOW");
  assert(parsed.verdict_summary.startsWith("✅ SAFE"));
  // 2. Action guidance provides safe guidance
  const guidance = Array.isArray(parsed.action_guidance) ? parsed.action_guidance : [];
  assert(guidance.some((g: string) => g.includes("Safe to proceed") || g.includes("verified established domain")));
  // 3. Handshake status maps to clean
  const scannerStatus = mapReportToScannerStatus(parsed);
  assert.strictEqual(scannerStatus, "clean");
});

// -------------------------------------------------------------
// Test 3: Newly registered domain (5 days old) retains privacy warning & inconclusive
// -------------------------------------------------------------
runTest("New domain (5 days old) does NOT get Option B or C exemptions", () => {
  const newDomainPayload = {
    url: "https://freshly-registered-link.xyz/",
    domain: "freshly-registered-link.xyz",
    verdict: "INCONCLUSIVE",
    risk_level: "UNKNOWN",
    risk_score: 14,
    overall_risk_score: 14,
    overall_risk_level: "UNKNOWN",
    verdict_summary: "⚠️ INCONCLUSIVE — Not enough reliable information",
    technical_summary: {
      domain_age_days: 5,
      ssl_valid: true,
      ssl_expired: false,
    },
    detected_signals: {
      blacklist_hit: false,
    },
    why_dangerous: ["⚠️ Domain owner identity hidden (privacy protection)"],
    why_safe: [],
    checked_providers: 5,
    all_providers_available: false,
    provider_status: {
      phishGuard: true,
      virusTotal: false,
    },
    providers: {
      virusTotal: { status: "partial", analysisStatus: "queued" },
    },
  };

  const parsed = validateAndParseSecurityReport(newDomainPayload);
  // Privacy warning is retained for brand-new domains
  const whyDangerous = Array.isArray(parsed.why_dangerous) ? parsed.why_dangerous : [];
  assert.strictEqual(whyDangerous.length, 1);
  assert(whyDangerous[0].includes("identity hidden"));
  // Verdict stays INCONCLUSIVE
  assert.strictEqual(parsed.verdict, "INCONCLUSIVE");
  const scannerStatus = mapReportToScannerStatus(parsed);
  assert.strictEqual(scannerStatus, "inconclusive");
});

// -------------------------------------------------------------
// Test 4: Established domain WITH a genuine threat hit maps to THREAT
// -------------------------------------------------------------
runTest("Established domain with active threat hit does NOT get safe exemption", () => {
  const compromisedEstablishedPayload = {
    url: "https://compromised-aged-site.com/",
    domain: "compromised-aged-site.com",
    verdict: "THREAT",
    risk_level: "HIGH",
    risk_score: 85,
    overall_risk_score: 85,
    overall_risk_level: "HIGH",
    verdict_summary: "🚨 MALICIOUS — Confirmed phishing site",
    technical_summary: {
      domain_age_days: 3500, // ~9 years old
      ssl_valid: true,
    },
    detected_signals: {
      blacklist_hit: true,
    },
    why_dangerous: ["🚨 Confirmed phishing target on Google Safe Browsing"],
    why_safe: [],
    checked_providers: 5,
    all_providers_available: false,
    provider_status: {
      googleSafeBrowsing: true,
      virusTotal: false,
    },
    providers: {
      googleSafeBrowsing: { threatFound: true },
      virusTotal: { status: "partial", analysisStatus: "queued" },
    },
  };

  const parsed = validateAndParseSecurityReport(compromisedEstablishedPayload);
  // Verdict must remain threat
  assert.strictEqual(parsed.verdict, "THREAT");
  const scannerStatus = mapReportToScannerStatus(parsed);
  assert.strictEqual(scannerStatus, "threat");
});

console.log("==========================================");
console.log("TOTAL: 4 | PASSED: 4 | FAILED: 0");
console.log("==========================================");
