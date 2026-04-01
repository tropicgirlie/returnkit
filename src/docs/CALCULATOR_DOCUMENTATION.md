# ReturnKit Calculator Documentation

## Purpose

The ReturnKit Calculator is a financial reality tool designed to help Dublin parents understand the **true financial impact** of returning to work after having children. It answers the critical question: _"How much of my salary will I actually keep after paying tax and childcare?"_

This calculator is specifically designed for:

- Parents deciding whether to return to work
- Understanding effective hourly rates after childcare costs
- Comparing full-time vs part-time vs not working scenarios
- Navigating Ireland's complex childcare subsidy system (NCS & ECCE)
- Making informed decisions about career and family planning

---

## What the Calculator Measures

### Primary Outputs

1. **Amount Left Per Month (€)**: The actual money you take home after:
   - Income tax
   - USC (Universal Social Charge)
   - PRSI (Pay Related Social Insurance)
   - Out-of-pocket childcare costs (after subsidies)

2. **Percentage of Net Pay Retained**: What percentage of your after-tax salary you keep after childcare costs

3. **Effective Hourly Rate (€)**: Your true hourly wage when childcare costs are factored in
   - Calculated as: (Amount Left) / (Hours Worked per Month)
   - Often dramatically lower than nominal hourly rate

4. **Retention Strength**: A qualitative assessment of financial viability
   - **Strong** (≥60% retained): Financially sustainable
   - **Moderate** (40-59% retained): Marginal financial benefit
   - **Weak** (<40% retained): Financially challenging

### Visual Breakdown

The calculator shows a stacked bar chart dividing gross income into:

- **Childcare costs** (out-of-pocket after subsidies)
- **Tax & deductions** (income tax + USC + PRSI)
- **Take-home pay** (what you actually keep)

---

## Calculation Logic (2025 Irish Tax System)

### 1. Income Tax Calculation

Ireland uses a progressive tax system with two rates: **20%** (standard rate) and **40%** (higher rate).

#### Standard Rate Cutoff (2025)

- **Single**: €44,000
- **Married, one income**: €53,000
- **Married, two incomes**: €88,000

#### Tax Credits (2025)

- **Single**: €4,000 per year
- **Married**: €8,000 per year (combined)

#### Calculation Formula

**Single Example (€55,000 gross):**

```
Income up to €44,000:  €44,000 × 20% = €8,800
Income above €44,000:  €11,000 × 40% = €4,400
Total tax before credits:             = €13,200
Minus tax credits:                     - €4,000
Final income tax:                      = €9,200
```

**Married Two Incomes Example (Person: €55,000 + Partner: €45,000):**

```
Combined gross:        €55,000 + €45,000 = €100,000
Income up to €88,000:  €88,000 × 20%     = €17,600
Income above €88,000:  €12,000 × 40%     = €4,800
Total tax before credits:                = €22,400
Minus tax credits:                       - €8,000
Final income tax:                        = €14,400
```

### 2. USC (Universal Social Charge) Calculation

USC is a tiered progressive charge on gross income.

#### USC Bands (2025)

| Income Band       | Rate |
| ----------------- | ---- |
| €0 - €12,012      | 0.5% |
| €12,013 - €27,382 | 2.0% |
| €27,383 - €70,044 | 3.5% |
| €70,045+          | 8.0% |

#### Calculation Method

USC is calculated cumulatively across bands.

**Example (€55,000 gross):**

```
First €12,012:   €12,012 × 0.5%  = €60.06
Next €15,370:    €15,370 × 2.0%  = €307.40
Next €27,618:    €27,618 × 3.5%  = €966.63
Total USC:                        = €1,334.09
```

**For married couples with two incomes:** USC is calculated **separately** for each person (not combined).

### 3. PRSI (Pay Related Social Insurance)

PRSI is a flat rate applied to gross income.

- **Rate**: 4.125% of gross income
- Applied to total household income if married with two earners

