#!/usr/bin/env node
/**
 * Migration runner — applies files in supabase/migrations/ once each,
 * tracked in a `_migrations` table. Runs during `vercel-build` so each
 * Vercel deployment auto-syncs its own Supabase.
 *
 * Env:
 *   SUPABASE_DB_URL  postgres connection string (required — when unset,
 *                    the script is a no-op so local builds still work)
 *
 * Idempotent: safe to run repeatedly. Transactional per file.
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const DB_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!DB_URL) {
  console.log("[migrate] SUPABASE_DB_URL not set — skipping migrations.");
  process.exit(0);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIG_DIR = join(__dirname, "..", "supabase", "migrations");

const client = new pg.Client({
  connectionString: DB_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const t0 = Date.now();
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  const files = (await readdir(MIG_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const { rows } = await client.query("SELECT id FROM _migrations");
  const applied = new Set(rows.map((r) => r.id));

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(join(MIG_DIR, file), "utf8");
    process.stdout.write(`[migrate] applying ${file}… `);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations (id) VALUES ($1)", [file]);
      await client.query("COMMIT");
      process.stdout.write("ok\n");
      count += 1;
    } catch (err) {
      await client.query("ROLLBACK");
      process.stdout.write("FAILED\n");
      console.error(`[migrate] ${file}:`, err.message);
      throw err;
    }
  }

  await client.end();
  const ms = Date.now() - t0;
  console.log(
    `[migrate] done in ${ms}ms — ${count} applied, ${applied.size} already up to date.`,
  );
}

main().catch((err) => {
  console.error("[migrate] fatal:", err);
  process.exit(1);
});
