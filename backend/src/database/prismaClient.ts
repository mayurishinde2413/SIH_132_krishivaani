import { PrismaClient } from '@prisma/client';

// Singleton Prisma client
const prisma = new PrismaClient({
  log: ['error'],
});

export default prisma;
