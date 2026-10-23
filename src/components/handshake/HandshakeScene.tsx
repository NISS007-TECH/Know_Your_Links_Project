import React from "react";
import { HandshakeIdle } from "./HandshakeIdle";
import { HandshakeScanning } from "./HandshakeScanning";
import { HandshakeClean } from "./HandshakeClean";
import { HandshakeThreat } from "./HandshakeThreat";
import { HandshakeInconclusive } from "./HandshakeInconclusive";
import { ScannerStatus, SecurityReport } from "@/types/scanner";

export type HandshakeState = ScannerStatus;

interface HandshakeSceneProps {
  state: HandshakeState;
  customErrorMessage?: string;
  report?: SecurityReport | null;
}

export function HandshakeScene({
  state,
  customErrorMessage,
  report,
}: HandshakeSceneProps) {
  // Safe bounded score extraction
  const overallScoreNum =
    report && typeof report.overall_risk_score === "number"
      ? Math.max(0, Math.min(100, Math.round(report.overall_risk_score)))
      : null;

  const formattedScore =
    overallScoreNum !== null
      ? `${String(overallScoreNum).padStart(2, "0")} / 100`
      : state === "clean"
      ? "04 / 100"
      : state === "threat"
      ? "88 / 100"
      : "— / 100";

  const scoreBarWidth =
    overallScoreNum !== null
      ? `${overallScoreNum}%`
      : state === "clean"
      ? "4%"
      : state === "threat"
      ? "88%"
      : "40%";

  return (
    <section
      aria-label="Inspection Simulation Viewport"
      className="relative w-full flex items-center justify-center select-none"
    >
      <div className="w-full relative rounded-[32px] overflow-hidden border border-[#285746] shadow-2xl bg-[#122820] aspect-[4/3] sm:aspect-[1.18/1]">
        {/* Reticle Vertical Laser Crosshair */}
        <div className="reticle-line-v pointer-events-none z-10" />

        {/* Dynamic Vector Animation Stage - Enlarged Hand Simulation */}
        <div className="absolute inset-0 flex items-center justify-center scale-120 sm:scale-130 origin-center pointer-events-none">
          {(state === "idle" || state === "validating") && <HandshakeIdle />}
          {state === "scanning" && <HandshakeScanning />}
          {state === "clean" && <HandshakeClean />}
          {state === "threat" && <HandshakeThreat />}
          {(state === "inconclusive" || state === "error") && (
            <HandshakeInconclusive />
          )}
        </div>

        {/* Top-Left Status Pill Badge */}
        <div className="absolute top-5 left-5 z-10">
          {state === "idle" && (
            <div className="glass-dark border border-[#305F4F]/80 rounded-full px-3 py-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FD14F] animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-100 font-medium tracking-wide">
                IDLE — hands apart
              </span>
            </div>
          )}
          {state === "validating" && (
            <div className="glass-dark border border-[#305F4F]/80 rounded-full px-3 py-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-100 font-medium tracking-wide">
                VALIDATING — verifying syntax
              </span>
            </div>
          )}
          {state === "scanning" && (
            <div className="glass-dark border border-[#305F4F]/80 rounded-full px-3 py-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8FD14F]" />
              </span>
              <span className="text-[11px] font-mono text-emerald-100 font-medium tracking-wide">
                SCANNING — hands approaching
              </span>
            </div>
          )}
          {state === "clean" && (
            <div className="glass-dark border border-[#305F4F]/80 rounded-full px-3 py-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8FD14F]" />
              <span className="text-[11px] font-mono text-emerald-100 font-medium tracking-wide">
                VERIFIED — hands clasped
              </span>
            </div>
          )}
          {state === "threat" && (
            <div className="inline-flex items-center gap-2 bg-[#3D0C0C]/90 border border-red-800/80 rounded-full px-3 py-1 text-xs font-mono font-bold tracking-wide shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30]" />
              <span className="text-[#FF6B6B]">
                {report?.overall_risk_level
                  ? `THREAT (${report.overall_risk_level.toUpperCase()}) — HANDSHAKE INTERRUPTED`
                  : "THREAT DETECTED — HANDSHAKE INTERRUPTED"}
              </span>
            </div>
          )}
          {state === "inconclusive" && (
            <div className="inline-flex items-center gap-2 bg-[#261517]/90 border border-amber-500/40 px-3.5 py-1 rounded-full shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wide uppercase">
                INCONCLUSIVE — INSUFFICIENT DATA
              </span>
            </div>
          )}
          {state === "error" && (
            <div className="inline-flex items-center gap-2 bg-[#261517]/90 border border-amber-500/40 px-3.5 py-1 rounded-full shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wide uppercase">
                UNRESOLVED — INSPECTION HALTED
              </span>
            </div>
          )}
        </div>

        {/* Top-Right Motion Telemetry Pill */}
        <div className="absolute top-5 right-5 z-10">
          <div className="glass-dark border border-[#305F4F]/80 rounded-full px-3 py-1">
            <span className="text-[11px] font-mono text-emerald-100/80 font-medium">
              {state === "idle" && "motion: ambient"}
              {state === "validating" && "motion: syntax check"}
              {state === "scanning" && "motion: active telemetry"}
              {state === "clean" && "motion: locked clasp"}
              {state === "threat" && "motion: fracture interruption"}
              {(state === "inconclusive" || state === "error") &&
                "motion: unresolved suspension"}
            </span>
          </div>
        </div>

        {/* Center Reticle Overlays */}
        {(state === "idle" || state === "validating") && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <div className="w-10 h-10 rounded-full bg-[#18392F]/80 border border-[#8FD14F]/60 flex items-center justify-center text-white mb-2 shadow-lg backdrop-blur-sm">
              <svg
                className="w-5 h-5 text-emerald-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
              </svg>
            </div>
            <div className="glass-dark border border-[#326151] rounded-full px-3 py-0.5 shadow-sm">
              <span className="text-[11px] font-mono text-emerald-100">
                {state === "validating"
                  ? "checking URL syntax..."
                  : "awaiting URL"}
              </span>
            </div>
          </div>
        )}

        {state === "scanning" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <div className="w-10 h-10 rounded-full bg-[#18392F]/80 border border-[#8FD14F]/80 flex items-center justify-center text-white mb-2 shadow-lg backdrop-blur-sm">
              <svg
                className="w-5 h-5 text-[#8FD14F] animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
              </svg>
            </div>
            <div className="glass-dark border border-[#326151] rounded-full px-3 py-0.5 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[11px] font-mono text-emerald-100">
                inspecting payload...
              </span>
            </div>
          </div>
        )}

        {state === "clean" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <div className="w-10 h-10 rounded-full bg-[#18392F]/90 border border-[#8FD14F] flex items-center justify-center text-white mb-2 shadow-lg backdrop-blur-sm">
              <svg
                className="w-5 h-5 text-[#8FD14F]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="glass-dark border border-[#326151] rounded-full px-3 py-0.5 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FD14F]" />
              <span className="text-[11px] font-mono text-emerald-100">
                no threats found
              </span>
            </div>
          </div>
        )}


        {/* Bottom Floating Badge & Overlaid Telemetry Cards */}
        <div className="absolute bottom-4 sm:bottom-5 inset-x-4 sm:inset-x-5 flex flex-col items-center gap-2.5 z-20 pointer-events-none">
          {/* Status Badge positioned cleanly above the cards */}
          {state === "threat" && (
            <div className="inline-flex items-center gap-2 bg-[#2D0B0B]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-800/80 shadow-xl text-xs font-mono text-[#FF9B9B] whitespace-nowrap pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              <span className="font-semibold tracking-wide">
                {report?.domain
                  ? `threat detected: ${report.domain}`
                  : "malicious destination identified"}
              </span>
            </div>
          )}

          {state === "inconclusive" && (
            <div className="inline-flex items-center gap-2 bg-[#261517]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/50 shadow-xl text-xs font-mono text-amber-300 whitespace-nowrap pointer-events-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] animate-pulse" />
              <span className="font-semibold tracking-wide">
                insufficient provider consensus
              </span>
            </div>
          )}

          {state === "error" && (
            <div className="inline-flex items-center gap-2 bg-[#261517]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/50 shadow-xl text-xs font-mono text-amber-300 whitespace-nowrap max-w-[90%] truncate pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <span className="font-semibold tracking-wide truncate">
                {customErrorMessage || "inspection halted: check URL input"}
              </span>
            </div>
          )}

          {/* Bottom Overlaid Status Cards inside Window */}
          <div
            className="w-full grid grid-cols-2 gap-3.5 pointer-events-auto"
            data-purpose="viewport-status-cards"
          >
          {/* Left Overlay Card: Overall Index */}
          <div className="bg-[#18352A]/90 backdrop-blur-md rounded-2xl p-4 border border-[#275344] text-white">
            <p className="text-[10px] font-mono tracking-wider text-emerald-200/70 uppercase font-semibold mb-1">
              OVERALL INDEX
            </p>

            {(state === "idle" ||
              state === "validating" ||
              state === "error") && (
              <>
                <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white mb-1">
                  —{" "}
                  <span className="text-sm font-normal text-emerald-200/60">
                    / 100
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  {state === "validating"
                    ? "Validating URL syntax..."
                    : state === "error"
                    ? "Inspection not started"
                    : "Heuristic, not a probability"}
                </p>
              </>
            )}

            {state === "scanning" && (
              <>
                <div className="text-sm sm:text-base font-bold font-mono tracking-tight text-white mb-1.5 flex items-center gap-2">
                  <span className="text-[#8FD14F] animate-pulse">
                    evaluating 6 sources...
                  </span>
                </div>
                <div className="w-full bg-[#122820] h-1.5 rounded-full overflow-hidden mb-1.5 border border-[#275344]">
                  <div className="bg-gradient-to-r from-[#8FD14F] to-[#D4F6EB] h-full rounded-full w-2/3 animate-pulse" />
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  Heuristic, not a probability
                </p>
              </>
            )}

            {state === "clean" && (
              <>
                <div className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#8FD14F] mb-1.5 flex items-center gap-2">
                  <span>{formattedScore}</span>
                  <span className="text-[11px] font-mono text-emerald-300 font-normal border border-[#8FD14F]/40 bg-[#8FD14F]/10 px-1.5 py-0.2 rounded">
                    {report?.overall_risk_level || "Low Risk"}
                  </span>
                </div>
                <div className="w-full bg-[#122820] h-1.5 rounded-full overflow-hidden mb-1.5 border border-[#275344]">
                  <div
                    className="bg-gradient-to-r from-[#8FD14F] to-[#D4F6EB] h-full rounded-full transition-all duration-700"
                    style={{ width: scoreBarWidth }}
                  />
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  {report?.overall_risk_score_method
                    ? `Index: ${report.overall_risk_score_method}`
                    : "Heuristic index — minimal indicators"}
                </p>
              </>
            )}

            {state === "threat" && (
              <>
                <div className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#FF4D4D] mb-1.5 flex items-center gap-2">
                  <span>{formattedScore}</span>
                  <span className="text-[11px] font-mono text-red-300 font-semibold border border-red-500/40 bg-red-950/60 px-1.5 py-0.2 rounded">
                    {report?.overall_risk_level || "High Risk"}
                  </span>
                </div>
                <div className="w-full bg-[#122820] h-1.5 rounded-full overflow-hidden mb-1.5 border border-[#275344]">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 h-full rounded-full transition-all duration-700"
                    style={{ width: scoreBarWidth }}
                  />
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  {report?.overall_risk_score_reasons?.[0] ||
                    "Heuristic index — multiple indicators"}
                </p>
              </>
            )}

            {state === "inconclusive" && (
              <>
                <div className="text-base sm:text-lg font-bold font-mono tracking-tight text-amber-400 mb-1.5 flex items-center gap-2">
                  <span>{formattedScore}</span>
                  <span className="text-[11px] font-mono text-amber-300 font-medium">
                    (missing feeds)
                  </span>
                </div>
                <div className="w-full bg-[#122820] h-1.5 rounded-full overflow-hidden mb-1.5 border border-[#275344]">
                  <div
                    className="bg-[#D97706] h-full rounded-full transition-all duration-700"
                    style={{ width: scoreBarWidth }}
                  />
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  {report?.checked_providers !== undefined
                    ? `Heuristic index — ${report.checked_providers}/6 sources checked`
                    : "Heuristic index — providers unreachable"}
                </p>
              </>
            )}
          </div>

          {/* Right Overlay Card: Provider Verdict */}
          <div className="bg-[#18352A]/90 backdrop-blur-md rounded-2xl p-4 border border-[#275344] text-white">
            <p className="text-[10px] font-mono tracking-wider text-emerald-200/70 uppercase font-semibold mb-1">
              PROVIDER VERDICT
            </p>

            {(state === "idle" ||
              state === "validating" ||
              state === "error") && (
              <>
                <p className="text-lg sm:text-xl font-bold tracking-tight text-white mb-1 truncate">
                  {state === "validating"
                    ? "Validating URL..."
                    : state === "error"
                    ? "Input error"
                    : "Not scanned"}
                </p>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  Unknown is never shown as safe
                </p>
              </>
            )}

            {state === "scanning" && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <p className="text-base sm:text-lg font-bold tracking-tight text-amber-300 truncate">
                    Querying feeds...
                  </p>
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  Unknown is never shown as safe
                </p>
              </>
            )}

            {state === "clean" && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#8FD14F]" />
                  <p
                    className="text-base sm:text-lg font-bold tracking-tight text-emerald-300 truncate"
                    title={
                      report?.verdict_summary ||
                      `Clean across ${report?.checked_providers || 6} sources`
                    }
                  >
                    {report?.verdict_summary ||
                      `Clean across ${report?.checked_providers || 6} sources`}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  0 malicious / 0 suspicious detected
                </p>
              </>
            )}

            {state === "threat" && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
                  <p
                    className="text-sm sm:text-base font-bold tracking-tight text-red-300 truncate"
                    title={
                      report?.verdict_summary || "Threat flagged by security sources"
                    }
                  >
                    {report?.verdict_summary || "Threat flagged by security sources"}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  {report?.overall_risk_warning_sources?.length
                    ? `Flagged by: ${report.overall_risk_warning_sources.join(", ")}`
                    : "Confirmed threat intelligence"}
                </p>
              </>
            )}

            {state === "inconclusive" && (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <p
                    className="text-sm sm:text-base font-bold tracking-tight text-amber-300 truncate"
                    title={
                      report?.verdict_summary || "Insufficient provider consensus"
                    }
                  >
                    {report?.verdict_summary || "Insufficient provider consensus"}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-200/70 truncate">
                  Unknown stays amber. Never shown as clean.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
