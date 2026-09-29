import prisma from '../database/prismaClient';

// ── District centre coordinates for Maharashtra (used for prototype distance calc) ──
const DISTRICT_COORDS: Record<string, { lat: number; lon: number }> = {
  Pune: { lat: 18.5204, lon: 73.8567 },
  Nashik: { lat: 19.9975, lon: 73.7898 },
  Solapur: { lat: 17.6869, lon: 75.9064 },
  Ahmednagar: { lat: 19.0952, lon: 74.7496 },
  Satara: { lat: 17.6805, lon: 74.0183 },
  Aurangabad: { lat: 19.8762, lon: 75.3433 },
  Nagpur: { lat: 21.1458, lon: 79.0882 },
  Kolhapur: { lat: 16.705, lon: 74.2433 },
  Latur: { lat: 18.4088, lon: 76.5604 },
  Thane: { lat: 19.2183, lon: 72.9781 },
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Sangli: { lat: 16.8524, lon: 74.5815 },
  Jalgaon: { lat: 21.0077, lon: 75.5626 },
  Nanded: { lat: 19.1383, lon: 77.3117 },
  Raigad: { lat: 18.5158, lon: 73.1804 },
  Wardha: { lat: 20.7453, lon: 78.6022 },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// ── Existing ────────────────────────────────────────────────────────────────────

export const getAllMarkets = () =>
  prisma.market.findMany({ orderBy: { name: 'asc' } });

export const getMarketById = (id: number) =>
  prisma.market.findUnique({
    where: { id },
    include: {
      marketPrices: {
        orderBy: { priceDate: 'desc' },
        take: 30,
        include: { crop: true },
      },
      marketArrivals: {
        orderBy: { arrivalDate: 'desc' },
        take: 30,
        include: { crop: true },
      },
    },
  });

// ── New: Nearby markets ──────────────────────────────────────────────────────────

export const getNearbyMarkets = async (
  farmerDistrict: string,
  cropId?: number,
  radiusKm = 100
) => {
  const farmerCoords = DISTRICT_COORDS[farmerDistrict];

  const markets = await prisma.market.findMany({
    orderBy: { name: 'asc' },
    include: {
      marketPrices: cropId
        ? {
            where: { cropId },
            orderBy: { priceDate: 'desc' },
            take: 1,
            include: {
              crop: { select: { id: true, name: true, localName: true, unit: true } },
            },
          }
        : {
            orderBy: { priceDate: 'desc' },
            take: 3,
            include: {
              crop: { select: { id: true, name: true, localName: true, unit: true } },
            },
          },
      marketArrivals: cropId
        ? {
            where: { cropId },
            orderBy: { arrivalDate: 'desc' },
            take: 1,
          }
        : {
            orderBy: { arrivalDate: 'desc' },
            take: 1,
          },
    },
  });

  return markets
    .map((market) => {
      let distanceKm = 50; // default fallback
      if (farmerCoords && market.latitude && market.longitude) {
        distanceKm = haversineKm(
          farmerCoords.lat,
          farmerCoords.lon,
          market.latitude,
          market.longitude
        );
      } else if (farmerCoords) {
        // Use district-centre distance
        const marketCoords = DISTRICT_COORDS[market.district];
        if (marketCoords) {
          distanceKm = haversineKm(
            farmerCoords.lat,
            farmerCoords.lon,
            marketCoords.lat,
            marketCoords.lon
          );
        }
      }

      const latestPrice = market.marketPrices[0] ?? null;
      const latestArrival = market.marketArrivals[0] ?? null;

      return {
        id: market.id,
        name: market.name,
        district: market.district,
        state: market.state,
        type: market.type,
        latitude: market.latitude,
        longitude: market.longitude,
        distanceKm,
        latestPrice: latestPrice
          ? {
              minPrice: latestPrice.minPrice,
              maxPrice: latestPrice.maxPrice,
              modalPrice: latestPrice.modalPrice,
              priceDate: latestPrice.priceDate,
              crop: latestPrice.crop,
            }
          : null,
        totalArrivalsQty: latestArrival?.arrivalQty ?? null,
        arrivalDate: latestArrival?.arrivalDate ?? null,
      };
    })
    .filter((m) => m.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
};

// ── New: Search markets ──────────────────────────────────────────────────────────

export const searchMarkets = async (query: string) => {
  const markets = await prisma.market.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { district: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
    take: 10,
  });
  return markets;
};

// ── New: 7-day price history for a market+crop ──────────────────────────────────

export const getMarketPriceHistory = async (marketId: number, cropId: number) => {
  const market = await prisma.market.findUnique({
    where: { id: marketId },
    select: { id: true, name: true, district: true, state: true, type: true, latitude: true, longitude: true },
  });

  if (!market) return null;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const prices = await prisma.marketPrice.findMany({
    where: {
      marketId,
      cropId,
      priceDate: { gte: sevenDaysAgo },
    },
    orderBy: { priceDate: 'asc' },
    include: {
      crop: { select: { id: true, name: true, localName: true, unit: true } },
    },
  });

  const latestArrival = await prisma.marketArrival.findFirst({
    where: { marketId, cropId },
    orderBy: { arrivalDate: 'desc' },
  });

  const latestPrice = prices.length > 0 ? prices[prices.length - 1] : null;

  return {
    market,
    cropId,
    priceHistory: prices.map((p) => ({
      date: p.priceDate,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      modalPrice: p.modalPrice,
      crop: p.crop,
    })),
    latestPrice: latestPrice
      ? {
          minPrice: latestPrice.minPrice,
          maxPrice: latestPrice.maxPrice,
          modalPrice: latestPrice.modalPrice,
          priceDate: latestPrice.priceDate,
          crop: latestPrice.crop,
        }
      : null,
    totalArrivalsQty: latestArrival?.arrivalQty ?? null,
    arrivalDate: latestArrival?.arrivalDate ?? null,
  };
};
