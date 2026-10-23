import React from "react";

export function HandshakeClean() {
  return (
    <div
      className="absolute inset-0 w-full h-full object-contain p-0 pointer-events-none"
      id="animated-svg-ANIMATION_34"
    >
      <svg
        height="100%"
        style={{ background: "transparent", overflow: "visible" }}
        viewBox="0 0 1000 600"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Two hands interlocking into verified green handshake clasp"
        role="img"
      >
        <defs>
          {/* Verified Glow Filters */}
          <filter height="200%" id="intense-green-flash" width="200%" x="-50%" y="-50%">
            <feGaussianBlur result="blur1" stdDeviation="6" />
            <feGaussianBlur result="blur2" stdDeviation="18" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter height="180%" id="clasp-glow-soft" width="180%" x="-40%" y="-40%">
            <feGaussianBlur result="blur" stdDeviation="7" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="vividGreenGrad" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#8FD14F" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#16834A" stopOpacity="1" />
            <stop offset="100%" stopColor="#8FD14F" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="handGradClasp" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#91C7B7" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#D4F6EB" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8FD14F" stopOpacity="1" />
          </linearGradient>

          <style>{`
            /* Phase 1: Reaching Hands Group */
            @keyframes reachingHandsSequence {
              0% { opacity: 0; transform: scale(0.97); }
              10% { opacity: 1; transform: scale(1); }
              11% { opacity: 1; transform: scale(1.02); }
              12.5% { opacity: 1; transform: scale(1); }
              14% { opacity: 0; transform: scale(1.01); }
              100% { opacity: 0; transform: scale(1); }
            }

            /* Green verification burst wave at 1.0s */
            @keyframes verificationBurst {
              0%, 10% { r: 10px; opacity: 0; stroke-width: 4px; }
              12.5% { opacity: 1; r: 25px; stroke-width: 4px; }
              18% { r: 140px; opacity: 0; stroke-width: 0.5px; }
              100% { opacity: 0; }
            }

            /* Phase 2 & 3: Clasped Handshake Group */
            @keyframes claspedHandshakeSequence {
              0%, 11.5% { opacity: 0; transform: scale(0.96) translateY(4px); }
              13.5% { opacity: 1; transform: scale(1.02) translateY(0px); }
              16% { opacity: 1; transform: scale(1) translateY(0px); }
              55% { opacity: 1; transform: scale(1) translateY(-4px) rotate(0.4deg); }
              92% { opacity: 1; transform: scale(1) translateY(0px) rotate(0deg); }
              97% { opacity: 0; transform: scale(0.98); }
              100% { opacity: 0; }
            }

            /* Calibrated Green Verification Pulse radiating softly from the clasp */
            @keyframes claspRipple1 {
              0%, 13% { opacity: 0; r: 15px; }
              14% { opacity: 0.9; stroke-width: 3px; }
              35% { r: 110px; opacity: 0; stroke-width: 0.6px; }
              100% { opacity: 0; }
            }
            @keyframes claspRipple2 {
              0%, 25% { opacity: 0; r: 15px; }
              26% { opacity: 0.8; stroke-width: 2.5px; }
              48% { r: 130px; opacity: 0; stroke-width: 0.5px; }
              100% { opacity: 0; }
            }

            /* Nexus trust shield core pulse */
            @keyframes nexusTrustShield {
              0%, 12% { opacity: 0; transform: scale(0.8); }
              15% { opacity: 0.85; transform: scale(1.05); }
              55% { opacity: 0.6; transform: scale(0.97); }
              92% { opacity: 0.8; transform: scale(1.02); }
              97% { opacity: 0; }
              100% { opacity: 0; }
            }

            .seq-reaching-group {
              animation: reachingHandsSequence 8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
              transform-origin: 500px 300px;
            }
            .seq-burst-wave {
              animation: verificationBurst 8s ease-out infinite;
            }
            .seq-clasped-group {
              animation: claspedHandshakeSequence 8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
              transform-origin: 500px 300px;
            }
            .seq-ripple-1 {
              animation: claspRipple1 8s cubic-bezier(0.15, 0.6, 0.2, 1) infinite;
            }
            .seq-ripple-2 {
              animation: claspRipple2 8s cubic-bezier(0.15, 0.6, 0.2, 1) infinite;
            }
            .seq-trust-nexus {
              animation: nexusTrustShield 8s ease-in-out infinite;
              transform-origin: 500px 300px;
            }

            @media (prefers-reduced-motion: reduce) {
              .seq-reaching-group { display: none !important; }
              .seq-clasped-group { opacity: 1 !important; animation: none !important; }
              .seq-burst-wave, .seq-ripple-1, .seq-ripple-2, .seq-trust-nexus { animation: none !important; opacity: 0.5 !important; }
            }
          `}</style>
        </defs>

        {/* 1-SECOND VERIFICATION BURST */}
        <g filter="url(#intense-green-flash)">
          <circle className="seq-burst-wave" cx="500" cy="300" fill="none" r="15" stroke="#8FD14F" />
        </g>

        {/* STAGE 1: REACHING HANDS */}
        <g className="seq-reaching-group" filter="url(#intense-green-flash)">
          <circle cx="500" cy="300" fill="#16834A" fillOpacity="0.25" r="38" />
          <circle cx="500" cy="300" fill="#8FD14F" fillOpacity="0.35" r="22" />
          <path
            d="M 462 298 C 480 292, 495 304, 526 295"
            fill="none"
            stroke="#8FD14F"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <circle cx="462" cy="298" fill="#8FD14F" r="4" />
          <circle cx="526" cy="295" fill="#D4F6EB" r="4" />

          {/* LEFT REACHING HAND */}
          <g>
            <path
              d="M 50 395 L 165 375 C 180 345, 190 305, 180 270 L 68 285"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.6"
            />
            <path
              d="M 165 375 C 190 380, 210 345, 200 295 C 195 265, 180 265, 175 268"
              fill="none"
              stroke="#D4F6EB"
              strokeWidth="2"
            />
            <path
              d="M 200 310 C 235 305, 278 300, 312 288 C 336 278, 360 248, 348 220 C 338 195, 308 205, 288 225 C 272 240, 252 254, 218 262"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2.6"
            />
            <path
              d="M 312 288 C 348 282, 388 268, 414 258 C 428 252, 438 262, 424 275 C 398 296, 362 312, 332 322"
              fill="none"
              stroke="#D4F6EB"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <path
              d="M 348 318 C 382 310, 426 302, 462 298 C 468 296, 470 304, 464 310 C 428 330, 380 345, 338 348"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="3.2"
            />
            <path
              d="M 338 348 C 372 342, 422 336, 444 334 C 452 333, 452 342, 444 348 C 408 368, 368 376, 324 376"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2.6"
            />
            <path
              d="M 324 376 C 354 376, 396 374, 414 374 C 422 374, 422 383, 410 387 C 378 402, 342 406, 302 402"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <path
              d="M 302 402 C 332 405, 366 406, 384 408 C 392 409, 392 417, 382 420 C 348 432, 310 431, 272 416 C 238 402, 210 378, 190 362"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>

          {/* RIGHT REACHING HAND */}
          <g>
            <path
              d="M 950 215 L 835 235 C 820 265, 810 305, 820 340 L 932 325"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.6"
            />
            <path
              d="M 835 235 C 810 230, 790 265, 800 315 C 805 345, 820 345, 825 342"
              fill="none"
              stroke="#D4F6EB"
              strokeWidth="2"
            />
            <path
              d="M 800 300 C 765 305, 722 310, 688 322 C 664 332, 640 362, 652 390 C 662 415, 692 405, 712 385 C 728 370, 748 356, 782 348"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2.6"
            />
            <path
              d="M 688 322 C 652 328, 608 342, 580 352 C 564 358, 554 348, 570 334 C 598 310, 640 296, 672 286"
              fill="none"
              stroke="#D4F6EB"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <path
              d="M 654 292 C 616 300, 550 306, 526 295 C 518 292, 518 283, 528 278 C 560 260, 606 250, 638 248"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="3.2"
            />
            <path
              d="M 638 248 C 598 253, 552 258, 534 260 C 526 261, 525 252, 533 247 C 568 228, 608 219, 652 218"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2.6"
            />
            <path
              d="M 652 218 C 618 218, 578 220, 560 220 C 551 220, 551 211, 562 207 C 594 192, 628 188, 672 193"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <path
              d="M 672 193 C 638 190, 604 188, 586 186 C 578 185, 578 177, 587 174 C 620 162, 658 162, 702 178 C 736 193, 766 218, 786 233"
              fill="none"
              stroke="#8FD14F"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
        </g>

        {/* STAGE 2: CLASPED HANDSHAKE */}
        <g filter="url(#intense-green-flash)">
          <circle className="seq-ripple-1" cx="500" cy="300" fill="none" r="20" stroke="#8FD14F" />
          <circle className="seq-ripple-2" cx="500" cy="300" fill="none" r="20" stroke="#D4F6EB" />
        </g>

        {/* Central trust nexus */}
        <g className="seq-trust-nexus" filter="url(#clasp-glow-soft)">
          <circle cx="500" cy="300" fill="#16834A" fillOpacity="0.14" r="75" />
          <circle cx="500" cy="300" fill="#8FD14F" fillOpacity="0.2" r="44" />
          <circle cx="500" cy="300" fill="#FFFFFF" fillOpacity="0.9" r="9" />
          <circle
            cx="500"
            cy="300"
            fill="none"
            r="98"
            stroke="#8FD14F"
            strokeDasharray="5 7"
            strokeOpacity="0.38"
            strokeWidth="1.2"
          />
        </g>

        <g className="seq-clasped-group">
          {/* LEFT SLEEVE & CUFF */}
          <path
            d="M 50 395 L 175 375 C 190 345, 198 305, 188 270 L 70 282"
            fill="none"
            stroke="url(#handGradClasp)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          <path
            d="M 175 375 C 198 380, 218 348, 208 300 C 204 272, 188 268, 184 270"
            fill="none"
            stroke="#91C7B7"
            strokeOpacity="0.8"
            strokeWidth="2"
          />
          {/* RIGHT SLEEVE & CUFF */}
          <path
            d="M 950 215 L 825 235 C 810 265, 802 305, 812 340 L 930 328"
            fill="none"
            stroke="url(#handGradClasp)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
          <path
            d="M 825 235 C 802 230, 782 262, 792 310 C 796 338, 812 342, 816 340"
            fill="none"
            stroke="#91C7B7"
            strokeOpacity="0.8"
            strokeWidth="2"
          />
          {/* LEFT ARM & PALM TRANSITION */}
          <path
            d="M 208 315 C 240 310, 280 305, 315 290 C 338 280, 360 252, 350 226 C 342 202, 315 210, 298 228 C 282 244, 260 258, 230 266"
            fill="none"
            stroke="url(#handGradClasp)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          {/* RIGHT ARM & PALM TRANSITION */}
          <path
            d="M 792 295 C 760 300, 720 305, 685 320 C 662 330, 640 358, 650 384 C 658 408, 685 400, 702 382 C 718 366, 740 352, 770 344"
            fill="none"
            stroke="url(#handGradClasp)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />

          {/* INTERLOCKING FINGERS & THUMBS CLASP */}
          <path
            d="M 315 290 C 352 284, 400 274, 442 272 C 466 270, 484 282, 472 300 C 452 328, 412 340, 370 346"
            fill="none"
            filter="url(#intense-green-flash)"
            stroke="url(#vividGreenGrad)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M 685 320 C 648 326, 600 336, 558 338 C 534 340, 516 328, 528 310 C 548 282, 588 270, 630 264"
            fill="none"
            filter="url(#intense-green-flash)"
            stroke="url(#vividGreenGrad)"
            strokeLinecap="round"
            strokeWidth="3"
          />

          {/* Interlocking Fingers Clasp */}
          <path
            d="M 370 330 C 415 325, 470 318, 515 315 C 532 314, 542 326, 532 340 C 510 368, 465 385, 410 385"
            fill="none"
            stroke="#D4F6EB"
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          <path
            d="M 630 280 C 585 285, 530 292, 485 295 C 468 296, 458 284, 468 270 C 490 242, 535 225, 590 225"
            fill="none"
            stroke="#D4F6EB"
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          <path
            d="M 355 355 C 400 352, 460 348, 502 352 C 518 354, 524 366, 512 378 C 480 405, 435 418, 380 412"
            fill="none"
            stroke="url(#handGradClasp)"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M 645 255 C 600 258, 540 262, 498 258 C 482 256, 476 244, 488 232 C 520 205, 565 192, 620 198"
            fill="none"
            stroke="url(#handGradClasp)"
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M 460 340 C 480 346, 500 344, 520 334 C 540 324, 555 326, 570 332"
            fill="none"
            stroke="#8FD14F"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
          <path
            d="M 440 305 C 460 312, 480 310, 495 302"
            fill="none"
            stroke="#91C7B7"
            strokeLinecap="round"
            strokeOpacity="0.8"
            strokeWidth="1.8"
          />
          <path
            d="M 505 308 C 520 300, 540 302, 560 295"
            fill="none"
            stroke="#91C7B7"
            strokeLinecap="round"
            strokeOpacity="0.8"
            strokeWidth="1.8"
          />
        </g>
      </svg>
    </div>
  );
}
