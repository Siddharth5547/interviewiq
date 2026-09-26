import { Router } from 'express';
import {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationAnalytics,
} from '../controllers/applicationController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, listApplications);
router.post('/', optionalAuth, createApplication);
router.get('/analytics', optionalAuth, getApplicationAnalytics);
router.put('/:id', optionalAuth, updateApplication);
router.delete('/:id', optionalAuth, deleteApplication);

export default router;
