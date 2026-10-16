/**
 * Prisma migrate deploy for Neon + Vercel.
 * Uses a direct (non-pooler) URL and retries advisory-lock timeouts (P1002).
 */
import { spawnSync } from "node:child_process";

function pickUrl() {
  const candidates = [
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_PRISMA_URL,
    process.env.DIRECT_URL,
    process.env.DATABASE_URL,
  ].filter((v) => typeof v === "string" && v.trim());

  if (!candidates.length) {
    console.error("migrate-deploy: no DATABASE_URL / UNPOOLED URL configured");
    process.exit(1);
  }
  return candidates[0].trim();
}

/** Neon pooler cannot hold session advisory locks reliably. */
function toDirectUrl(raw) {
  try {
    const u = new URL(raw);
    if (u.hostname.includes("-pooler.")) {
      u.hostname = u.hostname.replace("-pooler.", ".");
      console.log(`migrate-deploy: rewritten pooler host → ${u.hostname}`);
    }
    if (!u.searchParams.has("connect_timeout")) {
      u.searchParams.set("connect_timeout", "30");
    }
    // Prefer verify-full-compatible SSL for Neon without hanging on pooler semantics
    if (!u.searchParams.has("sslmode")) {
      u.searchParams.set("sslmode", "require");
    }
    return u.toString();
  } catch {
    return raw;
  }
}

const url = toDirectUrl(pickUrl());
const maxAttempts = 5;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  console.log(`migrate-deploy: attempt ${attempt}/${maxAttempts}`);
  const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
    shell: process.platform === "win32",
  });

  if (result.status === 0) {
    process.exit(0);
  }

  const canRetry = attempt < maxAttempts;
  if (!canRetry) {
    console.error("migrate-deploy: failed after retries (P1002 = advisory lock / wrong pooled URL)");
    process.exit(result.status ?? 1);
  }

  const waitSec = 3 * attempt;
  console.warn(`migrate-deploy: retrying in ${waitSec}s…`);
  spawnSync("sleep", [String(waitSec)], { stdio: "ignore" });
}
