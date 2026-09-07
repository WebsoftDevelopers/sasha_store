# Sasha Store — Backend Auth

## Stack
- NestJS API validates **Supabase JWTs**
- Prisma mirrors users into `public.users` (portable export table)
- Supabase Auth owns email/password + Google OAuth

## Setup
1. Fill Supabase, database, and Cloudinary values in `config/.env`.
2. `npm install`
3. Apply migration (uses `DIRECT_URL` when set):
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```
4. `npm run start:dev` (default port **8000**)

## Supabase dashboard
1. Auth → Providers: enable **Email** and **Google**
2. Redirect URLs: `http://localhost:3000/auth/callback` (+ production)
3. Site URL: frontend origin
4. Copy Project URL, anon key, service role key, and JWT secret into `config/.env`

## Auth endpoints
- `GET /api/auth/me` — current mirrored user (Bearer)
- `POST /api/auth/logout` — ack (client clears session)
- `GET /api/users/me` — same as auth/me
- `PATCH /api/users/me` — update `fullName` / `avatarUrl`

## Media uploads (Cloudinary)
Flow: **Frontend uploads directly to Cloudinary** (unsigned preset) → frontend records the Cloudinary URL/public ID through Nest → Prisma stores metadata in `media_assets` and feature tables keep URL fields for fast reads.

Cloudinary is the bucket for images, videos, documents, and blobs. PostgreSQL should store metadata and references, not file bytes.

Frontend env:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=   # must be UNSIGNED
NEXT_PUBLIC_CLOUDINARY_FOLDER=sasha-store
```

Create the unsigned upload preset in Cloudinary Dashboard → Settings → Upload.
