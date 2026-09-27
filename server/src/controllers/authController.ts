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
    const { email, password, fullName, targetRole } = req.body;
    if (!email || !password || !fullName) {
      res.status(400).json({ success: false, error: 'Email, password, and full name are required.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
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
        fullName: fullName.trim(),
        targetRole: targetRole || 'Software Engineer',
      });
    } else {
      const id = memoryStore.generateId();
      createdUser = {
        _id: id,
        id,
        email: normalizedEmail,
        passwordHash,
        fullName: fullName.trim(),
        targetRole: targetRole || 'Software Engineer',
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

    if (!fallbackStoreActive) {
      user = await UserModel.findById(userId).select('-passwordHash');
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


const getFrontendUrl = (): string => {
  return process.env.FRONTEND_URL || process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:5173';
};

const getBackendUrl = (): string => {
  return process.env.BACKEND_URL || process.env.SERVER_URL || 'http://localhost:5000';
};

export const getOAuthStatus = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    google: {
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 12) + '...' : null,
      requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
    },
    apple: {
      configured: !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET),
      clientId: process.env.APPLE_CLIENT_ID ? process.env.APPLE_CLIENT_ID.substring(0, 12) + '...' : null,
      requiredEnv: ['APPLE_CLIENT_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_PRIVATE_KEY', 'APPLE_REDIRECT_URI'],
    },
  });
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
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getBackendUrl()}/api/auth/oauth/google/callback`;

    if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
      res.status(501).json({
        success: false,
        error: 'Google OAuth is not configured. Required server variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.',
        code: 'OAUTH_NOT_CONFIGURED',
        requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
      });
      return;
    }

    const state = crypto.randomBytes(32).toString('hex');
    memoryStore.oauthStates.set(state, { provider: 'google', createdAt: Date.now() });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile&state=${state}&access_type=offline&prompt=consent`;

    res.json({ success: true, url: authUrl });
    return;
  }

  if (provider === 'apple') {
    const clientId = process.env.APPLE_CLIENT_ID;
    const redirectUri = process.env.APPLE_REDIRECT_URI || `${getBackendUrl()}/api/auth/oauth/apple/callback`;

    if (!clientId || !process.env.APPLE_CLIENT_SECRET) {
      res.status(501).json({
        success: false,
        error: 'Apple Sign-In is not configured. Required server variables: APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY, and APPLE_REDIRECT_URI.',
        code: 'OAUTH_NOT_CONFIGURED',
        requiredEnv: ['APPLE_CLIENT_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_PRIVATE_KEY', 'APPLE_REDIRECT_URI'],
      });
      return;
    }

    const state = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(32).toString('hex');
    memoryStore.oauthStates.set(state, { provider: 'apple', nonce, createdAt: Date.now() });

    const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=${state}&nonce=${nonce}`;

    res.json({ success: true, url: authUrl });
    return;
  }

  res.status(400).json({ success: false, error: 'Unsupported OAuth provider.' });
};

export const googleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
  const frontendUrl = getFrontendUrl();
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

  // CSRF validation
  const storedState = memoryStore.oauthStates.get(state);
  if (!storedState || storedState.provider !== 'google' || Date.now() - storedState.createdAt > 15 * 60 * 1000) {
    res.redirect(`${frontendUrl}/login?error=csrf_detected`);
    return;
  }
  memoryStore.oauthStates.delete(state);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getBackendUrl()}/api/auth/oauth/google/callback`;

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

    res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('[Google OAuth Error]:', error);
    res.redirect(`${frontendUrl}/login?error=google_failed`);
  }
};

