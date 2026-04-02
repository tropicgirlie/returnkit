# ReturnKit — Calculator Documentation

> **Version 3.0 · Tax year 2025 · Last updated April 2026**
> Reflects the corrected calculation engine. Previous versions used wrong tax credits and a flat NCS rate — both are fixed here.

---

## Purpose

ReturnKit answers one question: **"How much of my salary will I actually keep after tax and childcare?"**

It is built specifically for Irish parents returning to work after maternity/paternity leave. It uses real 2025 Revenue tax bands, real NCS subsidy rates, and surfaces the number most calculators hide: your **Marginal Effective Tax Rate** — the combined effect of income tax and subsidy withdrawal as your salary rises.

---

## Inputs

| Input | Description |
|-------|-------------|
| Marital / tax status | Single, Married (one income), Married (two incomes) |
| Gross annual salary | Your salary before tax |
| Partner's salary | Only used for "married two incomes" |
| Monthly pension contribution | Optional; reduces take-home but not NCS reckonable income |
| Number of children in care | Used to multiply costs and apply multi-child NCS discount |
| Youngest child's age band | Determines NCS max rate and ECCE eligibility |
| Childcare provider type | Registered / Unregistered / Nanny — governs subsidy eligibility |
| Hours per week in childcare | Capped at 45 for NCS; enter actual hours worked |
| Monthly childcare cost | Per child, before any subsidy |

---

## Outputs

| Output | What it shows |
|--------|---------------|
| Net monthly (after tax) | Your take-home before childcare is subtracted |
| Childcare out-of-pocket | What you pay per month after NCS and ECCE |
| Amount left | Net monthly minus childcare out-of-pocket |
| % retained | Amount left as a proportion of net monthly |
| Effective hourly rate | Amount left ÷ hours worked per month |
| METR | % of an extra €1,000 earned that disappears to tax + subsidy loss |
| Monthly flow | Itemised: gross → tax → net → pension → childcare → remaining |

---

## Step 1 — Income Tax (Revenue 2025)

### How Irish income tax works

Ireland uses two rates: **20%** (standard rate) and **40%** (higher rate). Everyone pays 20% up to a threshold (the "standard rate cut-off"), then 40% above it. Tax credits are then subtracted from the gross tax bill.

### Standard rate cut-offs (2025)

| Status | Cut-off |
|--------|---------|
| Single | €44,000 |
| Married, one income | €53,000 |
| Married, two incomes | €44,000 per earner (each assessed individually) |

### Tax credits (2025) — corrected

> ⚠️ Previous versions of this calculator used €4,000 (single) and €8,000 (married two). Those figures were wrong. The correct 2025 figures are below.

| Status | Credits | Breakdown |
|--------|---------|-----------|
| Single | €3,875 | €1,875 personal + €2,000 PAYE (employee) |
| Married, one income | €5,750 | 2 × €1,875 personal + 1 × €2,000 PAYE |
| Married, two incomes | €3,875 per earner | Each person assessed individually |

### Tax formula (single or per-earner for married two)

```
If gross ≤ cut-off:
  gross tax = gross × 20%

If gross > cut-off:
  gross tax = (cut-off × 20%) + ((gross − cut-off) × 40%)

income tax = max(0, gross tax − tax credits)
```

**Example — single, €55,000:**
```
Gross tax  = (44,000 × 20%) + (11,000 × 40%)
           = €8,800 + €4,400 = €13,200
Credits    = €3,875
Income tax = €13,200 − €3,875 = €9,325
```

### Married two incomes — per-person method

Each spouse is assessed individually using the single cut-off (€44,000) and single credits (€3,875). Their after-tax nets are then combined to give the household net. This is more accurate than the old combined-gross method and matches how Revenue actually assesses two-income couples.

---

## Step 2 — USC (Universal Social Charge)

USC is calculated progressively on each person's gross income separately, including for married two-income households.

### USC bands (2025)

