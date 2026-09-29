import { Router } from 'express';
import { getBuyers, getBuyerById } from '../controllers/buyerController';

const router = Router();

router.get('/', getBuyers);
router.get('/:id', getBuyerById);

export default router;
