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
    description: 'Production-ready Backend-as-a-Service API documentation for DriveBase. Supports multi-tenant projects, BYO Google OAuth credentials, Sync Engine, Conflicts, Recovery, Realtime, Edge Functions, Database Introspection, API Keys, and Centralized Audit Logging.',
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
    { name: 'Projects & Environment', description: 'Multi-tenant project CRUD, BYO Google API Credentials, status management, and encrypted secrets' },
    { name: 'Sync Engine', description: 'Background job queues, manual auto-sync scan trigger, pause, resume, and retry' },
    { name: 'Conflicts', description: 'Conflict detection, SHA256 diff comparison, and resolution strategies' },
    { name: 'Recovery', description: 'System & user recovery snapshots and point-in-time state rollback' },
    { name: 'Realtime', description: 'WebSocket channels, message broadcast, and client presence' },
    { name: 'Edge Functions', description: 'Isolated serverless V8/Node.js VM execution environment and invocation' },
    { name: 'API Generator', description: 'Role-based API key generation and revocation' },
    { name: 'Database', description: 'Schema introspection, paginated table data, and raw SQL console execution' },
    { name: 'Logs & Analytics', description: 'Centralized audit event logs stream and project performance metrics' },
  ],
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
    '/projects/{id}/google-credentials': {
      get: { tags: ['Projects & Environment'], summary: 'Get project BYO Google OAuth credentials status', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Status' } } },
      post: { tags: ['Projects & Environment'], summary: 'Save project BYO Google Client ID and Client Secret', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Saved' } } },
      delete: { tags: ['Projects & Environment'], summary: 'Remove project BYO Google API credentials', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Deleted' } } },
    },
    '/sync/status': { get: { tags: ['Sync Engine'], summary: 'Get sync queue status & bandwidth', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Queue status' } } } },
    '/sync/trigger': { post: { tags: ['Sync Engine'], summary: 'Trigger manual auto-sync scan', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Triggered' } } } },
    '/sync/pause': { post: { tags: ['Sync Engine'], summary: 'Pause sync queue processing', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Paused' } } } },
    '/sync/resume': { post: { tags: ['Sync Engine'], summary: 'Resume sync queue processing', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Resumed' } } } },
    '/sync/retry-failed': { post: { tags: ['Sync Engine'], summary: 'Retry all failed sync jobs', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Retried' } } } },
    '/conflicts': { get: { tags: ['Conflicts'], summary: 'List unresolved metadata conflicts', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Conflicts list' } } } },
    '/conflicts/{id}/diff': { get: { tags: ['Conflicts'], summary: 'Get side-by-side JSON diff', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Diff data' } } } },
    '/conflicts/{id}/resolve': { post: { tags: ['Conflicts'], summary: 'Resolve conflict with strategy', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Resolved' } } } },
    '/recovery/snapshots': {
      get: { tags: ['Recovery'], summary: 'List system recovery snapshots', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Snapshots' } } },
      post: { tags: ['Recovery'], summary: 'Create point-in-time recovery snapshot', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Created' } } },
    },
    '/recovery/snapshots/{id}/rollback': { post: { tags: ['Recovery'], summary: 'Rollback project state to snapshot', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Rollback result' } } } },
    '/realtime/channels': { get: { tags: ['Realtime'], summary: 'List active WebSocket channels', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Channels' } } } },
    '/realtime/broadcast': { post: { tags: ['Realtime'], summary: 'Broadcast event message to channel', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Broadcasted' } } } },
    '/functions': {
      get: { tags: ['Edge Functions'], summary: 'List deployed edge functions', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Functions' } } },
      post: { tags: ['Edge Functions'], summary: 'Deploy new edge function', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Deployed' } } },
    },
    '/functions/{id}/invoke': { post: { tags: ['Edge Functions'], summary: 'Invoke serverless function in V8 sandbox', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Invocation output' } } } },
    '/api-keys': {
      get: { tags: ['API Generator'], summary: 'List project API keys', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Keys list' } } },
      post: { tags: ['API Generator'], summary: 'Generate new API key with scope', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Generated' } } },
    },
    '/database/tables': { get: { tags: ['Database'], summary: 'Fetch database schemas & tables', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Tables' } } } },
    '/database/query': { post: { tags: ['Database'], summary: 'Execute raw SQL query', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Query result' } } } },
    '/logs': { get: { tags: ['Logs & Analytics'], summary: 'Get paginated audit logs', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Logs' } } } },
    '/analytics/overview': { get: { tags: ['Logs & Analytics'], summary: 'Get project health & metrics overview', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Analytics' } } } },
  },
};

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('[Swagger] OpenAPI docs available at /api-docs');
}
