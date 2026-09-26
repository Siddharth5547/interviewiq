import { Router } from 'express';
import {
  listOpportunities,
  getOpportunityDetails,
  getPreferences,
  updatePreferences,
} from '../controllers/opportunityController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, listOpportunities);
router.get('/preferences', optionalAuth, getPreferences);
router.put('/preferences', optionalAuth, updatePreferences);
router.get('/:id', optionalAuth, getOpportunityDetails);

export default router;
