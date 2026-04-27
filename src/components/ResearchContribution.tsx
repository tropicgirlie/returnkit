import { useState } from 'react';
import { CheckCircle2, Database, TrendingUp, Users, Shield } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ResearchContributionProps {
  grossSalary: number;
  monthlyCost: number;
  childcareType: string;
  hoursPerWeek: number;
  region?: string;
}

function salaryToBand(salary: number): string {
  if (salary < 30000) return 'Under €30k';
  if (salary < 40000) return '€30k to €40k';
  if (salary < 50000) return '€40k to €50k';
  if (salary < 60000) return '€50k to €60k';
  if (salary < 70000) return '€60k to €70k';
  if (salary < 85000) return '€70k to €85k';
  return '€85k+';
}

function childcareCostToBand(cost: number): string {
  if (cost < 600) return 'Under €600';
  if (cost < 800) return '€600 to €800';
  if (cost < 1000) return '€800 to €1,000';
  if (cost < 1200) return '€1,000 to €1,200';
  if (cost < 1400) return '€1,200 to €1,400';
  return '€1,400+';
}

export function ResearchContribution({
  grossSalary,
  monthlyCost,
  childcareType,
  hoursPerWeek,
  region = 'Dublin'
}: ResearchContributionProps) {
  const [step, setStep] = useState<'consent' | 'form' | 'submitted' | 'hidden'>('consent');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [industrySector, setIndustrySector] = useState('');
  const [maternityLeaveWeeks, setMaternityLeaveWeeks] = useState('');
  const [returnToWorkStatus, setReturnToWorkStatus] = useState('');
  const [workArrangement, setWorkArrangement] = useState('');

  const handleConsent = () => {
    if (!consentChecked) return;
    setStep('form');
  };

  const handleSkip = () => {
    setStep('hidden');
  };

  const handleSubmit = async () => {
    if (!industrySector || !returnToWorkStatus || !workArrangement) {
      setError('Please answer all required questions');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0c75c66f/research-contribution`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            region,
            industry_sector: industrySector,
            salary_band: salaryToBand(grossSalary),
            monthly_childcare_cost_band: childcareCostToBand(monthlyCost),
            childcare_type: childcareType,
            maternity_leave_weeks: maternityLeaveWeeks ? parseInt(maternityLeaveWeeks) : null,
            return_to_work_status: returnToWorkStatus,
            work_arrangement: workArrangement,
            hours_per_week: hoursPerWeek
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStep('submitted');
    } catch (err) {
      console.error('Research contribution error:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'hidden') return null;

  if (step === 'consent') {
    return (
      <div className="mt-8 bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#7EACC4]/10 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6 text-[#7EACC4]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#0D1F2D] mb-1">
              Help improve maternal workforce research
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Takes 60 seconds. Your responses are fully anonymised before storage.
            </p>

            <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4 text-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#059669]" />
                <p className="font-semibold text-[#0D1F2D]">What is and is not collected</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5">Collected (bands only)</p>
                  <ul className="space-y-0.5 text-[#6B7280]">
                    <li>• Salary band (e.g. €50k to €60k)</li>
                    <li>• Childcare cost band</li>
                    <li>• Industry sector</li>
                    <li>• Work arrangement</li>
                    <li>• Return-to-work status</li>
                    <li>• Region (Dublin area)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-1.5">Never collected</p>
                  <ul className="space-y-0.5 text-[#6B7280]">
                    <li>• Name or email address</li>
                    <li>• Exact salary or cost figures</li>
                    <li>• IP address or device ID</li>
                    <li>• Any identifier that could be linked back to you</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 mb-5 text-sm">
              <p className="font-semibold text-[#1E40AF] mb-1">How your data will be used</p>
              <p className="text-[#3B82F6] leading-relaxed">
                Your anonymised responses will be used by{' '}
                <a href="https://momops.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">MomOps</a>{' '}
                for research, policy advocacy, and may be shared with or licensed to third-party organisations such as employers, policy researchers, and journalists in aggregated form only.
              </p>
              <p className="mt-2 text-[#3B82F6]">
                Because no identifiers are stored, submitted responses cannot be deleted on request. There is no way to locate your specific entry in the dataset. You can decline to participate by selecting "No thanks" below.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-5 group">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-[#D1D5DB] text-[#0D1F2D] focus:ring-[#7EACC4] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-[#374151] leading-relaxed group-hover:text-[#0D1F2D] transition-colors">
                I understand that my anonymised data will be used for research and may be shared with or licensed to third parties in aggregated form. I accept that because no personal identifiers are collected, this submission cannot be withdrawn after it is sent.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={handleConsent}
                disabled={!consentChecked}
                className="flex-1 bg-[#0D1F2D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a3a4d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Contribute Anonymously
              </button>
              <button
                onClick={handleSkip}
                className="px-6 py-3 rounded-lg font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="mt-8 bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#7EACC4]/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-[#7EACC4]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0D1F2D] mb-1">Quick research questions</h3>
            <p className="text-sm text-[#6B7280]">A few more details to help build the full picture</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0D1F2D] mb-2">
              Industry sector <span className="text-red-500">*</span>
            </label>
            <select
              value={industrySector}
              onChange={(e) => setIndustrySector(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#E5E7EB] focus:border-[#7EACC4] focus:outline-none"
            >
              <option value="">Select industry...</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Legal">Legal</option>
              <option value="Public Sector">Public Sector</option>
              <option value="Retail/Hospitality">Retail/Hospitality</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Creative/Media">Creative/Media</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D1F2D] mb-2">
              Maternity leave taken (weeks){' '}
              <span className="text-[#9CA3AF] font-normal">optional</span>
            </label>
            <input
              type="number"
              value={maternityLeaveWeeks}
              onChange={(e) => setMaternityLeaveWeeks(e.target.value)}
              placeholder="e.g. 26"
              min={1}
              max={104}
              className="w-full px-4 py-3 rounded-lg border-2 border-[#E5E7EB] focus:border-[#7EACC4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D1F2D] mb-2">
              Return to work status <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                'Returned full-time',
                'Returned part-time',
                'Returned to work but in another company',
                'Planning to return',
                'Extended leave',
                'Did not return',
              ].map((value) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="returnStatus"
                    value={value}
                    checked={returnToWorkStatus === value}
                    onChange={(e) => setReturnToWorkStatus(e.target.value)}
                    className="w-4 h-4 text-[#7EACC4] focus:ring-[#7EACC4]"
                  />
                  <span className="text-[#374151]">{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0D1F2D] mb-2">
              Work arrangement <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {['Remote', 'Hybrid', 'Office-based'].map((value) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workArrangement"
                    value={value}
                    checked={workArrangement === value}
                    onChange={(e) => setWorkArrangement(e.target.value)}
                    className="w-4 h-4 text-[#7EACC4] focus:ring-[#7EACC4]"
                  />
                  <span className="text-[#374151]">{value}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#0D1F2D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a3a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'submitted') {
    return (
      <div className="mt-8 bg-gradient-to-br from-[#059669]/5 to-[#7EACC4]/5 rounded-xl border border-[#059669] p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#059669] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#0D1F2D] mb-2">Thank you for contributing</h3>
            <p className="text-[#374151] mb-4 leading-relaxed">
              Your anonymised data will help{' '}
              <a href="https://momops.org" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-medium">
                MomOps
              </a>{' '}
              build evidence for policy change and support mothers navigating the return-to-work decision.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <TrendingUp className="w-4 h-4" />
              <span>Your response has been recorded</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
