import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Search,
  Mic,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'Welcome to InterviewIQ',
      icon: Sparkles,
      title: 'Your Resume. Your Job. Your Interview.',
      subtitle:
        'A comprehensive AI-powered career preparation engine that aligns your actual verified experience with target job descriptions.',
      points: [
        'Objective ATS keyword alignment without artificial fluff.',
        'Zero-fabrication resume rewriting powered by Google XYZ formula.',
        'Personalized mock interviews calibrated to your exact experience.',
      ],
      actionText: 'Get Started',
    },
    {
      badge: 'Step 1: Intelligent Resume Extraction',
      icon: FileText,
      title: 'Structured Skills & Experience Parsing',
      subtitle:
        'Upload your PDF resume or paste raw text. InterviewIQ parses your technical skills, work history, projects, and education into verified entities.',
      points: [
        'Categorizes technologies into frontend, backend, database, and devops.',
        'Preserves your genuine metrics and timelines.',
        'Editable at any time in the Resume Workspace.',
      ],
      actionText: 'Next: ATS Matching',
    },
    {
      badge: 'Step 2: ATS & Job Matching',
      icon: Search,
      title: 'Targeted Gap Analysis Against Any Job',
      subtitle:
        'Paste any target job description. The engine computes an instant ATS readiness score and identifies critical keyword gaps.',
      points: [
        'Categorized match scores for skills, experience, and education.',
        'Identifies missing keywords that you actually know but missed writing.',
        'Realistic simulation of enterprise recruiting software.',
      ],
      actionText: 'Next: Resume Improver',
    },
    {
      badge: 'Step 3: Grounded XYZ Rewrites',
      icon: ShieldCheck,
      title: 'Zero-Fabrication Bullet Optimization',
      subtitle:
        'Elevate weak resume bullets into high-impact accomplishments using the Google XYZ STAR formula: "Accomplished [X], as measured by [Y], by doing [Z]".',
      points: [
        'Strict guardrails against inventing roles, degrees, or false claims.',
        'Interactive before/after diffs with point-by-point score deltas.',
        '1-click replacement into your active resume.',
      ],
      actionText: 'Next: AI Mock Interviews',
    },
    {
      badge: 'Step 4: Adaptive AI Mock Room',
      icon: Mic,
      title: 'Real-Time Dynamic Voice & Technical Probing',
      subtitle:
        'Step into the simulated interview room. The AI interviewer tests your genuine ownership, asks adaptive follow-ups, and delivers an executive diagnostic report.',
      points: [
        'Live circular audio avatar with real-time waveform visualization.',
        'Resume Reality Check: evaluates paper claims vs verbal depth.',
        '7-Pillar Competency Radar with targeted drill recommendations.',
      ],
      actionText: 'Launch Dashboard',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
      onNavigate('dashboard');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-[#344E41]/10 shadow-2xl max-w-lg w-full p-8 sm:p-10 relative overflow-hidden space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#F4F7F1] flex items-center justify-center text-[#6B756D] hover:text-[#344E41] hover:bg-[#E5EEDC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'w-8 bg-[#6B8E5A]'
                  : idx < currentStep
                  ? 'w-4 bg-[#8FAF78]'
                  : 'w-4 bg-[#E5EEDC]'
              }`}
            />
          ))}
          <span className="text-[11px] font-semibold text-[#6B756D] ml-auto">
            {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-semibold">
            <StepIcon className="w-3.5 h-3.5 text-[#6B8E5A]" />
            <span>{step.badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#344E41] leading-snug">
            {step.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed font-normal">
            {step.subtitle}
          </p>

          <div className="pt-2 space-y-2.5">
            {step.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-[#1F2A22]">
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-[#344E41]/10 flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B756D] hover:text-[#344E41] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs font-semibold text-[#6B756D] hover:text-[#344E41] transition-colors"
            >
              Skip Tour
            </button>
          )}

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold hover:bg-[#5A7A4A] transition-all shadow-sm"
          >
            <span>{step.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
