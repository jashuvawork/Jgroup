# J Brand Ecosystem

Premium, futuristic, immersive 3D brand ecosystem website for the J master brand.

## One Vision. Many Possibilities.

### Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **React Three Fiber** + Drei for 3D experiences
- **Framer Motion** + GSAP for animations
- **Prisma** + SQLite for database
- **NextAuth** for admin authentication
- **Tailwind CSS** for styling

### Getting Started

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Admin Panel

- URL: `/admin`
- Email: `admin@jbrand.com`
- Password: `admin123`

### J Worlds

- **J Surprise Events** — `/j-surprise-events`
- **J Foods** — `/j-foods`
- **J Foundation** — `/j-foundation`

### Features

- Cinematic 3D opening sequence
- Interactive 3D world hub with floating portals
- Distinct visual experiences per business
- Scalable business directory (add new J worlds via admin)
- Full admin panel with business management
- Impact statistics from database
- Contact form with business routing
- WebGL fallback for unsupported devices
- Mobile-optimized experience
- Sound toggle (off by default)

### Environment Variables

```
DATABASE_URL=file:./dev.db
AUTH_SECRET=your-secret-key
AUTH_URL=http://localhost:3000
```

### Deployment

Configured for Vercel deployment with Prisma.
