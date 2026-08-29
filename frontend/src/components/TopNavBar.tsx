import React, { useState } from 'react';
import { ScreenView } from '../types';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  LogOut, 
  Layers, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface TopNavBarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const screens: { id: ScreenView; label: string; tag: string }[] = [
    { id: 'checklist', label: 'Compliance Checklist', tag: 'Screen 3' },
    { id: 'assistant', label: 'AI Compliance Auditor', tag: 'Screen 4' },
    { id: 'lab_finder', label: 'Accredited Lab Finder', tag: 'Screen 5' },
    { id: 'product_analysis', label: 'Product Analysis & Guide', tag: 'Screen 6' },
    { id: 'reports', label: 'Audit Reports & Archive', tag: 'Screen 7' },
    { id: 'signin_card', label: 'Sign In (Card View)', tag: 'Screen 2' },
    { id: 'login_minimal', label: 'Login (Minimal View)', tag: 'Screen 1' },
  ];

  return (
    <>
      <header className="bg-[#001e40] flex justify-between items-center w-full px-4 md:px-6 h-16 fixed top-0 z-50 shadow-sm text-white select-none">
        {/* Left: Brand title & Emblem */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('checklist')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 cursor-pointer hover:opacity-95 transition-opacity shadow-sm"
            title="Bureau of Indian Standards Portal"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY0euhpPuqSL4YXg5pNrrwI-wgxiWrANXZd7Cix9rsvevmXzPKJCnIEP1ZOugAQbRmnOSd4zCD5F5giXvY9aTctlNHthaL0UI84PO_EUo0dGbMDjVT6S_LsinuKVKQ7pPW0_1qcJygtc3vOFjGyvi_SMIOCWk-9qqB_iQzExAP1I4kFijCYKv2oOZzHEt0WdIAFjrGR25LxRBiGIyjAkqQEc65xqVE7SEEg1FnTdvsuVET6znppf9KMw"
              alt="BIS Official Seal"
              className="w-8 h-8 object-contain"
            />
          </div>
          <button 
            onClick={() => onNavigate('checklist')}
            className="text-left focus:outline-none"
          >
            <span className="text-lg md:text-xl font-bold tracking-tight text-white block leading-tight">
              Bureau of Indian Standards
            </span>
            <span className="text-[10px] text-blue-200 uppercase tracking-widest hidden sm:block font-mono">
              Government of India • Ministry of Consumer Affairs
            </span>
          </button>
        </div>

        {/* Center: Screen Switcher Quick Selector */}
        <div className="hidden lg:flex items-center">
          <div className="relative">
            <button
              onClick={() => setShowScreenSwitcher(!showScreenSwitcher)}
              className="flex items-center gap-2 bg-[#002d5f] hover:bg-[#003875] text-xs font-mono tracking-wide px-3 py-1.5 rounded border border-blue-900/60 text-blue-100 transition-colors shadow-inner"
            >
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              <span>SCREEN: <strong className="text-white uppercase">{screens.find(s => s.id === currentScreen)?.label}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
            </button>

            {showScreenSwitcher && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-slate-800 z-50 animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setShowScreenSwitcher(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">Jump to Screen</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">6 Views</span>
                </div>
                {screens.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onNavigate(s.id);
                      setShowScreenSwitcher(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentScreen === s.id ? 'bg-blue-50/80 text-[#001e40] font-semibold border-l-2 border-[#bb0013]' : 'text-slate-700'
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{s.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Search, Notifications, Help, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search standards, labs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-[#002d5f]/90 text-white placeholder-slate-300 font-body text-xs rounded border border-blue-900/50 pl-3 pr-9 py-2 focus:ring-1 focus:ring-[#bb0013] focus:border-[#bb0013] w-52 lg:w-64 outline-none transition-all"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="notifications"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-opacity active:scale-95 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ed1c24] rounded-full ring-2 ring-[#001e40]" />
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-3 text-slate-800 z-50 animate-in fade-in"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-semibold text-[#001e40] uppercase font-mono">BIS Notifications</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono font-medium">1 Urgent</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50/70 border-l-2 border-[#bb0013] rounded text-xs">
                    <p className="font-semibold text-slate-900">IS 302-1 Electrical Review Required</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Lab test findings pending certification desk sign-off.</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded text-xs">
                    <p className="font-semibold text-slate-900">National Test House (NR) Updated</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">New calibration test bench added for rotodynamic pumps.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Outline */}
          <button
            onClick={() => setShowHelpModal(true)}
            aria-label="help"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-opacity active:scale-95"
            title="BIS Compliance Guidelines & Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-300 transition-all"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX3lBruwQMZ4pi7O7I2qZedsxZfv2K4WaNeZ3ORqpxuCOvIFWONwwulXxIp8hqS8lzNLAQ8CUDXxGqTlRJJAke_Y_EZKvMXZu0JfpdoehOxkJwjbY9H3E4Ko4uzAZBTAO99nm-O4c8kX_19_VCxus9zNLReGtACaq-glNj3TdxlgxQd4PCcDOEJZ6E5ANRaPDxPgNLzHluWzxC7qL7vpZk2LqM8CW73KlcJR9xgOqw9t73Fslt9dfKWw"
                alt="Official User Profile Avatar"
                className="w-8 h-8 rounded-full border border-blue-300/40 object-cover"
              />
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Dr. Rajeshwari Sharma</p>
                  <p className="text-[11px] text-slate-500 font-mono">auditor.hq@bis.gov.in</p>
                  <span className="inline-block mt-1 bg-blue-100 text-[#001e40] text-[10px] font-mono px-2 py-0.5 rounded">
                    Senior Standards Officer
                  </span>
                </div>
                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      onNavigate('checklist');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>My Compliance Desk</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('signin_card');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Switch to Sign In (Card)</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('login_minimal');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>Switch to Login (Minimal)</span>
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      onNavigate('signin_card');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-[#bb0013] text-xs font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#001e40] flex items-center justify-center text-white">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#001e40]">Bureau of Indian Standards Portal Help</h3>
                  <p className="text-xs text-slate-500 font-mono">Official Compliance & Certification Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            
            <div className="py-4 text-xs space-y-3 text-slate-700 leading-relaxed">
              <p>
                This portal facilitates real-time auditing of industrial specifications against Indian Standards (IS), finding accredited BIS/NABL laboratories, and generating Scheme-I (ISI Mark) and CRS compliance documentation.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] space-y-1">
                <p>• <strong>Assistant:</strong> Interactive AI auditor referencing standards like IS 5120:1977.</p>
                <p>• <strong>Standards:</strong> Progress checklist across Material Sourcing & Lab Testing.</p>
                <p>• <strong>Lab Finder:</strong> Geo-spatial directory of accredited testing stations.</p>
                <p>• <strong>Product Analysis:</strong> Instant determination of applicable QCO & ISI marks.</p>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Toll Free Helpline: 1800 11 4420 • Working hours: 09:00 - 17:30 IST (Mon - Fri)
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-[#001e40] text-white px-4 py-2 rounded text-xs font-mono uppercase hover:bg-[#003366] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