**Example (€55,000 gross):**

```
€55,000 × 4.125% = €2,268.75
```

### 4. Net Income Summary

```
Gross Annual Income:                 €55,000
- Income Tax:                        - €9,200
- USC:                               - €1,334
- PRSI:                              - €2,269
─────────────────────────────────────────────
Net Annual Income:                   €42,197
Net Monthly Income:                  €3,516
```

---

## Childcare Subsidy System

Ireland has two main childcare support schemes:

### 1. National Childcare Scheme (NCS)

**Eligibility**: Only for **registered childcare providers** (crèches, registered childminders)

**NOT eligible**: Unregistered childminders, nannies, au pairs, family members

#### NCS Subsidy Rates (Income-Based)

The NCS provides an hourly subsidy that **tapers** based on household net income:

| Net Annual Income | Hourly Subsidy          |
| ----------------- | ----------------------- |
| Under €26,600     | €3.75/hour (maximum)    |
| €26,600 - €60,000 | €3.75 → €2.14 (tapered) |
| €60,000+          | €2.14/hour (universal)  |

#### Taper Calculation

For incomes between €26,600 and €60,000:

```
Range = €60,000 - €26,600 = €33,400
Position = (Net Income - €26,600)
Percentage through range = Position / Range
Hourly Rate = €3.75 - ((€3.75 - €2.14) × Percentage)
```

**Example (Net Income €42,000):**

```
Position = €42,000 - €26,600 = €15,400
Percentage = €15,400 / €33,400 = 46.1%
Hourly Rate = €3.75 - (€1.61 × 0.461) = €3.01/hour
```

#### NCS Hours Limit

- **Maximum subsidized hours**: 45 hours/week
- If you work 50 hours/week, only 45 hours get subsidy

#### Monthly NCS Subsidy

```
Weekly subsidy = Hourly Rate × Hours (max 45)
Monthly subsidy = Weekly subsidy × 4.33 (weeks/month average)
```

**Example (€2.14/hour × 45 hours/week):**

```
€2.14 × 45 = €96.30/week
€96.30 × 4.33 = €417/month per child
```

### 2. ECCE (Early Childhood Care & Education)

**Purpose**: Free preschool program

**Eligibility**: Children aged **2 years 8 months to 5 years 6 months** (approximately age 3+)

**Benefit**: 15 hours/week free preschool care during school term

#### ECCE Calculation

```
Weekly hours: 15 hours
Annual weeks: 38 weeks (school term only)
Estimated hourly rate: €7/hour
Annual saving: 15 × 38 × €7 = €3,990
Monthly saving (averaged): €3,990 / 12 = €333/month per child
```

**Note**: The calculator averages ECCE savings over 12 months for easier budgeting.

---

## Childcare Type Logic

The calculator applies different subsidy rules based on childcare type:

### Registered Childcare (Crèche/Registered Childminder)

✅ **Receives NCS subsidy**  
✅ **Receives ECCE** (if age-eligible)

```
Monthly Cost = Base Cost - NCS Subsidy - ECCE Saving
```

**Example (1 child, 3 years old, €1,200/month base cost, €417 NCS, €333 ECCE):**

```
€1,200 - €417 - €333 = €450 out-of-pocket
```

### Unregistered Childcare (Unregistered Childminder)

❌ **No NCS subsidy**  
✅ **Receives ECCE** (if age-eligible and using registered preschool separately)

```
Monthly Cost = Base Cost - ECCE Saving
```

**Example (1 child, 3 years old, €1,000/month base cost, €333 ECCE):**

```
€1,000 - €333 = €667 out-of-pocket
```

### Nanny (Home Care)

❌ **No NCS subsidy**  
❌ **No ECCE**

```
Monthly Cost = Base Cost (no subsidies)
```

**Example (1 child, €1,800/month base cost):**

```
€1,800 out-of-pocket (full cost)
```