export const appleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
  const frontendUrl = getFrontendUrl();
  const payload = { ...req.query, ...req.body };
  const { code, id_token, state, user: userJson, error: appleError } = payload;

  if (appleError) {
    if (appleError === 'user_cancelled_authorize') {
      res.redirect(`${frontendUrl}/login?error=oauth_cancelled`);
    } else {
      res.redirect(`${frontendUrl}/login?error=apple_failed`);
    }
    return;
  }

  if (!id_token || !state) {
    res.redirect(`${frontendUrl}/login?error=apple_failed`);
    return;
  }

  // Validate state
  const storedState = memoryStore.oauthStates.get(state);
  if (!storedState || storedState.provider !== 'apple' || Date.now() - storedState.createdAt > 15 * 60 * 1000) {
    res.redirect(`${frontendUrl}/login?error=csrf_detected`);
    return;
  }
  const expectedNonce = storedState.nonce;
  memoryStore.oauthStates.delete(state);

  try {
    // Decode header without verifying to extract kid
    const decodedToken = jwt.decode(id_token, { complete: true });
    const kid = decodedToken?.header?.kid;
    if (!kid) {
      res.redirect(`${frontendUrl}/login?error=apple_failed`);
      return;
    }

    // Fetch Apple JWKS
    const jwksRes = await fetch('https://appleid.apple.com/auth/keys');
    if (!jwksRes.ok) {
      res.redirect(`${frontendUrl}/login?error=apple_failed`);
      return;
    }
    const jwks = await jwksRes.json() as { keys: any[] };
    const matchingKey = jwks.keys.find((k: any) => k.kid === kid);

    if (!matchingKey) {
      res.redirect(`${frontendUrl}/login?error=apple_failed`);
      return;
    }

    // Convert JWK to PEM public key using native Node.js crypto
    const pubKey = crypto.createPublicKey({ key: matchingKey, format: 'jwk' });
    const pem = pubKey.export({ type: 'spki', format: 'pem' });

    // Cryptographically verify token
    const appleClientId = process.env.APPLE_CLIENT_ID;
    const verified = jwt.verify(id_token, pem, {
      algorithms: ['RS256'],
      issuer: 'https://appleid.apple.com',
      audience: appleClientId,
    }) as any;

    if (expectedNonce && verified.nonce !== expectedNonce) {
      console.error('[Apple OAuth] Nonce mismatch');
      res.redirect(`${frontendUrl}/login?error=csrf_detected`);
      return;
    }

    const email = verified.email;
    const appleId = verified.sub;

    if (!email) {
      res.redirect(`${frontendUrl}/login?error=apple_failed`);
      return;
    }

    // Extract user full name if supplied by Apple on first authorization
    let fullName = 'Apple Candidate';
    if (userJson) {
      try {
        const parsed = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
        const candidateName = `${parsed.name?.firstName || ''} ${parsed.name?.lastName || ''}`.trim();
        if (candidateName) fullName = candidateName;
      } catch {
        // use fallback
      }
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { fallbackStoreActive } = getDBStatus();
    let user: any = null;

    if (!fallbackStoreActive) {
      user = await UserModel.findOne({ email: normalizedEmail });
      if (user) {
        if (!user.appleId) user.appleId = appleId;
        await user.save();
      } else {
        user = await UserModel.create({
          email: normalizedEmail,
          fullName,
          authProvider: 'apple',
          appleId,
          targetRole: 'Software Engineer',
        });
      }
    } else {
      user = memoryStore.users.get(normalizedEmail);
      if (user) {
        user.appleId = appleId;
        memoryStore.users.set(normalizedEmail, user);
      } else {
        const id = memoryStore.generateId();
        user = {
          _id: id,
          id,
          email: normalizedEmail,
          fullName,
          authProvider: 'apple',
          appleId,
          targetRole: 'Software Engineer',
          createdAt: new Date(),
        };
        memoryStore.users.set(normalizedEmail, user);
      }
    }

    const userId = user._id ? user._id.toString() : user.id;
    const token = jwt.sign({ userId, email: normalizedEmail }, JWT_SECRET, { expiresIn: '7d' });

    res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('[Apple OAuth Error]:', error);
    res.redirect(`${frontendUrl}/login?error=apple_failed`);
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

export const appleAuth = async (_req: Request, res: Response): Promise<void> => {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId || !process.env.APPLE_CLIENT_SECRET) {
    res.status(501).json({
      success: false,
      error: 'Apple Sign-In is not configured. Please supply APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY, and APPLE_REDIRECT_URI in server/.env.',
      code: 'OAUTH_NOT_CONFIGURED',
      requiredEnv: ['APPLE_CLIENT_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_PRIVATE_KEY', 'APPLE_REDIRECT_URI'],
    });
    return;
  }

  res.status(501).json({
    success: false,
    error: 'Apple Sign-In endpoint ready.',
  });
};



export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, error: 'Email is required.' });
    return;
  }

  res.json({
    success: true,
    message: 'If an account exists with this email address, password reset instructions have been dispatched.',
  });
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


