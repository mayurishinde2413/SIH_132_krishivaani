import { Router } from 'express';
import {
  getMatches,
  createBid,
  counterBid,
  acceptBid,
  rejectBid,
  getTransaction,
} from '../controllers/buyerMatchingController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Matches
router.get('/buyers/matches', authenticate, getMatches);

// Bidding & Transactions
router.post('/bids', authenticate, createBid);
router.post('/bids/:id/counter', authenticate, counterBid);
router.post('/bids/:id/accept', authenticate, acceptBid);
router.post('/bids/:id/reject', authenticate, rejectBid);

// Transactions
router.get('/transactions/:id', authenticate, getTransaction);

export default router;
