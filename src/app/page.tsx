"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HandshakeScene } from "@/components/handshake/HandshakeScene";
import { UrlScannerForm } from "@/components/scanner/UrlScannerForm";
import { ProviderNetworkGrid } from "@/components/scanner/ProviderNetworkGrid";
import {
  ScannerStatus,
  SecurityReport,
  mapReportToScannerStatus,
} from "@/types/scanner";
import { scannerService } from "@/lib/scannerService";
import { SecurityReportView } from "@/components/report/SecurityReportView";

export default function HomePage() {
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus>("idle");
  const [activeUrl, setActiveUrl] = useState<string>("");
  const [activeReport, setActiveReport] = useState<SecurityReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleScanSubmit = async (validUrl: string) => {
    // Prevent duplicate submissions while a scan is running
    if (scannerStatus === "scanning" || scannerStatus === "validating") {
      return;
    }

    setActiveUrl(validUrl);
    setScannerStatus("scanning");
    setErrorMessage(null);
    setStatusNotice(
      "Querying 6 security intelligence sources. Handshake pending telemetry..."
    );

    try {
      const report = await scannerService.scanUrl({ url: validUrl });
      setActiveReport(report);

      const nextStatus = mapReportToScannerStatus(report);
      setScannerStatus(nextStatus);

      if (nextStatus === "clean") {
        setStatusNotice(
          `Analysis complete: Minimal threat indicators across ${
            report.checked_providers || 6
          } sources.`
        );
      } else if (nextStatus === "threat") {
        setStatusNotice(
          `Analysis complete: ${
            report.overall_risk_level || "Threat"
          } identified. Handshake interrupted.`
        );
      } else {
        setStatusNotice(
          `Analysis inconclusive: Incomplete provider consensus (${
            report.checked_providers || 0
          }/6 sources available).`
        );
      }

      // Smoothly navigate to the detailed report for effortless access on mobile and desktop
      setTimeout(() => {
        const reportEl = document.getElementById("report-view");
        if (reportEl) {
          reportEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during security inspection.";
      setScannerStatus("error");
      setErrorMessage(msg);
      setStatusNotice(null);
    }
  };

  const handleReset = () => {
    setScannerStatus("idle");
    setActiveUrl("");
    setActiveReport(null);
    setErrorMessage(null);
    setStatusNotice(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-deep-jade text-white selection:bg-lime-accent selection:text-jade-950">
      {/* Brand Navigation Header */}
      <header className="w-full bg-[#1C4839] border-b border-[#245745]/60 px-6 sm:px-10 lg:px-16 py-5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo and Brand Title */}
          <Link
            href="/"
            onClick={handleReset}
            className="flex items-center gap-3.5 group cursor-pointer"
            data-purpose="brand-identity"
          >
            <div className="w-10 h-10 rounded-full bg-lime-accent flex items-center justify-center text-jade-950 shadow-sm transition-transform group-hover:scale-105">
              <svg
                className="w-5 h-5 text-jade-950"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <line x1="7" x2="17" y1="9" y2="9" />
                <path d="M8 15c1 1.5 2.5 2 4 2s3-.5 4-2" />
              </svg>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-none block">
                Know Your Links
              </span>
              <span className="text-xs font-mono uppercase tracking-[0.22em] text-sea-glass mt-1 font-medium block">
                TRUST HANDSHAKE
              </span>
            </div>
          </Link>

          {/* Navigation Links and Live Status Pill */}
          <nav
            aria-label="Main Navigation"
            className="flex items-center gap-6 sm:gap-8"
          >
            <a
              className="text-sm sm:text-base font-medium text-emerald-100/90 hover:text-white transition-colors hidden md:inline"
              href="#how-it-inspects"
            >
              How it inspects
            </a>
            <a
              className="text-sm sm:text-base font-medium text-emerald-100/90 hover:text-white transition-colors hidden md:inline"
              href="#providers"
            >
              Providers
            </a>
            <a
              className="text-sm sm:text-base font-medium text-emerald-100/90 hover:text-white transition-colors hidden md:inline"
              href="#limitations"
            >
              Limitations
            </a>
            {/* Live Sources Pill */}
            <div
              className="flex items-center gap-2 bg-[#17372C] border border-[#275947] px-3.5 py-1.5 rounded-full shadow-inner"
              data-purpose="status-badge"
            >
              <span className="w-2 h-2 rounded-full bg-lime-accent inline-block animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-medium text-emerald-100 tracking-wide">
                6 sources live
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Hero & Console Section */}
      <main className="flex-grow bg-[#1C4839] px-6 sm:px-10 lg:px-16 pt-8 pb-14">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Inspection Input & Copy */}
          <section
            aria-label="URL Inspection Console"
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Badge: Evidence-Led URL Inspection */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#183B2F] border border-[#2B604D] w-fit mb-6">
              <svg
                className="w-4 h-4 text-lime-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-xs font-mono uppercase tracking-[0.16em] text-sea-glass font-medium">
                EVIDENCE-LED URL INSPECTION
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl xl:text-[68px] font-bold text-white tracking-tight leading-[1.06] mb-5">
              Know before<br />
              you open<span className="text-lime-accent">.</span>
            </h1>

            {/* Subheading */}
            <p className="text-emerald-100/80 italic font-normal text-lg sm:text-xl leading-relaxed max-w-xl mb-9">
              Paste an unfamiliar link. We ask six security sources what they have seen — then show you, plainly.
            </p>

            {/* URL Input Form Component */}
            <UrlScannerForm
              status={scannerStatus}
              onSubmitScan={handleScanSubmit}
            />

            {/* Error Feedback Banner */}
            {scannerStatus === "error" && errorMessage && (
              <div
                className="mt-4 p-4 rounded-2xl bg-[#2D0B0B]/90 border border-red-800/80 text-xs sm:text-sm font-mono text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-300">
                      Security Inspection Notice
                    </p>
                    <p className="text-red-200/90 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  {activeUrl && (
                    <button
                      type="button"
                      onClick={() => handleScanSubmit(activeUrl)}
                      className="px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-xs sm:text-sm font-medium text-red-100 transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg bg-transparent hover:bg-white/10 text-xs sm:text-sm text-red-300 transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Live Progress or Completion Notice Banner */}
            {statusNotice && scannerStatus !== "error" && (
              <div
                className={`mt-4 p-3.5 rounded-xl border text-xs sm:text-sm font-mono flex items-center justify-between gap-3 animate-fade-in ${
                  scannerStatus === "threat"
                    ? "bg-[#2A0E10] border-red-800/80 text-red-200"
                    : scannerStatus === "clean"
                    ? "bg-[#142F24] border-emerald-700/80 text-emerald-200"
                    : scannerStatus === "inconclusive"
                    ? "bg-[#261A10] border-amber-700/80 text-amber-200"
                    : "bg-[#142F24] border-[#2B604D] text-emerald-200"
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      scannerStatus === "scanning"
                        ? "bg-lime-accent animate-ping"
                        : scannerStatus === "threat"
                        ? "bg-red-500 animate-pulse"
                        : scannerStatus === "clean"
                        ? "bg-emerald-400"
                        : "bg-amber-400 animate-pulse"
                    }`}
                  />
                  <span>{statusNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs sm:text-sm text-lime-accent hover:underline flex-shrink-0"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Trust Checkmarks Row */}
            <div className="flex flex-wrap items-center gap-6 mt-6 text-xs sm:text-sm font-medium text-emerald-100/90 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-lime-accent">✓</span>
                <span>No account needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lime-accent">✓</span>
                <span>Conflicts stay visible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lime-accent">✓</span>
                <span>Print-friendly report</span>
              </div>
            </div>
          </section>

          {/* Right Column: Handshake Scene Viewport */}
          <div className="lg:col-span-6 w-full">
            <HandshakeScene
              state={scannerStatus}
              customErrorMessage={errorMessage || undefined}
              report={activeReport}
            />
          </div>
        </div>
      </main>

      {/* Detailed Security Report when scan completes, or Provider Network Standby Grid */}
      {activeReport &&
      (scannerStatus === "clean" ||
        scannerStatus === "threat" ||
        scannerStatus === "inconclusive") ? (
        <div id="report-view">
          <SecurityReportView report={activeReport} onReset={handleReset} />
        </div>
      ) : (
        <ProviderNetworkGrid status={scannerStatus} report={null} />
      )}

      {/* Persistent Disclaimer Footer */}
      <footer className="w-full bg-[#132A21] border-t border-[#1C3E32] px-6 sm:px-10 lg:px-16 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-mono text-[#8BB7A7] gap-3">
          <div>
            © Know Your Links — awareness tool, not antivirus. Does not guarantee safety.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/privacy"
              className="text-[#8BB7A7] hover:text-white transition-colors underline"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="text-[#8BB7A7] hover:text-white transition-colors underline"
            >
              Terms & Security Disclaimer
            </Link>
            <span>•</span>
            <span>Heuristic index / 100</span>
            <span>•</span>
            <Link
              href="/dev-preview"
              className="text-slate-400 hover:text-white transition-colors underline"
            >
              Dev preview
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
