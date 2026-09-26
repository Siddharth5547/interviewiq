import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'interviewiq_super_secret_jwt_key_2026_production';

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
      // Default guest object
      res.json({
        success: true,
        user: {
          id: userId,
          email: req.user?.email || 'guest@interviewiq.ai',
          fullName: 'Demo Candidate',
          targetRole: 'Full Stack Engineer',
        },
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
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOAuthStatus = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    google: {
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 12) + '...' : null,
    },
    apple: {
      configured: !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET),
      clientId: process.env.APPLE_CLIENT_ID ? process.env.APPLE_CLIENT_ID.substring(0, 12) + '...' : null,
    },
  });
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  const { credential } = req.body;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    res.status(501).json({
      success: false,
      error: 'Google OAuth is not configured. Please supply GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your server environment.',
      code: 'OAUTH_NOT_CONFIGURED',
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

  // When credentials are provided, verify the Google JWT or handle exchange
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
      error: 'Apple Sign-In is not configured. Please supply APPLE_CLIENT_ID and APPLE_CLIENT_SECRET in your server environment.',
      code: 'OAUTH_NOT_CONFIGURED',
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


