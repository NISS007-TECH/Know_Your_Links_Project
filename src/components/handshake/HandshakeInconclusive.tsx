import React from "react";

export function HandshakeInconclusive() {
  return (
    <div
      className="absolute inset-0 w-full h-full object-contain p-0 pointer-events-none"
      id="animated-svg-ANIMATION_INCONCLUSIVE"
    >
      <svg
        aria-label="Visual demonstration of an inconclusive analysis with hesitant hands and an amber question badge"
        height="100%"
        role="img"
        style={{ background: "transparent", overflow: "visible" }}
        viewBox="0 0 1000 600"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter height="200%" id="amber-glow" width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur1" stdDeviation="4" />
            <feGaussianBlur result="blur2" stdDeviation="12" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter height="160%" id="amber-haze" width="160%" x="-30%" y="-30%">
            <feGaussianBlur result="blur" stdDeviation="7" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>{`
            /* Choreographed Loop for Inconclusive / Amber State (5.5s) */
            @keyframes leftHoverArm {
              0%, 100% { transform: translateX(-24px) translateY(0px); opacity: 0.85; }
              35% { transform: translateX(-10px) translateY(-3px); opacity: 0.95; }
              65% { transform: translateX(-14px) translateY(2px); opacity: 0.9; }
            }

            @keyframes rightHoverArm {
              0%, 100% { transform: translateX(24px) translateY(0px); opacity: 0.85; }
              35% { transform: translateX(10px) translateY(3px); opacity: 0.95; }
              65% { transform: translateX(14px) translateY(-2px); opacity: 0.9; }
            }

            @keyframes amberPulseRing {
              0% { r: 16px; opacity: 0.9; stroke-width: 2.5px; }
              60% { r: 90px; opacity: 0.15; stroke-width: 1px; }
              100% { r: 120px; opacity: 0; stroke-width: 0.5px; }
            }

            @keyframes amberPulseRing2 {
              0% { r: 10px; opacity: 0.8; stroke-width: 2px; }
              50% { r: 65px; opacity: 0.2; stroke-width: 1.2px; }
              100% { r: 105px; opacity: 0; stroke-width: 0.5px; }
            }

            @keyframes amberBadgeFloat {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-4px) scale(1.03); }
            }

            @keyframes dashScan {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 48; }
            }

            @keyframes probeBeam {
              0%, 100% { opacity: 0.25; stroke-width: 1px; }
              50% { opacity: 0.8; stroke-width: 2px; }
            }

            .left-inconclusive-arm {
              animation: leftHoverArm 5.5s ease-in-out infinite;
              transform-origin: 200px 300px;
            }
            .right-inconclusive-arm {
              animation: rightHoverArm 5.5s ease-in-out infinite;
              transform-origin: 800px 300px;
            }
            .amber-pulse-1 {
              animation: amberPulseRing 3.5s cubic-bezier(0.15, 0.6, 0.2, 1) infinite;
            }
            .amber-pulse-2 {
              animation: amberPulseRing2 3.5s cubic-bezier(0.15, 0.6, 0.2, 1) infinite 1.2s;
            }
            .amber-badge {
              animation: amberBadgeFloat 4s ease-in-out infinite;
              transform-origin: 500px 300px;
            }
            .scan-orbit {
              animation: dashScan 6s linear infinite;
            }
            .probe-line {
              animation: probeBeam 2.5s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .left-inconclusive-arm, .right-inconclusive-arm, .amber-badge {
                animation: none !important;
                transform: none !important;
              }
              .amber-pulse-1, .amber-pulse-2, .scan-orbit, .probe-line {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* Amber Ambient Scan Rings */}
        <g filter="url(#amber-glow)">
          <circle className="amber-pulse-1" cx="500" cy="300" fill="none" r="20" stroke="#D97706" />
          <circle className="amber-pulse-2" cx="500" cy="300" fill="none" r="25" stroke="#F59E0B" />
        </g>

        {/* Vertical dashed analysis coordinate guide */}
        <line
          stroke="#D97706"
          strokeDasharray="6 8"
          strokeOpacity="0.35"
          strokeWidth="1.2"
          x1="500"
          x2="500"
          y1="50"
          y2="550"
        />

        {/* Dotted scan brackets measuring unresolved distance between hands */}
        <g stroke="#FBBF24" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="1.2">
          <path className="scan-orbit" d="M 440 250 A 65 65 0 0 1 560 250" fill="none" strokeDasharray="4 6" />
          <path className="scan-orbit" d="M 440 350 A 65 65 0 0 0 560 350" fill="none" strokeDasharray="4 6" />
          <line className="probe-line" stroke="#F59E0B" x1="430" x2="475" y1="300" y2="300" />
          <line className="probe-line" stroke="#F59E0B" x1="525" x2="570" y1="300" y2="300" />
        </g>

        {/* Central Amber Inconclusive Reticle Badge */}
        <g className="amber-badge" filter="url(#amber-haze)">
          <polygon
            fill="#B45309"
            fillOpacity="0.22"
            points="500,245 545,270 545,330 500,355 455,330 455,270"
            stroke="#F59E0B"
            strokeWidth="2"
          />
          <polygon
            fill="none"
            points="500,256 535,276 535,324 500,344 465,324 465,276"
            stroke="#FBBF24"
            strokeDasharray="4 4"
            strokeOpacity="0.75"
            strokeWidth="1.2"
          />
          <circle cx="500" cy="300" fill="#D97706" fillOpacity="0.85" r="14" />
          {/* Question mark (?) indicating inconclusive / insufficient data */}
          <path
            d="M 496 293 C 496 290 498 288 500 288 C 502.5 288 504.5 290 504.5 292.5 C 504.5 294.5 503 296 501.5 297 L 500 298.5 L 500 301.5"
            fill="none"
            stroke="#FFFFFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
          />
          <circle cx="500" cy="306" fill="#FFFFFF" r="1.3" />
        </g>

        {/* LEFT HAND (Poised in cautious proximity) */}
        <g className="left-inconclusive-arm">
          <g filter="url(#amber-haze)" opacity="0.5">
            <path
              d="M 60 390 L 170 370 C 185 340, 195 300, 185 265 L 75 280"
              fill="none"
              stroke="#D97706"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 205 305 C 240 300, 280 295, 315 282 C 338 272, 360 242, 348 215 C 338 190, 310 200, 290 220"
              fill="none"
              stroke="#D97706"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 350 312 C 384 304, 428 296, 455 294"
              fill="none"
              stroke="#F59E0B"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </g>
          <g strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 60 390 L 170 370 C 185 340, 195 300, 185 265 L 75 280"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.6"
            />
            <path
              d="M 170 370 C 195 375, 215 340, 205 290 C 200 260, 185 260, 180 263"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2"
            />
            <path
              d="M 205 305 C 240 300, 280 295, 315 282 C 338 272, 360 242, 348 215 C 338 190, 310 200, 290 220"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.6"
            />
            <path
              d="M 315 282 C 350 276, 390 262, 416 252 C 430 246, 440 256, 426 268 C 400 290, 365 306, 335 316"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="2.6"
            />
            <path
              d="M 350 312 C 384 304, 420 298, 455 295 C 461 294, 462 301, 456 306 C 424 324, 380 338, 340 342"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
            />
            <path
              d="M 340 342 C 374 336, 416 330, 436 328 C 444 327, 444 335, 436 341 C 404 360, 366 368, 326 370"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2.5"
            />
            <path
              d="M 326 370 C 356 370, 392 368, 410 368 C 418 368, 418 376, 408 380 C 378 394, 344 398, 304 396"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
            />
            <circle cx="455" cy="295" fill="#F59E0B" filter="url(#amber-glow)" r="4" />
            <circle cx="436" cy="328" fill="#FBBF24" r="3" />
          </g>
        </g>

        {/* RIGHT HAND (Poised in cautious proximity) */}
        <g className="right-inconclusive-arm">
          <g filter="url(#amber-haze)" opacity="0.5">
            <path
              d="M 940 215 L 830 235 C 815 265, 805 305, 815 340 L 925 325"
              fill="none"
              stroke="#D97706"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 795 300 C 760 305, 720 310, 685 322 C 662 332, 640 362, 652 390 C 662 415, 690 405, 710 385"
              fill="none"
              stroke="#D97706"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 652 292 C 615 300, 560 302, 545 295"
              fill="none"
              stroke="#F59E0B"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </g>
          <g strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 940 215 L 830 235 C 815 265, 805 305, 815 340 L 925 325"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.6"
            />
            <path
              d="M 830 235 C 805 230, 785 265, 795 315 C 800 345, 815 345, 820 342"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2"
            />
            <path
              d="M 795 300 C 760 305, 720 310, 685 322 C 662 332, 640 362, 652 390 C 662 415, 690 405, 710 385"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.6"
            />
            <path
              d="M 685 322 C 650 328, 608 342, 580 352 C 564 358, 554 348, 570 334 C 598 310, 640 296, 672 286"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="2.6"
            />
            <path
              d="M 652 292 C 615 300, 568 302, 545 295 C 538 293, 538 285, 547 280 C 576 262, 616 250, 648 248"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
            />
            <path
              d="M 648 248 C 610 253, 568 258, 552 260 C 544 261, 543 252, 551 247 C 584 228, 620 220, 660 218"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="2.5"
            />
            <path
              d="M 660 218 C 628 218, 592 220, 576 220 C 567 220, 567 211, 578 207 C 606 192, 638 188, 678 193"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
            />
            <circle cx="545" cy="295" fill="#F59E0B" filter="url(#amber-glow)" r="4" />
            <circle cx="552" cy="260" fill="#FBBF24" r="3" />
          </g>
        </g>

        {/* Ambient Amber Particles */}
        <g filter="url(#amber-glow)">
          <circle cx="488" cy="225" fill="#FDE68A" opacity="0.8" r="2" />
          <circle cx="512" cy="245" fill="#F59E0B" opacity="0.7" r="2.5" />
          <circle cx="475" cy="365" fill="#FBBF24" opacity="0.6" r="2" />
          <circle cx="525" cy="380" fill="#D97706" opacity="0.75" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
