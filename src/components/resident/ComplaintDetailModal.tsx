import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  Wrench, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  ThumbsUp, 
  User, 
  Building2, 
  Share2,
  ExternalLink
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onUpvote?: (id: string) => void;
  isAdmin?: boolean;
  onOpenAdminManage?: (complaint: Complaint) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onUpvote,
  isAdmin = false,
  onOpenAdminManage,
}) => {
  const [copied, setCopied] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  if (!complaint) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(complaint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpvote = () => {
    if (!hasUpvoted && onUpvote) {
      onUpvote(complaint.id);
      setHasUpvoted(true);
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Wrench className="w-3.5 h-3.5 animate-pulse" />
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resolved
          </span>
        );
    }
  };

  const getSeverityBadge = (sev: string) => {
    const map: Record<string, string> = {
      Critical: 'bg-rose-100 text-rose-800 border-rose-200',
      High: 'bg-orange-100 text-orange-800 border-orange-200',
      Medium: 'bg-amber-100 text-amber-800 border-amber-200',
      Low: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${map[sev] || map.Medium}`}>
        {sev} Priority
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyId}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-2xs"
              title="Click to copy tracking ID"
            >
              <span>{complaint.id}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
              )}
            </button>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-600">{complaint.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(complaint.status)}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Title & Image Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* High-res Image Preview */}
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <img
                src={complaint.photoUrl}
                alt={complaint.title}
                className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {getSeverityBadge(complaint.severity)}
              </div>
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] text-white font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                {complaint.location.precinct}
              </div>
            </div>

            {/* Info and Metadata */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading leading-tight">
                  {complaint.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              {/* Location details */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">{complaint.location.address}</span>
                    <div className="text-slate-500 mt-0.5">
                      Precinct: {complaint.location.precinct} • GPS: {complaint.location.coordinates.lat.toFixed(4)}, {complaint.location.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reported: {new Date(complaint.reportedAt).toLocaleDateString('en-MY', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reported by: {complaint.reportedBy.name} ({complaint.reportedBy.unit})</span>
                </div>
              </div>

              {/* Community endorsement / upvote */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleUpvote}
                  disabled={hasUpvoted}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                    hasUpvoted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'text-emerald-600 fill-emerald-600' : 'text-slate-500'}`} />
                  <span>{hasUpvoted ? 'Endorsed by You' : 'I see this issue too'}</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {complaint.upvotes + (hasUpvoted ? 1 : 0)}
                  </span>
                </button>

                {isAdmin && onOpenAdminManage && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminManage(complaint);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Manage in Admin
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Visual Inspection Insight Card (if analyzed) */}
          {complaint.aiAnalysis && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/60 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    AI Visual Inspection Diagnosis
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  {complaint.aiAnalysis.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Township Vision Model'}
                </span>
              </div>

              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {complaint.aiAnalysis.suggestedDescription}
              </p>

              {complaint.aiAnalysis.detectedElements && complaint.aiAnalysis.detectedElements.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {complaint.aiAnalysis.detectedElements.map((elem, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/80 border border-emerald-300 text-[11px] font-medium text-emerald-900"
                    >
                      ✓ {elem}
                    </span>
                  ))}
                </div>
              )}

              {complaint.aiAnalysis.safetyHazard && (
                <div className="mt-2.5 flex items-start gap-2 p-2 rounded-lg bg-amber-100/80 border border-amber-300 text-xs text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Safety Notice:</strong> {complaint.aiAnalysis.safetyNote || 'Potential pedestrian/cyclist caution advised.'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Township Operations & Contractor Info */}
          {(complaint.assignedTeam || complaint.adminNotes || complaint.estimatedResolutionDate) && (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
                <Building2 className="w-4 h-4 text-blue-700" />
                Township Operations Action Summary
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {complaint.assignedTeam && (
                  <div>
                    <span className="text-slate-500">Assigned Team:</span>
                    <p className="font-semibold text-slate-800">{complaint.assignedTeam}</p>
                  </div>
                )}
                {complaint.estimatedResolutionDate && (
                  <div>
                    <span className="text-slate-500">Target Resolution:</span>
                    <p className="font-semibold text-slate-800">{complaint.estimatedResolutionDate}</p>
                  </div>
                )}
              </div>
              {complaint.adminNotes && (
                <div className="pt-2 border-t border-blue-100 text-xs">
                  <span className="text-slate-500 font-medium">Operations Notes:</span>
                  <p className="text-slate-800 mt-0.5 italic bg-white/70 p-2.5 rounded-lg border border-blue-100">
                    "{complaint.adminNotes}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Complete Status Timeline */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 font-heading">
              <Clock className="w-4 h-4 text-emerald-700" />
              Resolution Progress Timeline
            </h4>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.timeline.map((event, index) => {
                const isLast = index === complaint.timeline.length - 1;
                const isResolved = event.status === 'Resolved';
                const isInProgress = event.status === 'In Progress';

                return (
                  <div key={event.id || index} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs ${
                        isResolved
                          ? 'bg-emerald-600 text-white'
                          : isInProgress
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 hover:border-slate-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">{event.title}</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(event.timestamp).toLocaleString('en-MY', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {event.note}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-600">{event.actor}</span>
                        <span>•</span>
                        <span className="capitalize">{event.status} Stage</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Township Maintenance SLA: Standard target is 48 hours for verified civil repairs.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
