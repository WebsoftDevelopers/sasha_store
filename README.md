# Sasha Store

Multi-service fragrance marketplace monorepo.

## Services

| Service | Stack | Port | Description |
|---------|-------|------|-------------|
| `web_services` | Next.js 16 | 3000 | Storefront and seller dashboard |
| `api_services` | NestJS + Prisma | 8000 | REST API (`/api`, Swagger at `/api/docs`) |
| `mobile_services` | TypeScript / Express | 3001 | Mobile API placeholder |
| `agentic_ai_services` | Python / FastAPI | 8001 | Agentic AI placeholder |

## Support tools (Docker profile `tools`)

| Tool | Port | Purpose |
|------|------|---------|
| PostgreSQL 16 | 5432 | App database (Prisma) |
| Adminer | 8080 | Database UI |
| Mailpit | 8025 (UI), 1025 (SMTP) | Local email capture |
| Redis 7 | 6379 | Cache / queue placeholder |

## Quick start with Docker

### 1. Configure environment

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker` and set your **Supabase** and **Cloudinary** credentials. Auth is handled by Supabase (cloud or local CLI); Postgres runs in Docker for app data.

### 2. Start everything

**Production-style images:**

```bash
make up
# or
docker compose --env-file .env.docker up --build -d
```

**Development with hot reload:**

```bash
make up-dev
# or
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.dev.yml up --build
```

The dev compose file bind-mounts `web_services` and `api_services` into their
containers and forces polling-based watchers, so changes to Next.js, NestJS, and
Prisma-facing source files should update live without rebuilding the image.

**Include support tools (Adminer, Mailpit, Redis):**

```bash
make up-tools
# or
docker compose --env-file .env.docker --profile tools up --build -d
```

### 3. Open the apps

| URL | Service |
|-----|---------|
| http://localhost:3000 | Web storefront |
| http://localhost:8000/api/docs | API Swagger |
| http://localhost:8000/api/health | API health check |
| http://localhost:3001/health | Mobile API placeholder |
| http://localhost:8001/health | Agentic AI placeholder |
| http://localhost:8080 | Adminer (with `--profile tools`) |
| http://localhost:8025 | Mailpit (with `--profile tools`) |

### 4. Database

Migrations run automatically when the API container starts. To seed sample data:

```bash
# one-off
make seed

# or set RUN_SEED=true in .env.docker before starting
```

Manual migration:

```bash
make migrate
```

## Local development without Docker

Each service can still run natively:

```bash
# API
cd api_services && npm install && npm run start:dev

# Web
cd web_services && npm install && npm run dev
```

Copy `.env.example` inside each service folder and point `DATABASE_URL` at your Postgres instance.

## Supabase auth

The API and web app require Supabase for authentication. Options:

1. **Cloud** — use credentials from your Supabase project dashboard in `.env.docker`.
2. **Local** — run [Supabase CLI](https://supabase.com/docs/guides/cli) alongside Docker:
   ```bash
   npx supabase start
   ```
   Copy the printed `API URL`, `anon key`, `service_role key`, and `JWT secret` into `.env.docker`.

Postgres in Docker is used for Prisma/app data. Supabase Auth validates JWTs independently of that database.

## Project layout

```
sasha_store/
├── api_services/          # NestJS API + Prisma
├── web_services/          # Next.js frontend
├── mobile_services/       # Mobile API (placeholder)
├── agentic_ai_services/   # Agentic AI (placeholder)
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.docker.example
└── Makefile
```

## Common commands

```bash
make down      # stop containers
make logs      # follow logs
make ps        # list containers
make build     # rebuild images
```

## Environment reference

See `.env.docker.example` for all Docker variables. Service-specific examples:

- `api_services/.env.example`
- `web_services/.env.example`
