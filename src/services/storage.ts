import { Complaint, CommunityEvent, ComplaintStatus } from '../types';
import { INITIAL_COMPLAINTS, INITIAL_EVENTS } from '../data/initialData';

const COMPLAINTS_KEY = 'sdp_townpulse_complaints_v1';
const EVENTS_KEY = 'sdp_townpulse_events_v1';

export class TownshipStorage {
  static getComplaints(): Complaint[] {
    try {
      const raw = localStorage.getItem(COMPLAINTS_KEY);
      if (!raw) {
        this.saveComplaints(INITIAL_COMPLAINTS);
        return INITIAL_COMPLAINTS;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to read complaints from storage', e);
      return INITIAL_COMPLAINTS;
    }
  }

  static saveComplaints(complaints: Complaint[]): void {
    try {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to save complaints', e);
    }
  }

  static getComplaintById(id: string): Complaint | null {
    const list = this.getComplaints();
    return list.find((c) => c.id.toLowerCase() === id.trim().toLowerCase()) || null;
  }

  static addComplaint(
    data: Omit<Complaint, 'id' | 'reportedAt' | 'timeline' | 'status' | 'upvotes'>
  ): Complaint {
    const list = this.getComplaints();
    
    // Generate sequential ID: SDP-2026-011 etc.
    const currentCount = list.length + 1;
    const padded = String(currentCount).padStart(3, '0');
    const newId = `SDP-2026-${padded}`;
    const nowIso = new Date().toISOString();

    const newComplaint: Complaint = {
      ...data,
      id: newId,
      status: 'Pending',
      reportedAt: nowIso,
      upvotes: 1,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          status: 'Pending',
          timestamp: nowIso,
          title: 'Complaint Submitted',
          note: `Report filed by ${data.reportedBy.name} (${data.reportedBy.unit}). Queued for Township Operations review.`,
          actor: 'Resident',
        },
      ],
    };

    // Prepend to top of list
    const updated = [newComplaint, ...list];
    this.saveComplaints(updated);
    return newComplaint;
  }

  static updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    note?: string,
    assignedTeam?: string,
    adminNotes?: string,
    estimatedDate?: string
  ): Complaint | null {
    const list = this.getComplaints();
    const index = list.findIndex((c) => c.id.toLowerCase() === id.trim().toLowerCase());
    if (index === -1) return null;

    const existing = list[index];
    const nowIso = new Date().toISOString();

    const timelineTitle =
      newStatus === 'In Progress'
        ? 'Work Order Dispatched'
        : newStatus === 'Resolved'
        ? 'Resolution Certified & Signed Off'
        : 'Status Updated to Pending';

    const defaultTimelineNote =
      newStatus === 'In Progress'
        ? `Township Operations assigned ${assignedTeam || 'maintenance contractor'} to commence on-site works.`
        : newStatus === 'Resolved'
        ? 'Maintenance and safety inspection completed. Public facility restored.'
        : 'Issue placed back in queue for further evaluation.';

    const newTimelineEvent = {
      id: `tl-${Date.now()}`,
      status: newStatus,
      timestamp: nowIso,
      title: timelineTitle,
      note: note && note.trim().length > 0 ? note.trim() : defaultTimelineNote,
      actor: 'Township Operations' as const,
    };

    const updatedComplaint: Complaint = {
      ...existing,
      status: newStatus,
      assignedTeam: assignedTeam !== undefined ? assignedTeam : existing.assignedTeam,
      adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
      estimatedResolutionDate: estimatedDate !== undefined ? estimatedDate : existing.estimatedResolutionDate,
      resolvedAt: newStatus === 'Resolved' ? nowIso : existing.resolvedAt,
      timeline: [...existing.timeline, newTimelineEvent],
    };

    list[index] = updatedComplaint;
    this.saveComplaints(list);
    return updatedComplaint;
  }

  static upvoteComplaint(id: string): Complaint | null {
    const list = this.getComplaints();
    const index = list.findIndex((c) => c.id.toLowerCase() === id.trim().toLowerCase());
    if (index === -1) return null;

    list[index].upvotes = (list[index].upvotes || 0) + 1;
    this.saveComplaints(list);
    return list[index];
  }

  // Community Events
  static getEvents(): CommunityEvent[] {
    try {
      const raw = localStorage.getItem(EVENTS_KEY);
      if (!raw) {
        this.saveEvents(INITIAL_EVENTS);
        return INITIAL_EVENTS;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to read events from storage', e);
      return INITIAL_EVENTS;
    }
  }

  static saveEvents(events: CommunityEvent[]): void {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events', e);
    }
  }

  static toggleEventRsvp(id: string): CommunityEvent | null {
    const list = this.getEvents();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const current = list[index];
    const willBeRsvp = !current.isRsvp;

    list[index] = {
      ...current,
      isRsvp: willBeRsvp,
      attendeeCount: willBeRsvp ? current.attendeeCount + 1 : Math.max(0, current.attendeeCount - 1),
    };

    this.saveEvents(list);
    return list[index];
  }

  static addEvent(
    data: Omit<CommunityEvent, 'id' | 'attendeeCount' | 'isRsvp'>
  ): CommunityEvent {
    const list = this.getEvents();
    const newEvent: CommunityEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      attendeeCount: 1,
      isRsvp: false,
    };
    const updated = [newEvent, ...list];
    this.saveEvents(updated);
    return newEvent;
  }

  static deleteEvent(id: string): boolean {
    const list = this.getEvents();
    const filtered = list.filter((e) => e.id !== id);
    if (filtered.length !== list.length) {
      this.saveEvents(filtered);
      return true;
    }
    return false;
  }

  static resetToDefaults(): void {
    localStorage.removeItem(COMPLAINTS_KEY);
    localStorage.removeItem(EVENTS_KEY);
    this.saveComplaints(INITIAL_COMPLAINTS);
    this.saveEvents(INITIAL_EVENTS);
  }
}
