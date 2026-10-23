import React from "react";

export function HandshakeThreat() {
  return (
    <div
      className="absolute inset-0 w-full h-full object-contain p-0 pointer-events-none"
      id="animated-svg-ANIMATION_THREAT"
    >
      <svg
        aria-label="Visual demonstration of a verified malicious link interrupting trust handshake with jagged red fracture"
        height="100%"
        role="img"
        style={{ background: "transparent", overflow: "visible" }}
        viewBox="0 0 1000 600"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter height="200%" id="threat-red-flash" width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur1" stdDeviation="5" />
            <feGaussianBlur result="blur2" stdDeviation="16" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter height="160%" id="threat-haze" width="160%" x="-30%" y="-30%">
            <feGaussianBlur result="blur" stdDeviation="8" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="threatHandGrad" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#C62828" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF6B6B" stopOpacity="1" />
            <stop offset="100%" stopColor="#C62828" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="warningScanBeam" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#C62828" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF3B30" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C62828" stopOpacity="0" />
          </linearGradient>

          <style>{`
            /* Left Reaching Hand Animation: Approaches, jolts back upon fracture at 1.2s */
            @keyframes leftThreatHand {
              0% { transform: translateX(-35px) scale(0.96); opacity: 0.8; }
              20% { transform: translateX(0px) scale(1); opacity: 1; }
              22% { transform: translateX(-28px) translateY(4px) rotate(-1.5deg); opacity: 1; }
              25% { transform: translateX(-22px) translateY(-2px) rotate(-0.5deg); }
              35% { transform: translateX(-25px) translateY(1px); }
              55% { transform: translateX(-26px) translateY(-1px) rotate(-0.8deg); }
              80% { transform: translateX(-25px) translateY(0px); opacity: 1; }
              94% { transform: translateX(-35px) scale(0.96); opacity: 0.8; }
              100% { transform: translateX(-35px) scale(0.96); opacity: 0.8; }
            }

            /* Right Reaching Hand Animation: Approaches, jolts back upon fracture at 1.2s */
            @keyframes rightThreatHand {
              0% { transform: translateX(35px) scale(0.96); opacity: 0.8; }
              20% { transform: translateX(0px) scale(1); opacity: 1; }
              22% { transform: translateX(28px) translateY(-4px) rotate(1.5deg); opacity: 1; }
              25% { transform: translateX(22px) translateY(2px) rotate(0.5deg); }
              35% { transform: translateX(25px) translateY(-1px); }
              55% { transform: translateX(26px) translateY(1px) rotate(0.8deg); }
              80% { transform: translateX(25px) translateY(0px); opacity: 1; }
              94% { transform: translateX(35px) scale(0.96); opacity: 0.8; }
              100% { transform: translateX(35px) scale(0.96); opacity: 0.8; }
            }

            /* Sharp Jagged Red Lightning / Fracture Interruption */
            @keyframes fractureFlash {
              0%, 19% { opacity: 0; stroke-dashoffset: 400; stroke-width: 0px; }
              21% { opacity: 1; stroke-dashoffset: 0; stroke-width: 4px; filter: drop-shadow(0 0 16px #FF3B30); }
              24% { opacity: 0.7; stroke-width: 2.5px; }
              26% { opacity: 1; stroke-width: 3.5px; }
              30% { opacity: 0.9; stroke-width: 2.8px; }
              45% { opacity: 0.85; stroke-width: 2px; }
              65% { opacity: 0.7; stroke-width: 1.5px; }
              82% { opacity: 0.4; stroke-width: 1px; }
              90%, 100% { opacity: 0; }
            }

            /* Warning barrier pulses radiating from fracture center */
            @keyframes redWarningPulse1 {
              0%, 20% { r: 10px; opacity: 0; stroke-width: 4px; }
              22% { opacity: 1; r: 30px; stroke-width: 3.5px; }
              40% { r: 130px; opacity: 0; stroke-width: 0.5px; }
              100% { opacity: 0; }
            }

            @keyframes redWarningPulse2 {
              0%, 35% { r: 15px; opacity: 0; stroke-width: 3px; }
              38% { opacity: 0.85; r: 35px; stroke-width: 2.5px; }
              60% { r: 145px; opacity: 0; stroke-width: 0.5px; }
              100% { opacity: 0; }
            }

            /* Central Threat Hex Shield */
            @keyframes threatShieldVibe {
              0%, 18% { opacity: 0; transform: scale(0.7); }
              22% { opacity: 1; transform: scale(1.1); }
              26% { transform: scale(0.96); }
              50% { transform: scale(1.02); opacity: 0.85; }
              80% { transform: scale(1); opacity: 0.75; }
              90%, 100% { opacity: 0; transform: scale(0.8); }
            }

            .left-threat-arm {
              animation: leftThreatHand 5.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
              transform-origin: 200px 300px;
            }
            .right-threat-arm {
              animation: rightThreatHand 5.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
              transform-origin: 800px 300px;
            }
            .fracture-lightning {
              stroke-dasharray: 400;
              animation: fractureFlash 5.5s cubic-bezier(0.1, 0.9, 0.2, 1) infinite;
            }
            .threat-pulse-1 {
              animation: redWarningPulse1 5.5s cubic-bezier(0.15, 0.6, 0.2, 1) infinite;
            }
            .threat-pulse-2 {
              animation: redWarningPulse2 5.5s cubic-bezier(0.15, 0.6, 0.2, 1) infinite;
            }
            .threat-shield-group {
              animation: threatShieldVibe 5.5s ease-in-out infinite;
              transform-origin: 500px 300px;
            }

            @media (prefers-reduced-motion: reduce) {
              .left-threat-arm, .right-threat-arm, .threat-shield-group {
                animation: none !important;
                transform: none !important;
              }
              .threat-pulse-1, .threat-pulse-2 {
                display: none !important;
              }
              .fracture-lightning {
                opacity: 0.9 !important;
                stroke-dashoffset: 0 !important;
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* Threat Warning Pulses */}
        <g filter="url(#threat-red-flash)">
          <circle className="threat-pulse-1" cx="500" cy="300" fill="none" r="20" stroke="#FF3B30" />
          <circle className="threat-pulse-2" cx="500" cy="300" fill="none" r="25" stroke="#C62828" />
        </g>

        {/* Center Vertical Guide Line */}
        <line
          stroke="#C62828"
          strokeDasharray="6 8"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          x1="500"
          x2="500"
          y1="60"
          y2="540"
        />

        {/* Central Threat Hex Shield */}
        <g className="threat-shield-group" filter="url(#threat-haze)">
          <polygon
            fill="#C62828"
            fillOpacity="0.18"
            points="500,240 545,265 545,335 500,360 455,335 455,265"
            stroke="#FF3B30"
            strokeWidth="2"
          />
          <polygon
            fill="none"
            points="500,252 534,272 534,328 500,348 466,328 466,272"
            stroke="#FF6B6B"
            strokeDasharray="4 4"
            strokeOpacity="0.6"
            strokeWidth="1.2"
          />
          <circle cx="500" cy="300" fill="#C62828" fillOpacity="0.8" r="14" />
          <path d="M 500 293 L 500 301" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2.5" />
          <circle cx="500" cy="305" fill="#FFFFFF" r="1.3" />
        </g>

        {/* Fracture Lightning Path */}
        <g filter="url(#threat-red-flash)">
          <path
            className="fracture-lightning"
            d="M 500 120 L 492 190 L 515 240 L 485 285 L 518 315 L 488 360 L 510 420 L 496 480"
            fill="none"
            stroke="#FF3B30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="fracture-lightning"
            d="M 515 240 L 540 225 L 555 242"
            fill="none"
            stroke="#FF6B6B"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="fracture-lightning"
            d="M 485 285 L 452 275 L 438 290"
            fill="none"
            stroke="#FF6B6B"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="fracture-lightning"
            d="M 518 315 L 552 328 L 565 315"
            fill="none"
            stroke="#FF6B6B"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="fracture-lightning"
            d="M 488 360 L 460 375 L 442 362"
            fill="none"
            stroke="#FF6B6B"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* LEFT THREAT ARM (Jolts back on recoil) */}
        <g className="left-threat-arm">
          <g filter="url(#threat-haze)" opacity="0.6">
            <path
              d="M 60 390 L 170 370 C 185 340, 195 300, 185 265 L 75 280"
              fill="none"
              stroke="#C62828"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 205 305 C 240 300, 280 295, 315 282 C 338 272, 360 242, 348 215 C 338 190, 310 200, 290 220"
              fill="none"
              stroke="#C62828"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 350 312 C 384 304, 428 296, 465 294"
              fill="none"
              stroke="#FF3B30"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </g>
          <g strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 60 390 L 170 370 C 185 340, 195 300, 185 265 L 75 280"
              fill="none"
              stroke="#C62828"
              strokeWidth="2.6"
            />
            <path
              d="M 170 370 C 195 375, 215 340, 205 290 C 200 260, 185 260, 180 263"
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="2"
            />
            <path
              d="M 205 305 C 240 300, 280 295, 315 282 C 338 272, 360 242, 348 215 C 338 190, 310 200, 290 220"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="2.6"
            />
            <path
              d="M 315 282 C 350 276, 390 262, 416 252 C 430 246, 440 256, 426 268 C 400 290, 365 306, 335 316"
              fill="none"
              stroke="#FF8585"
              strokeWidth="2.6"
            />
            <path
              d="M 350 312 C 384 304, 428 296, 465 294 C 471 292, 473 300, 467 306 C 430 326, 382 340, 340 342"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="3"
            />
            <path
              d="M 340 342 C 374 336, 424 330, 446 328 C 454 327, 454 336, 446 342 C 410 362, 370 370, 326 370"
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="2.5"
            />
            <path
              d="M 326 370 C 356 370, 398 368, 416 368 C 424 368, 424 377, 412 381 C 380 396, 344 400, 304 396"
              fill="none"
              stroke="#C62828"
              strokeWidth="2.5"
            />
            <circle cx="465" cy="294" fill="#FF3B30" filter="url(#threat-red-flash)" r="4.5" />
            <circle cx="446" cy="328" fill="#FF6B6B" r="3" />
          </g>
        </g>

        {/* RIGHT THREAT ARM (Jolts back on recoil) */}
        <g className="right-threat-arm">
          <g filter="url(#threat-haze)" opacity="0.6">
            <path
              d="M 940 215 L 830 235 C 815 265, 805 305, 815 340 L 925 325"
              fill="none"
              stroke="#C62828"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 795 300 C 760 305, 720 310, 685 322 C 662 332, 640 362, 652 390 C 662 415, 690 405, 710 385"
              fill="none"
              stroke="#C62828"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M 652 292 C 615 300, 550 306, 528 295"
              fill="none"
              stroke="#FF3B30"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </g>
          <g strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 940 215 L 830 235 C 815 265, 805 305, 815 340 L 925 325"
              fill="none"
              stroke="#C62828"
              strokeWidth="2.6"
            />
            <path
              d="M 830 235 C 805 230, 785 265, 795 315 C 800 345, 815 345, 820 342"
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="2"
            />
            <path
              d="M 795 300 C 760 305, 720 310, 685 322 C 662 332, 640 362, 652 390 C 662 415, 690 405, 710 385"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="2.6"
            />
            <path
              d="M 685 322 C 650 328, 608 342, 580 352 C 564 358, 554 348, 570 334 C 598 310, 640 296, 672 286"
              fill="none"
              stroke="#FF8585"
              strokeWidth="2.6"
            />
            <path
              d="M 652 292 C 615 300, 550 306, 528 295 C 520 292, 520 283, 530 278 C 562 260, 608 250, 640 248"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="3"
            />
            <path
              d="M 640 248 C 600 253, 554 258, 536 260 C 528 261, 527 252, 535 247 C 570 228, 610 219, 654 218"
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="2.5"
            />
            <path
              d="M 654 218 C 620 218, 580 220, 562 220 C 553 220, 553 211, 564 207 C 596 192, 630 188, 674 193"
              fill="none"
              stroke="#C62828"
              strokeWidth="2.5"
            />
            <circle cx="528" cy="295" fill="#FF3B30" filter="url(#threat-red-flash)" r="4.5" />
            <circle cx="536" cy="260" fill="#FF6B6B" r="3" />
          </g>
        </g>

        {/* Ambient Threat Sparks */}
        <g filter="url(#threat-red-flash)">
          <circle cx="495" cy="220" fill="#FF8585" r="2" />
          <circle cx="508" cy="270" fill="#FF3B30" r="2.5" />
          <circle cx="488" cy="330" fill="#FF6B6B" r="2" />
          <circle cx="512" cy="390" fill="#FF3B30" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
