import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Prefer Neon direct/unpooled URL for migrate (pooler breaks advisory locks). */
function datasourceUrl() {
  const raw =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DIRECT_URL ||
    process.env.DATABASE_URL ||
    "";
  if (!raw) return raw;
  try {
    const u = new URL(raw);
    if (u.hostname.includes("-pooler.")) {
      u.hostname = u.hostname.replace("-pooler.", ".");
    }
    return u.toString();
  } catch {
    return raw;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: datasourceUrl(),
  },
});
