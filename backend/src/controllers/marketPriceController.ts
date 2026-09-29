import { Request, Response } from 'express';
import * as marketPriceService from '../services/marketPriceService';
import { ok } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getMarketPrices = asyncHandler(async (req: Request, res: Response) => {
  const cropId   = req.query.cropId   ? parseInt(req.query.cropId   as string, 10) : undefined;
  const marketId = req.query.marketId ? parseInt(req.query.marketId as string, 10) : undefined;
  const limit    = req.query.limit    ? parseInt(req.query.limit    as string, 10) : 50;
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate   = req.query.endDate   ? new Date(req.query.endDate   as string) : undefined;

  const prices = await marketPriceService.getMarketPrices({
    cropId,
    marketId,
    startDate,
    endDate,
    limit,
  });
  res.json(ok(prices));
});
