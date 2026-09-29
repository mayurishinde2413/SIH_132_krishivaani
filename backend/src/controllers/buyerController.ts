import { Request, Response } from 'express';
import * as buyerService from '../services/buyerService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getBuyers = asyncHandler(async (_req: Request, res: Response) => {
  const buyers = await buyerService.getAllBuyers();
  res.json(ok(buyers));
});

export const getBuyerById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json(fail('Invalid buyer id'));
  const buyer = await buyerService.getBuyerById(id);
  if (!buyer) return res.status(404).json(fail('Buyer not found', 404));
  res.json(ok(buyer));
});
