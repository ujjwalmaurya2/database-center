# Changelog - DriveBase Platform

All notable changes to the DriveBase Backend-as-a-Service (BaaS) platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0-production] - 2026-08-03 (Milestone 2 - Projects Management System)

### Added
- **Multi-Tenant Project CRUD APIs**: Implemented complete project lifecycle endpoints under `/api/v1/projects`:
  - `POST /api/v1/projects`: Project creation with auto-generated slugs.
  - `GET /api/v1/projects`: List projects owned by the authenticated user.
  - `GET /api/v1/projects/:id`: Detailed project metadata.
  - `PATCH /api/v1/projects/:id`: Update project details.
  - `DELETE /api/v1/projects/:id`: Soft-delete/archive project (enforced OWNER RBAC role).
  - `POST /api/v1/projects/:id/restore`: Restore archived project.
- **AES-256 Encrypted Secrets & Environment Variables**:
  - `GET /api/v1/projects/:id/env`: List environment variables (secrets automatically masked as `••••••••`).
  - `POST /api/v1/projects/:id/env`: Create/update environment variables. Secrets encrypted in PostgreSQL using AES-256-GCM prior to storage.
  - `DELETE /api/v1/projects/:id/env/:key`: Delete specific environment variable.
- **Multi-Tenant Isolation Middleware**: Implemented `validateProjectAccess` middleware extracting `x-project-id` headers or path parameters to enforce strict data isolation between projects.
- **Interactive OpenAPI Docs Update**: Updated Swagger UI (`/api-docs`) with the new tag `Projects & Environment` documenting all project and env var schemas and endpoints.
- **Frontend Integration**: Integrated Project Switcher dropdown and connected `public/settings.html` to live Project editing, AES-256 secrets manager, and Danger Zone actions while preserving the `#031427` dark theme.

## [1.0.0-production] - 2026-08-03 (Milestone 1 - Backend Foundation & Auth)

### Added
- Established modular monolith backend architecture, PostgreSQL database schema with Prisma ORM, Redis session caching, JWT access/refresh token rotation, AES-256 token encryption, Prometheus metrics, and Swagger documentation.
