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

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
