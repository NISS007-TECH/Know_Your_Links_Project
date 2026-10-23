import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-deep-jade text-white selection:bg-lime-accent selection:text-jade-950">
      {/* Brand Navigation Strip */}
      <header className="w-full bg-[#132A21] border-b border-[#1C3E32] px-6 sm:px-10 lg:px-16 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
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
          <span className="text-xs font-mono text-sea-glass">Status: 404 Not Found</span>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-lg w-full text-center space-y-6 bg-[#142D23] border border-[#275947] rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-lime-accent font-semibold block">
              Error 404 • Destination Unreachable
            </span>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
              Page not found
            </h1>
            <p className="text-xs sm:text-sm font-sans text-sea-glass leading-relaxed">
              The requested link or view does not exist on this server. It may have been moved, renamed, or temporarily suspended.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-accent text-jade-950 font-mono text-xs font-bold hover:bg-[#A3E65D] transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Link Scanner</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#132A21] border-t border-[#1C3E32] px-6 sm:px-10 lg:px-16 py-4 text-center text-[11px] font-mono text-sea-glass">
        Know Your Links — Cybersecurity URL & QR Code Analyzer
      </footer>
    </div>
  );
}
