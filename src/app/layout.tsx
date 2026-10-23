import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Know Your Links — Cybersecurity URL & QR Code Analyzer",
  description:
    "Evidence-led multi-engine URL and QR inspection. Query PhishGuard, Google Safe Browsing, URLhaus, VirusTotal, urlscan.io, and LinkGuard ML with plain-English threat transparency.",
  applicationName: "Know Your Links",
  keywords: [
    "URL scanner",
    "phishing detection",
    "cybersecurity",
    "QR code analyzer",
    "threat intelligence",
    "Safe Browsing",
    "URLhaus",
    "VirusTotal",
    "link safety",
  ],
  authors: [{ name: "Know Your Links Team" }],
  creator: "Know Your Links",
  publisher: "Know Your Links",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Know Your Links — Cybersecurity URL & QR Code Analyzer",
    description:
      "Paste an unfamiliar link. We ask six security sources what they have seen — then show you, plainly.",
    type: "website",
    locale: "en_US",
    siteName: "Know Your Links",
  },
  twitter: {
    card: "summary_large_image",
    title: "Know Your Links — Cybersecurity URL & QR Code Analyzer",
    description:
      "Evidence-led multi-engine URL inspection with plain-English threat transparency.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-lime-accent selection:text-jade-950">
        {children}
      </body>
    </html>
  );
}
