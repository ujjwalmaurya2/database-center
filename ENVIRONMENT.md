# DriveBase Environment Configuration

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `3000` | Application HTTP server listening port |
| `NODE_ENV` | `development` | Operating environment (`development` / `production`) |
| `API_PREFIX` | `/api/v1` | Base URI prefix for REST APIs |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/drivebase?schema=public` | PostgreSQL database connection URL |
| `REDIS_URL` | `redis://localhost:6379` | Redis server connection URI |
| `JWT_SECRET` | `supersecret_drivebase_jwt_access_key_2026` | Secret key for signing 15-min JWT access tokens |
| `JWT_EXPIRES_IN` | `15m` | Access token lifespan |
| `JWT_REFRESH_SECRET` | `supersecret_drivebase_jwt_refresh_key_2026` | Secret key for signing 7-day refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifespan |
| `ENCRYPTION_KEY` | `drivebase_encryption_key_32_bytes_!` | 32-byte secret key for AES-256-GCM token encryption |
| `GOOGLE_CLIENT_ID` | `mock_google_client_id` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | `mock_google_client_secret` | Google OAuth 2.0 Client Secret |
| `GOOGLE_REDIRECT_URI` | `http://localhost:3000/api/v1/auth/google/callback` | OAuth redirect URI callback |
