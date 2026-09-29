import { Request, Response } from 'express';
import * as reqService from '../services/buyerRequirementService';
import { ok } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getBuyerRequirements = asyncHandler(async (req: Request, res: Response) => {
  const cropId  = req.query.cropId  ? parseInt(req.query.cropId  as string, 10) : undefined;
  const buyerId = req.query.buyerId ? parseInt(req.query.buyerId as string, 10) : undefined;
  const isActive = req.query.isActive !== 'false'; // default true

  const requirements = await reqService.getBuyerRequirements({ cropId, buyerId, isActive });
  res.json(ok(requirements));
});
