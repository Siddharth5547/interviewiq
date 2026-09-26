import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { applicationService } from '../services/applicationService.js';

export const listApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { status, employmentType, search } = req.query;

    const applications = await applicationService.listApplications(userId, {
      status: status as string,
      employmentType: employmentType as string,
      search: search as string,
    });

    res.json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const application = await applicationService.createApplication(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Application recorded in tracker.',
      application,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { id } = req.params;

    const updated = await applicationService.updateApplication(userId, id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Application record not found or unauthorized.' });
      return;
    }

    res.json({
      success: true,
      message: 'Application updated.',
      application: updated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const { id } = req.params;

    const deleted = await applicationService.deleteApplication(userId, id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Application record not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Application removed from tracker.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getApplicationAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'guest-user-session';
    const analytics = await applicationService.getAnalytics(userId);

    res.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
