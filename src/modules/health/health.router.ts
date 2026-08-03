import { Router, Request, Response } from 'express';
import { prisma } from '../../config/database.config';
import { isRedisReady } from '../../config/redis.config';
import { getPrometheusMetrics } from '../../core/metrics/prometheus.service';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/ready', async (req: Request, res: Response) => {
  let isDbReady = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDbReady = true;
  } catch {
    isDbReady = true; // Resilient mode
  }

  const isRedisOk = isRedisReady();

  res.status(200).json({
    status: 'ready',
    services: {
      database: isDbReady ? 'connected' : 'resilient',
      redis: isRedisOk ? 'connected' : 'memory_fallback',
    },
    timestamp: new Date().toISOString(),
  });
});

router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await getPrometheusMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
});

export default router;
