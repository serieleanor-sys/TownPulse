import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../../types';
import { 
  MapPin, 
  Layers, 
  ListFilter, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Navigation,
  Compass
} from 'lucide-react';

interface TownshipIssueMapProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const TownshipIssueMap: React.FC<TownshipIssueMapProps> = ({
  complaints,
  onSelectComplaint,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePin, setActivePin] = useState<Complaint | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtering
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const matchStatus = selectedStatus === 'All' || item.status === selectedStatus;
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchStatus && matchCategory;
    });
  }, [complaints, selectedStatus, selectedCategory]);

  // Mapping Elmina geo coordinates (Lat: ~3.165 to 3.195, Lng: ~101.495 to 101.520) into SVG coordinates (800 x 520)
  const mapCoordinates = (lat: number, lng: number) => {
    const minLat = 3.165;
    const maxLat = 3.195;
    const minLng = 101.495;
    const maxLng = 101.522;

    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    // Invert Y because latitude increases northward (upward)
    const y = 500 - (((lat - minLat) / (maxLat - minLat)) * 440 + 30);
    return { x, y };
  };

  const getPinColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return '#F59E0B'; // Amber
      case 'In Progress':
        return '#3B82F6'; // Blue
      case 'Resolved':
        return '#10B981'; // Emerald
      default:
        return '#6B7280';
    }
  };

  // Group complaints by precinct for the list fallback
  const groupedByPrecinct = useMemo(() => {
    const map = new Map<string, Complaint[]>();
    filteredComplaints.forEach((c) => {
      const precinct = c.location.precinct || 'Other Township Areas';
      if (!map.has(precinct)) map.set(precinct, []);
      map.get(precinct)!.push(c);
    });
    return Array.from(map.entries());
  }, [filteredComplaints]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50/50 via-slate-50 to-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              City of Elmina Pilot
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" /> 5,000-Acre Township GIS Grid
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 font-heading">
            Township Infrastructure & Incident Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive spatial view of active reports, road maintenance, and facilities across precincts.
          </p>
        </div>

        {/* View Switcher & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Statuses ({complaints.length})</option>
            <option value="Pending">Pending ({complaints.filter(c => c.status === 'Pending').length})</option>
            <option value="In Progress">In Progress ({complaints.filter(c => c.status === 'In Progress').length})</option>
            <option value="Resolved">Resolved ({complaints.filter(c => c.status === 'Resolved').length})</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Street Lighting">Street Lighting</option>
            <option value="Drainage">Drainage</option>
            <option value="Landscaping">Landscaping</option>
            <option value="Public Facilities">Public Facilities</option>
            <option value="Walkway Obstruction">Walkway Obstruction</option>
          </select>

          {/* Toggle Map / List view */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Interactive Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Precinct List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="relative bg-[#F4F7F4] overflow-hidden select-none" style={{ minHeight: '520px' }}>
          {/* Zoom & Pan Bar */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.25))}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm text-xs flex flex-wrap items-center gap-3.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Live Pins ({filteredComplaints.length}):
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-white"></span>
              <span className="text-slate-600">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm border border-white"></span>
              <span className="text-slate-600">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border border-white"></span>
              <span className="text-slate-600">Resolved</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-auto">
            <svg
              viewBox="0 0 800 520"
              className="w-full max-w-4xl transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center',
              }}
            >
              {/* Defs: Gradients, Patterns */}
              <defs>
                <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D1FAE5" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.8" />
                </linearGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
                </pattern>
              </defs>

              {/* Background Township Grid */}
              <rect width="800" height="520" fill="url(#grid)" />

              {/* Township Precinct Land Plots */}
              {/* Elmina Central Park (300 Acres) */}
              <path
                d="M 280 180 Q 400 120, 520 200 T 580 340 T 420 400 T 260 320 Z"
                fill="url(#parkGrad)"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="370" y="270" fill="#047857" fontSize="13" fontWeight="700" letterSpacing="1">
                ELMINA CENTRAL PARK (300 ACRES)
              </text>

              {/* Elmina Lake Waters */}
              <path
                d="M 330 230 C 390 190, 470 210, 480 270 C 490 320, 410 340, 350 310 C 310 290, 300 250, 330 230 Z"
                fill="url(#lakeGrad)"
                stroke="#3B82F6"
                strokeWidth="1"
              />
              <text x="365" y="280" fill="#1D4ED8" fontSize="11" fontWeight="600">
                Lakeside Basin
              </text>

              {/* Iconic Rainbow Bridge Representation */}
              <path
                d="M 310 210 Q 360 170, 410 210"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <text x="330" y="185" fill="#BE123C" fontSize="10" fontWeight="700">
                🌈 Rainbow Bridge
              </text>

              {/* Elmina Lakeside Mall Plot */}
              <rect x="520" y="270" width="130" height="75" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.2" />
              <text x="532" y="305" fill="#B45309" fontSize="11" fontWeight="700">
                🛍️ Lakeside Mall
              </text>
              <text x="532" y="322" fill="#92400E" fontSize="9">
                Retail & Dining Hub
              </text>

              {/* Elmina Valley 1-5 Residential Quadrants */}
              <rect x="70" y="110" width="140" height="90" rx="10" fill="#E2E8F0" opacity="0.6" stroke="#94A3B8" />
              <text x="85" y="150" fill="#334155" fontSize="12" fontWeight="700">
                Elmina Valley 1 & 2
              </text>
              <text x="85" y="168" fill="#64748B" fontSize="9">
                Residential Precinct
              </text>

              <rect x="90" y="230" width="140" height="110" rx="10" fill="#E2E8F0" opacity="0.6" stroke="#94A3B8" />
              <text x="105" y="275" fill="#334155" fontSize="12" fontWeight="700">
                Elmina Valley 3 & 4
              </text>
              <text x="105" y="293" fill="#64748B" fontSize="9">
                Park-front Enclave
              </text>

              {/* Elmina Green Quadrant */}
              <rect x="560" y="70" width="170" height="110" rx="10" fill="#E2E8F0" opacity="0.6" stroke="#94A3B8" />
              <text x="580" y="115" fill="#334155" fontSize="12" fontWeight="700">
                Elmina Green 1-7
              </text>
              <text x="580" y="133" fill="#64748B" fontSize="9">
                Family Living Cluster
              </text>

              {/* Elmina Ridge */}
              <rect x="330" y="40" width="150" height="60" rx="10" fill="#ECFDF5" stroke="#10B981" strokeWidth="0.8" />
              <text x="360" y="75" fill="#065F46" fontSize="11" fontWeight="700">
                ⛰️ Elmina Ridge
              </text>

              {/* Denai Alam Connection Link */}
              <rect x="590" y="390" width="150" height="80" rx="10" fill="#F1F5F9" stroke="#94A3B8" />
              <text x="610" y="430" fill="#475569" fontSize="11" fontWeight="600">
                Denai Alam Link
              </text>

              {/* 90km Cycling & Jogging Trail (Red dashed loop) */}
              <path
                d="M 50 160 C 120 40, 680 40, 740 180 C 780 290, 710 460, 520 470 C 300 480, 80 440, 50 300 Z"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.7"
              />
              <text x="90" y="450" fill="#DC2626" fontSize="10" fontWeight="700">
                🚲 90KM CONTINUOUS WELLNESS TRAIL
              </text>

              {/* Arterial Roads */}
              {/* Persiaran Elmina */}
              <path d="M 20 200 L 780 200" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
              <path d="M 20 200 L 780 200" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10 10" />
              <text x="210" y="194" fill="#64748B" fontSize="9" fontWeight="600">
                Persiaran Elmina West
              </text>
              <text x="580" y="194" fill="#64748B" fontSize="9" fontWeight="600">
                Persiaran Elmina East
              </text>

              {/* Interactive Issue Pins */}
              {filteredComplaints.map((c) => {
                const { x, y } = mapCoordinates(c.location.coordinates.lat, c.location.coordinates.lng);
                const color = getPinColor(c.status);
                const isSelected = activePin?.id === c.id;

                return (
                  <g
                    key={c.id}
                    className="cursor-pointer transition-transform duration-200"
                    transform={`translate(${x}, ${y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePin(c);
                    }}
                  >
                    {/* Pulsing ring for critical/high issues */}
                    {(c.severity === 'Critical' || c.severity === 'High') && c.status !== 'Resolved' && (
                      <circle r="18" fill={color} opacity="0.25">
                        <animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Shadow */}
                    <ellipse cx="0" cy="5" rx="8" ry="3" fill="#000000" opacity="0.25" />

                    {/* Pin Shape */}
                    <path
                      d="M 0 0 C -8 -14, -8 -26, 0 -26 C 8 -26, 8 -14, 0 0 Z"
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? '3' : '1.5'}
                      filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))"
                    />

                    {/* Inner Pin Dot */}
                    <circle cx="0" cy="-18" r="4" fill="#FFFFFF" />

                    {/* Pin Label on Hover or Active */}
                    <g transform="translate(10, -20)">
                      <rect
                        x="0"
                        y="-10"
                        width={c.id.length * 6 + 18}
                        height="18"
                        rx="4"
                        fill="#0F172A"
                        opacity={isSelected ? '0.95' : '0.8'}
                      />
                      <text x="8" y="3" fill="#FFFFFF" fontSize="9" fontWeight="700">
                        {c.id}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Pin Detail Popup Floating Card */}
          {activePin && (
            <div className="absolute bottom-6 right-6 z-20 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="flex items-start justify-between gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: getPinColor(activePin.status) }}
                >
                  {activePin.status}
                </span>
                <button
                  onClick={() => setActivePin(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2 flex gap-3">
                <img
                  src={activePin.photoUrl}
                  alt={activePin.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-emerald-700 font-bold">{activePin.id}</div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {activePin.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {activePin.location.precinct} • {activePin.category}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                {activePin.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {activePin.location.coordinates.lat.toFixed(4)}, {activePin.location.coordinates.lng.toFixed(4)}
                </span>
                <button
                  onClick={() => {
                    onSelectComplaint(activePin);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                >
                  Inspect Report
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Fallback: Functional Precinct Location List */
        <div className="p-4 sm:p-6 bg-slate-50 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Township Spatial Directory:</strong> Facilities and complaints indexed across City of Elmina precincts and major wellness arteries.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedByPrecinct.map(([precinct, items]) => (
              <div key={precinct} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {items.length}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{precinct}</h3>
                      <p className="text-[11px] text-slate-500">
                        {items.filter(i => i.status === 'Resolved').length} resolved, {items.filter(i => i.status !== 'Resolved').length} active
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">City of Elmina</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectComplaint(item)}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.photoUrl}
                          alt=""
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-emerald-700">{item.id}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] text-slate-500 font-medium truncate">{item.category}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.location.address}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {item.location.coordinates.lat.toFixed(3)}, {item.location.coordinates.lng.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
