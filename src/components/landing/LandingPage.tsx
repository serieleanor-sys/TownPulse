import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Users, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Leaf, 
  Building2, 
  Activity,
  Compass,
  Heart
} from 'lucide-react';

interface LandingPageProps {
  onEnterResident: () => void;
  onEnterAdmin: () => void;
  onStartDemoFlow: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterResident,
  onEnterAdmin,
  onStartDemoFlow,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#06382b] via-[#094738] to-[#04281f] text-white p-8 sm:p-14 lg:p-20 shadow-xl overflow-hidden">
        {/* Subtle decorative circles & lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Pilot Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>City of Elmina Pilot • Sime Darby Property Township Hackathon</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.1]">
              A Smarter Way to Care for Our Community
            </h1>
            <p className="text-base sm:text-xl text-emerald-100/90 font-medium max-w-2xl leading-relaxed">
              Connecting Residents, Empowering Communities. Report damaged public facilities with instant AI inspection, track contractor resolutions in real time, and build vibrant neighbourhood connections.
            </p>
          </div>

          {/* Dual Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={onEnterResident}
              className="px-7 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Enter as Resident</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onEnterAdmin}
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span>Enter as Township Admin</span>
            </button>
          </div>

          {/* Quick Demo scenario shortcut for hackathon judges */}
          <div className="pt-4">
            <button
              onClick={onStartDemoFlow}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 hover:text-white bg-emerald-800/40 hover:bg-emerald-800/70 px-3.5 py-2 rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hackathon Judge Quick Start: Test Resident-to-Admin Lifecycle →</span>
            </button>
          </div>

          {/* Key township stats */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-emerald-100">
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-heading">5,000</div>
              <span className="text-xs text-emerald-200/80">Acres Wellness Township</span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-heading">300</div>
              <span className="text-xs text-emerald-200/80">Acre Central Park & Lake</span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-heading">90 KM</div>
              <span className="text-xs text-emerald-200/80">Jogging & Cycling Trail</span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-heading">&lt; 48 Hrs</div>
              <span className="text-xs text-emerald-200/80">Average Triage SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Three Pillars of Smart Township Care
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered for seamless resident engagement and efficient local authority collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: AI Visual Reporting */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              1. AI Visual Issue Inspection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Snap a photo of an asphalt pothole, broken streetlight, or blocked monsoon drain. Gemini Vision automatically diagnoses the damage category, severity, and suggests a clear inspection summary.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>Fully editable by residents</span>
              <span>•</span>
              <span>Instant GPS location</span>
            </div>
          </div>

          {/* Feature 2: Transparent Lifecycle Tracking */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              2. Real-Time Tracking & Verification
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No more black-hole complaints. Every submission receives a unique tracking ID (e.g. SDP-2026-001) with live milestones: Operations Review, Contractor Dispatched, and Resolution Sign-off.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-700 flex items-center gap-1">
              <span>Contractor work orders</span>
              <span>•</span>
              <span>Community endorsements</span>
            </div>
          </div>

          {/* Feature 3: Community Life & Sustainability */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              3. Connected Neighbourhood Hub
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Empowering wellness and sustainability. Discover community plogging sessions, cycling safety workshops, dengue prevention gotong-royongs, and interactive spatial township maps.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1">
              <span>1-click RSVPs</span>
              <span>•</span>
              <span>Interactive GIS Map</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Showcase: City of Elmina */}
      <section className="bg-slate-100/80 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-800 text-white">
              Township Pilot Sandbox
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Why City of Elmina?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              As Malaysia’s benchmark 5,000-acre wellness township, City of Elmina integrates an active 90km perimeter track, 300 acres of parkland, and distinct enclaves from Elmina Valley to Elmina Green. SDP TownPulse bridges residents and township facilities managers with data-driven pride of place.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
                🌲 Elmina Central Park
              </span>
              <span className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
                🌈 Rainbow Bridge
              </span>
              <span className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
                🛍️ Elmina Lakeside Mall
              </span>
              <span className="text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
                🏘️ Elmina Valley & Green
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>Ready to explore the demo?</span>
            </h4>
            <p className="text-xs text-slate-500">
              Jump directly into either role or test the complete synchronized demo lifecycle.
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={onEnterResident}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
              >
                Launch Resident Portal
              </button>
              <button
                onClick={onEnterAdmin}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
              >
                Launch Township Admin
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
