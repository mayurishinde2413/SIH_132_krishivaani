import prisma from '../database/prismaClient';
import { getNearbyMarkets } from './marketService';
import axios from 'axios';

export interface NetRealisationInput {
  cropName: string;
  cropId?: number;
  quantityKg: number;
  grade: string; // e.g. "Grade A (FAQ Standard)", "Grade B", "Grade C"
  farmerDistrict: string;
  harvestDate?: string;
}

export interface DeductionDetails {
  grossRevenue: number;
  transportCost: number;
  mandiFees: number;
  expectedWastage: number;
  qualityDeductions: number;
  unloadingPorterage: number;
  netRealisation: number;
  netRealisationPerKg: number;
  retentionPercent: number;
}

export interface MarketNetResult {
  marketId: number;
  marketName: string;
  district: string;
  distanceKm: number;
  quotedPricePerKg: number;
  transitTimeEst: string;
  breakdown: DeductionDetails;
  rank: number;
  isRecommended: boolean;
  keyReason: string;
}

export const calculateNetRealisation = async (input: NetRealisationInput) => {
  const { cropName, cropId, quantityKg, grade, farmerDistrict, harvestDate } = input;

  // 1. Resolve crop from DB
  const crop = cropId
    ? await prisma.crop.findUnique({ where: { id: cropId } })
    : await prisma.crop.findFirst({
        where: { name: { equals: cropName, mode: 'insensitive' } },
      });

  const resolvedCropId = crop ? crop.id : 1;
  const resolvedCropName = crop ? crop.name : cropName;

  // 2. Fetch candidate markets within 120km
  const rawMarkets = await getNearbyMarkets(farmerDistrict, resolvedCropId, 120);

  // Fallback candidate market data if DB has fewer entries
  const candidateMarkets = rawMarkets.map((m) => {
    // Default rate per kg from modal price in quintal (or default 25/kg)
    const ratePerKg = m.latestPrice ? m.latestPrice.modalPrice / 100 : 25.0;
    return {
      marketId: m.id,
      name: m.name,
      district: m.district,
      distanceKm: m.distanceKm || 25,
      quotedPricePerKg: ratePerKg,
      type: m.type,
    };
  });

  // 3. Optional: Call Python ML FastAPI service if available, otherwise compute transparent deterministic engine
  let mlResult: any = null;
  try {
    const mlResponse = await axios.post(
      'http://localhost:8000/ml/net-realisation',
      {
        crop: resolvedCropName,
        quantityKg,
        grade,
        originDistrict: farmerDistrict,
        harvestDate,
        marketPrices: candidateMarkets,
      },
      { timeout: 1500 }
    );
    if (mlResponse.data && mlResponse.data.candidateMarkets) {
      mlResult = mlResponse.data;
    }
  } catch (err) {
    // ML service fallback to built-in TS calculation engine
  }

  if (mlResult) {
    return mlResult;
  }

  // 4. Built-in Transparent Calculation Engine (Standardised Formula)
  const isPerishable = ['tomato', 'onion', 'potato'].includes(resolvedCropName.toLowerCase());
  let gradeDiscountRate = 0.0;
  if (grade.toLowerCase().includes('grade b')) {
    gradeDiscountRate = 0.05;
  } else if (grade.toLowerCase().includes('grade c')) {
    gradeDiscountRate = 0.12;
  }

  const results: MarketNetResult[] = candidateMarkets.map((m) => {
    const quotedRate = m.quotedPricePerKg;
    const dist = m.distanceKm;

    // Gross Revenue
    const gross = Math.round(quantityKg * quotedRate);

    // Transport Cost: ₹300 base handling + ₹16/km per ton
    const transport = Math.round(300 + dist * 16 * (quantityKg / 1000));

    // Mandi Statutory Fees: 0.5% of gross
    const mandiFees = Math.round(gross * 0.005);

    // Expected Transit Wastage
    const wastageRate = (dist / 100.0) * (isPerishable ? 0.008 : 0.002);
    const expectedWastage = Math.round(gross * wastageRate);

    // Quality Deduction
    const qualityDeductions = Math.round(gross * gradeDiscountRate);

    // Unloading & Porterage
    const unloadingPorterage = Math.round(quantityKg * 0.01);

    // Total Net Realisation
    const totalDeductions =
      transport + mandiFees + expectedWastage + qualityDeductions + unloadingPorterage;
    const netRealisation = gross - totalDeductions;
    const netRealisationPerKg = Number((netRealisation / quantityKg).toFixed(2));
    const retentionPercent = gross > 0 ? Number(((netRealisation / gross) * 100).toFixed(1)) : 0;

    const transitMins = Math.round(dist * 1.5 + 15);
    const transitTimeEst =
      transitMins < 60 ? `~${transitMins} mins` : `~${Math.floor(transitMins / 60)}hr ${transitMins % 60}m`;

    return {
      marketId: m.marketId,
      marketName: m.name,
      district: m.district,
      distanceKm: dist,
      quotedPricePerKg: quotedRate,
      transitTimeEst,
      breakdown: {
        grossRevenue: gross,
        transportCost: transport,
        mandiFees,
        expectedWastage,
        qualityDeductions,
        unloadingPorterage,
        netRealisation,
        netRealisationPerKg,
        retentionPercent,
      },
      rank: 0,
      isRecommended: false,
      keyReason: '',
    };
  });

  // Sort by net realisation descending
  results.sort((a, b) => b.breakdown.netRealisation - a.breakdown.netRealisation);

  results.forEach((r, idx) => {
    r.rank = idx + 1;
    r.isRecommended = idx === 0;
    if (idx === 0) {
      r.keyReason = `Minimal distance (${r.distanceKm} km) and lowest diesel drag saves ₹${r.breakdown.transportCost} in freight, generating highest net cash payout.`;
    } else {
      const diff = results[0].breakdown.netRealisation - r.breakdown.netRealisation;
      r.keyReason = `Generates ₹${diff.toLocaleString('en-IN')} less net take-home due to higher transit distance (${r.distanceKm} km) & freight overheads.`;
    }
  });

  return {
    crop: resolvedCropName,
    quantityKg,
    grade,
    originDistrict: farmerDistrict,
    recommendedMarket: results[0] || null,
    candidateMarkets: results,
  };
};
