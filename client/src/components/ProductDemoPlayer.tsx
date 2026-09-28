import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  SkipForward,
  SkipBack,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Briefcase,
  Layers,
  Award,
  Mic,
  Cpu,
  BarChart3,
  Flame,
  Radio,
  Clock,
  ChevronRight,
  Tv,
} from 'lucide-react';

interface ProductDemoPlayerProps {
  onNavigate: (tab: string) => void;
}

interface SceneData {
  id: number;
  chapter: string;
  title: string;
  subtitle: string;
  narration: string;
  durationSec: number;
  badge: string;
}

const DEMO_SCENES: SceneData[] = [
  {
    id: 1,
    chapter: '01 / Welcome',
    title: 'Welcome to InterviewIQ',
    subtitle: 'Your AI-powered interview preparation platform',
    narration: 'Welcome to InterviewIQ — your AI-powered interview preparation platform grounded strictly in your real projects and credentials.',
    durationSec: 6,
    badge: 'Homepage & Core Actions',
  },
  {
    id: 2,
    chapter: '02 / Account Creation',
    title: 'Create Your Account',
    subtitle: 'Sign up using email or Google Sign-In',
    narration: 'Create your account using email or Google Sign-In with private session isolation for your confidential resume data.',
    durationSec: 6,
    badge: 'Secure Authentication',
  },
  {
    id: 3,
    chapter: '03 / Upload Resume',
    title: 'Upload Your Resume',
    subtitle: 'Upload PDF or DOCX to extract skills, projects, and history',
    narration: 'Start by uploading your resume. InterviewIQ analyzes your skills, projects, education, experience, and technologies.',
    durationSec: 6,
    badge: 'Entity Extraction Engine',
  },
  {
    id: 4,
    chapter: '04 / Resume Analysis',
    title: 'Structured Resume Intelligence',
    subtitle: '15 structured entities verified and categorized',
    narration: 'The platform creates a structured understanding of your resume so your interview can be personalized to what you actually built.',
    durationSec: 6,
    badge: 'Candidate DNA Profile',
  },
  {
    id: 5,
    chapter: '05 / ATS Analysis',
    title: 'Estimated ATS Compatibility',
    subtitle: 'Target role alignment & keyword gap detection',
    narration: 'You can compare your resume against a target job description and identify important gaps before applying.',
    durationSec: 7,
    badge: '84% Compatibility Computed',
  },
  {
    id: 6,
    chapter: '06 / Job Match',
    title: 'Resume → Job Description Match',
    subtitle: 'Detailed breakdown of matched, partial, and missing skills',
    narration: 'InterviewIQ shows how closely your resume matches the job you are targeting, highlighting matching and missing competencies.',
    durationSec: 6,
    badge: 'Gap Analysis',
  },
  {
    id: 7,
    chapter: '07 / Resume Improvement',
    title: 'Honest Resume Bullet Enhancement',
    subtitle: 'Google XYZ/STAR framing without fabricating unverified metrics',
    narration: 'InterviewIQ can improve clarity and keyword alignment without inventing experience, skills, projects, or achievements.',
    durationSec: 7,
    badge: 'Truth-Preserving Polish',
  },
  {
    id: 8,
    chapter: '08 / Configure Interview',
    title: 'Personalized Interview Setup',
    subtitle: 'Select interview type, difficulty, duration, and audio/text mode',
    narration: 'Configure your interview by selecting technical, project, HR, or full placement mode with custom difficulty and speech settings.',
    durationSec: 6,
    badge: 'Adaptive Configuration',
  },
  {
    id: 9,
    chapter: '09 / Realistic AI Interviewer',
    title: 'AI Question Grounded in Your Resume',
    subtitle: 'Resume-specific inquiry with pulsing circular audio waveform',
    narration: 'You mentioned building a MERN-stack application. Can you explain why you chose MongoDB for this project?',
    durationSec: 7,
    badge: 'Question 1 of 10',
  },
  {
    id: 10,
    chapter: '10 / Candidate Answer',
    title: 'Voice or Written Answer Stream',
    subtitle: 'Real-time speech-to-text processing & live audio monitoring',
    narration: 'Speak naturally or type your answer. InterviewIQ transitions smoothly between listening, speech processing, and deep analysis.',
    durationSec: 6,
    badge: 'Multimodal Interaction',
  },
  {
    id: 11,
    chapter: '11 / Dynamic Follow-Up',
    title: 'Intelligent Adaptive Follow-Ups',
    subtitle: 'Next question dynamically adapts to your exact response',
    narration: 'How would your database design change if the application had to support millions of users? InterviewIQ dynamically branches based on your answer.',
    durationSec: 7,
    badge: 'Branching State Machine',
  },
  {
    id: 12,
    chapter: '12 / Project Deep Dive',
    title: 'Architectural & Technical Deep Dive',
    subtitle: 'Probing database, APIs, authentication, concurrency, & scaling',
    narration: 'InterviewIQ dives deeply into architectural trade-offs, bug triage, security models, and production deployment considerations.',
    durationSec: 6,
    badge: 'Rigorous Engineering Loop',
  },
  {
    id: 13,
    chapter: '13 / Comprehensive Report',
    title: '7-Pillar Radar Diagnostic Report',
    subtitle: 'Detailed coaching: what was good, what was missing, how to improve',
    narration: 'Complete your interview and review a 7-pillar breakdown with granular coaching on communication, technical clarity, and resume alignment.',
    durationSec: 7,
    badge: 'Diagnostic Feedback',
  },
  {
    id: 14,
    chapter: '14 / Weak Area Practice',
    title: 'Targeted Weak Area Drills',
    subtitle: 'Turn diagnostic feedback into rapid 3-question targeted practice',
    narration: 'After the interview, InterviewIQ identifies weak areas like React or System Design and helps you practice them immediately.',
    durationSec: 6,
    badge: 'Adaptive Drills',
  },
  {
    id: 15,
    chapter: '15 / Ready to Begin',
    title: 'Your Resume. Your Job. Your Interview.',
    subtitle: 'Everything you need to master your next interview loop',
    narration: 'InterviewIQ gives you the realistic practice you need before facing actual hiring managers. Start preparing today.',
    durationSec: 6,
    badge: 'Start Preparing →',
  },
];

