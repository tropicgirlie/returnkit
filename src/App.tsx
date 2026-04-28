import { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2, Mail, Settings, Menu, X, Share2, Info, Briefcase, Clock, Baby, Star, Heart } from 'lucide-react';
import { CopyButton } from './components/CopyButton';
import { loadCreches, saveCreches } from './components/CrecheMap';
import { AdminPanel, type CrecheEntry } from './components/AdminPanel';
import { MaternityExplainerModal } from './components/MaternityExplainerModal';
import { ResearchContribution } from './components/ResearchContribution';
import { DataPartnersModal } from './components/DataPartnersModal';
import heroImage from 'figma:asset/4245d1eebb3ccdc1cc917aafeef7ba6e41981f4e.png';
import manifestoImage from 'figma:asset/0295926140d4bd7df6ef13dd691844127b299fbf.png';
import logoImage from 'figma:asset/b79a2440b820226820205d8f1d771dd38cb5472f.png';
import { TransparentLogo } from './components/TransparentLogo';

const BabyBottle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v4" /><path d="M14 2v4" />
    <rect x="8" y="6" width="8" height="4" rx="1" />
    <path d="M8 10l-1 10a2 2 0 002 2h6a2 2 0 002-2l-1-10" />
    <path d="M8 14h8" />
  </svg>
);

type ChildcareType = 'registered' | 'unregistered' | 'nanny';
type MaritalStatus = 'single' | 'married_one' | 'married_two';
type WorkScenario = 'fulltime' | 'parttime' | 'notworking';
type ChildAge = 'infant' | 'toddler' | 'preschool' | 'school';

