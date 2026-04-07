# Take Home

**The real cost of returning to work in Ireland.**

**Take Home** is a free, open-source calculator that shows Irish parents exactly how much of their salary they will keep after tax and childcare costs — including NCS subsidies, ECCE free preschool hours, and the Marginal Effective Tax Rate that most tools never surface.

No login. No ads. No data collected. Runs entirely in your browser.

---

## Why this exists

Most "back to work" conversations stop at gross salary. Take Home answers the question that actually matters:

> *"After I pay tax, PRSI, USC, and childcare — what comes home?"*

For many families in Dublin the answer is under 40% of net pay. For some, returning full-time is a net financial loss. This tool makes that visible in under two minutes.

---

## Features

- **Accurate 2025 Irish tax calculation** — Income tax (20%/40% bands), USC (progressive bands), PRSI 4.125%, correct tax credits per status
- **NCS subsidy** — Age-banded max rates (infant €5.10/hr through school age €3.75/hr), income taper from €26k–€60k reckonable income, multi-child discount (€4,300 for 2 children, €8,600 for 3+)
- **ECCE free preschool** — 15 hrs/week free for children aged ~2y8m–5y6m, averaged monthly
- **Pension input** — Reduces take-home without affecting NCS reckonable income
- **METR (Marginal Effective Tax Rate)** — Shows what % of an extra €1,000 earned disappears to combined income tax and NCS subsidy withdrawal
- **Scenario comparison** — Full-time vs part-time (3 days) vs not returning, all recalculated
- **Effective hourly rate** — Your real hourly wage after childcare is factored in
- **Crèche directory** — Community-maintained local listings with Tusla registration status
- **Return-to-work checklist** — Saved to localStorage, no account needed
- **Email templates** — Ready-to-send scripts for requesting flexible working, negotiating childcare support, and HR conversations
- **Bilingual infrastructure** — English/Irish translation framework built in

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui (Radix UI) |
| Backend | Supabase (research data collection, opt-in) |
| Deployment | Vercel |

---

## Running locally

```bash
# Clone
git clone https://github.com/tropicgirlie/returnkit.git
cd returnkit

# Install
npm install

# Start dev server
npm run dev
# → http://localhost:3000
```

Requires Node.js 18+. No API keys needed to run the calculator — all tax and subsidy logic is client-side.

---

## How the calculator works

Full calculation documentation is in [`src/docs/CALCULATOR_DOCUMENTATION.md`](src/docs/CALCULATOR_DOCUMENTATION.md).

### Summary

```
1. Income tax    = (gross × rate) − tax credits
                   Single: credits = €3,875 | Married one income: €5,750
                   Married two incomes: each person assessed individually at €3,875

2. USC           = progressive bands per person (0.5% → 2% → 3.5% → 8%)

3. PRSI          = gross × 4.125%

4. Reckonable income (for NCS) = combined household net after tax/USC/PRSI

5. NCS subsidy   = hourly rate × min(hours, 45) × 4.33
                   Max rates: infant €5.10 | toddler €4.35 | preschool €3.95 | school €3.75
                   Taper: linear from max rate at €26k down to €2.14 at €60k+
                   Multi-child discount: −€4,300 (2 kids) / −€8,600 (3+ kids)

6. ECCE          = 15 hrs/week × 38 school weeks × ~€7/hr ÷ 12 = ~€333/mo
                   Preschool age band only (~3–5 years)

7. Amount left   = (net monthly − pension) − childcare out-of-pocket

8. METR          = % of extra €1,000 gross lost to income tax + NCS subsidy withdrawal
```

Sources: [Revenue.ie](https://www.revenue.ie), [NCS.gov.ie](https://www.ncs.gov.ie), [Citizens Information](https://www.citizensinformation.ie)

---

## Data and privacy

- The calculator runs **100% client-side** — no data is sent anywhere by default
- Checklist progress is saved to **localStorage** (your device only)
- The optional research contribution form collects **anonymised salary bands only** (not exact figures) with explicit GDPR consent
- No cookies, no tracking, no analytics

---

## Project structure

```
src/
├── App.tsx                        Main app — calculator, all sections
├── components/
│   ├── AdminPanel.tsx             Crèche directory admin (password-protected)
│   ├── CrecheMap.tsx              Crèche directory with area filtering + geolocation
│   ├── MaternityExplainerModal.tsx  How maternity leave works (educational)
│   ├── ResearchContribution.tsx   Opt-in anonymised data collection
│   ├── CopyButton.tsx             Clipboard utility
│   ├── TransparentLogo.tsx        Logo renderer
│   └── ui/                        shadcn/ui component library
├── data/
│   ├── translations.ts            EN/GA translation strings
│   ├── areas.ts                   Dublin area definitions + coordinates
│   └── tusla-raw.json             Raw Tusla registry data
├── docs/
│   └── CALCULATOR_DOCUMENTATION.md  Full calculation methodology
└── utils/
    └── supabase/info.tsx          Supabase client config
```

---

## Calculation accuracy

This calculator uses 2025 Revenue rates and NCS.gov.ie subsidy schedules (September 2024). Key figures that are commonly wrong in other tools and are **correct here**:

| Figure | Correct value | Common wrong value |
|--------|-------------|-------------------|
| Single tax credits | €3,875 | €4,000 |
| Married one income credits | €5,750 | €8,000 |
| NCS infant max rate | €5.10/hr | €3.75/hr (flat) |
| NCS toddler max rate | €4.35/hr | €3.75/hr (flat) |
| Multi-child income discount | €4,300 / €8,600 | Not applied |

---

## Contributing

Issues and PRs welcome — especially:
- Tax rate corrections (please link to source)
- NCS rate updates (NCS.gov.ie publishes new schedules periodically)
- Crèche data for areas outside Dublin
- Irish (Gaeilge) translation strings

---

## Roadmap

- [ ] Wire crèche directory to live Tusla open data
- [ ] Complete Irish (Gaeilge) language toggle
- [ ] ClinicalTrials.gov / HSE data integration for childcare costs by county
- [ ] Export results as PDF
- [ ] Sensitivity analysis ("what if childcare cost €200 less?")
- [ ] Paternity leave and shared parental leave scenarios

---

## Licence

MIT — free to use, adapt, and build on. If you use the calculator logic in another tool, a link back would be appreciated.

---

*Built by parents, for parents. Based on Budget 2025. Not financial advice.*
