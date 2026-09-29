import { Request, Response } from 'express';
import * as fpoService from '../services/fpoService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getFPOs = asyncHandler(async (_req: Request, res: Response) => {
  const fpos = await fpoService.getAllFPOs();
  res.json(ok(fpos));
});

export const getFPOById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json(fail('Invalid FPO id'));
  const fpo = await fpoService.getFPOById(id);
  if (!fpo) return res.status(404).json(fail('FPO not found', 404));
  res.json(ok(fpo));
});
