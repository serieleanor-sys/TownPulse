import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  FileText, 
  Building2, 
  RefreshCw,
  Clock,
  Wrench
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
  onResetData: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onStartDemo,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Hackathon Demo Playbook</h3>
              <p className="text-xs text-emerald-200">End-to-end complaint lifecycle walkthrough</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-700">
          <p className="text-slate-600 font-medium">
            Follow this 3-step loop to see real-time data persistence between residents and township operations:
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Resident: Submit Issue with AI</h4>
                <p className="text-xs text-slate-600">
                  Go to <strong>Report an Issue</strong>. Click a demo photo preset (e.g. <em>Deep Asphalt Pothole</em>), click <strong>Analyse with AI</strong> to inspect via Gemini Vision, and submit to generate a unique tracking ID (e.g. <span className="font-mono font-bold text-emerald-800">SDP-2026-011</span>).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Admin: Triage & Dispatch Work Order</h4>
                <p className="text-xs text-slate-600">
                  Click <strong>Switch to Township Admin</strong> in the top bar. Locate your new complaint, click <strong>Manage</strong>, change status to <strong>In Progress</strong>, assign <em>Elmina InfraCare</em>, add an operations note, and click <strong>Save</strong>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3">
              <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Resident: Live Resolution Timeline Verification</h4>
                <p className="text-xs text-slate-600">
                  Switch back to <strong>Resident Portal</strong> → <strong>My Reports</strong>. Notice the status badge has updated to <strong>In Progress</strong> with your new maintenance milestone logged on the timeline!
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Persistence Note:</strong> All changes are stored in persistent local browser storage. They remain intact upon page refresh.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetData();
              onClose();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-rose-600 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo Data to Defaults
          </button>

          <button
            onClick={() => {
              onStartDemo();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <span>Start Step 1: Report Issue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
