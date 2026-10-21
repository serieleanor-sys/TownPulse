import React, { useState } from 'react';
import { AppPortal, ResidentTab } from '../../types';
import { 
  Building2, 
  User, 
  MapPin, 
  Sparkles, 
  Menu, 
  X, 
  PlusCircle, 
  Compass, 
  Calendar, 
  AlertCircle,
  HelpCircle,
  Home,
  Shield,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentPortal: AppPortal;
  currentResidentTab: ResidentTab;
  onSelectPortal: (portal: AppPortal) => void;
  onSelectResidentTab: (tab: ResidentTab) => void;
  pendingComplaintsCount: number;
  totalComplaintsCount: number;
  onOpenDemoGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  currentResidentTab,
  onSelectPortal,
  onSelectResidentTab,
  pendingComplaintsCount,
  totalComplaintsCount,
  onOpenDemoGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro-bar for Hackathon Context */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white text-[11px] py-1.5 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-emerald-200">Sime Darby Property Township Hackathon</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-300">City of Elmina Pilot (5,000 Acres)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Judge Demo Playbook</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => onSelectPortal('landing')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            {/* Visual Logo Emblem */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="font-black text-lg tracking-tighter">SDP</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl font-heading tracking-tight group-hover:text-emerald-800 transition-colors">
                  TownPulse
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Pilot
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                Connecting Residents, Empowering Communities
              </p>
            </div>
          </div>

          {/* Center Navigation for Resident Portal */}
          {currentPortal === 'resident' && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
              <button
                onClick={() => onSelectResidentTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentResidentTab === 'dashboard'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => onSelectResidentTab('report')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentResidentTab === 'report'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-emerald-800 hover:bg-white/50'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Issue</span>
              </button>

              <button
                onClick={() => onSelectResidentTab('my-reports')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentResidentTab === 'my-reports'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>My Reports</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                  {totalComplaintsCount}
                </span>
              </button>

              <button
                onClick={() => onSelectResidentTab('events')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentResidentTab === 'events'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Community Events
              </button>

              <button
                onClick={() => onSelectResidentTab('map')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentResidentTab === 'map'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Township Map</span>
              </button>
            </nav>
          )}

          {/* Right Action / Portal Switcher */}
          <div className="flex items-center gap-2.5">
            {/* If Landing */}
            {currentPortal === 'landing' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPortal('resident')}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
                >
                  Resident Portal
                </button>
                <button
                  onClick={() => onSelectPortal('admin')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors"
                >
                  Admin Portal
                </button>
              </div>
            )}

            {/* If Resident Portal: Switch to Admin button */}
            {currentPortal === 'resident' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPortal('admin')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  title="Switch to Township Admin Portal"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Switch to Admin</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    {pendingComplaintsCount}
                  </span>
                </button>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* If Admin Portal: Switch to Resident button */}
            {currentPortal === 'admin' && (
              <button
                onClick={() => onSelectPortal('resident')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5"
                title="Switch to Resident Portal"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch to Resident View</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu for Resident Portal */}
      {mobileMenuOpen && currentPortal === 'resident' && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          <button
            onClick={() => {
              onSelectResidentTab('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
              currentResidentTab === 'dashboard' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              onSelectResidentTab('report');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              currentResidentTab === 'report' ? 'bg-emerald-800 text-white' : 'text-emerald-800 bg-emerald-50/50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Report Issue (with AI)
          </button>
          <button
            onClick={() => {
              onSelectResidentTab('my-reports');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
              currentResidentTab === 'my-reports' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            My Reports ({totalComplaintsCount})
          </button>
          <button
            onClick={() => {
              onSelectResidentTab('events');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
              currentResidentTab === 'events' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            Community Events
          </button>
          <button
            onClick={() => {
              onSelectResidentTab('map');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold ${
              currentResidentTab === 'map' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            Township Issue Map
          </button>
        </div>
      )}
    </header>
  );
};
