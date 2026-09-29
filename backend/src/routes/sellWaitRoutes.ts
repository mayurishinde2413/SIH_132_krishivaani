import { Router } from 'express';
import { analyze } from '../controllers/sellWaitController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/analyze', authenticate, analyze);

export default router;
