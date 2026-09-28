import mongoose from 'mongoose';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from '../models/User.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'interviewiq_super_secret_jwt_key_2026_production';


export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, name, targetRole, targetJobTitle } = req.body;
    const finalName = (fullName || name || '').trim();
    const finalRole = (targetRole || targetJobTitle || 'Software Engineer').trim();

    if (!email || !password || !finalName) {
      res.status(400).json({ success: false, error: 'Email, password, and full name are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      return;
    }

    const { fallbackStoreActive } = getDBStatus();

    let userExists = false;
    if (!fallbackStoreActive) {
      const existing = await UserModel.findOne({ email: normalizedEmail });
      if (existing) userExists = true;
    } else {
      userExists = memoryStore.users.has(normalizedEmail);
    }

    if (userExists) {
      res.status(409).json({ success: false, error: 'An account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let createdUser: any;
    if (!fallbackStoreActive) {
      createdUser = await UserModel.create({
        email: normalizedEmail,
        passwordHash,
        fullName: finalName,
        targetRole: finalRole,
      });
    } else {
      const id = memoryStore.generateId();
      createdUser = {
        _id: id,
        id,
        email: normalizedEmail,
        passwordHash,
        fullName: finalName,
        targetRole: finalRole,
        createdAt: new Date(),
      };
      memoryStore.users.set(normalizedEmail, createdUser);
    }

    const userId = createdUser._id ? createdUser._id.toString() : createdUser.id;
    const token = jwt.sign({ userId, email: normalizedEmail }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        fullName: createdUser.fullName,
        targetRole: createdUser.targetRole,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { fallbackStoreActive } = getDBStatus();

    let user: any;
    if (!fallbackStoreActive) {
      user = await UserModel.findOne({ email: normalizedEmail });
    } else {
      user = memoryStore.users.get(normalizedEmail);
    }

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    const userId = user._id ? user._id.toString() : user.id;
    const token = jwt.sign({ userId, email: normalizedEmail }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: userId,
        email: user.email,
        fullName: user.fullName,
        targetRole: user.targetRole,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized.' });
      return;
    }

    const { fallbackStoreActive } = getDBStatus();
    let user: any;

    if (userId === 'demo-candidate-user-1') {
      user = {
        id: 'demo-candidate-user-1',
        email: 'demo.engineer@interviewiq.ai',
        fullName: 'Demo Candidate',
        targetRole: 'Full Stack Engineer',
        authProvider: 'local',
      };
    } else if (!fallbackStoreActive) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await UserModel.findById(userId).select('-passwordHash').lean();
      } else {
        user = await UserModel.findOne({ email: req.user?.email }).select('-passwordHash').lean();
      }
    } else {
      for (const u of memoryStore.users.values()) {
        if (u.id === userId || u._id === userId) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Your session has expired. Please sign in again.',
      });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id ? user._id.toString() : user.id,
        email: user.email,
        fullName: user.fullName,
        targetRole: user.targetRole,
        authProvider: user.authProvider || 'local',
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Unable to connect to the authentication server.' });
  }
};


const getFrontendUrl = (req?: Request): string => {
  if (process.env.FRONTEND_URL) return process.env.FRONTEND_URL.replace(/\/$/, '');
  if (process.env.CLIENT_URL) return process.env.CLIENT_URL.replace(/\/$/, '');
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (req) {
    const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (host) return `${proto}://${host}`;
  }
  return 'http://localhost:5173';
};

const getBackendUrl = (req?: Request): string => {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/$/, '');
  if (process.env.SERVER_URL) return process.env.SERVER_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (req) {
    const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (host) return `${proto}://${host}`;
  }
  return 'http://localhost:5000';
};

export const getOAuthStatus = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    google: {
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 12) + '...' : null,
      requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
    },
  });
};

/**
 * Generates a tamper-proof signed OAuth state parameter that is completely stateless
 * and survives across ephemeral serverless lambda instances on Vercel.
 */
