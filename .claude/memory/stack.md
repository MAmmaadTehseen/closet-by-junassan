# Stack

## Languages

- **TypeScript** strict mode (`tsconfig.json`), ES2017 target, `moduleResolution: "bundler"`, `jsx: react-jsx`, path alias `@/* → src/*`. `allowJs: true` covers `.mjs` scripts.
- **SQL** — Postgres (Supabase flavor), one file per migration, applied by a Node runner.
- No CSS preprocessor — Tailwind v4 only, plus a single plain `globals.css`.

## Runtime

- **Node** ≥ 20 (required by `@types/node: ^20` and Next 16). Windows (`win32`) dev is expected — the Claude shell is bash, but the machine is Windows 11.
- **React 19.2.4** — concurrent, supports `use()` and form `useActionState`. Server components by default everywhere under `app/`. `"use client"` opt-in.
- **Next.js 16.2.3** (App Router, Turbopack dev). See `AGENTS.md`: this is a breaking version — read `node_modules/next/dist/docs/` (01-app / 03-architecture) before writing anything framework-facing. Deprecation notices in docs matter.

## Frameworks & libraries

| Dep | Version | Role |
|---|---|---|
| `next` | 16.2.3 | App Router, server actions, image opt, metadata routes, cron via `vercel.json` |
| `react` / `react-dom` | 19.2.4 | UI |
| `@supabase/ssr` | ^0.10.2 | cookie-aware browser + server clients |
| `@supabase/supabase-js` | ^2.103.0 | used directly for service-role admin client and a couple of public reads where cookies aren't needed |
| `zustand` | ^5.0.12 | cart, wishlist, UI drawers, recent-viewed — with `persist` middleware where relevant (`closet-cart`, `closet-wishlist`) |
| `lucide-react` | ^1.8.0 | icons |
| `clsx` | ^2.1.1 | conditional class names |
| `pg` | ^8.13.1 | **build-time only** — used by `scripts/migrate.mjs` (NOT in Next runtime) |
| `server-only` | ^0.0.1 | poison-pill import in `supabase/admin.ts` so service key can't leak to the client |
| `tailwindcss` + `@tailwindcss/postcss` | ^4 | styling; zero config beyond `postcss.config.mjs` |
| `eslint` + `eslint-config-next` | ^9 / 16.2.3 | lint, flat config in `eslint.config.mjs` |

No test framework is installed. No Jest/Vitest/Playwright. CI runs `next build` via `vercel-build` which first runs migrations.

## Build & deploy

- `npm run dev` — `next dev` (Turbopack).
- `npm run build` — `next build`.
- `npm run vercel-build` — `node scripts/migrate.mjs && next build`. This is what Vercel invokes. The migration step is a no-op when `SUPABASE_DB_URL` is unset, so the command is safe everywhere.
- `npm run migrate` — runs only the migration step.
- `npm run lint` — eslint flat config.
- `npm start` — `next start` (for manual prod runs).

**Host**: Vercel. Crons declared in `vercel.json` (`/api/cron/activate` every 15 min, `/api/cron/abandoned` hourly). Cron routes authenticate via the Vercel `vercel-cron` UA OR a matching `x-cron-secret` header.

**Database**: Supabase. Connection must be the **Session pooler** URL on Vercel (IPv4); the direct `db.[ref].supabase.co` host is IPv6-only and fails with ENETUNREACH on the build runner — `scripts/migrate.mjs` header documents this explicitly.

## Migration system

Home-grown, not supabase-cli. `scripts/migrate.mjs`:
- reads `supabase/migrations/*.sql` in lexicographic order
- tracks applied files in a `_migrations(id text primary key, applied_at timestamptz)` table
- each file runs in its own `BEGIN/COMMIT` transaction
- idempotent — safe to rerun, used on every Vercel deploy

Rule: **new schema changes must be a new numbered file** (next is `0022_*.sql`). Never edit an already-applied migration.

## Conventions

- **Server-first**: pages and layouts are RSCs that directly await `fetch*` helpers in `src/lib/`. Client components only when interactivity / browser APIs are required.
- **Supabase-first with seed fallback**: every read helper tries Supabase if `hasSupabaseEnv()`, catches/empties, and falls through to `SEED_PRODUCTS` / `FALLBACK_CATEGORIES`. Don't break this pattern — it's what keeps `npm run dev` working with zero config.
- **Writes go through the RPC or service role**: never write to `orders`/`order_items` from client code; the RPC (`create_order_rpc`) is the only atomic path that enforces stock locking.
- **`"use server"` server actions** are the default mutation transport — no custom REST endpoints for admin CRUD. Actions return `{ok,message}` / `{ok:false,error}` and `redirect()` on navigation. `AdminForm` + `useActionState` wire them to toasts.
- **Revalidation**: mutations call `revalidatePath('/admin/...')` and affected storefront paths (`/`, `/shop`, `/collections`, `/product/[slug]` when applicable). Always pair mutations with their revalidation list.
- **Route group** `(storefront)` exists only to share the Header/Footer/ClientShell layout without adding a URL segment.
- **Imports**: always `@/...` absolute (never `../../..`).
- **Styling**: use existing Tailwind tokens (`bg-paper`, `text-ink`, `border-border`, `font-display`, `eyebrow` class). Custom animations live in `globals.css`, not inline style. Respect `prefers-reduced-motion` — the global block already disables most animations.
- **Images**: `next/image` everywhere. Remote domains are `images.unsplash.com` (seed data) and `*.supabase.co/storage/v1/object/public/*` (real uploads). Both are allow-listed in `next.config.ts`.
- **JSON-LD**: product, breadcrumb, FAQ, and organization schemas are emitted as inline `<script type="application/ld+json">`. Keep it serializable.
- **Zustand**: always `"use client"` at top of the store file and any component reading it. Persisted stores use `persist` with a stable `name`.
- **Accessibility**: `.focus-ring` class is the standard outline treatment; use it on interactive elements. `suppressHydrationWarning` is on `<html>` because `LangToggle` / `DevBanner` can differ SSR vs client.
- **PKR**: always render via `formatPKR()` (thousands separator + "Rs" prefix). Never string-concatenate prices.
- **Phones**: validated as `^03[0-9]{9}$` and **normalized** to that shape before DB writes — see `validators.ts::normalizePhone` and `loyalty.ts::normalizePhoneKey`.

