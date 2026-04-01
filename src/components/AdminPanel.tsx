import { useState } from 'react';
import { Plus, Trash2, X, Edit2, Save, Shield, Info } from 'lucide-react';
import { AREAS as AREA_DEFS, AREA_LABELS } from '../data/areas';

export interface CrecheEntry {
  id: string;
  name: string;
  address: string;
  area: string;
  estimatedWaitMonths: string;
  estimatedOpenings: string;
  ncsRegistered: boolean;
  addedDate: string;
  lastUpdated: string;
}

interface AdminPanelProps {
  creches: CrecheEntry[];
  onAdd: (creche: Omit<CrecheEntry, 'id' | 'addedDate' | 'lastUpdated'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, creche: Partial<CrecheEntry>) => void;
  onClose: () => void;
}

const ADMIN_PASSWORD = 'returnkit2025';

/** Renders an area option label with districts + examples for admin context */
function areaOptionLabel(label: string): string {
  const def = AREA_DEFS.find((a) => a.label === label);
  if (!def) return label;
  const parts: string[] = [label];
  if (def.districts.length > 0) {
    parts.push(`(${def.districts.join(', ')})`);
  }
  return parts.join(' ');
}

/** Renders an area's example suburbs as helper text */
function areaExamples(label: string): string {
  const def = AREA_DEFS.find((a) => a.label === label);
  if (!def || def.examples.length === 0) return '';
  return def.examples.join(', ');
}

