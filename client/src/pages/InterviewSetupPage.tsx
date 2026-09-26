import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Resume, JobDescription, Interview } from '../types/index.js';
import {
  Mic,
  MessageSquare,
  Clock,
  Gauge,
  ArrowRight,
  Sparkles,
  Loader2,
  FileText,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface InterviewSetupPageProps {
  onStart: (interview: Interview) => void;
  onNavigate: (tab: string) => void;
  roleContext?: { role: string; company: string; jd: string } | null;
}

export const InterviewSetupPage: React.FC<InterviewSetupPageProps> = ({
  onStart,
  onNavigate,
  roleContext,
}) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState(20);
  const [mode, setMode] = useState<'Text' | 'Voice'>('Text');
  const [personalityMode, setPersonalityMode] = useState<
    'Professional' | 'Friendly' | 'Technical' | 'Strict' | 'HR'
  >('Professional');
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    try {
      setLoading(true);
      const [resResume, resJob] = await Promise.allSettled([
        api.getLatestResume(),
        api.getLatestJob(),
      ]);

      if (resResume.status === 'fulfilled' && resResume.value.data.resume) {
        setResume(resResume.value.data.resume);
      }
      if (resJob.status === 'fulfilled' && resJob.value.data.job) {
        setJob(resJob.value.data.job);
      }
    } catch (err) {
      console.warn('Prerequisite load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    if (!resume) {
      setError('Please upload or load a resume first so the interviewer can ask relevant questions.');
      return;
    }

    setStarting(true);
    setError('');
    try {
      const resumeId = resume._id || resume.id || '';
      let jobId = job ? job._id || job.id || undefined : undefined;

      // If user came from an Opportunity / Application roleContext, create a linked job first
      if (roleContext && roleContext.jd) {
        try {
          const jRes = await api.createJob({
            title: roleContext.role,
            company: roleContext.company,
            rawText: roleContext.jd,
          });
          if (jRes.data.success && jRes.data.job) {
            jobId = jRes.data.job._id || jRes.data.job.id;
          }
        } catch {
          // fallback to existing jobId
        }
      }

      const res = await api.startInterview({
        resumeId,
        jobDescriptionId: jobId,
        type: interviewType,
        difficulty,
        durationMinutes: duration,
        mode,
        personalityMode,
      });

      if (res.data.success) {
        onStart(res.data.interview);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start interview session.');
    } finally {
      setStarting(false);
    }
  };

  const interviewTypes = [
    {
      id: 'Technical Interview',
      title: 'Technical Systems Interview',
      desc: 'Language mechanics, APIs, databases, query performance, and distributed systems.',
    },
    {
      id: 'Project Interview',
      title: 'Project Architecture Deep Dive',
      desc: 'Targeted probe of your portfolio projects: architecture choices, debugging challenges, and scaling.',
    },
    {
      id: 'HR Interview',
      title: 'Behavioral & Leadership',
      desc: 'STAR-based questions on cross-functional communication, conflict resolution, and ownership.',
    },
    {
      id: 'DSA Drill',
      title: 'Data Structures & Algorithms',
      desc: 'Algorithm design, time/space complexity analysis, edge cases, and optimization patterns.',
    },
    {
      id: 'System Design',
      title: 'System Design & Scalability',
      desc: 'High-level architecture, load balancing, caching, data modeling, and trade-offs.',
    },
    {
      id: 'Full Placement Interview',
      title: 'Full Placement Simulation',
      desc: 'Rigorous end-to-end evaluation challenging all claims on your resume.',
    },
    {
      id: 'Mixed Interview',
      title: 'Mixed Technical & Culture',
      desc: 'Balanced engineering round simulating a full placement first-round loop.',
    },
  ];

  const personalityModes: Array<{
    id: 'Professional' | 'Friendly' | 'Technical' | 'Strict' | 'HR';
    title: string;
    desc: string;
  }> = [
    {
      id: 'Professional',
      title: 'Professional',
      desc: 'Balanced, structured, corporate pacing and objective inquiry.',
    },
    {
      id: 'Friendly',
      title: 'Friendly',
      desc: 'Warm, encouraging, conversational with helpful transition cues.',
    },
    {
      id: 'Technical',
      title: 'Technical',
      desc: 'Exacting, deep-dive architecture questions, probing edge-cases.',
    },
    {
      id: 'Strict',
      title: 'Strict',
      desc: 'Rigorous, actively challenges hand-wavy claims and vague metrics.',
    },
    {
      id: 'HR',
      title: 'People & Culture',
      desc: 'Focuses on team alignment, behavioral dynamics, and growth mindset.',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6B8E5A] animate-spin" />
        <p className="text-sm text-[#6B756D]">Calibrating personalized interview room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" /> Realistic AI Mock
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] font-display">
          Configure Your AI Interview
        </h1>
        <p className="text-base text-[#6B756D] mt-2 max-w-xl leading-relaxed">
          Questions are dynamically generated based on your verified resume and target role.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-status-danger flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Context Verification Card */}
      <div className="p-6 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-[#F4F7F1] rounded-2xl">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#6B8E5A]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6B756D] block">Resume Context</span>
              <p className="text-xs font-bold text-[#1F2A22] truncate max-w-[180px]">
                {resume?.filename || 'No Resume Loaded'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('resume')}
            className="text-xs font-bold text-[#6B8E5A] hover:underline"
          >
            Review
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#F4F7F1] rounded-2xl">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-[#344E41]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6B756D] block">Target Role</span>
              <p className="text-xs font-bold text-[#1F2A22] truncate max-w-[180px]">
                {job?.title || 'Full Stack Software Engineer'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('ats')}
            className="text-xs font-bold text-[#6B8E5A] hover:underline"
          >
            Change
          </button>
        </div>
      </div>

      {/* 1. Interview Type */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2A22] font-display">1. Select Interview Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {interviewTypes.map((type) => {
            const isSelected = interviewType === type.id;
            return (
              <div
                key={type.id}
                onClick={() => setInterviewType(type.id)}
                className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#6B8E5A] bg-[#E5EEDC]/60 ring-2 ring-[#6B8E5A]/40'
                    : 'border-[rgba(52,78,65,0.1)] hover:border-[#6B8E5A]/30 bg-white'
                }`}
              >
                <h4 className="text-sm font-bold text-[#1F2A22] mb-1">{type.title}</h4>
                <p className="text-xs text-[#6B756D] leading-relaxed">{type.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Target Difficulty & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-[#6B8E5A]" />
            <h3 className="text-sm font-bold text-[#1F2A22]">2. Target Difficulty</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficulty(diff)}
                className={`py-2.5 px-3 rounded-full text-xs font-bold border transition-all ${
                  difficulty === diff
                    ? 'bg-[#344E41] text-white border-[#344E41] shadow-sm'
                    : 'border-[rgba(52,78,65,0.12)] text-[#1F2A22] hover:bg-[#F4F7F1]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#6B8E5A]" />
            <h3 className="text-sm font-bold text-[#1F2A22]">3. Duration</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 30].map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setDuration(dur)}
                className={`py-2.5 px-3 rounded-full text-xs font-bold border transition-all ${
                  duration === dur
                    ? 'bg-[#344E41] text-white border-[#344E41] shadow-sm'
                    : 'border-[rgba(52,78,65,0.12)] text-[#1F2A22] hover:bg-[#F4F7F1]'
                }`}
              >
                {dur} min
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Interaction Mode */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2A22] font-display">4. Interaction Mode</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setMode('Text')}
            className={`p-6 rounded-3xl border cursor-pointer flex items-center gap-4 transition-all ${
              mode === 'Text'
                ? 'border-[#6B8E5A] bg-[#E5EEDC]/60 ring-2 ring-[#6B8E5A]/40'
                : 'border-[rgba(52,78,65,0.1)] hover:border-[#6B8E5A]/30 bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F4F7F1] flex items-center justify-center text-[#344E41]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1F2A22]">Text Input Mode</h4>
              <p className="text-xs text-[#6B756D]">Type your answers with comfortable formatting.</p>
            </div>
          </div>

          <div
            onClick={() => setMode('Voice')}
            className={`p-6 rounded-3xl border cursor-pointer flex items-center gap-4 transition-all ${
              mode === 'Voice'
                ? 'border-[#6B8E5A] bg-[#E5EEDC]/60 ring-2 ring-[#6B8E5A]/40'
                : 'border-[rgba(52,78,65,0.1)] hover:border-[#6B8E5A]/30 bg-white'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEDC] flex items-center justify-center text-[#6B8E5A]">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1F2A22]">Voice Mode (STT & TTS)</h4>
              <p className="text-xs text-[#6B756D]">Speak aloud; questions are synthesized via speech.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Interviewer Personality Mode */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1F2A22] font-display">
            5. Interviewer Tone & Personality
          </h3>
          <span className="text-xs text-[#6B756D]">Shapes conversational style & follow-up rigor</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {personalityModes.map((pm) => {
            const isSelected = personalityMode === pm.id;
            return (
              <div
                key={pm.id}
                onClick={() => setPersonalityMode(pm.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#6B8E5A] bg-[#E5EEDC]/70 ring-2 ring-[#6B8E5A]/30'
                    : 'border-[rgba(52,78,65,0.1)] hover:border-[#6B8E5A]/30 bg-white'
                }`}
              >
                <h4 className="text-xs font-bold text-[#1F2A22] mb-1">{pm.title}</h4>
                <p className="text-[11px] text-[#6B756D] leading-snug">{pm.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        onClick={handleLaunch}
        disabled={starting}
        className="w-full py-4 px-8 rounded-full bg-[#344E41] text-white font-extrabold text-sm hover:bg-[#4B6B5B] transition-all flex items-center justify-center gap-2 shadow-premium disabled:opacity-70 hover:scale-[1.01]"
      >
        {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5 text-[#8FAF78]" />}
        Enter Immersive AI Interview Room
      </button>
    </div>
  );
};
