import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { resumeParser } from '../services/resumeParser.js';
import { ResumeModel, IResume } from '../models/Resume.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';
import { resumeIntelligence } from '../services/resumeIntelligence.js';

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const userId = req.user?.userId || 'guest-user-session';

    if (!file) {
      res.status(400).json({ success: false, error: 'No resume file uploaded.' });
      return;
    }

    const rawText = await resumeParser.extractRawText(file.buffer, file.originalname, file.mimetype);
    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Failed to extract text from the uploaded file or file is empty.' });
      return;
    }

    const { parsedData, intelligenceTags } = await resumeParser.parseResumeText(rawText);
    const { fallbackStoreActive } = getDBStatus();

    let savedResume: any;
    if (!fallbackStoreActive) {
      savedResume = await ResumeModel.create({
        userId,
        filename: file.originalname,
        fileType: file.originalname.split('.').pop() || 'pdf',
        rawText,
        parsedData,
        intelligenceTags,
      });
    } else {
      const id = memoryStore.generateId();
      savedResume = {
        _id: id,
        id,
        userId,
        filename: file.originalname,
        fileType: file.originalname.split('.').pop() || 'pdf',
        rawText,
        parsedData,
        intelligenceTags,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.resumes.set(id, savedResume);
    }

    res.status(201).json({
      success: true,
      message: 'Resume parsed and stored successfully.',
      resume: savedResume,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateParsedResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { parsedData } = req.body;
    const userId = req.user?.userId || 'guest-user-session';

    if (!parsedData) {
      res.status(400).json({ success: false, error: 'parsedData payload is required.' });
      return;
    }

    const updatedTags = resumeIntelligence.inferDomains(parsedData.skills?.all || [], parsedData.projects || []);
    const { fallbackStoreActive } = getDBStatus();

    let updatedResume: any;
    if (!fallbackStoreActive) {
      updatedResume = await ResumeModel.findOneAndUpdate(
        { _id: id, userId },
        { $set: { parsedData, intelligenceTags: updatedTags } },
        { new: true }
      );
    } else {
      const existing = memoryStore.resumes.get(id);
      if (existing) {
        existing.parsedData = parsedData;
        existing.intelligenceTags = updatedTags;
        existing.updatedAt = new Date();
        memoryStore.resumes.set(id, existing);
        updatedResume = existing;
      }
    }

    if (!updatedResume) {
      res.status(404).json({ success: false, error: 'Resume not found or access denied.' });
      return;
    }

    res.json({
      success: true,
      message: 'Resume information updated.',
      resume: updatedResume,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let resume: any;
    if (!fallbackStoreActive) {
      resume = await ResumeModel.findOne({ _id: id, userId });
    } else {
      resume = memoryStore.resumes.get(id);
    }

    if (!resume) {
      res.status(404).json({ success: false, error: 'Resume not found.' });
      return;
    }

    res.json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLatestResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let resume: any;
    if (!fallbackStoreActive) {
      resume = await ResumeModel.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      const userResumes = Array.from(memoryStore.resumes.values()).filter((r) => r.userId === userId);
      resume = userResumes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }

    if (!resume) {
      // Create and return an initial demo resume for seamless exploration
      return createDemoResume(req, res);
    }

    res.json({ success: true, resume });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDemoResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const sampleRaw = `
Alex Chen
San Francisco, CA | alex.chen@example.com | (555) 234-5678 | linkedin.com/in/alexchen-dev | github.com/alexchen

PROFESSIONAL SUMMARY
Full-Stack Software Engineer with 3+ years of experience building resilient web applications, distributed APIs, and real-time platforms. Proficient in React, Node.js, TypeScript, and MongoDB with a focus on clean architecture and performance.

TECHNICAL SKILLS
- Programming Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
- Frameworks & Libraries: React.js, Next.js, Node.js, Express.js, Tailwind CSS, Redux Toolkit
- Databases & Storage: MongoDB, PostgreSQL, Redis
- Tools & DevOps: Git, Docker, AWS (S3, EC2), Postman, Jest, CI/CD (GitHub Actions)

PROJECTS
CampusIQ — Comprehensive Complaint & Resource Management Platform (React, Node.js, Express, MongoDB, JWT)
- Designed and built a full-stack campus management portal used by 2,500+ students and staff.
- Implemented JWT-based role-based access control and encrypted token refresh cycles.
- Engineered 18+ RESTful API endpoints with input validation, rate limiting, and centralized error handling.

CloudTrace — Real-time Distributed Event Monitoring System (TypeScript, Node.js, Redis, PostgreSQL)
- Architected an event collection service handling 10,000+ events/minute with Redis pub/sub queue buffering.
- Optimized PostgreSQL queries with compound B-tree indexing, decreasing P95 query latency by 42%.

WORK EXPERIENCE
Associate Software Engineer — Nexus Dynamics (June 2023 – Present)
- Developed and maintained responsive client-facing interfaces with React.js and Tailwind CSS.
- Collaborated in an Agile team of 6 engineers, participating in bi-weekly sprints, code reviews, and unit testing.

EDUCATION
Bachelor of Science in Computer Science — University of California (2020 – 2024) | GPA: 3.82/4.0
`;

    const { parsedData, intelligenceTags } = await resumeParser.parseResumeText(sampleRaw);
    const { fallbackStoreActive } = getDBStatus();

    let resume: any;
    if (!fallbackStoreActive) {
      resume = await ResumeModel.create({
        userId,
        filename: 'Alex_Chen_Software_Engineer_Resume.pdf',
        fileType: 'pdf',
        rawText: sampleRaw,
        parsedData,
        intelligenceTags,
      });
    } else {
      const id = 'demo-resume-alex-chen';
      resume = {
        _id: id,
        id,
        userId,
        filename: 'Alex_Chen_Software_Engineer_Resume.pdf',
        fileType: 'pdf',
        rawText: sampleRaw,
        parsedData,
        intelligenceTags,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.resumes.set(id, resume);
    }

    res.json({
      success: true,
      message: 'Demo resume loaded.',
      resume,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
