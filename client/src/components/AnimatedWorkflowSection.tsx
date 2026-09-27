import React, { useState, useEffect } from 'react';
import {
  Upload,
  Brain,
  Compass,
  FileCheck,
  Sparkles,
  Briefcase,
  Layers,
  Mic,
  MessageSquareReply,
  FileSpreadsheet,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AnimatedWorkflowSectionProps {
  onNavigate: (tab: string) => void;
}

interface WorkflowStep {
  id: string;
  step: string;
  title: string;
  line: string;
  icon: React.ElementType;
  tabTarget: string;
  preview: {
    badge: string;
    headline: string;
    details: string;
    interactiveSnippet: React.ReactNode;
  };
}

export const AnimatedWorkflowSection: React.FC<AnimatedWorkflowSectionProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [autoplay, setAutoplay] = useState<boolean>(true);

  const steps: WorkflowStep[] = [
    {
      id: 'step-01',
      step: '01',
      title: 'Upload Your Resume',
      line: 'Start with the resume you already have.',
      icon: Upload,
      tabTarget: 'resume',
      preview: {
        badge: 'File Ingestion',
        headline: 'Validated Document Parsing',
        details: 'Extracts raw text from PDF, DOCX, or TXT without hallucinations or synthetic placeholders.',
        interactiveSnippet: (
          <div className="p-3 bg-white rounded-xl border border-[#344E41]/10 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#6B756D]">
              <span className="font-semibold text-[#1F2A22]">siddharth_resume_2026.pdf</span>
              <span className="text-[#6B8E5A] font-bold">100% Parsed</span>
            </div>
            <div className="w-full bg-[#E5EEDC] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#6B8E5A] h-full w-full rounded-full transition-all duration-500" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6B756D]">
              <CheckCircle2 className="w-3 h-3 text-[#6B8E5A]" />
              <span>Contact info, 14 skills, 3 projects verified</span>
            </div>
          </div>
        ),
      },
    },
    {
      id: 'step-02',
      step: '02',
      title: 'AI Resume Analysis',
      line: 'Turn your resume into a career profile.',
      icon: Brain,
      tabTarget: 'resume',
      preview: {
        badge: 'Candidate Profile',
        headline: 'Semantic Domain Clustering',
        details: 'Discovers verified competencies: Full-Stack Web, REST APIs, Relational & Document Stores.',
        interactiveSnippet: (
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {['React.js', 'Node.js', 'PostgreSQL', 'Docker', 'JWT Auth'].map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-[#E5EEDC] text-[#344E41] font-semibold border border-[#344E41]/10"
              >
                ✓ {tech}
              </span>
            ))}
          </div>
        ),
      },
    },
    {
      id: 'step-03',
      step: '03',
      title: 'Find Your Opportunity',
      line: "Tell InterviewIQ what you're aiming for.",
      icon: Compass,
      tabTarget: 'opportunities',
      preview: {
        badge: 'Role Alignment',
        headline: 'Candidate Preference Matching',
        details: 'Configures target titles, remote preferences, internship vs full-time, and salary baselines.',
        interactiveSnippet: (
          <div className="p-2.5 bg-white rounded-xl border border-[#344E41]/10 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1F2A22] block">Software Engineer</span>
              <span className="text-[10px] text-[#6B756D]">Remote / Hybrid • Full-Time & Intern</span>
            </div>
            <span className="px-2 py-1 bg-[#E5EEDC] text-[#344E41] font-bold text-[10px] rounded-full">
              Aligned
            </span>
          </div>
        ),
      },
    },
    {
      id: 'step-04',
      step: '04',
      title: 'ATS & Job Match',
      line: 'See how closely your resume matches the opportunity.',
      icon: FileCheck,
      tabTarget: 'ats',
      preview: {
        badge: 'Grounded Compatibility',
        headline: 'Deterministic Keyword & Rubric Audit',
        details: 'Calculates an estimated 0-100 compatibility rating using safe regex for C++, .NET, and Node.js.',
        interactiveSnippet: (
          <div className="flex items-center gap-3 p-2 bg-[#E5EEDC]/60 rounded-xl border border-[#6B8E5A]/20">
            <span className="text-2xl font-black text-[#344E41] font-display">84</span>
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-[#1F2A22] block">Estimated Compatibility</span>
              <span className="text-[#6B756D]">18/20 Keywords • 9/10 Experience</span>
            </div>
          </div>
        ),
      },
    },
    {
      id: 'step-05',
      step: '05',
      title: 'Improve Your Resume',
      line: 'Make your application stronger without changing your story.',
      icon: Sparkles,
      tabTarget: 'improve',
      preview: {
        badge: 'Grounded Optimization',
        headline: 'Google STAR/XYZ Bullet Enhancer',
        details: 'Strengthens active verbs and metric framing while forbidding unearned skills or invented claims.',
        interactiveSnippet: (
          <div className="p-2.5 bg-white rounded-xl border border-[#344E41]/10 text-[11px] space-y-1">
            <span className="text-[#8FAF78] font-bold block text-[10px] uppercase">Enhanced Action Bullet:</span>
            <p className="text-[#1F2A22] italic">
              "Engineered high-throughput JWT authentication middleware handling 50k req/min using Redis token caching."
            </p>
          </div>
        ),
      },
    },
    {
      id: 'step-06',
      step: '06',
      title: 'Discover Jobs & Internships',
      line: 'Find opportunities relevant to your profile.',
      icon: Briefcase,
      tabTarget: 'opportunities',
      preview: {
        badge: 'Live Opportunities',
        headline: 'Curated Open Positions',
        details: 'Direct application links with transparent resume match percentages and skill gap breakdowns.',
        interactiveSnippet: (
          <div className="p-2.5 bg-white rounded-xl border border-[#344E41]/10 flex items-center justify-between">
            <div className="text-[11px]">
              <span className="font-bold text-[#1F2A22] block">Frontend Platform Intern</span>
              <span className="text-[10px] text-[#6B756D]">Vercel • 92% Match</span>
            </div>
            <span className="text-[10px] font-bold text-[#6B8E5A] bg-[#E5EEDC] px-2 py-0.5 rounded-full">
              Apply Direct
            </span>
          </div>
        ),
      },
    },
    {
      id: 'step-07',
      step: '07',
      title: 'Apply & Track',
      line: 'Keep your applications organized.',
      icon: Layers,
      tabTarget: 'applications',
      preview: {
        badge: 'Application Pipeline',
        headline: '8-Stage Recruitment Tracking',
        details: 'Monitor pipeline status from Saved through Applied, Assessment, Interview, to Offer.',
        interactiveSnippet: (
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <span className="px-2 py-0.5 bg-[#344E41] text-white rounded">Applied</span>
            <span className="text-[#6B756D]">→</span>
            <span className="px-2 py-0.5 bg-[#6B8E5A] text-white rounded">Interview</span>
            <span className="text-[#6B756D]">→</span>
            <span className="px-2 py-0.5 bg-[#E5EEDC] text-[#344E41] rounded">Offer</span>
          </div>
        ),
      },
    },
    {
      id: 'step-08',
      step: '08',
      title: 'AI Interview',
      line: 'Practice with an interviewer that understands your resume.',
      icon: Mic,
      tabTarget: 'interview',
      preview: {
        badge: 'Grounded Simulation',
        headline: 'Adaptive Voice & Text Mock Room',
        details: '7 interview tracks and 5 personality modes (Professional, Friendly, Technical, Strict, HR).',
        interactiveSnippet: (
          <div className="p-2.5 bg-[#344E41] text-white rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#D4E2C5]">
              <span>Interviewer Question #2</span>
              <span>● Listening</span>
            </div>
            <p className="text-[11px] font-medium leading-tight">
              "Why did you choose MongoDB over PostgreSQL for your event ticketing service?"
            </p>
          </div>
        ),
      },
    },
    {
      id: 'step-09',
      step: '09',
      title: 'Dynamic Follow-ups',
      line: 'Your next question depends on your previous answer.',
      icon: MessageSquareReply,
      tabTarget: 'interview',
      preview: {
        badge: 'Dynamic State Machine',
        headline: 'Intelligent Conversational Branching',
        details: 'Evaluates answer depth to escalate into scale/tradeoffs or clarify fundamental principles.',
        interactiveSnippet: (
          <div className="p-2.5 bg-white rounded-xl border border-[#344E41]/10 text-xs space-y-1">
            <span className="text-[10px] font-bold text-[#6B8E5A] uppercase block">
              Follow-Up Triggered: Strong Answer (92%)
            </span>
            <p className="text-[11px] text-[#1F2A22]">
              "If writes scale to 50,000 req/sec, how would you design your database sharding strategy?"
            </p>
          </div>
        ),
      },
    },
    {
      id: 'step-10',
      step: '10',
      title: 'Interview Report',
      line: 'Understand how you performed.',
      icon: FileSpreadsheet,
      tabTarget: 'history',
      preview: {
        badge: 'Diagnostic Report',
        headline: 'Executive Scoring & Reality Check',
        details: 'Respectful contrast: strongly demonstrated, partially demonstrated, or needs practice.',
        interactiveSnippet: (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-[#E5EEDC] rounded-lg text-center">
              <span className="text-lg font-black text-[#344E41] block">88%</span>
              <span className="text-[10px] font-semibold text-[#6B756D]">System Design</span>
            </div>
            <div className="p-2 bg-[#E5EEDC] rounded-lg text-center">
              <span className="text-lg font-black text-[#344E41] block">92%</span>
              <span className="text-[10px] font-semibold text-[#6B756D]">Communication</span>
            </div>
          </div>
        ),
      },
    },
    {
      id: 'step-11',
      step: '11',
      title: 'Practice Weak Areas',
      line: 'Turn weaknesses into focused practice.',
      icon: Target,
      tabTarget: 'practice',
      preview: {
        badge: 'Growth Loop',
        headline: 'Targeted Skill Drills',
        details: 'Generates 3-question rapid-fire drills focused squarely on concepts missed in mock interviews.',
        interactiveSnippet: (
          <div className="p-2 bg-white rounded-xl border border-[#344E41]/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#1F2A22] block">Database Indexing Drill</span>
              <span className="text-[10px] text-[#6B756D]">B-trees • Compound Keys • Query Optimization</span>
            </div>
            <span className="px-2.5 py-1 bg-[#344E41] text-white text-[10px] font-bold rounded-full">
              Start Drill
            </span>
          </div>
        ),
      },
    },
    {
      id: 'step-12',
      step: '12',
      title: 'Track Your Progress',
      line: 'Keep improving with every interview.',
      icon: TrendingUp,
      tabTarget: 'dashboard',
      preview: {
        badge: 'Career Mastery',
        headline: 'Progressive Competency Analytics',
        details: 'Visualizes historical interview trends, total applications tracked, and topic mastery gains.',
        interactiveSnippet: (
          <div className="p-2.5 bg-[#E5EEDC]/60 rounded-xl border border-[#6B8E5A]/20 flex items-center justify-between text-xs">
            <div>
              <span className="font-extrabold text-[#344E41] text-sm block">+24 pts</span>
              <span className="text-[10px] text-[#6B756D]">Historical Interview Score Trend</span>
            </div>
            <TrendingUp className="w-5 h-5 text-[#6B8E5A]" />
          </div>
        ),
      },
    },
  ];

  // Optional subtle auto-rotation if user hasn't explicitly interacted
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoplay, steps.length]);

  return (
    <section id="how-it-works-section" className="py-24 md:py-32 bg-white border-y border-[rgba(52,78,65,0.08)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" />
            Continuous Preparation Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F2A22] font-display leading-tight">
            How InterviewIQ Takes You From <br />
            <span className="text-[#6B8E5A]">Resume to Interview-Ready</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6B756D] mt-3 leading-relaxed">
            Follow your complete journey — from uploading your resume to preparing for your next opportunity.
          </p>
        </div>

        {/* 12-Step Interactive Timeline Visual Journey */}
        <div className="relative">
          {/* Central Vertical Connector Line (Desktop) */}
          <div
            className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-1 bg-[#E5EEDC] -translate-x-1/2 rounded-full overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="w-full bg-[#6B8E5A] rounded-full transition-all duration-700 ease-out"
              style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="space-y-8 md:space-y-12">
            {steps.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const isActive = activeStep === idx;
              const isCompleted = activeStep > idx;
              const StepIcon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveStep(idx);
                    setAutoplay(false);
                  }}
                  className={`cursor-pointer transition-all duration-300 relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Step Card Content */}
                  <div
                    className={`w-full lg:w-1/2 p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                      isActive
                        ? 'bg-white border-[#6B8E5A] shadow-[0_16px_40px_-10px_rgba(107,142,90,0.18)] scale-[1.01]'
                        : isCompleted
                        ? 'bg-[#F4F7F1]/80 border-[rgba(52,78,65,0.08)] opacity-90'
                        : 'bg-[#F4F7F1]/50 border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#344E41] text-white'
                              : 'bg-[#E5EEDC] text-[#344E41]'
                          }`}
                        >
                          Step {item.step}
                        </span>
                        <span className="text-[11px] font-bold text-[#6B8E5A] uppercase tracking-wider">
                          {item.preview.badge}
                        </span>
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-[#6B8E5A]" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#1F2A22] mb-1 font-display">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B756D] font-medium mb-3">
                      "{item.line}"
                    </p>

                    {/* Micro-preview snippet for active/selected steps */}
                    <div className="pt-3 border-t border-[rgba(52,78,65,0.08)]">
                      <p className="text-xs text-[#1F2A22] leading-relaxed mb-3">
                        {item.preview.details}
                      </p>
                      {item.preview.interactiveSnippet}
                    </div>

                    {isActive && (
                      <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#344E41]/10">
                        <span className="text-[11px] text-[#6B756D]">Active Workflow Feature</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(item.tabTarget);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors"
                        >
                          Try in Platform <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Center Node / Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 z-10 ${
                      isActive
                        ? 'bg-[#344E41] text-white ring-4 ring-[#D4E2C5] scale-110'
                        : isCompleted
                        ? 'bg-[#6B8E5A] text-white'
                        : 'bg-white text-[#6B756D] border border-gray-200'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>

                  {/* Empty Spacer on opposite side to maintain layout */}
                  <div className="hidden lg:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Destination CTA Banner as defined in §17 */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#344E41] text-white text-center space-y-5 shadow-premium">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6 text-[#D4E2C5]" />
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
              Your preparation journey starts here
            </h3>
            <p className="text-sm sm:text-base text-[#D4E2C5] leading-relaxed">
              Upload your resume and let InterviewIQ guide you from preparation to interview.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('resume')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E5EEDC] text-[#344E41] font-bold text-xs hover:bg-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-colors"
            >
              Explore InterviewIQ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
