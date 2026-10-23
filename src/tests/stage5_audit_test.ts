import {
  evaluatePhishGuard,
  evaluateGoogleSafeBrowsing,
  evaluateUrlhaus,
  evaluateVirusTotal,
  evaluateUrlscan,
  evaluateLinkGuardML,
} from "../lib/providerEvaluator";
import {
  validateAndParseSecurityReport,
  mapReportToScannerStatus,
  SecurityReport,
} from "../types/scanner";
import { validateUrl, validateAndNormalizeUrl, defangUrl } from "../lib/urlUtils";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

function test(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, passed: true });
    console.log(`✓ PASS: ${name}`);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error });
    console.error(`✗ FAIL: ${name} -> ${error}`);
  }
}

console.log("==========================================");
console.log("RUNNING STAGE 5.1 VERIFICATION AUDIT TESTS");
console.log("==========================================\n");

// --- 1. PhishGuard Evaluator Tests ---
test("PhishGuard: clean verdict when riskLevel is LOW even if score is 34", () => {
  const res = evaluatePhishGuard(
    { riskLevel: "LOW", verdictSummary: "✓ LIKELY SAFE — Minor concerns only", riskScore: 34 },
    true
  );
  assert(res.status === "clean", `Expected clean, got ${res.status}`);
  assert(res.label === "Clean", `Expected label Clean, got ${res.label}`);
});

test("PhishGuard: malicious verdict when riskLevel is CRITICAL", () => {
  const res = evaluatePhishGuard(
    { riskLevel: "CRITICAL", verdictSummary: "MALICIOUS", riskScore: 90 },
    true
  );
  assert(res.status === "malicious", `Expected malicious, got ${res.status}`);
});

test("PhishGuard: unavailable when provider is offline or empty", () => {
  const res = evaluatePhishGuard({}, false);
  assert(res.status === "unavailable", `Expected unavailable, got ${res.status}`);
});

// --- 2. URLhaus Evaluator Tests ---
test("URLhaus: clean when queryStatus is no_results and threatFound is false", () => {
  const res = evaluateUrlhaus(
    { status: "completed", threatFound: false, queryStatus: "no_results" },
    true
  );
  assert(res.status === "clean", `Expected clean, got ${res.status}`);
});

test("URLhaus: malicious when threatFound is true", () => {
  const res = evaluateUrlhaus(
    { status: "completed", threatFound: true, threat: "Mirai" },
    true
  );
  assert(res.status === "malicious", `Expected malicious, got ${res.status}`);
});

test("URLhaus: unknown when payload is empty but marked available", () => {
  const res = evaluateUrlhaus({ status: "partial" }, true);
  assert(res.status === "unknown", `Expected unknown, got ${res.status}`);
});

// --- 3. VirusTotal Evaluator Tests ---
test("VirusTotal: provisional queued scan displays Queued (Partial) under unknown status", () => {
  const res = evaluateVirusTotal(
    {
      status: "partial",
      analysisStatus: "queued",
      verdict: "PROVISIONAL_NO_FLAGS",
      stats: { malicious: 0, suspicious: 0, harmless: 0, undetected: 0 },
    },
    false
  );
  assert(res.status === "unknown", `Expected unknown, got ${res.status}`);
  assert(res.label === "Queued (Partial)", `Expected Queued (Partial), got ${res.label}`);
});

test("VirusTotal: clean when completed with 0 flags", () => {
  const res = evaluateVirusTotal(
    {
      status: "completed",
      stats: { malicious: 0, suspicious: 0, harmless: 70, undetected: 0 },
      verdict: "CLEAN",
    },
    true
  );
  assert(res.status === "clean", `Expected clean, got ${res.status}`);
});

test("VirusTotal: malicious when detections exist", () => {
  const res = evaluateVirusTotal(
    {
      status: "completed",
      stats: { malicious: 4, suspicious: 1, harmless: 60, undetected: 5 },
    },
    true
  );
  assert(res.status === "malicious", `Expected malicious, got ${res.status}`);
});

