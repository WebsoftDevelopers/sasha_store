# Platform Config

The `config` folder is the central control plane for Sasha Store.

## Folder Map

- `config/.env` contains every environment variable for every service.
- `config/docker-compose.yml` defines the local platform services and shared volumes.
- `config/Dockerfile.dev` contains development Docker targets for API, web, mobile, and agent.
- `config/Dockerfile.prod` contains production Docker targets for API, web, mobile, and agent.
- `config/scripts/sasha.sh` is the single script for running Docker commands.
- `config/deploy` contains deployment and CI/CD configuration.
- `.gitignore` contains repository-wide Git ignore rules.
- `.dockerignore` contains repository-wide Docker build ignore rules.

## Services

- `postgres` - local PostgreSQL database.
- `api` - NestJS API on port `8000`.
- `web` - Next.js app on port `3000`.
- `mobile` - TypeScript/Express service on port `3001`.
- `agentic-ai` - FastAPI service on port `8001`.
- `redis`, `adminer`, and `mailpit` - optional support services through the `tools` profile.

## External Providers

- Supabase Auth validates users and sessions.
- Supabase PostgreSQL stores hosted application data.
- Cloudinary stores uploaded media files. The app stores Cloudinary URLs, public IDs, and metadata in `media_assets`.
- Upstash Redis backs production caching and BullMQ queues.
- Supabase database caching can be enabled with `SUPABASE_DB_CACHE_ENABLED`.
- Namecheap SMTP sends transactional email.
- BullMQ handles application events and background jobs.

## Required Provider Variables

- Supabase: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`, plus `SUPABASE_JWT_SECRET` or `SUPABASE_JWKS_URL`.
- Database: `DATABASE_URL`, optional `DIRECT_URL`.
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`.
- Web Cloudinary uploads: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `NEXT_PUBLIC_CLOUDINARY_FOLDER`.
- Upstash: `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`.
- Email: `NAMECHEAP_SMTP_HOST`, `NAMECHEAP_SMTP_PORT`, `NAMECHEAP_SMTP_USER`, `NAMECHEAP_SMTP_PASSWORD`, `EMAIL_FROM`.
- Events: `BULLMQ_REDIS_URL`, falling back to `UPSTASH_REDIS_URL` when omitted.

## Commands

```sh
./config/scripts/sasha.sh start
./config/scripts/sasha.sh dev
./config/scripts/sasha.sh tools
./config/scripts/sasha.sh prod
./config/scripts/sasha.sh stop
./config/scripts/sasha.sh reset
./config/scripts/sasha.sh logs
./config/scripts/sasha.sh ps
```

## Dockerfile Modes

Development starts with `config/Dockerfile.dev` by default. Production-style builds use `config/Dockerfile.prod` through `./config/scripts/sasha.sh prod` or `./config/scripts/sasha.sh build-prod`.
