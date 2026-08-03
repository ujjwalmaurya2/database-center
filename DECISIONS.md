# Architectural Decisions Log (ADR)

## ADR-001: Modular Monolith vs Microservices
- **Status**: Accepted
- **Context**: DriveBase requires rapid iteration across Authentication, Storage Metadata, Sync Queues, Edge Functions, and Recovery.
- **Decision**: Use a clean, modular monolith with feature-based module folders (`/src/modules/`). Each module contains its DTOs, Controllers, Services, and Repositories, ensuring zero tight coupling and enabling smooth extraction into microservices if needed.

## ADR-002: Pure PostgreSQL Targeting
- **Status**: Accepted
- **Context**: Avoid environment discrepancies between local SQLite and production PostgreSQL.
- **Decision**: Target PostgreSQL strictly via Prisma ORM for schema consistency, foreign key integrity, and index optimization.

## ADR-003: AES-256-GCM Token Encryption
- **Status**: Accepted
- **Context**: Storing raw third-party Google OAuth access/refresh tokens in plaintext introduces significant security risk.
- **Decision**: Encrypt all OAuth credentials using AES-256-GCM before writing to PostgreSQL, with hardware-scrypted key derivation.

## ADR-004: Pluggable StorageProvider Abstraction
- **Status**: Accepted
- **Context**: While Google Drive is the primary initial storage provider, future extensions will support S3, R2, Dropbox, and OneDrive.
- **Decision**: Abstract all storage operations behind a `StorageProvider` interface and maintain a runtime `StorageProviderRegistry`.

## ADR-005: Redis Ecosystem Integration
- **Status**: Accepted
- **Context**: Need high-performance caching for user sessions, storage metadata, rate limiting, and future queue processing.
- **Decision**: Integrate Redis via `ioredis` with automatic in-memory fallback for local development resilience.
