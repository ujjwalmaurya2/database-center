import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { envConfig } from './config/env.config';
import { errorHandler } from './middleware/error-handler.middleware';
import { rateLimiter } from './middleware/rate-limiter.middleware';
import { setupSwagger } from './config/swagger.config';
import { StorageProviderRegistry } from './core/storage/storage-provider.registry';
import { GoogleDriveStorageProvider } from './core/storage/providers/google-drive.provider';

import authRouter from './modules/auth/auth.router';
import googleAuthRouter from './modules/auth/auth.google.router';
import projectRouter from './modules/projects/project.router';
import storageRouter from './modules/storage/storage.router';
import healthRouter from './modules/health/health.router';

import syncRouter from './modules/sync/sync.router';
import conflictsRouter from './modules/conflicts/conflicts.router';
import recoveryRouter from './modules/recovery/recovery.router';
import realtimeRouter from './modules/realtime/realtime.router';
import functionsRouter from './modules/functions/functions.router';
import apiKeysRouter from './modules/apikeys/apikeys.router';
import databaseRouter from './modules/database/database.router';
import logsRouter from './modules/logs/logs.router';
import analyticsRouter from './modules/analytics/analytics.router';

// Initialize Storage Providers Plugin System
StorageProviderRegistry.registerProvider(new GoogleDriveStorageProvider());

const app = express();

// Security and utility middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter(200, 60));

// Setup Swagger OpenAPI Docs
setupSwagger(app);

// Register Health & Prometheus Metrics routes at root level
app.use('/', healthRouter);

// Register API v1 Routers
const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/auth', googleAuthRouter);
apiRouter.use('/projects', projectRouter);
apiRouter.use('/storage', storageRouter);

apiRouter.use('/sync', syncRouter);
apiRouter.use('/conflicts', conflictsRouter);
apiRouter.use('/recovery', recoveryRouter);
apiRouter.use('/realtime', realtimeRouter);
apiRouter.use('/functions', functionsRouter);
apiRouter.use('/api-keys', apiKeysRouter);
apiRouter.use('/database', databaseRouter);
apiRouter.use('/logs', logsRouter);
apiRouter.use('/analytics', analyticsRouter);

app.use(envConfig.apiPrefix, apiRouter);

// Serve Frontend Static Content from public/ folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Global Centralized Error Handler
app.use(errorHandler);

export default app;
