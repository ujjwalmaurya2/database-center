import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const errorSchemaRef = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    error: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        statusCode: { type: 'integer' },
        details: { type: 'object', nullable: true },
      },
    },
  },
};

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'DriveBase BaaS Platform API',
    version: '1.0.0',
    description: 'Production-ready Backend-as-a-Service API documentation for DriveBase. Supports multi-tenant projects, authentication, RBAC, Redis session caching, and Google Drive storage provider abstraction.',
    contact: {
      name: 'DriveBase Engineering Team',
      email: 'support@drivebase.io',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Production API v1 Server',
    },
  ],
  tags: [
    { name: 'Health', description: 'System health probes and Prometheus metrics' },
    { name: 'Authentication', description: 'User registration, login, JWT token rotation, and profile management' },
    { name: 'Google Drive Storage', description: 'Google OAuth consent, AES-256 token security, Drive folder isolation, quota checks, and file operations' },
    { name: 'Projects & Environment', description: 'Multi-tenant project CRUD, status management, and encrypted secrets' },
    { name: 'Administration', description: 'RBAC protected administrative routes and system tests' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your 15-minute JWT Access Token obtained from /auth/login or /auth/register',
      },
    },
    schemas: {
      FileMetadata: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'gdrive_file_1294812' },
          name: { type: 'string', example: 'document.pdf' },
          path: { type: 'string', example: '/DriveBase-App/document.pdf' },
          isFolder: { type: 'boolean', example: false },
          size: { type: 'integer', example: 1048576 },
          mimeType: { type: 'string', example: 'application/pdf' },
          checksum: { type: 'string', example: 'md5_39ad0c3b' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      QuotaInfo: {
        type: 'object',
        properties: {
          totalBytes: { type: 'integer', example: 16106127360 },
          usedBytes: { type: 'integer', example: 6657199308 },
          remainingBytes: { type: 'integer', example: 9448928052 },
        },
      },
      Error400: { ...errorSchemaRef, example: { success: false, error: { message: 'Validation failed', statusCode: 400 } } },
      Error401: { ...errorSchemaRef, example: { success: false, error: { message: 'Unauthorized: Access token missing or invalid', statusCode: 401 } } },
      Error500: { ...errorSchemaRef, example: { success: false, error: { message: 'Internal server error', statusCode: 500 } } },
    },
  },
  paths: {
    '/health': { get: { tags: ['Health'], summary: 'System Liveness Probe', responses: { '200': { description: 'Healthy' } } } },
    '/ready': { get: { tags: ['Health'], summary: 'System Readiness Probe', responses: { '200': { description: 'Ready' } } } },
    '/metrics': { get: { tags: ['Health'], summary: 'Prometheus Metrics Exporter', responses: { '200': { description: 'Metrics text' } } } },
    '/auth/register': { post: { tags: ['Authentication'], summary: 'Register user account', responses: { '201': { description: 'Registered' } } } },
    '/auth/login': { post: { tags: ['Authentication'], summary: 'Authenticate user', responses: { '200': { description: 'Logged in' } } } },
    '/auth/me': { get: { tags: ['Authentication'], summary: 'Get current profile', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Profile' } } } },
    '/auth/google': { get: { tags: ['Google Drive Storage'], summary: 'Initiate Google OAuth redirect flow', responses: { '302': { description: 'Redirect to Google OAuth consent' } } } },
    '/auth/google/callback': { get: { tags: ['Google Drive Storage'], summary: 'Handle OAuth callback & encrypt tokens', responses: { '302': { description: 'Redirect back to /storage.html' } } } },
    '/auth/google/status': { get: { tags: ['Google Drive Storage'], summary: 'Get Google Drive connection status', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Connection status' } } } },
    '/auth/google/disconnect': { post: { tags: ['Google Drive Storage'], summary: 'Disconnect Google Drive account', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Disconnected' } } } },
    '/storage/status': { get: { tags: ['Google Drive Storage'], summary: 'Get active storage provider status', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Provider status' } } } },
    '/storage/quota': { get: { tags: ['Google Drive Storage'], summary: 'Get storage quota metrics (total, used, remaining)', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Quota metrics' } } } },
    '/storage/upload': { post: { tags: ['Google Drive Storage'], summary: 'Upload file directly to Google Drive app folder', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Uploaded metadata' } } } },
    '/storage/files/{id}/download': { get: { tags: ['Google Drive Storage'], summary: 'Download file from Google Drive', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'File binary stream' } } } },
    '/storage/files/{id}': {
      patch: { tags: ['Google Drive Storage'], summary: 'Rename file on Google Drive', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Updated file metadata' } } },
      delete: { tags: ['Google Drive Storage'], summary: 'Delete file from Google Drive', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Deleted' } } },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('[Swagger] OpenAPI docs available at /api-docs');
}
