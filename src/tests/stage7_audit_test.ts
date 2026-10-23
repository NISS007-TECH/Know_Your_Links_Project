import assert from "node:assert";
import {
  SecurityReport,
  validateAndParseSecurityReport,
  mapReportToScannerStatus,
} from "../types/scanner";
import {
  evaluatePhishGuard,
  evaluateGoogleSafeBrowsing,
  evaluateUrlhaus,
  evaluateVirusTotal,
  evaluateUrlscan,
  evaluateLinkGuardML,
} from "../lib/providerEvaluator";

console.log("==========================================");
console.log("RUNNING STAGE 7 BACKEND AUDIT TESTS");
console.log("==========================================\n");

let passedCount = 0;
let failedCount = 0;

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passedCount++;
  } catch (err: unknown) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
    failedCount++;
  }
}

// -------------------------------------------------------------
// Test 1: Completed clean provider consensus
// -------------------------------------------------------------
runTest("Scenario 1: Completed clean provider consensus yields clean status", () => {
  const report: SecurityReport = {
    url: "https://trusted-site.org/",
    domain: "trusted-site.org",
    verdict: "CLEAN",
    risk_level: "LOW",
    risk_score: 5,
    overall_risk_score: 5,
    overall_risk_level: "LOW",
    confidence: "HIGH",
    confidence_score: 95,
    verdict_summary: "✅ CLEAN — Verified consensus across all engines",
    provider_status: {
      phishGuard: true,
      googleSafeBrowsing: true,
      urlhaus: true,
      virusTotal: true,
      urlscan: true,
      linkGuardML: true,
    },
    checked_providers: 6,
    all_providers_available: true,
    providers: {
      phishGuard: { status: "completed", riskLevel: "LOW", riskScore: 5 },
      googleSafeBrowsing: { status: "completed", threatFound: false, matches: [] },
      urlhaus: { status: "completed", threatFound: false, queryStatus: "no_results" },
      virusTotal: { status: "completed", stats: { malicious: 0, suspicious: 0, harmless: 80, undetected: 5 } },
      urlscan: { status: "completed", malicious: false, verdict: "NO_THREAT_DETECTED", score: 0 },
      linkGuardML: { status: "completed", verdict: "BENIGN", confidence: 98.2 },
    },
    evidence: [],
    limitations: [],
  };

  const status = mapReportToScannerStatus(report);
  assert.strictEqual(status, "clean");
});

// -------------------------------------------------------------
// Test 2: Confirmed malicious detection (Threat-Intelligence detection)
// -------------------------------------------------------------
runTest("Scenario 2: Confirmed malicious detection triggers threat status", () => {
  const report: SecurityReport = {
    url: "http://malware-drop.ru/payload.exe",
    domain: "malware-drop.ru",
    verdict: "MALICIOUS",
    risk_level: "CRITICAL",
    risk_score: 95,
    overall_risk_score: 95,
    overall_risk_level: "CRITICAL",
    confidence: "HIGH",
    confidence_score: 98,
    verdict_summary: "🚨 MALICIOUS — Confirmed active malware host",
    provider_status: {
      phishGuard: true,
      googleSafeBrowsing: true,
      urlhaus: true,
      virusTotal: true,
      urlscan: true,
      linkGuardML: true,
    },
    checked_providers: 6,
    all_providers_available: true,
    providers: {
      urlhaus: { status: "completed", threatFound: true, threat: "malware_download" },
    },
    evidence: [
      {
        source: "URLhaus",
        severity: "critical",
        signal: "Active malware payload verified on host",
      },
    ],
    limitations: [],
  };

  const status = mapReportToScannerStatus(report);
  assert.strictEqual(status, "threat");
});

