import { Request, Response } from 'express';
import * as matchService from '../services/buyerMatchingService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// GET /api/buyers/matches?crop=Tomato&quantity=30&district=Pune
export const getMatches = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const cropName = (req.query.crop as string) || 'Tomato';
  const quantityQuintals = parseFloat(req.query.quantity as string) || 30;
  const grade = (req.query.grade as string) || 'Grade A (Firm Red, >45mm)';
  const district = (req.query.district as string) || 'Pune';

  const matches = await matchService.getMatchingBuyers({
    cropName,
    quantityQuintals,
    grade,
    farmerDistrict: district,
  });

  res.json(ok(matches, `Found ${matches.length} matching verified buyers`));
});

// POST /api/bids
export const createBid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { buyerId, cropName, quantityQuintals, askingPricePerQuintal, grade, message } = req.body;

  if (!buyerId || !cropName || !quantityQuintals || !askingPricePerQuintal) {
    return res.status(400).json(fail('Missing required bid parameters', 400));
  }

  // Farmer ID from auth token or default 1
  const farmerId = req.user?.id ? req.user.id : 1;

  const bid = await matchService.createBidOffer({
    buyerId: parseInt(buyerId, 10),
    cropName,
    quantityQuintals: parseFloat(quantityQuintals),
    askingPricePerQuintal: parseFloat(askingPricePerQuintal),
    farmerId,
    grade,
    message,
  });

  res.status(201).json(ok(bid, 'Offer bid successfully submitted to buyer'));
});

// POST /api/bids/:id/counter
export const counterBid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const offerId = parseInt(req.params.id, 10);
  const { counterPricePerQuintal, message } = req.body;

  if (isNaN(offerId) || !counterPricePerQuintal) {
    return res.status(400).json(fail('Valid offer ID and counter price are required', 400));
  }

  const updatedBid = await matchService.counterBidOffer({
    offerId,
    counterPricePerQuintal: parseFloat(counterPricePerQuintal),
    message,
  });

  res.json(ok(updatedBid, 'Counter offer submitted'));
});

// POST /api/bids/:id/accept
export const acceptBid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const offerId = parseInt(req.params.id, 10);
  if (isNaN(offerId)) return res.status(400).json(fail('Invalid offer ID', 400));

  const transaction = await matchService.acceptBidOffer(offerId);
  if (!transaction) return res.status(404).json(fail('Offer not found', 404));

  res.json(ok(transaction, 'Offer accepted and transaction contract initiated'));
});

// POST /api/bids/:id/reject
export const rejectBid = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const offerId = parseInt(req.params.id, 10);
  if (isNaN(offerId)) return res.status(400).json(fail('Invalid offer ID', 400));

  const rejected = await matchService.rejectBidOffer(offerId);
  res.json(ok(rejected, 'Offer declined'));
});

// GET /api/transactions/:id
export const getTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json(fail('Invalid transaction ID', 400));

  const tx = await matchService.getTransactionById(id);
  if (!tx) return res.status(404).json(fail('Transaction not found', 404));

  res.json(ok(tx));
});
