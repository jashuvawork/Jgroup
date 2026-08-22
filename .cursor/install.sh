#!/usr/bin/env bash
#
# Idempotent Cloud Agent setup for the J Brand Ecosystem app.
#
# The app uses PostgreSQL (see prisma/schema.prisma and docker-compose.yml).
# Docker is not available in the Cloud Agent VM, so instead of
# `docker compose up` we provision the same PostgreSQL 16 instance locally
# via apt, matching docker-compose.yml (user/password/db = jgroup) and the
# DATABASE_URL in .env.example.
set -euo pipefail

cd "$(dirname "$0")/.."

PG_VERSION=16
PG_USER=jgroup
PG_PASSWORD=jgroup_dev
PG_DB=jgroup

# 1. Install PostgreSQL if it is not already present.
if [ ! -d "/usr/lib/postgresql/${PG_VERSION}" ]; then
  echo "Installing PostgreSQL ${PG_VERSION}…"
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq "postgresql-${PG_VERSION}"
fi

# 2. Ensure the default cluster is running.
if ! sudo pg_ctlcluster "${PG_VERSION}" main status >/dev/null 2>&1; then
  sudo pg_ctlcluster "${PG_VERSION}" main start || true
fi

# 3. Wait for the server to accept connections.
for _ in $(seq 1 30); do
  if sudo -u postgres pg_isready -q; then break; fi
  sleep 1
done

# 4. Create the application role and database (idempotent).
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${PG_USER}'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE ROLE ${PG_USER} LOGIN PASSWORD '${PG_PASSWORD}' CREATEDB;"
fi
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${PG_DB}'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE DATABASE ${PG_DB} OWNER ${PG_USER};"
fi

# 5. Install dependencies (postinstall runs `prisma generate`).
npm install

# 6. Create a local .env from the example on first run only; never clobber
#    an existing one (it may hold real credentials).
if [ ! -f .env ]; then
  echo "Creating .env from .env.example"
  cp .env.example .env
fi

# 7. Apply migrations, then seed. Export the local DATABASE_URL explicitly so
#    the Prisma CLI and the seed script (which reads process.env.DATABASE_URL
#    directly and does not load .env) both target the local database, never a
#    production one. main's seed dedupes on re-run, so it is safe every time.
export DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@localhost:5432/${PG_DB}"
npx prisma migrate deploy
npm run db:seed

echo "J Brand Ecosystem (PostgreSQL) setup complete."