// --- 4. Google Safe Browsing Evaluator Tests ---
test("Google Safe Browsing: clean when matches empty and threatFound is false", () => {
  const res = evaluateGoogleSafeBrowsing(
    { status: "completed", threatFound: false, matches: [] },
    true
  );
  assert(res.status === "clean", `Expected clean, got ${res.status}`);
});

test("Google Safe Browsing: malicious when threatFound is true", () => {
  const res = evaluateGoogleSafeBrowsing(
    { status: "completed", threatFound: true, threatType: "MALWARE" },
    true
  );
  assert(res.status === "malicious", `Expected malicious, got ${res.status}`);
});

// --- 5. urlscan.io Evaluator Tests ---
test("urlscan.io: clean when NO_THREAT_DETECTED", () => {
  const res = evaluateUrlscan(
    { status: "completed", malicious: false, verdict: "NO_THREAT_DETECTED", score: 0 },
    true
  );
  assert(res.status === "clean", `Expected clean, got ${res.status}`);
});

// --- 6. LinkGuard ML Evaluator Tests ---
test("LinkGuard ML: benign prediction classified as clean with heuristic disclaimer", () => {
  const res = evaluateLinkGuardML(
    { status: "completed", modelPrediction: "benign", verdict: "BENIGN", riskLevel: "LOW", confidence: 70 },
    true
  );
  assert(res.status === "clean", `Expected clean, got ${res.status}`);
  assert(res.label.includes("*"), `Expected asterisk indicator, got ${res.label}`);
});

test("LinkGuard ML: suspicious when brand impersonation detected", () => {
  const res = evaluateLinkGuardML(
    { status: "completed", verdict: "BENIGN", signals: { brandImpersonation: true } },
    true
  );
  assert(res.status === "suspicious", `Expected suspicious, got ${res.status}`);
});

// --- 7. mapReportToScannerStatus Consensus Tests ---
const baseReport: SecurityReport = {
  url: "https://example.com/",
  domain: "example.com",
  verdict: "CLEAN",
  risk_level: "LOW",
  risk_score: 10,
  overall_risk_score: 10,
  overall_risk_level: "LOW",
  verdict_summary: "Clean",
  provider_status: { phishGuard: true, googleSafeBrowsing: true, urlhaus: true },
  checked_providers: 3,
  all_providers_available: true,
  providers: {},
  evidence: [],
  limitations: [],
};

test("ScannerStatus: inconclusive when backend verdict is explicitly INCONCLUSIVE", () => {
  const status = mapReportToScannerStatus({
    ...baseReport,
    verdict: "INCONCLUSIVE",
    overall_risk_level: "LOW",
    verdict_summary: "⚠️ INCONCLUSIVE — Not enough reliable information",
  });
  assert(status === "inconclusive", `Expected inconclusive, got ${status}`);
});

test("ScannerStatus: inconclusive when fewer than 3 providers responded and clean", () => {
  const status = mapReportToScannerStatus({
    ...baseReport,
    all_providers_available: false,
    checked_providers: 2,
  });
  assert(status === "inconclusive", `Expected inconclusive, got ${status}`);
});

test("ScannerStatus: threat when overall_risk_level is MEDIUM or HIGH", () => {
  const status = mapReportToScannerStatus({
    ...baseReport,
    overall_risk_level: "MEDIUM",
  });
  assert(status === "threat", `Expected threat, got ${status}`);
});

test("ScannerStatus: clean ONLY when consensus is complete or >= 3 providers without threat", () => {
  const status = mapReportToScannerStatus(baseReport);
  assert(status === "clean", `Expected clean, got ${status}`);
});

// --- 8. validateAndParseSecurityReport Edge Cases ---
test("Parser: coerces numeric strings safely without NaN", () => {
  const parsed = validateAndParseSecurityReport({
    url: "https://example.com",
    domain: "example.com",
    verdict: "CLEAN",
    risk_level: "LOW",
    risk_score: "15",
    overall_risk_score: "20",
    overall_risk_level: "LOW",
    verdict_summary: "Clean result",
    checked_providers: "6",
    all_providers_available: true,
    provider_status: {},
    providers: {},
  });
  assert(parsed.risk_score === 15, `Expected 15, got ${parsed.risk_score}`);
  assert(parsed.overall_risk_score === 20, `Expected 20, got ${parsed.overall_risk_score}`);
  assert(parsed.checked_providers === 6, `Expected 6, got ${parsed.checked_providers}`);
});

