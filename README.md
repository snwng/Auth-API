# auth_api

A small JWT-based authentication API built with Express 5 and Bun's built-in SQLite (`bun:sqlite`).

## Setup

```bash
bun install
cp .env.example .env
```

Set these in `.env`: `JWT_SECRET`, `DB_PATH` (e.g. `./db.sqlite`). Optional: `PORT` (default 5000), `SALT_ROUNDS` (default 10).

## Run

```bash
bun run src/app.ts
```

## API

All routes are under `/api`. Protected routes need an `Authorization: Bearer <accessToken>` header.

- `POST /auth/signup` — create account, returns access + refresh tokens
- `POST /auth/login` — log in, returns access + refresh tokens
- `POST /auth/refresh-token` — rotate refresh token, returns new token pair
- `POST /auth/logout` — invalidate the stored refresh token (protected)
- `GET /user/me` — current user (protected)
- `GET /` — health check

## Auth flow

Access tokens are JWTs valid for 30 minutes. Refresh tokens are JWTs valid for 7 days, stored per user in the database and rotated on use.
