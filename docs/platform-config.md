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
