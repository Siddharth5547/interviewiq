import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Target,
  Compass,
  UserCheck,
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
      badge: 'Step 1 of 4: Resume Ingestion',
      icon: Upload,
      title: 'Upload Your Resume',
      subtitle:
        'Upload your existing resume in PDF, DOCX, or TXT format. InterviewIQ extracts your real technical stack, projects, education, and credentials without hallucinations.',
      points: [
        'Validated extraction of 14+ technical domains and projects.',
        'Zero-fabrication guardrails: missing fields remain missing.',
        'Preserves exact dates, titles, and verified metrics.',
      ],
      actionText: 'Next: Target Role',
      targetTab: 'resume',
    },
    {
      badge: 'Step 2 of 4: Role Calibration',
      icon: Target,
      title: 'Choose Your Target Role',
      subtitle:
        'Define the role you are aiming for (e.g., Software Engineer, Full Stack Developer, Backend Specialist, or Engineering Intern).',
      points: [
        'Calibrates ATS keyword expectations against industry standards.',
        'Sets baseline technical question difficulty and topics.',
        'Customizable anytime from Account Settings.',
      ],
      actionText: 'Next: Opportunities & JD',
      targetTab: 'settings',
    },
    {
      badge: 'Step 3 of 4: Target Opportunity',
      icon: Compass,
      title: 'Add a Job Description or Explore Opportunities',
      subtitle:
        'Paste an employer job description for instant ATS compatibility scoring, or explore verified live job and internship listings matching your profile.',
      points: [
        'Deterministic keyword matcher safe for C++, .NET, Node.js, and REST APIs.',
        'Discover live tech opportunities with estimated resume match percentages.',
        'Track external applications across our 8-stage recruitment pipeline.',
      ],
      actionText: 'Next: Review Profile',
      targetTab: 'opportunities',
    },
    {
      badge: 'Step 4 of 4: Career Blueprint',
      icon: UserCheck,
      title: 'Review Your Profile & Start Preparing',
      subtitle:
        'Your candidate profile is ready. You can now launch adaptive AI mock interviews, optimize resume bullets with Google STAR/XYZ, and track your progress.',
      points: [
        'Personalized AI interviews testing what you actually built.',
        'Dynamic follow-ups that scale with your answer depth.',
        'Diagnostic reporting with respectful paper-vs-live reality checks.',
      ],
      actionText: 'Start Preparing',
      targetTab: 'dashboard',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
      onNavigate('resume');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    onNavigate('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1F2A22]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[rgba(52,78,65,0.14)] shadow-float max-w-xl w-full p-6 sm:p-8 relative overflow-hidden animate-fade-in space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6B756D] hover:text-[#1F2A22] hover:bg-[#F4F7F1] transition-colors"
          title="Close walkthrough"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#6B8E5A]" />
            First-Time Setup
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2A22] font-display">
            Welcome to InterviewIQ — let's get you ready for your next opportunity
          </h2>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-[#344E41]'
                  : idx < currentStep
                  ? 'bg-[#6B8E5A]'
                  : 'bg-[#E5EEDC]'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEDC] text-[#344E41] flex items-center justify-center flex-shrink-0">
              <StepIcon className="w-6 h-6 text-[#6B8E5A]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B8E5A]">
                {step.badge}
              </span>
              <h3 className="text-lg font-bold text-[#1F2A22] leading-tight">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#6B756D] leading-relaxed">
            {step.subtitle}
          </p>

          <div className="p-4 bg-[#F4F7F1] rounded-2xl border border-[rgba(52,78,65,0.06)] space-y-2.5">
            {step.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#1F2A22]">
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[rgba(52,78,65,0.08)]">
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-[#6B756D] hover:text-[#1F2A22] transition-colors"
          >
            Skip for now
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-full border border-[rgba(52,78,65,0.15)] text-[#344E41] text-xs font-bold hover:bg-[#F4F7F1] transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-[#344E41] text-white text-xs font-bold hover:bg-[#4B6B5B] transition-all shadow-sm flex items-center gap-1.5"
            >
              {step.actionText} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
