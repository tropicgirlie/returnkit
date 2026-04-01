import { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2, Mail, Settings, Menu, X, Share2, Info, Briefcase, Clock, Baby, Star, Heart } from 'lucide-react';
import { CopyButton } from './components/CopyButton';
import { CrecheMap, loadCreches, saveCreches } from './components/CrecheMap';
import { AdminPanel, type CrecheEntry } from './components/AdminPanel';
import { MaternityExplainerModal } from './components/MaternityExplainerModal';
import { ResearchContribution } from './components/ResearchContribution';
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

export default function App() {
  // State
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('single');
  const [grossSalary, setGrossSalary] = useState(55000);
  const [partnerSalary, setPartnerSalary] = useState(45000);
  const [numChildren, setNumChildren] = useState(1);
  const [childAge, setChildAge] = useState(1);
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

  // ACCURATE 2025 IRISH TAX CALCULATION
  function calculateNetIncome(gross: number, marital: MaritalStatus, partnerGross?: number) {
    let totalGross = gross;
    let totalIncomeTax = 0;
    let totalUSC = 0;
    let totalPRSI = 0;

    // Income Tax Bands 2025
    if (marital === 'single') {
      const standardRateCutoff = 44000;
      const taxCredits = 4000;
      
      if (gross <= standardRateCutoff) {
        totalIncomeTax = (gross * 0.20) - taxCredits;
      } else {
        totalIncomeTax = ((standardRateCutoff * 0.20) + ((gross - standardRateCutoff) * 0.40)) - taxCredits;
      }
    } else if (marital === 'married_one') {
      const standardRateCutoff = 53000;
      const taxCredits = 8000;
      
      if (gross <= standardRateCutoff) {
        totalIncomeTax = (gross * 0.20) - taxCredits;
      } else {
        totalIncomeTax = ((standardRateCutoff * 0.20) + ((gross - standardRateCutoff) * 0.40)) - taxCredits;
      }
    } else {
      totalGross = gross + (partnerGross || 0);
      const standardRateCutoff = 88000;
      const taxCredits = 8000;
      
      if (totalGross <= standardRateCutoff) {
        totalIncomeTax = (totalGross * 0.20) - taxCredits;
      } else {
        totalIncomeTax = ((standardRateCutoff * 0.20) + ((totalGross - standardRateCutoff) * 0.40)) - taxCredits;
      }
    }

    // USC Calculation
    const calculateUSC = (income: number) => {
      let usc = 0;
      if (income <= 12012) {
        usc = income * 0.005;
      } else if (income <= 27382) {
        usc = (12012 * 0.005) + ((income - 12012) * 0.02);
      } else if (income <= 70044) {
        usc = (12012 * 0.005) + ((27382 - 12012) * 0.02) + ((income - 27382) * 0.035);
      } else {
        usc = (12012 * 0.005) + ((27382 - 12012) * 0.02) + ((70044 - 27382) * 0.035) + ((income - 70044) * 0.08);
      }
      return usc;
    };

    if (marital === 'married_two') {
      totalUSC = calculateUSC(gross) + calculateUSC(partnerGross || 0);
    } else {
      totalUSC = calculateUSC(gross);
    }

    // PRSI 4.125%
    totalPRSI = totalGross * 0.04125;

    totalIncomeTax = Math.max(0, totalIncomeTax);

    const netAnnual = totalGross - totalIncomeTax - totalUSC - totalPRSI;
    const netMonthly = Math.round(netAnnual / 12);

    return {
      grossAnnual: totalGross,
      grossMonthly: Math.round(totalGross / 12),
      incomeTax: Math.round(totalIncomeTax),
      usc: Math.round(totalUSC),
      prsi: Math.round(totalPRSI),
      totalDeductions: Math.round(totalIncomeTax + totalUSC + totalPRSI),
      netAnnual: Math.round(netAnnual),
      netMonthly
    };
  }

  // NCS Subsidy Calculation
  function calculateNCSSubsidy(netAnnual: number, hoursPerWeek: number, childAge: number) {
    const maxSubsidy = 3.75;
    const universalSubsidy = 2.14;
    
    let hourlyRate = 0;
    
    if (netAnnual < 26600) {
      hourlyRate = maxSubsidy;
    } else if (netAnnual >= 60000) {
      hourlyRate = universalSubsidy;
    } else {
      const range = 60000 - 26600;
      const position = netAnnual - 26600;
      const percentage = position / range;
      hourlyRate = maxSubsidy - ((maxSubsidy - universalSubsidy) * percentage);
    }

    const subsidizedHours = Math.min(hoursPerWeek, 45);
    const weeklySubsidy = hourlyRate * subsidizedHours;
    const monthlySubsidy = Math.round(weeklySubsidy * 4.33);
    
    return {
      hourlyRate: hourlyRate.toFixed(2),
      monthlySubsidy
    };
  }

  // ECCE Calculation (free preschool hours)
  function calculateECCE(childAge: number) {
    // ECCE: 15 hours/week free for children aged 2y8m to 5y6m
    // Approximately age 3+
    const eligible = childAge >= 3;
    const weeklyHoursFree = eligible ? 15 : 0;
    // ECCE runs 38 weeks/year (school term), so monthly savings averaged over 12 months
    // Average crèche hourly rate ~€6-8, use €7 as estimate
    const estimatedHourlyRate = 7;
    const annualSaving = weeklyHoursFree * 38 * estimatedHourlyRate;
    const monthlySaving = Math.round(annualSaving / 12);
    return { eligible, weeklyHoursFree, monthlySaving };
  }

  // Calculate results
  const taxResult = calculateNetIncome(
    grossSalary, 
    maritalStatus, 
    maritalStatus === 'married_two' ? partnerSalary : undefined
  );

  const subsidy = calculateNCSSubsidy(taxResult.netAnnual, hoursPerWeek, childAge);
  const ecce = calculateECCE(childAge);

  // Childcare calculations
  let childcareCostMonthly = monthlyCost * numChildren;
  let subsidyAmount = 0;
  let ecceSaving = 0;
  let outOfPocketMonthly = childcareCostMonthly;

  if (childcareType === 'registered') {
    // Registered childcare facilities (crèches, childminders) get NCS + ECCE
    subsidyAmount = subsidy.monthlySubsidy * numChildren;
    ecceSaving = ecce.monthlySaving * numChildren;
    outOfPocketMonthly = Math.max(0, childcareCostMonthly - subsidyAmount - ecceSaving);
  } else if (childcareType === 'unregistered') {
    // Unregistered childcare: no NCS, but ECCE might apply if using separate registered preschool
    ecceSaving = ecce.monthlySaving * numChildren;
    outOfPocketMonthly = Math.max(0, childcareCostMonthly - ecceSaving);
  } else {
    // Nanny (home care): NO NCS subsidy, NO ECCE - pay full cost
    outOfPocketMonthly = childcareCostMonthly;
  }

  // Final calculation
  const amountLeft = taxResult.netMonthly - outOfPocketMonthly;
  const percentageKept = taxResult.netMonthly > 0 ? Math.round((amountLeft / taxResult.netMonthly) * 100) : 0;
  
  // Calculate percentages for bar chart
  const takeHomePercent = taxResult.grossMonthly > 0 ? Math.round((amountLeft / taxResult.grossMonthly) * 100) : 0;
  const childcarePercent = taxResult.grossMonthly > 0 ? Math.round((outOfPocketMonthly / taxResult.grossMonthly) * 100) : 0;
  const taxPercent = Math.max(0, 100 - takeHomePercent - childcarePercent);

  // Hourly value
  const hourlyValue = hoursPerWeek > 0 ? (amountLeft / (hoursPerWeek * 4.33)).toFixed(2) : '0.00';
  const hourlyValueNum = parseFloat(hourlyValue);

  // Retention strength
  const retentionStrength = percentageKept >= 60 ? 'Strong' : percentageKept >= 40 ? 'Moderate' : 'Weak';
  const retentionColor = percentageKept >= 60 ? '#10B981' : percentageKept >= 40 ? '#F59E0B' : '#EF4444';
  const retentionBg = percentageKept >= 60 ? '#D1FAE5' : percentageKept >= 40 ? '#FEF3C7' : '#FEE2E2';

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
    const ncs = calculateNCSSubsidy(tax.netAnnual, hours, childAge);
    
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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Skip Links */}
      <a 
        href="#calculator" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#111827] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to calculator
      </a>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] overflow-hidden">
        <div className="max-w-[760px] mx-auto px-5 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center">
            <TransparentLogo src={logoImage} alt="ReturnKit" className="h-[95px]" />
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors text-[#6B7280]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5E7EB] bg-white">
            <nav className="max-w-[760px] mx-auto px-5 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 mt-2 border-t border-[#E5E7EB]">
                <a
                  href="https://www.facebook.com/groups/returnkit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-lg"
                >
                  Facebook Group
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section — two-column split */}
      <section className="bg-[#0D1F2D] py-10 sm:py-16 border-b border-[#1A3348] relative overflow-hidden">
        {/* Playful floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <Star className="absolute top-6 right-[12%] w-5 h-5 text-[#F59E0B]/15 rotate-12" />
          <Heart className="absolute top-[20%] right-[8%] w-4 h-4 text-[#EC4899]/12" />
          <Baby className="absolute bottom-8 left-[6%] w-6 h-6 text-[#60A5FA]/10 -rotate-12" />
          <BabyBottle className="absolute top-[35%] left-[3%] w-4 h-4 text-[#F59E0B]/12 rotate-45" />
          <Star className="absolute bottom-[15%] right-[5%] w-3 h-3 text-[#EC4899]/10 -rotate-6" />
          <Heart className="absolute top-4 left-[15%] w-3 h-3 text-[#60A5FA]/10 rotate-12" />
        </div>
        <div className="max-w-[760px] mx-auto px-5 relative z-10">
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-6 items-stretch">
            {/* Left column — text content (55%) */}
            <div className="sm:w-[55%] flex flex-col justify-center">
              <p className="text-[20px] sm:text-[24px] text-[#7EACC4] mb-2 font-semibold">
                Can you afford to go back?
              </p>
              <p className="text-[#9CA3AF] mb-6">
                See what you'd actually keep after tax and childcare in Dublin. Accurate 2025 Irish tax, NCS subsidies, and ECCE included.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <a 
                  href="#calculator"
                  className="inline-flex items-center px-5 py-2.5 bg-white text-[#111827] rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm font-semibold"
                >
                  Start Calculator
                </a>
                <button 
                  type="button"
                  onClick={() => setShowMaternityModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/15 transition-colors text-sm"
                >
                  <Info className="w-4 h-4" />
                  How maternity leave works
                </button>
              </div>

              {/* Compact stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                  <div className="text-[20px] sm:text-[24px] font-semibold text-white">40-70%</div>
                  <p className="text-xs text-[#9CA3AF] mt-1">of take-home consumed by childcare</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                  <div className="text-[20px] sm:text-[24px] font-semibold text-white">2-3 yrs</div>
                  <p className="text-xs text-[#9CA3AF] mt-1">typical crèche waiting list</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                  <div className="text-[20px] sm:text-[24px] font-semibold text-white">Free</div>
                  <p className="text-xs text-[#9CA3AF] mt-1">no login, no fees, forever</p>
                </div>
              </div>
            </div>

            {/* Right column — hero image (45%) */}
            <div className="sm:w-[45%] min-h-[240px] sm:min-h-0">
              <div
                id="hero-photo"
                className="w-full h-full min-h-[240px] sm:min-h-[360px] bg-[#1A3348] rounded-xl shadow-lg shadow-black/20 overflow-hidden"
              >
                <img src={heroImage} alt="Parents reviewing childcare costs at kitchen table" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">

          <div className="space-y-6">
            {/* Income Card */}
            <div className="p-5 sm:p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm">
              <h3 className="font-semibold text-[#111827] mb-4">Your Income</h3>
              
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
              </div>
            </div>

            {/* Childcare Card */}
            <div className="p-5 sm:p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm">
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
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="0">Under 1</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3+ years (ECCE eligible)</option>
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
                    onChange={(e) => setHoursPerWeek(Number(e.target.value) || 0)}
                    onFocus={(e) => e.target.select()}
                    className="w-full h-11 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="45"
                  />
                  {hoursPerWeek > 45 && (
                    <p className="mt-1 text-xs text-[#F59E0B]">NCS max: 45hrs</p>
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
            <div className="bg-gradient-to-br from-white to-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl overflow-hidden shadow-lg">
              <div className="h-1.5" style={{ backgroundColor: retentionColor }} />
              
              <div className="p-5 sm:p-6">
                {/* Summary Metric Cards */}
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <div className="text-xs text-[#6B6B6B] mb-1.5">Net monthly (after tax)</div>
                    <div className="text-[22px] font-medium text-[#1A1A1A] tabular-nums">€{taxResult.netMonthly.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <div className="text-xs text-[#6B6B6B] mb-1.5">
                      {childcareType === 'nanny' ? 'Nanny cost' : childcareType === 'unregistered' ? 'Childminder cost' : 'Childcare cost'}
                    </div>
                    <div className="text-[22px] font-medium text-[#BA7517] tabular-nums">€{outOfPocketMonthly.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <div className="text-xs text-[#6B6B6B] mb-1.5">Left after childcare</div>
                    <div className="text-[22px] font-medium text-[#A32D2D] tabular-nums">€{amountLeft.toLocaleString()}</div>
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
                      className="bg-[#E24B4A] flex items-center justify-center text-white text-[11px] font-medium" 
                      style={{ width: `${Math.round((outOfPocketMonthly / taxResult.netMonthly) * 100)}%` }}
                    >
                      {Math.round((outOfPocketMonthly / taxResult.netMonthly) * 100) > 15 && `${childcareType === 'nanny' ? 'Nanny' : 'Childcare'} ${Math.round((outOfPocketMonthly / taxResult.netMonthly) * 100)}%`}
                    </div>
                    <div 
                      className="bg-[#639922] flex items-center justify-center text-white text-[11px] font-medium" 
                      style={{ width: `${Math.round((amountLeft / taxResult.netMonthly) * 100)}%` }}
                    >
                      {Math.round((amountLeft / taxResult.netMonthly) * 100) > 15 && `Yours ${Math.round((amountLeft / taxResult.netMonthly) * 100)}%`}
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
                      <span className="text-[#6B7280]">Gross salary</span>
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
                      <span className="text-[#6B7280]">Net salary</span>
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
              <div className="p-5 sm:p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm">
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

                <div className="mt-4 p-3 bg-[#FEF3C7] border border-[#FCD34D] rounded-lg">
                  <p className="text-xs text-[#92400E]">
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
      <section className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <h2 className="text-[24px] font-semibold text-[#111827] mb-2">What if you can't get a place?</h2>
          <p className="text-[#6B7280] mb-6">
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
                title: 'Parent & toddler groups',
                description: 'Not a childcare solution, but reduces isolation and helps build a local network. Community centre sessions from €2, dedicated paid classes up to €20+ per session.',
                cost: '€2-20+/session',
                wait: 'Immediate',
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
          <div className="mt-5 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-[#92400E] mb-1">The elephant in the room</h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  At €14.15/hr minimum wage, a full-time nanny costs over €2,400/mo before employer PRSI. A childminder charging legal rates is often out of reach. The result: many families are quietly pushed towards informal, cash-in-hand arrangements. This is not a parenting failure. It is a policy failure. When compliance is unaffordable, the system itself creates the shadow economy it claims to regulate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section id="actions" className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-[24px] font-semibold text-[#111827]">What to Do Right Now</h2>
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
      <section id="emails" className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="mb-8">
            <h2 className="text-[24px] font-semibold text-[#111827] mb-2">Email Scripts</h2>
            <p className="text-[#6B7280]">
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

      {/* Crèche Directory */}
      <section id="map" className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="mb-8">
            <h2 className="text-[24px] font-semibold text-[#111827] mb-2">Find Crèches Near You</h2>
            <p className="text-[#6B7280]">
              Community-maintained directory covering Dublin, Kildare, Meath &amp; Wicklow. Estimated wait times and openings.
            </p>
          </div>
          
          <CrecheMap creches={creches} />
        </div>
      </section>

      {/* Useful Links */}
      <section id="links" className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16">
          <div className="mb-8">
            <h2 className="text-[24px] font-semibold text-[#111827] mb-2">Useful Links</h2>
            <p className="text-[#6B7280]">
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
                <div className="w-7 h-7 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
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
      <section id="manifesto" className="bg-[#0D1F2D] border-b border-[#1A3348] relative overflow-hidden">
        {/* Playful floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <Baby className="absolute top-10 right-[10%] w-6 h-6 text-[#F59E0B]/10 rotate-6" />
          <Star className="absolute top-[25%] left-[5%] w-4 h-4 text-[#EC4899]/10 -rotate-12" />
          <Heart className="absolute bottom-[20%] right-[6%] w-4 h-4 text-[#60A5FA]/10 rotate-12" />
          <BabyBottle className="absolute bottom-10 left-[8%] w-5 h-5 text-[#F59E0B]/10 rotate-45" />
        </div>
        <div className="max-w-[760px] mx-auto px-5 py-10 sm:py-16 relative z-10">
          <div className="bg-[#0D1F2D] rounded-2xl overflow-hidden">
            {/* Manifesto hero photo */}
            <div className="relative w-full" style={{ maxHeight: '420px' }}>
              <div
                id="manifesto-photo"
                className="w-full h-[280px] sm:h-[420px] bg-[#1A3348]"
              >
                <img src={manifestoImage} alt="Mother holding toddler outside a Dublin crèche gate" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F2D] via-[#0D1F2D]/30 to-transparent pointer-events-none" />
            </div>

            <div className="p-6 sm:p-10 -mt-6 relative z-10">
            
            {/* Childhood quote */}
            <div className="mb-8 p-5 bg-white/5 border border-white/10 rounded-xl flex gap-4 items-start">
              <span className="flex-shrink-0 mt-0.5 text-[#F59E0B]/60" aria-hidden="true">
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
                  <a
                    href="https://www.facebook.com/groups/returnkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#111827] rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Join the conversation
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-[#7EACC4]">
                  <strong className="text-white">Sources:</strong> Tax rates from revenue.ie • NCS from ncs.gov.ie • ECCE from gov.ie • Core Funding rates from gov.ie • Childminder registration from tusla.ie • Minimum wage (€14.15/hr) from gov.ie
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 border-t border-[#E5E7EB]">
        <div className="max-w-[760px] mx-auto px-5">
          <div className="space-y-4">
            <div className="text-sm text-[#6B7280] space-y-1">
              <TransparentLogo src={logoImage} alt="ReturnKit: The Real Cost of Returning to Work" className="h-[151px] mb-1" />
              <p className="text-xs">March 2026 • Built by parents, for parents • Based on Budget 2025</p>
            </div>
            
            {/* Community Link */}
            <div>
              <a 
                href="https://www.facebook.com/groups/returnkit"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#374151] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
              >
                <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook Group
              </a>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
              <p className="text-xs text-[#9CA3AF]">No data collected • No cookies • Open source</p>
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </footer>

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
