import { Router } from 'express';
import {
  getRequirements,
  getMembers,
  aggregateLot,
  getLotById,
} from '../controllers/fpoAggregationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/requirements', authenticate, getRequirements);
router.get('/members', authenticate, getMembers);
router.post('/aggregate', authenticate, aggregateLot);
router.get('/lots/:id', authenticate, getLotById);

export default router;
