import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../core/cache/redis.cache.service';
import { AppError } from '../core/errors/app-error';

export function rateLimiter(limit = 100, windowSeconds = 60) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `ratelimit:${ip}:${req.path}`;

    try {
      const currentRaw = await CacheService.get(key);
      const current = currentRaw ? parseInt(currentRaw, 10) : 0;

      if (current >= limit) {
        return next(new AppError('Too many requests, rate limit exceeded', 429));
      }

      await CacheService.set(key, (current + 1).toString(), windowSeconds);
      next();
    } catch {
      next(); // Proceed if rate limiting fails
    }
  };
}
