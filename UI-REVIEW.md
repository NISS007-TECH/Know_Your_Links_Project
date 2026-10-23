# Know Your Links — 6-Pillar UI Review

**Audited:** 2026-10-23  
**Baseline:** Abstract 6-Pillar Standards & Cybersecurity Telemetry Design Contract  
**Screenshots:** Code & Component Review (Dev server running on localhost:3000)  

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Highly specific action verbs, rigorous non-antivirus disclaimer language, zero generic "Submit/Click Here" labels |
| 2. Visuals | 4/4 | Dual-stage visual hierarchy: vibrant automotive telemetry cockpit paired with accessible evidence tables |
| 3. Color | 3/4 | Consistent 60/30/10 jade/slate/accent distribution, but contains some repeated hardcoded hex literals |
| 4. Typography | 3/4 | Clean Space Grotesk + JetBrains Mono pairing; slight proliferation of sub-scale sizes (`text-[10px]`, `text-[11px]`) |
| 5. Spacing | 3/4 | Consistent 4/8/12/16/24 scale with responsive padding, though arbitrary bracket widths exist (`max-w-[1400px]`) |
| 6. Experience Design | 4/4 | Robust state machine: multi-phase ignition sweep, prefers-reduced-motion check, copy feedback, defanging live preview |

**Overall: 21/24**

---

## Top 3 Priority Fixes

1. **Unify Hardcoded Hex Codes into Tailwind CSS Theme Tokens (Pillar 3)**  
   - *User Impact:* Maintainability risk and potential slight drift between component variations (e.g., `#1C4839` vs `#153428` vs `#183B2F`).  
   - *Concrete Fix:* Consolidate inline hex strings in `RiskSpeedometer.tsx` and `OverallRiskHeader.tsx` into Tailwind `@theme` variables (`var(--color-jade-900)`, `var(--color-jade-800)`, `var(--color-lime-accent)`).

2. **Standardize Sub-12px Telemetry Font Sizes (Pillar 4)**  
   - *User Impact:* `text-[10px]` and `text-[11px]` can cause legibility strain for users with visual impairments on smaller screens.  
   - *Concrete Fix:* Normalize badge and telemetry label typography to standard `text-xs` (12px) with `tracking-wider` uppercase styling, reserving `text-[11px]` strictly for secondary mono timestamps.

3. **Ensure Touch-Target Minimums on Preset Buttons on Mobile (Pillar 5)**  
   - *User Impact:* Preset pills (`88 Threat`, `36/48 Ref`, `10 Safe`) in `RiskSpeedometer.tsx` have `py-1` (around 28px height), below the recommended 44px mobile touch target guideline.  
   - *Concrete Fix:* Add `min-h-[36px]` or `min-h-[40px]` on small screens or wrap in a touch-padded flex container to improve mobile tap reliability.

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)
- **Strengths:**
  - **Zero Generic Labels:** Search buttons use active task verbs: `"Analyze link →"` and `"Inspecting link..."` (`UrlScannerForm.tsx:213, 208`), `"Analyze Another Link"` (`SecurityReportView.tsx:49`), and `"▶ Re-test Ignition Sweep"` (`RiskSpeedometer.tsx:441`).
  - **Safety Disclaimers:** Explicitly communicates that the tool is an awareness utility rather than antivirus software: *"Know Your Links — awareness tool, not antivirus. Does not guarantee safety."* (`page.tsx:334`).
  - **Provider Neutrality:** Accurately explains heuristic scores without implying diagnostic certainty: *"Method: Rule-based heuristic using provider risk scores, threat indicators, and warning sources. Not a calibrated probability."* (`OverallRiskHeader.tsx:139`).
  - **Plain-English Explanations:** Every risk level is translated into actionable language (e.g., *"There is not enough reliable information to make a confident assessment..."*).

### Pillar 2: Visuals (4/4)
- **Strengths:**
  - **Clear Focal Point:** The page immediately focuses the user on the URL input and live vector handshake scene on the hero, followed by the automotive radial risk gauge upon scan completion.
  - **Accessibility for Controls:** All buttons include descriptive text or programmatic access labels (`aria-expanded`, `aria-label`, or tooltip `title`).
  - **Dynamic Automotive Gauge:** Standalone white card with luminous gradient arc (`#2563EB` $\to$ `#A855F7` $\to$ `#EC4899` $\to$ `#EF4444`), 17 radial ticks, red needle with circular hub, bold score readout, and status badge pill.
  - **Seamless Stage Division:** Deep forest green background (`#1C4839`) connects the hero section down past the risk meter without top border interruption, transitioning into the light evidence report after the gauge.

