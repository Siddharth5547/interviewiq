import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { jobAnalyzer } from '../services/jobAnalyzer.js';
import { JobDescriptionModel } from '../models/JobDescription.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const createJobDescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rawText, title, company } = req.body;
    const userId = req.user?.userId || 'guest-user-session';

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Job description text is required.' });
      return;
    }

    const parsed = await jobAnalyzer.analyzeJobText(rawText, company || 'Target Company');
    const finalTitle = title || parsed.title || 'Software Engineer';
    const finalCompany = company || parsed.company || 'Tech Innovators Inc.';

    const { fallbackStoreActive } = getDBStatus();
    let savedJob: any;

    if (!fallbackStoreActive) {
      savedJob = await JobDescriptionModel.create({
        userId,
        title: finalTitle,
        company: finalCompany,
        rawText,
        requiredSkills: parsed.requiredSkills,
        preferredSkills: parsed.preferredSkills,
        responsibilities: parsed.responsibilities,
        qualifications: parsed.qualifications,
        experienceRequirements: parsed.experienceRequirements,
        techKeywords: parsed.techKeywords,
        softSkills: parsed.softSkills,
      });
    } else {
      const id = memoryStore.generateId();
      savedJob = {
        _id: id,
        id,
        userId,
        title: finalTitle,
        company: finalCompany,
        rawText,
        requiredSkills: parsed.requiredSkills,
        preferredSkills: parsed.preferredSkills,
        responsibilities: parsed.responsibilities,
        qualifications: parsed.qualifications,
        experienceRequirements: parsed.experienceRequirements,
        techKeywords: parsed.techKeywords,
        softSkills: parsed.softSkills,
        createdAt: new Date(),
      };
      memoryStore.jobs.set(id, savedJob);
    }

    res.status(201).json({
      success: true,
      message: 'Job description analyzed and saved.',
      job: savedJob,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLatestJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let job: any;
    if (!fallbackStoreActive) {
      job = await JobDescriptionModel.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      const userJobs = Array.from(memoryStore.jobs.values()).filter((j) => j.userId === userId);
      job = userJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }

    if (!job) {
      return createDemoJob(req, res);
    }

    res.json({ success: true, job });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDemoJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const sampleJD = `
Job Title: Full Stack Software Engineer
Company: Stripe & Co. Labs
Location: San Francisco, CA / Remote

About The Role:
We are seeking a high-performing Full Stack Software Engineer to build scalable customer-facing applications and reliable distributed backend services. You will architect intuitive web applications, design REST and GraphQL APIs, and collaborate on database query performance.

Key Responsibilities:
- Design and engineer reliable, performant frontend applications using React.js and TypeScript.
- Architect scalable backend microservices and RESTful APIs using Node.js and Express.
- Model and maintain relational and document databases (PostgreSQL, MongoDB, Redis).
- Safeguard system security with JWT, OAuth2, and rigorous input validation.
- Implement CI/CD pipelines, containerize applications with Docker, and deploy to AWS.
- Collaborate with product designers and engineers in agile sprint cycles.

Requirements & Qualifications:
- 2+ years of professional full-stack development experience.
- Strong proficiency in JavaScript/TypeScript, React.js, and Node.js.
- Practical experience with MongoDB or PostgreSQL and cache strategies with Redis.
- Familiarity with Docker, Git version control, and automated testing frameworks (Jest).
- Excellent written and verbal communication skills and a passion for engineering excellence.
`;

    const parsed = await jobAnalyzer.analyzeJobText(sampleJD, 'Stripe & Co. Labs');
    const { fallbackStoreActive } = getDBStatus();

    let job: any;
    if (!fallbackStoreActive) {
      job = await JobDescriptionModel.create({
        userId,
        title: 'Full Stack Software Engineer',
        company: 'Stripe & Co. Labs',
        rawText: sampleJD,
        requiredSkills: parsed.requiredSkills,
        preferredSkills: parsed.preferredSkills,
        responsibilities: parsed.responsibilities,
        qualifications: parsed.qualifications,
        experienceRequirements: parsed.experienceRequirements,
        techKeywords: parsed.techKeywords,
        softSkills: parsed.softSkills,
      });
    } else {
      const id = 'demo-job-fullstack';
      job = {
        _id: id,
        id,
        userId,
        title: 'Full Stack Software Engineer',
        company: 'Stripe & Co. Labs',
        rawText: sampleJD,
        requiredSkills: parsed.requiredSkills,
        preferredSkills: parsed.preferredSkills,
        responsibilities: parsed.responsibilities,
        qualifications: parsed.qualifications,
        experienceRequirements: parsed.experienceRequirements,
        techKeywords: parsed.techKeywords,
        softSkills: parsed.softSkills,
        createdAt: new Date(),
      };
      memoryStore.jobs.set(id, job);
    }

    res.json({
      success: true,
      message: 'Demo job description initialized.',
      job,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
