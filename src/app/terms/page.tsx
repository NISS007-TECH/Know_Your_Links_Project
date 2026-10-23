import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Scale, ShieldCheck, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Security Disclaimer — Know Your Links",
  description: "Terms of service, educational usage scope, and heuristic risk-scoring disclaimers.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-deep-jade text-white selection:bg-lime-accent selection:text-jade-950">
      {/* Header */}
      <header className="w-full bg-[#132A21] border-b border-[#1C3E32] px-6 sm:px-10 lg:px-16 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1C4839] border border-lime-accent flex items-center justify-center text-lime-accent text-xs font-mono font-bold">
              ✓
            </div>
            <div>
              <span className="font-mono text-sm font-bold tracking-tight block">
                Know Your Links
              </span>
              <span className="text-[10px] font-mono text-sea-glass tracking-widest uppercase block">
                Trust Handshake
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-sea-glass hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Scanner</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-10 px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2 border-b border-[#285746] pb-6">
            <span className="text-xs font-mono text-lime-accent uppercase tracking-wider font-semibold">
              Legal & Safety Governance
            </span>
            <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
              Terms of Service & Security Disclaimer
            </h1>
            <p className="text-xs font-mono text-sea-glass">
              Last updated: October 2026 • Effective immediately
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-200 leading-relaxed font-sans">
            {/* Essential Disclaimer Box */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Non-Negotiable Security Disclaimer</span>
              </div>
              <p className="text-amber-200/90 text-xs sm:text-sm leading-relaxed">
                Know Your Links provides provisional, multi-engine cybersecurity analysis and educational guidance. The overall risk score is a provisional heuristic index (0–100), not a scientifically calibrated mathematical probability that a URL is safe or malicious. It is not an endpoint antivirus, firewall, or diagnostic guarantee.
              </p>
            </div>

            {/* 1. Purpose & Acceptable Use */}
            <section className="space-y-3 bg-white text-slate-900 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 text-[#1C4839] font-mono font-bold text-sm">
                <Compass className="w-4 h-4" />
                <h2>1. Permitted Use</h2>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm">
                You may use Know Your Links to inspect unfamiliar links, QR code destinations, and suspicious email lures for personal, educational, and organizational threat-awareness purposes.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 font-medium pl-1">
                <li>You agree not to submit automated spam or conduct Denial of Service (DoS) attacks against this scanner.</li>
                <li>You acknowledge that submitting URLs initiates queries to public threat intelligence databases.</li>
                <li>You must not rely solely on this application to bypass organizational security policies.</li>
              </ul>
            </section>

            {/* 2. Limitations of Threat Intelligence */}
            <section className="space-y-3 bg-white text-slate-900 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 text-[#1C4839] font-mono font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <h2>2. Limitations of Threat Intelligence and Machine Learning</h2>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                Cybersecurity threats evolve continuously. Brand-new zero-day phishing websites, fast-flux domains, and compromised legitimate sites may not appear on public blocklists immediately.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 font-medium pl-1">
                <li>
                  <strong>Clean Is Not a Guarantee:</strong> The absence of blacklisting by participating engines indicates no known threat was logged; it does not guarantee that a link is permanently benign.
                </li>
                <li>
                  <strong>Machine-Learning Predictions:</strong> Machine learning models are heuristic classifiers and may generate false positives or false negatives.
                </li>
                <li>
                  <strong>Pending/Inconclusive Results:</strong> Partial or queued results must never be treated as completed clean analyses.
                </li>
              </ul>
            </section>

            {/* 3. Limitation of Liability */}
            <section className="space-y-3 bg-white text-slate-900 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 text-[#1C4839] font-mono font-bold text-sm">
                <Scale className="w-4 h-4" />
                <h2>3. Limitation of Liability</h2>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                Know Your Links is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. Under no circumstances will Know Your Links or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from visiting or failing to visit any analyzed URL.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#132A21] border-t border-[#1C3E32] px-6 sm:px-10 lg:px-16 py-4 text-center text-[11px] font-mono text-sea-glass">
        © Know Your Links — Cybersecurity URL & QR Code Analyzer
      </footer>
    </div>
  );
}
