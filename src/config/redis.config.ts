import Redis from 'ioredis';
import { envConfig } from './env.config';

let redisClient: Redis | null = null;
let isRedisConnected = false;

export function getRedisClient(): Redis | null {
  if (!redisClient) {
    try {
      redisClient = new Redis(envConfig.redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy() {
          return null; // Stop retrying on failure
        },
      });

      redisClient.on('connect', () => {
        isRedisConnected = true;
        console.log('[Redis] Connected successfully.');
      });

      redisClient.on('error', (err) => {
        isRedisConnected = false;
        console.warn('[Redis Warning] Connection error:', err.message);
      });
    } catch (e) {
      console.warn('[Redis Warning] Failed to initialize Redis client:', (e as Error).message);
    }
  }

  return redisClient;
}

export async function connectRedis(): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;
  try {
    await client.connect();
    isRedisConnected = true;
    return true;
  } catch (error) {
    isRedisConnected = false;
    console.warn('[Redis Warning] Redis server unreachable. Falling back to internal memory cache.');
    return false;
  }
}

export function isRedisReady(): boolean {
  return isRedisConnected;
}
