# DriveBase API Documentation

Interactive Swagger OpenAPI UI available at `http://localhost:3000/api-docs`.

## Root Probe & Monitoring Endpoints
- `GET /health`: Basic application health check.
- `GET /ready`: Readiness probe checking PostgreSQL database and Redis status.
- `GET /metrics`: Prometheus formatted system metrics.

## Authentication & User Endpoints (`/api/v1/auth`)
### 1. Register User
- **POST** `/api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Jane Doe",
    "role": "OWNER"
  }
  ```
- **Response**: Returns registered user object, JWT access token, and refresh token.

### 2. User Login
- **POST** `/api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### 3. Refresh Access Token
- **POST** `/api/v1/auth/refresh`
- **Request Body**:
  ```json
  {
    "refreshToken": "<REFRESH_TOKEN_STRING>"
  }
  ```

### 4. Authenticated Profile
- **GET** `/api/v1/auth/me`
- **Header**: `Authorization: Bearer <ACCESS_TOKEN>`

### 5. Logout
- **POST** `/api/v1/auth/logout`
- **Header**: `Authorization: Bearer <ACCESS_TOKEN>`
