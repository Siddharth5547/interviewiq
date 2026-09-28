import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { opportunityService } from '../services/opportunityService.js';
import { ResumeModel } from '../models/Resume.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const listOpportunities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employmentType, remoteType, search } = req.query;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    // Fetch user resume if available to compute live match scores
    const [resume, oppResult] = await Promise.all([
      !fallbackStoreActive
        ? ResumeModel.findOne({ userId }, { parsedData: 1 }).sort({ createdAt: -1 }).lean()
        : Promise.resolve(
            Array.from(memoryStore.resumes.values())
              .filter((r) => r.userId === userId)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
          ),
      opportunityService.listOpportunities({
        employmentType: employmentType as string,
        remoteType: remoteType as string,
        search: search as string,
      }),
    ]);

    const { opportunities, totalCount } = oppResult;

    // Compute live match for each opportunity if resume exists
    const enriched = opportunities.map((opp) => {
      let match = null;
      if (resume?.parsedData) {
        match = opportunityService.computeOpportunityMatch(resume.parsedData, opp);
      }
      return {
        ...opp,
        match,
      };
    });

    // If resume exists, sort by match score descending by default
    if (resume?.parsedData) {
      enriched.sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0));
    }

    res.json({
      success: true,
      opportunities: enriched,
      totalCount,
      hasResume: !!resume,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOpportunityDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || 'guest-user-session';
    const { fallbackStoreActive } = getDBStatus();

    const [opportunity, resume] = await Promise.all([
      opportunityService.getOpportunityById(id),
      !fallbackStoreActive
        ? ResumeModel.findOne({ userId }, { parsedData: 1 }).sort({ createdAt: -1 }).lean()
        : Promise.resolve(
            Array.from(memoryStore.resumes.values())
              .filter((r) => r.userId === userId)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
          ),
    ]);

    if (!opportunity) {
      res.status(404).json({ success: false, error: 'Opportunity not found.' });
      return;
    }

    let match = null;
    if (resume?.parsedData) {
      match = opportunityService.computeOpportunityMatch(resume.parsedData, opportunity);
    }

    res.json({
      success: true,
      opportunity,
      match,
      resumeId: resume?._id || resume?.id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const preferences = opportunityService.getCandidatePreferences(userId);
    res.json({ success: true, preferences });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const updated = opportunityService.updateCandidatePreferences(userId, req.body);
    res.json({ success: true, preferences: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
