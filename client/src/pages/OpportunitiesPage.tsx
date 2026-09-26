import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Opportunity, CandidatePreferences, Resume } from '../types/index.js';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Loader2,
  DollarSign,
  X,
  Target,
  Wand2,
} from 'lucide-react';

interface OpportunitiesPageProps {
  onNavigate: (tab: string) => void;
  onSelectJobForInterview?: (jobTitle: string, company: string, description: string) => void;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({
  onNavigate,
  onSelectJobForInterview,
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [preferences, setPreferences] = useState<CandidatePreferences | null>(null);
  const [showPrefModal, setShowPrefModal] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [employmentType, setEmploymentType] = useState('Any');
  const [remoteType, setRemoteType] = useState('Any');

  // Selected Opportunity for details view or apply modal
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [applyModalOpp, setApplyModalOpp] = useState<Opportunity | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  useEffect(() => {
    fetchOpportunities();
    fetchPreferences();
  }, [employmentType, remoteType]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.getOpportunities({
        employmentType: employmentType !== 'Any' ? employmentType : undefined,
        remoteType: remoteType !== 'Any' ? remoteType : undefined,
        search: search.trim() || undefined,
      });

      if (res.data.success) {
        setOpportunities(res.data.opportunities);
        setHasResume(res.data.hasResume);
      }
    } catch (err) {
      console.warn('Opportunities load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await api.getPreferences();
      if (res.data.success) {
        setPreferences(res.data.preferences);
      }
    } catch (err) {
      console.warn('Preferences load notice:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleSaveToTracker = async (opp: Opportunity, targetStatus: 'Saved' | 'Applied' = 'Saved') => {
    try {
      setSavingId(opp.externalId);
      const res = await api.createApplication({
        company: opp.company,
        role: opp.title,
        opportunityId: opp.externalId,
        employmentType: opp.employmentType,
        applicationUrl: opp.applicationUrl,
        source: opp.source,
        status: targetStatus,
        salary: opp.salary,
        notes: `Added from Opportunities Discovery. Required skills: ${opp.skills.slice(0, 4).join(', ')}.`,
      });

      if (res.data.success) {
        setSavedSuccessMsg(`Added "${opp.company} — ${opp.title}" to your Application Tracker!`);
        setTimeout(() => setSavedSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      console.warn('Failed to save to tracker:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleConfirmApply = (opp: Opportunity) => {
    window.open(opp.applicationUrl, '_blank', 'noopener,noreferrer');
    handleSaveToTracker(opp, 'Applied');
    setApplyModalOpp(null);
  };

  const handlePrepareInterviewForRole = (opp: Opportunity) => {
    if (onSelectJobForInterview) {
      onSelectJobForInterview(opp.title, opp.company, `${opp.description}\n\nKey skills: ${opp.skills.join(', ')}`);
    }
    onNavigate('interview');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header & Preference Bar */}
      <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] p-8 sm:p-10 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" /> Opportunity Intelligence
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A22] font-display">
              Discover & Match Opportunities
            </h1>
            <p className="text-base text-[#6B756D] max-w-2xl">
              Real jobs and internships from official career portals, algorithmically matched against your active resume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('applications')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#F4F7F1] hover:bg-[#E5EEDC] text-[#344E41] font-bold text-xs transition-colors"
            >
              <Briefcase className="w-4 h-4 text-[#6B8E5A]" />
              My Applications Tracker
            </button>
            <button
              onClick={() => setShowPrefModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white font-bold text-xs transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4E2C5]" />
              Edit Job Preferences
            </button>
          </div>
        </div>

        {/* Candidate Profile Strip */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B756D]">
          <div className="flex flex-wrap items-center gap-6">
            <span>
              Target Role: <strong className="text-[#1F2A22]">{preferences?.preferredRole || 'Software Engineer'}</strong>
            </span>
            <span>
              Location: <strong className="text-[#1F2A22]">{preferences?.preferredLocation || 'Remote / Global'}</strong>
            </span>
            <span>
              Type: <strong className="text-[#1F2A22]">{preferences?.employmentType || 'Any'}</strong>
            </span>
          </div>

          {!hasResume && (
            <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Upload a resume to compute estimated match scores.</span>
              <button
                onClick={() => onNavigate('resume')}
                className="underline font-bold hover:text-amber-900"
              >
                Upload now
              </button>
            </div>
          )}
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-4 bg-[#E5EEDC] text-[#344E41] rounded-2xl border border-[#6B8E5A]/30 flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#6B8E5A] flex-shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* 2. Filters & Search Bar */}
      <div className="bg-white rounded-2xl border border-[rgba(52,78,65,0.08)] p-4 sm:p-5 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company, or technology (e.g. React, Go, Stripe)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F7F1] border border-transparent focus:border-[#6B8E5A] rounded-xl text-xs text-[#1F2A22] outline-none transition-all"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="py-2.5 px-3.5 bg-[#F4F7F1] border border-transparent rounded-xl text-xs font-semibold text-[#344E41] outline-none focus:border-[#6B8E5A]"
          >
            <option value="Any">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            value={remoteType}
            onChange={(e) => setRemoteType(e.target.value)}
            className="py-2.5 px-3.5 bg-[#F4F7F1] border border-transparent rounded-xl text-xs font-semibold text-[#344E41] outline-none focus:border-[#6B8E5A]"
          >
            <option value="Any">All Workplaces</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <button
            onClick={fetchOpportunities}
            className="px-4 py-2.5 rounded-xl bg-[#344E41] hover:bg-[#4B6B5B] text-white text-xs font-bold transition-colors"
          >
            Filter
          </button>
        </div>
      </div>

      {/* 3. Opportunities List (Editorial List Layout) */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
          <p className="text-sm text-[#6B756D]">Scanning verified career feeds and computing matches...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] space-y-4">
          <Briefcase className="w-12 h-12 text-[#6B8E5A] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-[#1F2A22]">No Live Opportunities Found</h3>
          <p className="text-sm text-[#6B756D] max-w-md mx-auto">
            Try adjusting your search keywords or workplace filters. If you wish to configure a custom job feed, add authorized API credentials in your server environment.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setEmploymentType('Any');
              setRemoteType('Any');
            }}
            className="px-6 py-2.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-bold text-xs hover:bg-[#D4E2C5] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => {
            const matchScore = opp.match?.score;
            return (
              <div
                key={opp.externalId}
                className="bg-white rounded-2xl border border-[rgba(52,78,65,0.09)] p-6 shadow-soft hover:border-[#6B8E5A]/40 transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#6B8E5A]">{opp.company}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[11px] font-semibold text-[#6B756D]">{opp.source}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F4F7F1] text-[#344E41] font-semibold">
                        {opp.employmentType}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-semibold">
                        {opp.remoteType}
                      </span>
                    </div>

                    <h2
                      onClick={() => setSelectedOpp(opp)}
                      className="text-lg sm:text-xl font-bold text-[#1F2A22] hover:text-[#6B8E5A] cursor-pointer transition-colors"
                    >
                      {opp.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B756D] pt-1">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#6B8E5A]" />
                        {opp.location}
                      </span>
                      {opp.salary && (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#344E41]">
                          <DollarSign className="w-3.5 h-3.5 text-[#6B8E5A]" />
                          {opp.salary}
                        </span>
                      )}
                      {opp.deadline && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#6B8E5A]" />
                          Deadline: {opp.deadline}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Badge */}
                  {matchScore !== undefined && matchScore !== null && (
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 flex-shrink-0">
                      <div className="px-3 py-1.5 rounded-full bg-[#E5EEDC] border border-[#6B8E5A]/25 text-[#344E41] text-xs font-extrabold flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-[#6B8E5A]" />
                        <span>Resume Match: {matchScore}%</span>
                      </div>
                      <span className="text-[10px] text-[#6B756D]">Estimated compatibility</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#6B756D] line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* Matching Skills Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {opp.skills.map((skill) => {
                    const isMatched = opp.match?.matchingSkills?.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          isMatched
                            ? 'bg-[#E5EEDC] text-[#344E41] border border-[#6B8E5A]/30 font-semibold'
                            : 'bg-[#F4F7F1] text-[#6B756D]'
                        }`}
                      >
                        {isMatched ? `✓ ${skill}` : skill}
                      </span>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOpp(opp)}
                      className="px-4 py-2 rounded-full bg-[#F4F7F1] hover:bg-[#E5EEDC] text-[#344E41] font-bold text-xs transition-colors"
                    >
                      View Role Details
                    </button>
                    <button
                      onClick={() => handleSaveToTracker(opp, 'Saved')}
                      disabled={savingId === opp.externalId}
                      className="px-3.5 py-2 rounded-full border border-gray-200 hover:border-gray-300 text-[#6B756D] hover:text-[#1F2A22] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#6B8E5A]" />
                      Save
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrepareInterviewForRole(opp)}
                      className="px-4 py-2 rounded-full border border-[#6B8E5A]/30 text-[#344E41] hover:bg-[#E5EEDC] font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" />
                      Prepare Mock Interview
                    </button>

                    <button
                      onClick={() => setApplyModalOpp(opp)}
                      className="px-5 py-2 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      Apply Now <ExternalLink className="w-3 h-3 text-[#D4E2C5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Detailed Job View Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-gray-100 shadow-2xl relative">
            <button
              onClick={() => setSelectedOpp(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-xs font-bold text-[#6B8E5A] uppercase">{selectedOpp.company}</span>
              <h2 className="text-2xl font-extrabold text-[#1F2A22] font-display mt-1">
                {selectedOpp.title}
              </h2>
              <p className="text-xs text-[#6B756D] mt-1">
                Source: {selectedOpp.source} • {selectedOpp.location} • {selectedOpp.employmentType}
              </p>
            </div>

            {/* Estimated Match Panel */}
            {selectedOpp.match && (
              <div className="p-4 bg-[#E5EEDC]/70 rounded-2xl border border-[#6B8E5A]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#6B8E5A]" />
                    <span className="text-sm font-extrabold text-[#344E41]">
                      Your Estimated Resume Match: {selectedOpp.match.score}%
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6B756D]">Algorithmic Estimate</span>
                </div>

                <div className="text-xs text-[#344E41] space-y-1.5">
                  {selectedOpp.match.recommendation.matchingHighlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59] mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                  {selectedOpp.match.recommendation.improvementSuggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#C88A36]">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-[#6B756D] pt-1 border-t border-[rgba(52,78,65,0.1)]">
                  {selectedOpp.match.disclaimer}
                </p>
              </div>
            )}

            {/* Responsibilities */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#1F2A22]">Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#6B756D] leading-relaxed">
                {selectedOpp.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#1F2A22]">Requirements & Qualifications</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#6B756D] leading-relaxed">
                {selectedOpp.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedOpp(null);
                  onNavigate('improve');
                }}
                className="px-4 py-2.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-bold text-xs hover:bg-[#D4E2C5] transition-colors inline-flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#6B8E5A]" />
                Improve Resume for This Role
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSaveToTracker(selectedOpp, 'Saved');
                    setSelectedOpp(null);
                  }}
                  className="px-4 py-2.5 rounded-full border border-gray-200 text-[#344E41] font-bold text-xs hover:bg-gray-50 transition-colors"
                >
                  Save in Tracker
                </button>
                <button
                  onClick={() => {
                    const opp = selectedOpp;
                    setSelectedOpp(null);
                    setApplyModalOpp(opp);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white font-bold text-xs transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  Apply on Career Site <ExternalLink className="w-3.5 h-3.5 text-[#D4E2C5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. External Apply Confirmation Modal */}
      {applyModalOpp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-gray-100 shadow-2xl relative">
            <button
              onClick={() => setApplyModalOpp(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#E5EEDC] flex items-center justify-center text-[#344E41]">
              <ExternalLink className="w-6 h-6 text-[#6B8E5A]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#1F2A22]">
                Apply at {applyModalOpp.company}
              </h3>
              <p className="text-xs text-[#6B756D] leading-relaxed">
                You are about to be redirected to the official public application portal at{' '}
                <strong>{applyModalOpp.source}</strong>. InterviewIQ never submits applications automatically without your authorization.
              </p>
            </div>

            <div className="p-3.5 bg-[#F4F7F1] rounded-xl border border-gray-200/60 text-xs text-[#344E41] space-y-1">
              <span className="font-bold block">Application URL:</span>
              <p className="font-mono text-[11px] text-[#6B756D] break-all">{applyModalOpp.applicationUrl}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setApplyModalOpp(null)}
                className="flex-1 py-3 rounded-full border border-gray-200 text-xs font-bold text-[#6B756D] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmApply(applyModalOpp)}
                className="flex-1 py-3 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white text-xs font-bold shadow-sm inline-flex items-center justify-center gap-1.5"
              >
                Proceed & Record as Applied
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Candidate Preferences Drawer / Modal */}
      {showPrefModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-gray-100 shadow-2xl relative">
            <button
              onClick={() => setShowPrefModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#1F2A22]">Target Job Preferences</h3>
              <p className="text-xs text-[#6B756D]">
                These preferences help rank opportunities and calibrate mock interview scenarios.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#344E41]">Preferred Role Title</label>
                <input
                  type="text"
                  value={preferences?.preferredRole || ''}
                  onChange={(e) =>
                    setPreferences((prev) => (prev ? { ...prev, preferredRole: e.target.value } : null))
                  }
                  className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  placeholder="e.g. Full Stack Engineer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#344E41]">Location / Geographic Region</label>
                <input
                  type="text"
                  value={preferences?.preferredLocation || ''}
                  onChange={(e) =>
                    setPreferences((prev) => (prev ? { ...prev, preferredLocation: e.target.value } : null))
                  }
                  className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  placeholder="e.g. Remote / North America / Europe"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#344E41]">Employment Type</label>
                  <select
                    value={preferences?.employmentType || 'Any'}
                    onChange={(e: any) =>
                      setPreferences((prev) => (prev ? { ...prev, employmentType: e.target.value } : null))
                    }
                    className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="Any">Any</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#344E41]">Workplace Model</label>
                  <select
                    value={preferences?.remotePreference || 'Any'}
                    onChange={(e: any) =>
                      setPreferences((prev) => (prev ? { ...prev, remotePreference: e.target.value } : null))
                    }
                    className="w-full p-2.5 bg-[#F4F7F1] border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="Any">Any</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowPrefModal(false)}
                className="flex-1 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-[#6B756D]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (preferences) {
                    await api.updatePreferences(preferences);
                  }
                  setShowPrefModal(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white text-xs font-bold shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
