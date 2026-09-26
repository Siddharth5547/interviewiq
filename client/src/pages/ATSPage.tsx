import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { ATSAnalysis, Resume, JobDescription } from '../types/index.js';
import {
  Target,
  FileText,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Sparkles,
  ShieldAlert,
  Wand2,
} from 'lucide-react';

interface ATSPageProps {
  onNavigate: (tab: string) => void;
}

export const ATSPage: React.FC<ATSPageProps> = ({ onNavigate }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [jdInput, setJdInput] = useState('');
  const [companyInput, setCompanyInput] = useState('Stripe & Co. Labs');
  const [titleInput, setTitleInput] = useState('Full Stack Software Engineer');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [resResume, resJob, resATS] = await Promise.allSettled([
        api.getLatestResume(),
        api.getLatestJob(),
        api.getLatestATS(),
      ]);

      if (resResume.status === 'fulfilled' && resResume.value.data.resume) {
        setResume(resResume.value.data.resume);
      }
      if (resJob.status === 'fulfilled' && resJob.value.data.job) {
        setJob(resJob.value.data.job);
        setTitleInput(resJob.value.data.job.title);
        setCompanyInput(resJob.value.data.job.company);
        setJdInput(resJob.value.data.job.rawText);
      }
      if (resATS.status === 'fulfilled' && resATS.value.data.analysis) {
        setAnalysis(resATS.value.data.analysis);
      }
    } catch (err) {
      console.warn('Initial ATS load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!resume) {
      setError('Please upload or load a resume first.');
      return;
    }
    if (!jdInput.trim()) {
      setError('Please paste the target job description text.');
      return;
    }

    setAnalyzing(true);
    setError('');
    try {
      const jobRes = await api.createJob({
        rawText: jdInput,
        title: titleInput,
        company: companyInput,
      });
      const savedJob = jobRes.data.job;
      setJob(savedJob);

      const resumeId = resume._id || resume.id || '';
      const jobId = savedJob._id || savedJob.id || '';
      const atsRes = await api.analyzeATS(resumeId, jobId);
      if (atsRes.data.success) {
        setAnalysis(atsRes.data.analysis);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to compute ATS compatibility.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUseDemoJD = async () => {
    setLoading(true);
    try {
      const res = await api.loadDemoJob();
      if (res.data.success) {
        setJob(res.data.job);
        setTitleInput(res.data.job.title);
        setCompanyInput(res.data.job.company);
        setJdInput(res.data.job.rawText);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
        <p className="text-sm text-[#6B756D]">Calibrating ATS compatibility engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider mb-3">
          <Target className="w-3.5 h-3.5 text-[#6B8E5A]" /> 9-Point Compatibility Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] font-display">
          Estimated ATS Compatibility
        </h1>
        <p className="text-base text-[#6B756D] mt-2 max-w-2xl leading-relaxed">
          Compare your verified resume against real job descriptions to identify exact keyword alignment,
          structural gaps, and formatting health.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-status-danger flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Target Job Input Section (Spacious Open Card) */}
      <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-[#6B8E5A]" />
            <h3 className="text-base font-bold text-[#1F2A22]">Target Job Description Input</h3>
          </div>
          <button
            type="button"
            onClick={handleUseDemoJD}
            className="text-xs font-bold text-[#6B8E5A] hover:underline"
          >
            Paste Sample Full-Stack Job
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2A22] mb-1.5">Target Job Title</label>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full text-sm p-3 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] bg-[#F4F7F1]/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1F2A22] mb-1.5">Company Name</label>
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="e.g. Stripe, OpenAI, Apple"
              className="w-full text-sm p-3 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] bg-[#F4F7F1]/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1F2A22] mb-1.5">
            Job Description Requirements & Responsibilities
          </label>
          <textarea
            rows={5}
            value={jdInput}
            onChange={(e) => setJdInput(e.target.value)}
            placeholder="Paste the full job posting requirements and expectations here..."
            className="w-full text-xs p-4 rounded-2xl border border-[rgba(52,78,65,0.15)] outline-none focus:ring-2 focus:ring-[#6B8E5A] leading-relaxed font-mono bg-[#F4F7F1]/30"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing || !jdInput.trim()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#344E41] text-white text-xs font-bold hover:bg-[#4B6B5B] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            Compute Estimated ATS Compatibility Score
          </button>
        </div>
      </div>

      {/* Large ATS Score Visualization */}
      {analysis && (
        <div className="space-y-10">
          <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Massive 84 ATS Score Callout */}
              <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8">
                <span className="text-7xl sm:text-8xl font-black text-[#344E41] font-display leading-none">
                  {analysis.overallScore}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#6B8E5A] block mt-2">
                  ATS Score
                </span>
                <p className="text-xs text-[#6B756D] mt-1">Estimated Compatibility</p>
              </div>

              {/* Summary & Disclaimer */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#1F2A22] font-display">Target Compatibility Overview</h3>
                  <button
                    onClick={() => onNavigate('improve')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-bold hover:bg-[#587649] transition-colors shadow-sm self-start sm:self-auto"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    Improve Resume for this Role →
                  </button>
                </div>

                <div className="p-4 bg-[#E5EEDC]/80 rounded-2xl border border-[rgba(52,78,65,0.08)] text-xs text-[#344E41] flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Standard Disclaimer:</strong> {analysis.disclaimer}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                  <div className="p-3 bg-[#F4F7F1] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-[#6B756D] block">Matched Terms</span>
                    <span className="text-lg font-black text-[#4A7C59]">{analysis.matchingKeywords.length}</span>
                  </div>
                  <div className="p-3 bg-[#F4F7F1] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-[#6B756D] block">Missing Terms</span>
                    <span className="text-lg font-black text-[#C64545]">{analysis.missingKeywords.length}</span>
                  </div>
                  <div className="p-3 bg-[#F4F7F1] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-[#6B756D] block">Partial Matches</span>
                    <span className="text-lg font-black text-[#C88A36]">{analysis.partiallyMatchedSkills.length}</span>
                  </div>
                  <div className="p-3 bg-[#F4F7F1] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-[#6B756D] block">Missing Sections</span>
                    <span className="text-lg font-black text-[#1F2A22]">{analysis.missingSections.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 9-Point Category Score Progress Bars */}
          <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft p-8 space-y-6">
            <h3 className="text-lg font-bold text-[#1F2A22] font-display">9-Point Category Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysis.categoryScores.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F4F7F1] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1F2A22]">{cat.name}</span>
                    <span className="font-black text-[#6B8E5A]">
                      {cat.score} / {cat.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-[#E5EEDC] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#6B8E5A] h-full rounded-full transition-all duration-700"
                      style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B756D] leading-tight">{cat.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Matched vs Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft p-8 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#4A7C59]" />
                <h4 className="font-bold text-sm text-[#1F2A22]">Matching Competencies & Keywords</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.matchingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-semibold"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft p-8 space-y-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-[#C64545]" />
                <h4 className="font-bold text-sm text-[#1F2A22]">Missing Target Keywords</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.length > 0 ? (
                  analysis.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-red-50 text-[#C64545] text-xs font-semibold border border-red-200"
                    >
                      ✕ {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#6B756D]">All required job keywords are present in your resume.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
