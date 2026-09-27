import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Sparkles,
  LogOut,
  Menu,
  X,
  ArrowRight,
  User,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNav = [
    { id: 'landing', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'resume', label: 'Resume' },
    { id: 'interview', label: 'Interview' },
  ];

  const authNav = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'applications', label: 'Applications' },
    { id: 'resume', label: 'Resume' },
    { id: 'interview', label: 'Interview' },
    { id: 'about', label: 'About' },
  ];

  const mainNav = user ? authNav : publicNav;



  const handleNavClick = (id: string) => {
    if (id === 'features_section') {
      if (currentTab !== 'landing') {
        setCurrentTab('landing');
        setTimeout(() => {
          document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (id === 'how_it_works') {
      if (currentTab !== 'landing') {
        setCurrentTab('landing');
        setTimeout(() => {
          document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setCurrentTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all">
      <header className="bg-white/85 backdrop-blur-xl border border-[rgba(52,78,65,0.12)] rounded-full px-5 sm:px-6 py-3 shadow-[0_8px_30px_rgb(52,78,65,0.06)] flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full bg-[#344E41] flex items-center justify-center text-white shadow-sm group-hover:bg-[#6B8E5A] transition-colors">
            <Sparkles className="w-4 h-4 text-[#D4E2C5]" />
          </div>
          <div className="flex items-center">
            <span className="text-lg font-extrabold tracking-tight text-[#1F2A22] font-display">
              Interview<span className="text-[#6B8E5A]">IQ</span>
            </span>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B756D]">
          {mainNav.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors hover:text-[#1F2A22] ${
                  isActive ? 'text-[#344E41] font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / User State */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-[rgba(52,78,65,0.12)]">
              <div
                onClick={() => setCurrentTab('settings')}
                className="cursor-pointer text-right group"
              >
                <p className="text-xs font-bold text-[#1F2A22] group-hover:text-[#6B8E5A] transition-colors leading-tight">
                  {user.fullName || 'Siddharth'}
                </p>
                <p className="text-[11px] text-[#6B756D] leading-tight truncate max-w-[120px]">
                  {user.targetRole || 'Full Stack Engineer'}
                </p>
              </div>

              <div
                onClick={() => setCurrentTab('settings')}
                className="w-8 h-8 rounded-full bg-[#E5EEDC] text-[#344E41] flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#D4E2C5] transition-colors border border-[rgba(52,78,65,0.1)]"
              >
                {(user.fullName || 'S').charAt(0).toUpperCase()}
              </div>

              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-[#6B756D] hover:text-[#C64545] hover:bg-red-50 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={quickDemoLogin}
                className="text-xs font-semibold px-3.5 py-1.5 text-[#344E41] bg-[#E5EEDC] hover:bg-[#D4E2C5] rounded-full transition-colors"
              >
                Demo
              </button>
              <button
                onClick={() => setCurrentTab('login')}
                className="text-xs font-medium px-3 text-[#1F2A22] hover:text-[#6B8E5A] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentTab('signup')}
                className="text-xs font-semibold px-4 py-2 rounded-full bg-[#344E41] text-white hover:bg-[#4B6B5B] transition-all shadow-sm flex items-center gap-1.5"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#344E41] hover:bg-[#E5EEDC] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-5 bg-white/95 backdrop-blur-xl border border-[rgba(52,78,65,0.12)] rounded-3xl shadow-float space-y-3">
          <div className="flex flex-col gap-2">
            {mainNav.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left py-2 px-3 rounded-xl text-sm font-semibold text-[#1F2A22] hover:bg-[#E5EEDC] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F2A22]">{user.fullName}</span>
                <button
                  onClick={logout}
                  className="text-xs text-[#C64545] font-semibold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    quickDemoLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full bg-[#E5EEDC] text-[#344E41] text-xs font-bold text-center"
                >
                  ⚡ Instant Demo Access
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full bg-[#344E41] text-white text-xs font-bold text-center"
                >
                  Sign In / Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
