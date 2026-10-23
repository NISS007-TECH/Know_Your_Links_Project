import React from "react";

export function HandshakeScanning() {
  return (
    <div
      className="absolute inset-0 w-full h-full object-contain p-0 pointer-events-none"
      id="animated-svg-ANIMATION_24"
    >
      <svg
        height="100%"
        style={{ background: "transparent", overflow: "visible" }}
        viewBox="0 0 1000 600"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Two hands actively approaching with radar pulses and data telemetry beams"
        role="img"
      >
        <defs>
          {/* High-energy glow filters for scanning pulses */}
          <filter height="200%" id="scan-glow-lime" width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur1" stdDeviation="4" />
            <feGaussianBlur result="blur2" stdDeviation="12" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter height="200%" id="scan-glow-mint" width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur1" stdDeviation="5" />
            <feGaussianBlur result="blur2" stdDeviation="16" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="scanGradLeft" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#91C7B7" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#D4F6EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#8FD14F" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="scanGradRight" x1="100%" x2="0%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#91C7B7" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#D4F6EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#8FD14F" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="beamGrad" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#8FD14F" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#D4F6EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#8FD14F" stopOpacity="0.9" />
          </linearGradient>
          <style>{`
            @keyframes scanHandsApproachLeft {
              0%, 100% { transform: translate(52px, 0px) rotate(0.4deg); }
              50% { transform: translate(66px, -4px) rotate(1.2deg); }
            }
            @keyframes scanHandsApproachRight {
              0%, 100% { transform: translate(-52px, 0px) rotate(-0.4deg); }
              50% { transform: translate(-66px, 4px) rotate(-1.2deg); }
            }
            @keyframes radarPulse {
              0% { r: 12px; opacity: 0.9; stroke-width: 3.5px; }
              50% { opacity: 0.6; }
              100% { r: 110px; opacity: 0; stroke-width: 0.8px; }
            }
            @keyframes packetFlowForward {
              0% { stroke-dashoffset: 140; opacity: 0.2; }
              30% { opacity: 1; }
              80% { opacity: 1; }
              100% { stroke-dashoffset: -140; opacity: 0.2; }
            }
            @keyframes packetFlowReverse {
              0% { stroke-dashoffset: -140; opacity: 0.2; }
              30% { opacity: 1; }
              80% { opacity: 1; }
              100% { stroke-dashoffset: 140; opacity: 0.2; }
            }
            @keyframes nexusThrobbing {
              0%, 100% { transform: scale(0.92); opacity: 0.65; }
              50% { transform: scale(1.18); opacity: 0.98; }
            }
            @keyframes particleZip1 {
              0% { transform: translate(-35px, 6px) scale(0.6); opacity: 0.1; }
              40% { opacity: 1; }
              100% { transform: translate(35px, -6px) scale(1.1); opacity: 0; }
            }
            @keyframes particleZip2 {
              0% { transform: translate(32px, 12px) scale(0.5); opacity: 0.1; }
              50% { opacity: 1; }
              100% { transform: translate(-32px, -10px) scale(1.2); opacity: 0; }
            }
            @keyframes particleZip3 {
              0% { transform: translate(-22px, -15px) scale(0.7); opacity: 0; }
              50% { opacity: 0.9; }
              100% { transform: translate(25px, 15px) scale(0.5); opacity: 0; }
            }

            .left-hand-scanning {
              animation: scanHandsApproachLeft 3.2s ease-in-out infinite;
              transform-origin: 200px 320px;
            }
            .right-hand-scanning {
              animation: scanHandsApproachRight 3.2s ease-in-out infinite;
              transform-origin: 800px 280px;
            }
            .nexus-core {
              animation: nexusThrobbing 1.8s ease-in-out infinite;
              transform-origin: 500px 300px;
            }
            .pulse-wave-1 {
              animation: radarPulse 2.2s cubic-bezier(0.1, 0.4, 0.2, 1) infinite;
            }
            .pulse-wave-2 {
              animation: radarPulse 2.2s cubic-bezier(0.1, 0.4, 0.2, 1) infinite 0.7s;
            }
            .pulse-wave-3 {
              animation: radarPulse 2.2s cubic-bezier(0.1, 0.4, 0.2, 1) infinite 1.4s;
            }
            .beam-active {
              stroke-dasharray: 10 14;
              animation: packetFlowForward 1.4s linear infinite;
            }
            .beam-active-reverse {
              stroke-dasharray: 6 12;
              animation: packetFlowReverse 1.2s linear infinite;
            }
            .scan-particle-1 { animation: particleZip1 1.6s ease-in-out infinite; }
            .scan-particle-2 { animation: particleZip2 1.9s ease-in-out infinite 0.4s; }
            .scan-particle-3 { animation: particleZip3 1.5s ease-in-out infinite 0.9s; }

            @media (prefers-reduced-motion: reduce) {
              .left-hand-scanning, .right-hand-scanning, .nexus-core, .pulse-wave-1, .pulse-wave-2, .pulse-wave-3,
              .beam-active, .beam-active-reverse, .scan-particle-1, .scan-particle-2, .scan-particle-3 {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* ACTIVE SCANNING RADAR WAVES */}
        <g filter="url(#scan-glow-lime)">
          <circle className="pulse-wave-1" cx="500" cy="302" fill="none" stroke="#8FD14F" strokeOpacity="0.8" />
          <circle className="pulse-wave-2" cx="500" cy="302" fill="none" stroke="#D4F6EB" strokeOpacity="0.7" />
          <circle className="pulse-wave-3" cx="500" cy="302" fill="none" stroke="#8FD14F" strokeOpacity="0.5" />
        </g>

        {/* Central inspection energy nexus */}
        <g className="nexus-core" filter="url(#scan-glow-mint)">
          <circle cx="500" cy="302" fill="#8FD14F" fillOpacity="0.14" r="54" />
          <circle cx="500" cy="302" fill="#D4F6EB" fillOpacity="0.22" r="28" />
          <circle cx="500" cy="302" fill="#FFFFFF" fillOpacity="0.75" r="5" />
          <ellipse
            cx="500"
            cy="302"
            rx="72"
            ry="40"
            stroke="#8FD14F"
            strokeDasharray="6 8"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
        </g>

        {/* FAST ACTIVE DATA BEAMS BRIDGING REACHING FINGERS */}
        <g>
          <path
            className="beam-active"
            d="M 458 300 C 476 294, 492 308, 524 296"
            fill="none"
            filter="url(#scan-glow-lime)"
            stroke="url(#beamGrad)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            className="beam-active-reverse"
            d="M 466 318 C 484 326, 502 312, 532 308"
            fill="none"
            filter="url(#scan-glow-mint)"
            stroke="#D4F6EB"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            className="beam-active"
            d="M 450 274 C 478 268, 510 278, 536 288"
            fill="none"
            filter="url(#scan-glow-lime)"
            stroke="#8FD14F"
            strokeLinecap="round"
            strokeOpacity="0.8"
            strokeWidth="1.8"
          />
          {/* Multi-provider telemetry sparks passing through connection gap */}
          <g transform="translate(500, 302)">
            <circle className="scan-particle-1" cx="0" cy="0" fill="#8FD14F" filter="url(#scan-glow-lime)" r="3.5" />
            <circle className="scan-particle-2" cx="0" cy="0" fill="#FFFFFF" filter="url(#scan-glow-mint)" r="3" />
            <circle className="scan-particle-3" cx="0" cy="0" fill="#D4F6EB" filter="url(#scan-glow-mint)" r="2.5" />
          </g>
        </g>

        {/* LEFT HAND (Moved closer into center nexus) */}
        <g className="left-hand-scanning">
          <path
            d="M 40 400 L 160 380 C 175 350, 185 305, 175 270 L 60 285"
            fill="none"
            stroke="url(#scanGradLeft)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          <path
            d="M 160 380 C 185 385, 205 350, 195 300 C 190 270, 175 268, 170 270"
            fill="none"
            stroke="#91C7B7"
            strokeOpacity="0.85"
            strokeWidth="2"
          />
          <path
            d="M 195 315 C 230 310, 275 305, 310 290 C 335 280, 360 250, 350 220 C 342 195, 310 205, 290 225 C 275 240, 255 255, 220 265"
            fill="none"
            stroke="url(#scanGradLeft)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M 310 290 C 345 285, 385 270, 410 260 C 425 254, 435 264, 420 278 C 395 300, 360 315, 330 325"
            fill="none"
            filter="url(#scan-glow-mint)"
            stroke="url(#scanGradLeft)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M 345 320 C 380 312, 424 305, 458 300 C 464 298, 467 305, 460 312 C 422 332, 375 348, 335 350"
            fill="none"
            filter="url(#scan-glow-lime)"
            stroke="#D4F6EB"
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          <path
            d="M 335 350 C 370 345, 420 340, 442 338 C 450 337, 451 346, 442 352 C 406 372, 365 380, 320 380"
            fill="none"
            stroke="url(#scanGradLeft)"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M 320 380 C 350 380, 395 378, 414 378 C 422 378, 422 387, 410 391 C 378 406, 340 410, 300 405"
            fill="none"
            stroke="url(#scanGradLeft)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M 300 405 C 330 408, 365 410, 384 412 C 392 413, 392 421, 382 424 C 348 436, 310 435, 270 420 C 235 405, 205 380, 185 365"
            fill="none"
            stroke="url(#scanGradLeft)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M 270 340 C 290 355, 305 370, 300 390"
            fill="none"
            stroke="#91C7B7"
            strokeLinecap="round"
            strokeOpacity="0.7"
            strokeWidth="1.5"
          />
        </g>

        {/* RIGHT HAND (Moved closer into center nexus) */}
        <g className="right-hand-scanning">
          <path
            d="M 960 210 L 840 230 C 825 260, 815 305, 825 340 L 940 325"
            fill="none"
            stroke="url(#scanGradRight)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          <path
            d="M 840 230 C 815 225, 795 260, 805 310 C 810 340, 825 342, 830 340"
            fill="none"
            stroke="#91C7B7"
            strokeOpacity="0.85"
            strokeWidth="2"
          />
          <path
            d="M 805 295 C 770 300, 725 305, 690 320 C 665 330, 640 360, 650 390 C 658 415, 690 405, 710 385 C 725 370, 745 355, 780 345"
            fill="none"
            stroke="url(#scanGradRight)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M 690 320 C 655 325, 608 340, 578 350 C 562 356, 552 346, 568 332 C 596 308, 638 294, 670 285"
            fill="none"
            filter="url(#scan-glow-mint)"
            stroke="url(#scanGradRight)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M 655 290 C 615 298, 546 306, 524 296 C 516 293, 516 284, 525 279 C 558 261, 604 251, 635 248"
            fill="none"
            filter="url(#scan-glow-lime)"
            stroke="#D4F6EB"
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          <path
            d="M 635 248 C 595 253, 550 258, 532 260 C 524 261, 523 252, 531 247 C 566 228, 606 219, 650 218"
            fill="none"
            stroke="url(#scanGradRight)"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M 650 218 C 615 218, 575 220, 558 220 C 549 220, 549 211, 560 207 C 592 192, 626 188, 670 193"
            fill="none"
            stroke="url(#scanGradRight)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M 670 193 C 636 190, 602 188, 584 186 C 576 185, 576 177, 585 174 C 618 162, 656 162, 700 178 C 735 193, 765 218, 785 233"
            fill="none"
            stroke="url(#scanGradRight)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M 700 270 C 680 255, 665 240, 670 220"
            fill="none"
            stroke="#91C7B7"
            strokeLinecap="round"
            strokeOpacity="0.7"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}
