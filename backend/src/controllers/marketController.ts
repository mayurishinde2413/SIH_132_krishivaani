import { Request, Response } from 'express';
import * as marketService from '../services/marketService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getMarkets = asyncHandler(async (_req: Request, res: Response) => {
  const markets = await marketService.getAllMarkets();
  res.json(ok(markets));
});

export const getMarketById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json(fail('Invalid market id'));
  const market = await marketService.getMarketById(id);
  if (!market) return res.status(404).json(fail('Market not found', 404));
  res.json(ok(market));
});

// GET /api/markets/nearby?cropId=1&district=Pune&radius=50
export const getNearbyMarkets = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // District can come from query param or from authenticated farmer's profile
  let district = req.query.district as string | undefined;
  const cropId = req.query.cropId ? parseInt(req.query.cropId as string, 10) : undefined;
  const radius = req.query.radius ? parseInt(req.query.radius as string, 10) : 100;

  // If authenticated farmer and no district in query, use their registered district
  if (!district && req.user?.role === 'FARMER') {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    try {
      const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.id } });
      district = farmer?.district ?? undefined;
    } finally {
      await prisma.$disconnect();
    }
  }

  if (!district) {
    return res.status(400).json(fail('Farmer district is required. Pass ?district=Pune or login as a farmer.', 400));
  }

  const markets = await marketService.getNearbyMarkets(district, cropId, radius);
  res.json(ok(markets, `Found ${markets.length} markets within ${radius}km of ${district}`));
});

// GET /api/markets/search?q=Nashik
export const searchMarkets = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.query.q as string)?.trim();
  if (!query || query.length < 2) {
    return res.status(400).json(fail('Search query must be at least 2 characters', 400));
  }
  const markets = await marketService.searchMarkets(query);
  res.json(ok(markets));
});

// GET /api/markets/:id/prices?cropId=1
export const getMarketPriceHistory = asyncHandler(async (req: Request, res: Response) => {
  const marketId = parseInt(req.params.id, 10);
  const cropId = req.query.cropId ? parseInt(req.query.cropId as string, 10) : undefined;

  if (isNaN(marketId)) return res.status(400).json(fail('Invalid market id'));
  if (!cropId || isNaN(cropId)) {
    return res.status(400).json(fail('cropId query parameter is required', 400));
  }

  const data = await marketService.getMarketPriceHistory(marketId, cropId);
  if (!data) return res.status(404).json(fail('Market not found', 404));
  res.json(ok(data));
});
