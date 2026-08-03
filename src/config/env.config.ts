import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const envConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/drivebase?schema=public',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'supersecret_drivebase_jwt_access_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecret_drivebase_jwt_refresh_key_2026',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  encryptionKey: process.env.ENCRYPTION_KEY || 'drivebase_encryption_key_32_bytes_!',
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'mock_google_client_id',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_google_client_secret',
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/google/callback',
};