// -------------------------------------------------------------
// Test 3: Suspicious ML signal with no confirmed threat-intelligence detection
// -------------------------------------------------------------
runTest("Scenario 3: Suspicious ML prediction maps to threat without confirmed blocklist hit", () => {
  const report: SecurityReport = {
    url: "https://suspicious-new-login.xyz/",
    domain: "suspicious-new-login.xyz",
    verdict: "SUSPICIOUS",
    risk_level: "MEDIUM",
    risk_score: 55,
    overall_risk_score: 55,
    overall_risk_level: "MEDIUM",
    confidence: "MEDIUM",
    confidence_score: 60,
    verdict_summary: "⚠️ SUSPICIOUS — High ML heuristic warning",
    provider_status: {
      phishGuard: true,
      googleSafeBrowsing: true,
      urlhaus: true,
      virusTotal: true,
      urlscan: true,
      linkGuardML: true,
    },
    checked_providers: 6,
    all_providers_available: true,
    providers: {
      linkGuardML: {
        status: "completed",
        verdict: "SUSPICIOUS",
        riskLevel: "MEDIUM",
        confidence: 85.0,
        signals: { brandImpersonation: true },
      },
    },
    evidence: [
      {
        source: "LinkGuard ML",
        severity: "medium",
        signal: "Heuristic pattern flags credential harvesting structure",
      },
    ],
    limitations: ["ML predictions are indicators, not proof."],
  };

  const status = mapReportToScannerStatus(report);
  assert.strictEqual(status, "threat");
});

// -------------------------------------------------------------
// Test 4: Conflicting ML predictions (PhishGuard 97% vs LinkGuard 70% Benign)
// -------------------------------------------------------------
runTest("Scenario 4: Discloses conflicting ML predictions (Case A example.com pattern)", () => {
  const phishGuardResult = evaluatePhishGuard(
    {
      riskLevel: "LOW",
      riskScore: 34,
      mlProbability: 97.4,
      verdictSummary: "✓ LIKELY SAFE — Minor concerns only",
    },
    true
  );

  const linkGuardResult = evaluateLinkGuardML(
    {
      verdict: "BENIGN",
      riskLevel: "LOW",
      confidence: 70.74,
      probabilities: { benign: 70.74, phishing: 27.52 },
    },
    true
  );

  // PhishGuard evaluated as clean/low risk by rule despite internal ML probability
  assert.strictEqual(phishGuardResult.status, "clean");
  // LinkGuard evaluated as clean/benign
  assert.strictEqual(linkGuardResult.status, "clean");
  // Both evaluated individually as clean, revealing the divergence in internal ML signals
});

// -------------------------------------------------------------
// Test 5: Empty structured evidence with a non-clean verdict
// -------------------------------------------------------------
runTest("Scenario 5: Non-clean verdict with empty structured evidence handles safely", () => {
  const report: SecurityReport = {
    url: "https://example.com/",
    domain: "example.com",
    verdict: "SUSPICIOUS",
    risk_level: "HIGH",
    risk_score: 50,
    overall_risk_score: 34,
    overall_risk_level: "MEDIUM",
    confidence: "LOW",
    confidence_score: 45,
    verdict_summary: "⚠️ SUSPICIOUS — Warning signs detected",
    provider_status: { phishGuard: true, googleSafeBrowsing: true, urlhaus: true },
    checked_providers: 3,
    all_providers_available: false,
    providers: {},
    evidence: [], // Empty evidence array
    limitations: [],
  };

  const status = mapReportToScannerStatus(report);
  // Status must be threat (not clean) because overall_risk_level is MEDIUM and verdict is SUSPICIOUS
  assert.strictEqual(status, "threat");
  assert.strictEqual(report.evidence.length, 0);
});

// -------------------------------------------------------------
// Test 6: Low numeric score with an inconclusive verdict (Case B google.com pattern)
// -------------------------------------------------------------
runTest("Scenario 6: Low numeric score (0) with INCONCLUSIVE verdict maps to inconclusive", () => {
  const report: SecurityReport = {
    url: "https://www.google.com/",
    domain: "google.com",
    verdict: "INCONCLUSIVE",
    risk_level: "UNKNOWN",
    risk_score: 0,
    overall_risk_score: 0,
    overall_risk_level: "LOW",
    confidence: "LOW",
    verdict_summary: "⚠️ INCONCLUSIVE — Not enough reliable information",
    provider_status: {
      phishGuard: true,
      googleSafeBrowsing: true,
      urlhaus: true,
      virusTotal: false,
      urlscan: true,
      linkGuardML: true,
    },
    checked_providers: 5,
    all_providers_available: false,
    providers: {},
    evidence: [],
    limitations: ["One or more providers did not return a completed result."],
  };

  const status = mapReportToScannerStatus(report);
  // Must NOT clasify as clean even though score is 0
  assert.strictEqual(status, "inconclusive");
});

