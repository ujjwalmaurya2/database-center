# DriveBase Backend Technical Guide

## Tech Stack
- **Runtime**: Node.js v20 (TypeScript strict mode)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **In-Memory Store & Cache**: Redis (ioredis)
- **Security**: JWT Access (15m) & Refresh (7d) tokens, bcrypt, AES-256-GCM token encryption, Helmet, CORS
- **Validation**: Zod schema validation
- **Documentation**: Swagger / OpenAPI (`/api-docs`)
- **Metrics & Monitoring**: Prometheus (`/metrics`)

## Code Organization
- `src/config/`: App configuration (environment, database, redis, swagger)
- `src/core/`: Central system components (crypto, cache, metrics, errors, storage abstraction)
- `src/middleware/`: Security and utility middlewares (auth, rbac, validation, error handler, rate limiter)
- `src/modules/`: Domain feature modules (`auth`, `users`, `health`)
- `prisma/`: Database schema definitions (`schema.prisma`) and seed scripts (`seed.ts`)
- `public/`: Integrated frontend assets and HTML pages