test("Parser: rejects missing mandatory fields", () => {
  let thrown = false;
  try {
    validateAndParseSecurityReport({
      url: "https://example.com",
      domain: "example.com",
      // missing verdict
    });
  } catch {
    thrown = true;
  }
  assert(thrown, "Expected parser to throw on missing verdict");
});

// --- 9. Stage 5.2 Focused Tests ---

test("Stage 5.2: Suspicious verdict with supporting threat evidence maps to threat status", () => {
  const suspiciousReport: SecurityReport = {
    ...baseReport,
    verdict: "SUSPICIOUS",
    overall_risk_level: "MEDIUM",
    overall_risk_score: 55,
    evidence: [
      {
        source: "PhishGuard",
        signal: "Excessive Subdomains",
        severity: "high",
        details: "Nested login prefix with 6 subdomains",
      },
    ],
  };
  const status = mapReportToScannerStatus(suspiciousReport);
  assert(status === "threat", `Expected threat, got ${status}`);
  assert(suspiciousReport.evidence.length === 1, "Expected 1 evidence item");
});

test("Stage 5.2: Medium score with low confidence and limited provider coverage", () => {
  const lowCoverageReport: SecurityReport = {
    ...baseReport,
    overall_risk_score: 34,
    overall_risk_level: "MEDIUM",
    confidence: "LOW",
    confidence_score: 45,
    checked_providers: 2,
    all_providers_available: false,
  };
  const status = mapReportToScannerStatus(lowCoverageReport);
  assert(status === "threat", `Expected threat for medium risk level, got ${status}`);
  assert(lowCoverageReport.checked_providers === 2, "Expected 2 checked providers");
  assert(lowCoverageReport.all_providers_available === false, "Expected all_providers_available false");
});

test("Stage 5.2: Queued VirusTotal analysis returns unknown status with Queued (Partial) label", () => {
  const res = evaluateVirusTotal(
    {
      status: "partial",
      analysisStatus: "queued",
      verdict: "PROVISIONAL_NO_FLAGS",
      stats: { malicious: 0, suspicious: 0, harmless: 0, undetected: 0 },
    },
    false
  );
  assert(res.status === "unknown", `Expected unknown, got ${res.status}`);
  assert(res.label === "Queued (Partial)", `Expected Queued (Partial), got ${res.label}`);
});

test("Stage 5.2: Unknown provider result returns unknown status with Unknown (No Data) label", () => {
  const resUrlhaus = evaluateUrlhaus({ queryStatus: "unrecognized_code" }, true);
  assert(resUrlhaus.status === "unknown", `Expected unknown, got ${resUrlhaus.status}`);
  assert(resUrlhaus.label === "Unknown (No Data)", `Expected Unknown (No Data), got ${resUrlhaus.label}`);

  const resUrlscan = evaluateUrlscan({ status: "running" }, true);
  assert(resUrlscan.status === "unknown", `Expected unknown, got ${resUrlscan.status}`);
  assert(resUrlscan.label === "Unknown (No Data)", `Expected Unknown (No Data), got ${resUrlscan.label}`);
});

test("Stage 5.2: Unavailable provider returns unavailable status", () => {
  const resGsb = evaluateGoogleSafeBrowsing({}, false);
  assert(resGsb.status === "unavailable", `Expected unavailable, got ${resGsb.status}`);
  assert(resGsb.label === "Unavailable", `Expected Unavailable, got ${resGsb.label}`);

  const resPhish = evaluatePhishGuard(undefined, false);
  assert(resPhish.status === "unavailable", `Expected unavailable, got ${resPhish.status}`);
  assert(resPhish.label === "Unavailable", `Expected Unavailable, got ${resPhish.label}`);
});

