import React from 'react';
import { Complaint, CommunityEvent } from '../../types';
import { 
  PlusCircle, 
  Map, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  AlertCircle, 
  ArrowRight, 
  PhoneCall, 
  Sparkles, 
  Shield, 
  Sun,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface ResidentDashboardProps {
  complaints: Complaint[];
  events: CommunityEvent[];
  onNavigateToReport: () => void;
  onNavigateToReports: () => void;
  onNavigateToEvents: () => void;
  onNavigateToMap: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onToggleRsvp: (eventId: string) => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  complaints,
  events,
  onNavigateToReport,
  onNavigateToReports,
  onNavigateToEvents,
  onNavigateToMap,
  onSelectComplaint,
  onToggleRsvp,
}) => {
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const rsvpCount = events.filter((e) => e.isRsvp).length;

  const recentComplaints = complaints.slice(0, 4);
  const featuredEvents = events.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome & Pilot Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-emerald-100 backdrop-blur-xs">
                City of Elmina Pilot
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-700 text-emerald-200">
                5,000-Acre Wellness Township
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight">
              Welcome back, Aiman Haziq
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Elmina Valley 2 • Connecting Residents, Empowering Communities. Spot a damaged public facility along the 90km trail or neighbourhood park? Report it directly to township operations with AI visual inspection.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-300" /> 31°C Sunny • AQI 34 (Good)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-300" /> Auxiliary Police Patrols Active
              </span>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={onNavigateToReport}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
              <span>Report Issue with AI</span>
            </button>

            <button
              onClick={onNavigateToMap}
              className="px-5 py-3 rounded-2xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm border border-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Map className="w-4 h-4" />
              <span>View Township Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Reports */}
        <div 
          onClick={onNavigateToReports}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">All Reports</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-heading">
            {complaints.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">City of Elmina Queue</span>
        </div>

        {/* Pending */}
        <div 
          onClick={onNavigateToReports}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-700 text-xs">
            <span className="font-semibold">Pending Review</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2 font-heading">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-600/80 mt-1 block">Awaiting ops triage</span>
        </div>

        {/* In Progress */}
        <div 
          onClick={onNavigateToReports}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-blue-700 text-xs">
            <span className="font-semibold">Work In Progress</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Wrench className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-2 font-heading">
            {inProgressCount}
          </div>
          <span className="text-[11px] text-blue-600/80 mt-1 block">Contractors on-site</span>
        </div>

        {/* Resolved */}
        <div 
          onClick={onNavigateToReports}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-emerald-700 text-xs">
            <span className="font-semibold">Resolved</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2 font-heading">
            {resolvedCount}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block">
            {Math.round((resolvedCount / Math.max(1, complaints.length)) * 100)}% resolution rate
          </span>
        </div>
      </div>

      {/* Main Grid: Recent Reports & Events Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Community Reports (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Recent Facility Reports
              </h2>
              <p className="text-xs text-slate-500">
                Track real-time progress on reported potholes, park amenities, and lighting.
              </p>
            </div>
            <button
              onClick={onNavigateToReports}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-emerald-800">
                        {item.id}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500 font-medium truncate">
                        {item.location.precinct}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Reported {new Date(item.reportedAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    {item.upvotes} endorsements
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onNavigateToReport}
            className="w-full py-2.5 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-500 text-emerald-800 font-bold text-xs bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Spot something else? File a New Report
          </button>
        </div>

        {/* Right Column: Upcoming Events & Hotline (1 col) */}
        <div className="space-y-6">
          {/* Upcoming Events Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Community Activities
                </h2>
                <p className="text-xs text-slate-500">Upcoming gatherings in Elmina</p>
              </div>
              <button
                onClick={onNavigateToEvents}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                All Events
              </button>
            </div>

            <div className="space-y-3">
              {featuredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {evt.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{evt.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-slate-500">
                      {evt.attendeeCount} going
                    </span>
                    <button
                      onClick={() => onToggleRsvp(evt.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        evt.isRsvp
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      }`}
                    >
                      {evt.isRsvp ? '✓ Attending' : 'RSVP'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Township Emergency & Hotlines */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                24/7 Township Hotlines
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-300">Elmina Auxiliary Police:</span>
                <span className="font-mono font-bold text-emerald-300">+603-7839 8888</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-300">MBSA 24-Hr Emergency:</span>
                <span className="font-mono font-bold text-emerald-300">1-800-88-4477</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-300">SDP Township Careline:</span>
                <span className="font-mono font-bold text-emerald-300">1-800-88-1118</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
