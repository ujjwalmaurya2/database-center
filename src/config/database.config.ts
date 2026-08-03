import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectDatabase(): Promise<boolean> {
  try {
    await prisma.$connect();
    console.log('[PostgreSQL] Database connected successfully.');
    return true;
  } catch (error) {
    console.warn('[PostgreSQL Warning] Could not connect to PostgreSQL database service directly:', (error as Error).message);
    console.warn('[PostgreSQL Warning] Operating in resilient mode. Database calls will use fallback in-memory store if DB is offline.');
    return false;
  }
}
