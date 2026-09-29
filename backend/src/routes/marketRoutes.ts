import { Router } from 'express';
import {
  getMarkets,
  getMarketById,
  getNearbyMarkets,
  searchMarkets,
  getMarketPriceHistory,
} from '../controllers/marketController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// NOTE: specific routes must come before parameterised /:id
router.get('/nearby', authenticate, getNearbyMarkets);
router.get('/search', searchMarkets);
router.get('/', getMarkets);
router.get('/:id/prices', getMarketPriceHistory);
router.get('/:id', getMarketById);

export default router;
