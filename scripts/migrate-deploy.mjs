/**
 * Prisma migrate deploy for Neon via Vercel.
 * - Prefer unpooled / direct URL (pooler breaks advisory locks)
 * - Skip migrate when already applied (avoids lock fights on concurrent builds)
 * - Clear stuck Prisma advisory locks, then retry deploy
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const LOCK_KEY = 72707369;

function pickUrl() {
  const candidates = [
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DIRECT_URL,
    process.env.DATABASE_URL,
  ].filter((v) => typeof v === "string" && v.trim());

  if (!candidates.length) {
    console.error("migrate-deploy: no DATABASE_URL / UNPOOLED URL configured");
    process.exit(1);
  }
  return candidates[0].trim();
}

function toDirectUrl(raw) {
  try {
    const u = new URL(raw);
    if (u.hostname.includes("-pooler.")) {
      u.hostname = u.hostname.replace("-pooler.", ".");
      console.log(`migrate-deploy: rewritten pooler host → ${u.hostname}`);
    }
    if (!u.searchParams.has("connect_timeout")) u.searchParams.set("connect_timeout", "30");
    if (!u.searchParams.has("sslmode")) u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return raw;
  }
}

function localMigrationNames() {
  const dir = join(process.cwd(), "prisma", "migrations");
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d+_/.test(d.name))
    .map((d) => d.name)
    .sort();
}

async function withClient(url, fn) {
  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20_000 });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end().catch(() => undefined);
  }
}

async function alreadyApplied(url) {
  const local = localMigrationNames();
  if (!local.length) return true;
  try {
    return await withClient(url, async (client) => {
      const exists = await client.query(
        `SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = '_prisma_migrations'`,
      );
      if (!exists.rowCount) return false;
      const rows = await client.query(`SELECT migration_name, finished_at FROM _prisma_migrations`);
      const done = new Set(rows.rows.filter((r) => r.finished_at).map((r) => r.migration_name));
      const pending = local.filter((name) => !done.has(name));
      if (pending.length === 0) {
        console.log(`migrate-deploy: all ${local.length} migrations already applied — skip`);
        return true;
      }
      console.log(`migrate-deploy: pending migrations: ${pending.join(", ")}`);
      return false;
    });
  } catch (e) {
    console.warn("migrate-deploy: could not check migration table:", e.message);
    return false;
  }
}

async function clearStuckLocks(url) {
  try {
    await withClient(url, async (client) => {
      const holders = await client.query(
        `SELECT l.pid, a.state, left(a.query, 120) AS query
         FROM pg_locks l
         JOIN pg_stat_activity a ON a.pid = l.pid
         WHERE l.locktype = 'advisory'
           AND l.objid = $1
           AND a.pid <> pg_backend_pid()`,
        [LOCK_KEY],
      );
      for (const row of holders.rows) {
        console.warn(`migrate-deploy: terminating lock holder pid=${row.pid} state=${row.state}`);
        await client.query("SELECT pg_terminate_backend($1)", [row.pid]);
      }
      const waiting = await client.query(
        `SELECT pid FROM pg_stat_activity
         WHERE datname = current_database()
           AND pid <> pg_backend_pid()
           AND query ILIKE '%pg_advisory_lock(${LOCK_KEY})%'`,
      );
      for (const row of waiting.rows) {
        console.warn(`migrate-deploy: terminating waiter pid=${row.pid}`);
        await client.query("SELECT pg_terminate_backend($1)", [row.pid]);
      }
    });
  } catch (e) {
    console.warn("migrate-deploy: unlock skipped:", e.message);
  }
}

const url = toDirectUrl(pickUrl());

if (await alreadyApplied(url)) process.exit(0);

await clearStuckLocks(url);

const maxAttempts = 5;
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  console.log(`migrate-deploy: attempt ${attempt}/${maxAttempts}`);
  if (attempt > 1) await clearStuckLocks(url);

  const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
    shell: process.platform === "win32",
  });

  if (result.status === 0) process.exit(0);

  // If another build applied migrations while we waited, succeed.
  if (await alreadyApplied(url)) process.exit(0);

  if (attempt === maxAttempts) {
    console.error("migrate-deploy: failed after retries (P1002 = stuck advisory lock)");
    process.exit(result.status ?? 1);
  }
  const waitSec = 4 * attempt;
  console.warn(`migrate-deploy: retrying in ${waitSec}s…`);
  spawnSync("sleep", [String(waitSec)], { stdio: "ignore" });
}
