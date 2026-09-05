# Tools And Stacks

## Application Stack

- Web: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Supabase client libraries, Cloudinary.
- API: NestJS 11, Prisma 7, PostgreSQL, Supabase JWT validation, Swagger.
- Mobile service: TypeScript, Express, tsx, Node.js 22.
- Agent service: Python 3.12, FastAPI, Uvicorn.

## Platform Stack

- Docker Compose runs the full local platform.
- PostgreSQL 16 stores application data.
- Redis 7 is available through the `tools` profile for future cache or queue workflows.
- Adminer is available through the `tools` profile for database inspection.
- Mailpit is available through the `tools` profile for local email capture.

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
