import { Request, Response } from 'express';
import * as fpoAggService from '../services/fpoAggregationService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getRequirements = asyncHandler(async (_req: Request, res: Response) => {
  const reqs = await fpoAggService.getActiveFPORequirements();
  res.json(ok(reqs));
});

export const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const crop = (req.query.crop as string) || 'Tomato';
  const grade = (req.query.grade as string) || 'Grade A';
  const members = await fpoAggService.getFPOMembersForRequirement(crop, grade);
  res.json(ok(members));
});

export const aggregateLot = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    cropName,
    grade,
    offeredPrice,
    allocations,
    buyerId,
    requirementId,
    dispatchYard,
    destinationHub,
    dispatchDate,
  } = req.body;

  if (!cropName || !offeredPrice || !allocations || !Array.isArray(allocations) || allocations.length === 0) {
    return res.status(400).json(fail('Crop name, offered price, and farmer allocations are required', 400));
  }

  const createdLot = await fpoAggService.aggregateFPOLot({
    cropName,
    grade,
    offeredPrice: parseFloat(offeredPrice),
    allocations,
    buyerId: buyerId ? parseInt(buyerId, 10) : undefined,
    requirementId: requirementId ? parseInt(requirementId, 10) : undefined,
    dispatchYard,
    destinationHub,
    dispatchDate,
  });

  res.status(201).json(ok(createdLot, 'Common FPO Lot successfully created and submitted to buyer'));
});

export const getLotById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json(fail('Invalid lot id'));
  const lot = await fpoAggService.getFPOLotById(id);
  if (!lot) return res.status(404).json(fail('FPO lot not found', 404));
  res.json(ok(lot));
});
