import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Code2,
  Briefcase,
  Users,
  Target,
  FileCheck,
} from 'lucide-react';
import { ProductDemoPlayer } from '../components/ProductDemoPlayer.js';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const twelveSteps = [
    { step: '01', title: 'Create Your Account', desc: 'Secure credential or session onboarding with isolated data privacy.' },
    { step: '02', title: 'Upload Your Resume', desc: 'Validated parser extracts verified skills, projects, and education from PDF, DOCX, or TXT.' },
    { step: '03', title: 'Build Candidate Profile', desc: 'Transforms parsed resume into structured technical and domain competencies.' },
    { step: '04', title: 'Add Target Job Description', desc: 'Paste employer requirements or select target positions to calibrate scoring.' },
    { step: '05', title: 'Review ATS Score & Gaps', desc: 'Estimated 0-100 compatibility estimate with matched and missing keyword analysis.' },
    { step: '06', title: 'Improve Your Resume', desc: 'Google STAR/XYZ bullet enhancements without fabricating unearned credentials.' },
    { step: '07', title: 'Discover Jobs & Internships', desc: 'Browse curated live opportunities with genuine resume match percentages.' },
    { step: '08', title: 'Apply Through Official Sources', desc: 'Direct redirects to official company job pages without fake auto-submission claims.' },
    { step: '09', title: 'Track Your Application', desc: '8-stage recruitment tracker to monitor status from Saved to Interview and Offer.' },
    { step: '10', title: 'Start Personalized AI Interview', desc: '7 tracks and 5 personality modes testing what you actually built.' },
    { step: '11', title: 'Review Interview Report', desc: 'Per-question scoring, model answer comparisons, and respectful reality check.' },
    { step: '12', title: 'Practice Your Weak Areas', desc: 'Targeted drill sessions addressing specific concepts flagged during your interview.' },
  ];

  const targetAudiences = [
    {
      icon: GraduationCap,
      title: 'College Students & New Grads',
      desc: 'Land your first tech internship or full-time software engineering role with verified project explanations and ATS optimization.',
    },
    {
      icon: Code2,
      title: 'Software Developers & Engineers',
      desc: 'Sharpen system design, backend architectures, concurrency tradeoffs, and live technical communication.',
    },
    {
      icon: Briefcase,
      title: 'Job Seekers in Career Transition',
      desc: 'Align existing technical competencies against new role requirements and highlight transferable engineering strengths.',
    },
    {
      icon: Target,
      title: 'Placement Drive Candidates',
      desc: 'Prepare for rigorous campus recruitment drives, technical screenings, and HR culture-fit rounds with real-time feedback.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F1] text-[#1F2A22] selection:bg-[#D4E2C5]">
      {/* 1. WHAT IS INTERVIEWIQ? (Hero & Story) */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" />
          What is InterviewIQ?
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1F2A22] leading-[1.1] font-display">
          An AI career-prep platform <br />
          <span className="text-[#6B8E5A]">grounded in reality.</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#6B756D] leading-relaxed max-w-3xl mx-auto">
          InterviewIQ is an AI-powered career-prep platform that helps students and job seekers understand their resume, check ATS compatibility, discover relevant opportunities, improve applications, practice interviews, and track progress.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B756D]">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#6B8E5A]" /> Zero Data Fabrication
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <FileCheck className="w-4 h-4 text-[#6B8E5A]" /> Safe ATS Matching
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-[#6B8E5A]" /> Candidate-Centered Privacy
          </span>
        </div>
      </section>

      {/* 2. DEMO VIDEO SECTION (Major Visual Section) */}
      <section className="py-16 md:py-24 bg-white border-y border-[rgba(52,78,65,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Product Walkthrough</span>
            <h2 className="text-3xl font-bold text-[#1F2A22] font-display">See InterviewIQ in Action</h2>
            <p className="text-sm text-[#6B756D]">
              From uploading your resume to completing a personalized AI interview, see how InterviewIQ helps you prepare.
            </p>
          </div>

          <ProductDemoPlayer onNavigate={onNavigate} />

          <p className="text-center text-xs text-[#6B756D]">
            Pro tip: Place full-length custom video file at{' '}
            <code className="bg-[#E5EEDC] px-1.5 py-0.5 rounded text-[#344E41] font-mono">
              client/public/videos/interviewiq-demo.mp4
            </code>
            . The player will automatically stream it when available.
          </p>
        </div>
      </section>

      {/* 3. HOW TO USE INTERVIEWIQ (12-Step Story) */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">The Full Journey</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2A22] font-display">
            How to Use InterviewIQ in 12 Steps
          </h2>
          <p className="text-sm sm:text-base text-[#6B756D]">
            A seamless career roadmap taking you from raw document parsing to targeted interview mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {twelveSteps.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[rgba(52,78,65,0.08)] shadow-soft hover:border-[#6B8E5A]/40 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#D4E2C5] font-display">{item.step}</span>
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] opacity-60" />
              </div>
              <h3 className="text-sm font-bold text-[#1F2A22]">{item.title}</h3>
              <p className="text-xs text-[#6B756D] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE INTERVIEWIQ WORKFLOW (Visual Timeline) */}
      <section className="py-20 bg-white border-y border-[rgba(52,78,65,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Architecture Loop</span>
            <h2 className="text-3xl font-bold text-[#1F2A22] font-display">The InterviewIQ Workflow</h2>
            <p className="text-sm text-[#6B756D]">
              One connected preparation cycle where each stage feeds directly into the next.
            </p>
          </div>

          {/* Visual Timeline Bar */}
          <div className="p-6 bg-[#F4F7F1] rounded-3xl border border-[rgba(52,78,65,0.08)] overflow-x-auto">
            <div className="flex items-center justify-between min-w-[760px] gap-2 text-center text-xs">
              {[
                'Resume',
                'AI Candidate Profile',
                'ATS Analysis',
                'Opportunity Match',
                'Resume Improvement',
                'Application',
                'AI Interview',
                'Performance Report',
                'Weak Area Practice',
              ].map((node, i, arr) => (
                <React.Fragment key={node}>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-8 h-8 rounded-full bg-[#344E41] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {i + 1}
                    </div>
                    <span className="font-semibold text-[#1F2A22] text-[11px] max-w-[90px] leading-tight">
                      {node}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-6 h-0.5 bg-[#6B8E5A] -mt-5" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHO IT'S FOR */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Target Audience</span>
          <h2 className="text-3xl font-bold text-[#1F2A22] font-display">Who It's Built For</h2>
          <p className="text-sm text-[#6B756D]">
            InterviewIQ is tailored specifically for technology candidates preparing for high-standard hiring loops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {targetAudiences.map((aud, i) => {
            const Icon = aud.icon;
            return (
              <div
                key={i}
                className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.08)] shadow-soft space-y-3 flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E5EEDC] text-[#344E41] flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon className="w-6 h-6 text-[#6B8E5A]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#1F2A22]">{aud.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">{aud.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Destination Action */}
        <div className="pt-8 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#344E41] text-white font-semibold text-sm hover:bg-[#4B6B5B] transition-all shadow-premium"
          >
            Launch Your Career Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
