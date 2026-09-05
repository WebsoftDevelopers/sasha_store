#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
CONFIG_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
COMPOSE_FILE="$CONFIG_DIR/docker-compose.yml"
ENV_FILE="$CONFIG_DIR/.env"

compose() {
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

compose_prod() {
  COMPOSE_DOCKERFILE=config/Dockerfile.prod docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

case "${1:-help}" in
  start|up)
    shift || true
    compose up --build -d "$@"
    ;;
  dev)
    shift || true
    compose up --build "$@"
    ;;
  tools)
    shift || true
    compose --profile tools up --build -d "$@"
    ;;
  prod)
    shift || true
    compose_prod up --build -d "$@"
    ;;
  stop|down)
    shift || true
    compose down "$@"
    ;;
  restart)
    shift || true
    compose down
    compose up --build -d "$@"
    ;;
  reset)
    shift || true
    compose down --volumes --remove-orphans "$@"
    ;;
  build)
    shift || true
    compose build "$@"
    ;;
  build-prod)
    shift || true
    compose_prod build "$@"
    ;;
  logs)
    shift || true
    compose logs -f "$@"
    ;;
  ps|status)
    shift || true
    compose ps "$@"
    ;;
  migrate)
    shift || true
    compose exec api npx prisma migrate deploy "$@"
    ;;
  seed)
    shift || true
    compose exec api npm run prisma:seed "$@"
    ;;
  exec)
    shift || true
    compose exec "$@"
    ;;
  config)
    shift || true
    compose config "$@"
    ;;
  *)
    cat <<'HELP'
Sasha Store platform script

Usage:
  ./config/scripts/sasha.sh start      Start all app services in the background
  ./config/scripts/sasha.sh dev        Start all app services in the foreground
  ./config/scripts/sasha.sh tools      Start app services plus Adminer, Mailpit, and Redis
  ./config/scripts/sasha.sh prod       Start services with config/Dockerfile.prod
  ./config/scripts/sasha.sh stop       Stop and remove containers
  ./config/scripts/sasha.sh restart    Restart app services
  ./config/scripts/sasha.sh reset      Stop containers and remove local Docker volumes
  ./config/scripts/sasha.sh build      Build service images
  ./config/scripts/sasha.sh build-prod Build service images with config/Dockerfile.prod
  ./config/scripts/sasha.sh logs       Follow service logs
  ./config/scripts/sasha.sh ps         Show service status
  ./config/scripts/sasha.sh migrate    Run Prisma migrations in the API container
  ./config/scripts/sasha.sh seed       Seed the database through the API container
  ./config/scripts/sasha.sh exec       Execute a command in a running service
  ./config/scripts/sasha.sh config     Render the Docker Compose configuration

All commands use:
  config/docker-compose.yml
  config/.env
HELP
    ;;
esac
