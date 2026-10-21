import React, { useState, useMemo } from 'react';
import { 
  Complaint, 
  ComplaintStatus, 
  ComplaintCategory, 
  CommunityEvent,
  AdminTab 
} from '../../types';
import { MAINTENANCE_TEAMS, TOWNSHIP_PRECINCTS } from '../../data/initialData';
import { TownshipStorage } from '../../services/storage';
import { 
  BarChart3, 
  ClipboardList, 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  AlertTriangle, 
  Users, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Edit3, 
  MapPin, 
  Building2, 
  Check, 
  X, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Phone,
  Layers,
  TrendingUp
} from 'lucide-react';

interface AdminDashboardProps {
  complaints: Complaint[];
  events: CommunityEvent[];
  onComplaintsUpdated: (complaints: Complaint[]) => void;
  onEventsUpdated: (events: CommunityEvent[]) => void;
  onSwitchToResident: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  complaints,
  events,
  onComplaintsUpdated,
  onEventsUpdated,
  onSwitchToResident,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('complaints');

  // Complaint Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  // Admin Managing Active Complaint
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [actionStatus, setActionStatus] = useState<ComplaintStatus>('Pending');
  const [actionTeam, setActionTeam] = useState<string>('');
  const [actionNote, setActionNote] = useState<string>('');
  const [actionEstimatedDate, setActionEstimatedDate] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // New Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Recreation' | 'Sustainability' | 'Community' | 'Wellness'>('Sustainability');
  const [newEventDate, setNewEventDate] = useState('Saturday, 14 November 2026');
  const [newEventTime, setNewEventTime] = useState('8:00 AM – 11:00 AM');
  const [newEventLocation, setNewEventLocation] = useState('Elmina Central Park, Main Lawn');
  const [newEventPrecinct, setNewEventPrecinct] = useState('Elmina Central Park');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState(100);
  const [newEventOrganizer, setNewEventOrganizer] = useState('SDP Township Community Team');
  const [newEventImage, setNewEventImage] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80');