export const ProductDemoPlayer: React.FC<ProductDemoPlayerProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100%
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoFileAvailable, setVideoFileAvailable] = useState<boolean | null>(null);
  const [forceInteractiveMode, setForceInteractiveMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentScene = DEMO_SCENES[currentSceneIdx];

  // Check if mp4 file is physically playable
  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/videos/interviewiq-demo.mp4';
    video.oncanplay = () => {
      setVideoFileAvailable(true);
      setForceInteractiveMode(false);
    };
    video.onerror = () => {
      // Also try fallback demo.mp4
      const fallback = document.createElement('video');
      fallback.src = '/videos/demo.mp4';
      fallback.oncanplay = () => {
        setVideoFileAvailable(true);
        setForceInteractiveMode(false);
      };
      fallback.onerror = () => {
        setVideoFileAvailable(false);
        setForceInteractiveMode(true);
      };
    };
  }, []);

  // Web Speech API for realistic voice narration
  const speakNarration = (text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback silently
    }
  };

  // Scene timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    speakNarration(currentScene.narration);

    const stepMs = 50;
    const totalMs = (currentScene.durationSec * 1000) / playbackSpeed;
    const increment = (stepMs / totalMs) * 100;

    const interval = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev + increment >= 100) {
          // Transition to next scene
          if (currentSceneIdx < DEMO_SCENES.length - 1) {
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          } else {
            // End of demo
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentSceneIdx, playbackSpeed, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      if (currentSceneIdx === DEMO_SCENES.length - 1 && sceneProgress >= 100) {
        setCurrentSceneIdx(0);
        setSceneProgress(0);
      }
      setIsPlaying(true);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIdx < DEMO_SCENES.length - 1) {
      setCurrentSceneIdx((prev) => prev + 1);
      setSceneProgress(0);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx((prev) => prev - 1);
      setSceneProgress(0);
    }
  };

  const handleJumpToScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    setSceneProgress(0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Total elapsed and total overall time calculations
  const totalDuration = DEMO_SCENES.reduce((acc, s) => acc + s.durationSec, 0);
  const elapsedBeforeCurrent = DEMO_SCENES.slice(0, currentSceneIdx).reduce((acc, s) => acc + s.durationSec, 0);
  const currentElapsed = elapsedBeforeCurrent + (currentScene.durationSec * sceneProgress) / 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full">
      {/* Header bar above video */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-[#6B8E5A] animate-pulse" />
            Interactive Product Walkthrough
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A22] font-display">
            How InterviewIQ Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B756D] mt-0.5">
            From uploading your resume to completing a personalized AI interview — see how InterviewIQ helps you prepare.
          </p>
        </div>

        {/* Video Mode / File Info Pill */}
        <div className="flex items-center gap-2">
          {videoFileAvailable && (
            <button
              onClick={() => setForceInteractiveMode(!forceInteractiveMode)}
              className="text-xs px-3 py-1.5 rounded-full border border-[#6B8E5A]/40 bg-white text-[#344E41] hover:bg-[#E5EEDC] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Tv className="w-3.5 h-3.5 text-[#6B8E5A]" />
              {forceInteractiveMode ? 'Switch to MP4 Video' : 'Switch to Interactive Demo'}
            </button>
          )}

          {!videoFileAvailable && (
            <span className="text-[11px] px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
              Demo video coming soon • Interactive mode active
            </span>
          )}
        </div>
      </div>

      {/* 16:9 Video Canvas Frame */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#1F2A22] border-2 border-[rgba(107,142,90,0.3)] shadow-[0_25px_60px_-15px_rgba(52,78,65,0.25)] flex flex-col justify-between group select-none"
      >
        {/* If real MP4 file is chosen & available */}
        {!forceInteractiveMode && videoFileAvailable ? (
          <video
            ref={videoRef}
            src="/videos/interviewiq-demo.mp4"
            className="w-full h-full object-cover"
            controls
            autoPlay={isPlaying}
            playsInline
          />
        ) : (
          /* High-Fidelity 15-Scene Interactive SaaS Simulation */
          <div className="relative w-full h-full bg-gradient-to-br from-[#19221C] via-[#233328] to-[#19221C] flex flex-col justify-between p-4 sm:p-6 md:p-8 text-white">
            {/* Top Scene Navigation & Chapter Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold tracking-wide backdrop-blur-md border border-white/10">
                  {currentScene.chapter}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6B8E5A]/30 text-[#D4E2C5] text-[10px] font-medium border border-[#6B8E5A]/40">
                  {currentScene.badge}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#D4E2C5]">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(currentElapsed)} / {formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Central Stage Visualizer based on Scene */}
            <div className="my-auto z-10 w-full max-w-4xl mx-auto">
              {/* SCENE 1: Welcome & Landing Actions */}
              {currentScene.id === 1 && (
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B8E5A]/20 text-[#D4E2C5] text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#8FAF78]" />
                    AI Interview Preparation Engine
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                    Interview preparation <span className="text-[#8FAF78]">built around YOU.</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                    Replacing generic AI prompts with a rigorous, realistic career engine grounded strictly in your projects and resume.
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <div className="relative group">
                      <span className="absolute -inset-1 rounded-full bg-[#6B8E5A] blur-sm opacity-70 animate-pulse" />
                      <button
                        onClick={() => onNavigate('interview-setup')}
                        className="relative px-5 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-bold shadow-lg hover:bg-[#7FA56D] transition-all flex items-center gap-1.5"
                      >
                        Start Your Interview <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onNavigate('resume')}
                      className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
                    >
                      Analyze My Resume <FileText className="w-3.5 h-3.5 text-[#8FAF78]" />
                    </button>
                  </div>
                </div>
              )}

              {/* SCENE 2: Create Account / OAuth */}
              {currentScene.id === 2 && (
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/15 shadow-2xl space-y-3">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-white font-display">Create Your InterviewIQ Account</h4>
                    <p className="text-[11px] text-gray-300">Sign up using email or Google Sign-In</p>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full py-2 px-3 rounded-xl bg-white text-[#1F2A22] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Continue with Google
                    </button>
                  </div>
                  <div className="pt-1 flex items-center gap-1.5 text-[10px] text-[#D4E2C5] justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8FAF78]" />
                    <span>Strict session isolation — resume data stays 100% private</span>
                  </div>
                </div>
              )}

              {/* SCENE 3: Upload Resume */}
              {currentScene.id === 3 && (
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#6B8E5A]/30 border border-[#8FAF78]/40 flex items-center justify-center mx-auto text-[#8FAF78]">
                    <FileText className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-base font-bold text-white">Upload Your Resume (PDF or DOCX)</h4>
                  <div className="p-4 rounded-xl border border-dashed border-[#8FAF78]/60 bg-[#6B8E5A]/10 text-left">
                    <div className="flex items-center justify-between text-xs text-white mb-2">
                      <span className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#8FAF78]" /> Alex_Kumar_FullStack.pdf
                      </span>
                      <span className="text-[#8FAF78] text-[11px] font-bold">Processed</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-[#8FAF78] animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[11px] text-[#D4E2C5] block">
                    Extracting skills, projects, employment history, and technologies...
                  </span>
                </div>
              )}

              {/* SCENE 4: Structured Resume Analysis */}
              {currentScene.id === 4 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#8FAF78]" /> Candidate Profile Synthesized
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8FAF78]/20 text-[#D4E2C5]">
                      15 Entities Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/20 border border-white/10">
                      <span className="text-[10px] text-gray-400 block mb-1">Core Technologies</span>
                      <div className="flex flex-wrap gap-1">
                        {['React.js', 'Node.js', 'C++', 'MongoDB', '.NET', 'REST APIs'].map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-[#D4E2C5]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/20 border border-white/10">
                      <span className="text-[10px] text-gray-400 block mb-1">Primary Role</span>
                      <span className="font-semibold text-white block">Full Stack Developer</span>
                      <span className="text-[10px] text-gray-300">Tech Corp • 2+ Years Exp</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 5: ATS Compatibility */}
              {currentScene.id === 5 && (
                <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="text-center sm:border-r sm:border-white/10 sm:pr-4">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#8FAF78] text-white">
                      <span className="text-2xl font-black font-display">84%</span>
                      <span className="absolute -bottom-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#344E41] text-[#D4E2C5]">
                        ATS MATCH
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-300">Keyword Match:</span>
                      <span className="font-bold text-[#8FAF78]">20 / 20 pts (100%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-300">Skills Alignment:</span>
                      <span className="font-bold text-[#8FAF78]">18 / 20 pts (Good)</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-300">Job Title Match:</span>
                      <span className="font-bold text-amber-300">8 / 10 pts</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-300">Missing Target Keywords:</span>
                      <span className="text-gray-400">Vue.js, Docker</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 6: Job Match Gap Analysis */}
              {currentScene.id === 6 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#8FAF78]" /> Competency Match Breakdown
                    </span>
                    <span className="text-[10px] text-[#D4E2C5]">Role: Full Stack Engineer</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <span className="text-emerald-400 font-semibold block mb-1">✓ Matched Skills</span>
                      <span className="text-[11px] text-gray-200">React.js, Node.js, MongoDB, REST APIs, Git/GitHub, C++</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                      <span className="text-amber-400 font-semibold block mb-1">⚠ Partial / Missing</span>
                      <span className="text-[11px] text-gray-200">Vue.js (Related: React.js), Docker containerization</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 7: Honest Resume Improvement */}
              {currentScene.id === 7 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs">
                  <div className="text-center mb-1">
                    <span className="text-xs font-bold text-white uppercase tracking-wider text-[#8FAF78]">
                      Resume Bullet Improver (Google XYZ / STAR)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-left">
                    <span className="text-[10px] font-bold text-red-300 block mb-0.5">BEFORE (Original Bullet)</span>
                    <p className="text-[11px] text-gray-300">"Worked on building React components and creating backend APIs."</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-left">
                    <span className="text-[10px] font-bold text-emerald-300 block mb-0.5">AFTER (Architectural XYZ Format)</span>
                    <p className="text-[11px] text-white font-medium">
                      "Architected 12 modular React.js UI components and high-throughput Node.js REST APIs, reducing client response latency by 34% without fabricating metrics."
                    </p>
                  </div>
                </div>
              )}

              {/* SCENE 8: Start AI Interview Setup */}
              {currentScene.id === 8 && (
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs">
                  <h4 className="font-bold text-white text-center">Configure Your AI Interview</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">Interview Type</span>
                      <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                        <span className="p-1.5 rounded-lg bg-[#6B8E5A] text-white font-bold">Technical</span>
                        <span className="p-1.5 rounded-lg bg-white/10 text-gray-300">Project</span>
                        <span className="p-1.5 rounded-lg bg-white/10 text-gray-300">HR</span>
                        <span className="p-1.5 rounded-lg bg-white/10 text-gray-300">Placement</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-gray-400 block mb-1">Difficulty</span>
                        <span className="block p-1.5 rounded-lg bg-white/10 text-white font-semibold text-center border border-white/10">
                          Intermediate / Advanced
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1">Audio Mode</span>
                        <span className="block p-1.5 rounded-lg bg-[#6B8E5A] text-white font-semibold text-center">
                          Voice + Waveform
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 9: AI Interviewer Question */}
              {currentScene.id === 9 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-4 text-center">
                  <div className="flex justify-between items-center text-xs text-gray-400 border-b border-white/10 pb-2">
                    <span className="text-white font-semibold">Question 1 of 10</span>
                    <span className="text-[#8FAF78]">Technical & Project Deep Dive</span>
                  </div>

                  {/* Circular audio waveform & avatar */}
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-[#6B8E5A]/30 animate-ping opacity-60" />
                    <span className="absolute -inset-2 rounded-full border-2 border-[#8FAF78]/50 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-[#344E41] border border-[#8FAF78] flex items-center justify-center shadow-xl">
                      <Mic className="w-7 h-7 text-[#D4E2C5]" />
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-white font-semibold leading-relaxed px-4">
                    "You mentioned building a MERN-stack application. Can you explain why you chose MongoDB for this project?"
                  </p>
                </div>
              )}

              {/* SCENE 10: Candidate Answer Flow */}
              {currentScene.id === 10 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Live Speech Processing</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#6B8E5A] text-white font-bold text-[10px] animate-pulse">
                      Listening...
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-left">
                    <p className="text-gray-200 text-xs italic">
                      "We chose MongoDB because of our flexible JSON document model. The schema required frequent attribute iterations for user resume entities, and MongoDB allowed rapid prototyping without running complex migration scripts."
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#D4E2C5]">
                    <span>Audio level: optimal</span>
                    <span>Confidence: 96%</span>
                  </div>
                </div>
              )}

              {/* SCENE 11: Dynamic Follow-Up */}
              {currentScene.id === 11 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs text-left">
                  <div className="flex items-center gap-2 text-[#8FAF78] font-bold text-xs">
                    <Sparkles className="w-4 h-4" /> Adaptive Follow-Up Generated
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-gray-400 block mb-1">AI Evaluated Candidate Response:</span>
                    <p className="text-white font-medium text-xs">
                      "Great explanation of document flexibility. Now, how would your database design change if the application had to support millions of concurrent users?"
                    </p>
                  </div>
                  <span className="text-[10px] text-[#D4E2C5] block">
                    Branches dynamically instead of following static question scripts.
                  </span>
                </div>
              )}

              {/* SCENE 12: Project Deep Dive */}
              {currentScene.id === 12 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs">
                  <div className="text-center">
                    <span className="text-xs font-bold text-[#8FAF78] uppercase tracking-wider">
                      Architectural Drill Down
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">Full Loop Project Inquiries</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                    <span className="p-2 rounded-xl bg-white/10 border border-white/10">Database Indexing</span>
                    <span className="p-2 rounded-xl bg-white/10 border border-white/10">JWT vs OAuth</span>
                    <span className="p-2 rounded-xl bg-white/10 border border-white/10">REST API Caching</span>
                    <span className="p-2 rounded-xl bg-white/10 border border-white/10">Concurrency & Locks</span>
                    <span className="p-2 rounded-xl bg-white/10 border border-white/10">Production Bugs</span>
                    <span className="p-2 rounded-xl bg-white/10 border border-white/10">CI/CD & Docker</span>
                  </div>
                </div>
              )}

              {/* SCENE 13: Comprehensive Interview Report */}
              {currentScene.id === 13 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-[#8FAF78]" /> Diagnostic Interview Report
                    </span>
                    <span className="font-extrabold text-[#8FAF78] text-sm">86 / 100</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-black/20">
                      <span className="text-gray-400 block text-[10px]">Technical Accuracy</span>
                      <span className="font-bold text-white">88% (Strong)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/20">
                      <span className="text-gray-400 block text-[10px]">Project Understanding</span>
                      <span className="font-bold text-white">92% (Exceptional)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/20">
                      <span className="text-gray-400 block text-[10px]">Concept Clarity</span>
                      <span className="font-bold text-white">84% (Solid)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/20">
                      <span className="text-gray-400 block text-[10px]">Communication</span>
                      <span className="font-bold text-white">90% (Articulate)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 14: Practice Weak Areas */}
              {currentScene.id === 14 && (
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-3 text-xs text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" /> Practice My Weak Areas
                    </span>
                    <span className="text-[10px] text-gray-300">Generated from report</span>
                  </div>
                  <div className="space-y-1.5">
                    {['Database Scaling & Sharding', 'React Concurrent Mode', 'DSA Graph Traversal'].map((w, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-gray-200">{w}</span>
                        <button
                          onClick={() => onNavigate('practice')}
                          className="px-2.5 py-1 rounded-lg bg-[#6B8E5A] text-white text-[10px] font-bold hover:bg-[#7FA56D] transition-all"
                        >
                          Practice Drill →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCENE 15: Final CTA */}
              {currentScene.id === 15 && (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-3xl bg-[#6B8E5A] border-2 border-[#8FAF78] flex items-center justify-center mx-auto shadow-2xl">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                    Your Resume. Your Job. <br />
                    <span className="text-[#8FAF78]">Your Interview.</span>
                  </h3>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('interview-setup')}
                      className="px-8 py-3.5 rounded-full bg-[#6B8E5A] hover:bg-[#7FA56D] text-white text-sm font-bold shadow-2xl transition-all inline-flex items-center gap-2 transform hover:scale-105"
                    >
                      Start Preparing Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Subtitles & Closed Captions Bar */}
            {showCaptions && (
              <div className="z-10 max-w-2xl mx-auto px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-center text-xs text-gray-200">
                <span className="text-[#8FAF78] font-bold mr-1">Narration:</span>
                "{currentScene.narration}"
              </div>
            )}
          </div>
        )}

        {/* Video Player Control Bar */}
        <div className="z-20 w-full p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2">
          {/* Chapter / Scene timeline track with clickable segments */}
          <div className="flex items-center gap-1 w-full h-1.5 cursor-pointer">
            {DEMO_SCENES.map((scene, idx) => {
              const isPast = idx < currentSceneIdx;
              const isCurrent = idx === currentSceneIdx;
              const fillPct = isPast ? 100 : isCurrent ? sceneProgress : 0;

              return (
                <div
                  key={scene.id}
                  onClick={() => handleJumpToScene(idx)}
                  title={`${scene.chapter}: ${scene.title}`}
                  className="flex-1 h-full bg-white/20 rounded-full overflow-hidden relative group/seg"
                >
                  <div
                    className="h-full bg-[#8FAF78] transition-all duration-100"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom row of buttons & toggles */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevScene}
                disabled={currentSceneIdx === 0}
                className="p-1 hover:text-[#8FAF78] disabled:opacity-30 transition-colors"
                title="Previous Scene"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-[#6B8E5A] hover:bg-[#7FA56D] text-white flex items-center justify-center transition-all shadow-md"
                title={isPlaying ? 'Pause Demo' : 'Play Demo'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleNextScene}
                disabled={currentSceneIdx === DEMO_SCENES.length - 1}
                className="p-1 hover:text-[#8FAF78] disabled:opacity-30 transition-colors"
                title="Next Scene"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 hover:text-[#8FAF78] transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-[11px] text-gray-300 hidden sm:inline">
                {currentScene.title}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                  showCaptions
                    ? 'bg-[#6B8E5A] text-white border-[#6B8E5A]'
                    : 'bg-white/10 text-gray-300 border-white/20'
                }`}
                title="Toggle Subtitles / Captions"
              >
                CC
              </button>

              <button
                onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 hover:text-white border border-white/15"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1 hover:text-[#8FAF78] transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters list underneath video */}
      <div className="mt-6 pt-6 border-t border-[rgba(52,78,65,0.08)]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B8E5A] block mb-3">
          15 Guided Chapters • Jump Directly to Any Step
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {DEMO_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => handleJumpToScene(idx)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                idx === currentSceneIdx
                  ? 'bg-white border-[#6B8E5A] shadow-sm text-[#344E41] font-bold ring-2 ring-[#6B8E5A]/20'
                  : 'bg-white/60 border-[rgba(52,78,65,0.08)] text-[#6B756D] hover:bg-white hover:text-[#1F2A22]'
              }`}
            >
              <span className="text-[10px] text-[#6B8E5A] block font-mono">Step {scene.id < 10 ? `0${scene.id}` : scene.id}</span>
              <span className="truncate block mt-0.5">{scene.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
