"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

interface GlossaryTerm {
  term: string;
  plainEnglish: string;
  whyItMatters: string;
  whatItCannotProve: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Domain Age",
    plainEnglish: "How many days or years have passed since the domain was first registered.",
    whyItMatters: "Scammers frequently create brand new domains for phishing attacks, then abandon them quickly.",
    whatItCannotProve: "An old domain is not guaranteed safe; legitimate older websites can be compromised or expired domains purchased by bad actors.",
  },
  {
    term: "SSL / TLS Certificate",
    plainEnglish: "A digital certificate that encrypts the connection between your browser and the website (the padlock icon).",
    whyItMatters: "Protects sensitive data from eavesdroppers while it is traveling over the network.",
    whatItCannotProve: "HTTPS only encrypts the connection—it does not prove the site owner is honest. Most phishing websites today use valid, free SSL certificates.",
  },
  {
    term: "DNS & Mail Records (SPF / DMARC)",
    plainEnglish: "Configuration records published by domain owners to prevent unauthorized parties from sending spoofed emails from their domain.",
    whyItMatters: "Helps verify whether the domain has established email identity protection against spoofing.",
    whatItCannotProve: "Mail authentication relates to outgoing email. Having SPF/DMARC does not prove that links hosted on the website are benign.",
  },
  {
    term: "Threat Intelligence Feeds",
    plainEnglish: "Constantly updated security databases (such as Safe Browsing, URLhaus, and VirusTotal) tracking known malicious links.",
    whyItMatters: "Provides high-confidence confirmation when a link matches active malware campaigns or verified phishing reports.",
    whatItCannotProve: "Absence of a detection is not proof of safety. Brand-new attack URLs often take hours or days to appear on public blocklists.",
  },
  {
    term: "Machine-Learning (ML) Prediction",
    plainEnglish: "An automated statistical classifier that analyzes URL patterns, keywords, and domain structure to estimate risk.",
    whyItMatters: "Can catch newly generated or zero-day phishing patterns before they are added to traditional blocklists.",
    whatItCannotProve: "ML models are heuristic and make errors. A benign prediction is not a guarantee, and a flagged prediction is not definitive proof.",
  },
  {
    term: "Queued or Partial Analysis",
    plainEnglish: "The security scanner has accepted the link, but the sandbox analysis or engine scans are still running.",
    whyItMatters: "Indicates that full scan results are pending and provisional numbers may change once completed.",
    whatItCannotProve: "A queued analysis with zero flags so far must never be treated as a confirmed clean result.",
  },
  {
    term: "Unknown ≠ Safe",
    plainEnglish: "The security provider did not return enough data or was unavailable during the inspection.",
    whyItMatters: "We keep unknown states amber to ensure incomplete data is never mistaken for a clean bill of health.",
    whatItCannotProve: "An unknown status indicates a lack of data, not safety.",
  },
];

export function TechnicalGlossary() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTerms, setExpandedTerms] = useState<Record<number, boolean>>({});

  const toggleTerm = (idx: number) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="bg-white border border-slate-300 rounded-xl p-5 sm:p-6 shadow-sm text-slate-900 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#1C4839] shrink-0" />
          <div>
            <h4 className="text-base sm:text-lg font-bold font-mono uppercase tracking-wider text-slate-900">
              Plain-English Security Glossary
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-mono mt-0.5">
              Demystifying technical terms, certificates, heuristic models, and provider statuses
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs sm:text-sm font-mono font-bold text-slate-700 transition-colors cursor-pointer self-start sm:self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-expanded={isOpen}
          aria-controls="glossary-term-list"
        >
          <span>{isOpen ? "Hide Security Guide" : "Explain Technical Terms"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div id="glossary-term-list" className="mt-4 pt-4 border-t border-slate-200 space-y-3.5">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif italic mb-3">
            Cybersecurity tools use technical jargon that can obscure what is actually happening. Click any concept below to see what it means and what it cannot prove.
          </p>

          <div className="space-y-3">
            {GLOSSARY_TERMS.map((item, idx) => {
              const isExpanded = !!expandedTerms[idx];
              return (
                <div
                  key={item.term}
                  className="border border-slate-200 rounded-lg bg-slate-50 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleTerm(idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-sm sm:text-base font-mono font-bold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500"
                    aria-expanded={isExpanded}
                    aria-controls={`glossary-desc-${idx}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#1C4839] shrink-0" />
                      <span>{item.term}</span>
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 shrink-0">
                      <span className="text-xs sm:text-sm font-mono hidden sm:inline font-normal text-slate-500">
                        {isExpanded ? "Collapse" : "Click to view"}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div
                      id={`glossary-desc-${idx}`}
                      className="p-4 border-t border-slate-200/80 bg-white text-sm sm:text-base space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5">
                          <span className="font-mono text-xs sm:text-sm uppercase font-bold text-slate-700 block tracking-wider">
                            Plain English:
                          </span>
                          <p className="text-slate-800 leading-relaxed font-medium mt-1.5 text-sm sm:text-base">
                            {item.plainEnglish}
                          </p>
                        </div>
                        <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-lg p-3.5">
                          <span className="font-mono text-xs sm:text-sm uppercase font-bold text-emerald-800 block tracking-wider">
                            Why it matters:
                          </span>
                          <p className="text-slate-800 leading-relaxed font-medium mt-1.5 text-sm sm:text-base">
                            {item.whyItMatters}
                          </p>
                        </div>
                        <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-3.5">
                          <span className="font-mono text-xs sm:text-sm uppercase font-bold text-amber-900 block tracking-wider">
                            What it cannot prove:
                          </span>
                          <p className="text-slate-800 leading-relaxed font-medium mt-1.5 text-sm sm:text-base">
                            {item.whatItCannotProve}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
