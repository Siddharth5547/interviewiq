import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import atsRoutes from './routes/atsRoutes.js';
import improveRoutes from './routes/improveRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

dotenv.config();

export const app = express();

// Trust proxy for secure cookies behind reverse proxies (Vercel, Cloudflare, etc.)
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
  'https://interviewiq-beryl.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    product: 'InterviewIQ API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/improve', improveRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
