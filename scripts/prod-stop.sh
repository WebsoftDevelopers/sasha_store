#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/config/.env"
COMPOSE_FILE="$ROOT_DIR/config/docker-compose.prod.yml"

cd "$ROOT_DIR"

docker compose \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  down "$@"
