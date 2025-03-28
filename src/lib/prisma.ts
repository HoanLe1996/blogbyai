import { PrismaClient } from '@prisma/client';

// Ngăn chặn nhiều instances của PrismaClient trong development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;