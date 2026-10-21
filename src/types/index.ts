export type ComplaintCategory =
  | 'Road Damage'
  | 'Street Lighting'
  | 'Drainage'
  | 'Landscaping'
  | 'Public Facilities'
  | 'Walkway Obstruction'
  | 'Others';

export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface ComplaintTimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  title: string;
  note: string;
  actor: 'Resident' | 'Township Operations' | 'Contractor Team' | 'System';
}

export interface ComplaintLocation {
  precinct: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface AIAnalysisResult {
  category: ComplaintCategory;
  suggestedTitle: string;
  suggestedDescription: string;
  severity: ComplaintSeverity;
  detectedElements: string[];
  safetyHazard: boolean;
  safetyNote?: string;
  source?: 'gemini' | 'smart_analyzer_fallback';
}

export interface Complaint {
  id: string; // e.g., 'SDP-2026-001'
  title: string;
  category: ComplaintCategory;
  description: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  location: ComplaintLocation;
  photoUrl: string;
  reportedBy: {
    name: string;
    unit: string;
    phone: string;
    email?: string;
  };
  reportedAt: string; // ISO string
  assignedTeam?: string;
  adminNotes?: string;
  estimatedResolutionDate?: string;
  resolvedAt?: string;
  timeline: ComplaintTimelineEvent[];
  aiAnalysis?: AIAnalysisResult;
  upvotes: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Recreation' | 'Sustainability' | 'Community' | 'Wellness' | 'Safety';
  date: string;
  time: string;
  location: string;
  precinct: string;
  description: string;
  organizer: string;
  capacity: number;
  attendeeCount: number;
  isRsvp: boolean;
  imageUrl: string;
  highlights: string[];
}

export type AppPortal = 'landing' | 'resident' | 'admin';
export type ResidentTab = 'dashboard' | 'report' | 'my-reports' | 'events' | 'map';
export type AdminTab = 'overview' | 'complaints' | 'analytics' | 'events';
