# Changelog - DriveBase Platform

All notable changes to the DriveBase Backend-as-a-Service (BaaS) platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0-production] - 2026-08-03 (Step 4 - Google Drive Integration & OAuth Flow)

### Added
- **Google OAuth 2.0 Flow**:
  - `GET /api/v1/auth/google`: Initiates OAuth consent redirect (`drive.file` and `drive.appdata` scopes).
  - `GET /api/v1/auth/google/callback`: Code exchange & AES-256-GCM token encryption into PostgreSQL.
  - `GET /api/v1/auth/google/status`: Check connection status & app folder settings.
  - `POST /api/v1/auth/google/disconnect`: Revoke and clear stored Google tokens.
- **GoogleDriveStorageProvider Implementation**:
  - Isolated application folder support (`DriveBase-App/`).
  - Core provider operations: `uploadFile`, `downloadFile`, `renameFile`, `deleteFile`, `getQuotaInfo`.
  - Resilient mock mode fallback for local testing without active GCP production keys.
- **Storage REST APIs (`/api/v1/storage`)**:
  - `GET /api/v1/storage/status`: StorageProvider plugin status.
  - `GET /api/v1/storage/quota`: Real-time storage quota metrics.
  - `POST /api/v1/storage/upload`: Direct file stream upload parser.
  - `GET /api/v1/storage/files/:id/download`: Binary stream download handler.
  - `PATCH /api/v1/storage/files/:id`: Rename file on Google Drive.
  - `DELETE /api/v1/storage/files/:id`: Delete file from Google Drive.
- **OpenAPI & Frontend UI Integration**:
  - Added `Google Drive Storage` tag to Swagger UI (`/api-docs`).
  - Connected `public/storage.html` drag-and-drop uploader, live quota bar, and OAuth trigger while preserving `#031427` dark theme.

## [1.1.0-production] - 2026-08-03 (Milestone 2 - Projects Management System)

### Added
- Multi-tenant Project CRUD APIs (`/api/v1/projects`), AES-256 encrypted environment variables & secrets manager, and project access isolation middleware.

## [1.0.0-production] - 2026-08-03 (Milestone 1 - Backend Foundation & Auth)

### Added
- Established modular monolith backend architecture, PostgreSQL database schema with Prisma ORM, Redis session caching, JWT access/refresh token rotation, AES-256 token encryption, Prometheus metrics, and Swagger documentation.
