.PHONY: help up up-dev up-prod up-tools down build logs ps seed migrate

COMPOSE ?= docker compose
ENV_FILE ?= --env-file .env.docker
DEV_FILES = -f docker-compose.yml -f docker-compose.dev.yml

help:
	@echo "Sasha Store Docker commands:"
	@echo "  make up         Start services with hot reload/watch mode"
	@echo "  make up-dev     Start services with hot reload/watch mode"
	@echo "  make up-prod    Start all services (production images)"
	@echo "  make up-tools   Start apps + postgres + adminer, mailpit, redis"
	@echo "  make down       Stop and remove containers"
	@echo "  make build      Build all images"
	@echo "  make logs       Tail logs for all services"
	@echo "  make ps         Show running containers"
	@echo "  make migrate    Run Prisma migrations in the api container"
	@echo "  make seed       Seed the database (api container)"

up:
	$(COMPOSE) $(ENV_FILE) $(DEV_FILES) up --build

up-dev:
	$(COMPOSE) $(ENV_FILE) $(DEV_FILES) up --build

up-prod:
	$(COMPOSE) $(ENV_FILE) up --build -d

up-tools:
	$(COMPOSE) $(ENV_FILE) --profile tools up --build -d

down:
	$(COMPOSE) $(ENV_FILE) $(DEV_FILES) down

build:
	$(COMPOSE) $(ENV_FILE) build

logs:
	$(COMPOSE) $(ENV_FILE) logs -f

ps:
	$(COMPOSE) $(ENV_FILE) ps

migrate:
	$(COMPOSE) $(ENV_FILE) exec api npx prisma migrate deploy

seed:
	$(COMPOSE) $(ENV_FILE) exec api npm run prisma:seed