export default function App() {
  // State
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');
  const [grossSalary, setGrossSalary] = useState(55000);
  const [partnerSalary, setPartnerSalary] = useState(45000);
  const [numChildren, setNumChildren] = useState(1);
  const [childAge, setChildAge] = useState<ChildAge>('toddler');
  const [pension, setPension] = useState(0);
  const [childcareType, setChildcareType] = useState<ChildcareType>('registered');
  const [hoursPerWeek, setHoursPerWeek] = useState(45);
  const [monthlyCost, setMonthlyCost] = useState(1200);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMaternityModal, setShowMaternityModal] = useState(false);
  const [showScenarioComparison, setShowScenarioComparison] = useState(false);
  
  // Checklist state with localStorage
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('returnkit-checklist');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Crèche state (lifted up so footer admin can access)
  const [creches, setCreches] = useState<CrecheEntry[]>(loadCreches);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDataPartners, setShowDataPartners] = useState(false);

  useEffect(() => {
    saveCreches(creches);
  }, [creches]);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => { if (mobileMenuOpen) setMobileMenuOpen(false); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleAddCreche = (data: Omit<CrecheEntry, 'id' | 'addedDate' | 'lastUpdated'>) => {
    const now = new Date().toISOString().slice(0, 10);
    setCreches((prev) => [{ ...data, id: `c-${Date.now()}`, addedDate: now, lastUpdated: now }, ...prev]);
  };

  const handleDeleteCreche = (id: string) => {
    setCreches((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCreche = (id: string, updates: Partial<CrecheEntry>) => {
    const now = new Date().toISOString().slice(0, 10);
    setCreches((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, lastUpdated: now } : c)));
  };

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Toggle checklist item
  const toggleCheckItem = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('returnkit-checklist', JSON.stringify(updated));
    }
  };

  // Number input helpers - strips commas before parsing
  const parseNumberInput = (value: string): number => {
    const cleaned = value.replace(/,/g, '');
    return Number(cleaned) || 0;
  };

  const formatNumberWithCommas = (value: number): string => {
    return value.toLocaleString('en-IE');
  };

  // ── Per-person tax helper (Revenue 2025) ─────────────────────────────────────
  // Tax credits: Personal €1,875 + Employee (PAYE) €2,000 = €3,875 per PAYE worker
  // Married one income: 2× personal + 1× PAYE = €5,750
  function calcPersonTax(income: number, isMarriedOneIncome = false) {
    const cutoff  = isMarriedOneIncome ? 53000 : 44000;
    const credits = isMarriedOneIncome ? 5750  : 3875;   // 2025 correct figures
    const grossTax = income <= cutoff
      ? income * 0.20
      : cutoff * 0.20 + (income - cutoff) * 0.40;
    const incomeTax = Math.max(0, grossTax - credits);

    // USC 2025 bands (progressive per person)
    let usc = 0, rem = income, prev = 0;
    for (const [lim, rate] of [[12012, 0.005], [27382, 0.02], [70044, 0.035], [Infinity, 0.08]] as [number, number][]) {
      const t = Math.min(rem, lim - prev);
      if (t <= 0) break;
      usc += t * rate;
      prev = lim; rem -= t;
    }

    const prsi = income * 0.04125;
    return { incomeTax, usc, prsi, annualNet: income - incomeTax - usc - prsi };
  }

  // ── ACCURATE 2025 IRISH TAX CALCULATION ──────────────────────────────────────
  function calculateNetIncome(gross: number, marital: MaritalStatus, partnerGross?: number) {
    if (marital === 'married_two' && partnerGross) {
      // Each spouse assessed individually (more accurate than combined gross method)
      const user    = calcPersonTax(gross);
      const partner = calcPersonTax(partnerGross);
      const totalGross = gross + partnerGross;
      const totalDeductions = user.incomeTax + user.usc + user.prsi
                            + partner.incomeTax + partner.usc + partner.prsi;
      const netAnnual = totalGross - totalDeductions;
      return {
        grossAnnual: totalGross,
        grossMonthly: Math.round(totalGross / 12),
        incomeTax: Math.round(user.incomeTax + partner.incomeTax),
        usc: Math.round(user.usc + partner.usc),
        prsi: Math.round(user.prsi + partner.prsi),
        totalDeductions: Math.round(totalDeductions),
        netAnnual: Math.round(netAnnual),
        netMonthly: Math.round(netAnnual / 12),
        userNetAnnual: Math.round(user.annualNet),   // for METR (user's own net)
      };
    }

    const p = calcPersonTax(gross, marital === 'married_one');
    return {
      grossAnnual: gross,
      grossMonthly: Math.round(gross / 12),
      incomeTax: Math.round(p.incomeTax),
      usc: Math.round(p.usc),
      prsi: Math.round(p.prsi),
      totalDeductions: Math.round(p.incomeTax + p.usc + p.prsi),
      netAnnual: Math.round(p.annualNet),
      netMonthly: Math.round(p.annualNet / 12),
      userNetAnnual: Math.round(p.annualNet),
    };
  }

  // ── NCS Subsidy Calculation (NCS.gov.ie rates, September 2024) ───────────────
  // Age-banded max rates; universal floor €2.14/hr; multi-child income discount
  const NCS_MAX_RATES: Record<ChildAge, number> = {
    infant:    5.10,   // under 12 months
    toddler:   4.35,   // 12–35 months
    preschool: 3.95,   // 3–5 years
    school:    3.75,   // 5–15 years
  };

  function calculateNCSSubsidy(reckonableIncome: number, childAge: ChildAge, hoursPerWeek: number, numChildren: number) {
    const maxRate       = NCS_MAX_RATES[childAge];
    const universalRate = 2.14;
    const hrs = Math.min(hoursPerWeek, 45);

    // Multiple child discount reduces reckonable income threshold
    const discount = numChildren === 2 ? 4300 : numChildren >= 3 ? 8600 : 0;
    const adjustedIncome = Math.max(0, reckonableIncome - discount);

    let hourlyRate: number;
    if (adjustedIncome < 26000) {
      hourlyRate = maxRate;
    } else if (adjustedIncome >= 60000) {
      hourlyRate = universalRate;
    } else {
      const position = (adjustedIncome - 26000) / (60000 - 26000);
      hourlyRate = maxRate - position * (maxRate - universalRate);
    }

    const monthlySubsidy = Math.round(hourlyRate * hrs * 4.33);
    return {
      hourlyRate: hourlyRate.toFixed(2),
      monthlySubsidy,
      adjustedReckonableIncome: Math.round(adjustedIncome),
    };
  }

  // ── ECCE (Free preschool — children aged ~2y8m to 5y6m, "preschool" band) ────
  function calculateECCE(childAge: ChildAge) {
    const eligible = childAge === 'preschool';
    const weeklyHoursFree = eligible ? 15 : 0;
    // 38 school weeks/year, avg crèche rate ~€7/hr
    const annualSaving = weeklyHoursFree * 38 * 7;
    const monthlySaving = Math.round(annualSaving / 12);
    return { eligible, weeklyHoursFree, monthlySaving };
  }

  // ── METR: Marginal Effective Tax Rate ─────────────────────────────────────────
  // % of an extra €1,000 gross lost to income tax + NCS subsidy withdrawal
  function calculateMETR(gross: number, marital: MaritalStatus, reckonableIncome: number, childAge: ChildAge, hoursPerWeek: number, numChildren: number): number {
    const delta = 1000;
    const baseNet = calcPersonTax(gross, marital === 'married_one').annualNet;
    const newNet  = calcPersonTax(gross + delta, marital === 'married_one').annualNet;
    const netGain = newNet - baseNet;

    const baseSub = calculateNCSSubsidy(reckonableIncome, childAge, hoursPerWeek, numChildren).monthlySubsidy * 12;
    const newSub  = calculateNCSSubsidy(reckonableIncome + netGain, childAge, hoursPerWeek, numChildren).monthlySubsidy * 12;
    const subsidyLoss = Math.max(0, baseSub - newSub);

    const totalLost = (delta - netGain) + subsidyLoss;
    return Math.min(99, Math.max(0, Math.round((totalLost / delta) * 100)));
  }

  // Calculate results
  const taxResult = calculateNetIncome(
    grossSalary, 
    maritalStatus, 
    maritalStatus === 'married_two' ? partnerSalary : undefined
  );

  // Reckonable income for NCS = combined family net after tax/USC/PRSI (before pension)
  const reckonableIncome = taxResult.netAnnual;

  const subsidy = calculateNCSSubsidy(reckonableIncome, childAge, hoursPerWeek, numChildren);
  const ecce = calculateECCE(childAge);

  // Pension reduces take-home but not NCS reckonable income
  const displayNetMonthly = taxResult.netMonthly - pension;

  // Childcare calculations
  let childcareCostMonthly = monthlyCost * numChildren;
  let subsidyAmount = 0;
  let ecceSaving = 0;
  let outOfPocketMonthly = childcareCostMonthly;

  if (childcareType === 'registered') {
    // Registered childcare: NCS subsidy capped at actual cost + ECCE
    subsidyAmount = Math.min(subsidy.monthlySubsidy * numChildren, childcareCostMonthly);
    ecceSaving = ecce.monthlySaving * numChildren;
    outOfPocketMonthly = Math.max(0, childcareCostMonthly - subsidyAmount - ecceSaving);
  } else if (childcareType === 'unregistered') {
    // Unregistered: no NCS, but ECCE may apply via separate registered preschool
    ecceSaving = ecce.monthlySaving * numChildren;
    outOfPocketMonthly = Math.max(0, childcareCostMonthly - ecceSaving);
  } else {
    // Nanny: NO NCS, NO ECCE
    outOfPocketMonthly = childcareCostMonthly;
  }

  // Final calculation (pension already deducted from displayNetMonthly)
  const amountLeft = displayNetMonthly - outOfPocketMonthly;
  const percentageKept = displayNetMonthly > 0 ? Math.round((amountLeft / displayNetMonthly) * 100) : 0;

  // METR — only meaningful for registered NCS-eligible childcare
  const metr = childcareType === 'registered'
    ? calculateMETR(grossSalary, maritalStatus, reckonableIncome, childAge, hoursPerWeek, numChildren)
    : null;
  
  // Calculate percentages for bar chart
  const takeHomePercent = displayNetMonthly > 0 ? Math.round((amountLeft / displayNetMonthly) * 100) : 0;
  const childcarePercent = displayNetMonthly > 0 ? Math.round((outOfPocketMonthly / displayNetMonthly) * 100) : 0;
  const taxPercent = Math.max(0, 100 - takeHomePercent - childcarePercent);

  // Hourly value
  const hourlyValue = hoursPerWeek > 0 ? (amountLeft / (hoursPerWeek * 4.33)).toFixed(2) : '0.00';
  const hourlyValueNum = parseFloat(hourlyValue);

  // Retention strength
  const retentionStrength = percentageKept >= 60 ? 'Strong' : percentageKept >= 40 ? 'Moderate' : 'Weak';
  const retentionColor = percentageKept >= 60 ? '#4E8C6A' : percentageKept >= 40 ? '#2563EB' : '#B05555';
  const retentionBg = percentageKept >= 60 ? '#E2F0EA' : percentageKept >= 40 ? '#DBEAFE' : '#F5E5E5';

  // Calculate shortage cost for unsubsidized care
  const registeredCost = childcareCostMonthly - (subsidy.monthlySubsidy * numChildren);
  const shortageCost = outOfPocketMonthly - registeredCost;

  // Scenario comparison calculations
  function calculateScenario(scenario: WorkScenario) {
    if (scenario === 'notworking') {
      return {
        label: 'Not returning',
        grossMonthly: 0,
        netMonthly: 0,
        childcareCost: 0,
        amountLeft: 0,
        hourlyValue: '0.00',
        description: 'Stay home, no income, no childcare costs'
      };
    }
    
    const hours = scenario === 'parttime' ? Math.round(hoursPerWeek * 0.6) : hoursPerWeek;
    const salaryMultiplier = scenario === 'parttime' ? 0.6 : 1;
    const adjustedGross = Math.round(grossSalary * salaryMultiplier);
    
    const tax = calculateNetIncome(adjustedGross, maritalStatus, maritalStatus === 'married_two' ? partnerSalary : undefined);
    const ncs = calculateNCSSubsidy(tax.netAnnual, childAge, hours, numChildren);
    
    const adjustedMonthlyCost = scenario === 'parttime' 
      ? Math.round(monthlyCost * 0.6) * numChildren 
      : monthlyCost * numChildren;
    
    let adjustedSubsidy = 0;
    let adjustedEcce = 0;
    let adjustedOutOfPocket = adjustedMonthlyCost;
    
    if (childcareType === 'registered') {
      adjustedSubsidy = ncs.monthlySubsidy * numChildren;
      adjustedEcce = ecce.monthlySaving * numChildren;
      adjustedOutOfPocket = Math.max(0, adjustedMonthlyCost - adjustedSubsidy - adjustedEcce);
    } else if (childcareType === 'unregistered') {
      adjustedEcce = ecce.monthlySaving * numChildren;
      adjustedOutOfPocket = Math.max(0, adjustedMonthlyCost - adjustedEcce);
    }
    
    const left = tax.netMonthly - adjustedOutOfPocket;
    const hrly = hours > 0 ? (left / (hours * 4.33)).toFixed(2) : '0.00';
    
    return {
      label: scenario === 'fulltime' ? 'Full-time' : 'Part-time (3 days)',
      grossMonthly: tax.grossMonthly,
      netMonthly: tax.netMonthly,
      childcareCost: adjustedOutOfPocket,
      amountLeft: left,
      hourlyValue: hrly,
      description: scenario === 'fulltime' 
        ? `${hoursPerWeek}hrs/week, full childcare costs`
        : `~${hours}hrs/week, reduced childcare costs`
    };
  }

  const scenarios = {
    fulltime: calculateScenario('fulltime'),
    parttime: calculateScenario('parttime'),
    notworking: calculateScenario('notworking'),
  };

  // Share result
  const shareResult = () => {
    const text = `ReturnKit: The Real Cost of Returning to Work. After tax & childcare in Dublin, I'd keep €${amountLeft.toLocaleString()}/month (${percentageKept}% of net pay). My effective hourly rate drops to €${hourlyValue}/hr. https://returnkit.ie`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text);
        showToast('Result copied to clipboard');
      });
    } else {
      navigator.clipboard.writeText(text);
      showToast('Result copied to clipboard');
    }
  };

  // Email templates
  const waitlistEmail = `Subject: Waiting List Registration Request

Dear [Crèche Name],

I am writing to register my child for your waiting list.

Child's name: [Child's name]
Date of birth: [DOB]
Anticipated start date: [Date]
Required days: Monday to Friday
Required hours: Full-time (8:00-18:00)

I would appreciate confirmation of this registration and an estimate of current waiting times.

Thank you,
[Your name]
[Your phone]
[Your email]`;

  const subsidyEmail = `Subject: NCS Subsidy Information Request

Dear [Crèche Name],

I am currently on your waiting list for [anticipated start date] and would like to confirm your participation in the National Childcare Scheme.

Could you please confirm:
- You are a registered NCS provider
- The process for applying for subsidy through your crèche
- Any additional paperwork required

Thank you,
[Your name]`;

  const followUpEmail = `Subject: Waiting List Status Update Request

Dear [Crèche Name],

I registered for your waiting list on [date] for a start date of [anticipated date].

Could you please provide an update on:
- Current position on waiting list
- Estimated waiting time
- Likelihood of a place by [date]

This information will help me make alternative arrangements if needed.

Thank you,
[Your name]`;

  const navLinks = [
    { href: '#calculator', label: 'Calculator' },
    { href: '#actions', label: 'Actions' },
    { href: '#emails', label: 'Emails' },
    { href: '#map', label: 'Crèches' },
    { href: '#links', label: 'Links' },
    { href: '#manifesto', label: 'Manifesto' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      {/* Skip Links */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#111827] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F9F7F4]/95 backdrop-blur-sm border-b border-[#E2DDD7]">
        <div className="max-w-[760px] mx-auto px-5 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <TransparentLogo src={logoImage} alt="ReturnKit" className="h-9 w-auto" />
            <span className="text-[15px] font-bold text-[#0D1F2D] tracking-tight">ReturnKit</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-[#6B6560] hover:text-[#0D1F2D] transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors text-[#64748B]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] bg-white">
            <nav className="max-w-[760px] mx-auto px-5 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="main-content">
      {/* Hero Section */}
      <section className="bg-[#0D1F2D] border-b border-[#1a3248]">
        <div className="max-w-[760px] mx-auto px-5 pt-14 sm:pt-20 pb-0">
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-14 items-end">

            {/* Left — text */}
            <div className="sm:w-[56%] flex flex-col pb-14 sm:pb-20">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#B85A82]"></span>
                <span className="text-xs font-semibold text-[#B85A82] uppercase tracking-widest">Ireland 2025</span>
              </div>
              <h1 className="text-white mb-5">
                The real cost of returning to work
              </h1>
              <p className="text-[#8FA8C0] text-[15px] leading-relaxed mb-8" style={{maxWidth: '36ch'}}>
                See exactly what you keep after tax and childcare. Irish NCS subsidies, ECCE, and METR — all calculated instantly.
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                <a
                  href="#calculator"
                  className="inline-flex items-center px-6 py-3 bg-[#B85A82] text-white rounded-lg hover:bg-[#A04E72] transition-colors text-sm font-semibold"
                >
                  Open Calculator
                </a>
                <button
                  type="button"
                  onClick={() => setShowMaternityModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-[#8FA8C0] border border-[#243d56] rounded-lg hover:border-[#B85A82] hover:text-white transition-colors text-sm"
                >
                  <Info className="w-4 h-4" />
                  How maternity leave works
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-stretch divide-x divide-[#1a3248]">
                <div className="pr-6">
                  <div className="text-[26px] font-bold text-white tabular-nums" style={{fontFamily: "'DM Serif Display', Georgia, serif"}}>40–70%</div>
                  <p className="text-xs text-[#4B6888] mt-1">of take-home lost to childcare</p>
                </div>
                <div className="px-6">
                  <div className="text-[26px] font-bold text-white tabular-nums" style={{fontFamily: "'DM Serif Display', Georgia, serif"}}>2–3 yrs</div>
                  <p className="text-xs text-[#4B6888] mt-1">typical crèche waiting list</p>
                </div>
                <div className="pl-6">
                  <div className="text-[26px] font-bold text-white tabular-nums" style={{fontFamily: "'DM Serif Display', Georgia, serif"}}>Free</div>
                  <p className="text-xs text-[#4B6888] mt-1">no login, no data sold</p>
                </div>
              </div>
            </div>

            {/* Right — photo, flush to bottom */}
            <div className="sm:w-[44%] w-full">
              <div
                id="hero-photo"
                className="w-full h-[240px] sm:h-[380px] rounded-t-xl overflow-hidden"
              >
                <img src={heroImage} alt="Parents reviewing childcare costs at kitchen table" className="w-full h-full object-cover object-top" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="bg-[#F9F7F4] border-b border-[#E2DDD7]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">

          <div className="flex items-center gap-3 mb-7">
            <span className="w-1 h-6 rounded-full bg-[#B85A82]"></span>
            <h2 className="text-[#0D1F2D]">Your numbers</h2>
          </div>

          <div className="space-y-4">
            {/* Income Card */}
            <div className="p-5 sm:p-6 bg-white border border-[#E2DDD7] rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#111827]">Your Income</h3>
                <button
                  type="button"
                  onClick={() => {
                    setMaritalStatus('single');
                    setGrossSalary(55000);
                    setPartnerSalary(45000);
                    setNumChildren(1);
                    setChildAge('toddler');
                    setPension(0);
                    setChildcareType('registered');
                    setHoursPerWeek(45);
                    setMonthlyCost(1200);
                  }}
                  className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors px-2 py-1 rounded-md hover:bg-[#F3F4F6]"
                >
                  Reset
                </button>
              </div>
              
              {/* Marital Status Pills */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                  Household
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'single', label: 'Single' },
                    { value: 'married_one', label: 'Married (one income)' },
                    { value: 'married_two', label: 'Married (two incomes)' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMaritalStatus(option.value as MaritalStatus)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        maritalStatus === option.value
                          ? 'bg-[#111827] text-white'
                          : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Inputs */}
              <div className={`grid ${maritalStatus === 'married_two' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                <div>
                  <label htmlFor="gross-salary" className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                    {maritalStatus === 'married_two' ? 'Your Gross' : 'Gross Salary'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">€</span>
                    <input
                      id="gross-salary"
                      type="text"
                      inputMode="numeric"
                      value={formatNumberWithCommas(grossSalary)}
                      onChange={(e) => setGrossSalary(parseNumberInput(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      className="w-full h-11 pl-7 pr-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      placeholder="55,000"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#9CA3AF]">Annual</p>
                </div>

                {maritalStatus === 'married_two' && (
                  <div>
                    <label htmlFor="partner-salary" className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                      Partner's Gross
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">€</span>
                      <input
                        id="partner-salary"
                        type="text"
                        inputMode="numeric"
                        value={formatNumberWithCommas(partnerSalary)}
                        onChange={(e) => setPartnerSalary(parseNumberInput(e.target.value))}
                        onFocus={(e) => e.target.select()}
                        className="w-full h-11 pl-7 pr-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                        placeholder="45,000"
                      />
                    </div>
                    <p className="mt-1 text-xs text-[#9CA3AF]">Annual</p>
                  </div>
                )}

              {/* Pension */}
              <div className="mt-4">
                <label htmlFor="pension" className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                  Monthly Pension <span className="text-[#9CA3AF] normal-case tracking-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">€</span>
                  <input
                    id="pension"
                    type="text"
                    inputMode="numeric"
                    value={pension === 0 ? '' : formatNumberWithCommas(pension)}
                    onChange={(e) => setPension(parseNumberInput(e.target.value))}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-11 pl-7 pr-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <p className="mt-1 text-xs text-[#9CA3AF]">Reduces take-home; doesn't affect NCS reckonable income</p>
              </div>
              </div>
            </div>

            {/* Childcare Card */}
            <div className="p-5 sm:p-6 bg-white border border-[#E2DDD7] rounded-2xl shadow-sm">
              <h3 className="font-semibold text-[#111827] mb-4">Childcare Setup</h3>
              
              {/* Children & Age */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="num-children" className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                    Children
                  </label>
                  <input
                    id="num-children"
                    type="number"
                    min="1"
                    max="5"
                    value={numChildren}
                    onChange={(e) => setNumChildren(Math.max(1, Number(e.target.value) || 1))}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="child-age" className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                    Youngest Age
                  </label>
                  <select
                    id="child-age"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value as ChildAge)}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="infant">Under 12 months</option>
                    <option value="toddler">12–35 months</option>
                    <option value="preschool">3–5 yrs (ECCE eligible)</option>
                    <option value="school">5–15 yrs (school age)</option>
                  </select>
                </div>
              </div>

              {/* Childcare Type - Horizontal Grid */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                  Provider Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'registered', label: 'Registered', icon: '✓' },
                    { value: 'unregistered', label: 'Unregistered', icon: '?' },
                    { value: 'nanny', label: 'Nanny', icon: '×' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setChildcareType(option.value as ChildcareType)}
                      className={`px-3 py-3 rounded-lg border-2 text-sm transition-all ${
                        childcareType === option.value
                          ? 'bg-[#111827] border-[#111827] text-white'
                          : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{option.icon}</div>
                        <div className="text-xs">{option.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours & Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hours-week" className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                    Hours/Week
                  </label>
                  <input
                    id="hours-week"
                    type="number"
                    value={hoursPerWeek}
                    min={1}
                    max={80}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="45"
                  />
                  {hoursPerWeek > 45 && (
                    <p className="mt-1 text-xs text-[#2563EB] font-medium">NCS max: 45hrs</p>
                  )}
                </div>

                <div>
                  <label htmlFor="monthly-cost" className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
                    Cost/Month
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">€</span>
                    <input
                      id="monthly-cost"
                      type="text"
                      inputMode="numeric"
                      value={formatNumberWithCommas(monthlyCost)}
                      onChange={(e) => setMonthlyCost(parseNumberInput(e.target.value))}
                      onFocus={(e) => e.target.select()}
                      className="w-full h-11 pl-7 pr-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      placeholder="1,200"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Per child • Typical: {childcareType === 'nanny' ? '€2,000-2,500' : childcareType === 'registered' ? '€1,000-1,400' : '€800-1,200'}
                  </p>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
              <div className="p-5 sm:p-6">
                {/* Summary Metrics — clean inline row */}
                <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] mb-5">
                  <div className="pr-5">
                    <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-1">Net monthly</div>
                    <div className="text-[26px] font-bold text-[#0F172A] tabular-nums leading-none">€{taxResult.netMonthly.toLocaleString()}</div>
                    <div className="text-xs text-[#94A3B8] mt-1">after tax</div>
                  </div>
                  <div className="px-5">
                    <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-1">
                      {childcareType === 'nanny' ? 'Nanny cost' : childcareType === 'unregistered' ? 'Childminder' : 'Childcare cost'}
                    </div>
                    <div className="text-[26px] font-bold text-[#B05555] tabular-nums leading-none">€{outOfPocketMonthly.toLocaleString()}</div>
                    <div className="text-xs text-[#94A3B8] mt-1">per month</div>
                  </div>
                  <div className="pl-5">
                    <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider mb-1">You keep</div>
                    <div className="text-[26px] font-bold tabular-nums leading-none" style={{ color: retentionColor }}>€{amountLeft.toLocaleString()}</div>
                    <div className="text-xs text-[#94A3B8] mt-1">after childcare</div>
                  </div>
                </div>

                {/* Where your net pay goes */}
                <div className="bg-white rounded-xl border-[0.5px] border-[#E0E0E0] p-5 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[13px] text-[#6B6B6B]">Where your net pay goes</div>
                    <div 
                      className="px-3 py-1.5 text-[11px] font-semibold rounded-full"
                      style={{ 
                        color: percentageKept >= 60 ? '#3B6D11' : percentageKept >= 40 ? '#854F0B' : '#A32D2D',
                        backgroundColor: percentageKept >= 60 ? '#E8F5E1' : percentageKept >= 40 ? '#FAEEDA' : '#FCEBEB'
                      }}
                    >
                      {retentionStrength} — {percentageKept}% retained
                    </div>
                  </div>
                  
                  <div className="flex h-7 rounded-md overflow-hidden mb-2">
                    <div
                      className="bg-[#C07878] flex items-center justify-center text-white text-[11px] font-medium"
                      style={{ width: `${Math.round((outOfPocketMonthly / displayNetMonthly) * 100)}%` }}
                    >
                      {Math.round((outOfPocketMonthly / displayNetMonthly) * 100) > 15 && `${childcareType === 'nanny' ? 'Nanny' : 'Childcare'} ${Math.round((outOfPocketMonthly / displayNetMonthly) * 100)}%`}
                    </div>
                    <div
                      className="bg-[#5A8A5A] flex items-center justify-center text-white text-[11px] font-medium"
                      style={{ width: `${Math.round((amountLeft / displayNetMonthly) * 100)}%` }}
                    >
                      {Math.round((amountLeft / displayNetMonthly) * 100) > 15 && `Yours ${Math.round((amountLeft / displayNetMonthly) * 100)}%`}
                    </div>
                  </div>
                  
                  {childcareType === 'nanny' && (
                    <p className="text-xs text-[#6B6B6B]">
                      Nannies are ineligible for NCS — no subsidy regardless of registration
                    </p>
                  )}
                  {childcareType === 'unregistered' && (
                    <p className="text-xs text-[#6B6B6B]">
                      Unregistered childcare is ineligible for NCS subsidy
                    </p>
                  )}
                </div>

                {/* NCS Warning - moved here for prominence */}
                {(childcareType === 'unregistered' || childcareType === 'nanny') && (
                  <div className="p-4 bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl mb-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-[#DC2626] mb-1">
                          No NCS subsidy available
                        </div>
                        <div className="text-xs text-[#6B6B6B]">
                          {childcareType === 'nanny' 
                            ? "Nannies don't qualify for NCS regardless of registration. You're paying the full cost with no subsidy pathway." 
                            : "Unregistered providers don't qualify for NCS. You're paying the full cost. Consider registered alternatives."}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Monthly Flow */}
                <div className="bg-white rounded-xl border-[0.5px] border-[#E0E0E0] p-5 mb-3">
                  <h3 className="text-[13px] text-[#6B6B6B] mb-3">Monthly flow</h3>
                  <div className="space-y-0">
                    <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#E0E0E0]">
                      <span className="text-sm text-[#6B6B6B]">Gross salary (€{taxResult.grossAnnual.toLocaleString()}/yr)</span>
                      <span className="text-sm font-medium text-[#1A1A1A] tabular-nums">€{taxResult.grossMonthly.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#E0E0E0]">
                      <span className="text-sm text-[#6B6B6B]">Tax + USC + PRSI</span>
                      <span className="text-sm font-medium text-[#A32D2D] tabular-nums">−€{Math.round(taxResult.totalDeductions / 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#E0E0E0]">
                      <span className="text-sm text-[#6B6B6B]">Net take-home</span>
                      <span className="text-sm font-medium text-[#1A1A1A] tabular-nums">€{taxResult.netMonthly.toLocaleString()}</span>
                    </div>
                    {pension > 0 && (
                      <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#E0E0E0]">
                        <span className="text-sm text-[#6B6B6B]">Pension contribution</span>
                        <span className="text-sm font-medium text-[#A32D2D] tabular-nums">−€{pension.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#E0E0E0]">
                      <span className="text-sm text-[#6B6B6B]">
                        {childcareType === 'nanny' && 'Nanny — no NCS, no ECCE'}
                        {childcareType === 'unregistered' && 'Unregistered childcare — no NCS'}
                        {childcareType === 'registered' && subsidyAmount > 0 && `Childcare (after €${subsidyAmount} NCS${ecce.eligible ? ` + €${ecceSaving} ECCE` : ''})`}
                        {childcareType === 'registered' && subsidyAmount === 0 && 'Childcare'}
                      </span>
                      <span className="text-sm font-medium text-[#A32D2D] tabular-nums">−€{outOfPocketMonthly.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline py-2">
                      <span className="text-sm font-medium text-[#1A1A1A]">Remaining</span>
                      <span className="text-sm font-medium text-[#3B6D11] tabular-nums">€{amountLeft.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Effective Hourly Rate */}
                <div className="bg-white rounded-xl border-[0.5px] border-[#E0E0E0] p-5 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#6B6B6B]">Your effective hourly rate</span>
                    <div className="text-right">
                      <div className={`text-[22px] font-medium tabular-nums ${hourlyValueNum < 5 ? 'text-[#A32D2D]' : 'text-[#1A1A1A]'}`}>
                        €{hourlyValue}/hr
                      </div>
                      {hourlyValueNum < 5 && hourlyValueNum > 0 && (
                        <p className="text-xs text-[#A32D2D] mt-0.5">Below minimum wage</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* METR — Marginal Effective Tax Rate */}
                {metr !== null && (
                  <div className={`rounded-xl border p-5 mb-3 ${
                    metr >= 60 ? 'bg-[#FEF2F2] border-[#FEE2E2]' :
                    metr >= 45 ? 'bg-[#EFF6FF] border-[#BFDBFE]' :
                                 'bg-[#F0FDF4] border-[#BBF7D0]'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B] mb-1">
                          Marginal Effective Tax Rate
                        </div>
                        <div className={`text-[28px] font-semibold tabular-nums leading-none mb-2 ${
                          metr >= 60 ? 'text-[#A32D2D]' : metr >= 45 ? 'text-[#1D4ED8]' : 'text-[#2A6041]'
                        }`}>
                          {metr}%
                        </div>
                        <p className="text-xs text-[#6B6B6B] leading-relaxed">
                          {metr >= 60
                            ? `For every extra €1,000 earned, you keep only ~€${1000 - metr * 10} after income tax and NCS subsidy withdrawal. ESRI identifies this as a significant work disincentive.`
                            : metr >= 45
                            ? 'A substantial portion of any additional earnings is lost to combined taxation and reduced NCS subsidy.'
                            : 'Additional earnings translate reasonably well into take-home pay at your income level.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Waitlist Penalty (only for nanny) */}
                {childcareType === 'nanny' && (() => {
                  const dublinCrecheAvg = 1200;
                  const ncsSubsidy = subsidy.monthlySubsidy;
                  const ecceSavingAmount = ecce.eligible ? ecce.monthlySaving : 0;
                  const effectiveCrecheOut = dublinCrecheAvg - ncsSubsidy - ecceSavingAmount;
                  const waitlistPenaltyMonthly = outOfPocketMonthly - effectiveCrecheOut;
                  const waitlistPenaltyYearly = waitlistPenaltyMonthly * 12;
                  
                  return (
                    <div className="bg-[#FCEBEB] rounded-xl border-[0.5px] border-[#F09595] p-5 mb-3">
                      <h3 className="text-[13px] text-[#A32D2D] mb-3">The waitlist penalty</h3>
                      <div className="space-y-0">
                        <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#F09595]">
                          <span className="text-sm text-[#6B6B6B]">Dublin crèche average</span>
                          <span className="text-sm font-medium text-[#1A1A1A] tabular-nums">~€{dublinCrecheAvg.toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#F09595]">
                          <span className="text-sm text-[#6B6B6B]">NCS subsidy (€{subsidy.hourlyRate}/hr × 45h)</span>
                          <span className="text-sm font-medium text-[#3B6D11] tabular-nums">−€{ncsSubsidy.toLocaleString()}/mo</span>
                        </div>
                        {ecce.eligible && (
                          <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#F09595]">
                            <span className="text-sm text-[#6B6B6B]">ECCE free preschool saving</span>
                            <span className="text-sm font-medium text-[#3B6D11] tabular-nums">−€{ecceSavingAmount.toLocaleString()}/mo</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#F09595]">
                          <span className="text-sm text-[#6B6B6B]">Crèche out-of-pocket after NCS{ecce.eligible ? ' + ECCE' : ''}</span>
                          <span className="text-sm font-medium text-[#3B6D11] tabular-nums">~€{Math.round(effectiveCrecheOut).toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between items-baseline py-2 border-b-[0.5px] border-[#F09595]">
                          <span className="text-sm text-[#6B6B6B]">What you actually pay (nanny)</span>
                          <span className="text-sm font-medium text-[#A32D2D] tabular-nums">€{outOfPocketMonthly.toLocaleString()}/mo</span>
                        </div>
                        <div className="bg-[#F9D5D5] rounded-lg p-3 mt-2">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm font-medium text-[#A32D2D]">Waitlist penalty per month</span>
                            <span className="text-lg font-medium text-[#A32D2D] tabular-nums">€{Math.round(waitlistPenaltyMonthly).toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-[#A32D2D]">
                            €{Math.round(waitlistPenaltyYearly).toLocaleString()}/year — for being forced onto the nanny route
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Share & Compare buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={shareResult}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] text-white rounded-lg hover:bg-[#374151] transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Result
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowScenarioComparison(!showScenarioComparison)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm"
                  >
                    <Briefcase className="w-4 h-4" />
                    Compare Scenarios
                  </button>
                </div>

                {/* Breakdown Toggle */}
                <button
                  type="button"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full mb-4 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold flex items-center justify-center gap-1.5 py-2"
                >
                  {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showBreakdown ? 'Hide' : 'Show'} detailed tax breakdown
                </button>

                {showBreakdown && (
                  <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] text-sm space-y-2.5 mb-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#6B6560]">Gross salary</span>
                      <span className="font-semibold text-[#111827] tabular-nums">€{taxResult.grossMonthly.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs items-baseline">
                      <span className="text-[#9CA3AF]">- Income Tax</span>
                      <span className="text-[#9CA3AF] tabular-nums">€{Math.round(taxResult.incomeTax / 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs items-baseline">
                      <span className="text-[#9CA3AF]">- USC</span>
                      <span className="text-[#9CA3AF] tabular-nums">€{Math.round(taxResult.usc / 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs items-baseline">
                      <span className="text-[#9CA3AF]">- PRSI</span>
                      <span className="text-[#9CA3AF] tabular-nums">€{Math.round(taxResult.prsi / 12).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-[#E5E7EB] flex justify-between items-baseline">
                      <span className="text-[#6B6560]">Net salary</span>
                      <span className="font-semibold text-[#111827] tabular-nums">€{taxResult.netMonthly.toLocaleString()}</span>
                    </div>
                    {childcareType === 'registered' && subsidyAmount > 0 && (
                      <>
                        <div className="flex justify-between text-xs items-baseline">
                          <span className="text-[#9CA3AF]">- Childcare (gross)</span>
                          <span className="text-[#9CA3AF] tabular-nums">€{childcareCostMonthly.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs items-baseline">
                          <span className="text-[#10B981]">+ NCS subsidy</span>
                          <span className="text-[#10B981] tabular-nums">€{subsidyAmount.toLocaleString()}</span>
                        </div>
                        {ecce.eligible && (
                          <div className="flex justify-between text-xs items-baseline">
                            <span className="text-[#10B981]">+ ECCE (free preschool)</span>
                            <span className="text-[#10B981] tabular-nums">~€{ecceSaving.toLocaleString()}</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#DC2626]">- Childcare (net)</span>
                      <span className="font-semibold text-[#DC2626] tabular-nums">€{outOfPocketMonthly.toLocaleString()}</span>
                    </div>
                    <div className="pt-2.5 border-t-2 border-[#111827] flex justify-between items-baseline">
                      <span className="font-semibold text-[#111827]">What you keep</span>
                      <span className="font-black text-[#111827] tabular-nums">€{amountLeft.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* NCS Info */}
                {childcareType === 'registered' && subsidyAmount > 0 && (
                  <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg mb-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#111827] mb-0.5">
                          NCS Subsidy: €{subsidyAmount.toLocaleString()}/mo
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          €{subsidy.hourlyRate}/hr × {Math.min(hoursPerWeek, 45)}hrs/wk
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ECCE Info */}
                {childcareType === 'registered' && ecce.eligible && (
                  <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg mb-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#111827] mb-0.5">
                          ECCE Free Preschool: ~€{ecceSaving.toLocaleString()}/mo
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          15 free hours/week for children aged 2y8m–5y6m (term-time)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Report/Feedback Section */}
                <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <Info className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#111827] mb-1">
                        See an error in these calculations?
                      </div>
                      <div className="text-xs text-[#6B7280] mb-2">
                        ReturnKit uses 2025 Irish tax rates, NCS subsidy bands, and ECCE eligibility rules. If you spot an inaccuracy or have a correction, please let us know.
                      </div>
                      <a
                        href={`mailto:hello@returnkit.ie?subject=Calculator%20Correction%20Request&body=I%20spotted%20an%20issue%20with%20the%20calculator%3A%0A%0AGross%20salary%3A%20€${grossSalary}%0AMarital%20status%3A%20${maritalStatus}%0AChildcare%20type%3A%20${childcareType}%0AChild%20age%3A%20${childAge}%20years%0A%0AThe%20issue%3A%0A`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Report via email
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Scenario Comparison */}
            {showScenarioComparison && (
              <div className="p-5 sm:p-6 bg-white border border-[#E2DDD7] rounded-2xl shadow-sm">
                <h3 className="font-semibold text-[#111827] mb-1">Full-time vs Part-time vs Not Returning</h3>
                <p className="text-xs text-[#6B7280] mb-5">Based on your current inputs. Part-time assumes 3 days/week (60%).</p>
                
                <div className="space-y-3">
                  {(['fulltime', 'parttime', 'notworking'] as WorkScenario[]).map((key) => {
                    const s = scenarios[key];
                    const isNegative = s.amountLeft < 0;
                    const isBest = s.amountLeft === Math.max(scenarios.fulltime.amountLeft, scenarios.parttime.amountLeft, scenarios.notworking.amountLeft);
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          isBest ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#111827]">{s.label}</span>
                            {isBest && (
                              <span className="text-xs font-semibold text-[#2563EB] bg-[#DBEAFE] px-2 py-0.5 rounded-full">Best</span>
                            )}
                          </div>
                          <span className={`font-semibold text-sm tabular-nums ${isNegative ? 'text-[#DC2626]' : 'text-[#111827]'}`}>
                            €{s.amountLeft.toLocaleString()}/mo
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mb-2">{s.description}</p>
                        {key !== 'notworking' && (
                          <div className="flex gap-4 text-xs text-[#9CA3AF]">
                            <span>Net: €{s.netMonthly.toLocaleString()}</span>
                            <span>Childcare: €{s.childcareCost.toLocaleString()}</span>
                            <span>€{s.hourlyValue}/hr</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
                  <p className="text-xs text-[#1E3A8A]">
                    <strong>Note:</strong> This doesn't factor in pension contributions, career progression, or the compounding cost of career gaps. Even a financially "worse" scenario may be better long-term.
                  </p>
                </div>
              </div>
            )}

            {/* Research Contribution */}
            <ResearchContribution
              grossSalary={grossSalary}
              monthlyCost={monthlyCost}
              childcareType={childcareType === 'registered' ? 'Registered' : childcareType === 'nanny' ? 'Nanny' : 'Unregistered'}
              hoursPerWeek={hoursPerWeek}
              region="Dublin"
            />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-[#9CA3AF]">
            Calculations based on Budget 2025 • Not financial advice • ECCE estimates averaged over 12 months
          </div>
        </div>
      </section>

      {/* What if you can't get a place */}
      <section className="bg-[#F5F2EE] border-b border-[#E2DDD7]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-6 rounded-full bg-[#B85A82]"></span>
            <h2 className="text-[#0D1F2D]">What if you can't get a place?</h2>
          </div>
          <p className="text-[#6B6560] mb-6 ml-4">
            Waiting lists are 2-3 years. Here are alternatives real Dublin parents actually use.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Childminder',
                description: 'Individual carer in their home. Often more flexible hours. Based on minimum wage (€14.15/hr). Ask if they\'re Tusla-registered to qualify for NCS.',
                cost: '€1,000-1,400/mo',
                wait: 'Weeks',
              },
              {
                title: 'Au pair (domestic worker)',
                description: 'Live-in carer from abroad. Legally classified as a domestic worker in Ireland, entitled to minimum wage (€14.15/hr), annual leave, and full employment rights. You also provide room and board.',
                cost: '€14.15/hr + room & board',
                wait: 'Weeks',
              },
              {
                title: 'Grandparents / family',
                description: 'The most common "backup plan" in Ireland. Free but comes with emotional complexity and isn\'t always available.',
                cost: 'Free',
                wait: 'Immediate',
              },
              {
                title: 'Part-time / job sharing',
                description: 'Reduce hours to 3 days/week. Childcare costs drop proportionally. Use the Compare Scenarios tool above.',
                cost: 'Reduced salary',
                wait: 'Employer-dependent',
              },
              {
                title: 'Nanny share',
                description: 'Split a nanny with another family. A full-time nanny costs approx. €2,240/mo (€14.15/hr minimum wage), split between two families. Find partners through local parent groups.',
                cost: '~€1,200/mo per family',
                wait: 'Weeks',
              },
            ].map((alt) => (
              <div key={alt.title} className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
                <h4 className="font-semibold text-[#111827] text-sm mb-1">{alt.title}</h4>
                <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">{alt.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#111827] font-semibold">{alt.cost}</span>
                  <span className="text-[#9CA3AF]">·</span>
                  <span className="flex items-center gap-1 text-[#6B7280]">
                    <Clock className="w-3 h-3" />
                    {alt.wait}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Off the books callout */}
          <div className="mt-5 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#1E3A8A] mb-1">The elephant in the room</h4>
                <p className="text-xs text-[#374151] leading-relaxed">
                  At €14.15/hr minimum wage, a full-time nanny costs over €2,400/mo before employer PRSI. A childminder charging legal rates is often out of reach. The result: many families are quietly pushed towards informal, cash-in-hand arrangements. This is not a parenting failure. It is a policy failure. When compliance is unaffordable, the system itself creates the shadow economy it claims to regulate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section id="actions" className="bg-white border-b border-[#E2DDD7]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-[#B85A82]"></span>
              <h2 className="text-[#0D1F2D]">What to Do Right Now</h2>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D1FAE5] text-[#059669] rounded-lg border border-[#059669]/20 self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {Object.values(checkedItems).filter(Boolean).length} of 9 completed
              </span>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Today */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-semibold text-sm">1</div>
                <h3 className="font-semibold text-[#111827]">Today</h3>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'check-ncs', text: 'Check NCS calculator to confirm your subsidy rate', link: 'https://www.ncs.gov.ie/en/childcare-subsidy-calculator-input/' },
                  { id: 'join-waiting', text: 'Join waiting lists for 3-5 registered crèches near you' },
                  { id: 'save-summary', text: 'Share your calculator result with your partner/family' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[item.id] || false}
                      onChange={() => toggleCheckItem(item.id)}
                      className="mt-0.5 w-5 h-5 rounded border-2 border-[#E5E7EB] text-[#111827] focus:ring-2 focus:ring-[#2563EB]/50"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-[#111827]">{item.text}</span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-1 text-xs text-[#2563EB] hover:text-[#1D4ED8]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.link.replace('https://', '')}
                        </a>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* This Week */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-semibold text-sm">2</div>
                <h3 className="font-semibold text-[#111827]">This Week</h3>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'contact-local', text: 'Contact local parent groups for provider recommendations' },
                  { id: 'visit-creches', text: 'Visit 2-3 crèches to assess quality and wait times' },
                  { id: 'research-childminders', text: 'Research childminders and ask about NCS registration' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[item.id] || false}
                      onChange={() => toggleCheckItem(item.id)}
                      className="mt-0.5 w-5 h-5 rounded border-2 border-[#E5E7EB] text-[#111827] focus:ring-2 focus:ring-[#2563EB]/50"
                    />
                    <span className="text-sm text-[#111827]">{item.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* This Month */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-semibold text-sm">3</div>
                <h3 className="font-semibold text-[#111827]">This Month</h3>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'budget-review', text: 'Review your family budget based on these costs' },
                  { id: 'employer-flexibility', text: 'Discuss flexible working with your employer' },
                  { id: 'backup-plan', text: 'Create backup plan (childminder, nanny share, family, job-sharing)' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems[item.id] || false}
                      onChange={() => toggleCheckItem(item.id)}
                      className="mt-0.5 w-5 h-5 rounded border-2 border-[#E5E7EB] text-[#111827] focus:ring-2 focus:ring-[#2563EB]/50"
                    />
                    <span className="text-sm text-[#111827]">{item.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Scripts */}
      <section id="emails" className="bg-[#F5F2EE] border-b border-[#E2DDD7]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1 h-6 rounded-full bg-[#B85A82]"></span>
              <h2 className="text-[#0D1F2D]">Email Scripts</h2>
            </div>
            <p className="text-[#6B6560] ml-4">
              Copy-paste templates for contacting crèches. Edit the [brackets] with your details.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Waiting List Registration', email: waitlistEmail },
              { title: 'NCS Subsidy Inquiry', email: subsidyEmail },
              { title: 'Follow-Up Request', email: followUpEmail }
            ].map((script, idx) => (
              <div key={idx} className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#6B7280]" />
                    <h3 className="font-semibold text-[#111827] text-sm">{script.title}</h3>
                  </div>
                  <CopyButton 
                    text={script.email} 
                    label="Copy"
                    className="text-xs font-semibold px-3 py-1.5 bg-[#111827] text-white rounded-lg hover:bg-[#374151] transition-colors flex items-center gap-1.5"
                    onCopy={() => showToast('Email copied to clipboard')}
                  />
                </div>
                <div className="p-5">
                  <pre className="whitespace-pre-wrap text-sm text-[#374151] leading-relaxed">{script.email}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Crèches */}
      <section id="map" className="bg-white border-b border-[#E2DDD7]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1 h-6 rounded-full bg-[#B85A82]"></span>
              <h2 className="text-[#0D1F2D]">Find Crèches Near You</h2>
            </div>
            <p className="text-[#6B6560] ml-4">
              The best approach is to check the official Tusla register first, then use Google Maps to see what's actually near you. Here's exactly how.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0D1F2D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
              <div>
                <p className="font-semibold text-[#111827] mb-1">Open the Tusla Early Years register</p>
                <p className="text-sm text-[#6B7280] mb-3">
                  This is the official list of every Tusla-registered crèche, childminder, and preschool in Ireland. Only registered providers qualify for NCS subsidies and ECCE.
                </p>
                <a
                  href="https://www.tusla.ie/services/family-community-support/early-years/information-for-parents/find-your-local-early-years-service/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline"
                >
                  Open Tusla Early Years register →
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0D1F2D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
              <div>
                <p className="font-semibold text-[#111827] mb-1">Search by your county or area</p>
                <p className="text-sm text-[#6B7280]">
                  Filter by county, then by type — <strong>Full Day Care</strong> for full-time crèche, <strong>Childminder</strong> for home-based care, or <strong>Part-time Day Care</strong> for sessional places. Download the results as a list.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0D1F2D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
              <div>
                <p className="font-semibold text-[#111827] mb-1">Find them on Google Maps</p>
                <p className="text-sm text-[#6B7280] mb-3">
                  Open Google Maps and search <strong>"crèche near me"</strong> or <strong>"childcare [your area]"</strong>. Cross-reference the names against your Tusla list to confirm they're registered. Google Maps also shows reviews, photos, and opening hours.
                </p>
                <a
                  href="https://www.google.com/maps/search/creche+near+me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline"
                >
                  Search Google Maps →
                </a>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0D1F2D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
              <div>
                <p className="font-semibold text-[#111827] mb-1">Contact 3–5 crèches and ask the right questions</p>
                <p className="text-sm text-[#6B7280] mb-2">When you call or email, ask:</p>
                <ul className="text-sm text-[#6B7280] space-y-1">
                  <li>• Do you have availability for [age] from [month]?</li>
                  <li>• What is the current waiting list time?</li>
                  <li>• Are you registered with Tusla? (confirms NCS eligibility)</li>
                  <li>• Do you accept NCS? What's your hourly rate?</li>
                  <li>• Do you offer ECCE places? (if child is preschool age)</li>
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0D1F2D] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</div>
              <div>
                <p className="font-semibold text-[#111827] mb-1">Apply for NCS as soon as you have a place</p>
                <p className="text-sm text-[#6B7280] mb-3">
                  NCS applications can take a few weeks to process. Apply at ncs.gov.ie once you have a confirmed start date and your crèche's Tusla registration number.
                </p>
                <a
                  href="https://www.ncs.gov.ie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline"
                >
                  Apply for NCS →
                </a>
              </div>
            </div>

            {/* Tip box */}
            <div className="bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] p-5 flex gap-3">
              <div className="text-lg flex-shrink-0">💡</div>
              <div>
                <p className="text-sm font-semibold text-[#1E3A8A] mb-1">Waiting lists in Dublin average 18–24 months</p>
                <p className="text-sm text-[#1E40AF]">
                  Register with 3–5 crèches as early as possible — even before or during pregnancy. Most crèches allow you to join multiple waiting lists at no cost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Useful Links */}
      <section id="links" className="bg-[#F5F2EE] border-b border-[#E2DDD7]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1 h-6 rounded-full bg-[#B85A82]"></span>
              <h2 className="text-[#0D1F2D]">Useful Links</h2>
            </div>
            <p className="text-[#6B6560] ml-4">
              Official resources for childcare, subsidies, and support
            </p>
          </div>

          <div className="space-y-6">
            {/* Government & Subsidies */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <h3 className="font-semibold text-[#111827] mb-4 flex items-center gap-2 text-sm">
                <div className="w-7 h-7 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
                Government & Subsidies
              </h3>
              <div className="space-y-1">
                {[
                  { href: 'https://www.ncs.gov.ie', title: 'National Childcare Scheme', desc: 'Apply for NCS subsidies and check eligibility' },
                  { href: 'https://www.gov.ie/en/service/3ba3a0-core-funding/', title: 'Core Funding Information', desc: 'Fee caps and registered childcare providers' },
                  { href: 'https://www.revenue.ie/en/personal-tax-credits-reliefs-and-exemptions/tax-relief-charts/index.aspx', title: 'Revenue Tax Calculator', desc: 'Calculate income tax, USC, and PRSI' },
                  { href: 'https://www.citizensinformation.ie/en/education/early-childhood-education-and-care/', title: 'Citizens Information', desc: 'Comprehensive guide to childcare supports' },
                ].map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors group">
                    <div className="text-sm text-[#111827] group-hover:text-[#2563EB] mb-0.5">{link.title} →</div>
                    <div className="text-xs text-[#6B7280]">{link.desc}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Childcare Services */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <h3 className="font-semibold text-[#111827] mb-4 flex items-center gap-2 text-sm">
                <div className="w-7 h-7 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
                Childcare Services
              </h3>
              <div className="space-y-1">
                {[
                  { href: 'https://www.tusla.ie/services/family-community-support/early-years/', title: 'Tusla Early Years', desc: 'Childcare regulation and childminder registration' },
                  { href: 'https://www.pobal.ie/programmes/early-childhood-care-education/', title: 'Pobal Early Childhood', desc: 'Childcare programs and provider directory' },
                  { href: 'https://www.barnardos.ie/what-we-do/working-with-children-and-families/early-years-services', title: 'Barnardos Early Years', desc: 'Community childcare services and support' },
                  { href: 'https://myccc.ie/', title: 'City & County Childcare', desc: 'Local childcare information and resources' },
                ].map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors group">
                    <div className="text-sm text-[#111827] group-hover:text-[#2563EB] mb-0.5">{link.title} →</div>
                    <div className="text-xs text-[#6B7280]">{link.desc}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Support & Advocacy + Employment Rights in a grid on wider screens */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                <h3 className="font-semibold text-[#111827] mb-4 flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  Support & Advocacy
                </h3>
                <div className="space-y-1">
                  {[
                    { href: 'https://www.parentline.ie/', title: 'Parentline', desc: 'Free helpline for parents' },
                    { href: 'https://www.treoir.ie/', title: 'Treoir', desc: 'Info for unmarried parents' },
                    { href: 'https://www.onefamily.ie/', title: 'One Family', desc: 'One-parent family support' },
                    { href: 'https://www.childcarepolicy.net/', title: 'Start Strong', desc: 'Childcare policy advocacy' },
                  ].map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors group">
                      <div className="text-sm text-[#111827] group-hover:text-[#2563EB] mb-0.5">{link.title} →</div>
                      <div className="text-xs text-[#6B7280]">{link.desc}</div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                <h3 className="font-semibold text-[#111827] mb-4 flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  Employment Rights
                </h3>
                <div className="space-y-1">
                  {[
                    { href: 'https://www.workplacerelations.ie/en/what_you_should_know/family-leave/', title: 'WRC Family Leave', desc: 'Maternity, paternity, parental leave' },
                    { href: 'https://www.gov.ie/en/service/b22528-parents-leave-and-benefit/', title: "Parent's Leave", desc: '9 weeks paid parental leave' },
                    { href: 'https://www.irishstatutebook.ie/eli/2023/act/16/enacted/en/html', title: 'Work Life Balance Act', desc: 'Right to request flexible work' },
                    { href: 'https://www.ictu.ie/workingfamily', title: 'ICTU Working Family', desc: 'Trade union parent support' },
                  ].map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors group">
                      <div className="text-sm text-[#111827] group-hover:text-[#2563EB] mb-0.5">{link.title} →</div>
                      <div className="text-xs text-[#6B7280]">{link.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="bg-[#0B1120] border-b border-[#1E2D45] relative overflow-hidden">
        {/* Subtle floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <Baby className="absolute top-10 right-[10%] w-6 h-6 text-[#60A5FA]/10 rotate-6" />
          <Star className="absolute top-[25%] left-[5%] w-4 h-4 text-[#EC4899]/10 -rotate-12" />
          <Heart className="absolute bottom-[20%] right-[6%] w-4 h-4 text-[#60A5FA]/10 rotate-12" />
          <BabyBottle className="absolute bottom-10 left-[8%] w-5 h-5 text-[#60A5FA]/10 rotate-45" />
        </div>
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16 relative z-10">
          <div className="bg-[#0B1120] rounded-2xl overflow-hidden">
            {/* Manifesto hero photo */}
            <div className="relative w-full" style={{ maxHeight: '420px' }}>
              <div
                id="manifesto-photo"
                className="w-full h-[280px] sm:h-[420px] bg-[#1A3348]"
              >
                <img src={manifestoImage} alt="Mother holding toddler outside a Dublin crèche gate" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/30 to-transparent pointer-events-none" />
            </div>

            <div className="p-6 sm:p-10 -mt-6 relative z-10">
            
            {/* Childhood quote */}
            <div className="mb-8 p-5 bg-white/5 border border-white/10 rounded-xl flex gap-4 items-start">
              <span className="flex-shrink-0 mt-0.5 text-[#60A5FA]/60" aria-hidden="true">
                <BabyBottle className="w-5 h-5" />
              </span>
              <blockquote className="text-[#D1D5DB] italic">
                "Children are not a distraction from more important work. They are the most important work."
                <cite className="block text-xs text-[#9CA3AF] mt-2 not-italic">C.S. Lewis</cite>
              </blockquote>
            </div>

            <h2 className="text-[28px] sm:text-[36px] font-semibold text-white mb-2">Why we built this</h2>
            <p className="text-sm text-[#7EACC4] mb-8">An open letter from the parents behind ReturnKit</p>
            
            <div className="space-y-5 text-[#D1D5DB] leading-relaxed">
              <p>
                We built ReturnKit because we went through it. The spreadsheets at 2am. The calls to crèches that never called back. The conversation with our partners where the numbers just didn't add up.
              </p>

              <p>
                Ireland's childcare system puts the cost and risk on families. Fee caps help. Subsidies help. But after the NCS subsidy, many parents still face €200+ per week out of pocket, and that's <em>if</em> you can find a place at all.
              </p>

              <p className="text-white font-semibold">
                Affordability is meaningless without access. You can't budget around a 2-year waiting list.
              </p>

              <p>
                The burden falls disproportionately on women. Not by rule, but by structure. The "second earner" penalty is real, and it's overwhelmingly mothers who absorb it through reduced hours, career breaks, or leaving the workforce entirely.
              </p>

              <p>
                We're not a company. There's no subscription, no investors, no data collection. Just parents who think other parents deserve clear numbers before making one of the biggest financial decisions of their lives.
              </p>

              <p className="text-white font-semibold">
                We believe childcare is infrastructure. We're asking the government to treat it that way.
              </p>

              {/* Petition / Open Letter */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-4">What we're asking for</h3>
                <ol className="space-y-3 text-[#D1D5DB]">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">1</span>
                    <span>A national real-time vacancy system so parents can see available places without calling 30 crèches.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">2</span>
                    <span>NCS subsidies that reflect the actual cost of care in Dublin, not a national average that leaves urban families short.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">3</span>
                    <span>Enough places. Fee caps mean nothing if there's a 2-year queue. Build capacity first.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">4</span>
                    <span>Pay childcare workers properly. You can't retain quality care on €13/hour. The staffing crisis is the capacity crisis.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">5</span>
                    <span>Right to a childcare place from age 1. Germany, Denmark and Sweden guarantee this. Ireland has no legal entitlement to childcare at any age.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">6</span>
                    <span>Childcare facilities required in all new housing developments. A planning rule that costs the state nothing. Ireland builds thousands of homes with zero provision.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">7</span>
                    <span>Individualise the tax system to remove the second-earner penalty. Each person taxed independently, as in Nordic countries. ReturnKit shows exactly what this penalty costs.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs text-white font-semibold">8</span>
                    <span>Close the affordability gap that forces families off the books. When legal childcare costs €2,400/mo for a nanny or €1,200+ for a childminder, the system itself pushes families into informal, cash-in-hand arrangements. This is a policy failure, not a parenting failure.</span>
                  </li>
                </ol>
              </div>

              <div className="mt-6 p-5 bg-white/10 rounded-xl">
                <p className="text-white font-semibold mb-4">
                  These are our demands. Add your name.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.change.org/ReturnKit-Childcare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D3A] text-white rounded-lg hover:bg-[#D14E2E] transition-colors text-sm font-semibold shadow-lg shadow-[#E85D3A]/20"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Sign the petition
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-[#8FA8C0]">
                  <strong className="text-white">Sources:</strong> Tax rates from revenue.ie • NCS from ncs.gov.ie • ECCE from gov.ie • Core Funding rates from gov.ie • Childminder registration from tusla.ie • Minimum wage (€14.15/hr) from gov.ie
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0D1F2D] py-10 border-t border-[#1a3248]">
        <div className="max-w-[760px] mx-auto px-5">
          <div className="space-y-6">

            {/* Logo + tagline */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B85A82]"></span>
              <span className="text-sm font-bold text-white tracking-tight">ReturnKit</span>
              <span className="text-[#4B6888] text-xs ml-1">Budget 2025 • Ireland</span>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "No personal data stored" },
                { icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", label: "No cookies" },
                { icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", label: "Open source" },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#8FA8C0] bg-white/5 border border-white/10 rounded-full">
                  <svg className="w-3.5 h-3.5 text-[#B85A82]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                  {label}
                </span>
              ))}
            </div>

            {/* Attribution + links */}
            <div className="pt-5 border-t border-[#1a3248] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-xs text-[#4B6888]">
                  Inspired by{" "}
                  <a
                    href="https://momops.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8FA8C0] underline underline-offset-2 hover:text-white transition-colors"
                  >
                    MomOps.org
                  </a>
                </p>
                <button
                  type="button"
                  onClick={() => setShowDataPartners(true)}
                  className="text-xs text-[#4B6888] hover:text-[#8FA8C0] transition-colors underline underline-offset-2"
                >
                  Research partnerships
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#4B6888] hover:text-[#8FA8C0] transition-colors rounded-md hover:bg-white/5"
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

          </div>
        </div>
      </footer>

      {/* Data Partners Modal */}
      {showDataPartners && (
        <DataPartnersModal onClose={() => setShowDataPartners(false)} />
      )}

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel
          creches={creches}
          onAdd={handleAddCreche}
          onDelete={handleDeleteCreche}
          onUpdate={handleUpdateCreche}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* Maternity Explainer Modal */}
      <MaternityExplainerModal
        isOpen={showMaternityModal}
        onClose={() => setShowMaternityModal(false)}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111827] text-white px-6 py-3 rounded-lg shadow-lg z-50 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
