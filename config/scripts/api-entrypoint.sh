#!/usr/bin/env sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Seeding database..."
  npm run prisma:seed
fi

exec "$@"
