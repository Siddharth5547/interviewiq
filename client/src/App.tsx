import React, { useState, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Interview } from './types/index.js';
import { Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

// Dynamic route code-splitting for optimal initial load speed
const LandingPage = React.lazy(() => import('./pages/LandingPage.js').then((m) => ({ default: m.LandingPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage.js').then((m) => ({ default: m.AboutPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage.js').then((m) => ({ default: m.SettingsPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage.js').then((m) => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('./pages/SignupPage.js').then((m) => ({ default: m.SignupPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage.js').then((m) => ({ default: m.DashboardPage })));
const ResumePage = React.lazy(() => import('./pages/ResumePage.js').then((m) => ({ default: m.ResumePage })));
const ATSPage = React.lazy(() => import('./pages/ATSPage.js').then((m) => ({ default: m.ATSPage })));
const ResumeImproverPage = React.lazy(() => import('./pages/ResumeImproverPage.js').then((m) => ({ default: m.ResumeImproverPage })));
const InterviewSetupPage = React.lazy(() => import('./pages/InterviewSetupPage.js').then((m) => ({ default: m.InterviewSetupPage })));
const InterviewRoomPage = React.lazy(() => import('./pages/InterviewRoomPage.js').then((m) => ({ default: m.InterviewRoomPage })));
const InterviewReportPage = React.lazy(() => import('./pages/InterviewReportPage.js').then((m) => ({ default: m.InterviewReportPage })));
const PracticePage = React.lazy(() => import('./pages/PracticePage.js').then((m) => ({ default: m.PracticePage })));
const HistoryPage = React.lazy(() => import('./pages/HistoryPage.js').then((m) => ({ default: m.HistoryPage })));
const OpportunitiesPage = React.lazy(() => import('./pages/OpportunitiesPage.js').then((m) => ({ default: m.OpportunitiesPage })));
const ApplicationsPage = React.lazy(() => import('./pages/ApplicationsPage.js').then((m) => ({ default: m.ApplicationsPage })));
const OnboardingModal = React.lazy(() => import('./components/OnboardingModal.js').then((m) => ({ default: m.OnboardingModal })));

const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 px-4">
    <div className="w-10 h-10 rounded-2xl bg-[#344E41] text-white flex items-center justify-center animate-pulse">
      <Sparkles className="w-5 h-5 text-[#8FAF78]" />
    </div>
    <p className="text-xs font-medium text-[#344E41]/70 animate-pulse">Loading experience...</p>
  </div>
);


const AppContent: React.FC = () => {
  const { user, authState } = useAuth();
  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const validTabs = [
        'landing',
        'about',
        'settings',
        'login',
        'signup',
        'dashboard',
        'resume',
        'ats',
        'improve',
        'interview',
        'practice',
        'history',
        'opportunities',
        'applications',
      ];
      if (path === 'auth/callback') return 'dashboard';
      if (validTabs.includes(path)) return path;
    }
    return 'landing';
  };

  const protectedTabs = [
    'dashboard',
    'settings',
    'applications',
    'history',
    'interview_room',
    'interview_report',
    'practice',
  ];

  const [currentTab, setCurrentTabState] = useState<string>(getInitialTab);
  const [activeInterview, setActiveInterview] = useState<Interview | null>(null);
  const [selectedReportInterview, setSelectedReportInterview] = useState<Interview | null>(null);
  const [practiceTopic, setPracticeTopic] = useState<string | undefined>(undefined);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const setCurrentTab = (tab: string) => {
    setCurrentTabState(tab);
    if (typeof window !== 'undefined') {
      const newUrl = tab === 'landing' ? '/' : `/${tab}`;
      if (window.location.pathname !== newUrl) {
        window.history.pushState({ tab }, '', newUrl);
      }
    }
  };

  // Protected route enforcement & auth loop prevention
  React.useEffect(() => {
    if (authState === 'logged out' || authState === 'authentication failed') {
      if (protectedTabs.includes(currentTab)) {
        setCurrentTab('login');
      }
    } else if (authState === 'authenticated') {
      if (currentTab === 'login' || currentTab === 'signup') {
        setCurrentTab('dashboard');
      }
    }
  }, [authState, currentTab]);

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      setCurrentTabState(path || 'landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  const handleStartInterview = (interview: Interview) => {
    setActiveInterview(interview);
    setCurrentTab('interview_room');
  };

  const handleCompleteInterview = (completedInterview: Interview) => {
    setActiveInterview(completedInterview);
    setSelectedReportInterview(completedInterview);
    setCurrentTab('interview_report');
  };

  const handleOpenReportFromHistory = (interview: Interview) => {
    setSelectedReportInterview(interview);
    setCurrentTab('interview_report');
  };

  const handlePracticeTopicFromReport = (topic: string) => {
    setPracticeTopic(topic);
    setCurrentTab('practice');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F1] text-[#1F2A22] flex flex-col font-sans selection:bg-[#D4E2C5] selection:text-[#344E41]">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {authState === 'authenticating' && protectedTabs.includes(currentTab) ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4">
            <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-[#8FAF78]" />
            </div>
            <p className="text-sm font-medium text-[#344E41] animate-pulse">
              Verifying your session...
            </p>
          </div>
        ) : (
          <Suspense fallback={<PageLoader />}>
            {currentTab === 'landing' && <LandingPage onNavigate={setCurrentTab} />}
            {currentTab === 'about' && <AboutPage onNavigate={setCurrentTab} />}
            {currentTab === 'settings' && <SettingsPage onNavigate={setCurrentTab} />}
            {currentTab === 'login' && <LoginPage onNavigate={setCurrentTab} />}
            {currentTab === 'signup' && <SignupPage onNavigate={setCurrentTab} />}
            {currentTab === 'dashboard' && <DashboardPage onNavigate={setCurrentTab} />}
            {currentTab === 'resume' && <ResumePage onNavigate={setCurrentTab} />}
            {currentTab === 'ats' && <ATSPage onNavigate={setCurrentTab} />}
            {currentTab === 'improve' && <ResumeImproverPage onNavigate={setCurrentTab} />}
            {currentTab === 'interview' && (
              <InterviewSetupPage onStart={handleStartInterview} onNavigate={setCurrentTab} />
            )}
            {currentTab === 'interview_room' && activeInterview && (
              <InterviewRoomPage
                interview={activeInterview}
                onComplete={handleCompleteInterview}
                onExit={() => setCurrentTab('interview')}
              />
            )}
            {currentTab === 'interview_report' && selectedReportInterview && (
              <InterviewReportPage
                interview={selectedReportInterview}
                onNavigate={setCurrentTab}
                onPracticeTopic={handlePracticeTopicFromReport}
              />
            )}
            {currentTab === 'practice' && (
              <PracticePage initialTopic={practiceTopic} onNavigate={setCurrentTab} />
            )}
            {currentTab === 'history' && (
              <HistoryPage
                onOpenReport={handleOpenReportFromHistory}
                onNavigate={setCurrentTab}
              />
            )}
            {currentTab === 'opportunities' && (
              <OpportunitiesPage onNavigate={setCurrentTab} />
            )}
            {currentTab === 'applications' && (
              <ApplicationsPage onNavigate={setCurrentTab} />
            )}
          </Suspense>
        )}
      </main>

      {/* Onboarding Guided Modal */}
      <Suspense fallback={null}>
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onNavigate={setCurrentTab}
        />
      </Suspense>



      {/* Premium Sage Global Footer */}
      <footer className="bg-white border-t border-[#344E41]/10 py-12 text-[#6B756D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#344E41]/10">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#344E41] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-[#8FAF78]" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-[#1F2A22]">
                  Interview<span className="text-[#6B8E5A]">IQ</span>
                </span>
              </div>
              <p className="text-xs text-[#6B756D] max-w-sm leading-relaxed">
                The career preparation platform that analyzes your resume, calculates genuine ATS compatibility against target jobs, and conducts adaptive AI mock interviews based on your verified experience.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#6B8E5A] font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strict Zero-Fabrication Guardrails Active</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[#344E41] text-[11px]">
                Product Features
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentTab('opportunities')} className="hover:text-[#1F2A22] transition-colors">
                    Opportunity Discovery
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('applications')} className="hover:text-[#1F2A22] transition-colors">
                    Application Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('ats')} className="hover:text-[#1F2A22] transition-colors">
                    ATS & Job Compatibility
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('improve')} className="hover:text-[#1F2A22] transition-colors">
                    Grounded Resume Improver
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('interview')} className="hover:text-[#1F2A22] transition-colors">
                    Adaptive AI Mock Room
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('practice')} className="hover:text-[#1F2A22] transition-colors">
                    Weak-Area Drill Engine
                  </button>
                </li>
              </ul>
            </div>

            {/* Platform & About */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[#344E41] text-[11px]">
                Company & Platform
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setCurrentTab('about')} className="hover:text-[#1F2A22] transition-colors">
                    About InterviewIQ
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('dashboard')} className="hover:text-[#1F2A22] transition-colors">
                    Candidate Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('settings')} className="hover:text-[#1F2A22] transition-colors">
                    Account & Preferences
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowOnboarding(true)} className="hover:text-[#1F2A22] transition-colors">
                    Launch Interactive Tour
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#344E41]">InterviewIQ</span>
              <span>—</span>
              <span>Your Resume. Your Job. Your Interview.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Simulated Practice Environment</span>
              <span>•</span>
              <span>Production Build v2.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