---

## Multiple Children

All subsidies are **multiplied by the number of children**:

```
Total NCS = (NCS per child) × Number of children
Total ECCE = (ECCE per child) × Number of children
Total Cost = (Base cost per child × Number of children) - Total NCS - Total ECCE
```

**Example (2 children, both age 3+, registered care):**

```
Base cost:     €1,200/month × 2 = €2,400
NCS subsidy:   €417 × 2 = €834
ECCE saving:   €333 × 2 = €666
Out-of-pocket: €2,400 - €834 - €666 = €900
```

---

## Scenario Comparison

The calculator allows comparison of three work scenarios:

### Full-Time (100% work)

- **Salary**: Full gross salary
- **Hours**: Full hours/week
- **Childcare**: Full childcare costs
- **Subsidies**: Full NCS + ECCE

### Part-Time (60% work / 3 days per week)

- **Salary**: 60% of gross salary
- **Hours**: 60% of hours/week
- **Childcare**: 60% of childcare costs (reduced hours)
- **Subsidies**: Adjusted NCS (based on lower income + lower hours) + ECCE

**Note**: Tax bands change with lower income, so net percentage may be higher

### Not Working (0% work)

- **Salary**: €0
- **Hours**: 0
- **Childcare**: €0 (no childcare needed)
- **Amount Left**: €0

---

## Key Formulas Summary

### 1. Final Monthly Take-Home

```
Amount Left = Net Monthly Income - Out-of-Pocket Childcare Cost
```

### 2. Percentage of Net Pay Retained

```
Percentage Kept = (Amount Left / Net Monthly Income) × 100
```

### 3. Effective Hourly Rate

```
Hours per Month = Hours per Week × 4.33
Hourly Value = Amount Left / Hours per Month
```

### 4. Visual Bar Chart Percentages

```
Take-home % = (Amount Left / Gross Monthly) × 100
Childcare % = (Out-of-Pocket / Gross Monthly) × 100
Tax % = 100 - Take-home % - Childcare %
```

---

## Important Assumptions

1. **Tax Year**: 2025 Irish tax rates and bands
2. **Location**: Dublin (for childcare cost context)
3. **Weeks per month**: 4.33 (52 weeks / 12 months)
4. **ECCE hourly rate estimate**: €7/hour
5. **NCS hours cap**: 45 hours/week maximum
6. **ECCE duration**: 38 weeks/year (school term)
7. **Marital tax**: Married couples can choose joint or separate assessment; calculator assumes joint
8. **PRSI**: Standard employee rate of 4.125%

---

## Critical Calculator Fix History

### Bug Fix: Nanny NCS Subsidy (March 2025)

**Issue**: Nanny care was incorrectly receiving NCS subsidy  
**Fix**: Added explicit check that nanny care receives NO subsidies  
**Impact**: Nanny care now correctly shows full out-of-pocket cost

### Bug Fix: Multi-line Dynamic Import (March 2025)

**Issue**: Ternary expression in dynamic import causing syntax errors  
**Fix**: Corrected TypeScript syntax for conditional rendering  
**Impact**: Calculator displays context-aware cost ranges correctly

---

## Data Privacy

The calculator operates **entirely in the browser** with no data storage by default. Users can optionally contribute anonymized responses to the MomOps research dataset via:

- GDPR-compliant consent flow
- Anonymized bands (salary bands, cost bands) instead of exact values
- No personally identifiable information collected

---

## Related Resources

- **Irish Tax System**: [Revenue.ie](https://www.revenue.ie)
- **National Childcare Scheme**: [NCS.gov.ie](https://www.ncs.gov.ie)
- **ECCE Program**: [First5.gov.ie](https://www.first5.gov.ie)
- **MomOps Research**: [MomOps.org](https://momops.org)

---

_Last Updated: March 2026_  
_Calculator Version: 2.0_  
_Tax Year: 2025_