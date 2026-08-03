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
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'ff4423ea-1cad-4bc2-ae1c-988918327f63' },
          email: { type: 'string', format: 'email', example: 'developer@drivebase.io' },
          fullName: { type: 'string', example: 'Alex Mercer' },
          role: { type: 'string', enum: ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'], example: 'OWNER' },
          isEmailVerified: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time', example: '2026-08-03T12:00:00.000Z' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'proj_alpha_1' },
          name: { type: 'string', example: 'Project Alpha' },
          slug: { type: 'string', example: 'project-alpha' },
          description: { type: 'string', example: 'Primary cluster project' },
          status: { type: 'string', example: 'active' },
          ownerId: { type: 'string', format: 'uuid', example: 'ff4423ea-1cad-4bc2-ae1c-988918327f63' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateProjectRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Project Beta' },
          slug: { type: 'string', example: 'project-beta' },
          description: { type: 'string', example: 'Secondary analytics backend' },
        },
      },
      SetEnvVarRequest: {
        type: 'object',
        required: ['key', 'value'],
        properties: {
          key: { type: 'string', example: 'DATABASE_URL' },
          value: { type: 'string', example: 'postgresql://usr:pwd@host:5432/db' },
          isSecret: { type: 'boolean', example: true },
        },
      },
      EnvVarResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          projectId: { type: 'string' },
          key: { type: 'string', example: 'DATABASE_URL' },
          value: { type: 'string', example: '••••••••' },
          isSecret: { type: 'boolean', example: true },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error400: { ...errorSchemaRef, example: { success: false, error: { message: 'Validation failed', statusCode: 400 } } },
      Error401: { ...errorSchemaRef, example: { success: false, error: { message: 'Unauthorized: Access token missing or invalid', statusCode: 401 } } },
      Error403: { ...errorSchemaRef, example: { success: false, error: { message: 'Forbidden: Requires OWNER role', statusCode: 403 } } },
      Error404: { ...errorSchemaRef, example: { success: false, error: { message: 'Project not found', statusCode: 404 } } },
      Error500: { ...errorSchemaRef, example: { success: false, error: { message: 'Internal server error', statusCode: 500 } } },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'System Liveness Probe',
        responses: { '200': { description: 'Healthy' } },
      },
    },
    '/ready': {
      get: {
        tags: ['Health'],
        summary: 'System Readiness Probe',
        responses: { '200': { description: 'Ready' } },
      },
    },
    '/metrics': {
      get: {
        tags: ['Health'],
        summary: 'Prometheus Metrics Exporter',
        responses: { '200': { description: 'Metrics text' } },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user account',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
        responses: { '201': { description: 'Registered' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate with email and password',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
        responses: { '200': { description: 'Logged in' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User profile' } },
      },
    },
    '/projects': {
      post: {
        tags: ['Projects & Environment'],
        summary: 'Create a new project',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProjectRequest' } } } },
        responses: { '201': { description: 'Project created' } },
      },
      get: {
        tags: ['Projects & Environment'],
        summary: 'List user projects',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Array of projects' } },
      },
    },
    '/projects/{id}': {
      get: {
        tags: ['Projects & Environment'],
        summary: 'Get project details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Project details' } },
      },
      patch: {
        tags: ['Projects & Environment'],
        summary: 'Update project details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Project updated' } },
      },
      delete: {
        tags: ['Projects & Environment'],
        summary: 'Archive/delete project (OWNER role)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Project archived' } },
      },
    },
    '/projects/{id}/restore': {
      post: {
        tags: ['Projects & Environment'],
        summary: 'Restore archived project',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Project restored' } },
      },
    },
    '/projects/{id}/env': {
      get: {
        tags: ['Projects & Environment'],
        summary: 'List environment variables (masked secrets)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Array of env vars' } },
      },
      post: {
        tags: ['Projects & Environment'],
        summary: 'Add or update environment variable (AES-256 encrypted)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SetEnvVarRequest' } } } },
        responses: { '200': { description: 'Env var saved' } },
      },
    },
    '/projects/{id}/env/{key}': {
      delete: {
        tags: ['Projects & Environment'],
        summary: 'Delete specific environment variable',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'key', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Env var deleted' } },
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('[Swagger] OpenAPI docs available at /api-docs');
}
