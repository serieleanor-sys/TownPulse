import React, { useState, useRef } from 'react';
import { 
  Complaint, 
  ComplaintCategory, 
  ComplaintSeverity, 
  AIAnalysisResult 
} from '../../types';
import { SAMPLE_PHOTO_PRESETS, TOWNSHIP_PRECINCTS } from '../../data/initialData';
import { analyzeFacilityIssue } from '../../services/aiService';
import { TownshipStorage } from '../../services/storage';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  HelpCircle, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Navigation
} from 'lucide-react';

interface ReportIssueFormProps {
  onSuccess: (newComplaint: Complaint) => void;
  onNavigateToMyReports: () => void;
}

const CATEGORIES: ComplaintCategory[] = [
  'Road Damage',
  'Street Lighting',
  'Drainage',
  'Landscaping',
  'Public Facilities',
  'Walkway Obstruction',
  'Others',
];

const SEVERITIES: ComplaintSeverity[] = ['Low', 'Medium', 'High', 'Critical'];

export const ReportIssueForm: React.FC<ReportIssueFormProps> = ({
  onSuccess,
  onNavigateToMyReports,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [category, setCategory] = useState<ComplaintCategory>('Road Damage');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<ComplaintSeverity>('High');
  const [precinct, setPrecinct] = useState<string>('Elmina Valley 2');
  const [address, setAddress] = useState<string>('Persiaran Elmina West near Guardhouse');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 3.1845,
    lng: 101.5012,
  });

  // Reporter details
  const [residentName, setResidentName] = useState<string>('Aiman Haziq');
  const [residentUnit, setResidentUnit] = useState<string>('EV2-B-14');
  const [residentPhone, setResidentPhone] = useState<string>('+60 12-384 9912');

  // AI analysis states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Geolocation state
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Quick Preset Selection
  const handleSelectPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setPhotoUrl(preset.url);
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category as ComplaintCategory);
    setSeverity(preset.severity);
    setAiResult(null);
    setAiError(null);
  };

  // Image Upload Handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPhotoUrl(base64);
      setAiResult(null);
      setAiError(null);
    };
    reader.readAsDataURL(file);
  };

  // AI Visual Inspection Trigger
  const handleAnalyzeWithAI = async () => {
    if (!photoUrl) {
      alert('Please upload a photo or pick a sample preset first.');
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);

    try {
      const result = await analyzeFacilityIssue({
        imageBase64: photoUrl,
        userHint: title || description || category,
      });

      if (result.success && result.analysis) {
        setAiResult(result.analysis);
        // Automatically populate fields while leaving them 100% editable
        setCategory(result.analysis.category);
        if (result.analysis.suggestedTitle) {
          setTitle(result.analysis.suggestedTitle);
        }
        if (result.analysis.suggestedDescription) {
          setDescription(result.analysis.suggestedDescription);
        }
        if (result.analysis.severity) {
          setSeverity(result.analysis.severity);
        }
      }
    } catch (err: any) {
      setAiError('AI analysis could not complete. You can still fill out the form manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Geolocation Detection with graceful fallback
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Requesting GPS coordinate access...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setIsDetectingLocation(false);
        setLocationStatus(`GPS pinned: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      },
      (err) => {
        setIsDetectingLocation(false);
        // Fallback to City of Elmina coordinates with realistic jitter
        const offsetLat = 3.1790 + (Math.random() - 0.5) * 0.008;
        const offsetLng = 101.5040 + (Math.random() - 0.5) * 0.008;
        setCoordinates({ lat: offsetLat, lng: offsetLng });
        setLocationStatus('Permission not granted or timed out. Defaulted to City of Elmina precinct coordinates.');
      },
      { timeout: 8000 }
    );
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!photoUrl) errors.photo = 'Please provide an issue photo or pick a preset.';
    if (!title.trim()) errors.title = 'Please enter a title for the issue.';
    if (!description.trim()) errors.description = 'Please describe the facility problem.';
    if (!address.trim()) errors.address = 'Please specify the road, landmark, or location.';
    if (!residentName.trim()) errors.name = 'Please provide your name.';
    if (!residentUnit.trim()) errors.unit = 'Please provide your unit number.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const newReport = TownshipStorage.addComplaint({
        title: title.trim(),
        category,
        description: description.trim(),
        severity,
        location: {
          precinct,
          address: address.trim(),
          coordinates,
        },
        photoUrl: photoUrl || SAMPLE_PHOTO_PRESETS[0].url,
        reportedBy: {
          name: residentName.trim(),
          unit: residentUnit.trim(),
          phone: residentPhone.trim(),
        },
        aiAnalysis: aiResult || undefined,
      });

      // Confetti burst!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#047857', '#10B981', '#34D399', '#F59E0B'],
        });
      } catch (e) {
        // Confetti optional
      }

      setSubmittedComplaint(newReport);
      onSuccess(newReport);
    } catch (err: any) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already submitted, show beautiful confirmation card
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Complaint Successfully Registered
        </span>

        <h3 className="text-2xl font-bold text-slate-900 mt-3 font-heading">
          Thank you for keeping Elmina vibrant & safe!
        </h3>

        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          Your report has been queued in the Sime Darby Property Township Operations ticketing system. You can track work orders and contractor updates in real time.
        </p>

        {/* Tracking ID Badge */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block w-full max-w-md text-left">
          <div className="text-xs text-slate-500 font-medium">Tracking Reference Number</div>
          <div className="text-2xl font-mono font-extrabold text-emerald-800 mt-0.5 flex items-center justify-between">
            <span>{submittedComplaint.id}</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Pending Operations Review
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Category:</span>
              <p className="font-semibold text-slate-800">{submittedComplaint.category}</p>
            </div>
            <div>
              <span className="text-slate-400">Location:</span>
              <p className="font-semibold text-slate-800 truncate">{submittedComplaint.location.precinct}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onNavigateToMyReports}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            Track in My Reports
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSubmittedComplaint(null);
              setPhotoUrl('');
              setTitle('');
              setDescription('');
              setAiResult(null);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-emerald-100 backdrop-blur-xs">
            City of Elmina Resident Care
          </span>
          <span className="text-xs text-emerald-200">24/7 Township Operations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 font-heading tracking-tight">
          Report a Damaged Public Facility
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
          Upload a photo of any broken streetlight, damaged playground, drainage blockage, or road pothole. Let our Gemini AI assist in diagnosing the issue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Section 1: Photo Upload & AI Analysis */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900">
            1. Issue Photo & AI Visual Inspection <span className="text-rose-500">*</span>
          </label>

          {/* Quick preset selector for judges & rapid demos */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="text-xs font-semibold text-emerald-900 mb-2 flex items-center justify-between">
              <span>Quick Demo Photo Presets:</span>
              <span className="text-[11px] text-emerald-700 font-normal">Click to load instantly</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SAMPLE_PHOTO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-1.5 rounded-xl text-left border transition-all flex flex-col items-center text-center ${
                    photoUrl === preset.url
                      ? 'border-emerald-600 bg-emerald-100/80 shadow-xs ring-2 ring-emerald-500/30'
                      : 'border-slate-200 bg-white hover:border-emerald-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-12 object-cover rounded-lg mb-1"
                  />
                  <span className="text-[10px] font-bold text-slate-800 line-clamp-1">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload or Camera Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/30 flex flex-col items-center justify-center min-h-[160px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">Upload or snap photo</p>
              <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG, or WEBP up to 10MB</p>
            </div>

            {/* Photo Preview Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[160px] flex items-center justify-center">
              {photoUrl ? (
                <>
                  <img
                    src={photoUrl}
                    alt="Issue preview"
                    className="w-full h-full object-cover max-h-48"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-900/70 text-white text-[11px] font-semibold hover:bg-slate-900"
                  >
                    Clear
                  </button>
                </>
              ) : (
                <div className="text-center text-slate-400 p-4">
                  <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs">No photo selected yet</span>
                </div>
              )}
            </div>
          </div>
          {validationErrors.photo && (
            <p className="text-xs text-rose-600 font-semibold">{validationErrors.photo}</p>
          )}

          {/* AI Visual Inspection Button */}
          {photoUrl && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>Analyzing Image with Gemini Vision...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Analyse with AI (Inspect Category, Title & Severity)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* AI Result Card */}
          {aiResult && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Gemini AI Visual Assessment Result
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-200/80">
                  Preliminary Suggestion
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-slate-500">Detected Category:</span>
                    <p className="font-bold text-emerald-900">{aiResult.category}</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-slate-500">Suggested Severity:</span>
                    <p className="font-bold text-emerald-900">{aiResult.severity}</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[11px] text-slate-500">Safety Hazard:</span>
                    <p className="font-bold text-emerald-900">{aiResult.safetyHazard ? '⚠️ Yes (Caution)' : '✅ Low Risk'}</p>
                  </div>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500">Suggested Title:</span>
                  <p className="font-semibold text-slate-800">{aiResult.suggestedTitle}</p>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500">Suggested Description:</span>
                  <p className="text-slate-700">{aiResult.suggestedDescription}</p>
                </div>

                {aiResult.detectedElements && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {aiResult.detectedElements.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-semibold">
                        • {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-[11px] text-emerald-700 mt-2.5 italic">
                * Note: AI suggestions have been populated below. You can review and edit all fields before submitting.
              </p>
            </div>
          )}

          {aiError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              {aiError}
            </div>
          )}
        </div>

        {/* Section 2: Issue Details */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <label className="block text-sm font-bold text-slate-900">
            2. Issue Category & Description
          </label>

          {/* Category Chips */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">Category:</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Pothole along Persiaran Elmina West"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {validationErrors.title && (
              <p className="text-xs text-rose-600 mt-1">{validationErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the damaged facility, visible hazard, how long it has been broken, and any impact on pedestrians or drivers..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                validationErrors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {validationErrors.description && (
              <p className="text-xs text-rose-600 mt-1">{validationErrors.description}</p>
            )}
          </div>

          {/* Severity selector */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">Severity Level:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEVERITIES.map((sev) => {
                const isSelected = severity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? sev === 'Critical'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : sev === 'High'
                          ? 'bg-orange-600 text-white border-orange-600'
                          : sev === 'Medium'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900">
              3. Township Location & GPS
            </label>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 p-1 rounded hover:bg-emerald-50"
            >
              {isDetectingLocation ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              Detect Current Location
            </button>
          </div>

          {locationStatus && (
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {locationStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Precinct / Enclave <span className="text-rose-500">*</span>
              </label>
              <select
                value={precinct}
                onChange={(e) => setPrecinct(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {TOWNSHIP_PRECINCTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Road / Landmark / Street <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Lakeside Boardwalk Deck 2"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  validationErrors.address ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {validationErrors.address && (
                <p className="text-xs text-rose-600 mt-1">{validationErrors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Resident Contact Info */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <label className="block text-sm font-bold text-slate-900">
            4. Resident Contact Details (For Progress SMS / Call)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resident Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit / Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={residentUnit}
                onChange={(e) => setResidentUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={residentPhone}
                onChange={(e) => setResidentPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submission Button */}
        <div className="pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering Complaint with Township Operations...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Submit Complaint & Generate Tracking ID</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            Complaints are assigned directly to verified Sime Darby Property maintenance contractors.
          </p>
        </div>
      </form>
    </div>
  );
};
