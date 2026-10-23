"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HandshakeScene, HandshakeState } from "@/components/handshake/HandshakeScene";

export default function DevPreviewPage() {
  const [activeState, setActiveState] = useState<HandshakeState>("idle");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-deep-jade text-white selection:bg-lime-accent selection:text-jade-950">
      {/* Dev Navigation Strip */}
      <aside className="w-full bg-[#0C1A14] border-b border-[#285746] px-6 py-3 text-xs font-mono flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sea-glass hover:text-white transition-colors flex items-center gap-1 font-semibold"
          >
            ← Back to Homepage
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-bold uppercase">
            Internal Dev Preview Route (/dev-preview)
          </span>
        </div>

        {/* State Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-[#142D23] p-1 rounded-lg border border-[#275947]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider px-2">
            State:
          </span>
          {(
            [
              { id: "idle", label: "1. Idle" },
              { id: "scanning", label: "2. Scanning" },
              { id: "clean", label: "3. Clean (Clasp)" },
              { id: "threat", label: "4. Threat (Fracture)" },
              { id: "inconclusive", label: "5. Inconclusive (Gap)" },
              { id: "error", label: "6. Error State" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveState(item.id)}
              className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                activeState === item.id
                  ? "bg-lime-accent text-jade-950 font-bold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-[#1E4334]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-mono text-white mb-1">
              Handshake Animation Inspector
            </h1>
            <p className="text-xs font-mono text-sea-glass">
              Current state: <strong className="text-lime-accent">{activeState}</strong> — comparing against original Stitch exported assets
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <HandshakeScene state={activeState} />
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#132A21] border-t border-[#1C3E32] px-6 py-4 text-center text-xs font-mono text-sea-glass">
        Know Your Links — Developer Visual Verification Route
      </footer>
    </div>
  );
}
