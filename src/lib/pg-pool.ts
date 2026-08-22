import type { PoolConfig } from "pg";

/** Pool options for Railway / remote Postgres (self-signed TLS on proxy hosts). */
export function getPgPoolConfig(connectionString: string): PoolConfig {
  const needsSsl =
    connectionString.includes("rlwy.net") ||
    connectionString.includes("railway") ||
    connectionString.includes("sslmode=");

  if (!needsSsl) {
    return { connectionString };
  }

  // Strip sslmode from URL — pg enforces verify-full when sslmode is in the string,
  // which rejects Railway's proxy certificate even with rejectUnauthorized: false.
  const url = new URL(connectionString.replace(/^postgres:/, "postgresql:"));
  url.searchParams.delete("sslmode");
  url.searchParams.delete("ssl");

  return {
    connectionString: url.toString().replace(/^postgresql:/, "postgres:"),
    ssl: { rejectUnauthorized: false },
  };
}
