#!/usr/bin/env sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

exec npm run start:dev
