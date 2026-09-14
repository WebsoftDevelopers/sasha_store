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
- PostgreSQL stores application data.
- S3-compatible object storage stores uploaded media files. The app stores URLs, provider IDs, and metadata in `media_assets`.
- Redis backs caching and BullMQ queues.
- Supabase database caching can be enabled with `API_SUPABASE_DB_CACHE_ENABLED`.
- Namecheap SMTP sends transactional email.
- BullMQ handles application events and background jobs.

## Required Provider Variables

- API Supabase Auth: `API_SUPABASE_URL`, `API_SUPABASE_PUBLISHABLE_KEY` or `API_SUPABASE_ANON_KEY`, `API_SUPABASE_SECRET_KEY` or `API_SUPABASE_SERVICE_ROLE_KEY`, plus `API_SUPABASE_JWT_SECRET` or `API_SUPABASE_JWKS_URL`.
- API database: `API_DATABASE_URL` and optional `API_DIRECT_URL`, or `API_POSTGRES_USER`, `API_POSTGRES_PASSWORD`, and `API_POSTGRES_DB` for Docker Postgres.
- API storage: `API_STORAGE_PROVIDER`, `API_S3_ENDPOINT`, `API_S3_PUBLIC_URL`, `API_S3_BUCKET`, `API_S3_REGION`, `API_S3_ACCESS_KEY`, `API_S3_SECRET_KEY`, and `API_S3_FORCE_PATH_STYLE`.
- API email: `API_NAMECHEAP_SMTP_HOST`, `API_NAMECHEAP_SMTP_PORT`, `API_NAMECHEAP_SMTP_USER`, `API_NAMECHEAP_SMTP_PASSWORD`, and `API_EMAIL_FROM`.
- API events: `API_BULLMQ_REDIS_URL`, falling back to `API_UPSTASH_REDIS_URL` when omitted.
- Web: `NEXT_DOMAIN`, `NEXT_APP_URL`, `NEXT_ACME_EMAIL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_AUTH_URL`, and `NEXT_PUBLIC_AUTH_PUBLIC_KEY`.
- Mobile: `EXPO_PORT` and `EXPO_PUBLIC_API_URL`.
- Agent: `AGENT_PORT`, `AGENT_API_BASE_URL`, `AGENT_REDIS_URL`, and `AGENT_DATABASE_URL`.

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