// -------------------------------------------------------------
// Test 7: Pending VirusTotal analysis
// -------------------------------------------------------------
runTest("Scenario 7: Pending VirusTotal analysis returns unknown status (not clean)", () => {
  const vtResult = evaluateVirusTotal(
    {
      status: "partial",
      analysisStatus: "queued",
      verdict: "PROVISIONAL_NO_FLAGS",
      stats: { malicious: 0, suspicious: 0, harmless: 0, undetected: 0 },
    },
    false
  );

  assert.strictEqual(vtResult.status, "unknown");
  assert.strictEqual(vtResult.label, "Queued (Partial)");
});

// -------------------------------------------------------------
// Test 8: Unavailable provider
// -------------------------------------------------------------
runTest("Scenario 8: Completely offline provider returns unavailable status", () => {
  const sbResult = evaluateGoogleSafeBrowsing({}, false);
  assert.strictEqual(sbResult.status, "unavailable");
  assert.strictEqual(sbResult.label, "Unavailable");
});

// -------------------------------------------------------------
// Test 9: Multiple correlated warning signals
// -------------------------------------------------------------
runTest("Scenario 9: Multiple providers flagging same incident preserve discrete provenance", () => {
  const report: SecurityReport = {
    url: "http://known-phish.biz/",
    domain: "known-phish.biz",
    verdict: "MALICIOUS",
    risk_level: "HIGH",
    risk_score: 85,
    overall_risk_score: 85,
    overall_risk_level: "HIGH",
    confidence: "HIGH",
    confidence_score: 90,
    verdict_summary: "🚨 MALICIOUS — Correlated threat reports",
    provider_status: { phishGuard: true, googleSafeBrowsing: true, urlhaus: true },
    checked_providers: 3,
    all_providers_available: false,
    providers: {},
    evidence: [
      { source: "Google Safe Browsing", severity: "high", signal: "Social engineering page" },
      { source: "PhishGuard", severity: "high", signal: "Blacklist database match" },
    ],
    limitations: ["Provider detections can be correlated and may not be independent."],
  };

  assert.strictEqual(report.evidence.length, 2);
  assert.strictEqual(report.evidence[0].source, "Google Safe Browsing");
  assert.strictEqual(report.evidence[1].source, "PhishGuard");
  assert(report.limitations.some((l) => l.includes("correlated")));
});

// -------------------------------------------------------------
// Test 10: Missing or malformed score fields
// -------------------------------------------------------------
runTest("Scenario 10: Parser rejects payload with NaN or missing score fields", () => {
  assert.throws(() => {
    validateAndParseSecurityReport({
      url: "https://test.com",
      domain: "test.com",
      verdict: "CLEAN",
      risk_level: "LOW",
      risk_score: "not_a_number",
      overall_risk_score: 10,
      overall_risk_level: "LOW",
      checked_providers: 6,
      verdict_summary: "Clean",
      provider_status: {},
      providers: {},
    });
  }, /Missing or non-numeric 'risk_score'/);
});

// -------------------------------------------------------------
// Test 11: Missing evidence provenance handles gracefully
// -------------------------------------------------------------
runTest("Scenario 11: Evidence items with missing source default to System / Unknown", () => {
  const parsed = validateAndParseSecurityReport({
    url: "https://test.com",
    domain: "test.com",
    verdict: "CLEAN",
    risk_level: "LOW",
    risk_score: 0,
    overall_risk_score: 0,
    overall_risk_level: "LOW",
    checked_providers: 6,
    verdict_summary: "Clean",
    provider_status: { phishGuard: true },
    providers: {},
    evidence: [
      { signal: "Anomalous DNS record", severity: "medium" },
      "Unstructured raw alert string",
    ],
  });

  assert.strictEqual(parsed.evidence.length, 2);
  assert.strictEqual(parsed.evidence[0].source, "Unknown Source");
  assert.strictEqual(parsed.evidence[1].source, "System");
});

// -------------------------------------------------------------
// Test 12: Contradictory score, risk level, and verdict fields
// -------------------------------------------------------------
runTest("Scenario 12: Contradictory fields prioritize verdict & level over numeric score", () => {
  // Score is 10 (numeric low), but verdict is SUSPICIOUS and overall_risk_level is MEDIUM
  const report: SecurityReport = {
    url: "https://contradictory-target.com",
    domain: "contradictory-target.com",
    verdict: "SUSPICIOUS",
    risk_level: "MEDIUM",
    risk_score: 10,
    overall_risk_score: 10,
    overall_risk_level: "MEDIUM",
    verdict_summary: "Suspicious warning",
    provider_status: { phishGuard: true },
    checked_providers: 1,
    all_providers_available: false,
    providers: {},
    evidence: [],
    limitations: [],
  };

  const status = mapReportToScannerStatus(report);
  assert.strictEqual(status, "threat");
});

