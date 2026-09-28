import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { resumeImprover } from '../services/resumeImprover.js';
import { ResumeModel } from '../models/Resume.js';
import { JobDescriptionModel } from '../models/JobDescription.js';
import { ATSAnalysisModel } from '../models/ATSAnalysis.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const generateImprovements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId, jobDescriptionId } = req.body;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let resume: any;
    let job: any;

    let baselineScore = 68;

    if (!fallbackStoreActive) {
      const [r, j, existingATS] = await Promise.all([
        ResumeModel.findOne({ _id: resumeId, userId }).lean(),
        JobDescriptionModel.findById(jobDescriptionId).lean(),
        ATSAnalysisModel.findOne({ resumeId, jobDescriptionId }).lean(),
      ]);
      resume = r;
      job = j;
      if (existingATS && (existingATS as any).overallScore) {
        baselineScore = (existingATS as any).overallScore;
      }
    } else {
      resume = memoryStore.resumes.get(resumeId);
      job = memoryStore.jobs.get(jobDescriptionId);
    }

    if (!resume) {
      res.status(404).json({ success: false, error: 'Resume not found.' });
      return;
    }
    if (!job) {
      res.status(404).json({ success: false, error: 'Target job description not found.' });
      return;
    }

    const improvementResult = await resumeImprover.generateGroundedImprovements(
      resume.parsedData,
      job,
      baselineScore
    );

    res.json({
      success: true,
      message: 'Grounded resume improvements generated.',
      result: improvementResult,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const applyEnhancedResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId, enhancedResumeData } = req.body;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    if (!fallbackStoreActive) {
      await ResumeModel.findOneAndUpdate(
        { _id: resumeId, userId },
        { $set: { parsedData: enhancedResumeData } }
      );
    } else {
      const existing = memoryStore.resumes.get(resumeId);
      if (existing) {
        existing.parsedData = enhancedResumeData;
        existing.updatedAt = new Date();
        memoryStore.resumes.set(resumeId, existing);
      }
    }

    res.json({
      success: true,
      message: 'Resume updated with enhanced, grounded bullet points.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
