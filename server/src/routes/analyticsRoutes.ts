import { Router } from 'express';
import { getDashboardOverview } from '../controllers/analyticsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', optionalAuth, getDashboardOverview);

export default router;
