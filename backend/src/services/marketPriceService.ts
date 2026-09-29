import prisma from '../database/prismaClient';

export interface MarketPriceFilter {
  cropId?:   number;
  marketId?: number;
  startDate?: Date;
  endDate?:   Date;
  limit?:     number;
}

export const getMarketPrices = (filter: MarketPriceFilter = {}) => {
  const { cropId, marketId, startDate, endDate, limit = 50 } = filter;

  return prisma.marketPrice.findMany({
    where: {
      ...(cropId   ? { cropId }   : {}),
      ...(marketId ? { marketId } : {}),
      ...(startDate || endDate
        ? {
            priceDate: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate   ? { lte: endDate }   : {}),
            },
          }
        : {}),
    },
    include: {
      crop:   { select: { id: true, name: true, localName: true, unit: true } },
      market: { select: { id: true, name: true, district: true } },
    },
    orderBy: { priceDate: 'desc' },
    take: limit,
  });
};
