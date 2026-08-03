import app from './app';
import { envConfig } from './config/env.config';
import { connectDatabase } from './config/database.config';
import { connectRedis } from './config/redis.config';

async function startServer() {
  console.log('[DriveBase] Starting DriveBase BaaS Platform Server...');
  
  // Initialize Database and Redis connections
  await connectDatabase();
  await connectRedis();

  const server = app.listen(envConfig.port, () => {
    console.log(`[DriveBase] Server running in ${envConfig.nodeEnv} mode at http://localhost:${envConfig.port}`);
    console.log(`[DriveBase] OpenAPI Documentation: http://localhost:${envConfig.port}/api-docs`);
    console.log(`[DriveBase] Health Endpoint: http://localhost:${envConfig.port}/health`);
    console.log(`[DriveBase] Metrics Endpoint: http://localhost:${envConfig.port}/metrics`);
  });

  const gracefulShutdown = () => {
    console.log('[DriveBase] Shutting down server gracefully...');
    server.close(() => {
      console.log('[DriveBase] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer();
