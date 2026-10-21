import React, { useState, useEffect } from 'react';
import { 
  AppPortal, 
  ResidentTab, 
  Complaint, 
  CommunityEvent 
} from './types';
import { TownshipStorage } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { ResidentDashboard } from './components/resident/ResidentDashboard';
import { ReportIssueForm } from './components/resident/ReportIssueForm';
import { MyReportsList } from './components/resident/MyReportsList';
import { CommunityEvents } from './components/resident/CommunityEvents';
import { TownshipIssueMap } from './components/map/TownshipIssueMap';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ComplaintDetailModal } from './components/resident/ComplaintDetailModal';
import { DemoGuideModal } from './components/common/DemoGuideModal';

export default function App() {
  const [portal, setPortal] = useState<AppPortal>('landing');
  const [residentTab, setResidentTab] = useState<ResidentTab>('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [inspectingComplaint, setInspectingComplaint] = useState<Complaint | null>(null);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load persistent data on mount
  useEffect(() => {
    setComplaints(TownshipStorage.getComplaints());
    setEvents(TownshipStorage.getEvents());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Upvote complaint
  const handleUpvoteComplaint = (id: string) => {
    const updated = TownshipStorage.upvoteComplaint(id);
    if (updated) {
      setComplaints(TownshipStorage.getComplaints());
      if (inspectingComplaint && inspectingComplaint.id === id) {
        setInspectingComplaint(updated);
      }
      showToast(`Thank you! Your endorsement for ${id} has been recorded.`);
    }
  };

  // Toggle RSVP on Event
  const handleToggleRsvp = (id: string) => {
    const updated = TownshipStorage.toggleEventRsvp(id);
    if (updated) {
      setEvents(TownshipStorage.getEvents());
      showToast(updated.isRsvp ? `RSVP confirmed for "${updated.title}"!` : `RSVP cancelled for "${updated.title}".`);
    }
  };

  // New Complaint Submitted by Resident
  const handleNewComplaintSubmitted = (newComplaint: Complaint) => {
    setComplaints(TownshipStorage.getComplaints());
    showToast(`Complaint ${newComplaint.id} submitted! Viewable by Township Operations.`);
  };

  // Reset Demo Data
  const handleResetData = () => {
    TownshipStorage.resetToDefaults();
    setComplaints(TownshipStorage.getComplaints());
    setEvents(TownshipStorage.getEvents());
    setInspectingComplaint(null);
    showToast('Reset completed: Preloaded demo dataset restored.');
  };

  // Start Guided Demo Flow
  const handleStartDemoFlow = () => {
    setPortal('resident');
    setResidentTab('report');
    setIsDemoGuideOpen(true);
  };

  const pendingComplaintsCount = complaints.filter((c) => c.status === 'Pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Navbar
        currentPortal={portal}
        currentResidentTab={residentTab}
        onSelectPortal={(p) => {
          setPortal(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectResidentTab={(tab) => {
          setResidentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingComplaintsCount={pendingComplaintsCount}
        totalComplaintsCount={complaints.length}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm bg-slate-900 text-white text-xs font-semibold py-3 px-4 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center justify-between gap-3">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* VIEW 1: LANDING PAGE */}
        {portal === 'landing' && (
          <LandingPage
            onEnterResident={() => {
              setPortal('resident');
              setResidentTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEnterAdmin={() => {
              setPortal('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartDemoFlow={handleStartDemoFlow}
          />
        )}

        {/* VIEW 2: RESIDENT PORTAL */}
        {portal === 'resident' && (
          <div>
            {residentTab === 'dashboard' && (
              <ResidentDashboard
                complaints={complaints}
                events={events}
                onNavigateToReport={() => setResidentTab('report')}
                onNavigateToReports={() => setResidentTab('my-reports')}
                onNavigateToEvents={() => setResidentTab('events')}
                onNavigateToMap={() => setResidentTab('map')}
                onSelectComplaint={(c) => setInspectingComplaint(c)}
                onToggleRsvp={handleToggleRsvp}
              />
            )}

            {residentTab === 'report' && (
              <ReportIssueForm
                onSuccess={handleNewComplaintSubmitted}
                onNavigateToMyReports={() => setResidentTab('my-reports')}
              />
            )}

            {residentTab === 'my-reports' && (
              <MyReportsList
                complaints={complaints}
                onSelectComplaint={(c) => setInspectingComplaint(c)}
                onNavigateToReport={() => setResidentTab('report')}
                onUpvoteComplaint={handleUpvoteComplaint}
              />
            )}

            {residentTab === 'events' && (
              <CommunityEvents
                events={events}
                onToggleRsvp={handleToggleRsvp}
              />
            )}

            {residentTab === 'map' && (
              <TownshipIssueMap
                complaints={complaints}
                onSelectComplaint={(c) => setInspectingComplaint(c)}
              />
            )}
          </div>
        )}

        {/* VIEW 3: ADMIN DASHBOARD */}
        {portal === 'admin' && (
          <AdminDashboard
            complaints={complaints}
            events={events}
            onComplaintsUpdated={(updated) => setComplaints(updated)}
            onEventsUpdated={(updated) => setEvents(updated)}
            onSwitchToResident={() => {
              setPortal('resident');
              setResidentTab('my-reports');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      {/* 1. Complaint Details Modal (Timeline, Zoom Photo, Contractor Info) */}
      <ComplaintDetailModal
        complaint={inspectingComplaint}
        onClose={() => setInspectingComplaint(null)}
        onUpvote={handleUpvoteComplaint}
        isAdmin={portal === 'admin'}
        onOpenAdminManage={(c) => {
          setPortal('admin');
        }}
      />

      {/* 2. Hackathon Demo Guide Walkthrough Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onStartDemo={() => {
          setPortal('resident');
          setResidentTab('report');
        }}
        onResetData={handleResetData}
      />

      {/* Footer */}
      <Footer
        onResetData={handleResetData}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />
    </div>
  );
}
