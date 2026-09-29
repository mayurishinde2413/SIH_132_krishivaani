import { Router } from 'express';
import { getFPOs, getFPOById } from '../controllers/fpoController';

const router = Router();

router.get('/', getFPOs);
router.get('/:id', getFPOById);

export default router;
