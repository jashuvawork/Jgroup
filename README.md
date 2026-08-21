# J Group — jgroup.space

**ONE VISION. MANY POSSIBILITIES.**

Premium multi-business digital ecosystem for J Surprise Events, J Foods, J Foundation, and future J worlds.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Railway PostgreSQL** — production database backend
- **Prisma 7** — ORM with PostgreSQL adapter
- **React Three Fiber** — cinematic 3D where appropriate
- **Framer Motion** — premium animations
- **NextAuth** — admin authentication
- **Tailwind CSS** — design system

## Local Development

```bash
# Start PostgreSQL
docker compose up -d

# Install & setup
npm install
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for Railway + `jgroup.space` setup.

| Environment | `NEXT_PUBLIC_APP_URL` |
|-------------|------------------------|
| Production  | `https://jgroup.space` |

## Admin

- URL: `/admin`
- Demo: `admin@jbrand.com` / `admin123`

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | J Space intro + cinematic hub |
| `/explore` | All J worlds |
| `/j-foods` | Food ordering experience |
| `/j-surprise-events` | Events & celebrations |
| `/j-foundation` | Community impact |
| `/about` | The J story |
| `/contact` | Enquiries |

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for phased build plan.
