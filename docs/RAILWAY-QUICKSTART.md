# Railway Quick Start — Jgroup Service

**Do not use Railway's "Suggested Variables" as-is.** Those values come from `.env.example` and are for local development only.

## Step 1: Add PostgreSQL (if not already)

1. In your Railway project, click **+ New** → **Database** → **PostgreSQL**
2. Wait until the Postgres service shows **Online**

## Step 2: Link Postgres to Jgroup service

1. Open the **Jgroup** service (your GitHub app)
2. Go to **Variables** tab
3. Click **+ New Variable** → **Add Reference**
4. Select your **PostgreSQL** service → choose **`DATABASE_URL`**
5. This sets `DATABASE_URL` to the real Railway Postgres URL (not localhost)

## Step 3: Add these variables manually

Click **+ New Variable** for each (do **not** bulk-add the suggested localhost values):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` *(reference, from Step 2)* |
| `AUTH_SECRET` | Run `openssl rand -base64 32` and paste the output |
| `AUTH_URL` | `https://jgroup.space` |
| `NEXTAUTH_URL` | `https://jgroup.space` |
| `NEXT_PUBLIC_APP_URL` | `https://jgroup.space` |
| `RAILWAY` | `true` |

### Until jgroup.space DNS is live

Use your Railway public URL temporarily:

```
AUTH_URL=https://jgroup-production.up.railway.app
NEXTAUTH_URL=https://jgroup-production.up.railway.app
NEXT_PUBLIC_APP_URL=https://jgroup-production.up.railway.app
```

Replace with your actual Railway hostname from **Settings → Networking → Public URL**.

## Step 4: Redeploy

After saving variables, Railway redeploys automatically. Check **Deployments** tab — build runs `next build`; migrations and seed run at **start** when the app can reach Postgres on the private network.

## Step 5: Custom domain (jgroup.space)

1. **Jgroup** service → **Settings** → **Networking** → **Custom Domain**
2. Add `jgroup.space` and `www.jgroup.space`
3. Update DNS at your domain registrar with Railway's records
4. Update `AUTH_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` to `https://jgroup.space`

## What NOT to add

| Wrong value | Why |
|-------------|-----|
| `postgresql://jgroup:jgroup_dev@localhost:5432/jgroup` | Local Docker only — won't work on Railway |
| `http://localhost:3000` | Not reachable in production |
| `change-this-to-a-random-secret-in-production` | Insecure placeholder |

## Verify it works

- Visit `https://<your-railway-url>/api/health` → should return `{"status":"ok"}`
- Visit `/admin/login` → demo: `admin@jbrand.com` / `admin123`

## Warning badge (⚠️ 1)

Usually means missing env vars or a failed deploy. After setting `DATABASE_URL` from Postgres reference and redeploying, the warning should clear.
