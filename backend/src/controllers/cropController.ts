import { Request, Response } from 'express';
import * as cropService from '../services/cropService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getCrops = asyncHandler(async (_req: Request, res: Response) => {
  const crops = await cropService.getAllCrops();
  res.json(ok(crops));
});

export const getCropById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json(fail('Invalid crop id'));
  const crop = await cropService.getCropById(id);
  if (!crop) return res.status(404).json(fail('Crop not found', 404));
  res.json(ok(crop));
});
