import { X } from 'lucide-react';

interface MaternityExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MaternityExplainerModal({ isOpen, onClose }: MaternityExplainerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="maternity-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 id="maternity-modal-title" className="font-semibold text-[#111827]">How Maternity Leave Actually Works</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 flex items-center justify-center hover:bg-[#F3F4F6] rounded-lg text-[#6B7280] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Universal Pattern */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3">The Universal Pattern (Every Country)</h4>
            <div className="bg-[#111827] text-white rounded-xl p-5 space-y-4 text-sm">
              <div>
                <p className="text-[#9CA3AF] mb-1 text-xs uppercase tracking-wider">Layer 1: Government Baseline</p>
                <p>Minimum benefit, usually 50-70% of previous earnings. Rarely covers actual living costs in cities.</p>
              </div>
              <div className="pt-4 border-t border-[#374151]">
                <p className="text-[#9CA3AF] mb-1 text-xs uppercase tracking-wider">Layer 2: Employer Supplement (Optional)</p>
                <p>Company decides whether to top up government payment to something liveable. This is where inequality happens.</p>
              </div>
              <div className="pt-4 border-t border-[#374151]">
                <p className="text-[#9CA3AF] mb-1 text-xs uppercase tracking-wider">Layer 3: Unpaid Protected Leave</p>
                <p>Job security but zero income. Whether you can afford this depends entirely on Layers 1+2.</p>
              </div>
            </div>
          </div>

          {/* The Inequality */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3">Why This Creates Structural Inequality</h4>
            <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4 text-sm text-[#374151] leading-relaxed">
              <p className="mb-3">Government baseline rarely covers rent, existing childcare, or basic expenses in urban areas.</p>
              <p className="mb-3">Whether you can afford longer leave depends <strong className="text-[#111827]">entirely on employer choice to supplement.</strong></p>
              <p className="text-[#DC2626] font-semibold mb-2">Predictable class divide:</p>
              <ul className="list-disc ml-4 space-y-1 text-xs text-[#6B7280]">
                <li>Professional class jobs (tech, finance, public sector): supplement to near-full pay</li>
                <li>Precarious jobs (retail, hospitality, small companies): government baseline only</li>
                <li>The gap compounds: pension contributions, career continuity, savings all diverge</li>
              </ul>
            </div>
          </div>

          {/* Ireland Specifics */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3">How This Plays Out in Ireland</h4>
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 space-y-2 text-sm text-[#374151]">
              <p><strong className="text-[#111827]">Government Baseline:</strong> €289/week (€1,256/month) for 26 weeks</p>
              <p className="text-[#6B7280]">Taxed, so ~€1,150-1,200/month after tax</p>
              <p className="text-[#6B7280]">Then 16 weeks unpaid (job-protected)</p>
              <p className="text-xs text-[#2563EB] mt-2">This is 50-70% of median earnings, but rent alone in Dublin is €1,500-2,200/month.</p>
            </div>
          </div>

          {/* Reality Check: €45k tech worker */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3">Reality Check: Tech Worker on €45k</h4>
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 text-sm text-[#374151] space-y-3">
              <p className="leading-relaxed">
                €45k sounds comfortable. It is not comfortable enough for 6 months unpaid leave in Dublin.
              </p>
              <div className="bg-white/80 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Monthly take-home (working)</span>
                  <span className="text-[#111827] font-semibold">~€2,900</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Maternity Benefit (26 weeks)</span>
                  <span className="text-[#D97706] font-semibold">~€1,150/mo after tax</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Unpaid leave (16 weeks)</span>
                  <span className="text-[#DC2626] font-semibold">€0</span>
                </div>
                <div className="border-t border-[#FDE68A] pt-2 flex justify-between">
                  <span className="text-[#6B7280]">Monthly shortfall on maternity</span>
                  <span className="text-[#DC2626] font-semibold">-€1,750</span>
                </div>
              </div>
              <p className="text-xs text-[#92400E] leading-relaxed">
                <strong>Dublin rent alone is €1,500-2,200/month.</strong> The maternity benefit does not cover rent, let alone food, transport, utilities, and existing childcare for older children.
              </p>
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-3 space-y-2 text-xs text-[#6B7280]">
                <p className="text-[#DC2626] font-semibold text-sm">Why welfare top-ups don't apply</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Working Family Payment requires 38+ hours/week of employment. You are on leave, not working.</li>
                  <li>Supplementary Welfare Allowance is means-tested on household income. If your partner earns anything, you are likely disqualified.</li>
                  <li>Medical card income thresholds are well below €45k. You will not qualify.</li>
                  <li>Rent supplement is not available if you have an existing lease at market rates and a working partner.</li>
                </ul>
                <p className="text-[#374151] mt-1 leading-relaxed">
                  The welfare system is designed for unemployment and poverty. A tech worker on maternity leave falls into a gap: too high-earning to qualify for supports, too low-earning to absorb a 60% pay cut for 10 months.
                </p>
              </div>
              <p className="text-xs text-[#78716C] leading-relaxed">
                The maths is stark. Without employer top-up, a tech worker on €45k must either save €10,500+ in advance (6 months × €1,750 shortfall), go into debt, or return to work earlier than planned. Most do not have that buffer, especially if paying Dublin rent and existing childcare costs.
              </p>
            </div>
          </div>

          {/* Scenarios */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3">Real Scenarios</h4>
            
            <div className="space-y-3">
              {/* Scenario 1 */}
              <div className="border border-[#FEE2E2] bg-[#FEF2F2] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#DC2626] rounded-full flex items-center justify-center text-xs text-white font-semibold">1</div>
                  <h5 className="text-sm font-semibold text-[#111827]">Government Baseline Only</h5>
                </div>
                <div className="text-sm text-[#6B7280] space-y-1 ml-8">
                  <p>Get ~€1,150/month (vs €2,000+ normal take-home)</p>
                  <p>Pension contributions stop</p>
                  <p>Must return at 3-4 months to afford rent + expenses</p>
                  <p className="text-[#DC2626] mt-2 text-xs"><strong>Who this affects:</strong> Retail workers, hospitality, small businesses, recent hires.</p>
                </div>
              </div>

              {/* Scenario 2 */}
              <div className="border border-[#BBF7D0] bg-[#F0FDF4] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#059669] rounded-full flex items-center justify-center text-xs text-white font-semibold">2</div>
                  <h5 className="text-sm font-semibold text-[#111827]">Full Employer Supplement</h5>
                </div>
                <div className="text-sm text-[#6B7280] space-y-1 ml-8">
                  <p>Company tops up to 100% of normal salary for 6 months</p>
                  <p>Pension contributions continue</p>
                  <p>Can save €10-15k during paid period, then afford 6 months unpaid</p>
                  <p className="text-[#059669] mt-2 text-xs"><strong>Who gets this:</strong> Big tech, banks, public sector, large multinationals.</p>
                </div>
              </div>

              {/* Scenario 3 */}
              <div className="border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#F59E0B] rounded-full flex items-center justify-center text-xs text-white font-semibold">3</div>
                  <h5 className="text-sm font-semibold text-[#111827]">Partial Supplement (75-80%)</h5>
                </div>
                <div className="text-sm text-[#6B7280] space-y-1 ml-8">
                  <p>Company tops up to 75-80% of salary</p>
                  <p>Pension usually continues</p>
                  <p>More sustainable than baseline, but still financial strain</p>
                  <p className="text-xs text-[#9CA3AF] mt-2">Mid-size companies, some startups with investor pressure to offer benefits.</p>
                </div>
              </div>
            </div>
          </div>

          {/* The Real Comparison */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3">The Same Person, Different Employer</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
                <div className="text-xs text-[#059669] font-semibold mb-2">Tech Co. (with top-up)</div>
                <div className="text-sm text-[#111827] space-y-2">
                  <p>Earning €45k</p>
                  <p className="text-xs text-[#6B7280]">6 months at full pay = €17.4k</p>
                  <p className="text-xs text-[#6B7280]">Pension keeps growing</p>
                  <p className="text-xs text-[#6B7280]">Can save buffer for unpaid months</p>
                  <p className="text-xs text-[#059669] mt-2 font-semibold">Total leave: 10-12 months</p>
                </div>
              </div>
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4">
                <div className="text-xs text-[#DC2626] font-semibold mb-2">Startup (no top-up)</div>
                <div className="text-sm text-[#111827] space-y-2">
                  <p>Same €45k salary</p>
                  <p className="text-xs text-[#6B7280]">6 months at €1,150/mo = €6.9k</p>
                  <p className="text-xs text-[#6B7280]">Pension frozen</p>
                  <p className="text-xs text-[#6B7280]">Can't cover Dublin rent on benefit</p>
                  <p className="text-xs text-[#DC2626] mt-2 font-semibold">Total leave: 4-5 months</p>
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
              <p className="text-xs text-[#6B7280] leading-relaxed">
                <strong className="text-[#111827]">Same person. Same salary. Same skills. Same baby.</strong> The 6-month difference is purely employer choice. Over a career, this compounds into massive pension gaps and earnings differences. Welfare does not bridge this gap.
              </p>
            </div>
          </div>

          {/* Not About Policy */}
          <div>
            <h4 className="text-sm font-semibold text-[#111827] mb-3">This Isn't About Government Policy Alone</h4>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 text-sm text-[#6B7280] leading-relaxed">
              <p className="mb-2">Even in countries with generous state systems (Sweden: 80%, Germany: 65%), there are still employer variations and class differences in who can afford career gaps.</p>
              <p className="mb-2 text-[#374151]">The constant across all systems:</p>
              <ol className="list-decimal ml-4 space-y-1 text-xs">
                <li>Government provides inadequate baseline</li>
                <li>Employer decision to supplement creates class divide</li>
                <li>Care infrastructure becomes privilege, not right</li>
              </ol>
              <p className="text-[#111827] mt-3 text-xs font-semibold">The gap isn't about individual governments failing. It's about leaving care work to market forces and employer discretion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}