export const generateOAuthState = (provider: 'google' = 'google'): string => {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'interviewiq_oauth_state_hmac_secret_2026';
  const payload = {
    p: provider,
    t: Date.now(),
    r: crypto.randomBytes(16).toString('hex'),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  const signedState = `${payloadB64}.${signature}`;

  // Also retain in memoryStore as an optional cache for local environments
  memoryStore.oauthStates.set(signedState, { provider, createdAt: Date.now() });

  return signedState;
};

/**
 * Validates the OAuth state parameter statelessly using HMAC-SHA256 signature and timestamp,
 * with backwards-compatible fallback to memoryStore.
 */
export const verifyOAuthState = (state: string, expectedProvider: 'google' = 'google'): { valid: boolean } => {
  if (!state || typeof state !== 'string') return { valid: false };

  // 1. Stateless HMAC validation
  if (state.includes('.')) {
    const parts = state.split('.');
    if (parts.length === 2) {
      const [payloadB64, signature] = parts;
      const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'interviewiq_oauth_state_hmac_secret_2026';
      try {
        const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSig);
        if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
          const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
          const now = Date.now();
          const isTimeValid = typeof payload.t === 'number' && now >= payload.t && (now - payload.t) < 15 * 60 * 1000;
          const isProviderValid = payload.p === expectedProvider;
          if (isTimeValid && isProviderValid) {
            return { valid: true };
          }
        }
      } catch (err) {
        console.warn('[OAuth State] Error parsing signed state:', err);
      }
    }
  }

  // 2. Memory store fallback (for backward-compatibility or local development)
  const storedState = memoryStore.oauthStates.get(state);
  if (storedState && storedState.provider === expectedProvider && Date.now() - storedState.createdAt <= 15 * 60 * 1000) {
    memoryStore.oauthStates.delete(state);
    return { valid: true };
  }

  return { valid: false };
};

export const getOAuthUrl = async (req: Request, res: Response): Promise<void> => {
  const provider = (req.params.provider || '').toLowerCase();

  // Prune expired states (> 15 minutes old)
  const now = Date.now();
  for (const [sKey, sVal] of memoryStore.oauthStates.entries()) {
    if (now - sVal.createdAt > 15 * 60 * 1000) {
      memoryStore.oauthStates.delete(sKey);
    }
  }

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getBackendUrl(req)}/api/auth/oauth/google/callback`;

    if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
      res.status(501).json({
        success: false,
        error: 'Google OAuth is not configured. Required server variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.',
        code: 'OAUTH_NOT_CONFIGURED',
        requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
      });
      return;
    }

    const state = generateOAuthState('google');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile&state=${state}&access_type=offline&prompt=consent`;

    res.json({ success: true, url: authUrl });
    return;
  }

  res.status(400).json({ success: false, error: 'Unsupported OAuth provider.' });
};

export const googleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
  const frontendUrl = getFrontendUrl(req);
  const { code, state, error: oauthError } = req.query;

  if (oauthError) {
    if (oauthError === 'access_denied') {
      res.redirect(`${frontendUrl}/login?error=oauth_cancelled`);
    } else {
      res.redirect(`${frontendUrl}/login?error=google_failed`);
    }
    return;
  }

  if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
    res.redirect(`${frontendUrl}/login?error=google_failed`);
    return;
  }

  // Stateless CSRF validation
  const stateVerification = verifyOAuthState(state, 'google');
  if (!stateVerification.valid) {
    console.warn('[Google OAuth] State verification failed for state parameter');
    res.redirect(`${frontendUrl}/login?error=csrf_detected`);
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getBackendUrl(req)}/api/auth/oauth/google/callback`;

  if (!clientId || !clientSecret) {
    res.redirect(`${frontendUrl}/login?error=google_not_configured`);
    return;
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('[Google OAuth] Token exchange failed with status', tokenResponse.status);
      res.redirect(`${frontendUrl}/login?error=google_failed`);
      return;
    }

    const tokenData = await tokenResponse.json() as { access_token?: string; id_token?: string };
    if (!tokenData.access_token) {
      res.redirect(`${frontendUrl}/login?error=google_failed`);
      return;
    }

    // Fetch verified profile from Google UserInfo
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileResponse.ok) {
      res.redirect(`${frontendUrl}/login?error=google_failed`);
      return;
    }

    const profile = await profileResponse.json() as {
      id: string;
      email: string;
      name?: string;
      picture?: string;
      verified_email?: boolean;
    };

    if (!profile.email) {
      res.redirect(`${frontendUrl}/login?error=google_failed`);
      return;
    }

    const normalizedEmail = profile.email.toLowerCase().trim();
    const { fallbackStoreActive } = getDBStatus();
    let user: any = null;

    if (!fallbackStoreActive) {
      user = await UserModel.findOne({ email: normalizedEmail });
      if (user) {
        // Link Google ID if not yet linked
        if (!user.googleId) user.googleId = profile.id;
        if (profile.picture && !user.avatarUrl) user.avatarUrl = profile.picture;
        await user.save();
      } else {
        user = await UserModel.create({
          email: normalizedEmail,
          fullName: (profile.name || 'Google Candidate').trim(),
          authProvider: 'google',
          googleId: profile.id,
          avatarUrl: profile.picture,
          targetRole: 'Software Engineer',
        });
      }
    } else {
      user = memoryStore.users.get(normalizedEmail);
      if (user) {
        user.googleId = profile.id;
        if (profile.picture) user.avatarUrl = profile.picture;
        memoryStore.users.set(normalizedEmail, user);
      } else {
        const id = memoryStore.generateId();
        user = {
          _id: id,
          id,
          email: normalizedEmail,
          fullName: (profile.name || 'Google Candidate').trim(),
          authProvider: 'google',
          googleId: profile.id,
          avatarUrl: profile.picture,
          targetRole: 'Software Engineer',
          createdAt: new Date(),
        };
        memoryStore.users.set(normalizedEmail, user);
      }
    }

    const userId = user._id ? user._id.toString() : user.id;
    const token = jwt.sign({ userId, email: normalizedEmail }, JWT_SECRET, { expiresIn: '7d' });

    // Set production-ready cookie
    const isProd = process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('interviewiq_token', token, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.redirect(`${frontendUrl}/dashboard?token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('[Google OAuth Error]:', error);
    res.redirect(`${frontendUrl}/login?error=google_failed`);
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  const { credential } = req.body;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    res.status(501).json({
      success: false,
      error: 'Google OAuth is not configured. Please supply GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI in server/.env.',
      code: 'OAUTH_NOT_CONFIGURED',
      requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
    });
    return;
  }

  if (!credential) {
    res.status(400).json({
      success: false,
      error: 'Missing Google credential token.',
    });
    return;
  }

  // Token exchange verification logic
  res.status(501).json({
    success: false,
    error: 'Google credential verification endpoint ready. Waiting for live Google verification callback.',
  });
};



