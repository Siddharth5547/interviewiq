import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ResumeModel } from '../models/Resume.js';
import { JobDescriptionModel } from '../models/JobDescription.js';
import { ATSAnalysisModel } from '../models/ATSAnalysis.js';
import { InterviewModel } from '../models/Interview.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const getDashboardOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    let resume: any;
    let job: any;
    let latestATS: any;
    let interviews: any[] = [];

    if (!fallbackStoreActive) {
      const [r, j, ats, ivs] = await Promise.all([
        ResumeModel.findOne({ userId }, { filename: 1, updatedAt: 1, createdAt: 1, 'parsedData.skills.all': 1, intelligenceTags: 1 }).sort({ createdAt: -1 }).lean(),
        JobDescriptionModel.findOne({ userId }, { title: 1, company: 1 }).sort({ createdAt: -1 }).lean(),
        ATSAnalysisModel.findOne({ userId }, { overallScore: 1, label: 1, matchingKeywords: 1, missingKeywords: 1, missingSkills: 1 }).sort({ createdAt: -1 }).lean(),
        InterviewModel.find({ userId }, { status: 1, type: 1, startedAt: 1, completedAt: 1, 'finalReport.overallScore': 1, 'finalReport.categories': 1, 'finalReport.weakTopics': 1 }).sort({ createdAt: -1 }).lean(),
      ]);
      resume = r;
      job = j;
      latestATS = ats;
      interviews = ivs;
    } else {
      const userResumes = Array.from(memoryStore.resumes.values()).filter((r) => r.userId === userId);
      resume = userResumes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      const userJobs = Array.from(memoryStore.jobs.values()).filter((j) => j.userId === userId);
      job = userJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      const userATS = Array.from(memoryStore.atsAnalyses.values()).filter((a) => a.userId === userId);
      latestATS = userATS.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      interviews = Array.from(memoryStore.interviews.values())
        .filter((i) => i.userId === userId)
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    }

    const completedInterviews = interviews.filter((i) => i.status === 'completed');
    const avgScore =
      completedInterviews.length > 0
        ? Math.round(
            completedInterviews.reduce((acc, curr) => acc + (curr.finalReport?.overallScore || 0), 0) /
              completedInterviews.length
          )
        : null;

    const progressTrend = completedInterviews.slice(-6).map((ci, idx) => ({
      session: ci.type || `Mock #${idx + 1}`,
      date: new Date(ci.completedAt || ci.startedAt || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: ci.finalReport?.overallScore || 0,
      ats: latestATS?.overallScore || 0,
      technical: ci.finalReport?.categories?.technicalKnowledge || 0,
      communication: ci.finalReport?.categories?.communication || 0,
    }));

    res.json({
      success: true,
      data: {
        hasData: !!(resume || job || latestATS || completedInterviews.length > 0),
        resume: resume
          ? {
              exists: true,
              filename: resume.filename,
              lastAnalyzed: resume.updatedAt || resume.createdAt || new Date(),
              skillsCount: resume.parsedData?.skills?.all?.length || 0,
              intelligenceDomains: resume.intelligenceTags || [],
            }
          : {
              exists: false,
              filename: '',
              lastAnalyzed: null,
              skillsCount: 0,
              intelligenceDomains: [],
            },
        ats: latestATS
          ? {
              score: latestATS.overallScore,
              label: latestATS.label || 'Estimated ATS Compatibility',
              matchingKeywordsCount: latestATS.matchingKeywords?.length || 0,
              missingKeywordsCount: latestATS.missingKeywords?.length || 0,
            }
          : null,
        targetJob: job
          ? {
              title: job.title || 'Target Role',
              company: job.company || 'Target Organization',
              matchPercentage: latestATS?.overallScore || null,
              missingSkills: latestATS?.missingSkills?.slice(0, 4) || [],
            }
          : null,
        interview: {
          totalCompleted: completedInterviews.length,
          latestScore: completedInterviews[0]?.finalReport?.overallScore || null,
          averageScore: avgScore,
          weakestTopic: completedInterviews[0]?.finalReport?.weakTopics?.[0] || null,
          strongestTopic: completedInterviews[0] ? 'System Architecture & Tech Selection' : null,
        },
        progressTrend,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
