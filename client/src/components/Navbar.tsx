import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  ChevronDown,
  Bell,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, authState, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = authState === 'authenticated' && !!user;

  // Track scroll position for sticky background & shadow enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Public Nav Items (Order: Home -> About -> How It Works -> Opportunities)
  const publicNav = [
    { id: 'landing', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'how_it_works', label: 'How It Works' },
    { id: 'opportunities', label: 'Opportunities' },
  ];

  // Authenticated Nav Items (Journey: Dashboard -> Resume -> ATS/Job Match -> Opportunities -> Applications -> Interview)
  const authNav = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'resume', label: 'Resume' },
    { id: 'ats', label: 'ATS/Job Match' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'applications', label: 'Applications' },
    { id: 'interview', label: 'Interview' },
  ];

  const handleNavClick = (id: string) => {
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);

    if (id === 'how_it_works') {
      if (currentTab !== 'landing') {
        setCurrentTab('landing');
        setTimeout(() => {
          const el = document.getElementById('how-it-works-section') || document.getElementById('features-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById('how-it-works-section') || document.getElementById('features-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setCurrentTab(id);
  };

  const handleLogoClick = () => {
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);
    if (isAuthenticated) {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('landing');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-[#344E41]/10 shadow-[0_2px_12px_rgba(52,78,65,0.06)] py-3'
            : 'bg-[#F4F7F1]/80 backdrop-blur-sm border-b border-[#344E41]/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            {/* Logo */}
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#344E41] flex items-center justify-center text-white shadow-xs group-hover:bg-[#6B8E5A] transition-colors">
                <Sparkles className="w-4 h-4 text-[#D4E2C5]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#1F2A22]">
                Interview<span className="text-[#6B8E5A]">IQ</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {!isAuthenticated ? (
                // Public Navigation
                publicNav.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 ${
                        isActive
                          ? 'bg-[#E5EEDC] text-[#344E41]'
                          : 'text-[#6B756D] hover:text-[#1F2A22] hover:bg-black/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              ) : (
                // Authenticated Navigation
                authNav.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 ${
                        isActive
                          ? 'bg-[#E5EEDC] text-[#344E41]'
                          : 'text-[#6B756D] hover:text-[#1F2A22] hover:bg-black/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              )}
            </nav>

            {/* Desktop Right CTAs */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                // Public CTAs
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('login')}
                    className="px-4 py-1.5 text-xs font-semibold text-[#1F2A22] hover:text-[#344E41] hover:bg-black/5 rounded-full transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setCurrentTab('signup')}
                    className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[#6B8E5A] hover:bg-[#344E41] text-white shadow-xs transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                // Authenticated Controls
                <div className="flex items-center gap-2.5">
                  {/* Notifications Icon */}
                  <div className="relative" ref={notificationsRef}>
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      title="Notifications"
                      className="p-2 rounded-full text-[#6B756D] hover:text-[#1F2A22] hover:bg-black/5 transition-colors relative"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6B8E5A] ring-2 ring-white" />
                    </button>

                    {/* Notifications Dropdown */}
                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#344E41]/10 shadow-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                          <span className="text-xs font-bold text-[#1F2A22]">Notifications</span>
                          <span className="text-[10px] text-[#6B8E5A] font-semibold">All caught up</span>
                        </div>
                        <div className="space-y-2">
                          <div className="p-2 rounded-xl bg-[#F4F7F1] flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-[#1F2A22]">Platform Active</p>
                              <p className="text-[11px] text-[#6B756D]">Your AI Career Hub is fully calibrated.</p>
                            </div>
                          </div>
                          <div className="p-2 rounded-xl bg-gray-50 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#344E41] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-[#1F2A22]">ATS Engine Ready</p>
                              <p className="text-[11px] text-[#6B756D]">Upload your resume for real-time scoring.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 py-1 px-2.5 rounded-full border border-[#344E41]/15 bg-white hover:bg-[#F4F7F1] transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#344E41] text-white flex items-center justify-center font-bold text-[10px]">
                        {(user.fullName || 'User').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-[#1F2A22] max-w-[100px] truncate">
                        {user.fullName?.split(' ')[0] || 'Profile'}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#6B756D] transition-transform duration-200 ${
                          profileDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#344E41]/10 shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-[#1F2A22] truncate">{user.fullName}</p>
                          <p className="text-[11px] text-[#6B756D] truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={() => handleNavClick('settings')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-[#1F2A22] hover:bg-[#F4F7F1] flex items-center gap-2.5 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-[#6B756D]" />
                            My Profile
                          </button>
                          <button
                            onClick={() => handleNavClick('settings')}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-[#1F2A22] hover:bg-[#F4F7F1] flex items-center gap-2.5 transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5 text-[#6B756D]" />
                            Settings
                          </button>
                        </div>

                        <div className="pt-1 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              logout();
                              setCurrentTab('landing');
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-xl text-[#344E41] hover:bg-[#E5EEDC]/60 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Responsive across 375px, 390px, 430px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-black/40 backdrop-blur-xs">
          {/* Backdrop click to dismiss */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />

          {/* Menu Drawer Content */}
          <div
            ref={mobileMenuRef}
            className="bg-white border-t border-[#344E41]/10 rounded-t-3xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#344E41] flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4E2C5]" />
                </div>
                <span className="text-base font-bold text-[#1F2A22]">InterviewIQ</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-[#6B756D] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-1">
              {!isAuthenticated ? (
                // Public Mobile Menu: Home, About, How It Works, Opportunities
                publicNav.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-[#E5EEDC] text-[#344E41]' : 'text-[#1F2A22] hover:bg-[#F4F7F1]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              ) : (
                // Authenticated Mobile Menu: Dashboard, Resume, ATS/Job Match, Opportunities, Applications, Interview
                authNav.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-[#E5EEDC] text-[#344E41]' : 'text-[#1F2A22] hover:bg-[#F4F7F1]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              )}
            </div>

            {/* Mobile Footer CTAs / Auth State */}
            <div className="pt-3 border-t border-gray-100">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('login');
                    }}
                    className="w-full py-2.5 rounded-full border border-[#344E41]/20 text-xs font-semibold text-[#1F2A22] text-center hover:bg-[#F4F7F1]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('signup');
                    }}
                    className="w-full py-2.5 rounded-full bg-[#6B8E5A] text-white text-xs font-semibold text-center hover:bg-[#344E41]"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="px-2 py-1 flex items-center justify-between text-xs text-[#6B756D]">
                    <span className="font-semibold text-[#1F2A22]">{user.fullName}</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavClick('settings')}
                      className="py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-[#1F2A22] flex items-center justify-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-[#6B756D]" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                        setCurrentTab('landing');
                      }}
                      className="py-2 px-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
