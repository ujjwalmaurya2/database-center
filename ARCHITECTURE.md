# DriveBase Architecture Overview

DriveBase is a Backend-as-a-Service (BaaS) platform engineered to empower developer applications using **user-owned Google Drive storage** instead of platform-managed cloud buckets.

## Core System Architecture

```
                                  ┌───────────────────────────┐
                                  │      Client Frontend      │
                                  └─────────────┬─────────────┘
                                                │ REST API / JWT
                                                ▼
                                  ┌───────────────────────────┐
                                  │     Express App Server    │
                                  │  (JWT / Zod / Swagger UI) │
                                  └──────┬──────────────┬─────┘
                                         │              │
                    ┌────────────────────┘              └────────────────────┐
                    ▼                                                        ▼
      ┌───────────────────────────┐                            ┌───────────────────────────┐
      │   Prisma ORM (PostgreSQL) │                            │    Redis Cache & Queue    │
      │   - Users & Auth RBAC     │                            │    - Session Store        │
      │   - Storage Metadata      │                            │    - Metadata Object Cache │
      │   - Sync Queues           │                            │    - Rate Limiter         │
      │   - Conflicts & Recovery  │                            │    - Pub/Sub & Metrics    │
      └───────────────────────────┘                            └───────────────────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │ StorageProvider Interface │
                                  └─────────────┬─────────────┘
                                                │ Pluggable Adapters
                                                ▼
                                  ┌───────────────────────────┐
                                  │ GoogleDriveStorageProvider│
                                  │ (Hidden Application Folder│
                                  │  AES-256 Encrypted Tokens)│
                                  └───────────────────────────┘
```

## Key Architectural Principles
- **Clean Architecture & Modular Monolith**: Feature-driven module layout (`auth`, `users`, `storage`, `health`) decoupling controllers, services, repositories, and DTOs.
- **Extensible StorageProvider Plugin Interface**: Abstract storage provider (`StorageProvider`) supporting `GoogleDriveStorageProvider` primary adapter while allowing future storage plugins (S3, Dropbox, OneDrive, R2).
- **Security & Privacy First**: OAuth tokens are encrypted using **AES-256-GCM** prior to PostgreSQL persistence. All endpoints validate payload schemas via **Zod**.
- **Observability**: Exposes `/health`, `/ready`, and Prometheus metrics (`/metrics`) for real-time monitoring.
