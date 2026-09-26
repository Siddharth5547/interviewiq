import { Router } from 'express';
import { analyzeATS, getLatestATSAnalysis } from '../controllers/atsController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/analyze', optionalAuth, analyzeATS);
router.get('/latest', optionalAuth, getLatestATSAnalysis);

export default router;
