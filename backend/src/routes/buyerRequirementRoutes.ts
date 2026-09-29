import { Router } from 'express';
import { getBuyerRequirements } from '../controllers/buyerRequirementController';

const router = Router();

router.get('/', getBuyerRequirements);

export default router;
