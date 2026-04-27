import { X } from 'lucide-react';

interface DataPartnersModalProps {
  onClose: () => void;
}

export function DataPartnersModal({ onClose }: DataPartnersModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="data-partners-title"
        className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#374151] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="data-partners-title" className="text-xl font-bold text-[#0D1F2D] mb-2">
          Research Partnerships
        </h2>
        <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
          ReturnKit aggregates anonymised data on how childcare costs, income, and work arrangements
          affect maternal workforce participation in Ireland. This dataset does not exist anywhere else.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-[#F9FAFB] rounded-xl p-4 text-sm">
            <p className="font-semibold text-[#0D1F2D] mb-2">What the dataset contains</p>
            <ul className="space-y-1 text-[#6B7280]">
              <li>• Salary bands by industry sector and region</li>
              <li>• Monthly childcare cost bands</li>
              <li>• Return-to-work rates by employment type and work arrangement</li>
              <li>• Maternity leave duration</li>
              <li>• Childcare type (registered, unregistered, nanny)</li>
            </ul>
          </div>

          <div className="bg-[#F9FAFB] rounded-xl p-4 text-sm">
            <p className="font-semibold text-[#0D1F2D] mb-2">Who uses it</p>
            <ul className="space-y-1 text-[#6B7280]">
              <li>• HR teams and employers benchmarking parental leave policies</li>
              <li>• Policy researchers and government bodies</li>
              <li>• Journalists and media organisations</li>
              <li>• Academic researchers</li>
              <li>• Trade unions and advocacy groups</li>
            </ul>
          </div>

          <div className="bg-[#F9FAFB] rounded-xl p-4 text-sm">
            <p className="font-semibold text-[#0D1F2D] mb-2">Data standards</p>
            <p className="text-[#6B7280]">
              All data is collected with explicit user consent. No personal identifiers are stored.
              Dataset access is provided as aggregated reports or anonymised exports only.
            </p>
          </div>
        </div>

        <a
          href="mailto:hello@momops.org?subject=ReturnKit data partnership enquiry"
          className="block w-full text-center bg-[#0D1F2D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a3a4d] transition-colors"
        >
          Get in touch
        </a>
        <p className="text-xs text-center text-[#9CA3AF] mt-3">
          We respond within 2 working days
        </p>
      </div>
    </div>
  );
}
