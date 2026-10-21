import React, { useState } from 'react';
import { CommunityEvent } from '../../types';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Check, 
  Plus, 
  Sparkles, 
  Share2, 
  ArrowRight, 
  X, 
  Clock, 
  Award,
  Leaf,
  Bike,
  HeartHandshake
} from 'lucide-react';

interface CommunityEventsProps {
  events: CommunityEvent[];
  onToggleRsvp: (eventId: string) => void;
}

export const CommunityEvents: React.FC<CommunityEventsProps> = ({
  events,
  onToggleRsvp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEvent, setActiveEvent] = useState<CommunityEvent | null>(null);

  const filteredEvents = events.filter((e) => {
    return selectedCategory === 'All' || e.category === selectedCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Sustainability':
        return <Leaf className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Recreation':
        return <Bike className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const handleDownloadIcs = (event: CommunityEvent) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sime Darby Property//SDP TownPulse//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-elmina.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-emerald-100">
            Neighbourhood Connectedness
          </span>
          <span className="text-xs text-emerald-300">City of Elmina Community Life</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 font-heading tracking-tight">
          Township Events, Plogging & Eco-Activities
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
          Connect with your neighbours. Take part in tree-planting drives, cycling clinics, and sustainability workshops across our 300-acre Central Park.
        </p>

        {/* Category Pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {['All', 'Sustainability', 'Recreation', 'Community', 'Wellness'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white/10 text-emerald-100 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const percentFull = Math.min(100, Math.round((evt.attendeeCount / evt.capacity) * 100));

          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                      {getCategoryIcon(evt.category)}
                      {evt.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold">
                    {evt.precinct}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{evt.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{evt.time}</span>
                  </div>

                  <h3
                    onClick={() => setActiveEvent(evt)}
                    className="font-bold text-slate-900 text-lg leading-snug hover:text-emerald-800 cursor-pointer transition-colors"
                  >
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>

                  {/* Highlights preview */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {evt.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        ✨ {h}
                      </span>
                    ))}
                  </div>

                  {/* Attendees Progress */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{evt.attendeeCount}</strong> / {evt.capacity} attending
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700">{percentFull}% full</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${percentFull}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveEvent(evt)}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
                >
                  View Details
                </button>

                <button
                  onClick={() => onToggleRsvp(evt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                    evt.isRsvp
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900'
                  }`}
                >
                  {evt.isRsvp ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      RSVP Confirmed
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      RSVP Attend
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Cover Image */}
            <div className="relative h-56 bg-slate-100">
              <img
                src={activeEvent.imageUrl}
                alt={activeEvent.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-800 shadow-md">
                  {activeEvent.category}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                {activeEvent.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 font-medium">Date & Time</span>
                    <p className="font-bold text-slate-800">{activeEvent.date}</p>
                    <p className="text-slate-600">{activeEvent.time}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 font-medium">Location</span>
                    <p className="font-bold text-slate-800">{activeEvent.location}</p>
                    <p className="text-slate-600">{activeEvent.precinct}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  About the Activity
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Event Highlights & What's Provided
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeEvent.highlights.map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-medium flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Organized by: <strong className="text-slate-800">{activeEvent.organizer}</strong>
              </div>
            </div>

            {/* Modal Footer with RSVP and Calendar Action */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleDownloadIcs(activeEvent)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Add to Calendar (.ics)
              </button>

              <button
                onClick={() => {
                  onToggleRsvp(activeEvent.id);
                  setActiveEvent({
                    ...activeEvent,
                    isRsvp: !activeEvent.isRsvp,
                    attendeeCount: !activeEvent.isRsvp ? activeEvent.attendeeCount + 1 : activeEvent.attendeeCount - 1,
                  });
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  activeEvent.isRsvp
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800 text-white hover:bg-emerald-900'
                }`}
              >
                {activeEvent.isRsvp ? (
                  <>
                    <Check className="w-4 h-4" />
                    RSVP Confirmed (Going)
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Confirm My Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
