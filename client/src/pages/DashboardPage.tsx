import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { DashboardData, ApplicationAnalytics } from '../types/index.js';
import { CircularScore } from '../components/CircularScore.js';
import {
  FileText,
  Target,
  Mic,
  Dumbbell,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Building2,
  Calendar,
  Sparkles,
  Loader2,
  History,
  Wand2,
  Briefcase,
  Search,
  ExternalLink,
  Plus,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [appAnalytics, setAppAnalytics] = useState<ApplicationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, appRes] = await Promise.allSettled([
          api.getDashboardData(),
          api.getApplicationAnalytics(),
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value.data.success) {
          setData(dashRes.value.data.data);
        }
        if (appRes.status === 'fulfilled' && appRes.value.data.success) {
          setAppAnalytics(appRes.value.data.analytics);
        }
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const candidateFirstName = user?.fullName?.split(' ')[0] || 'Candidate';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
        <p className="text-sm text-[#6B756D]">Loading your spacious career dashboard...</p>
      </div>
    );
  }

  const hasResume = data?.resume?.exists;
  const targetJob = data?.targetJob;
  const ats = data?.ats;
  const interviewStats = data?.interview;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Large Welcome Header */}
      <div className="p-8 sm:p-12 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Personalized Overview</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] font-display">
              Good morning, {candidateFirstName}
            </h1>
            <p className="text-base sm:text-lg text-[#6B756D] max-w-xl">
              {hasResume && targetJob
                ? `Your active resume is calibrated against ${targetJob.title} at ${targetJob.company}.`
                : hasResume
                ? 'Your resume is analyzed and ready for ATS matching and AI interviews.'
                : 'Welcome to your career command center. Upload your resume to start preparing.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={() => onNavigate('interview')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#344E41] text-white font-bold text-sm hover:bg-[#4B6B5B] transition-all shadow-premium"
            >
              Start AI Interview <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate(hasResume ? 'opportunities' : 'resume')}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#E5EEDC] text-[#344E41] font-semibold text-sm hover:bg-[#D4E2C5] transition-colors"
            >
              {hasResume ? 'Discover Jobs' : 'Upload Resume'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Onboarding Banner if no resume yet */}
      {!hasResume && (
        <div className="p-8 bg-[#E5EEDC]/60 rounded-3xl border border-[#6B8E5A]/25 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#344E41] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-[#D4E2C5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2A22]">Your career workspace is ready</h3>
              <p className="text-xs text-[#6B756D]">
                Your career workspace is ready. Upload your resume to start building your profile.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('resume')}
              className="px-6 py-2.5 rounded-full bg-[#344E41] text-white text-xs font-bold hover:bg-[#4B6B5B] transition-colors shadow-sm"
            >
              Upload Resume
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-[#344E41] text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              Explore Opportunities
            </button>
          </div>
        </div>
      )}


      {/* 3. Large Split Overview: Resume/ATS (Left) vs Interview Performance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Resume & ATS Alignment */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] p-8 shadow-soft flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-[#6B8E5A]" />
                <h3 className="font-bold text-base text-[#1F2A22] font-display">Resume & Job Alignment</h3>
              </div>
              <span className="text-xs font-semibold text-[#6B756D]">
                {ats ? 'Calibrated' : 'Pending Job Target'}
              </span>
            </div>

            {ats ? (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center mt-6">
                <div className="sm:col-span-5 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100 pb-6 sm:pb-0">
                  <CircularScore
                    score={ats.score}
                    size={150}
                    strokeWidth={11}
                    label={ats.label}
                    sublabel="Score Approximation"
                  />
                </div>

                <div className="sm:col-span-7 space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#6B8E5A] uppercase tracking-wider">Target Role</span>
                    <h4 className="text-lg font-bold text-[#1F2A22]">{targetJob?.title || 'Target Position'}</h4>
                    <p className="text-xs text-[#6B756D]">{targetJob?.company || 'Target Organization'}</p>
                  </div>

                  <div className="pt-2 text-xs space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#6B756D]">Extracted Skills:</span>
                      <span className="text-[#1F2A22] font-bold">{data?.resume.skillsCount} detected</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-[#6B756D]">Matched Keywords:</span>
                      <span className="text-[#4A7C59] font-bold">{ats.matchingKeywordsCount} matched</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-[#6B756D]">Missing Keywords:</span>
                      <span className="text-[#C64545] font-bold">{ats.missingKeywordsCount} missing</span>
                    </div>
                  </div>

                  {targetJob?.missingSkills && targetJob.missingSkills.length > 0 && (
                    <div className="p-3 bg-[#E5EEDC]/60 rounded-xl border border-[rgba(52,78,65,0.08)] text-[11px] text-[#344E41]">
                      Missing keywords: <strong>{targetJob.missingSkills.join(', ')}</strong>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <FileText className="w-10 h-10 text-[#6B8E5A] mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-[#1F2A22]">
                  {hasResume ? 'No Job Description Calibrated Yet' : 'No Resume Uploaded'}
                </h4>
                <p className="text-xs text-[#6B756D] max-w-sm mx-auto">
                  {hasResume
                    ? 'Paste a target job description to compute your estimated ATS keyword compatibility score.'
                    : 'Upload a resume to unlock keyword matching and ATS optimization.'}
                </p>
                <button
                  onClick={() => onNavigate(hasResume ? 'ats' : 'resume')}
                  className="px-5 py-2 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold hover:bg-[#D4E2C5] transition-colors"
                >
                  {hasResume ? 'Add Target Job Description' : 'Upload Resume'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <button
              onClick={() => onNavigate('ats')}
              className="flex-1 py-3 px-4 rounded-full bg-[#F4F7F1] hover:bg-[#E5EEDC] text-[#344E41] text-xs font-bold text-center transition-colors"
            >
              View Full ATS Diagnostic →
            </button>
            <button
              onClick={() => onNavigate('improve')}
              className="flex-1 py-3 px-4 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white text-xs font-bold text-center transition-colors shadow-sm"
            >
              Improve Resume (XYZ Formula)
            </button>
          </div>
        </div>

        {/* Right: Interview Performance */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] p-8 shadow-soft flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Mic className="w-5 h-5 text-[#6B8E5A]" />
                <h3 className="font-bold text-base text-[#1F2A22] font-display">Interview Performance</h3>
              </div>
              <span className="text-xs font-bold text-[#6B8E5A] bg-[#E5EEDC] px-2.5 py-1 rounded-full">
                {interviewStats?.totalCompleted || 0} Completed
              </span>
            </div>

            {interviewStats && interviewStats.totalCompleted > 0 ? (
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.06)]">
                    <span className="text-xs text-[#6B756D] font-medium block mb-1">Average Score</span>
                    <span className="text-3xl font-extrabold text-[#1F2A22] font-display">
                      {interviewStats.averageScore}%
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E5EEDC] border border-[rgba(52,78,65,0.08)]">
                    <span className="text-xs text-[#344E41] font-medium block mb-1">Latest Mock</span>
                    <span className="text-3xl font-extrabold text-[#344E41] font-display">
                      {interviewStats.latestScore}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {interviewStats.strongestTopic && (
                    <div className="p-3.5 rounded-xl bg-white border border-[rgba(52,78,65,0.09)] space-y-1">
                      <span className="font-bold text-[#4A7C59] block">Strongest Competency:</span>
                      <p className="text-[#1F2A22]">{interviewStats.strongestTopic}</p>
                    </div>
                  )}

                  {interviewStats.weakestTopic && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-1">
                      <span className="font-bold text-[#C88A36] block">Remediation Focus:</span>
                      <p className="text-[#1F2A22]">{interviewStats.weakestTopic}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <Mic className="w-10 h-10 text-[#6B8E5A] mx-auto opacity-60" />
                <h4 className="text-sm font-bold text-[#1F2A22]">Your First Interview is Waiting</h4>
                <p className="text-xs text-[#6B756D] max-w-xs mx-auto">
                  Your first interview is waiting. Start a personalized interview based on your resume.
                </p>
                <button
                  onClick={() => onNavigate('interview')}
                  className="px-5 py-2 rounded-full bg-[#6B8E5A] text-white text-xs font-bold hover:bg-[#587649] transition-colors"
                >
                  Start Interview
                </button>
              </div>
            )}

          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => onNavigate('interview')}
              className="flex-1 py-3 px-4 rounded-full bg-[#6B8E5A] hover:bg-[#587649] text-white text-xs font-bold text-center transition-colors shadow-sm"
            >
              Launch Live Mock
            </button>
            <button
              onClick={() => onNavigate('practice')}
              className="flex-1 py-3 px-4 rounded-full bg-[#F4F7F1] hover:bg-[#E5EEDC] text-[#344E41] text-xs font-bold text-center transition-colors"
            >
              Drill Weak Topics
            </button>
          </div>
        </div>
      </div>

      {/* 4. Real Application Funnel & Tracker Overview */}
      <div className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-[#6B8E5A]" />
            <div>
              <h3 className="font-bold text-base text-[#1F2A22] font-display">Your Job Search & Application Funnel</h3>
              <p className="text-xs text-[#6B756D]">
                Tracked applications, conversion stages, and upcoming interview dates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('opportunities')}
              className="px-4 py-2 rounded-full bg-[#F4F7F1] hover:bg-[#E5EEDC] text-[#344E41] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#6B8E5A]" /> Discover Roles
            </button>
            <button
              onClick={() => onNavigate('applications')}
              className="px-4 py-2 rounded-full bg-[#344E41] hover:bg-[#4B6B5B] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              Open Pipeline Tracker →
            </button>
          </div>
        </div>

        {appAnalytics && appAnalytics.totalApplications > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#F4F7F1]">
              <span className="text-[11px] font-semibold text-[#6B756D] block">Saved Roles</span>
              <span className="text-2xl font-extrabold text-[#1F2A22] font-display">
                {appAnalytics.funnel.saved}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#E5EEDC]">
              <span className="text-[11px] font-semibold text-[#344E41] block">Submitted</span>
              <span className="text-2xl font-extrabold text-[#344E41] font-display">
                {appAnalytics.funnel.applied}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50">
              <span className="text-[11px] font-semibold text-purple-700 block">Assessment</span>
              <span className="text-2xl font-extrabold text-purple-900 font-display">
                {appAnalytics.funnel.assessment}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50">
              <span className="text-[11px] font-semibold text-blue-700 block">Interview Round</span>
              <span className="text-2xl font-extrabold text-blue-900 font-display">
                {appAnalytics.funnel.interview}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50">
              <span className="text-[11px] font-semibold text-emerald-700 block">Offers</span>
              <span className="text-2xl font-extrabold text-emerald-900 font-display">
                {appAnalytics.funnel.offer}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-[#6B756D] space-y-2">
            <p>You haven't tracked any applications yet.</p>
            <p className="max-w-md mx-auto">
              Find positions on the <strong>Opportunities</strong> page or track an external job to automatically populate this conversion funnel.
            </p>
          </div>
        )}
      </div>

      {/* 5. Progress History (Only if genuine mock interviews exist) */}
      {data?.progressTrend && data.progressTrend.length > 0 && (
        <div className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <TrendingUp className="w-5 h-5 text-[#6B8E5A]" />
            <h3 className="font-bold text-base text-[#1F2A22] font-display">Performance History Trajectory</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[#6B756D]">
                  <th className="py-3 px-4 font-bold">Session Type</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Overall Score</th>
                  <th className="py-3 px-4 font-bold">Technical Depth</th>
                  <th className="py-3 px-4 font-bold">Communication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.progressTrend.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F4F7F1]/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#1F2A22]">{row.session}</td>
                    <td className="py-3.5 px-4 text-[#6B756D]">{row.date}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#344E41]">{row.score}%</td>
                    <td className="py-3.5 px-4 text-[#4A7C59] font-bold">{row.technical}%</td>
                    <td className="py-3.5 px-4 text-[#5B7C99] font-bold">{row.communication}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