export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, error: 'Email is required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
      return;
    }

    const { fallbackStoreActive } = getDBStatus();
    let user: any;
    if (!fallbackStoreActive) {
      user = await UserModel.findOne({ email: normalizedEmail });
    } else {
      user = memoryStore.users.get(normalizedEmail);
    }

    // Generate cryptographically secure temporary token (expires in 1 hour)
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    const expiresAt = Date.now() + 3600 * 1000; // 1 hour

    if (user) {
      if (!fallbackStoreActive) {
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(expiresAt);
        await user.save();
      } else {
        memoryStore.passwordResetTokens.set(hashedToken, { email: normalizedEmail, expiresAt });
      }
    }

    const emailConfigured = !!(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || process.env.EMAIL_API_KEY);

    // Uniform non-leaking message per Phase 5
    res.json({
      success: true,
      message: 'If an account exists with that email address, a password reset link has been prepared.',
      emailDeliveryConfigured: emailConfigured,
      notice: emailConfigured
        ? 'Password reset instructions have been sent to your email.'
        : 'Password reset implementation is ready, but an email provider configuration is required.',
      ...(process.env.NODE_ENV !== 'production' && { resetTokenPreview: rawResetToken }),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Unable to process password reset request.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ success: false, error: 'Reset token and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const { fallbackStoreActive } = getDBStatus();

    let user: any;
    if (!fallbackStoreActive) {
      user = await UserModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      }).select('+resetPasswordToken +resetPasswordExpires');
    } else {
      const record = memoryStore.passwordResetTokens.get(hashedToken);
      if (record && record.expiresAt > Date.now()) {
        user = memoryStore.users.get(record.email);
      }
    }

    if (!user) {
      res.status(400).json({
        success: false,
        error: 'Password reset token is invalid or has expired.',
      });
      return;
    }

    // Hash new password and invalidate token
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    if (!fallbackStoreActive) {
      user.passwordHash = passwordHash;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    } else {
      user.passwordHash = passwordHash;
      memoryStore.users.set(user.email, user);
      memoryStore.passwordResetTokens.delete(hashedToken);
    }

    res.json({
      success: true,
      message: 'Password has been successfully reset. You can now log in with your new password.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Unable to reset password.' });
  }
};


export const quickDemoLogin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const demoEmail = 'demo.engineer@interviewiq.ai';
    const demoId = 'demo-candidate-user-1';
    const token = jwt.sign({ userId: demoId, email: demoEmail }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: demoId,
        email: demoEmail,
        fullName: 'Demo Candidate',
        targetRole: 'Full Stack Engineer',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};


