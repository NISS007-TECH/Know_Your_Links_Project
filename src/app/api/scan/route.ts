import { NextRequest, NextResponse } from "next/server";
import { validateAndNormalizeUrl } from "@/lib/urlUtils";
import { validateAndParseSecurityReport } from "@/types/scanner";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request payload. Expected JSON body with 'url'.",
          code: "INVALID_JSON",
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || !("url" in body) || typeof body.url !== "string") {
      return NextResponse.json(
        {
          error: "Missing required 'url' field in request body.",
          code: "MISSING_URL",
        },
        { status: 400 }
      );
    }

    const validation = validateAndNormalizeUrl(body.url);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.error || "Invalid destination URL.",
          code: "INVALID_URL",
          inputUrl: body.url,
        },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        {
          error: "Security analysis backend is not configured on this server (missing N8N_WEBHOOK_URL).",
          code: "SERVICE_UNCONFIGURED",
          inputUrl: validation.normalizedUrl,
        },
        { status: 503 }
      );
    }

    // Configurable timeout (default: 30,000 ms)
    const timeoutMs = parseInt(process.env.N8N_TIMEOUT_MS || "30000", 10);
    const timeoutDuration = isNaN(timeoutMs) || timeoutMs <= 0 ? 30000 : timeoutMs;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Only inject authorization header if explicitly configured in environment
    const webhookToken = process.env.N8N_WEBHOOK_TOKEN;
    if (webhookToken && webhookToken.trim()) {
      headers["Authorization"] = `Bearer ${webhookToken.trim()}`;
    }

    let n8nResponse: Response;
    try {
      n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ url: validation.normalizedUrl }),
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof Error && (err.name === "AbortError" || err.message.includes("aborted"))) {
        return NextResponse.json(
          {
            error: `Analysis timed out after ${Math.round(timeoutDuration / 1000)} seconds while aggregating provider threat intelligence. Please try again.`,
            code: "UPSTREAM_TIMEOUT",
            inputUrl: validation.normalizedUrl,
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          error: "Unable to reach security analysis service. Please check network connectivity or backend status.",
          code: "UPSTREAM_UNREACHABLE",
          inputUrl: validation.normalizedUrl,
        },
        { status: 502 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!n8nResponse.ok) {
      let upstreamDetail = "";
      try {
        const errorJson = await n8nResponse.json();
        if (errorJson && typeof errorJson === "object" && "message" in errorJson) {
          upstreamDetail = String(errorJson.message);
        }
      } catch {
        // Upstream response was not JSON
      }

      return NextResponse.json(
        {
          error: upstreamDetail
            ? `Security backend returned an error: ${upstreamDetail}`
            : `Security backend returned HTTP status ${n8nResponse.status}.`,
          code: "UPSTREAM_HTTP_ERROR",
          status: n8nResponse.status,
          inputUrl: validation.normalizedUrl,
        },
        { status: 502 }
      );
    }

    let rawData: unknown;
    try {
      rawData = await n8nResponse.json();
    } catch {
      return NextResponse.json(
        {
          error: "Security analysis backend returned malformed, non-JSON output.",
          code: "UPSTREAM_MALFORMED_OUTPUT",
          inputUrl: validation.normalizedUrl,
        },
        { status: 502 }
      );
    }

    // Option A: If VirusTotal multi-engine aggregator is queued or partial,
    // poll upstream up to 2 times to allow the 70+ antivirus engines to complete
    const isVirusTotalQueued = (data: unknown): boolean => {
      if (!data || typeof data !== "object") return false;
      const payload = Array.isArray(data) ? data[0] : data;
      if (!payload || typeof payload !== "object") return false;
      const obj = payload as Record<string, unknown>;
      const providers = obj.providers as Record<string, unknown> | undefined;
      const vt = providers?.virusTotal as Record<string, unknown> | undefined;
      const providerStatus = obj.provider_status as Record<string, boolean> | undefined;

      return (
        providerStatus?.virusTotal === false ||
        vt?.status === "partial" ||
        vt?.analysisStatus === "queued"
      );
    };

    if (isVirusTotalQueued(rawData) && !controller.signal.aborted) {
      const maxRetries = parseInt(process.env.VT_POLL_RETRIES || "2", 10);
      const pollDelayMs = parseInt(process.env.VT_POLL_DELAY_MS || "4000", 10);

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (controller.signal.aborted) break;

        // Pause to allow background multi-engine processing to finish
        await new Promise((resolve) => setTimeout(resolve, pollDelayMs));
        if (controller.signal.aborted) break;

        try {
          const pollResponse = await fetch(webhookUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({ url: validation.normalizedUrl }),
            signal: controller.signal,
            cache: "no-store",
          });

          if (pollResponse.ok) {
            const pollData = await pollResponse.json();
            if (pollData) {
              rawData = pollData;
              // If VirusTotal analysis has completed, exit polling early
              if (!isVirusTotalQueued(rawData)) {
                break;
              }
            }
          }
        } catch {
          // If polling request fails or times out, proceed gracefully with existing rawData
          break;
        }
      }
    }

    try {
      const parsedReport = validateAndParseSecurityReport(rawData);
      return NextResponse.json({
        success: true,
        report: parsedReport,
      });
    } catch (validationErr: unknown) {
      const message =
        validationErr instanceof Error
          ? validationErr.message
          : "Response failed schema validation.";
      return NextResponse.json(
        {
          error: `Backend response schema mismatch: ${message}`,
          code: "UPSTREAM_SCHEMA_MISMATCH",
          inputUrl: validation.normalizedUrl,
        },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      {
        error: "An unexpected internal server error occurred while processing the scan request.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
