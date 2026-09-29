import { Router } from 'express';
import { calculate } from '../controllers/netRealisationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/calculate', authenticate, calculate);

export default router;
