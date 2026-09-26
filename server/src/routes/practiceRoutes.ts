import { Router } from 'express';
import {
  getDetectedWeakAreas,
  startPracticeSession,
  submitPracticeAnswer,
} from '../controllers/practiceController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/weak-areas', optionalAuth, getDetectedWeakAreas);
router.post('/start', optionalAuth, startPracticeSession);
router.post('/answer', optionalAuth, submitPracticeAnswer);

export default router;
