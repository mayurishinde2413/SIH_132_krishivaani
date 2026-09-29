import { Response } from 'express';
import * as rescueService from '../services/rescueService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { RescueStatus } from '@prisma/client';
import prisma from '../database/prismaClient';

// Helper to find farmerId from user
async function getFarmerIdFromUser(userId?: number): Promise<number | null> {
  if (!userId) return null;
  const farmer = await prisma.farmer.findUnique({
    where: { userId },
    select: { id: true },
  });
  return farmer?.id ?? null;
}

// POST /api/rescue/create  and  POST /api/rescue/cases
export const createRescueCase = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { cropId, cropName, problemType, quantity, description, actionTaken } = req.body;

    if (!problemType) {
      return res.status(400).json(fail('Problem type is required', 400));
    }

    // Default farmer fallback if test token or demo
    let farmerId = await getFarmerIdFromUser(req.user?.id);
    if (!farmerId) {
      const firstFarmer = await prisma.farmer.findFirst({ select: { id: true } });
      farmerId = firstFarmer?.id || 1;
    }

    const rescueCase = await rescueService.createRescueCase({
      farmerId,
      cropId: cropId ? parseInt(cropId, 10) : undefined,
      cropName: cropName || 'Tomato',
      problemType: problemType || 'Buyer Cancelled',
      quantity: quantity ? parseFloat(quantity) : 30,
      description: description || `Emergency triggered: ${problemType}`,
      actionTaken,
    });

    res.status(201).json(ok(rescueCase, 'Emergency rescue incident registered successfully'));
  }
);

// GET /api/rescue/options?problemType=Buyer+Cancelled
export const getRescueOptions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const problemType = (req.query.problemType as string) || 'Buyer Cancelled';
    const options = rescueService.getRescueOptions(problemType);
    res.json(ok(options));
  }
);

// GET /api/rescue/buyers?crop=Tomato
export const getRescueBuyers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const crop = (req.query.crop as string) || 'Tomato';
    const buyers = await rescueService.getRescueBuyers(crop);
    res.json(ok(buyers));
  }
);

// GET /api/rescue/markets?crop=Tomato
export const getRescueMarkets = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const crop = (req.query.crop as string) || 'Tomato';
    const markets = await rescueService.getRescueMarkets(crop);
    res.json(ok(markets));
  }
);

// GET /api/rescue/storage
export const getRescueStorage = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response) => {
    const storage = await rescueService.getRescueStorage();
    res.json(ok(storage));
  }
);

// GET /api/rescue/cases
export const getRescueCases = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const role = req.user?.role;

    if (role === 'BUYER') {
      const cases = await rescueService.getAllRescueCases();
      return res.json(ok(cases));
    }

    let farmerId = await getFarmerIdFromUser(req.user?.id);
    if (!farmerId) {
      const firstFarmer = await prisma.farmer.findFirst({ select: { id: true } });
      farmerId = firstFarmer?.id || 1;
    }

    const cases = await rescueService.getRescueCasesByFarmer(farmerId);
    res.json(ok(cases));
  }
);

// PATCH /api/rescue/cases/:id/status
export const updateCaseStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json(fail('Invalid case ID', 400));
    }

    const validStatuses: RescueStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
    if (!status || !validStatuses.includes(status as RescueStatus)) {
      return res.status(400).json(
        fail(`Status must be one of: ${validStatuses.join(', ')}`, 400)
      );
    }

    let farmerId: number | undefined;
    if (req.user?.role === 'FARMER') {
      farmerId = (await getFarmerIdFromUser(req.user.id)) ?? undefined;
    }

    const updated = await rescueService.updateRescueCaseStatus(
      id,
      status as RescueStatus,
      farmerId
    );

    res.json(ok(updated, `Case status updated to ${status}`));
  }
);
