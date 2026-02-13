import { cache } from "react";
import { PrismaClient } from "@prisma/client";

// Cloudflare D1 adapter - only used when @opennextjs/cloudflare and @prisma/adapter-d1 are available
async function getPrismaForCloudflare() {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { PrismaD1 } = await import("@prisma/adapter-d1");
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as { DB?: unknown }).DB;
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapter = new PrismaD1(db as any);
      return new PrismaClient({ adapter } as any);
    }
  } catch {
    // Cloudflare packages not available or no D1 binding
  }
  return null;
}

// Standard Prisma (SQLite) - used for local dev or fallback during build
// Use in-memory URL when DATABASE_URL is missing (e.g. Cloudflare build prerender)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const dbUrl = process.env.DATABASE_URL || "file::memory:";
const defaultPrisma =
  globalForPrisma.prisma ||
  new PrismaClient({ datasources: { db: { url: dbUrl } } });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = defaultPrisma;

/**
 * Get Prisma client - uses D1 on Cloudflare, SQLite otherwise.
 * Cached per request in server components.
 */
export const getDb = cache(async () => {
  const cfPrisma = await getPrismaForCloudflare();
  return cfPrisma ?? defaultPrisma;
});

/**
 * Synchronous getter for contexts where async isn't possible.
 * Use getDb() in API routes and server components.
 */
export const prisma = defaultPrisma;
