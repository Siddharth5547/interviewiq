import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { atsEngine } from '../services/atsEngine.js';
import { ATSAnalysisModel } from '../models/ATSAnalysis.js';
import { ResumeModel } from '../models/Resume.js';
import { JobDescriptionModel } from '../models/JobDescription.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const analyzeATS = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeId, jobDescriptionId } = req.body;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let resume: any;
    let job: any;

    if (!fallbackStoreActive) {
      const [r, j] = await Promise.all([
        ResumeModel.findOne({ _id: resumeId, userId }).lean(),
        JobDescriptionModel.findById(jobDescriptionId).lean(),
      ]);
      resume = r;
      job = j;
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

    const parsedResume = resume.parsedData || {
      skills: { all: [] },
      experience: [],
      projects: [],
      education: [],
      summary: '',
    };
    const analysisResult = atsEngine.computeATSScore(parsedResume, job, resume.rawText || '');

    let savedAnalysis: any;
    if (!fallbackStoreActive) {
      savedAnalysis = await ATSAnalysisModel.create({
        userId,
        resumeId: resume._id.toString(),
        jobDescriptionId: job._id.toString(),
        overallScore: analysisResult.overallScore,
        label: analysisResult.label,
        categoryScores: analysisResult.categoryScores,
        matchingKeywords: analysisResult.matchingKeywords,
        missingKeywords: analysisResult.missingKeywords,
        matchingSkills: analysisResult.matchingSkills,
        missingSkills: analysisResult.missingSkills,
        partiallyMatchedSkills: analysisResult.partiallyMatchedSkills,
        relevantExperience: analysisResult.relevantExperience,
        missingSections: analysisResult.missingSections,
        formattingIssues: analysisResult.formattingIssues,
        actionableSuggestions: analysisResult.actionableSuggestions,
        disclaimer: analysisResult.disclaimer,
      });
    } else {
      const id = memoryStore.generateId();
      savedAnalysis = {
        _id: id,
        id,
        userId,
        resumeId: resumeId,
        jobDescriptionId: jobDescriptionId,
        ...analysisResult,
        createdAt: new Date(),
      };
      memoryStore.atsAnalyses.set(id, savedAnalysis);
    }

    res.status(201).json({
      success: true,
      message: 'ATS analysis completed.',
      analysis: savedAnalysis,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLatestATSAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let analysis: any;
    if (!fallbackStoreActive) {
      analysis = await ATSAnalysisModel.findOne({ userId }).sort({ createdAt: -1 }).lean();
    } else {
      const userAnalyses = Array.from(memoryStore.atsAnalyses.values()).filter((a) => a.userId === userId);
      analysis = userAnalyses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }

    if (!analysis) {
      res.status(404).json({ success: false, error: 'No ATS analysis records found.' });
      return;
    }

    res.json({ success: true, analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
