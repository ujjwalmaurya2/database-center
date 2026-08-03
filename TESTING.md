# DriveBase Testing & Manual Verification Guide

This guide explains how to manually and automatically verify all features, API endpoints, and UI pages across Milestones 1 & 2.

---

## 1. Prerequisites & Services Startup

Ensure PostgreSQL and Redis containers are running:
```bash
docker-compose up -d postgres redis
```

Start the application backend server:
```bash
npm run dev
```

---

## 2. Automated Test Verification

### Milestone 1 Automated Test Suite
```bash
node scratch/test_milestone1.js
```

### Milestone 2 Projects & Secrets Test Suite
```bash
node scratch/test_milestone2.js
```

**Expected Output for Milestone 2**:
- `POST /api/v1/projects` -> 201 Project Created
- `GET /api/v1/projects` -> 200 Total Projects Listed
- `GET /api/v1/projects/:id` -> 200 Project Details
- `PATCH /api/v1/projects/:id` -> 200 Project Updated
- `POST /api/v1/projects/:id/env` -> 200 Encrypted with AES-256-GCM & Masked as `••••••••`
- `GET /api/v1/projects/:id/env` -> 200 Secret Masked
- `DELETE /api/v1/projects/:id/env/:key` -> 200 Variable Removed
- `DELETE /api/v1/projects/:id` -> 200 Status: Archived
- `POST /api/v1/projects/:id/restore` -> 200 Status: Active

---

## 3. Interactive Swagger Documentation
Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to test the new `Projects & Environment` tag endpoints interactively.
