/**
 * URL validation, normalization, and defanging utilities for cybersecurity analysis.
 */

export interface URLValidationResult {
  isValid: boolean;
  normalizedUrl: string;
  domain: string;
  error?: string;
  defangedUrl?: string;
}

export type UrlValidationResult = URLValidationResult;

/**
 * Validates and normalizes an input URL for security scanning.
 * Enforces strict RFC compliance, rejects credential leakage, and forbids non-HTTP(S) schemes.
 */
export function validateAndNormalizeUrl(rawInput: string): URLValidationResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Please enter a destination URL to analyze.",
    };
  }

  // Reject excessive length
  if (trimmed.length > 4096) {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "URL exceeds the maximum permitted length of 4096 characters.",
    };
  }

  // Reject internal whitespace
  if (/\s/.test(trimmed)) {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "URL must not contain internal spaces.",
    };
  }

  // Explicitly check for dangerous pseudo-protocols before adding schemes
  const lower = trimmed.toLowerCase();
  const dangerousSchemes = ["javascript:", "data:", "vbscript:", "file:", "blob:"];
  for (const scheme of dangerousSchemes) {
    if (lower.startsWith(scheme)) {
      return {
        isValid: false,
        normalizedUrl: "",
        domain: "",
        error: `Disallowed protocol '${scheme}'. Only HTTP and HTTPS destinations are supported.`,
      };
    }
  }

  // Add default https:// scheme if omitted
  const candidate = trimmed.includes("://") ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        isValid: false,
        normalizedUrl: "",
        domain: "",
        error: "Only standard HTTP and HTTPS web destinations are supported.",
      };
    }

    if (!parsed.hostname) {
      return {
        isValid: false,
        normalizedUrl: "",
        domain: "",
        error: "Invalid URL: Destination hostname is missing.",
      };
    }

    // Disallow embedded credentials (e.g. https://user:pass@example.com)
    if (parsed.username || parsed.password) {
      return {
        isValid: false,
        normalizedUrl: "",
        domain: "",
        error: "URLs containing embedded usernames or passwords are not permitted.",
      };
    }

    // Hostname must contain at least one valid character sequence and not be a lone dot
    if (parsed.hostname.startsWith(".") || parsed.hostname.endsWith(".")) {
      return {
        isValid: false,
        normalizedUrl: "",
        domain: "",
        error: "Destination hostname has invalid leading or trailing periods.",
      };
    }

    // Hostname must contain at least one dot (e.g. domain.tld)
    if (!parsed.hostname.includes(".")) {
      return {
        isValid: false,
        normalizedUrl: "",
        domain: "",
        error: "Please enter a valid domain name with extension (e.g., example.com).",
      };
    }

    const normalizedUrl = parsed.toString();
    const defanged = defangUrl(normalizedUrl);

    return {
      isValid: true,
      normalizedUrl,
      domain: parsed.hostname,
      defangedUrl: defanged,
    };
  } catch {
    return {
      isValid: false,
      normalizedUrl: "",
      domain: "",
      error: "Malformed URL syntax. Please enter a valid web destination.",
    };
  }
}

/**
 * Convenient wrapper for frontend form validation.
 */
export function validateUrl(rawInput: string): URLValidationResult {
  return validateAndNormalizeUrl(rawInput);
}

/**
 * Defangs a URL to prevent accidental browser execution or accidental clicks in security reports.
 * Example: https://secure-login.com/path -> hxxps://secure-login[.]com/path
 */
export function defangUrl(rawUrl: string): string {
  try {
    const candidate = rawUrl.includes("://") ? rawUrl : `https://${rawUrl}`;
    const parsed = new URL(candidate);

    const defangedScheme = parsed.protocol === "https:" ? "hxxps" : "hxxp";
    const defangedHost = parsed.hostname.replace(/\./g, "[.]");
    const portPart = parsed.port ? `:${parsed.port}` : "";
    const pathAndQuery = `${parsed.pathname}${parsed.search}${parsed.hash}`;

    return `${defangedScheme}://${defangedHost}${portPart}${pathAndQuery}`;
  } catch {
    // Fallback defanging if URL parsing fails
    return rawUrl
      .replace(/^https:\/\//i, "hxxps://")
      .replace(/^http:\/\//i, "hxxp://")
      .replace(/\./g, "[.]");
  }
}
