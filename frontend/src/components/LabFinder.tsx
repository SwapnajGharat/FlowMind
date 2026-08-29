import React, { useState, useMemo } from 'react';
import { LabFacility } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Navigation, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink,
  X
} from 'lucide-react';

interface LabFinderProps {
  labs: LabFacility[];
  initialSearch?: string;
  onScheduleLab?: (labName: string) => void;
}

export const LabFinder: React.FC<LabFinderProps> = ({
  labs,
  initialSearch = '',
  onScheduleLab,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedLabId, setSelectedLabId] = useState<string>(labs[0]?.id || '');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLabModal, setActiveLabModal] = useState<LabFacility | null>(null);

  const allDisciplines = useMemo(() => {
    const set = new Set<string>();
    labs.forEach((l) => l.disciplines.forEach((d) => set.add(d)));
    return ['All', ...Array.from(set)];
  }, [labs]);

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      const matchesSearch =
        searchQuery === '' ||
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.pinCode.includes(searchQuery) ||
        lab.disciplines.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDiscipline =
        selectedDiscipline === 'All' || lab.disciplines.includes(selectedDiscipline);

      return matchesSearch && matchesDiscipline;
    });
  }, [labs, searchQuery, selectedDiscipline]);

  const selectedLab = labs.find((l) => l.id === selectedLabId) || filteredLabs[0];

  return (
    <main className="ml-0 md:ml-64 mt-16 flex-1 flex flex-col h-[calc(100vh-64px)] bg-[#F7F9FB] relative overflow-hidden select-none">
      {/* Global Search Header for Map */}
      <div className="w-full bg-white border-b border-[#E2E8F0] p-4 flex flex-wrap items-center gap-4 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex-1 relative max-w-3xl min-w-[260px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#003366]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, PIN code, or testing discipline (e.g., Metallurgical, Chemical)"
            className="w-full bg-[#F7F9FB] pl-12 pr-10 py-2.5 rounded border border-[#E2E8F0] focus:border-[#003366] focus:ring-0 outline-none text-sm text-[#0F172A] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
            className={`bg-[#eeedf2] text-[#001e40] font-mono text-xs uppercase px-4 py-2.5 rounded border border-[#E2E8F0] flex items-center gap-2 hover:bg-[#e2e2e7] transition-colors font-medium ${
              selectedDiscipline !== 'All' ? 'ring-2 ring-[#001e40]' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters {selectedDiscipline !== 'All' ? `(${selectedDiscipline})` : ''}</span>
          </button>

          {showFiltersDropdown && (
            <div 
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in"
              onMouseLeave={() => setShowFiltersDropdown(false)}
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-[#001e40] font-mono uppercase">Testing Discipline</span>
                {selectedDiscipline !== 'All' && (
                  <button
                    onClick={() => setSelectedDiscipline('All')}
                    className="text-[10px] text-red-600 hover:underline font-mono"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {allDisciplines.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDiscipline(d);
                      setShowFiltersDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedDiscipline === d
                        ? 'bg-blue-50 text-[#001e40] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{d}</span>
                    {selectedDiscipline === d && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Facilities List */}
        <div className="w-full lg:w-[450px] bg-white border-r border-[#E2E8F0] overflow-y-auto flex flex-col z-10 shadow-[2px_0_15px_rgba(0,0,0,0.03)] shrink-0 max-h-[50vh] lg:max-h-full">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-end bg-white sticky top-0 z-10">
            <div>
              <h1 className="text-2xl font-semibold text-[#001e40] tracking-tight">
                Accredited Labs
              </h1>
              <p className="text-sm text-[#475569] mt-0.5">
                Found {filteredLabs.length} facilities near your location.
              </p>
            </div>
            <span className="font-mono text-[11px] text-[#475569] uppercase tracking-wider font-medium">
              Sorted by Distance
            </span>
          </div>

          <div className="p-4 flex flex-col gap-3.5">
            {filteredLabs.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm">No accredited labs matched "{searchQuery}".</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedDiscipline('All'); }}
                  className="mt-3 text-xs text-blue-800 font-mono underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredLabs.map((lab) => {
                const isSelected = selectedLabId === lab.id;

                return (
                  <div
                    key={lab.id}
                    onClick={() => setSelectedLabId(lab.id)}
                    className={`bg-white border rounded-lg p-4 transition-all duration-200 cursor-pointer relative group ${
                      isSelected
                        ? 'border-[#003366] shadow-[0_2px_12px_rgba(0,51,102,0.08)] bg-blue-50/20'
                        : 'border-[#E2E8F0] hover:border-[#003366]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-base font-medium text-[#003366] tracking-tight pr-2">
                        {lab.name}
                      </h3>
                      <span className="bg-[#eeedf2] px-2 py-0.5 rounded font-mono text-[11px] text-[#0F172A] border border-[#E2E8F0] whitespace-nowrap font-medium">
                        {lab.distance}
                      </span>
                    </div>

                    <p className="text-xs text-[#475569] mb-3 line-clamp-2 leading-relaxed">
                      {lab.address}
                    </p>

                    <div className="border-t border-[#E2E8F0] pt-2.5 mb-3">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-[#475569] mb-2 font-medium">
                        Accredited Disciplines
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.disciplines.map((d) => (
                          <span
                            key={d}
                            className="bg-[#F7F9FB] px-2 py-0.5 border border-[#E2E8F0] rounded font-mono text-[11px] text-[#0F172A]"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Accreditation</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveLabModal(lab);
                        }}
                        className="text-[#bb0013] font-mono text-xs uppercase flex items-center gap-1 hover:underline font-semibold"
                      >
                        <span>Directions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Interactive Map View */}
        <div className="flex-1 relative bg-[#e2e2e7] overflow-hidden min-h-[350px]">
          {/* Map Base Image */}
          <div
            className="w-full h-full bg-cover bg-center absolute inset-0 transition-transform duration-300"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-P3lhfbf0HbVizIe2YnGA4JYjWRa2Qitj1ScMroioPLPLQtUw5YAjDjHv_EfbmemAUek6aIxY07XPi0HfCvR0mPkvA7NuVS1UdyC9raXiNP3BJq_230AILBi3mQdNKdTxr34Qnnxp2RmJQoYNPsEs-hjjHqK-D8QA7fdemx8iYovP72Y7PJSRvbq0ZHl1xIYWxH23HIRrXbxXiHsLFZJ5nMucLpWk0qu3Hw2ITdkRxYYEMUdQh-njLw')`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: selectedLab
                ? `${selectedLab.coordinates.x}% ${selectedLab.coordinates.y}%`
                : 'center center',
            }}
          />

          {/* Interactive Map Pins */}
          {labs.map((lab) => {
            const isSelected = selectedLabId === lab.id;

            return (
              <div
                key={lab.id}
                onClick={() => setSelectedLabId(lab.id)}
                style={{
                  top: `${lab.coordinates.y}%`,
                  left: `${lab.coordinates.x}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10 transition-transform hover:scale-110"
              >
                {/* Tooltip Tag */}
                <div
                  className={`shadow-md rounded px-2.5 py-1 mb-1 border border-[#E2E8F0] whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#001e40] text-white opacity-100'
                      : 'bg-white text-[#001e40] opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <p className="font-mono text-xs font-bold">{lab.name}</p>
                </div>

                <MapPin
                  className={`w-9 h-9 drop-shadow-md transition-colors ${
                    isSelected
                      ? 'text-[#bb0013] fill-[#bb0013] stroke-white stroke-[1.5]'
                      : 'text-[#001e40] fill-[#001e40]/70 stroke-white'
                  }`}
                />
              </div>
            );
          })}

          {/* Selected Lab Floating Quick Card on Map */}
          {selectedLab && (
            <div className="absolute top-4 left-4 z-20 max-w-sm bg-white/95 backdrop-blur-xs rounded-lg border border-[#E2E8F0] p-4 shadow-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-semibold uppercase">
                  Selected Lab
                </span>
                <span className="font-mono text-xs text-[#001e40] font-bold">
                  {selectedLab.distance} away
                </span>
              </div>
              <h4 className="text-base font-bold text-[#001e40]">{selectedLab.name}</h4>
              <p className="text-xs text-[#475569] mt-1">{selectedLab.address}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setActiveLabModal(selectedLab)}
                  className="bg-[#001e40] text-white px-3 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider font-semibold hover:bg-[#003366] transition-colors"
                >
                  View Details & Book
                </button>
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="w-10 h-10 bg-white rounded shadow-sm border border-[#E2E8F0] flex items-center justify-center text-[#001e40] hover:bg-[#f4f3f8] transition-colors active:scale-95"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 1))}
              className="w-10 h-10 bg-white rounded shadow-sm border border-[#E2E8F0] flex items-center justify-center text-[#001e40] hover:bg-[#f4f3f8] transition-colors active:scale-95"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSelectedLabId(labs[0]?.id || '');
              }}
              className="w-10 h-10 mt-2 bg-white rounded shadow-sm border border-[#E2E8F0] flex items-center justify-center text-[#001e40] hover:bg-[#f4f3f8] transition-colors active:scale-95"
              title="Reset View / My Location"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lab Detail & Directions Modal */}
      {activeLabModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveLabModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-mono font-semibold px-2 py-0.5 rounded uppercase">
                {activeLabModal.status}
              </span>
              <span className="font-mono text-xs text-slate-500">
                {activeLabModal.distance} from Delhi NCR HQ
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#001e40]">{activeLabModal.name}</h3>
            <p className="text-xs text-slate-600 mt-1">{activeLabModal.address}</p>

            <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="font-mono">{activeLabModal.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="font-mono">{activeLabModal.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Estimated Testing Lead Time: <strong>{activeLabModal.leadTimeDays} business days</strong></span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Officer In-charge: <strong>{activeLabModal.incharge}</strong>
              </p>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">
                Accredited Testing Scope
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeLabModal.disciplines.map((d) => (
                  <span key={d} className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-1 rounded text-xs font-mono">
                    {d} Testing
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  alert(`Routing generated to ${activeLabModal.name} via NH 24 / Delhi Ring Road.`);
                }}
                className="border border-[#E2E8F0] px-4 py-2 rounded font-mono text-xs uppercase font-semibold text-[#001e40] hover:bg-slate-50 transition-colors"
              >
                Get Turn-by-Turn GPS
              </button>
              <button
                onClick={() => {
                  alert(`Testing slot request for ${activeLabModal.name} registered on BIS Manakonline.`);
                  setActiveLabModal(null);
                }}
                className="bg-[#bb0013] text-white px-4 py-2 rounded font-mono text-xs uppercase font-semibold hover:bg-[#93000d] transition-colors"
              >
                Book Testing Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