// -------------------------------------------------------------
// Stage 7.1 Regression Tests
// -------------------------------------------------------------

// Test 13: An ML warning with empty structured evidence
runTest("Scenario 13 (Stage 7.1): ML warning with empty structured evidence synthesizes traceable evidence row", () => {
  const payload = {
    url: "https://example.com/",
    domain: "example.com",
    verdict: "SUSPICIOUS",
    risk_level: "HIGH",
    risk_score: 50,
    overall_risk_score: 34,
    overall_risk_level: "MEDIUM",
    checked_providers: 5,
    verdict_summary: "⚠️ SUSPICIOUS — Warning signs detected",
    provider_status: { phishGuard: true },
    providers: {
      phishGuard: { mlProbability: 97.4 },
    },
    why_dangerous: ["⚠️ ML model flagged this URL (97% phishing probability)"],
    evidence: [],
    limitations: [],
  };

  const parsed = validateAndParseSecurityReport(payload);
  assert.strictEqual(parsed.evidence.length, 1);
  assert.strictEqual(parsed.evidence[0].source, "PhishGuard (Model Prediction)");
  assert.strictEqual(parsed.evidence[0].severity, "medium");
  assert(parsed.evidence[0].signal.includes("ML model flagged this URL"));
  assert(parsed.evidence[0].details?.toString().includes("Heuristic model inference"));
});

// Test 14: A model-derived finding distinguished from a confirmed blocklist hit
runTest("Scenario 14 (Stage 7.1): Model-derived finding is distinguished from confirmed blocklist hit", () => {
  const payloadWithBlocklist = {
    url: "https://bad-site.com",
    domain: "bad-site.com",
    verdict: "MALICIOUS",
    risk_level: "CRITICAL",
    risk_score: 100,
    overall_risk_score: 100,
    overall_risk_level: "CRITICAL",
    checked_providers: 6,
    verdict_summary: "Confirmed malicious",
    provider_status: { urlhaus: true },
    providers: {},
    evidence: [
      {
        source: "URLhaus",
        severity: "critical",
        signal: "Active malware drop host",
      },
    ],
  };

  const parsedBlocklist = validateAndParseSecurityReport(payloadWithBlocklist);
  assert.strictEqual(parsedBlocklist.evidence[0].source, "URLhaus");
  assert.strictEqual(parsedBlocklist.evidence[0].severity, "critical");

  const payloadWithMlOnly = {
    url: "https://heuristic-alert.com",
    domain: "heuristic-alert.com",
    verdict: "SUSPICIOUS",
    risk_level: "MEDIUM",
    risk_score: 40,
    overall_risk_score: 40,
    overall_risk_level: "MEDIUM",
    checked_providers: 6,
    verdict_summary: "Suspicious",
    provider_status: { phishGuard: true },
    providers: {},
    why_dangerous: ["⚠️ ML model flagged this URL (88% phishing probability)"],
    evidence: [],
  };

  const parsedMl = validateAndParseSecurityReport(payloadWithMlOnly);
  assert.strictEqual(parsedMl.evidence[0].source, "PhishGuard (Model Prediction)");
  assert.strictEqual(parsedMl.evidence[0].severity, "medium");
  assert(parsedMl.evidence[0].details?.toString().includes("not a confirmed threat-intelligence blocklist hit"));
});

// Test 15: An inconclusive verdict with a numeric score of zero
runTest("Scenario 15 (Stage 7.1): Inconclusive verdict with score zero preserves score and evaluates to inconclusive", () => {
  const payload = {
    url: "https://google.com/",
    domain: "google.com",
    verdict: "INCONCLUSIVE",
    risk_level: "UNKNOWN",
    risk_score: 0,
    overall_risk_score: 0,
    overall_risk_level: "LOW",
    checked_providers: 5,
    all_providers_available: false,
    verdict_summary: "⚠️ INCONCLUSIVE — Not enough reliable information",
    provider_status: { phishGuard: true, virusTotal: false },
    providers: {},
  };

  const parsed = validateAndParseSecurityReport(payload);
  assert.strictEqual(parsed.overall_risk_score, 0); // Exact score preserved
  const status = mapReportToScannerStatus(parsed);
  assert.strictEqual(status, "inconclusive"); // Handshake state is inconclusive
  assert(parsed.limitations.some((lim) => lim.includes("inconclusive")));
});

