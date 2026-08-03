import { getRedisClient, isRedisReady } from '../../config/redis.config';

class InMemoryCache {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  public get(key: string): string | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  public set(key: string, value: string, ttlSeconds?: number): void {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  public del(key: string): void {
    this.store.delete(key);
  }
}

export class CacheService {
  private static memoryCache = new InMemoryCache();

  public static async get(key: string): Promise<string | null> {
    if (isRedisReady()) {
      const client = getRedisClient();
      if (client) {
        try {
          return await client.get(key);
        } catch {
          // Fallback to memory
        }
      }
    }
    return this.memoryCache.get(key);
  }

  public static async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    if (isRedisReady()) {
      const client = getRedisClient();
      if (client) {
        try {
          await client.set(key, value, 'EX', ttlSeconds);
          return;
        } catch {
          // Fallback to memory
        }
      }
    }
    this.memoryCache.set(key, value, ttlSeconds);
  }

  public static async del(key: string): Promise<void> {
    if (isRedisReady()) {
      const client = getRedisClient();
      if (client) {
        try {
          await client.del(key);
          return;
        } catch {
          // Fallback to memory
        }
      }
    }
    this.memoryCache.del(key);
  }

  public static async getObject<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public static async setObject<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }
}
