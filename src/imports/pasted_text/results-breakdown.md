# ReturnKit — Results Breakdown Screen
## Figma Design Prompt

---

### Context

ReturnKit is a financial reality calculator for Dublin parents returning to work. It exposes how Irish tax and childcare policy interact to make paid work financially marginal — or worse. The tool is positioned as neutral civic infrastructure, not a parenting resource. Think Coinbase meets government data. Every design choice should reinforce credibility and trust.

The results screen is the most important surface. It's what gets screenshotted and shared. It must be clear, serious, and immediately scannable.

---

### Aesthetic Direction

**Reference**: Coinbase / Stripe dashboard — government-grade credibility, financial infrastructure, nothing decorative.

- Clean white surface, tight grid, no gradients
- Typography-led hierarchy — numbers do the visual work
- Colour used sparingly and semantically only: red for costs/loss, green for retained, amber for warnings
- Mobile-first, screenshot-optimised (single column, 390px wide)
- No illustrations, no icons beyond functional glyphs
- Whitespace is structural, not decorative

---

### Layout Structure (top to bottom)

#### 1. Summary Metric Cards
Three equal-width cards in a row. Light grey background fill, no border, 8px radius.

| Card | Label | Value style |
|------|-------|-------------|
| Net monthly (after pension) | 12px muted label above | 22px medium, primary text |
| Nanny cost | 12px muted label above | 22px medium, amber (#BA7517) |
| Left after childcare | 12px muted label above | 22px medium, red (#A32D2D) |

**Placeholder values**: €3,516 / €2,260 / €1,256

---

#### 2. "Where your net pay goes" Bar Card
White card, 0.5px border, 12px radius. Internal padding 16px/20px.

- Left-aligned label: "Where your net pay goes" — 13px, muted
- Right-aligned badge: status pill — "Moderate — 40.5% retained" — 11px, amber background (#FAEEDA), amber text (#854F0B), 20px radius pill
- Stacked horizontal bar, 28px tall, 6px radius, full width:
  - Left segment: red (#E24B4A) — "Nanny 59.5%", 11px white label
  - Right segment: green (#639922) — "Yours 40.5%", 11px white label
- Below bar: 12px tertiary note — "Nannies are ineligible for NCS — no subsidy regardless of registration"

**Badge states to design** (for variants):
- Strong ≥60%: green pill
- Moderate 40–59%: amber pill
- Weak <40%: red pill

---

#### 3. Monthly Flow Card
White card, 0.5px border, 12px radius.

Section label: "Monthly flow" — 13px muted, 12px bottom margin.

Rows (14px, full-width flex, space-between, 8px vertical padding, 0.5px divider between rows):

| Row label | Value |
|-----------|-------|
| Gross salary (€65,000/yr) | €5,417 — primary |
| Tax + USC + PRSI + pension | −€1,901 — red |
| Net take-home | €3,516 — primary |
| Nanny — no NCS, no ECCE | −€2,260 — red |
| **Remaining** | **€1,256** — green, 500 weight |

Last row no divider. "Remaining" label at 500 weight.

---

#### 4. Effective Hourly Rate Card
White card, 0.5px border, 12px radius. Single row, space-between.

- Left: "Your effective hourly rate" — 13px muted
- Right: "€6.45/hr" — 22px, 500 weight, primary

*(Calculated as: €1,256 remaining ÷ (40hrs/wk × 4.33) = €7.25/hr — adjust to actual hours input)*

---

#### 5. Waitlist Penalty Card
White card, **red-tinted background** (#FCEBEB), 0.5px red border (#F09595), 12px radius.

Section label: "The waitlist penalty" — 13px, red-muted (#A32D2D).

Rows (same pattern as monthly flow card):

| Row label | Value |
|-----------|-------|
| Dublin crèche average | ~€1,200/mo — primary |
| NCS subsidy (€2.14/hr × 45h) | −€417/mo — green |
| Crèche out-of-pocket after NCS | ~€783/mo — green |
| What you actually pay (nanny) | €2,260/mo — red |

**Highlighted bottom row** — slightly darker red tint fill, no border, 8px radius inset:
- Left label: "Waitlist penalty per month" — 14px, red (#A32D2D), 500 weight
- Right value: "€1,477" — 18px, red, 500 weight
- Sub-label below: "€17,724/year — for being forced onto the nanny route" — 12px, red-muted

---

### Placeholder Scenario
Use this consistently across all cards:

- **Gross salary**: €65,000/yr (Dublin tech, senior IC)
- **Marital status**: married, combined household €130,000
- **Net take-home**: €3,516/mo (after tax, before pension)
- **Childcare type**: private nanny, unregistered, cash
- **Nanny cost**: €2,260/mo
- **Child age**: 17 months (not yet ECCE-eligible)
- **Hours worked**: 40/wk

---

### Typography
- Labels / secondary text: 12–13px, regular, muted (#6B6B6B or equivalent token)
- Body rows: 14px, regular
- Values: 14–22px, 500 weight
- Hero numbers (summary cards): 22px, 500
- Penalty highlight: 18px, 500, red

### Spacing
- Card gap: 12px
- Card internal padding: 16px top/bottom, 20px left/right
- Row vertical padding: 8px
- Summary card grid gap: 10px

### Colours (semantic)
- Primary text: #1A1A1A
- Muted / label: #6B6B6B
- Red (cost / loss): #A32D2D (text), #E24B4A (bar), #FCEBEB (bg tint), #F09595 (border)
- Green (retained / saving): #3B6D11 (text), #639922 (bar)
- Amber (warning / moderate): #854F0B (text), #FAEEDA (bg tint), #BA7517 (value)
- Card border: 0.5px #E0E0E0
- Card background: #FFFFFF
- Metric card background: #F5F5F5
- Page background: #F9F9F9

---

### Components to Create
1. `MetricCard` — label + value, 3 states (neutral / amber / red)
2. `RetentionBar` — segmented bar + badge, 3 badge states
3. `FlowCard` — labelled rows with dividers, final row highlighted
4. `HourlyRateCard` — single stat row
5. `PenaltyCard` — red-tinted variant of FlowCard, inset highlight row
6. `StatusBadge` — pill component, 3 states

---

### Notes for the designer
- No CTAs on this screen. No "Find a crèche" button, no links. The data speaks.
- The penalty card is the emotional payload — it should feel like a receipt, not an infographic.
- All values should feel like they came from a calculator, not marketing copy.
- Designed for mobile first (390px), scales to 480px max for web embed.