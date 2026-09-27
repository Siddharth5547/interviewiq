import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

export type AuthState = 'logged out' | 'authenticating' | 'authenticated' | 'authentication failed';

interface AuthContextType {
  user: User | null;
  token: string | null;
  authState: AuthState;
  loading: boolean; // boolean convenience for backward compatibility
  authError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, fullName: string, targetRole?: string) => Promise<void>;
  quickDemoLogin: () => Promise<void>;
  setAuthSession: (token: string, user?: User) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapOAuthError = (code: string): string => {
  switch (code) {
    case 'oauth_cancelled':
      return 'Sign-in was cancelled. Please try again.';
    case 'google_failed':
      return 'Google sign-in could not be completed. Please try again.';
    case 'apple_failed':
      return 'Apple sign-in could not be completed. Please try again.';
    case 'apple_not_configured':
      return 'Apple sign-in configuration is incomplete.';
    case 'google_not_configured':
      return 'Google sign-in could not be completed. Please try again.';
    case 'session_expired':
      return 'Your session has expired. Please sign in again.';
    case 'csrf_detected':
      return 'Authentication security validation failed. Please try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('interviewiq_token');
    }
    return null;
  });

  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>(() => {
    // If a token already exists in localStorage, start in 'authenticating' to avoid logged-out flash
    if (typeof window !== 'undefined' && localStorage.getItem('interviewiq_token')) {
      return 'authenticating';
    }
    return 'logged out';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const setAuthSession = useCallback(async (newToken: string, directUser?: User) => {
    localStorage.setItem('interviewiq_token', newToken);
    setToken(newToken);
    setAuthState('authenticating');
    setAuthError(null);

    if (directUser) {
      setUser(directUser);
      setAuthState('authenticated');
      return;
    }

    try {
      const res = await api.getMe();
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        setAuthState('authenticated');
      } else {
        throw new Error('Failed to retrieve user profile');
      }
    } catch (err: any) {
      console.error('[AuthContext] Session retrieval failed:', err);
      localStorage.removeItem('interviewiq_token');
      setToken(null);
      setUser(null);
      setAuthError('Your session has expired. Please sign in again.');
      setAuthState('authentication failed');
    }
  }, []);

  // Check URL params for OAuth callbacks or errors on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const callbackToken = searchParams.get('token');
    const oauthErrorCode = searchParams.get('error');

    if (callbackToken) {
      // Remove query parameters from URL cleanly
      searchParams.delete('token');
      const cleanSearch = searchParams.toString();
      const cleanPath = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '');
      window.history.replaceState({}, document.title, cleanPath);

      setAuthSession(callbackToken);
      return;
    }

    if (oauthErrorCode) {
      searchParams.delete('error');
      const cleanSearch = searchParams.toString();
      const cleanPath = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '');
      window.history.replaceState({}, document.title, cleanPath);

      setAuthError(mapOAuthError(oauthErrorCode));
      setAuthState('authentication failed');
      return;
    }

    // Verify existing token from localStorage
    const storedToken = localStorage.getItem('interviewiq_token');
    if (!storedToken) {
      setAuthState('logged out');
      return;
    }

    let isMounted = true;
    const verifyStoredSession = async () => {
      try {
        const res = await api.getMe();
        if (isMounted) {
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            setAuthState('authenticated');
          } else {
            throw new Error('Invalid session response');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('[AuthContext] Verification failed for stored token');
          localStorage.removeItem('interviewiq_token');
          setToken(null);
          setUser(null);
          setAuthError('Your session has expired. Please sign in again.');
          setAuthState('authentication failed');
        }
      }
    };

    verifyStoredSession();

    return () => {
      isMounted = false;
    };
  }, [setAuthSession]);

  const login = async (email: string, pass: string) => {
    setAuthState('authenticating');
    setAuthError(null);
    try {
      const res = await api.login({ email, password: pass });
      if (res.data.success) {
        localStorage.setItem('interviewiq_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setAuthState('authenticated');
      } else {
        throw new Error(res.data?.error || 'Login failed');
      }
    } catch (err: any) {
      setAuthState('authentication failed');
      if (err.code === 'ERR_NETWORK' || !err.response) {
        const msg = 'Unable to connect to the authentication server.';
        setAuthError(msg);
        throw new Error(msg);
      }
      const msg = err.response?.data?.error || 'Invalid email or password.';
      setAuthError(msg);
      throw err;
    }
  };

  const register = async (email: string, pass: string, fullName: string, targetRole?: string) => {
    setAuthState('authenticating');
    setAuthError(null);
    try {
      const res = await api.register({ email, password: pass, fullName, targetRole });
      if (res.data.success) {
        localStorage.setItem('interviewiq_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setAuthState('authenticated');
      } else {
        throw new Error(res.data?.error || 'Registration failed');
      }
    } catch (err: any) {
      setAuthState('authentication failed');
      if (err.code === 'ERR_NETWORK' || !err.response) {
        const msg = 'Unable to connect to the authentication server.';
        setAuthError(msg);
        throw new Error(msg);
      }
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  const quickDemoLogin = async () => {
    setAuthState('authenticating');
    setAuthError(null);
    try {
      const res = await api.quickDemoLogin();
      if (res.data.success) {
        localStorage.setItem('interviewiq_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setAuthState('authenticated');
      }
    } catch (err: any) {
      setAuthState('authentication failed');
      setAuthError('Unable to connect to the authentication server.');
    }
  };

  const logout = () => {
    localStorage.removeItem('interviewiq_token');
    setToken(null);
    setUser(null);
    setAuthError(null);
    setAuthState('logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authState,
        loading: authState === 'authenticating',
        authError,
        login,
        register,
        quickDemoLogin,
        setAuthSession,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
