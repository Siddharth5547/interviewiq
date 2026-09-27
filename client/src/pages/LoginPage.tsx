import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Sparkles, Lock, Mail, ArrowRight, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password View State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [resetErrorMessage, setResetErrorMessage] = useState('');
  const [resetTokenPreview, setResetTokenPreview] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetComplete, setResetComplete] = useState(false);

  const activeError = error || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    clearAuthError();
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      if (err.message?.includes('connecting to InterviewIQ') || err.code === 'ERR_NETWORK' || !err.response) {
        setError('Something went wrong while connecting to InterviewIQ. Please try again.');
      } else {
        setError(err.response?.data?.error || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSSOClick = async (provider: 'Google' | 'Apple') => {
    if (googleLoading || appleLoading) return;
    setError('');
    clearAuthError();

    if (provider === 'Google') setGoogleLoading(true);
    if (provider === 'Apple') setAppleLoading(true);

    try {
      const res = await api.getOAuthUrl(provider.toLowerCase());
      if (res.data?.success && res.data?.url) {
        window.location.href = res.data.url;
        return;
      }
    } catch (err: any) {
      if (provider === 'Google') {
        setError('Google sign-in is temporarily unavailable. Please try again or use email.');
      } else {
        setError('Apple sign-in is temporarily unavailable. Please try again or use email.');
      }
    } finally {
      setGoogleLoading(false);
      setAppleLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetLoading) return;
    if (!resetEmail) {
      setResetErrorMessage('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    setResetErrorMessage('');
    setResetSuccessMessage('');
    try {
      const res = await api.forgotPassword(resetEmail);
      if (res.data?.success) {
        setResetSuccessMessage(
          res.data.notice ||
            'If an account exists with that email address, a password reset link has been prepared.'
        );
        if (res.data.resetTokenPreview) {
          setResetTokenPreview(res.data.resetTokenPreview);
        }
      } else {
        setResetErrorMessage(res.data?.error || 'Unable to request password reset.');
      }
    } catch (err: any) {
      setResetErrorMessage('Unable to process password reset request. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTokenPreview || !newPassword) return;
    setResetLoading(true);
    setResetErrorMessage('');
    try {
      const res = await api.resetPassword({ token: resetTokenPreview, newPassword });
      if (res.data?.success) {
        setResetComplete(true);
        setResetSuccessMessage('Password reset successfully! You can now log in.');
      } else {
        setResetErrorMessage(res.data?.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setResetErrorMessage(err.response?.data?.error || 'Password reset token is invalid or has expired.');
    } finally {
      setResetLoading(false);
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
            {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B756D]">
            {showForgotPassword
              ? 'Enter your email to receive secure password reset instructions.'
              : 'Sign in to access your resumes, ATS analyses, and mock interview diagnostics.'}
          </p>
        </div>

        {/* Forgot Password View */}
        {showForgotPassword ? (
          <div className="space-y-4">
            {resetErrorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
                {resetErrorMessage}
              </div>
            )}

            {resetSuccessMessage && (
              <div className="p-3.5 rounded-2xl bg-[#E5EEDC] border border-[#6B8E5A]/30 text-xs text-[#344E41] leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6B8E5A] flex-shrink-0 mt-0.5" />
                <span>{resetSuccessMessage}</span>
              </div>
            )}

            {!resetComplete && resetTokenPreview ? (
              // Step 2: Set New Password
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#344E41]">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#344E41]/15 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E5A] focus:border-transparent transition-all bg-[#F4F7F1]/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-5 rounded-full bg-[#344E41] text-white font-semibold text-xs sm:text-sm hover:bg-[#25392F] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating Password...
                    </>
                  ) : (
                    'Set New Password'
                  )}
                </button>
              </form>
            ) : !resetComplete ? (
              // Step 1: Request Reset
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#344E41]">Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#344E41]/15 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E5A] focus:border-transparent transition-all bg-[#F4F7F1]/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3 px-5 rounded-full bg-[#344E41] text-white font-semibold text-xs sm:text-sm hover:bg-[#25392F] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing Reset Link...
                    </>
                  ) : (
                    'Send Password Reset'
                  )}
                </button>
              </form>
            ) : null}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetTokenPreview(null);
                  setResetComplete(false);
                  setResetSuccessMessage('');
                  setResetErrorMessage('');
                }}
                className="text-xs font-semibold text-[#6B8E5A] hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          // Main Login View
          <>
            {/* Social SSO Options */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSSOClick('Google')}
                disabled={googleLoading || appleLoading || loading}
                className="w-full py-2.5 px-4 rounded-full border border-[#344E41]/15 bg-white hover:bg-[#F4F7F1] text-xs font-semibold text-[#344E41] transition-all flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-70"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
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
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSSOClick('Apple')}
                disabled={googleLoading || appleLoading || loading}
                className="w-full py-2.5 px-4 rounded-full border border-[#344E41]/15 bg-white hover:bg-[#F4F7F1] text-xs font-semibold text-[#344E41] transition-all flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-70"
              >
                {appleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1F2A22]" />
                    <span>Connecting to Apple...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-current text-[#1F2A22]" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.07-1.89.94-3-.94.04-2.07.63-2.73 1.42-.58.68-1.09 1.79-.95 2.87 1.06.08 2.12-.53 2.74-1.29z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#344E41]/10 w-full" />
              <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#6B756D] absolute">
                or email
              </span>
            </div>

            {activeError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed flex items-center justify-between gap-3">
                <span className="flex-1">{activeError}</span>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  disabled={loading}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 transition-colors flex-shrink-0 cursor-pointer"
                >
                  Retry
                </button>
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
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#344E41]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setResetEmail(email);
                      setError('');
                    }}
                    className="text-[11px] font-semibold text-[#6B8E5A] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
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
                disabled={loading || googleLoading || appleLoading}
                className="w-full py-3 px-5 rounded-full bg-[#344E41] text-white font-semibold text-xs sm:text-sm hover:bg-[#25392F] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#8FAF78]" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-[#6B756D]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="font-bold text-[#344E41] hover:text-[#6B8E5A] transition-colors ml-1"
              >
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
