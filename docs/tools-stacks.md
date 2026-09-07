# Tools And Stacks

## Application Stack

- Web: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Supabase client libraries, Cloudinary client uploads.
- API: NestJS 11, Prisma 7, PostgreSQL, Supabase JWT validation, Swagger, centralized media asset recording.
- Mobile service: TypeScript, Express, tsx, Node.js 22.
- Agent service: Python 3.12, FastAPI, Uvicorn.

## Platform Stack

- Docker Compose runs the full local platform.
- Supabase PostgreSQL stores production application data.
- Local PostgreSQL 16 stores application data during Docker development.
- Cloudinary stores all uploaded images, videos, documents, and blobs; the database stores URLs and metadata only.
- Upstash Redis is the production Redis provider for cache and BullMQ-backed events.
- Redis 7 is available through the `tools` profile for local cache or queue workflows.
- Namecheap SMTP provides application email delivery.
- BullMQ provides background jobs and domain events.
- Adminer is available through the `tools` profile for database inspection.
- Mailpit is available through the `tools` profile for local email capture.

## Data And Media Providers

- Authentication: Supabase Auth.
- Database: Supabase PostgreSQL in hosted environments, local PostgreSQL in Docker.
- Media bucket: Cloudinary.
- Central media registry: Prisma `media_assets` table.
- Cache: Upstash Redis, plus Supabase database caching where implemented.
- Email: Namecheap SMTP.
- Events and queues: BullMQ backed by Redis or Upstash Redis.

## Central Configuration

All platform files live under `config`:

- `config/docker-compose.yml` - service orchestration.
- `config/Dockerfile.dev` - development Docker targets for API, web, mobile, and agent.
- `config/Dockerfile.prod` - production Docker targets for API, web, mobile, and agent.
- `config/.env` - the only env file.
- `config/scripts/sasha.sh` - the only script used to operate the Docker stack.
- `config/deploy` - deployment and CI/CD configuration.
- `.gitignore` - one repository-wide Git ignore file.
- `.dockerignore` - one repository-wide Docker ignore file.

## Script Commands

```sh
./config/scripts/sasha.sh start
./config/scripts/sasha.sh dev
./config/scripts/sasha.sh tools
./config/scripts/sasha.sh prod
./config/scripts/sasha.sh stop
./config/scripts/sasha.sh restart
./config/scripts/sasha.sh reset
./config/scripts/sasha.sh build
./config/scripts/sasha.sh build-prod
./config/scripts/sasha.sh logs
./config/scripts/sasha.sh ps
./config/scripts/sasha.sh migrate
./config/scripts/sasha.sh seed
./config/scripts/sasha.sh exec web npm install
./config/scripts/sasha.sh config
```
