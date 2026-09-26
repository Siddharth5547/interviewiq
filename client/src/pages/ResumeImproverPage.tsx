import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Resume, JobDescription, ResumeImprovementResult } from '../types/index.js';
import {
  Wand2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  RefreshCw,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResumeImproverPageProps {
  onNavigate: (tab: string) => void;
}

export const ResumeImproverPage: React.FC<ResumeImproverPageProps> = ({ onNavigate }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [improvement, setImprovement] = useState<ResumeImprovementResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resResume, resJob] = await Promise.allSettled([
        api.getLatestResume(),
        api.getLatestJob(),
      ]);

      let loadedResume: Resume | null = null;
      let loadedJob: JobDescription | null = null;

      if (resResume.status === 'fulfilled' && resResume.value.data.resume) {
        loadedResume = resResume.value.data.resume;
        setResume(loadedResume);
      }
      if (resJob.status === 'fulfilled' && resJob.value.data.job) {
        loadedJob = resJob.value.data.job;
        setJob(loadedJob);
      }

      if (loadedResume && loadedJob) {
        await generateEnhancements(loadedResume, loadedJob);
      }
    } catch (err) {
      console.warn('Load improver data notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateEnhancements = async (r: Resume, j: JobDescription) => {
    setGenerating(true);
    setError('');
    try {
      const resumeId = r._id || r.id || '';
      const jobId = j._id || j.id || '';
      const res = await api.generateImprovements(resumeId, jobId);
      if (res.data.success) {
        setImprovement(res.data.result);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate grounded improvements.');
    } finally {
      setGenerating(false);
    }
  };

  const handleApplyToResume = async () => {
    if (!resume || !improvement) return;
    setApplying(true);
    try {
      const resumeId = resume._id || resume.id || '';
      await api.applyEnhancedResume(resumeId, improvement.enhancedResumeData);
      setApplied(true);
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      setError('Failed to apply enhancements to resume.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
        <p className="text-sm text-[#6B756D]">Synthesizing grounded XYZ formula improvements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider mb-2">
            <Wand2 className="w-3.5 h-3.5 text-[#6B8E5A]" /> Zero-Fabrication Phrasing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] font-display">
            Resume Improvement & ATS Delta
          </h1>
          <p className="text-base text-[#6B756D] mt-2 max-w-xl leading-relaxed">
            Strictly grounded in your actual experience using Google's STAR/XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].
          </p>
        </div>

        <button
          onClick={() => resume && job && generateEnhancements(resume, job)}
          disabled={generating}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-white border border-[rgba(52,78,65,0.15)] text-xs font-bold text-[#344E41] hover:bg-[#E5EEDC] transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
          Regenerate Enhancements
        </button>
      </div>

      {/* Zero Fabrication Integrity Box */}
      <div className="p-6 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#E5EEDC] text-[#344E41] flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-6 h-6 text-[#6B8E5A]" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-bold text-sm text-[#1F2A22] block font-display">
            Zero-Fabrication Integrity Commitment
          </span>
          <p className="text-[#6B756D] leading-relaxed">
            We never invent unverified experience, projects, or credentials. Phrasing is strengthened using active
            verbs and structured impact measurements derived strictly from your submitted work history.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-status-danger flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Large ATS Before vs After Score Delta Card */}
      {improvement?.comparison && (
        <div className="bg-[#344E41] text-white rounded-3xl shadow-premium p-8 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8FAF78] font-bold block mb-1">
                Estimated ATS Score Projection
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display">Score Delta Breakdown</h3>
              <p className="text-xs sm:text-sm text-[#D4E2C5] mt-1 max-w-lg leading-relaxed">
                {improvement.comparison.explanation}
              </p>
            </div>

            {/* Score pill comparison */}
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/15">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase text-gray-300 block font-semibold">Before</span>
                <span className="text-2xl font-bold text-gray-200">{improvement.comparison.beforeScore}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-[#8FAF78]" />
              <div className="text-center px-2">
                <span className="text-[10px] uppercase text-[#8FAF78] block font-bold">Projected</span>
                <span className="text-3xl font-extrabold text-white">
                  {improvement.comparison.afterScore}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#6B8E5A] text-white text-xs font-bold">
                +{improvement.comparison.delta} pts
              </span>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {improvement.comparison.changes.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-200">{item.category}</span>
                  <span className="text-xs font-extrabold text-[#8FAF78]">{item.points}</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-tight">{item.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bullet-by-Bullet Grounded Improvements */}
      {improvement && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-[#1F2A22] font-display">
              Enhanced STAR / XYZ Formula Bullets ({improvement.bulletImprovements.length})
            </h3>
            {applied ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A7C59] bg-[#E5EEDC] px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> Applied to Active Resume
              </span>
            ) : (
              <button
                onClick={handleApplyToResume}
                disabled={applying}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#344E41] text-white text-xs font-bold hover:bg-[#4B6B5B] transition-all shadow-sm"
              >
                {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileCheck className="w-3.5 h-3.5" />}
                Apply Improvements to Resume
              </button>
            )}
          </div>

          <div className="space-y-6">
            {improvement.bulletImprovements.map((bullet, idx) => (
              <div key={idx} className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#344E41] uppercase tracking-wider">
                    Bullet Point #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#6B8E5A] bg-[#E5EEDC] px-3 py-1 rounded-full">
                    Action Verb: {bullet.actionVerbUsed}
                  </span>
                </div>

                {/* Original vs Improved */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F4F7F1]">
                    <span className="text-[10px] font-bold text-[#6B756D] uppercase block mb-1.5">
                      Original Draft
                    </span>
                    <p className="text-xs text-[#6B756D] line-through leading-relaxed">{bullet.original}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#E5EEDC]/60 border border-[rgba(52,78,65,0.1)]">
                    <span className="text-[10px] font-bold text-[#344E41] uppercase block mb-1.5">
                      Improved (STAR / XYZ Formula)
                    </span>
                    <p className="text-xs font-bold text-[#1F2A22] leading-relaxed">{bullet.improved}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6B756D] pt-3 border-t border-gray-100">
                  <p>
                    <strong>Why it's stronger:</strong> {bullet.explanation}
                  </p>
                  <span className="text-[#4A7C59] font-semibold">✓ {bullet.groundedVerification}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
