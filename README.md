# Sasha Store

Sasha Store is a multi-service fragrance marketplace. The apps live in service folders, while Docker, environment variables, deployment config, and operational scripts are centralized in `config`.

## Folder Structure

- `apis` - NestJS REST API, Prisma schema, migrations, database services, auth, products, shops, ratings, orders, users, and storage modules.
- `web` - Next.js storefront and account experience for customers and sellers.
- `mobile` - TypeScript/Express mobile service placeholder running on port `3001`.
- `agent` - Python/FastAPI agent service placeholder running on port `8001`.
- `config` - Central platform configuration: `Dockerfile.dev`, `Dockerfile.prod`, Docker Compose, one shared `.env`, deploy config, and scripts.
- `docs` - Product, engineering, authentication, stack, and platform documentation.
- `test` - Integration testing workspace.

## Configuration

There is one environment file for the whole platform:

```sh
config/.env
```

Every Docker service receives that file through Compose. Add or edit service variables there only, not in the root or inside service folders.

## Run The Platform

Use the single platform script:

```sh
./config/scripts/sasha.sh start
```

Enable the repository hooks once per clone so Git blocks env files before commit:

```sh
git config core.hooksPath .githooks
```

The hooks also block direct pushes to `production`, `main`, `staging`, and `development`. Push a feature branch and open a PR for those branches.

Useful commands:

```sh
./config/scripts/sasha.sh dev
./config/scripts/sasha.sh tools
./config/scripts/sasha.sh prod
./config/scripts/sasha.sh logs
./config/scripts/sasha.sh ps
./config/scripts/sasha.sh stop
./config/scripts/sasha.sh reset
./config/scripts/sasha.sh migrate
./config/scripts/sasha.sh seed
./config/scripts/sasha.sh exec web npm install
./config/scripts/sasha.sh config
```

The repository uses one root `.gitignore` and one root `.dockerignore` so ignore rules apply across every service and platform file.

## Local URLs

- Web: `http://localhost:3000`
- API Swagger: `http://localhost:8000/api/docs`
- API health: `http://localhost:8000/api/health`
- Mobile health: `http://localhost:3001/health`
- Agent health: `http://localhost:8001/health`
- Adminer with tools profile: `http://localhost:8080`
- Mailpit with tools profile: `http://localhost:8025`

## Documentation

- [Software Requirements](docs/software-requirement.md)
- [Tools And Stacks](docs/tools-stacks.md)
- [Platform Config](docs/platform-config.md)
- [Auth](docs/features/AUTH.md)
