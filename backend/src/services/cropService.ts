import prisma from '../database/prismaClient';

export const getAllCrops = () =>
  prisma.crop.findMany({ orderBy: { name: 'asc' } });

export const getCropById = (id: number) =>
  prisma.crop.findUnique({ where: { id } });