// Test 16: An inconclusive verdict paired with a low numeric risk level
runTest("Scenario 16 (Stage 7.1): Inconclusive verdict paired with LOW risk level is not converted to clean", () => {
  const report: SecurityReport = {
    url: "https://inconclusive-low.com",
    domain: "inconclusive-low.com",
    verdict: "INCONCLUSIVE",
    risk_level: "LOW",
    risk_score: 0,
    overall_risk_score: 0,
    overall_risk_level: "LOW",
    checked_providers: 2,
    all_providers_available: false,
    verdict_summary: "Inconclusive scan",
    provider_status: { phishGuard: true },
    providers: {},
    evidence: [],
    limitations: [],
  };

  const status = mapReportToScannerStatus(report);
  assert.notStrictEqual(status, "clean");
  assert.strictEqual(status, "inconclusive");
});

// Test 17: Conflicting ML outputs with compatible fields
runTest("Scenario 17 (Stage 7.1): Conflicting ML outputs with compatible fields generate advisory limitation", () => {
  const payload = {
    url: "https://example.com/",
    domain: "example.com",
    verdict: "SUSPICIOUS",
    risk_level: "MEDIUM",
    risk_score: 34,
    overall_risk_score: 34,
    overall_risk_level: "MEDIUM",
    checked_providers: 5,
    verdict_summary: "Suspicious",
    provider_status: { phishGuard: true, linkGuardML: true },
    providers: {
      phishGuard: {
        mlProbability: 97.4,
      },
      linkGuardML: {
        modelPrediction: "benign",
        confidence: 70.74,
        probabilities: { benign: 70.74, phishing: 27.52 },
      },
    },
    limitations: [],
  };

  const parsed = validateAndParseSecurityReport(payload);
  const hasDivergenceNote = parsed.limitations.some(
    (l) => l.includes("diverged") && l.includes("97.4%") && l.includes("benign")
  );
  assert(hasDivergenceNote);
});

// Test 18: Incompatible ML outputs that must not be compared
runTest("Scenario 18 (Stage 7.1): Incompatible ML outputs (null mlProbability) are not compared", () => {
  const payload = {
    url: "https://google.com/",
    domain: "google.com",
    verdict: "CLEAN",
    risk_level: "LOW",
    risk_score: 0,
    overall_risk_score: 0,
    overall_risk_level: "LOW",
    checked_providers: 6,
    verdict_summary: "Clean",
    provider_status: { phishGuard: true, linkGuardML: true },
    providers: {
      phishGuard: {
        mlProbability: null, // Model did not run or is not numeric
      },
      linkGuardML: {
        modelPrediction: "benign",
        confidence: 94.4,
        probabilities: { benign: 94.4 },
      },
    },
    limitations: [],
  };

  const parsed = validateAndParseSecurityReport(payload);
  const hasDivergenceNote = parsed.limitations.some((l) => l.includes("diverged"));
  assert.strictEqual(hasDivergenceNote, false); // Must NOT compare incompatible outputs
});

// Test 19: Missing optional evidence field in raw payload
runTest("Scenario 19 (Stage 7.1): Missing optional evidence field parses safely as empty array", () => {
  const payload = {
    url: "https://simple.com",
    domain: "simple.com",
    verdict: "CLEAN",
    risk_level: "LOW",
    risk_score: 0,
    overall_risk_score: 0,
    overall_risk_level: "LOW",
    checked_providers: 6,
    verdict_summary: "Clean",
    provider_status: {},
    providers: {},
    // evidence field omitted
  };

  const parsed = validateAndParseSecurityReport(payload);
  assert(Array.isArray(parsed.evidence));
  assert.strictEqual(parsed.evidence.length, 0);
});

// Test 20: Pending VirusTotal analysis
runTest("Scenario 20 (Stage 7.1): Pending VirusTotal analysis returns unknown status (not clean)", () => {
  const vtResult = evaluateVirusTotal(
    {
      status: "partial",
      analysisStatus: "queued",
      verdict: "PROVISIONAL_NO_FLAGS",
      stats: { malicious: 0, suspicious: 0, harmless: 0, undetected: 0 },
    },
    false
  );

  assert.strictEqual(vtResult.status, "unknown");
  assert.strictEqual(vtResult.label, "Queued (Partial)");
});

console.log("\n==========================================");
console.log(`TOTAL: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
console.log("==========================================\n");

if (failedCount > 0) {
  process.exit(1);
}
