import { Router } from 'express';
import { uploadResume, updateParsedResume, getResumeById, getLatestResume, createDemoResume } from '../controllers/resumeController.js';
import { uploadResumeMiddleware } from '../middleware/upload.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/upload', optionalAuth, uploadResumeMiddleware.single('resume'), uploadResume);
router.post('/demo', optionalAuth, createDemoResume);
router.get('/latest', optionalAuth, getLatestResume);
router.get('/:id', optionalAuth, getResumeById);
router.put('/:id', optionalAuth, updateParsedResume);

export default router;
