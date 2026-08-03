# DriveBase Setup & Installation Guide

## Option 1: Quickstart with Docker Compose (Recommended)

1. Ensure Docker Desktop is installed and running.
2. Clone/navigate to project directory:
   ```bash
   cd c:\Users\ujjwa\Desktop\website
   ```
3. Start all services (PostgreSQL, Redis, and DriveBase Backend):
   ```bash
   docker-compose up -d --build
   ```
4. Access services:
   - Dashboard UI: `http://localhost:3000`
   - Swagger OpenAPI Docs: `http://localhost:3000/api-docs`
   - Prometheus Metrics: `http://localhost:3000/metrics`

## Option 2: Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` variables.
3. Generate Prisma client & run database migrations:
   ```bash
   npx prisma generate
   npx prisma seed
   ```
4. Start local development server:
   ```bash
   npm run dev
   ```
