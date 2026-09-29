import prisma from '../database/prismaClient';

export interface BuyerReqFilter {
  cropId?:   number;
  buyerId?:  number;
  isActive?: boolean;
}

export const getBuyerRequirements = (filter: BuyerReqFilter = {}) => {
  const { cropId, buyerId, isActive = true } = filter;

  return prisma.buyerRequirement.findMany({
    where: {
      ...(cropId  ? { cropId }  : {}),
      ...(buyerId ? { buyerId } : {}),
      isActive,
    },
    include: {
      crop:  { select: { id: true, name: true, localName: true, unit: true } },
      buyer: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
