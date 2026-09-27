import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  FileCheck2,
  FileText,
  Briefcase,
  Layers,
  Mic,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { AnimatedWorkflowSection } from '../components/AnimatedWorkflowSection.js';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F4F7F1] text-[#1F2A22] selection:bg-[#D4E2C5] overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 sage-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Large Cinematic Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" />
                Your Resume. Your Job. Your Interview.
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1F2A22] leading-[1.05] font-display">
                Prepare Smarter. <br />
                <span className="text-[#6B8E5A]">Interview Better.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#6B756D] leading-relaxed max-w-xl mx-auto lg:mx-0">
                From your resume to your next interview, InterviewIQ helps you understand your fit, improve your resume, discover opportunities, and practice with an AI interviewer.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('signup')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#344E41] text-white font-bold text-sm shadow-premium hover:bg-[#4B6B5B] transition-all hover:scale-[1.02]"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#1F2A22] font-semibold text-sm border border-[rgba(52,78,65,0.14)] shadow-soft hover:bg-[#E5EEDC]/40 transition-all hover:scale-[1.02]"
                >
                  See How It Works
                </button>
              </div>

              {/* Verified Trust Tokens */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#6B756D]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#6B8E5A]" /> Zero Data Fabrication
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Brain className="w-4 h-4 text-[#6B8E5A]" /> Adaptive State Machine
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <FileCheck2 className="w-4 h-4 text-[#6B8E5A]" /> Safe ATS Matcher
                </span>
              </div>
            </div>

            {/* Right: Visual Product Preview (Resume → ATS → Job Match → AI Interview → Application Tracking) */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-[#8FAF78]/15 rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative bg-white rounded-3xl border border-[rgba(52,78,65,0.12)] shadow-[0_30px_70px_-15px_rgba(52,78,65,0.16)] p-6 sm:p-7 space-y-4">
                {/* Header ribbon */}
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(52,78,65,0.08)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#344E41] text-white flex items-center justify-center font-bold text-xs">
                      IQ
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1F2A22] block">Career Prep Pipeline</span>
                      <span className="text-[10px] text-[#6B756D]">End-to-End Verified Flow</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 bg-[#E5EEDC] text-[#344E41] rounded-full">
                    Live Session Preview
                  </span>
                </div>

                {/* Pipeline visual chain: Resume → ATS → Job Match → AI Interview → Application Tracking */}
                <div className="grid grid-cols-5 gap-1.5 py-1 text-center text-[10px] font-bold">
                  {[
                    { label: 'Resume', active: true },
                    { label: 'ATS', active: true },
                    { label: 'Job Match', active: true },
                    { label: 'Interview', active: true },
                    { label: 'Tracking', active: true },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-1.5 rounded-lg border ${
                        step.active
                          ? 'bg-[#E5EEDC] border-[#6B8E5A]/30 text-[#344E41]'
                          : 'bg-gray-50 border-gray-100 text-gray-400'
                      }`}
                    >
                      {step.label}
                    </div>
                  ))}
                </div>

                {/* Simulated Interview Dialogue Card */}
                <div className="p-3.5 bg-[#F4F7F1] rounded-2xl border border-[rgba(52,78,65,0.06)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#6B8E5A] uppercase tracking-wider">
                      AI Interviewer • Technical Round
                    </span>
                    <span className="text-[10px] text-[#6B756D]">Question 2 of 5</span>
                  </div>
                  <p className="text-xs font-medium text-[#1F2A22] leading-relaxed">
                    "You listed <strong>PostgreSQL</strong> and <strong>MongoDB</strong> in your projects. How did you choose between them for the user profile store, and how did you approach database migrations?"
                  </p>
                </div>

                {/* Simulated Candidate Audio & STT */}
                <div className="p-3 bg-white rounded-2xl border border-[rgba(52,78,65,0.1)] space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#1F2A22]">Candidate Speech-to-Text</span>
                    <span className="text-[10px] text-[#6B8E5A] font-bold">● Transcribing</span>
                  </div>
                  <p className="text-[11px] text-[#6B756D] italic leading-tight">
                    "We selected PostgreSQL for strong ACID guarantees around user auth and relational billing records..."
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {[12, 22, 16, 26, 14, 20, 10].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#6B8E5A] rounded-full"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#344E41] bg-[#E5EEDC] px-2 py-0.5 rounded-full">
                      88% Evaluated
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVERYTHING YOU NEED TO PREPARE (6 Capability Blocks) */}
      <section className="py-24 md:py-32 bg-white border-y border-[rgba(52,78,65,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Core Modules</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] mt-2 font-display">
              Everything You Need to Prepare
            </h2>
            <p className="text-base sm:text-lg text-[#6B756D] mt-3">
              Six interconnected capability blocks engineered to guide you from initial resume upload to receiving job offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Block 1: Resume Intelligence */}
            <div className="p-8 rounded-3xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.08)] space-y-4 hover:border-[#6B8E5A]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#D4E2C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2A22] font-display">Resume Intelligence</h3>
              <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">
                Build your verified AI candidate profile. Parse PDF, DOCX, and TXT files without inventing unearned credentials or missing fields.
              </p>
              <button
                onClick={() => onNavigate('resume')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors pt-2"
              >
                Analyze Resume <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Block 2: ATS Analysis */}
            <div className="p-8 rounded-3xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.08)] space-y-4 hover:border-[#6B8E5A]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center">
                <FileCheck2 className="w-6 h-6 text-[#D4E2C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2A22] font-display">ATS Analysis</h3>
              <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">
                Compare your resume to target job descriptions using safe regex matching for C++, .NET, Node.js, and REST APIs without crash errors.
              </p>
              <button
                onClick={() => onNavigate('ats')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors pt-2"
              >
                Check ATS Score <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Block 3: Opportunity Discovery */}
            <div className="p-8 rounded-3xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.08)] space-y-4 hover:border-[#6B8E5A]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#D4E2C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2A22] font-display">Opportunity Discovery</h3>
              <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">
                Find relevant verified technology jobs and internships with estimated resume match rates, required skills, and direct apply links.
              </p>
              <button
                onClick={() => onNavigate('opportunities')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors pt-2"
              >
                Browse Opportunities <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Block 4: Resume Improvement */}
            <div className="p-8 rounded-3xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.08)] space-y-4 hover:border-[#6B8E5A]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#D4E2C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2A22] font-display">Resume Improvement</h3>
              <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">
                Optimize your bullet points for a target role using Google's XYZ formula without altering your real background or hallucinating metrics.
              </p>
              <button
                onClick={() => onNavigate('improve')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors pt-2"
              >
                Improve Resume <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Block 5: AI Interviews */}
            <div className="p-8 rounded-3xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.08)] space-y-4 hover:border-[#6B8E5A]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center">
                <Mic className="w-6 h-6 text-[#D4E2C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2A22] font-display">AI Interviews</h3>
              <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">
                Practice text or voice mock interviews across 7 tracks and 5 personality modes with dynamic follow-ups based on actual answer strength.
              </p>
              <button
                onClick={() => onNavigate('interview')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors pt-2"
              >
                Launch Mock Room <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Block 6: Application Tracking */}
            <div className="p-8 rounded-3xl bg-[#F4F7F1] border border-[rgba(52,78,65,0.08)] space-y-4 hover:border-[#6B8E5A]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#D4E2C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2A22] font-display">Application Tracking</h3>
              <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">
                Track where you applied across an 8-stage recruitment pipeline, record interviewer feedback, and monitor your recruitment funnel.
              </p>
              <button
                onClick={() => onNavigate('applications')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors pt-2"
              >
                Open Tracker <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW INTERVIEWIO WORKS (12-Step Animated Workflow Section - §17 Spec) */}
      <AnimatedWorkflowSection onNavigate={onNavigate} />

      {/* 4. LARGE PRODUCT PREVIEW SECTION */}
      <section className="py-24 md:py-32 bg-[#F4F7F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Unified Workspace</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] mt-2 font-display">
              One Unified Career Preparation Engine
            </h2>
            <p className="text-base sm:text-lg text-[#6B756D] mt-3">
              See your resume compatibility score, matched jobs, skill gaps, real interview questions, and active application statuses in one coherent view.
            </p>
          </div>

          {/* One Large Real Preview Box */}
          <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.12)] shadow-[0_24px_60px_-15px_rgba(52,78,65,0.12)] p-8 sm:p-12 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: ATS Score & Matching Job */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-[#F4F7F1] rounded-2xl border border-[#344E41]/10 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B756D]">
                    Grounded Resume Score
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black text-[#344E41] font-display">84</span>
                    <div>
                      <span className="text-xs font-bold text-[#1F2A22] block">High Compatibility</span>
                      <span className="text-[11px] text-[#6B756D]">Stripe & Co. • Software Engineer</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-[rgba(52,78,65,0.1)] space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B8E5A]">
                    Key Matching Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js', 'Node.js', 'PostgreSQL', 'REST API', 'Docker', 'JWT'].map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 bg-[#E5EEDC] text-[#344E41] rounded-lg text-xs font-semibold"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-100 text-xs text-[#6B756D] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Missing: Redis Caching, Kubernetes (Recommended)</span>
                  </div>
                </div>
              </div>

              {/* Center Column: Live Dynamic Interview Question */}
              <div className="lg:col-span-5 p-6 bg-[#344E41] text-white rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-[#D4E2C5] border-b border-white/10 pb-3">
                  <span className="font-bold">AI Technical Mock Round</span>
                  <span>Question 3 of 6</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#8FAF78] tracking-wider block">
                    Interviewer Question:
                  </span>
                  <p className="text-sm leading-relaxed font-medium">
                    "In your project <strong>CampusIQ</strong>, you mentioned using PostgreSQL for user accounts and MongoDB for activity logging. What specific architectural tradeoff led you to adopt two different database engines?"
                  </p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl text-xs space-y-1">
                  <span className="text-[10px] text-[#D4E2C5] font-bold block">Candidate Answer:</span>
                  <p className="text-white/90 italic">
                    "PostgreSQL gave us relational integrity for user permissions, while MongoDB allowed schema flexibility for variable JSON event payloads."
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#8FAF78] font-bold">Evaluation: Strong (91%)</span>
                  <span className="text-[#D4E2C5] text-[11px]">Follow-up: Cross-database consistency</span>
                </div>
              </div>

              {/* Right Column: Active Application Tracker Status */}
              <div className="lg:col-span-3 p-6 bg-[#F4F7F1] rounded-2xl border border-[#344E41]/10 space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B756D] block">
                  Application Tracker
                </span>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1F2A22] block">Stripe & Co.</span>
                  <span className="text-[11px] text-[#6B756D] block">Full-Stack Engineer</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6B8E5A] text-white rounded-full text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    Interview Scheduled
                  </div>
                </div>

                <div className="pt-3 border-t border-[rgba(52,78,65,0.08)] text-[11px] text-[#6B756D] space-y-1">
                  <span className="font-semibold text-[#1F2A22] block">Next Action:</span>
                  <p>Complete 20-min System Design & Database drill before interview date.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY INTERVIEWIQ (The Pitch) */}
      <section className="py-24 md:py-32 bg-white border-y border-[rgba(52,78,65,0.08)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">The Pitch</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] font-display">
              Why InterviewIQ?
            </h2>
            <p className="text-base sm:text-lg text-[#6B756D] max-w-2xl mx-auto">
              Instead of paying for separate tools for resume parsing, ATS scoring, job boards, application spreadsheets, and generic mock interview chatbots...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#F4F7F1] border border-red-200/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">The Fragmented Approach</span>
              <h4 className="text-lg font-bold text-[#1F2A22]">5 Separate Disconnected Tools</h4>
              <ul className="space-y-2 text-xs text-[#6B756D]">
                <li>❌ Resume parser that doesn't talk to your interview prep.</li>
                <li>❌ Generic ATS scanners that break on C++, .NET, and Node.js.</li>
                <li>❌ Job search boards with no clue about your actual resume match.</li>
                <li>❌ Spreadsheets for tracking applications that go stale instantly.</li>
                <li>❌ Static chatbots asking canned generic interview questions.</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-[#E5EEDC]/80 border border-[#6B8E5A]/40 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">The InterviewIQ Approach</span>
              <h4 className="text-lg font-bold text-[#344E41]">One Connected Career Preparation Loop</h4>
              <ul className="space-y-2 text-xs text-[#1F2A22]">
                <li>✓ One verified resume builds your persistent candidate profile.</li>
                <li>✓ Deterministic ATS scoring using safe, tokenized phrase matching.</li>
                <li>✓ Live curated opportunities with genuine resume match estimates.</li>
                <li>✓ Integrated application tracker linked to your preparation history.</li>
                <li>✓ Adaptive voice & text interviewer that tests what you actually built.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-24 md:py-32 bg-[#344E41] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight">
            Your next opportunity starts with better preparation.
          </h2>
          <p className="text-base sm:text-lg text-[#D4E2C5] max-w-xl mx-auto leading-relaxed">
            Upload your resume, see your true ATS match, and practice high-impact realistic interviews today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E5EEDC] text-[#344E41] font-extrabold text-sm hover:bg-white transition-all shadow-premium"
            >
              Start Preparing
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              About InterviewIQ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
