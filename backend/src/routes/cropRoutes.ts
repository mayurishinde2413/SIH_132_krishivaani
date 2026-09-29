import { Router } from 'express';
import { getCrops, getCropById } from '../controllers/cropController';

const router = Router();

router.get('/', getCrops);
router.get('/:id', getCropById);

export default router;
