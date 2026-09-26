import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Mic,
  FileCheck2,
  CheckCircle2,
  BrainCircuit,
  Award,
  Layers,
  FileText,
  Volume2,
  Play,
  TrendingUp,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F4F7F1] text-[#1F2A22] selection:bg-[#D4E2C5] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-28 md:pb-36 sage-gradient-hero">
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
                Analyze your resume, check ATS compatibility, match your resume with a target job,
                and practice personalized AI interviews based on your actual experience.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('interview')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#344E41] text-white font-bold text-sm shadow-premium hover:bg-[#4B6B5B] transition-all hover:scale-[1.02]"
                >
                  Start Your Interview <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('resume')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[#1F2A22] font-semibold text-sm border border-[rgba(52,78,65,0.14)] shadow-soft hover:bg-[#E5EEDC]/40 transition-all hover:scale-[1.02]"
                >
                  Analyze My Resume
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#6B756D]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#6B8E5A]" /> Zero Data Fabrication
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <BrainCircuit className="w-4 h-4 text-[#6B8E5A]" /> Adaptive State Machine
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <FileCheck2 className="w-4 h-4 text-[#6B8E5A]" /> Grounded ATS Scoring
                </span>
              </div>
            </div>

            {/* Right: Large Realistic Product Preview */}
            <div className="lg:col-span-6 relative">
              {/* Soft sage glow behind preview */}
              <div className="absolute -inset-4 bg-[#8FAF78]/15 rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-[rgba(52,78,65,0.12)] shadow-[0_30px_70px_-15px_rgba(52,78,65,0.18)] p-6 sm:p-7 space-y-5">
                {/* Header of Mock Window */}
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(52,78,65,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#344E41] text-white flex items-center justify-center font-bold text-xs">
                      IQ
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1F2A22]">AI Technical Mock Interview</h4>
                      <p className="text-[11px] text-[#6B756D]">Full Stack Software Engineer • Live Session</p>
                    </div>
                  </div>

                  {/* Large 84 ATS Score Badge */}
                  <div className="flex items-center gap-2 bg-[#E5EEDC] px-3.5 py-1.5 rounded-full border border-[rgba(52,78,65,0.1)]">
                    <span className="text-sm font-extrabold text-[#344E41]">84</span>
                    <span className="text-[10px] uppercase font-bold text-[#6B8E5A] tracking-wider">ATS Score</span>
                  </div>
                </div>

                {/* Question & Avatar Preview */}
                <div className="p-4 bg-[#F4F7F1] rounded-2xl border border-[rgba(52,78,65,0.06)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#6B8E5A] animate-ping" />
                      <span className="text-[11px] font-bold text-[#344E41] uppercase tracking-wider">
                        Interviewer Speaking
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6B756D]">Question 3 of 7</span>
                  </div>

                  <p className="text-sm font-medium text-[#1F2A22] leading-relaxed">
                    "I see from your resume that you built <strong>CampusIQ</strong> using React and Node.js.
                    Can you walk me through how you structured your API middleware and role-based authentication?"
                  </p>
                </div>

                {/* Candidate Answer Box with Waveform */}
                <div className="p-4 bg-white rounded-2xl border border-[rgba(52,78,65,0.12)] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#6B756D]">
                    <span className="font-semibold text-[#1F2A22]">Candidate Response (Speech-to-Text)</span>
                    <span className="text-[11px] text-[#6B8E5A] font-bold">● Listening</span>
                  </div>

                  <p className="text-xs text-[#1F2A22] italic leading-relaxed">
                    "In CampusIQ, we implemented JWT tokens in HttpOnly cookies, validated permissions via Express
                    middleware, and hashed passwords with bcrypt..."
                  </p>

                  {/* Audio wave frequency visualizer */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full bg-[#6B8E5A] animate-soundwave-${(i % 5) + 1}`}
                          style={{ height: `${(i % 4) * 5 + 8}px` }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => onNavigate('interview')}
                      className="px-3.5 py-1.5 rounded-full bg-[#344E41] text-white text-[11px] font-bold hover:bg-[#4B6B5B] transition-colors"
                    >
                      Submit Answer →
                    </button>
                  </div>
                </div>

                {/* Instant Evaluation Feedback Preview */}
                <div className="p-3 bg-[#E5EEDC]/80 rounded-xl border border-[rgba(52,78,65,0.08)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#344E41] font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#6B8E5A]" />
                    <span>Evaluation: <strong>Correct (92%)</strong></span>
                  </div>
                  <span className="text-[11px] text-[#6B756D]">Follow-up: Advanced Redis Caching</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Workflow Section (120px Vertical Spacing) */}
      <section id="how-it-works-section" className="py-24 md:py-32 bg-white border-y border-[rgba(52,78,65,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Architecture Flow</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] mt-2 font-display">
              Your Resume Becomes Your <br />
              <span className="text-[#6B8E5A]">Interview Blueprint</span>
            </h2>
            <p className="text-base sm:text-lg text-[#6B756D] mt-3">
              No generic prompt templates. Every question and rubric is derived through an end-to-end semantic pipeline.
            </p>
          </div>

          {/* Timeline / Visual Flow Layout */}
          <div className="relative">
            {/* Central connecting line for desktop */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-[#D4E2C5] -translate-x-1/2" />

            <div className="space-y-12 md:space-y-16">
              {[
                {
                  step: '01',
                  badge: 'Input',
                  title: 'Raw Resume Parsing',
                  desc: 'We extract skills, projects, work experience, and credentials from PDF/DOCX files into structured entities.',
                  side: 'left',
                },
                {
                  step: '02',
                  badge: 'Intelligence',
                  title: 'Semantic Domain Mapping',
                  desc: 'Beyond plain text: we map tools like React, Node, and MongoDB into architectural domains (Full-stack Web, APIs, Auth).',
                  side: 'right',
                },
                {
                  step: '03',
                  badge: 'Comparison',
                  title: 'ATS & Job Matching',
                  desc: 'Compare against the target job description to compute an estimated 0-100 compatibility score and missing keywords.',
                  side: 'left',
                },
                {
                  step: '04',
                  badge: 'Enhancement',
                  title: 'Grounded Resume Improvement',
                  desc: 'Elevate bullet points using Google’s STAR/XYZ formula without inventing fake metrics or unearned skills.',
                  side: 'right',
                },
                {
                  step: '05',
                  badge: 'Simulation',
                  title: 'Personalized AI Interview',
                  desc: 'Face an adaptive interviewer who probes your actual architecture, asks project deep-dives, and dynamically adapts difficulty.',
                  side: 'left',
                },
                {
                  step: '06',
                  badge: 'Diagnostic',
                  title: 'Interview Report & Reality Check',
                  desc: 'Receive 7-pillar competency scoring, question rubrics, and contrast paper claims with live interview demonstration.',
                  side: 'right',
                },
              ].map((item, idx) => {
                const isLeft = item.side === 'left';
                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isLeft ? 'md:flex-row-reverse' : ''
                    } gap-8`}
                  >
                    {/* Content Box */}
                    <div className="w-full md:w-1/2 p-6 sm:p-8 bg-[#F4F7F1] rounded-3xl border border-[rgba(52,78,65,0.08)] shadow-soft">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">
                          {item.badge}
                        </span>
                        <span className="text-xl font-extrabold text-[#D4E2C5] font-display">{item.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1F2A22] mb-2 font-display">{item.title}</h3>
                      <p className="text-sm text-[#6B756D] leading-relaxed">{item.desc}</p>
                    </div>

                    {/* Central Indicator Node */}
                    <div className="hidden md:flex w-10 h-10 rounded-full bg-[#344E41] text-white items-center justify-center font-bold text-xs shadow-md z-10">
                      {idx + 1}
                    </div>

                    {/* Spacer for other side */}
                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Large Alternating Feature Sections (120px Vertical Spacing) */}
      <section id="features-section" className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 md:space-y-36">
        {/* Feature 1: Resume Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Semantic Understanding</span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] leading-tight font-display">
              We Understand What <br />
              Your Stack Means
            </h3>
            <p className="text-base text-[#6B756D] leading-relaxed">
              Generic parsers treat "React" and "PostgreSQL" as disconnected keywords. InterviewIQ understands the
              higher-order software engineering competencies they represent: Single Page Architecture, Relational Data
              Modeling, and Stateless Session Handling.
            </p>
            <ul className="space-y-3 text-sm text-[#1F2A22]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#6B8E5A] flex-shrink-0" />
                <span>Understands relationships between frontend, backend, and cloud architectures</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#6B8E5A] flex-shrink-0" />
                <span>Normalizes terminology (e.g. React.js, ReactJS, Next.js synergies)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#6B8E5A] flex-shrink-0" />
                <span>Structures extracted projects into actionable interview topics</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-premium space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B756D]">Inferred Competency Map</span>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                'Full-stack Web Engineering',
                'REST API Architecture',
                'Database Data Modeling',
                'Authentication & Security (JWT)',
                'Performance Tuning',
                'Containerization & Docker',
              ].map((domain, i) => (
                <span
                  key={i}
                  className="px-3.5 py-2 rounded-xl bg-[#E5EEDC] text-[#344E41] font-semibold text-xs border border-[rgba(52,78,65,0.08)]"
                >
                  ✓ {domain}
                </span>
              ))}
            </div>
            <div className="p-4 bg-[#F4F7F1] rounded-2xl border border-[rgba(52,78,65,0.06)] text-xs text-[#6B756D]">
              <strong>Project Synergy:</strong> CampusIQ → Synthesizes Full-stack Web, Role-Based Access Control, and
              Document Store Design.
            </div>
          </div>
        </div>

        {/* Feature 2: ATS Analysis (Large 84 Score Visualization) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Compatibility Engine</span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] leading-tight font-display">
              Estimated ATS Compatibility <br />
              Without False Promises
            </h3>
            <p className="text-base text-[#6B756D] leading-relaxed">
              We provide a transparent 9-point compatibility analysis comparing your resume against real job descriptions.
              We never claim a score guarantees employer hiring—we provide honest, actionable insights.
            </p>
            <button
              onClick={() => onNavigate('ats')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#344E41] text-white font-bold text-xs hover:bg-[#4B6B5B] transition-all shadow-sm"
            >
              Analyze Your Job Match <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 lg:order-1 p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-premium">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-6 pb-6 border-b border-[rgba(52,78,65,0.08)]">
              <div className="text-center">
                <span className="text-6xl font-black text-[#344E41] font-display">84</span>
                <span className="text-xs uppercase font-extrabold text-[#6B8E5A] tracking-wider block mt-1">
                  ATS Score
                </span>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-base font-bold text-[#1F2A22]">Full Stack Software Engineer</h4>
                <p className="text-xs text-[#6B756D]">Stripe & Co. Labs • High Match</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Keyword Match', score: '18/20', pct: 90 },
                { label: 'Skills Competency', score: '17/20', pct: 85 },
                { label: 'Experience Relevance', score: '9/10', pct: 90 },
                { label: 'Project Alignment', score: '9/10', pct: 90 },
                { label: 'Formatting & Layout', score: '10/10', pct: 100 },
              ].map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#1F2A22]">
                    <span>{cat.label}</span>
                    <span className="text-[#6B8E5A]">{cat.score}</span>
                  </div>
                  <div className="w-full bg-[#E5EEDC] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#6B8E5A] h-full rounded-full transition-all duration-700"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 3: Dynamic Adaptive Interview Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A]">Realistic Practice</span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] leading-tight font-display">
              Adaptive Interviews That <br />
              React to Every Answer
            </h3>
            <p className="text-base text-[#6B756D] leading-relaxed">
              If you give an outstanding response, our state machine scales to high-concurrency architecture. If you
              hesitate or give a vague answer, it steps back to test foundational mechanics.
            </p>
            <button
              onClick={() => onNavigate('interview')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#6B8E5A] text-white font-bold text-xs hover:bg-[#587649] transition-all shadow-sm"
            >
              Start Adaptive Mock <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 p-8 bg-white rounded-3xl border border-[rgba(52,78,65,0.1)] shadow-premium space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold text-[#344E41]">Adaptive Difficulty State Machine</span>
              <span className="text-xs font-semibold text-[#6B8E5A]">Live Adjustment</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#F4F7F1] rounded-2xl border border-[rgba(52,78,65,0.06)]">
                <span className="font-bold text-[#344E41] block mb-1">Strong Candidate Answer (92%):</span>
                <p className="text-[#6B756D]">
                  Candidate explained MongoDB compound B-tree indexing and query projection optimization.
                </p>
              </div>

              <div className="p-3.5 bg-[#E5EEDC] rounded-2xl border border-[rgba(52,78,65,0.08)] flex items-center justify-between text-[#344E41] font-semibold">
                <span>Adaptive Decision: <strong>Escalate to Advanced Follow-up</strong></span>
                <span>Level: Advanced</span>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[rgba(52,78,65,0.1)]">
                <span className="font-bold text-[#344E41] block mb-1">Generated Follow-up:</span>
                <p className="text-[#1F2A22] italic">
                  "How would you handle sharding and write-concern trade-offs if your cluster grows to 10M writes/minute?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner (Spacious & Refined) */}
      <section className="py-24 md:py-32 bg-[#344E41] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-base sm:text-lg text-[#D4E2C5] max-w-xl mx-auto leading-relaxed">
            Upload your resume, see your true ATS match, and practice high-impact realistic interviews today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('resume')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E5EEDC] text-[#344E41] font-extrabold text-sm hover:bg-white transition-all shadow-premium"
            >
              Analyze My Resume Free
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              Open Live Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