| Band | Rate |
|------|------|
| €0 – €12,012 | 0.5% |
| €12,013 – €27,382 | 2.0% |
| €27,383 – €70,044 | 3.5% |
| €70,045+ | 8.0% |

### USC formula

```
usc = 0
For each band [lower, upper, rate]:
  taxable = min(remaining income, upper − lower)
  usc += taxable × rate
  remaining income -= taxable
```

**Example — €55,000:**
```
€12,012 × 0.5%  = €60.06
€15,370 × 2.0%  = €307.40
€27,618 × 3.5%  = €966.63
Total USC        = €1,334.09
```

---

## Step 3 — PRSI (Pay Related Social Insurance)

PRSI is a flat 4.125% on gross income, calculated per earner.

```
PRSI = gross × 0.04125
```

---

## Step 4 — Net income

```
net annual = gross − income tax − USC − PRSI
net monthly = round(net annual / 12)
```

For **married two incomes**: both partners' net annuals are summed. This combined household net is used as the NCS **reckonable income** (see Step 5).

For **pension contributions**: pension is subtracted from net monthly *after* tax to give the display take-home. It does **not** reduce NCS reckonable income (pension is treated here as a post-tax deduction; occupational pension schemes that are pre-tax would already reduce gross before this calculation).

```
display net monthly = net monthly − monthly pension contribution
```

---

## Step 5 — NCS Subsidy

### What NCS is

The National Childcare Scheme provides an hourly subsidy toward registered childcare costs. It has two components:
- **Universal subsidy**: €2.14/hr for everyone with a child in registered care
- **Income-assessed subsidy**: additional top-up that tapers to zero above €60,000 reckonable income

**Not eligible**: unregistered childminders, nannies, au pairs, family members.

### Reckonable income

NCS reckonable income is the **combined household net income after tax, USC, and PRSI** — i.e., `taxResult.netAnnual`. For a single parent this is their own net annual. For a married couple with two incomes it is the sum of both partners' net annuals.

### Multiple child discount — corrected

> ⚠️ Previous versions did not include this. It is part of the official NCS calculation.

Before applying the income taper, the reckonable income is reduced:

| Children in care | Discount |
|------------------|----------|
| 1 child | €0 |
| 2 children | −€4,300 |
| 3+ children | −€8,600 |

```
adjusted income = max(0, reckonable income − discount)
```

This adjusted income is what is checked against the taper thresholds.

### Age-banded NCS max rates — corrected

> ⚠️ Previous versions used a flat €3.75/hr for all ages. The actual NCS rates vary by age. An infant can receive €5.10/hr — €1.35/hr more, which is ~€263/month difference at 45 hrs/week.

| Age band | Max hourly rate |
|----------|----------------|
| Under 12 months (infant) | **€5.10** |
| 12–35 months (toddler) | **€4.35** |
| 3–5 years (preschool) | **€3.95** |
| 5–15 years (school age) | **€3.75** |

The max rate is for the **youngest child**. All children are assumed to be the same age band for simplicity.

### Taper calculation

```
If adjusted income < €26,000:
  hourly rate = max rate (age band)

If adjusted income ≥ €60,000:
  hourly rate = €2.14 (universal only)

If €26,000 ≤ adjusted income < €60,000:
  position = (adjusted income − 26,000) / (60,000 − 26,000)
  hourly rate = max rate − (position × (max rate − 2.14))
```

This is a **linear taper** from the age-specific max down to €2.14.

### Monthly subsidy calculation

```
subsidised hours = min(hours per week, 45)
monthly subsidy = round(hourly rate × subsidised hours × 4.33)
```

The 4.33 factor is the average weeks per month (52 ÷ 12).

### Subsidy cap

The subsidy is capped so it cannot exceed the actual monthly childcare cost:
```
subsidy applied = min(monthly subsidy × num children, gross childcare cost)
```

### Example — married two incomes, combined net €80,000, 2 children (toddlers), 45 hrs/week, registered care

