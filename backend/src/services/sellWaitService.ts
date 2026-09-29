import axios from 'axios';
import prisma from '../database/prismaClient';

export interface SellWaitAnalysisInput {
  cropName: string;
  quantityQuintals: number;
  currentMarketPrice?: number;
  hasColdStorage?: boolean;
  farmerDistrict?: string;
}

export const analyzeSellWait = async (input: SellWaitAnalysisInput) => {
  const {
    cropName,
    quantityQuintals,
    currentMarketPrice,
    hasColdStorage = true,
    farmerDistrict = 'Pune',
  } = input;

  // 1. Resolve crop and current APMC price from database if not provided
  let price = currentMarketPrice;
  if (!price) {
    const crop = await prisma.crop.findFirst({
      where: { name: { equals: cropName, mode: 'insensitive' } },
    });
    const cropId = crop ? crop.id : 3;

    const latestMarketPrice = await prisma.marketPrice.findFirst({
      where: { cropId },
      orderBy: { priceDate: 'desc' },
    });
    price = latestMarketPrice ? latestMarketPrice.modalPrice : 2800;
  }

  // 2. Call ML FastAPI service if available
  let mlResult = null;
  try {
    const mlResponse = await axios.post(
      'http://localhost:8000/ml/sell-wait',
      {
        crop: cropName,
        quantityQuintals,
        currentMarketPrice: price,
        hasColdStorage,
        originLocation: `${farmerDistrict}, Maharashtra`,
      },
      { timeout: 1500 }
    );
    if (mlResponse.data && mlResponse.data.sellNow) {
      mlResult = mlResponse.data;
    }
  } catch (e) {
    // Fallback to built-in TS rule engine
  }

  if (mlResult) return mlResult;

  // 3. Deterministic / Transparent Rule Engine
  const isPerishable = ['tomato', 'onion', 'potato'].includes(cropName.toLowerCase());
  const perishabilityLevel =
    cropName.toLowerCase() === 'tomato'
      ? 'High (2-4 days)'
      : cropName.toLowerCase() === 'onion'
      ? 'Medium (2-3 mos)'
      : 'Low (12+ mos)';
  const spoilageRiskRating =
    cropName.toLowerCase() === 'tomato'
      ? 'Higher (Softening / Rot)'
      : 'Moderate (Sprouting Risk)';

  const sellNowGross = Math.round(quantityQuintals * price);
  const potentialPriceIncreasePerQ =
    cropName.toLowerCase() === 'tomato'
      ? 200
      : cropName.toLowerCase() === 'onion'
      ? 150
      : 60;
  const projectedFuturePrice = price + potentialPriceIncreasePerQ;
  const projectedGross = Math.round(quantityQuintals * projectedFuturePrice);

  const storageCost = hasColdStorage
    ? Math.round(quantityQuintals * 16 * 5) // Rs 80 per quintal for 5 days
    : Math.round(quantityQuintals * 30 * 5);

  const shrinkageRate = cropName.toLowerCase() === 'tomato' ? 0.035 : 0.015;
  const spoilageCost = Math.round(projectedGross * shrinkageRate);
  const waitNet = projectedGross - storageCost - spoilageCost;

  const shouldSellNow = isPerishable || waitNet - sellNowGross < 3000;

  return {
    crop: cropName,
    quantityQuintals,
    quantityKg: quantityQuintals * 100,
    currentMarketPrice: price,
    currentSituation: {
      currentPrice: `₹${price.toLocaleString('en-IN')} / Q`,
      priceTrend: 'Increasing (+4.5%)',
      weather: 'Rain in 48 hrs',
      perishability: perishabilityLevel,
      storage: hasColdStorage ? 'Available (₹80/Q/5days)' : 'Not Available',
      mandiInflow: 'High (1,450 Q/day)',
    },
    sellNow: {
      title: 'SELL NOW',
      subtitle: 'Liquidate today at guaranteed farm-gate price',
      expectedReturn: sellNowGross,
      pricePerQ: price,
      storageCost: 0,
      isRecommended: shouldSellNow,
      points: [
        `No additional storage cost (Save ₹${storageCost.toLocaleString('en-IN')})`,
        'Lower spoilage exposure (Fresh harvest Grade A)',
        'Current price is known and guaranteed today',
        'Avoid upcoming 48-hour rain transit problems',
      ],
    },
    waitOption: {
      title: 'WAIT 5 DAYS',
      subtitle: 'Hold stock hoping for higher market quotation',
      potentialGrossReturn: projectedGross,
      potentialNetReturn: waitNet,
      potentialPrice: projectedFuturePrice,
      priceUpside: potentialPriceIncreasePerQ,
      storageCost,
      spoilageCost,
      spoilageRisk: spoilageRiskRating,
      weatherRisk: 'Possible Disruption (APMC muddying / transit delays)',
      points: [
        `Potential price increase (Up to +₹${potentialPriceIncreasePerQ}/Q)`,
        `Storage cost: approx ₹${storageCost.toLocaleString('en-IN')} for 5 days`,
        'Spoilage risk: moisture shrinkage & softening',
        'Price uncertainty: mandi arrivals might push rates down',
      ],
    },
    comparisonFactors: [
      {
        factor: 'Current Price',
        sellNow: `Known (₹${price.toLocaleString('en-IN')}/Q)`,
        wait: '—',
        meaning: `Selling today guarantees ₹${price.toLocaleString('en-IN')} with no price drop risk.`,
      },
      {
        factor: 'Price Increase',
        sellNow: '—',
        wait: `Potential (+₹${potentialPriceIncreasePerQ}/Q)`,
        meaning: 'Holding could fetch higher price if demand stays strong.',
      },
      {
        factor: 'Storage Cost',
        sellNow: 'None (₹0)',
        wait: `₹80/Q /5days (~₹${storageCost.toLocaleString('en-IN')})`,
        meaning: 'Storing tomatoes eats away almost half of the potential price gain.',
      },
      {
        factor: 'Spoilage Risk',
        sellNow: 'Lower (Fresh Grade A)',
        wait: spoilageRiskRating,
        meaning: 'Tomatoes lose water and soften rapidly without dedicated cold chain.',
      },
      {
        factor: 'Weather Risk',
        sellNow: 'Lower (Pre-rain dispatch)',
        wait: 'Possible Disruption',
        meaning: 'Incoming rain can make roads muddy and cause APMC market flooding.',
      },
    ],
    decisionSupport: {
      suggestion: shouldSellNow ? 'SELL NOW MAY BE SUITABLE' : 'HOLD / WAIT MAY BE SUITABLE',
      summary: shouldSellNow
        ? 'Based on your crop type, incoming rain alerts, and storage costs, selling today protects your guaranteed income.'
        : 'Holding may yield superior net return provided low-cost cold storage is accessible.',
      keyPoints: [
        `${cropName} is highly perishable: rapid decay risk`,
        'Rain expected within 48 hrs: risk of transit delay',
        `Storage adds ₹${storageCost.toLocaleString('en-IN')}+ in rent and moisture weight loss`,
        `Current ₹${price.toLocaleString('en-IN')}/Q price locks in known ₹${sellNowGross.toLocaleString('en-IN')} cash`,
      ],
      whenToWait:
        'Waiting may be worth considering if you have a low-cost cold storage (<₹30/Q) and an assured pre-booked buyer offering over ₹3,100/Q with guaranteed crate pickup.',
    },
  };
};
