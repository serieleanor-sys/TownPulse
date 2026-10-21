import React from 'react';
import { RefreshCw, Shield, MapPin, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onResetData: () => void;
  onOpenDemoGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onResetData, onOpenDemoGuide }) => {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm">
                SDP
              </div>
              <span className="font-extrabold text-white text-base tracking-tight font-heading">
                TownPulse
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                City of Elmina Pilot
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Connecting Residents, Empowering Communities. Built as an MVP prototype for the Sime Darby Property Township Hackathon. Demonstrating end-to-end civic facility reporting, Gemini AI visual inspection, real-time work order tracking, and neighbourhood connectedness.
            </p>
          </div>

          {/* Township Precincts */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Pilot Coverage
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>Elmina Central Park & Lake (300 Acres)</li>
              <li>Elmina Valley (Precincts 1 to 5)</li>
              <li>Elmina Green & Elmina Ridge</li>
              <li>90km Wellness Jogging & Cycle Loop</li>
            </ul>
          </div>

          {/* Quick Actions & Demo Control */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Judge & Demo Controls
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenDemoGuide}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Demo Playbook</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset complaints and events back to original hackathon preloaded demo data?')) {
                    onResetData();
                  }
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-medium transition-colors flex items-center gap-2"
                title="Restore default mock dataset"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Dataset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 SDP TownPulse Prototype. Developed for Sime Darby Property Township Hackathon demonstration.
          </p>
          <div className="flex items-center gap-4">
            <span>Non-official prototype</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3 h-3" /> Powered by Gemini Vision
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
