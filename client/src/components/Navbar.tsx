import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, authState, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = authState === 'authenticated' && !!user;

  // Track scroll position for subtle background blur & border elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#navbar-mobile-toggle')
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
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

  // Lock background scroll when mobile menu is open
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

  // Public Nav Items (Home | About | How It Works | Opportunities)
  const publicNav = [
    { id: 'landing', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'how_it_works', label: 'How It Works' },
    { id: 'opportunities', label: 'Opportunities' },
  ];

  // Authenticated Nav Items (Dashboard | Resume | Opportunities | Interview | Applications)
  const authNav = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'resume', label: 'Resume' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'interview', label: 'Interview' },
    { id: 'applications', label: 'Applications' },
  ];

  const handleNavClick = (id: string) => {
    setProfileDropdownOpen(false);
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
    setMobileMenuOpen(false);
    setCurrentTab('landing');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full h-16 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-white/70 backdrop-blur-sm border-b border-black/[0.03]'
        }`}
      >
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
          >
            <span className="text-[17px] font-bold tracking-tight text-[#1F2A22] group-hover:text-[#6B8E5A] transition-colors">
              Interview<span className="text-[#6B8E5A]">IQ</span>
            </span>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {!isAuthenticated ? (
              // Public Nav: Home | About | How It Works | Opportunities
              publicNav.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative text-[13px] tracking-tight transition-colors py-1 ${
                      isActive
                        ? 'text-[#1F2A22] font-semibold'
                        : 'text-[#6B756D] hover:text-[#1F2A22] font-normal'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#6B8E5A]" />
                    )}
                  </button>
                );
              })
            ) : (
              // Authenticated Nav: Dashboard | Resume | Opportunities | Interview | Applications
              authNav.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative text-[13px] tracking-tight transition-colors py-1 ${
                      isActive
                        ? 'text-[#1F2A22] font-semibold'
                        : 'text-[#6B756D] hover:text-[#1F2A22] font-normal'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#6B8E5A]" />
                    )}
                  </button>
                );
              })
            )}
          </nav>

          {/* Right Action Area (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              // Public Actions: Sign In | Get Started
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="text-[13px] font-medium text-[#1F2A22] hover:text-[#6B8E5A] px-2.5 py-1.5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentTab('signup')}
                  className="text-[13px] font-medium text-white bg-[#344E41] hover:bg-[#25392F] px-4 py-1.5 rounded-full transition-all shadow-2xs"
                >
                  Get Started
                </button>
              </div>
            ) : (
              // Authenticated Profile Area
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#1F2A22] hover:text-[#6B8E5A] py-1 px-2 rounded-full transition-colors"
                >
                  <span>Profile</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#6B756D] transition-transform duration-150 ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl border border-black/[0.08] shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-[#1F2A22] truncate">{user.fullName}</p>
                      <p className="text-[11px] text-[#6B756D] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('settings')}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-[#1F2A22] hover:bg-black/[0.03] flex items-center gap-2 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#6B756D]" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleNavClick('settings')}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-[#1F2A22] hover:bg-black/[0.03] flex items-center gap-2 transition-colors"
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
                        className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle (375px, 390px, 430px) */}
          <div className="md:hidden flex items-center">
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-1.5 text-[#1F2A22] hover:text-[#6B8E5A] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/25 backdrop-blur-xs flex flex-col justify-start">
          <div
            ref={mobileMenuRef}
            className="w-full bg-white/98 backdrop-blur-xl border-b border-black/[0.06] shadow-xl px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150"
          >
            <div className="flex flex-col gap-1">
              {!isAuthenticated ? (
                // Public Mobile Menu
                publicNav.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`text-left py-2.5 text-sm font-medium tracking-tight transition-colors ${
                        isActive ? 'text-[#1F2A22] font-bold' : 'text-[#6B756D]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              ) : (
                // Authenticated Mobile Menu
                authNav.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`text-left py-2.5 text-sm font-medium tracking-tight transition-colors ${
                        isActive ? 'text-[#1F2A22] font-bold' : 'text-[#6B756D]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('login');
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-[#1F2A22] hover:text-[#6B8E5A]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCurrentTab('signup');
                    }}
                    className="w-full py-2.5 rounded-full bg-[#344E41] text-white text-xs font-semibold text-center hover:bg-[#25392F] shadow-xs"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full py-2 text-left text-xs font-medium text-[#1F2A22] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#6B756D]" />
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full py-2 text-left text-xs font-medium text-[#1F2A22] flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#6B756D]" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      setCurrentTab('landing');
                    }}
                    className="w-full py-2 text-left text-xs font-medium text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Dismiss backdrop */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
