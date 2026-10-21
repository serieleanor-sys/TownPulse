import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  ChevronRight, 
  ThumbsUp, 
  ArrowUpDown,
  Sparkles,
  Plus
} from 'lucide-react';

interface MyReportsListProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateToReport: () => void;
  onUpvoteComplaint: (id: string) => void;
}

export const MyReportsList: React.FC<MyReportsListProps> = ({
  complaints,
  onSelectComplaint,
  onNavigateToReport,
  onUpvoteComplaint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity'>('newest');

  // Filtered and sorted complaints
  const filteredComplaints = useMemo(() => {
    let result = [...complaints];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter((c) => c.category === categoryFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.precinct.toLowerCase().includes(q) ||
          c.location.address.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
      }
      if (sortBy === 'severity') {
        const order = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (order[b.severity] || 0) - (order[a.severity] || 0);
      }
      return 0;
    });

    return result;
  }, [complaints, statusFilter, categoryFilter, searchTerm, sortBy]);

  const counts = useMemo(() => {
    return {
      all: complaints.length,
      pending: complaints.filter((c) => c.status === 'Pending').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved').length,
    };
  }, [complaints]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              City of Elmina Pilot
            </span>
            <span className="text-xs text-slate-500">Live Ticket Ledger</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">
            Community Reports & Issue Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time transparency on public facility complaints, work order dispatch, and resolution sign-offs.
          </p>
        </div>

        <button
          onClick={onNavigateToReport}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Report New Issue
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Reports ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'Pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending ({counts.pending})
          </button>
          <button
            onClick={() => setStatusFilter('In Progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'In Progress'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            In Progress ({counts.inProgress})
          </button>
          <button
            onClick={() => setStatusFilter('Resolved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'Resolved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved ({counts.resolved})
          </button>
        </div>

        {/* Search & Category & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID (e.g. SDP-2026-001), keyword, or precinct..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Street Lighting">Street Lighting</option>
              <option value="Drainage">Drainage</option>
              <option value="Landscaping">Landscaping</option>
              <option value="Public Facilities">Public Facilities</option>
              <option value="Walkway Obstruction">Walkway Obstruction</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="severity">Sort: Highest Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching reports found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filters to see complaints.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setCategoryFilter('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badges Header */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/20">
                      {item.id}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md flex items-center gap-1 shadow-xs ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-600/90 text-white'
                          : item.status === 'In Progress'
                          ? 'bg-blue-600/90 text-white'
                          : 'bg-amber-500/90 text-white'
                      }`}
                    >
                      {item.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === 'In Progress' && <Wrench className="w-3 h-3" />}
                      {item.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Info */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center gap-1 font-medium truncate">
                      <MapPin className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                      {item.location.precinct}
                    </span>
                    <span className="text-[11px] text-slate-300 flex-shrink-0">
                      {new Date(item.reportedAt).toLocaleDateString('en-MY', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : item.severity === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.severity} Priority
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Maintenance Team or Notes if assigned */}
                  {item.assignedTeam && (
                    <div className="mt-3 p-2 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">
                        Assigned: <strong>{item.assignedTeam}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.upvotes} neighbours</span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-emerald-700 group-hover:text-emerald-900">
                  <span>Inspect Timeline</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