test("Stage 5.2: Verdict whose explanation fields are missing parses safely with default arrays", () => {
  const parsed = validateAndParseSecurityReport({
    url: "https://unknown-target.example.org",
    domain: "unknown-target.example.org",
    verdict: "SUSPICIOUS",
    risk_level: "MEDIUM",
    risk_score: 40,
    overall_risk_score: 40,
    overall_risk_level: "MEDIUM",
    verdict_summary: "Suspicious flags detected",
    checked_providers: 4,
    all_providers_available: false,
    provider_status: {},
    providers: {},
    // Notice overall_risk_score_reasons, why_dangerous, why_safe, evidence are completely omitted!
  });

  assert(parsed.verdict === "SUSPICIOUS", "Expected verdict SUSPICIOUS");
  assert(Array.isArray(parsed.overall_risk_score_reasons), "Expected overall_risk_score_reasons array");
  assert((parsed.overall_risk_score_reasons || []).length === 0, "Expected empty score reasons");
  assert(Array.isArray(parsed.evidence), "Expected evidence array");
  assert(parsed.evidence.length === 0, "Expected empty evidence");
  assert(Array.isArray(parsed.why_dangerous), "Expected why_dangerous array");
  assert(Array.isArray(parsed.why_safe), "Expected why_safe array");
});

// --- 10. Stage 6 UX & URL Safety Verification Tests ---

test("Stage 6: High-risk or malicious finding with critical severity evidence", () => {
  const highRiskReport: SecurityReport = {
    ...baseReport,
    verdict: "MALICIOUS",
    overall_risk_score: 95,
    overall_risk_level: "CRITICAL",
    verdict_summary: "Active credential harvesting phishing lure confirmed",
    overall_risk_warning_sources: ["Google Safe Browsing", "URLhaus"],
    evidence: [
      {
        source: "Google Safe Browsing",
        signal: "Social Engineering Blacklist",
        severity: "critical",
        details: "URL reported actively impersonating bank authentication portal",
      },
      {
        source: "URLhaus",
        signal: "Active Malware Payload",
        severity: "critical",
        details: "Associated with trojan downloader binary",
      },
    ],
  };

  const status = mapReportToScannerStatus(highRiskReport);
  assert(status === "threat", `Expected threat status, got ${status}`);
  assert(highRiskReport.overall_risk_score === 95, "Expected risk score 95");
  assert(highRiskReport.overall_risk_level === "CRITICAL", "Expected CRITICAL risk level");
  assert(highRiskReport.evidence.length === 2, "Expected 2 critical evidence items");
});

test("Stage 6: URL Safety: Rejects dangerous pseudo-protocols (javascript:, data:, file:)", () => {
  const jsRes = validateUrl("javascript:alert(1)");
  assert(!jsRes.isValid, "Expected javascript: to be rejected");
  assert(Boolean(jsRes.error?.includes("Disallowed protocol")), "Expected Disallowed protocol error message");

  const dataRes = validateUrl("data:text/html,<script>alert(1)</script>");
  assert(!dataRes.isValid, "Expected data: to be rejected");

  const fileRes = validateUrl("file:///etc/passwd");
  assert(!fileRes.isValid, "Expected file: to be rejected");
});

test("Stage 6: URL Safety: Rejects excessively long inputs (>4096 chars)", () => {
  const longUrl = "https://example.com/" + "a".repeat(4100);
  const res = validateAndNormalizeUrl(longUrl);
  assert(!res.isValid, "Expected URL > 4096 chars to be rejected");
  assert(Boolean(res.error?.includes("maximum permitted length")), "Expected max length error");
});

test("Stage 6: URL Safety: Correctly defangs URLs for safe logging and sharing", () => {
  const defangedHttp = defangUrl("http://evil-tracker.example.com/login?token=123");
  assert(defangedHttp.startsWith("hxxp://"), `Expected hxxp://, got ${defangedHttp}`);
  assert(defangedHttp.includes("[.]"), `Expected [.], got ${defangedHttp}`);

  const defangedHttps = defangUrl("https://phishing.site.ru/auth");
  assert(defangedHttps.startsWith("hxxps://"), `Expected hxxps://, got ${defangedHttps}`);
  assert(defangedHttps.includes("phishing[.]site[.]ru"), `Expected defanged domain, got ${defangedHttps}`);
});

console.log("\n==========================================");
const passedCount = results.filter((r) => r.passed).length;
console.log(`TOTAL: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
console.log("==========================================");

if (passedCount !== results.length) {
  process.exit(1);
}


