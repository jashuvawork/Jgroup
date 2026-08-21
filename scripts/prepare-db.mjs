#!/usr/bin/env node
/**
 * Run Prisma migrations + seed only when a valid PostgreSQL DATABASE_URL is set.
 * Allows Vercel preview builds to succeed before Railway Postgres is linked.
 */
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";

const isPostgres =
  url.startsWith("postgresql://") || url.startsWith("postgres://");

if (!isPostgres) {
  console.log(
    "Skipping migrate/seed: DATABASE_URL is not set or is not PostgreSQL."
  );
  console.log("Set DATABASE_URL to your Railway Postgres URL in Vercel env vars.");
  process.exit(0);
}

console.log("Running Prisma migrate deploy...");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

console.log("Running database seed...");
execSync("npm run db:seed", { stdio: "inherit" });

console.log("Database ready.");