## Security posture

- RLS default-deny on `orders`, `order_items`, `contact_messages`, `subscribers`, `cart_recoveries`. Anon has SELECT only on `products`. All writes route through `SUPABASE_SERVICE_ROLE_KEY`, never exposed to the browser.
- `createAdminClient()` is wrapped by `import "server-only"` and an explicit `typeof window !== "undefined"` throw.
- Order server action enforces: honeypot field, in-process rate limit (5/10min per IP-hash), idempotency cache (15min), server-side price rehydration in the RPC (prices can't be manipulated from the client payload).
- `next.config.ts` sets `X-Content-Type-Options`, `X-Frame-Options: DENY`, strict Referrer-Policy, Permissions-Policy (no camera/mic/geo/interest-cohort), 2-year HSTS with preload.
- Admin auth is **a single shared password** stored as env. The cookie is the sha256 of that password, httpOnly, `secure` in prod. No per-user identity, no password reset flow — adequate for a single-operator shop, not for multi-staff.
- CSP is **not** configured. Inline JSON-LD and the Next runtime rely on a relaxed CSP.

## Fragile areas

These are the spots where "a reasonable change" has historically broken things. Touch with care.

1. **Order RPC & stock locking** (`supabase/migrations/0003_create_order_rpc.sql` + `lib/orders.ts`). The RPC's `FOR UPDATE` per-row lock is the only thing preventing stock oversells under concurrent checkout. Do not bypass it by doing ad-hoc `update products set stock = stock - x` elsewhere. If you add a new purchase path, route it through the RPC.

2. **Seed-data fallback parity**. Every read helper has two code paths (Supabase vs `SEED_PRODUCTS`). Changes to the `Product` shape in `types.ts` must be reflected in both `seed-data.ts` AND the `products` table columns. Dev-only regressions hide here because CI currently builds without Supabase.

3. **Next 16 App Router conventions**. Params/searchParams are `Promise`-shaped (`type Params = Promise<{ slug: string }>` — `await params`). `revalidate`/`generateStaticParams`/`generateMetadata` rules differ from Next 13/14 training data. Always re-check `node_modules/next/dist/docs/01-app/...` before changing route conventions. (Cited rule from `AGENTS.md`.)

4. **Service-role isolation**. `supabase/admin.ts` must stay behind `import "server-only"`. A single accidental client import will ship the service role key to the browser. Admin clients are only used inside server actions or route handlers.

5. **`/shop` → `/collections/all` redirect**. The `/shop` route no longer exists (`src/app/(storefront)/shop/*` is deleted in the current dev branch). Code still references `/shop` in places — e.g. `revalidatePath("/shop")`, sitemap, breadcrumbs. That's fine for revalidation (the redirect handles it), but don't add new `<Link href="/shop">` — use `/collections/all`.

6. **Migration ordering**. `scripts/migrate.mjs` sorts files lexicographically. Keep the 4-digit prefix. Never edit an applied migration; always add a new one. Breaking the `_migrations` row set would require a surgical fix in production.

7. **PK phone regex** (`^03[0-9]{9}$`). Used in validator AND in the `orders.phone` SQL check constraint AND in `loyalty_ledger` keying. Changing the regex requires updating all three together.

8. **Admin password cookie format**. The cookie is `sha256(password).hex`. If `ADMIN_PASSWORD` is rotated, all existing admin sessions get silently invalidated (desired). But changing the cookie name, hashing, or `timingSafeEqual` handling needs a login-flow retest.

9. **Vercel Supabase pooler**. Migrations running during `vercel-build` require the **Session pooler** URL. The direct DB URL is IPv6-only and will fail the build. Documented in `scripts/migrate.mjs` header.

10. **Service worker caching**. `public/sw.js` uses stale-while-revalidate for `/_next/static`. After deploys, clients can briefly run mixed old+new chunks until SW updates. The `CACHE = "closet-v1"` constant is the only rollback lever — bump it when a breaking asset change lands, otherwise leave it alone.

11. **Ceramic font**. `public/fonts/Ceramic.otf` is expected but **not checked in** (see `README.txt`). Missing font silently falls through to the declared fallback stack (Georgia/serif). If the site looks wrong on a fresh checkout, this is likely why.
