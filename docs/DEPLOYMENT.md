# J Group — Deployment Guide

Production domain: **https://jgroup.space**

## Architecture

| Layer | Platform | Purpose |
|-------|----------|---------|
| Frontend + API | Vercel **or** Railway | Next.js app |
| Database | **Railway PostgreSQL** | Primary backend data store |
| Domain | jgroup.space | Custom domain on Vercel or Railway |

## Railway Setup (Backend / Full Stack)

### 1. Create Railway project

1. Go to [railway.app](https://railway.app) and create a new project.
2. Add a **PostgreSQL** database service.
3. Add a **GitHub repo** service linked to this repository.

### 2. Configure environment variables

In Railway → your Next.js service → Variables:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
AUTH_SECRET=<generate-a-long-random-string>
AUTH_URL=https://jgroup.space
NEXTAUTH_URL=https://jgroup.space
NEXT_PUBLIC_APP_URL=https://jgroup.space
RAILWAY=true
```

### 3. Deploy

Railway reads `railway.toml` and runs:

- **Build:** `npm run build` (prisma generate + next build)
- **Start:** `npm run railway:start` (migrate + seed + next start)
- **Health check:** `/api/health`

### 4. Custom domain (jgroup.space)

1. Railway → Service → Settings → Networking → Custom Domain
2. Add `jgroup.space` and `www.jgroup.space`
3. Update DNS at your registrar:
   - `CNAME` `www` → Railway-provided hostname
   - `A` or `ALIAS` `@` → Railway-provided IP/hostname

## Vercel Setup (Frontend + API with Railway DB)

If you prefer Vercel for the Next.js app and Railway **only for PostgreSQL**:

1. Deploy to Vercel from GitHub.
2. In Vercel → Settings → Environment Variables, add:
   - `DATABASE_URL` = Railway Postgres **public** connection URL
   - `AUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`
3. Vercel uses `vercel-build` script (migrate + seed + build).
4. Point `jgroup.space` DNS to Vercel.

## Local Development

```bash
# Start PostgreSQL
docker compose up -d

# Copy env
cp .env.example .env

# Run migrations and seed
npx prisma migrate deploy
npm run db:seed

# Start dev server
npm run dev
```

## DNS Checklist for jgroup.space

| Record | Value |
|--------|-------|
| `@` | Vercel or Railway target |
| `www` | CNAME to hosting provider |
| SSL | Automatic via Vercel/Railway |

## Payment keys (future)

Store Razorpay secrets **only** in Railway/Vercel environment variables — never in code or client bundles.
