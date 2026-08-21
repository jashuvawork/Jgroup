#!/usr/bin/env bash
#
# Idempotent Cloud Agent setup for the J Brand Ecosystem app.
# Safe to run on every boot: dependencies, the local .env, the SQLite
# database and its seed data are only created/refreshed when needed.
set -euo pipefail

# Always operate from the repository root (this script lives in .cursor/).
cd "$(dirname "$0")/.."

# 1. Install dependencies. The package.json "postinstall" hook runs
#    `prisma generate`, so the Prisma client is regenerated here too.
npm install

# 2. Create a local .env from the example on first run only; never
#    clobber an existing one (it may hold real secrets).
if [ ! -f .env ]; then
  echo "Creating .env from .env.example"
  cp .env.example .env
fi

# 3. Apply committed migrations. This creates ./dev.db on the first run
#    and is a no-op once every migration has been applied.
npx prisma migrate deploy

# 4. Seed once. The seed script upserts singletons but uses create() for
#    child rows (services, products, reviews, ...), so re-running it would
#    duplicate data. Only seed when no admin exists yet.
if node -e "const D=require('better-sqlite3');let seeded=false;try{seeded=new D('dev.db').prepare('SELECT COUNT(*) AS c FROM Admin').get().c>0}catch{};process.exit(seeded?0:1)"; then
  echo "Database already seeded — skipping seed."
else
  echo "Seeding database"
  npm run db:seed
fi

echo "J Brand Ecosystem setup complete."
