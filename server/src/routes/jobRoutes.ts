import { Router } from 'express';
import { createJobDescription, getLatestJob, createDemoJob } from '../controllers/jobController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', optionalAuth, createJobDescription);
router.post('/demo', optionalAuth, createDemoJob);
router.get('/latest', optionalAuth, getLatestJob);

export default router;
