import { ScanRequest, ScanApiResponse, SecurityReport } from "@/types/scanner";

/**
 * Service client communicating with the local Next.js /api/scan proxy,
 * which routes safely to the n8n Cloud orchestration backend.
 */
export class ScannerService {
  /**
   * Submits a validated destination URL for multi-engine security inspection.
   *
   * @param request The URL to be scanned.
   * @returns A Promise resolving to the validated SecurityReport.
   * @throws Error containing server or network failure details.
   */
  async scanUrl(request: ScanRequest): Promise<SecurityReport> {
    let response: Response;

    try {
      response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ url: request.url }),
        cache: "no-store",
      });
    } catch {
      throw new Error(
        "Network connection failed. Unable to communicate with the local scan proxy."
      );
    }

    let data: ScanApiResponse;
    try {
      data = await response.json();
    } catch {
      throw new Error("Received an unparseable response from the scan service.");
    }

    if (!response.ok || !data.success || !data.report) {
      const errorMsg =
        data.error ||
        `Security inspection service error (HTTP ${response.status}).`;
      throw new Error(errorMsg);
    }

    return data.report;
  }
}

export const scannerService = new ScannerService();
