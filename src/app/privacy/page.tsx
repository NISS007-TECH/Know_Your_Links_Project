import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Know Your Links",
  description: "How Know Your Links handles URL inspections, telemetry queries, and user privacy.",
};

export default function PrivacyPolicyPage() {
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
              Legal & Transparency
            </span>
            <h1 className="text-3xl font-mono font-bold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-sea-glass">
              Last updated: October 2026 • Effective immediately
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-200 leading-relaxed font-sans">
            {/* Core Commitment */}
            <div className="bg-[#142D23] border border-[#275947] rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-lime-accent font-mono text-xs font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Our Core Privacy Principle</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm">
                Know Your Links is built as an open, privacy-preserving cybersecurity awareness tool. We do not require registration, do not maintain user accounts, do not sell personal data, and do not track users across websites with commercial advertising pixels.
              </p>
            </div>

            {/* 1. What Data We Process */}
            <section className="space-y-3 bg-white text-slate-900 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 text-[#1C4839] font-mono font-bold text-sm">
                <Globe className="w-4 h-4" />
                <h2>1. URLs Submitted for Inspection</h2>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm">
                When you submit a URL for analysis, the system evaluates the destination address to extract hostname, protocol, path, and structural features.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 font-medium pl-1">
                <li>
                  <strong>Target Analysis:</strong> To determine whether a link is malicious, the destination URL is queried against participating threat intelligence APIs (such as Google Safe Browsing, URLhaus, VirusTotal, and urlscan.io).
                </li>
                <li>
                  <strong>Third-Party Terms:</strong> Querying external security feeds is governed by their respective public APIs and security reporting terms.
                </li>
                <li>
                  <strong>Defanging:</strong> Where URLs are stored or logged for cache deduplication, they are defanged (e.g. <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">hxxps://...</code>) to prevent accidental execution.
                </li>
              </ul>
            </section>

            {/* 2. Telemetry and Analytics */}
            <section className="space-y-3 bg-white text-slate-900 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 text-[#1C4839] font-mono font-bold text-sm">
                <Eye className="w-4 h-4" />
                <h2>2. No Personal Profiles or Commercial Tracking</h2>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm">
                We do not collect names, email addresses, phone numbers, passwords, or credit card information. We do not use third-party behavioral profiling trackers. Standard server connection logs (such as request timestamps and HTTP status codes) are retained solely for operational reliability and DDoS mitigation.
              </p>
            </section>

            {/* 3. Data Retention and Security */}
            <section className="space-y-3 bg-white text-slate-900 rounded-xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2 text-[#1C4839] font-mono font-bold text-sm">
                <Lock className="w-4 h-4" />
                <h2>3. Encryption and Security</h2>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm">
                All communications between your browser, the Next.js API gateway, and the n8n Cloud orchestration backend are encrypted in transit using industry-standard TLS 1.3 encryption.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#132A21] border-t border-[#1C3E32] px-6 sm:px-10 lg:px-16 py-4 text-center text-[11px] font-mono text-sea-glass">
        © Know Your Links — Transparency & Open Threat Telemetry
      </footer>
    </div>
  );
}
