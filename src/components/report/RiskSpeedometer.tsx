"use client";

import React, { useEffect, useState, useRef } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

interface RiskSpeedometerProps {
  score: number; // 0 to 100
  riskLevel: string; // "LOW", "MEDIUM", "HIGH", "CRITICAL", "INCONCLUSIVE"
  isInconclusive: boolean;
}

export function RiskSpeedometer({
  score,
  riskLevel,
  isInconclusive,
}: RiskSpeedometerProps) {
  // Target score bounded 0–100 from actual scan
  const actualTargetScore = Math.max(0, Math.min(100, Math.round(score)));

  // Active target
  const [activeTarget, setActiveTarget] = useState<number>(actualTargetScore);
  const [maxScale, setMaxScale] = useState<number>(100);
  const [currentVal, setCurrentVal] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedOnScrollRef = useRef<boolean>(false);

  // Speedometer geometry
  // Arc spans 240 degrees (from 150° to 390°, or -120° to +120° from vertical top)
  const center = 120;
  const centerY = 118;
  const radius = 85;
  const strokeWidth = 14;
  const startAngle = -120; // 0%
  const endAngle = 120; // 100%
  const totalAngleSpan = endAngle - startAngle; // 240 degrees

  // Calculate current fraction and angle
  const fraction = Math.max(0, Math.min(1, currentVal / maxScale));
  const currentAngle = startAngle + fraction * totalAngleSpan;

  // Arc length for SVG stroke-dasharray: 2 * PI * 85 * (240 / 360) ≈ 356.05
  const arcCircumference = 2 * Math.PI * radius * (totalAngleSpan / 360);
  const activeDashoffset = arcCircumference - fraction * arcCircumference;

  // Status Pill configuration based on activeTarget & riskLevel
  let pillLabel = "LOW RISK VERIFIED";
  let pillClasses = "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]";
  let dotColor = "bg-[#059669]";
  let profileName = "Clean";
  let profileColor = "text-[#059669]";

  if (isInconclusive && activeTarget === actualTargetScore) {
    pillLabel = "INCONCLUSIVE CONSENSUS";
    pillClasses = "bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]";
    dotColor = "bg-[#B45309]";
    profileName = "Inconclusive";
    profileColor = "text-[#F59E0B]";
  } else if (
    riskLevel === "CRITICAL" ||
    riskLevel === "HIGH" ||
    activeTarget / maxScale >= 0.7
  ) {
    pillLabel = "HIGH RISK DETECTED";
    pillClasses = "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]";
    dotColor = "bg-[#DC2626]";
    profileName = "Malicious";
    profileColor = "text-[#EF4444]";
  } else if (
    riskLevel === "MEDIUM" ||
    riskLevel === "SUSPICIOUS" ||
    activeTarget / maxScale >= 0.3
  ) {
    pillLabel = "SUSPICIOUS WARNING";
    pillClasses = "bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]";
    dotColor = "bg-[#D97706]";
    profileName = "Suspicious";
    profileColor = "text-[#F59E0B]";
  }

  // Update target when prop changes
  useEffect(() => {
    setActiveTarget(actualTargetScore);
    setMaxScale(100);
    hasAnimatedOnScrollRef.current = false;
  }, [actualTargetScore]);

  // Calibrated risk gauge sweep sequence (slowed down for clear legibility):
  // Phase 1: 0 -> maxScale (gradual sweep to top scale, ~1350ms)
  // Phase 2: brief hold at peak (~220ms)
  // Phase 3: maxScale -> targetVal (smooth, deliberate deceleration to target score, ~1650ms)
  const triggerGaugeAnimation = (targetVal: number, scaleMax: number = 100) => {
    setIsAnimating(true);
    const startTime = performance.now();
    const phase1Duration = 1350;
    const pauseDuration = 220;
    const phase2Duration = 1650;
    const totalDuration = phase1Duration + pauseDuration + phase2Duration;

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < phase1Duration) {
        // Phase 1: 0 -> scaleMax (smooth upward sweep)
        const progress = Math.min(1, elapsed / phase1Duration);
        const eased = easeInOutQuad(progress);
        setCurrentVal(Math.round(eased * scaleMax));
        requestAnimationFrame(frame);
      } else if (elapsed < phase1Duration + pauseDuration) {
        // Phase 2: Hold at peak
        setCurrentVal(scaleMax);
        requestAnimationFrame(frame);
      } else if (elapsed < totalDuration) {
        // Phase 3: scaleMax -> targetVal (gradual settle down)
        const settleElapsed = elapsed - (phase1Duration + pauseDuration);
        const progress = Math.min(1, settleElapsed / phase2Duration);
        const eased = easeOutCubic(progress);
        const val = scaleMax - (scaleMax - targetVal) * eased;
        setCurrentVal(Math.round(val));
        requestAnimationFrame(frame);
      } else {
        // Complete
        setCurrentVal(targetVal);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(frame);
  };

  // Trigger on scroll or mount
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setCurrentVal(activeTarget);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedOnScrollRef.current) {
          hasAnimatedOnScrollRef.current = true;
          triggerGaugeAnimation(activeTarget, maxScale);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [activeTarget, maxScale]);

  // Generate radial tick marks (17 ticks from 0 to maxScale)
  const tickCount = 17;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tickFraction = i / (tickCount - 1);
    const angleDeg = startAngle + tickFraction * totalAngleSpan;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const outerR = radius - 8;
    const innerR = radius - 16;
    const isMajor = i % 4 === 0;

    const x1 = center + (innerR - (isMajor ? 2 : 0)) * Math.cos(angleRad);
    const y1 = centerY + (innerR - (isMajor ? 2 : 0)) * Math.sin(angleRad);
    const x2 = center + outerR * Math.cos(angleRad);
    const y2 = centerY + outerR * Math.sin(angleRad);

    return { x1, y1, x2, y2, isMajor, key: i };
  });

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0D241C] border border-[#1E4839] rounded-3xl p-6 sm:p-8 shadow-2xl text-white select-none relative overflow-hidden"
      role="region"
      aria-label={`Automotive Radial Risk Gauge: ${activeTarget} out of ${maxScale}`}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
        {/* ========================================================= */}
        {/* LEFT COLUMN: The White Speedometer Card (Enlarged)        */}
        {/* ========================================================= */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-2xl border border-slate-100 w-full sm:w-[380px] lg:w-[420px] max-w-full flex flex-col items-center text-center shrink-0">
          {/* Card Title */}
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold font-sans text-[#1E293B] tracking-tight">
              Risk Score
            </h3>
          </div>

          {/* Speedometer SVG Dial */}
          <div className="relative w-64 h-52 sm:w-72 sm:h-56 my-3 flex items-center justify-center">
            <svg
              viewBox="0 0 240 200"
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                {/* Luminous Gradient: Blue -> Purple -> Magenta -> Red */}
                <linearGradient
                  id="speedometerGradient"
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="30%" stopColor="#3B82F6" />
                  <stop offset="60%" stopColor="#A855F7" />
                  <stop offset="85%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>

                {/* Soft outer glow for the active arc */}
                <filter
                  id="gaugeGlow"
                  x="-25%"
                  y="-25%"
                  width="150%"
                  height="150%"
                >
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="4.5"
                    floodColor="#EC4899"
                    floodOpacity="0.35"
                  />
                </filter>

                {/* Needle drop shadow */}
                <filter
                  id="needleShadow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
                  <feDropShadow
                    dx="1"
                    dy="2"
                    stdDeviation="2"
                    floodColor="#000000"
                    floodOpacity="0.25"
                  />
                </filter>
              </defs>

              {/* Inactive Background Arc Track (Faint Light Gray) */}
              <path
                d="M 46.39 160.5 A 85 85 0 1 1 193.61 160.5"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Glowing Active Gradient Arc */}
              <path
                d="M 46.39 160.5 A 85 85 0 1 1 193.61 160.5"
                fill="none"
                stroke="url(#speedometerGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={arcCircumference}
                strokeDashoffset={activeDashoffset}
                filter="url(#gaugeGlow)"
                style={{
                  transition: "stroke-dashoffset 80ms linear",
                }}
              />

              {/* Radial Dial Ticks */}
              {ticks.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.isMajor ? "#94A3B8" : "#E2E8F0"}
                  strokeWidth={t.isMajor ? "1.75" : "1.2"}
                  strokeLinecap="round"
                />
              ))}

              {/* Needle Group rotating about (center, centerY) */}
              <g
                transform={`rotate(${currentAngle} ${center} ${centerY})`}
                filter="url(#needleShadow)"
                style={{
                  willChange: "transform",
                }}
              >
                {/* Tapered Red Pointer */}
                <path
                  d={`M ${center - 4} ${centerY} L ${center - 1} ${centerY - 64} L ${center + 1} ${centerY - 64} L ${center + 4} ${centerY} Z`}
                  fill="#EF4444"
                />
                {/* Needle Apex */}
                <polygon
                  points={`${center - 2},${centerY - 64} ${center},${centerY - 72} ${center + 2},${centerY - 64}`}
                  fill="#EF4444"
                />
                {/* Circular Center Hub (White center with Red Ring & inner pin) */}
                <circle
                  cx={center}
                  cy={centerY}
                  r="10"
                  fill="#FFFFFF"
                  stroke="#EF4444"
                  strokeWidth="3.5"
                />
                <circle cx={center} cy={centerY} r="3.5" fill="#EF4444" />
              </g>
            </svg>
          </div>

          {/* Digital Readout */}
          <div className="flex items-baseline justify-center gap-1.5 mt-3 font-sans">
            <span className="text-7xl font-black text-[#0F172A] tracking-tight">
              {currentVal}
            </span>
            <span className="text-4xl font-bold text-[#94A3B8]">
              /{maxScale}
            </span>
          </div>

          {/* Status Pill Badge */}
          <div className="mt-5">
            <div
              className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm sm:text-base font-mono font-bold uppercase tracking-wider border shadow-sm ${pillClasses}`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 ${dotColor}`} />
              <span>{pillLabel}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Threat Intelligence & Risk Telemetry        */}
        {/* ========================================================= */}
        <div className="flex-1 w-full space-y-6">
          {/* Top Badges Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#153428] border border-[#275945] text-[#8FD14F] text-xs sm:text-sm font-mono font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#8FD14F]" />
              <span>MULTI-SOURCE THREAT TELEMETRY</span>
            </div>

            <div className="flex items-center gap-2 text-sm font-mono text-[#91C7B7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8FD14F] animate-pulse" />
              <span>Telemetry Live</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-bold font-sans text-white tracking-tight">
              Composite Threat Assessment
            </h2>
            <p className="text-sm sm:text-base font-sans text-[#91C7B7] leading-relaxed max-w-xl">
              Synthesizes signals across threat intelligence blocklists, heuristic brand impersonation classifiers, and domain telemetry into a normalized risk evaluation.
            </p>
          </div>

          {/* Three Mini Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {/* Card 1: Risk Index */}
            <div className="bg-[#132E23] border border-[#23523F] rounded-xl p-4 space-y-1.5 shadow-xs">
              <div className="text-xs font-mono uppercase font-bold text-[#8BB7A7] tracking-wider">
                RISK INDEX
              </div>
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-white">
                {currentVal} / {maxScale}
              </div>
              <div className="text-xs font-mono text-[#719E8E]">
                Normalized heuristic scale
              </div>
            </div>

            {/* Card 2: Evaluation Status */}
            <div className="bg-[#132E23] border border-[#23523F] rounded-xl p-4 space-y-1.5 shadow-xs">
              <div className="text-xs font-mono uppercase font-bold text-[#8BB7A7] tracking-wider">
                EVALUATION STATUS
              </div>
              <div className="text-xl sm:text-2xl font-mono font-extrabold flex items-center gap-2 text-white">
                <span className={`w-2.5 h-2.5 rounded-full ${isAnimating ? "bg-amber-400 animate-ping" : "bg-[#8FD14F]"}`} />
                <span className={isAnimating ? "text-amber-400" : "text-[#8FD14F]"}>
                  {isAnimating ? "Evaluating Feeds" : "Calibrated Lock"}
                </span>
              </div>
              <div className="text-xs font-mono text-[#719E8E]">
                {isAnimating ? "Synthesizing intelligence" : "Multi-source consensus ready"}
              </div>
            </div>

            {/* Card 3: Consensus Verdict */}
            <div className="bg-[#132E23] border border-[#23523F] rounded-xl p-4 space-y-1.5 shadow-xs">
              <div className="text-xs font-mono uppercase font-bold text-[#8BB7A7] tracking-wider">
                CONSENSUS VERDICT
              </div>
              <div className={`text-xl sm:text-2xl font-mono font-extrabold ${profileColor}`}>
                {profileName} ({currentVal})
              </div>
              <div className="text-xs font-mono text-[#719E8E]">
                Evidence-backed classification
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isAnimating}
              onClick={() => triggerGaugeAnimation(activeTarget, maxScale)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#1C4839] hover:bg-[#235846] border border-[#357A60] active:scale-95 text-white font-mono text-sm sm:text-base font-bold transition-all shadow-lg hover:shadow-emerald-900/30 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-5 h-5 text-[#8FD14F] ${isAnimating ? "animate-spin" : ""}`} />
              <span>{isAnimating ? "Recalibrating Gauge..." : "Replay Gauge Analysis"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
