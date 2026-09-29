import { Request, Response } from 'express';
import * as sellWaitService from '../services/sellWaitService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const analyze = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { cropName, quantityQuintals, currentMarketPrice, hasColdStorage, district } = req.body;

  if (!cropName) {
    return res.status(400).json(fail('Crop name is required', 400));
  }

  const parsedQty = parseFloat(quantityQuintals);
  if (isNaN(parsedQty) || parsedQty <= 0) {
    return res.status(400).json(fail('Valid positive quantity in quintals is required', 400));
  }

  let originDistrict = district;
  if (!originDistrict && req.user?.role === 'FARMER') {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    try {
      const farmer = await prisma.farmer.findUnique({ where: { userId: req.user.id } });
      originDistrict = farmer?.district;
    } finally {
      await prisma.$disconnect();
    }
  }

  const result = await sellWaitService.analyzeSellWait({
    cropName,
    quantityQuintals: parsedQty,
    currentMarketPrice: currentMarketPrice ? parseFloat(currentMarketPrice) : undefined,
    hasColdStorage: hasColdStorage !== false,
    farmerDistrict: originDistrict || 'Pune',
  });

  res.json(ok(result, 'Sell Now vs Wait analysis completed successfully'));
});
