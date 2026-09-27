import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';

import { Sparkles, Lock, Mail, ArrowRight, Loader2, Zap, ShieldCheck } from 'lucide-react';


interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, quickDemoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again or use Instant Demo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError('');
    try {
      await quickDemoLogin();
      onNavigate('dashboard');
    } catch (err: any) {
      setError('Failed to initiate demo session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSSOClick = async (provider: string) => {
    setError('');
    try {
      const res = await api.getOAuthUrl(provider.toLowerCase());
      if (res.data?.success && res.data?.url) {
        window.location.href = res.data.url;
        return;
      }
    } catch (err: any) {
      const required = err.response?.data?.requiredEnv?.join(', ');
      setError(
        err.response?.data?.error ||
          `${provider} OAuth is in integration standby: server credentials (${required || 'CLIENT_ID / SECRET'}) are not configured yet. Please sign in with Email & Password or Launch Demo Pilot.`
      );
    }
  };


  return (
    <div className="min-h-screen bg-[#F4F7F1] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#344E41]/10 shadow-sm p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#344E41] text-white flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-6 h-6 text-[#8FAF78]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#344E41]">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-[#6B756D]">
            Sign in to access your resumes, ATS analyses, and mock interview diagnostics.
          </p>
        </div>

        {/* 1-Click Demo Account Quick Action */}
        <div className="p-4 bg-[#E5EEDC]/60 border border-[#6B8E5A]/25 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6B8E5A] shadow-2xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#344E41] block">Instant Testing?</span>
              <span className="text-[11px] text-[#6B756D]">Pre-loaded resume & history</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#344E41] text-white hover:bg-[#23352C] transition-all shadow-sm flex-shrink-0"
          >
            Launch Demo Pilot
          </button>
        </div>

        {/* Social SSO Options */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleSSOClick('Google')}
            className="w-full py-2.5 px-4 rounded-full border border-[#344E41]/15 bg-white hover:bg-[#F4F7F1] text-xs font-semibold text-[#344E41] transition-all flex items-center justify-center gap-2.5 shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSSOClick('Apple')}
            className="w-full py-2.5 px-4 rounded-full border border-[#344E41]/15 bg-white hover:bg-[#F4F7F1] text-xs font-semibold text-[#344E41] transition-all flex items-center justify-center gap-2.5 shadow-2xs"
          >
            <svg className="w-4 h-4 fill-current text-[#1F2A22]" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.07-1.89.94-3-.94.04-2.07.63-2.73 1.42-.58.68-1.09 1.79-.95 2.87 1.06.08 2.12-.53 2.74-1.29z" />
            </svg>
            Continue with Apple
          </button>
        </div>


        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#344E41]/10 w-full" />
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#6B756D] absolute">
            or email
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#344E41]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#344E41]/15 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E5A] focus:border-transparent transition-all bg-[#F4F7F1]/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#344E41]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#344E41]/15 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E5A] focus:border-transparent transition-all bg-[#F4F7F1]/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-full bg-[#6B8E5A] text-white font-semibold text-xs sm:text-sm hover:bg-[#5A7A4A] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Sign In to Account
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#6B756D]">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="font-bold text-[#6B8E5A] hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