export function AdminPanel({ creches, onAdd, onDelete, onUpdate, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('returnkit-admin-auth') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAreaRef, setShowAreaRef] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    area: AREA_LABELS[0],
    estimatedWaitMonths: '',
    estimatedOpenings: '',
    ncsRegistered: true,
  });
  const [editData, setEditData] = useState<Partial<CrecheEntry>>({});

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.address.trim()) return;
    onAdd(formData);
    setFormData({
      name: '',
      address: '',
      area: AREA_LABELS[0],
      estimatedWaitMonths: '',
      estimatedOpenings: '',
      ncsRegistered: true,
    });
    setShowAddForm(false);
  };

  const handleStartEdit = (creche: CrecheEntry) => {
    setEditingId(creche.id);
    setEditData({
      name: creche.name,
      address: creche.address,
      area: creche.area,
      estimatedWaitMonths: creche.estimatedWaitMonths,
      estimatedOpenings: creche.estimatedOpenings,
      ncsRegistered: creche.ncsRegistered,
    });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('returnkit-admin-auth', 'true');
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('returnkit-admin-auth');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[720px] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111827] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#111827]">Crèche Admin</h2>
              <p className="text-xs text-[#6B7280]">{isAuthenticated ? `${creches.length} listings · Data saved locally` : 'Password required'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Password Gate */
          <div className="p-8">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-16 h-16 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#6B7280]" />
              </div>
              <h3 className="font-semibold text-[#111827] mb-2">Admin Access</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                This panel is for manually adding and updating crèche listings. Enter the admin password to continue.
              </p>
              <div className="space-y-3">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className={`w-full h-11 px-4 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${
                    passwordError ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
                  }`}
                  placeholder="Enter password"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-[#DC2626]">Incorrect password. Try again.</p>
                )}
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={!passwordInput.trim()}
                  className="w-full px-4 py-2.5 bg-[#111827] text-white text-sm font-medium rounded-lg hover:bg-[#1F2937] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        ) : (
        <>
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">

          {/* Area Reference Guide — toggleable */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowAreaRef(!showAreaRef)}
              className="flex items-center gap-2 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
            >
              <Info className="w-3.5 h-3.5" />
              {showAreaRef ? 'Hide' : 'Show'} area reference guide
            </button>

            {showAreaRef && (
              <div className="mt-3 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                <div className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-3">
                  Area Categories & Districts
                </div>
                <div className="space-y-2.5">
                  {AREA_DEFS.map((area) => (
                    <div key={area.id} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#111827]">{area.label}</span>
                        {area.districts.length > 0 && (
                          <span className="text-xs text-[#6B7280]">
                            ({area.districts.join(', ')})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#9CA3AF]">
                        {area.examples.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add Button */}
          {!showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#D1D5DB] rounded-lg text-sm text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Crèche
            </button>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="mb-6 p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
              <h3 className="font-semibold text-[#111827] mb-4">Add Crèche</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="e.g. Giggles Montessori"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full h-10 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="e.g. 12 Main St, Ranelagh, Dublin 6"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
                    Area
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full h-10 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    {AREA_DEFS.map((a) => (
                      <option key={a.id} value={a.label}>
                        {a.label}{a.districts.length > 0 ? ` — ${a.districts.join(', ')}` : ''}
                      </option>
                    ))}
                  </select>
                  {formData.area && (
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      {areaExamples(formData.area)}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
                      NCS Registered
                    </label>
                    <select
                      value={formData.ncsRegistered ? 'yes' : 'no'}
                      onChange={(e) => setFormData({ ...formData, ncsRegistered: e.target.value === 'yes' })}
                      className="w-full h-10 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
                      Est. Wait Time
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedWaitMonths}
                      onChange={(e) => setFormData({ ...formData, estimatedWaitMonths: e.target.value })}
                      className="w-full h-10 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                      placeholder="e.g. 18-24 months"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-1.5">
                    Est. Openings
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedOpenings}
                    onChange={(e) => setFormData({ ...formData, estimatedOpenings: e.target.value })}
                    className="w-full h-10 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                    placeholder="e.g. September 2026"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!formData.name.trim() || !formData.address.trim()}
                    className="flex-1 px-4 py-2.5 bg-[#111827] text-white text-sm font-medium rounded-lg hover:bg-[#1F2937] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add Crèche
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2.5 text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Listings */}
          {creches.length === 0 ? (
            <div className="text-center py-12 text-[#9CA3AF]">
              <p className="text-sm">No crèches added yet.</p>
              <p className="text-xs mt-1">Use the button above to add your first listing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {creches.map((creche) => (
                <div key={creche.id} className="p-4 border border-[#E5E7EB] rounded-lg">
                  {editingId === creche.id ? (
                    /* Edit Mode */
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full h-9 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        placeholder="Crèche name"
                      />
                      <input
                        type="text"
                        value={editData.address || ''}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        className="w-full h-9 px-3 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        placeholder="Address"
                      />
                      <div>
                        <select
                          value={editData.area || ''}
                          onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                          className="w-full h-9 px-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        >
                          {AREA_DEFS.map((a) => (
                            <option key={a.id} value={a.label}>
                              {a.label}{a.districts.length > 0 ? ` — ${a.districts.join(', ')}` : ''}
                            </option>
                          ))}
                        </select>
                        {editData.area && (
                          <p className="mt-1 text-xs text-[#9CA3AF]">
                            {areaExamples(editData.area)}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editData.estimatedWaitMonths || ''}
                          onChange={(e) => setEditData({ ...editData, estimatedWaitMonths: e.target.value })}
                          placeholder="Wait time"
                          className="h-9 px-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                        <input
                          type="text"
                          value={editData.estimatedOpenings || ''}
                          onChange={(e) => setEditData({ ...editData, estimatedOpenings: e.target.value })}
                          placeholder="Openings"
                          className="h-9 px-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <input
                            type="checkbox"
                            checked={editData.ncsRegistered ?? true}
                            onChange={(e) => setEditData({ ...editData, ncsRegistered: e.target.checked })}
                            className="w-4 h-4 rounded border-[#D1D5DB]"
                          />
                          NCS Registered
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] text-white text-xs font-medium rounded-lg hover:bg-[#1F2937]"
                        >
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); setEditData({}); }}
                          className="px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#111827]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-[#111827] text-sm">{creche.name}</h4>
                          <p className="text-xs text-[#6B7280]">{creche.address} · {creche.area}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(creche)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#6B7280]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(creche.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FEF2F2] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                        {creche.estimatedWaitMonths && (
                          <span>Wait: <strong className="text-[#111827]">{creche.estimatedWaitMonths}</strong></span>
                        )}
                        {creche.estimatedOpenings && (
                          <span>Openings: <strong className="text-[#111827]">{creche.estimatedOpenings}</strong></span>
                        )}
                        {creche.ncsRegistered && (
                          <span className="text-[#059669] font-semibold">NCS ✓</span>
                        )}
                        <span className="text-[#9CA3AF]">Updated {creche.lastUpdated}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-xl flex items-center justify-between">
          <p className="text-xs text-[#9CA3AF]">
            All data is stored in your browser. Export/import coming soon.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-[#9CA3AF] hover:text-[#DC2626] transition-colors"
          >
            Lock
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
