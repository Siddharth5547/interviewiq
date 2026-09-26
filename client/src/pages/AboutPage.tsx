import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ProductDemoPlayer } from '../components/ProductDemoPlayer.js';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const workflowSteps = [
    { step: '01', title: 'Create Account', desc: 'Instant passwordless or credential onboarding with secure session isolation.' },
    { step: '02', title: 'Upload Resume', desc: 'PDF/DOCX raw parser extracts 15 structured entities with semantic normalization.' },
    { step: '03', title: 'ATS Analysis', desc: '0-100 compatibility estimate across keywords, titles, and section completeness.' },
    { step: '04', title: 'Add Job Description', desc: 'Paste target role text to identify core competencies and expected credentials.' },
    { step: '05', title: 'Job Matching', desc: 'Side-by-side gap analysis of verified strengths versus missing domain keywords.' },
    { step: '06', title: 'Improve Resume', desc: 'Google STAR/XYZ bullet enhancements without fabricating unverified metrics.' },
    { step: '07', title: 'Start AI Interview', desc: 'Configure difficulty, duration, and text/voice mode grounded in your profile.' },
    { step: '08', title: 'Answer Questions', desc: 'Audio speech-to-text or structured written responses evaluated live.' },
    { step: '09', title: 'Adaptive Follow-ups', desc: 'Dynamic state machine scales difficulty up or down based on response depth.' },
    { step: '10', title: 'Diagnostic Report', desc: '7-pillar radar scoring, question coaching, and Resume Reality Check.' },
    { step: '11', title: 'Practice Weak Areas', desc: 'Immediate 3-question targeted drill sessions addressing detected gaps.' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F1] text-[#1F2A22] selection:bg-[#D4E2C5]">
      {/* Editorial Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" />
          About InterviewIQ
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1F2A22] leading-[1.1] mb-6 font-display">
          Interview preparation <br />
          <span className="text-[#6B8E5A]">built around YOU.</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#6B756D] leading-relaxed max-w-3xl mx-auto">
          We built InterviewIQ to replace generic chatbot prompts with a rigorous, realistic AI career engine
          grounded strictly in what you have actually built, claimed, and achieved.
        </p>
      </section>

      {/* 16:9 Premium Demo Video Section (MAJOR VISUAL SECTION) */}
      <section className="py-12 md:py-20 bg-white border-y border-[rgba(52,78,65,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDemoPlayer onNavigate={onNavigate} />

          <p className="text-center text-xs text-[#6B756D] mt-6">
            Pro tip: Place full-length custom video file at{' '}
            <code className="bg-[#E5EEDC] px-1.5 py-0.5 rounded text-[#344E41] font-mono">
              client/public/videos/interviewiq-demo.mp4
            </code>
            . The player will automatically stream it when available.
          </p>
        </div>
      </section>

      {/* What is InterviewIQ? */}
      <section className="py-20 md:py-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Our Philosophy</span>
            <h3 className="text-3xl font-bold text-[#1F2A22] mt-2 mb-4 font-display">
              Why We Never Fabricate Information
            </h3>
            <p className="text-sm text-[#6B756D] leading-relaxed mb-4">
              Most generic AI tools will happily hallucinate imaginary metrics, invent leadership roles you never had,
              or rewrite your resume with fake buzzwords.
            </p>
            <p className="text-sm text-[#6B756D] leading-relaxed">
              When you get to an actual live engineering loop, hiring managers see through this immediately. InterviewIQ
              only enhances phrasing, elevates architectural trade-offs, and prepares you for questions about what you
              <strong> actually built</strong>.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-soft space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <ShieldCheck className="w-6 h-6 text-[#6B8E5A]" />
              <h4 className="font-bold text-sm text-[#1F2A22]">The InterviewIQ Guarantee</h4>
            </div>
            <ul className="space-y-3 text-xs text-[#1F2A22]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <span>Zero fabricated skills, projects, or metrics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <span>Honest ATS compatibility approximation with full disclaimers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <span>Adaptive state machine that prevents question repetition.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <span>100% private resume and interview transcript isolation.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 11 Steps Complete Workflow Storytelling */}
        <div className="pt-12 border-t border-[rgba(52,78,65,0.08)]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Complete Journey</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1F2A22] mt-1 font-display">
              11-Step Career Preparation Flow
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[rgba(52,78,65,0.08)] shadow-soft hover:border-[#6B8E5A]/40 transition-colors"
              >
                <span className="text-2xl font-black text-[#D4E2C5] block mb-2">{item.step}</span>
                <h4 className="text-sm font-bold text-[#1F2A22] mb-1">{item.title}</h4>
                <p className="text-xs text-[#6B756D] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-8 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#344E41] text-white font-semibold text-sm hover:bg-[#4B6B5B] transition-all shadow-premium"
          >
            Go to Your Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
