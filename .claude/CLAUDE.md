# Closet by Junassan — agent guide

Pakistani thrift e-commerce storefront + admin. Next.js 16 App Router, React 19.2, Tailwind v4, Supabase (optional — seed fallback is first-class), Zustand. COD-only.

## Memory

@.claude/memory/architecture.md
@.claude/memory/stack.md
@.claude/memory/decisions.md
@.claude/memory/feature-ideas.md
@.claude/memory/run-log.md

Also read (at repo root): @AGENTS.md — Next.js 16 is a breaking version; consult `node_modules/next/dist/docs/` before writing framework-facing code.

## Working rules

1. **Always branch from `dev`.** Never work directly on `dev` or `main`. Create a focused feature branch (`feat/…`, `fix/…`, `chore/…`) off `dev`, push there, open the PR against `dev`.
2. **PRs target `dev`, never `main`.** `main` is promoted from `dev` separately; don't circumvent that.
3. **One focused change per run.** Don't bundle unrelated refactors, cleanups, or "while I'm here" fixes into a feature PR. If you spot something else that needs doing, note it in `feature-ideas.md` or `run-log.md` and leave it for a separate run.
4. **Update memory as part of each PR.** Every PR must include:
   - a new entry at the top of `.claude/memory/run-log.md` (goal / changed / outcome)
   - any updates to `architecture.md` / `stack.md` that the change invalidates
   - a new dated entry in `.claude/memory/decisions.md` if the change cements a direction, principle, or rejection
   - promoted or removed items in `feature-ideas.md` when applicable
5. **Schema changes = new numbered migration.** Never edit an already-applied file under `supabase/migrations/`. The next file is `0022_*.sql`. Keep the 4-digit prefix — `scripts/migrate.mjs` orders lexicographically.
6. **Never import `@/lib/supabase/admin` from a `"use client"` file.** It's `server-only` and exposes the service-role key.
7. **Respect the seed-data fallback.** Every read helper in `src/lib/` is dual-mode (Supabase + `SEED_PRODUCTS`). Don't remove either branch without an explicit decision entry.
8. **Verify UI in the browser before declaring a UI task done.** `next build` + type-check is not enough; start `npm run dev` and click through the golden path.