  // KPI Calculations
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const critical = complaints.filter((c) => c.severity === 'Critical' && c.status !== 'Resolved').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return { total, pending, inProgress, resolved, critical, resolutionRate };
  }, [complaints]);

  // Analytics Category Breakdown
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [complaints]);

  // Analytics Precinct Breakdown
  const precinctStats = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      const p = c.location.precinct || 'Other';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [complaints]);

  // Filtered Complaints for Table
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;
      const matchSeverity = severityFilter === 'All' || c.severity === severityFilter;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.reportedBy.name.toLowerCase().includes(q) ||
        c.location.precinct.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);

      return matchStatus && matchCategory && matchSeverity && matchSearch;
    });
  }, [complaints, statusFilter, categoryFilter, severityFilter, searchTerm]);

  // Open Drawer for Managing a Complaint
  const handleOpenManageDrawer = (c: Complaint) => {
    setSelectedComplaint(c);
    setActionStatus(c.status);
    setActionTeam(c.assignedTeam || MAINTENANCE_TEAMS[0]);
    setActionNote('');
    setActionEstimatedDate(c.estimatedResolutionDate || '2026-10-24');
    setActionSuccessMessage(null);
  };

  // Submit Admin Action on a Complaint
  const handleSaveComplaintAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const updated = TownshipStorage.updateComplaintStatus(
      selectedComplaint.id,
      actionStatus,
      actionNote,
      actionTeam,
      actionNote || selectedComplaint.adminNotes,
      actionEstimatedDate
    );

    if (updated) {
      const all = TownshipStorage.getComplaints();
      onComplaintsUpdated(all);
      setSelectedComplaint(updated);
      setActionSuccessMessage(`Successfully updated ${updated.id} to "${actionStatus}". Changes are live in Resident Portal!`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  // Quick Inline Status Change from Table
  const handleQuickStatusChange = (c: Complaint, nextStatus: ComplaintStatus) => {
    const updated = TownshipStorage.updateComplaintStatus(
      c.id,
      nextStatus,
      `Status changed to ${nextStatus} by Township Operations via Quick Action.`
    );
    if (updated) {
      onComplaintsUpdated(TownshipStorage.getComplaints());
    }
  };

  // Add Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      alert('Please enter an event title.');
      return;
    }

    TownshipStorage.addEvent({
      title: newEventTitle.trim(),
      category: newEventCategory,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      precinct: newEventPrecinct,
      description: newEventDesc || 'Community activity for residents of City of Elmina.',
      organizer: newEventOrganizer,
      capacity: newEventCapacity,
      imageUrl: newEventImage,
      highlights: [
        'Community networking & refreshments',
        'Township wellness initiative',
        'Sime Darby Property official engagement',
      ],
    });

    onEventsUpdated(TownshipStorage.getEvents());
    setIsEventModalOpen(false);
    // Reset
    setNewEventTitle('');
    setNewEventDesc('');
  };

  // Delete Event
  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to remove this community event?')) {
      TownshipStorage.deleteEvent(id);
      onEventsUpdated(TownshipStorage.getEvents());
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Township Operations Control
            </span>
            <span className="text-xs text-slate-400">
              MBSA & Sime Darby Property Joint Ops
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 font-heading tracking-tight">
            City of Elmina Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage complaints, triage safety hazards, assign contractor work orders, and oversee neighbourhood events.
          </p>
        </div>

        <button
          onClick={onSwitchToResident}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          <span>Switch to Resident View</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs for Admin */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 px-1 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'complaints'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Complaints Ledger ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-1 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'analytics'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Hotspots</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 px-1 transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'events'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Community Events ({events.length})</span>
        </button>
      </div>

      {/* KPI Cards (Always visible for quick situational awareness) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Tickets</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-heading">{stats.total}</div>
          <span className="text-[11px] text-slate-400">All precincts</span>
        </div>

        {/* Pending */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 font-heading">{stats.pending}</div>
          <span className="text-[11px] text-amber-600/80">Needs triage</span>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" /> In Progress
          </span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1 font-heading">{stats.inProgress}</div>
          <span className="text-[11px] text-blue-600/80">Contractors assigned</span>
        </div>

        {/* Resolved */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 font-heading">{stats.resolved}</div>
          <span className="text-[11px] text-emerald-600/80">{stats.resolutionRate}% success</span>
        </div>

        {/* Critical Hazards */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Critical / Safety
          </span>
          <div className="text-2xl font-extrabold text-rose-700 mt-1 font-heading">{stats.critical}</div>
          <span className="text-[11px] text-rose-600/80">High priority SLA</span>
        </div>
      </div>

      {/* TAB 1: COMPLAINTS MANAGEMENT */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ticket ID, resident, address..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Statuses ({complaints.length})</option>
                <option value="Pending">Pending ({stats.pending})</option>
                <option value="In Progress">In Progress ({stats.inProgress})</option>
                <option value="Resolved">Resolved ({stats.resolved})</option>
              </select>
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

            <div className="sm:col-span-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Photo / Issue</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Status & Assigned Team</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No complaints match your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => handleOpenManageDrawer(item)}
                      >
                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                          {item.id}
                        </td>

                        {/* Photo / Issue */}
                        <td className="py-3.5 px-4 min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.photoUrl}
                              alt=""
                              className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {item.category}
                              </span>
                              <p className="font-bold text-slate-900 truncate mt-0.5 max-w-[200px]">
                                {item.title}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                {new Date(item.reportedAt).toLocaleDateString('en-MY', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 block">{item.location.precinct}</span>
                          <span className="text-[11px] text-slate-500 truncate block max-w-[150px]">
                            {item.location.address}
                          </span>
                        </td>

                        {/* Reporter */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 block">{item.reportedBy.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            {item.reportedBy.unit}
                          </span>
                        </td>

                        {/* Severity */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.severity === 'Critical'
                                ? 'bg-rose-100 text-rose-800'
                                : item.severity === 'High'
                                ? 'bg-orange-100 text-orange-800'
                                : item.severity === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.severity}
                          </span>
                        </td>

                        {/* Status & Team */}
                        <td className="py-3.5 px-4 min-w-[160px]">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                          {item.assignedTeam && (
                            <span className="block text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5">
                              Team: {item.assignedTeam}
                            </span>
                          )}
                        </td>

                        {/* Quick Actions */}
                        <td 
                          className="py-3.5 px-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            {item.status !== 'In Progress' && item.status !== 'Resolved' && (
                              <button
                                onClick={() => handleQuickStatusChange(item, 'In Progress')}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                                title="Start Work Order"
                              >
                                Dispatch
                              </button>
                            )}

                            {item.status !== 'Resolved' && (
                              <button
                                onClick={() => handleQuickStatusChange(item, 'Resolved')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                                title="Mark as Resolved"
                              >
                                Resolve
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenManageDrawer(item)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px] transition-colors"
                            >
                              Manage
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & HOTSPOTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Issue Categories Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">Distribution of complaints across facility types</p>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-700" />
              </div>

              <div className="space-y-3 pt-2">
                {categoryStats.map(([categoryName, count]) => {
                  const percent = Math.round((count / Math.max(1, complaints.length)) * 100);
                  return (
                    <div key={categoryName}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{categoryName}</span>
                        <span className="text-slate-500">
                          {count} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Precinct Hotspot Radar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Precinct & Enclave Density
                  </h3>
                  <p className="text-xs text-slate-500">Active maintenance hotspots across City of Elmina</p>
                </div>
                <MapPin className="w-4 h-4 text-emerald-700" />
              </div>

              <div className="space-y-3 pt-2">
                {precinctStats.map(([precinctName, count]) => {
                  const percent = Math.round((count / Math.max(1, complaints.length)) * 100);
                  return (
                    <div key={precinctName}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{precinctName}</span>
                        <span className="text-slate-500">
                          {count} reports
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-teal-600 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY EVENT MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Township Event Management
              </h3>
              <p className="text-xs text-slate-500">
                Publish eco-workshops, cleanups, and community activities for Elmina residents.
              </p>
            </div>
            <button
              onClick={() => setIsEventModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={evt.imageUrl}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">{evt.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{evt.date}</p>
                    <p className="text-xs text-slate-600 truncate mt-1">{evt.location}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    {evt.attendeeCount} / {evt.capacity} RSVPs
                  </span>
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: ADMIN COMPLAINT MANAGEMENT (Status changer, contractor assign, notes) */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {selectedComplaint.id}
                </span>
                <h3 className="text-base font-bold font-heading truncate max-w-md">
                  Operations Triage: {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSaveComplaintAction} className="overflow-y-auto p-6 space-y-5">
              {actionSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 border border-emerald-300">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* Photo & Snapshot */}
              <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 items-center">
                <img
                  src={selectedComplaint.photoUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0 text-xs">
                  <span className="font-semibold text-slate-800">{selectedComplaint.category}</span>
                  <p className="text-slate-600 line-clamp-1">{selectedComplaint.location.address}</p>
                  <p className="text-slate-500 mt-1">
                    Reporter: {selectedComplaint.reportedBy.name} ({selectedComplaint.reportedBy.phone})
                  </p>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Update Complaint Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Pending', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setActionStatus(st)}
                      className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        actionStatus === st
                          ? st === 'Resolved'
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                            : st === 'In Progress'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Maintenance Team */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Assign Maintenance Team / Contractor
                </label>
                <select
                  value={actionTeam}
                  onChange={(e) => setActionTeam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {MAINTENANCE_TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Completion Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Target Resolution Date
                </label>
                <input
                  type="date"
                  value={actionEstimatedDate}
                  onChange={(e) => setActionEstimatedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Progress Note for Resident Timeline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Operations Progress Note (Visible to Resident)
                </label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="e.g. Dispatched patch repair crew. Pothole filled and compacted with bituminous cold-mix."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  This note will be automatically added as a new milestone on the resident's live tracking timeline.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                  Save & Update Resident Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD COMMUNITY EVENT */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Publish New Community Event
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Elmina Central Park Sunday Plogging"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Sustainability">Sustainability</option>
                    <option value="Recreation">Recreation</option>
                    <option value="Community">Community</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Precinct</label>
                  <select
                    value={newEventPrecinct}
                    onChange={(e) => setNewEventPrecinct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {TOWNSHIP_PRECINCTS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specific Location</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
