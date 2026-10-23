import React from "react";

export function HandshakeIdle() {
  return (
    <div
      className="absolute inset-0 w-full h-full object-contain p-0 pointer-events-none"
      id="animated-svg-ANIMATION_21"
    >
      <svg
        height="100%"
        style={{ background: "transparent", overflow: "visible" }}
        viewBox="0 0 1000 600"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Two hands hovering apart in idle handshake posture"
        role="img"
      >
        <defs>
          {/* Glow and shadow filters */}
          <filter height="140%" id="glow-mint" width="140%" x="-20%" y="-20%">
            <feGaussianBlur result="blur" stdDeviation="6" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter height="160%" id="glow-lime" width="160%" x="-30%" y="-30%">
            <feGaussianBlur result="blur" stdDeviation="8" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGradLeft" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#91C7B7" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#D4F6EB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8FD14F" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lineGradRight" x1="100%" x2="0%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#91C7B7" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#D4F6EB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8FD14F" stopOpacity="1" />
          </linearGradient>
          <style>{`
            @keyframes floatLeft {
              0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
              50% { transform: translate(14px, -6px) rotate(0.8deg); }
            }
            @keyframes floatRight {
              0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
              50% { transform: translate(-14px, 6px) rotate(-0.8deg); }
            }
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.35; transform: scale(0.95); }
              50% { opacity: 0.85; transform: scale(1.08); }
            }
            @keyframes dashFlow {
              to { stroke-dashoffset: -80; }
            }
            @keyframes sparkDrift {
              0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
              50% { opacity: 1; transform: translate(12px, -8px) scale(1.2); }
              100% { transform: translate(25px, -15px) scale(0.4); opacity: 0; }
            }
            .left-hand-group {
              animation: floatLeft 6s ease-in-out infinite;
              transform-origin: 200px 320px;
            }
            .right-hand-group {
              animation: floatRight 6s ease-in-out infinite;
              transform-origin: 800px 280px;
            }
            .ambient-glow {
              animation: pulseGlow 4s ease-in-out infinite;
              transform-origin: 500px 300px;
            }
            .energy-arc {
              stroke-dasharray: 6 10;
              animation: dashFlow 3s linear infinite;
            }
            .spark-1 { animation: sparkDrift 3.5s ease-in-out infinite; }
            .spark-2 { animation: sparkDrift 4.2s ease-in-out infinite 1.2s; }
            .spark-3 { animation: sparkDrift 3.8s ease-in-out infinite 2.1s; }

            @media (prefers-reduced-motion: reduce) {
              .left-hand-group, .right-hand-group, .ambient-glow, .energy-arc, .spark-1, .spark-2, .spark-3 {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* Ambient background energy field around handshake gap */}
        <g className="ambient-glow" filter="url(#glow-mint)">
          <circle cx="500" cy="305" fill="#8FD14F" fillOpacity="0.04" r="110" />
          <circle cx="500" cy="305" fill="#D4F6EB" fillOpacity="0.07" r="60" />
          <ellipse
            cx="500"
            cy="305"
            rx="140"
            ry="80"
            stroke="#8FD14F"
            strokeDasharray="4 8"
            strokeOpacity="0.18"
            strokeWidth="1.5"
          />
        </g>

        {/* Dynamic connection beam bridging index/thumb touch points */}
        <g>
          <path
            className="energy-arc"
            d="M 432 300 C 460 292, 485 306, 520 294"
            fill="none"
            filter="url(#glow-lime)"
            stroke="#8FD14F"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <circle cx="432" cy="300" fill="#8FD14F" filter="url(#glow-lime)" r="3.5" />
          <circle cx="520" cy="294" fill="#D4F6EB" filter="url(#glow-mint)" r="3.5" />
        </g>

        {/* LEFT HAND */}
        <g className="left-hand-group">
          {/* Outer Cuff / Sleeve Contour */}
          <path
            d="M 40 400 L 160 380 C 175 350, 185 305, 175 270 L 60 285"
            fill="none"
            stroke="url(#lineGradLeft)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          {/* Cuff accent band */}
          <path
            d="M 160 380 C 185 385, 205 350, 195 300 C 190 270, 175 268, 170 270"
            fill="none"
            stroke="#91C7B7"
            strokeOpacity="0.75"
            strokeWidth="2"
          />
          {/* Wrist & Palm line flow */}
          <path
            d="M 195 315 C 230 310, 275 305, 310 290 C 335 280, 360 250, 350 220 C 342 195, 310 205, 290 225 C 275 240, 255 255, 220 265"
            fill="none"
            stroke="url(#lineGradLeft)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          {/* Thumb gesture reaching outward */}
          <path
            d="M 310 290 C 345 285, 385 270, 410 260 C 425 254, 435 264, 420 278 C 395 300, 360 315, 330 325"
            fill="none"
            filter="url(#glow-mint)"
            stroke="url(#lineGradLeft)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          {/* Index Finger */}
          <path
            d="M 345 320 C 380 312, 415 305, 432 300 C 438 298, 442 305, 435 312 C 405 330, 370 345, 335 350"
            fill="none"
            stroke="#D4F6EB"
            strokeLinecap="round"
            strokeWidth="3"
          />
          {/* Middle Finger */}
          <path
            d="M 335 350 C 370 345, 408 340, 425 338 C 432 337, 433 345, 426 350 C 395 368, 360 378, 320 380"
            fill="none"
            stroke="url(#lineGradLeft)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          {/* Ring Finger & Pinky curls */}
          <path
            d="M 320 380 C 350 380, 385 378, 400 378 C 408 378, 408 386, 398 390 C 370 405, 340 410, 300 405"
            fill="none"
            stroke="url(#lineGradLeft)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M 300 405 C 330 408, 360 410, 375 412 C 382 413, 382 420, 374 423 C 345 435, 310 435, 270 420 C 235 405, 205 380, 185 365"
            fill="none"
            stroke="url(#lineGradLeft)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          {/* Palm interior contour line */}
          <path
            d="M 270 340 C 290 355, 305 370, 300 390"
            fill="none"
            stroke="#91C7B7"
            strokeLinecap="round"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
        </g>

        {/* RIGHT HAND */}
        <g className="right-hand-group">
          {/* Sleeve / Arm Entrance */}
          <path
            d="M 960 210 L 840 230 C 825 260, 815 305, 825 340 L 940 325"
            fill="none"
            stroke="url(#lineGradRight)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          {/* Cuff band accent */}
          <path
            d="M 840 230 C 815 225, 795 260, 805 310 C 810 340, 825 342, 830 340"
            fill="none"
            stroke="#91C7B7"
            strokeOpacity="0.75"
            strokeWidth="2"
          />
          {/* Wrist & Upper Palm line */}
          <path
            d="M 805 295 C 770 300, 725 305, 690 320 C 665 330, 640 360, 650 390 C 658 415, 690 405, 710 385 C 725 370, 745 355, 780 345"
            fill="none"
            stroke="url(#lineGradRight)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          {/* Thumb reaching across */}
          <path
            d="M 690 320 C 655 325, 615 340, 590 350 C 575 356, 565 346, 580 332 C 605 310, 640 295, 670 285"
            fill="none"
            filter="url(#glow-mint)"
            stroke="url(#lineGradRight)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          {/* Index Finger */}
          <path
            d="M 655 290 C 620 298, 555 305, 520 294 C 514 292, 513 285, 520 280 C 550 262, 600 252, 635 248"
            fill="none"
            stroke="#D4F6EB"
            strokeLinecap="round"
            strokeWidth="3"
          />
          {/* Middle Finger */}
          <path
            d="M 635 248 C 600 253, 560 258, 545 260 C 538 261, 537 253, 544 248 C 575 230, 610 220, 650 218"
            fill="none"
            stroke="url(#lineGradRight)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          {/* Ring and Pinky finger contours */}
          <path
            d="M 650 218 C 620 218, 585 220, 570 220 C 562 220, 562 212, 572 208 C 600 193, 630 188, 670 193"
            fill="none"
            stroke="url(#lineGradRight)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M 670 193 C 640 190, 610 188, 595 186 C 588 185, 588 178, 596 175 C 625 163, 660 163, 700 178 C 735 193, 765 218, 785 233"
            fill="none"
            stroke="url(#lineGradRight)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          {/* Palm interior contour */}
          <path
            d="M 700 270 C 680 255, 665 240, 670 220"
            fill="none"
            stroke="#91C7B7"
            strokeLinecap="round"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
        </g>

        {/* Floating ethereal inspection data sparks */}
        <g>
          <circle className="spark-1" cx="480" cy="275" fill="#8FD14F" r="2" />
          <circle className="spark-2" cx="515" cy="330" fill="#D4F6EB" r="2.5" />
          <circle className="spark-3" cx="465" cy="320" fill="#91C7B7" r="1.5" />
        </g>
      </svg>
    </div>
  );
}
