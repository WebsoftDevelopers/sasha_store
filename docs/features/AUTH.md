# Sasha Store — Backend Auth

## Stack
- NestJS API validates **Supabase JWTs**
- Prisma mirrors users into `public.users` (portable export table)
- Supabase Auth owns email/password + Google OAuth

## Setup
1. Fill `API_`, `NEXT_`, `EXPO_`, and `AGENT_` values in `config/.env`.
2. `npm install`
3. Apply migration. Prisma receives `API_DATABASE_URL` and optional
   `API_DIRECT_URL` through the Docker/API runtime:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
4. `npm run start:dev` (default port **8000**)

## Supabase dashboard
1. Auth → Providers: enable **Email** and **Google**
2. Redirect URLs: `http://localhost:3000/auth/callback` (+ production)
3. Site URL: frontend origin
4. Copy Project URL, publishable/anon key, service role key, and JWT secret into
   the `API_SUPABASE_*` and `NEXT_PUBLIC_SUPABASE_*` entries in `config/.env`.

## Auth endpoints
- `GET /api/auth/me` — current mirrored user (Bearer)
- `POST /api/auth/logout` — ack (client clears session)
- `GET /api/users/me` — same as auth/me
- `PATCH /api/users/me` — update `fullName` / `avatarUrl`

## Media uploads

Flow: frontend uploads through the API storage endpoint → API stores the file in
the configured S3-compatible provider → Prisma stores metadata in
`media_assets` and feature tables keep URL fields for fast reads.

Object storage is the bucket for images, videos, documents, and blobs.
PostgreSQL should store metadata and references, not file bytes.
