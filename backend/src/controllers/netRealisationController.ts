import { Request, Response } from 'express';
import * as netRealisationService from '../services/netRealisationService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const calculate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { cropName, cropId, quantityKg, grade, district, harvestDate } = req.body;

  if (!cropName && !cropId) {
    return res.status(400).json(fail('Crop name or Crop ID is required', 400));
  }

  const parsedQty = parseFloat(quantityKg);
  if (isNaN(parsedQty) || parsedQty <= 0) {
    return res.status(400).json(fail('Valid positive quantity in kg is required', 400));
  }

  // Use requested district or default to authenticated farmer's district
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

  if (!originDistrict) {
    originDistrict = 'Pune'; // fallback default
  }

  const result = await netRealisationService.calculateNetRealisation({
    cropName: cropName || 'Tomato',
    cropId: cropId ? parseInt(cropId, 10) : undefined,
    quantityKg: parsedQty,
    grade: grade || 'Grade A (FAQ Standard)',
    farmerDistrict: originDistrict,
    harvestDate,
  });

  res.json(ok(result, 'Net Realisation calculated successfully'));
});
