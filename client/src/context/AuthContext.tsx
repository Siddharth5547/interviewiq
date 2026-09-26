import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, fullName: string, targetRole?: string) => Promise<void>;
  quickDemoLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('interviewiq_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('interviewiq_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn('[AuthContext] Session verification notice:', err);
        // Fallback default demo user if token expired
        setUser({
          id: 'demo-user',
          email: 'demo.engineer@interviewiq.ai',
          fullName: 'Alex Chen',
          targetRole: 'Full Stack Software Engineer',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    if (res.data.success) {
      localStorage.setItem('interviewiq_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (email: string, pass: string, fullName: string, targetRole?: string) => {
    const res = await api.register({ email, password: pass, fullName, targetRole });
    if (res.data.success) {
      localStorage.setItem('interviewiq_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const quickDemoLogin = async () => {
    try {
      const res = await api.quickDemoLogin();
      if (res.data.success) {
        localStorage.setItem('interviewiq_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
    } catch {
      // Offline fallback
      const demoUser: User = {
        id: 'demo-user-1',
        email: 'alex.chen@example.com',
        fullName: 'Alex Chen',
        targetRole: 'Senior Full Stack Engineer',
      };
      localStorage.setItem('interviewiq_token', 'demo-token');
      setToken('demo-token');
      setUser(demoUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('interviewiq_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        quickDemoLogin,
        logout,
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
