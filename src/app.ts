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
import projectRouter from './modules/projects/project.router';
import healthRouter from './modules/health/health.router';

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
apiRouter.use('/projects', projectRouter);

app.use(envConfig.apiPrefix, apiRouter);

// Serve Frontend Static Content from public/ folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Global Centralized Error Handler
app.use(errorHandler);

export default app;
