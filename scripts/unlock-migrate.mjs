/**
 * Clear a stuck Prisma migrate advisory lock (72707369) on Neon/Vercel Postgres.
 */
import "dotenv/config";
import pg from "pg";

const LOCK_KEY = 72707369;

function pickUrl() {
  const raw =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL;
  if (!raw) throw new Error("No database URL");
  const u = new URL(raw);
  if (u.hostname.includes("-pooler.")) u.hostname = u.hostname.replace("-pooler.", ".");
  return u.toString();
}

const client = new pg.Client({ connectionString: pickUrl(), connectionTimeoutMillis: 20_000 });
await client.connect();

const holders = await client.query(
  `SELECT l.pid, a.state, a.query, a.backend_start, a.xact_start
   FROM pg_locks l
   JOIN pg_stat_activity a ON a.pid = l.pid
   WHERE l.locktype = 'advisory'
     AND (l.objid = $1 OR l.classid = $1 OR (l.classid = 0 AND l.objid = $1))`,
  [LOCK_KEY],
);

console.log(`advisory lock holders: ${holders.rowCount}`);
for (const row of holders.rows) {
  console.log(row);
  if (row.pid && row.pid !== (await client.query("SELECT pg_backend_pid() AS pid")).rows[0].pid) {
    const r = await client.query("SELECT pg_terminate_backend($1) AS ok", [row.pid]);
    console.log(`terminate pid ${row.pid}:`, r.rows[0].ok);
  }
}

// Also terminate any idle migrate/deploy sessions holding locks longer than 30s
const stale = await client.query(
  `SELECT pid, state, query, now() - query_start AS age
   FROM pg_stat_activity
   WHERE datname = current_database()
     AND pid <> pg_backend_pid()
     AND query ILIKE '%pg_advisory_lock%'
     AND state <> 'idle'`,
);
for (const row of stale.rows) {
  console.log("stale advisory query:", row);
  await client.query("SELECT pg_terminate_backend($1)", [row.pid]);
}

await client.query("SELECT pg_advisory_unlock_all()");
console.log("pg_advisory_unlock_all() done on this session");
await client.end();
console.log("ok");
