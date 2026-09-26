import { Router } from 'express';
import { generateImprovements, applyEnhancedResume } from '../controllers/improveController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/generate', optionalAuth, generateImprovements);
router.post('/apply', optionalAuth, applyEnhancedResume);

export default router;
