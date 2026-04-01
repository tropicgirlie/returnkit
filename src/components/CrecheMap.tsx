import { useState, useEffect } from 'react';
import { MapPin, Info, Clock, Calendar, ChevronDown, ChevronUp, Navigation, MapPinOff } from 'lucide-react';
import type { CrecheEntry } from './AdminPanel';
import { AREAS as AREA_DEFS, AREA_LABELS, getAreaByLabel, findNearestArea } from '../data/areas';

const STORAGE_KEY = 'returnkit-creches';

// Start with empty list — add real crèches via the admin panel as you do outreach
const SEED_CRECHES: CrecheEntry[] = [];

export function loadCreches(): CrecheEntry[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveCreches(creches: CrecheEntry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creches));
  }
}

interface CrecheMapProps {
  creches: CrecheEntry[];
}

export function CrecheMap({ creches }: CrecheMapProps) {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [showTransparency, setShowTransparency] = useState(false);
  const [collapsedAreas, setCollapsedAreas] = useState<Record<string, boolean>>({});
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [detectedArea, setDetectedArea] = useState<string | null>(null);

  // Derive unique areas from data
  const uniqueAreas = Array.from(new Set(creches.map((c) => c.area))).sort();
  const areas = ['All', ...uniqueAreas];

  // Auto-detect location → pre-select nearest area
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestArea(latitude, longitude, uniqueAreas);
        if (nearest) {
          setSelectedArea(nearest);
          setDetectedArea(nearest);
        }
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, [uniqueAreas.join(',')]);

  // Group crèches by area
  const groupedCreches: Record<string, CrecheEntry[]> = {};
  const crechesToShow = selectedArea === 'All' ? creches : creches.filter((c) => c.area === selectedArea);

  for (const c of crechesToShow) {
    if (!groupedCreches[c.area]) groupedCreches[c.area] = [];
    groupedCreches[c.area].push(c);
  }

  // Sort areas: detected area first, then alphabetical
  const sortedGroupKeys = Object.keys(groupedCreches).sort((a, b) => {
    if (detectedArea) {
      if (a === detectedArea) return -1;
      if (b === detectedArea) return 1;
    }
    return a.localeCompare(b);
  });

  const toggleAreaCollapse = (area: string) => {
    setCollapsedAreas((prev) => ({ ...prev, [area]: !prev[area] }));
  };

  const totalCount = crechesToShow.length;

  // Latest update
  const latestUpdate = creches.length
    ? creches.reduce((latest, c) => (c.lastUpdated > latest ? c.lastUpdated : latest), creches[0].lastUpdated)
    : null;

  return (
    <div>
      {/* Location Banner */}
      {locationStatus === 'loading' && (
        <div className="mb-4 px-4 py-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex items-center gap-3 text-sm text-[#1E40AF]">
          <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin flex-shrink-0" />
          Finding your location to show nearby cr{'\u00E8'}ches...
        </div>
      )}
      {locationStatus === 'granted' && detectedArea && (
        <div className="mb-4 px-4 py-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg flex items-center gap-3 text-sm text-[#166534]">
          <Navigation className="w-4 h-4 flex-shrink-0" />
          <span>
            Showing cr{'\u00E8'}ches near you. <strong>{detectedArea}</strong> selected.
            <button
              type="button"
              onClick={() => { setSelectedArea('All'); setDetectedArea(null); }}
              className="ml-2 underline hover:no-underline"
            >
              Show all areas
            </button>
          </span>
        </div>
      )}
      {locationStatus === 'denied' && (
        <div className="mb-4 px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center gap-3 text-sm text-[#6B7280]">
          <MapPinOff className="w-4 h-4 flex-shrink-0" />
          <span>
            Location access unavailable. Showing all Dublin areas. Allow location to auto-filter.
          </span>
        </div>
      )}

      {/* Transparency Notice */}
      <div className="mb-6 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[#111827] text-sm mb-1">
              How this data works
            </h4>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              There is no central system in Ireland that shows live childcare vacancies. The information below is manually gathered and updated. Wait times and openings are <strong className="text-[#111827]">estimates</strong>, not guarantees.
            </p>

            <button
              type="button"
              onClick={() => setShowTransparency(!showTransparency)}
              className="mt-2 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
            >
              {showTransparency ? 'Hide details' : 'Why can\u2019t this be automated?'}
            </button>

            {showTransparency && (
              <div className="mt-3 pt-3 border-t border-[#E5E7EB] space-y-2 text-xs text-[#6B7280] leading-relaxed">
                <p>
                  <strong className="text-[#374151]">No public vacancy data exists.</strong> Official registers (Tusla, NCS) confirm which services are registered, but not whether they have places available.
                </p>
                <p>
                  <strong className="text-[#374151]">Each service manages its own list.</strong> There is no shared system. Contacting multiple providers and following up is the most effective strategy.
                </p>
                <p>
                  <strong className="text-[#374151]">We update this manually.</strong> We contact providers, gather info from parents, and update estimates when we can. If you have better information, let us know via our <a href="https://www.facebook.com/groups/returnkit" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Facebook group</a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Area Filter Pills */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-[#6B7280]">Filter by area</label>
          <span className="text-xs text-[#9CA3AF]">
            {totalCount} cr{'\u00E8'}che{totalCount !== 1 ? 's' : ''}
            {latestUpdate && ` · Updated ${latestUpdate}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => {
            const count = area === 'All' ? creches.length : creches.filter((c) => c.area === area).length;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3.5 py-2 rounded-full text-sm transition-all flex items-center gap-1.5 ${
                  selectedArea === area
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {area}
                <span className={`text-xs ${
                  selectedArea === area ? 'text-[#9CA3AF]' : 'text-[#9CA3AF]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Crèche List — Grouped by Area */}
      {totalCount === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-[#9CA3AF]" />
          </div>
          <p className="text-sm text-[#6B7280] mb-1">No cr{'\u00E8'}ches listed yet{selectedArea !== 'All' ? ` in ${selectedArea}` : ''}.</p>
          <p className="text-xs text-[#9CA3AF]">Listings are added manually as we contact providers.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedGroupKeys.map((area) => {
            const areaCreches = groupedCreches[area];
            const isCollapsed = collapsedAreas[area] ?? false;
            const isDetected = area === detectedArea;

            return (
              <div key={area} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                {/* Area Header — collapsible */}
                <button
                  type="button"
                  onClick={() => toggleAreaCollapse(area)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                    isDetected ? 'bg-[#F0FDF4]' : 'bg-[#F9FAFB]'
                  } hover:bg-[#F3F4F6]`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isDetected ? 'text-[#059669]' : 'text-[#6B7280]'}`} />
                    <span className="font-semibold text-[#111827] text-sm">{area}</span>
                    <span className="text-xs text-[#9CA3AF] bg-white px-2 py-0.5 rounded-full">
                      {areaCreches.length}
                    </span>
                    {isDetected && (
                      <span className="text-xs text-[#059669] font-medium">Near you</span>
                    )}
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                </button>

                {/* Area Crèches */}
                {!isCollapsed && (
                  <div className="divide-y divide-[#F3F4F6]">
                    {areaCreches.map((creche) => (
                      <div
                        key={creche.id}
                        className="px-4 py-4 bg-white hover:bg-[#FAFAFA] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[#111827] truncate">{creche.name}</h4>
                              {creche.ncsRegistered && (
                                <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#059669] rounded-full text-xs font-semibold flex-shrink-0">
                                  NCS
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#6B7280]">{creche.address}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                          {creche.estimatedWaitMonths && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <div>
                                <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Wait</div>
                                <div className="text-sm font-semibold text-[#111827]">
                                  {creche.estimatedWaitMonths}
                                </div>
                              </div>
                            </div>
                          )}
                          {creche.estimatedOpenings && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              <div>
                                <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Openings</div>
                                <div className="text-sm font-semibold text-[#111827]">
                                  {creche.estimatedOpenings}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="ml-auto text-xs text-[#9CA3AF]">
                            {creche.lastUpdated}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Note */}
      <div className="mt-6 p-4 bg-[#FEF3C7] border border-[#FCD34D] rounded-lg">
        <p className="text-sm text-[#92400E]">
          <strong>Important:</strong> Wait times and opening estimates are based on community reports and direct enquiries. They change frequently. Always contact providers directly. Our <a href="#emails" className="underline hover:no-underline">email templates</a> can help.
        </p>
      </div>
    </div>
  );
}