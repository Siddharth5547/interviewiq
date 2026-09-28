import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

const extractToken = (req: Request): string | null => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split('=');
      if (name === 'interviewiq_token' && val) {
        return decodeURIComponent(val);
      }
    }
  }
  return null;
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required. No token provided.' });
    return;
  }

  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'interviewiq_super_secret_jwt_key_2026_production';

  try {
    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Your session has expired. Please sign in again.' });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    // Provide a guest user context if no token
    req.user = { userId: 'guest-user-session', email: 'guest@interviewiq.ai' };
    return next();
  }

  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'interviewiq_super_secret_jwt_key_2026_production';
  try {
    const decoded = jwt.verify(token, secret) as { userId: string; email: string };
    req.user = decoded;
  } catch (err) {
    req.user = { userId: 'guest-user-session', email: 'guest@interviewiq.ai' };
  }
  next();
};
