import { Router } from 'express';
import {
  register,
  login,
  getMe,
  quickDemoLogin,
  getOAuthStatus,
  getOAuthUrl,
  googleAuth,
  googleOAuthCallback,
  appleAuth,
  appleOAuthCallback,
  forgotPassword,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/demo-login', quickDemoLogin);
router.get('/oauth/status', getOAuthStatus);
router.get('/oauth/:provider/url', getOAuthUrl);
router.get('/oauth/google/callback', googleOAuthCallback);
router.post('/oauth/google/callback', googleOAuthCallback);
router.get('/oauth/apple/callback', appleOAuthCallback);
router.post('/oauth/apple/callback', appleOAuthCallback);
router.post('/oauth/google', googleAuth);
router.post('/oauth/apple', appleAuth);
router.post('/forgot-password', forgotPassword);

export default router;



