import { Router } from 'express';
import {
  startInterview,
  submitAnswer,
  finishInterviewEarly,
  getInterviewById,
  listUserInterviews,
} from '../controllers/interviewController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/start', optionalAuth, startInterview);
router.post('/answer', optionalAuth, submitAnswer);
router.post('/:id/finish', optionalAuth, finishInterviewEarly);
router.get('/:id', optionalAuth, getInterviewById);
router.get('/', optionalAuth, listUserInterviews);

export default router;
