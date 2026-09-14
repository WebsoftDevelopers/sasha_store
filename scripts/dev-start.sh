#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/config/.env"
ENV_EXAMPLE="$ROOT_DIR/config/.env.example"
COMPOSE_FILE="$ROOT_DIR/config/docker-compose.yml"

if [ ! -f "$ENV_FILE" ]; then
  cp "$ENV_EXAMPLE" "$ENV_FILE"
  echo "Created config/.env from config/.env.example. Fill secrets before using production."
fi

cd "$ROOT_DIR"

docker compose \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  up --build "$@"