### Pillar 3: Color (3/4)
- **Strengths:**
  - **60/30/10 Ratio:** Deep Jade (`#1C4839`) as the 60% brand canvas, neutral dark cockpit surfaces (`#0D241C`) and light slate report cards (`#FFFFFF`/`#F1F5F2`) as 30% structural backgrounds, and Lime Accent (`#8FD14F`), Crimson (`#EF4444`), and Amber (`#D97706`) as 10% semantic accents.
  - **Warning Semantics:** Threat levels are distinguished by multi-attribute indicators (color + icon + text label), preventing reliance on color alone.
- **Deductions:**
  - Multiple components contain inline hex values (e.g. `bg-[#0D241C]`, `border-[#1E4839]`, `text-[#8FD14F]`) rather than leveraging the unified Tailwind `@theme` palette tokens declared in `globals.css`.

### Pillar 4: Typography (3/4)
- **Strengths:**
  - High-quality font pairing: Space Grotesk for headings and UI copy, JetBrains Mono for URLs, defanged links, and telemetry readouts.
  - Clear heading hierarchy from `<h1>` (hero headline) to `<h2>` (gauge title) and `<h3>` (card headings).
- **Deductions:**
  - Excessive proliferation of sub-scale arbitrary font sizes (`text-[10px]`: 16 occurrences, `text-[11px]`: 38 occurrences).
  - Heavy concentration of `font-bold` (126 instances) versus `font-medium` (48 instances), which occasionally flattens hierarchy in metadata badges.

### Pillar 5: Spacing (3/4)
- **Strengths:**
  - Clean modular grid structures (`grid-cols-1 sm:grid-cols-3`, `lg:grid-cols-12`).
  - Responsive padding across viewports (`px-6 sm:px-10 lg:px-16`, `py-10 sm:py-16`).
  - Consistent border radii tokens (`rounded-xl`, `rounded-2xl`, `rounded-3xl`).
- **Deductions:**
  - Several arbitrary pixel constraints like `max-w-[1400px]`, `rounded-[32px]`, and `aspect-[1.18/1]` in vector scenes instead of standard tailwind tokens.
  - Mobile preset buttons in `RiskSpeedometer.tsx` have tight vertical padding (`py-1`), which is tight for finger taps on small touchscreens.

### Pillar 6: Experience Design (4/4)
- **Strengths:**
  - **State Machine Completeness:** Full visual coverage across idle, validating, scanning, clean (clasp), threat (fracture), inconclusive (gap), and error states.
  - **Motion & Accessibility:** `RiskSpeedometer` checks `window.matchMedia("(prefers-reduced-motion: reduce)")` and disables animation for users requesting reduced motion.
  - **Interactive Presets:** Live simulation buttons allow instant testing of threat (88/100), reference (36/48), safe (10/100), and actual scan score.
  - **Defanged Copy Utility:** One-click clipboard copy for safe sharing without accidental link execution.
  - **Print Layout:** Dedicated print stylesheet hiding interactive controls and formatting reports for physical printing.

---

## Files Audited

- [`src/app/page.tsx`](file:///e:/Know_Your_Link_New/src/app/page.tsx)
- [`src/app/globals.css`](file:///e:/Know_Your_Link_New/src/app/globals.css)
- [`src/components/scanner/UrlScannerForm.tsx`](file:///e:/Know_Your_Link_New/src/components/scanner/UrlScannerForm.tsx)
- [`src/components/scanner/ProviderNetworkGrid.tsx`](file:///e:/Know_Your_Link_New/src/components/scanner/ProviderNetworkGrid.tsx)
- [`src/components/handshake/HandshakeScene.tsx`](file:///e:/Know_Your_Link_New/src/components/handshake/HandshakeScene.tsx)
- [`src/components/report/RiskSpeedometer.tsx`](file:///e:/Know_Your_Link_New/src/components/report/RiskSpeedometer.tsx)
- [`src/components/report/SecurityReportView.tsx`](file:///e:/Know_Your_Link_New/src/components/report/SecurityReportView.tsx)
- [`src/components/report/OverallRiskHeader.tsx`](file:///e:/Know_Your_Link_New/src/components/report/OverallRiskHeader.tsx)
- [`src/components/report/TargetMetadata.tsx`](file:///e:/Know_Your_Link_New/src/components/report/TargetMetadata.tsx)
- [`src/components/report/ActionGuidance.tsx`](file:///e:/Know_Your_Link_New/src/components/report/ActionGuidance.tsx)
- [`src/components/report/ProviderStatusGrid.tsx`](file:///e:/Know_Your_Link_New/src/components/report/ProviderStatusGrid.tsx)
- [`src/components/report/EvidenceTable.tsx`](file:///e:/Know_Your_Link_New/src/components/report/EvidenceTable.tsx)
- [`src/components/report/TechnicalGlossary.tsx`](file:///e:/Know_Your_Link_New/src/components/report/TechnicalGlossary.tsx)
- [`src/components/report/LimitationsSection.tsx`](file:///e:/Know_Your_Link_New/src/components/report/LimitationsSection.tsx)
