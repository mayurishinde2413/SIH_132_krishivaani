import prisma from '../database/prismaClient';

export const getAllBuyers = () =>
  prisma.buyer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

export const getBuyerById = (id: number) =>
  prisma.buyer.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      requirements: { include: { crop: true } },
    },
  });