```
Reckonable income          = €80,000
Multi-child discount (×2)  = −€4,300
Adjusted income            = €75,700

€75,700 ≥ €60,000 → universal rate only: €2.14/hr

Monthly subsidy per child  = €2.14 × 45 × 4.33 = €417.07
Total subsidy (2 children) = €834.14/mo
```

### Example — single, net €38,000, 1 infant, 45 hrs/week, registered care

```
Reckonable income = €38,000
No discount (1 child)

Position = (38,000 − 26,000) / (60,000 − 26,000) = 12,000 / 34,000 = 35.3%
Hourly rate = 5.10 − (0.353 × (5.10 − 2.14))
            = 5.10 − (0.353 × 2.96)
            = 5.10 − 1.04
            = €4.06/hr

Monthly subsidy = €4.06 × 45 × 4.33 = €791/mo
```

---

## Step 6 — ECCE (Early Childhood Care and Education)

ECCE provides **15 free hours per week** of preschool during the school term (38 weeks/year). It applies to children aged approximately 2 years 8 months to 5 years 6 months — mapped in the calculator to the **"preschool" age band**.

```
If child age band = 'preschool':
  weekly hours free = 15
  annual saving = 15 × 38 × €7   (€7 = estimated average crèche hourly rate)
  monthly saving = round(annual saving / 12) = €333/month per child
```

The saving is averaged across 12 months for budgeting purposes (ECCE only runs during school term but families tend to think in monthly costs).

**Not eligible**: infant, toddler, school-age bands.

---

## Step 7 — Final childcare out-of-pocket

| Provider type | NCS | ECCE |
|---------------|-----|------|
| Registered crèche / childminder | ✅ | ✅ if preschool age |
| Unregistered childminder | ❌ | ✅ if preschool age (via separate registered preschool) |
| Nanny | ❌ | ❌ |

```
Registered:
  out of pocket = max(0, (cost × children) − subsidy applied − ecce saving × children)

Unregistered:
  out of pocket = max(0, (cost × children) − ecce saving × children)

Nanny:
  out of pocket = cost × children
```

---

## Step 8 — Amount left and key metrics

```
amount left = display net monthly − out of pocket

% retained = round((amount left / display net monthly) × 100)

effective hourly rate = amount left / (hours per week × 4.33)
```

**Retention strength labels:**
- ≥ 60% retained → **Strong**
- 40–59% retained → **Moderate**
- < 40% retained → **Weak**

---

## Step 9 — METR (Marginal Effective Tax Rate)

### What METR is

METR measures how much of an extra **€1,000 in gross salary** you actually keep, once income tax and NCS subsidy withdrawal are both accounted for. A high METR means earning more barely improves your financial position.

This is the metric that explains the "childcare trap": at certain income levels, a pay rise triggers both higher tax *and* a reduction in NCS subsidy, so the combined effective marginal rate can exceed 80%.

### METR formula

```
delta = €1,000

base net  = net annual income at current gross (user only, not combined)
new net   = net annual income at (gross + delta)
net gain  = new net − base net

base sub  = (monthly NCS subsidy at current reckonable income) × 12
new sub   = (monthly NCS subsidy at reckonable income + net gain) × 12
subsidy loss = max(0, base sub − new sub)

total lost = (delta − net gain) + subsidy loss
METR = min(99, max(0, round((total lost / delta) × 100)))
```

The METR uses the user's **individual** net gain (not the combined household), because it is measuring the effect of *that person* earning more. The subsidy loss is calculated against the full reckonable income because the NCS uses combined family income.

### Interpreting METR

| METR | Meaning |
|------|---------|
| < 45% | Reasonable — earning more translates well into take-home |
| 45–59% | Elevated — a notable portion of any raise disappears |
| ≥ 60% | High — ESRI identifies this range as a significant work disincentive for moderate-income families |

METR is only shown for **registered childcare** because the NCS income taper is what creates the subsidy-withdrawal effect. For nannies and unregistered care there is no NCS taper, so METR equals the standard marginal income tax + USC + PRSI rate only.

### Example

Single parent, €55,000 gross, net €42,100, 1 infant, 45 hrs/week, registered care:

