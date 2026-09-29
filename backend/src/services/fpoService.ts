import prisma from '../database/prismaClient';

export const getAllFPOs = () =>
  prisma.fPO.findMany({
    orderBy: { name: 'asc' },
    include: {
      members: {
        include: {
          farmer: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
  });

export const getFPOById = (id: number) =>
  prisma.fPO.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          farmer: {
            include: { user: { select: { id: true, name: true, phone: true } } },
          },
        },
      },
    },
  });