```
base net (€55k)  = €42,100
new net (€56k)   = €42,661   → net gain = €561

base sub = NCS at €42,100 = ~€4.06/hr → €791/mo → €9,492/yr
new sub  = NCS at €42,661 = ~€4.01/hr → €781/mo → €9,372/yr
subsidy loss = €9,492 − €9,372 = €120/yr

total lost = (€1,000 − €561) + €120 = €559
METR = round(559 / 1000 × 100) = 56%
```

This parent keeps only €441 of every extra €1,000 earned — 56% disappears to tax and subsidy withdrawal combined.

---

## Scenario Comparison

The calculator compares three scenarios using the same inputs:

| Scenario | Salary | Hours | Childcare costs |
|----------|--------|-------|----------------|
| Full-time | 100% of gross | 100% of hours | 100% of costs |
| Part-time (3 days) | 60% of gross | 60% of hours | 60% of costs |
| Not returning | €0 | 0 | €0 |

Each scenario runs the full tax + NCS + ECCE calculation independently. Because NCS subsidy is income-dependent, the part-time scenario often shows a higher hourly rate than full-time — the subsidy increases as income falls, partially offsetting the salary reduction.

---

## Important assumptions and limitations

| Assumption | Value / note |
|------------|-------------|
| Tax year | 2025 (Budget 2025 rates) |
| Weeks per month | 4.33 (52 ÷ 12) |
| ECCE hourly rate estimate | €7/hr (mid-range Dublin average) |
| ECCE school weeks | 38 weeks/year |
| NCS hours cap | 45 hrs/week |
| NCS rates | September 2024 schedule (NCS.gov.ie) |
| PRSI | Employee Class A1: 4.125% |
| Pension | Treated as post-tax deduction for display; does not reduce reckonable income |
| Child ages | All children assumed to be in the same age band as the youngest |
| Married two incomes | Each spouse assessed individually, then combined for household view |
| ECCE | Only the "preschool" age band (≈ 3–5 yrs) qualifies |

### What the calculator does not model

- Pension tax relief (pre-tax occupational pension would reduce taxable gross)
- Working Family Payment or other welfare top-ups
- Back-to-education allowance
- Benefit-in-kind income
- Self-employment income (assumes PAYE)
- Dublin Living Wage or minimum wage caps
- Actual crèche fee variation by provider (uses user-entered cost)

---

## Sources

| Item | Source |
|------|--------|
| Income tax bands and credits | [Revenue.ie — Tax credits and reliefs 2025](https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts/index.aspx) |
| Tax credits (€3,875 single) | [MyTaxRebate.ie — 2025 Tax Credits](https://www.mytaxrebate.ie/tax-credits) |
| USC bands | [Revenue.ie — Universal Social Charge](https://www.revenue.ie/en/jobs-and-pensions/usc/index.aspx) |
| NCS subsidy rates | [NCS.gov.ie — September 2024 rates](https://www.ncs.gov.ie) |
| NCS income thresholds | [Citizens Information — National Childcare Scheme](https://www.citizensinformation.ie/en/education/pre-school-education-and-childcare/national-childcare-scheme/) |
| NCS multiple child discount | [National Childcare Scheme — Multiple Child Discount](https://www.ncs.gov.ie) |
| ECCE | [Citizens Information — ECCE](https://www.citizensinformation.ie/en/education/pre-school-education-and-childcare/early-childhood-care-and-education-scheme/) |
| METR methodology | ESRI Research on work disincentives for moderate-income families |

---

## Change log

| Version | Date | Change |
|---------|------|--------|
| 3.0 | April 2026 | Corrected tax credits (€3,875 single, €5,750 married one income); age-banded NCS rates; multi-child NCS income discount; per-person married_two assessment; METR added; pension input added; subsidy cap added |
| 2.0 | March 2026 | Added ECCE, scenario comparison, effective hourly rate, waitlist penalty display |
| 1.0 | February 2026 | Initial calculator: flat NCS rate, combined gross tax for married two incomes |
