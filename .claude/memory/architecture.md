# Architecture

Next.js 16 App Router storefront + admin panel for a Pakistani thrift e-commerce site. Cash-on-Delivery only. Runs with or without Supabase — seed data fallback is first-class.

## Top-level layout

```
closet-by-junassan/
├── src/
│   ├── app/                  — App Router routes (server components by default)
│   │   ├── layout.tsx        — root HTML shell; Ceramic localFont; Organization JSON-LD
│   │   ├── globals.css       — Tailwind v4 + CSS custom properties (ink/paper/cream palette)
│   │   ├── not-found.tsx     — root 404
│   │   ├── robots.ts         — /robots.txt (MetadataRoute)
│   │   ├── sitemap.ts        — /sitemap.xml (static + products + collections + styles + categories)
│   │   ├── (storefront)/     — public route group, shares Header/Footer/ClientShell
│   │   ├── admin/            — password-gated admin panel (cookie auth)
│   │   └── api/              — cron + social-proof REST endpoints
│   ├── components/           — presentational + client components (no DB calls)
│   │   ├── layout/           — Header, Footer, MegaMenu, LangToggle
│   │   ├── home/             — VideoHero, ProductCarousel, ShopByBrand, CodBanner, etc.
│   │   ├── product/          — Gallery, ProductCard, ProductDetailClient, Reviews, QA, Bundle...
│   │   ├── shop/             — Filters, SortSelect, FilterPills, MobileFiltersDrawer, AccessoriesView
│   │   ├── cart/             — CartDrawer, CartView
│   │   ├── checkout/         — CheckoutForm, ClearCartOnSuccess, CopyCode, ReferralShare
│   │   ├── admin/            — AdminForm, ProductForm, CollectionProductPicker, ImageUploader, charts/…
│   │   ├── app-shell/        — ClientShell (mounts drawers/palette), RegisterSW
│   │   ├── search/           — SearchPalette (cmd-k)
│   │   └── ui/               — Accordion, Drawer, Modal, Toaster, Reveal, BackToTop, ExitIntent,
│   │                           SocialProof, InstallPrompt, Skeleton, MagneticButton, Marquee, ...
│   └── lib/                  — server + shared logic
│       ├── supabase/         — client.ts (browser), server.ts (RSC/ssr), admin.ts (service role)
│       ├── hooks/            — use-keyboard, use-reveal
│       └── *.ts              — domain modules (see "Library modules" below)
├── supabase/
│   ├── schema.sql            — bootstrap README; real schema is migrations/
│   ├── seed.sql              — optional seed
│   └── migrations/           — 0001…0021 numbered SQL, applied by scripts/migrate.mjs
├── scripts/migrate.mjs       — idempotent migration runner (pg client), runs in vercel-build
├── public/                   — sw.js, offline.html, manifest.json, icons/, fonts/ (Ceramic.otf), videos/
├── next.config.ts            — security headers, image remote patterns, /shop → /collections/all redirect
├── vercel.json               — cron schedules for /api/cron/activate (15m) and /api/cron/abandoned (1h)
├── eslint.config.mjs         — flat config extending eslint-config-next
├── AGENTS.md / CLAUDE.md     — agent rules (Next.js 16 breaking — read node_modules/next/dist/docs/ first)
└── README.md                 — public README
```

## Entry points

- **Storefront root** — `src/app/(storefront)/layout.tsx`. Awaits `fetchProducts({limit:60})` + `fetchCategories()` in parallel, renders `Header`, `<main>`, `Footer`, `ClientShell`.
- **Home** — `src/app/(storefront)/page.tsx`. `revalidate = 3600`. Loads `new` + `trending` tag product lists. Renders VideoHero → ProductCarousel ×2 → ShopByBrand → HowCodWorks → CodBanner → Testimonials → Newsletter.
- **Root layout** — `src/app/layout.tsx`. Adds Ceramic localFont, metadata (siteConfig), Organization JSON-LD, DevBanner.
- **Admin root** — `src/app/admin/layout.tsx`. Gate: if `ADMIN_PASSWORD` env missing → "not configured" notice; if unauthed → children render pass-through (so `/admin/login` works); if authed → sidebar shell + `Toaster` + `AdminCommandPalette`.

## Routing map

Public `(storefront)` route group (all share the same Header/Footer):

| Path | File | Notes |
|---|---|---|
| `/` | `page.tsx` | Home. `revalidate = 3600` |
| `/about`, `/contact`, `/privacy`, `/terms` | static pages |  |
| `/collections` | editorial index of curated chapters. `revalidate = 300` |
| `/collections/[slug]` | one editorial chapter + product grid. `revalidate = 300`. `generateStaticParams` from DB. Has `opengraph-image.tsx` |
| `/collections/all` | the real shop page (filters, sort, search). `revalidate = 3600` |
| `/category/[slug]` | category landing |
| `/accessories` | tile-filtered sub-category view (caps/belts/bracelets) |
| `/deals` | discounted items |
| `/product/[slug]` | PDP. `revalidate = 60`. Has `opengraph-image.tsx`, `loading.tsx`. Emits Product, BreadcrumbList, and FAQ JSON-LD |
| `/style/[slug]` | mood-board style landing |
| `/cart`, `/cart/recover/[token]` | cart + abandoned-cart recovery link |
| `/checkout`, `/checkout/success` | COD checkout → server action → redirect to success |
| `/wishlist`, `/my` | wishlist + "my orders" lookup |
| `/track` | tracking form |
| `/review/[code]` | post-delivery review capture |
| `/error.tsx`, `/not-found.tsx` | group-level error/404 |

Redirects (`next.config.ts`): `/shop` and `/shop/:path*` → `/collections/all(...)`, permanent.

Admin routes (all password-gated by `src/app/admin/layout.tsx`):

```
/admin                         — dashboard (KPIs, charts, low-stock alerts)
/admin/login
/admin/products                — list + inline edit
/admin/products/new
/admin/products/[id]/edit
/admin/products/export         — CSV route handler
/admin/categories              — CRUD
/admin/orders                  — list + status changes
/admin/orders/export           — CSV route handler
/admin/customers
/admin/drops                   — Stories/drops CRUD
/admin/collections             — editorial collections CRUD
/admin/collections/[slug]/edit
/admin/bundles                 — "complete the look" CRUD
/admin/styles                  — mood boards CRUD
/admin/reviews                 — moderation queue
/admin/qa                      — Q&A moderation
/admin/activity                — audit log
/admin/settings                — site settings (marquee items)
/admin/command-data            — JSON feed for cmd-k command palette
```

API routes:

- `GET /api/cron/activate` — 15-min cron. Toggles drops/bundles on/off by goes_live_at/ends_at windows.
- `GET /api/cron/abandoned` — hourly cron. Finds 2h-stale cart_recoveries without notified_at, sends recovery emails via Resend, stamps notified_at.
- `GET /api/social-proof` — returns recent-order ticker events for the SocialProof UI.

Both cron routes accept Vercel's `vercel-cron` user-agent OR an `x-cron-secret` header matching `CRON_SECRET`.

## Data flow

### Product read path
`page.tsx` (RSC) → `lib/products.ts::fetchProducts()` → if `hasSupabaseEnv()` try Supabase public `products` table (anon SELECT allowed by RLS) → else / on error / on empty → fall back to `SEED_PRODUCTS` from `lib/seed-data.ts`. Same pattern exists for `categories`, `collections`, `drops`, `styles`, `bundles`, `reviews`, `qa` — each has its own `lib/<domain>.ts` with Supabase-first, in-memory-fallback logic.

The filter/sort logic in `fetchProducts` runs in Node after fetching all rows. It's intentionally not pushed to SQL so the same code path works for seed fallback. Acceptable at current catalog size.

### Checkout / order creation
Client `CheckoutForm.tsx` → server action `lib/orders.ts::createOrder(payload)`:
1. Hash client IP+UA via `lib/rate-limit.ts::hashKey`.
2. Honeypot → fake redirect. Idempotency key → if already-succeeded, re-redirect to prior success.
3. Rate limit 5/10min per fingerprint.
4. `validators.ts::validateCheckout` — trims, normalizes PK phone (`03XXXXXXXXX`), title-cases city, caps items at 20 × qty 10.
5. If `hasAdminEnv()` → `supabase.rpc('create_order_rpc', …)`. The RPC (migration `0003`) locks each product row (`FOR UPDATE`), validates stock, decrements, computes trusted subtotal server-side, and inserts `orders` + `order_items`. Throws `out_of_stock` / `product_not_found` strings that the caller maps to user-facing errors.
6. Best-effort: persist `email`, fire Resend confirmation via `lib/email.ts::sendOrderConfirmation`, revalidate `/`, `/shop`, and each product's path.
7. Redirect to `/checkout/success?o=CBJ-XXXXXXXX`.

If Supabase is unavailable the action validates against seed stock and still redirects — so local dev always works.

### Client state
- `lib/cart-store.ts` — Zustand + persist (`localStorage` key `closet-cart`). `add/remove/setQty/clear/replace`, `count()`, `subtotal()`. `add` clamps to `maxStock`.
- `lib/wishlist-store.ts` — Zustand + persist (`closet-wishlist`). IDs only.
- `lib/ui-store.ts` — in-memory Zustand (no persist). `cartOpen`, `searchOpen`, `filtersOpen` flags + `open*/close*` actions. Cart drawer, search palette, mobile filters drawer all read this.
- `lib/recent-store.ts` — recently-viewed IDs.

`ClientShell.tsx` mounts the always-present client UI (Toaster, CartDrawer, SearchPalette dynamically with ssr:false, RegisterSW, BackToTop, SocialProof, ExitIntent, CursorCompanion, InstallPrompt).

### Admin mutation path
Pages render server forms that post to server actions in `lib/admin-actions.ts` (`"use server"`). Every action calls `requireAdmin()` → checks cookie auth AND Supabase env. Mutations use `createAdminClient()` with `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Actions revalidate affected paths and either return `{ok,message}`/`{ok:false,error}` (inline toast via `Toaster`) or `redirect`.

`AdminForm.tsx` wraps `useActionState` so form submissions surface `ActionResult` as a toast. `ConfirmButton`, `SubmitButton`, `ImageUploader` are the generic form controls. `ImageUploader` calls `uploadProductImage` server action which writes to Supabase Storage bucket `product-images`.

### Auth
`lib/admin-auth.ts` — single shared password via env `ADMIN_PASSWORD` (min 4 chars). On login, sha256 hex of the password is stored in httpOnly cookie `closet_admin` (1 week, `secure` in prod). `isAdminAuthed()` rehashes and `timingSafeEqual`s. There is no per-user admin identity. No Supabase auth is used.

### Cron side effects
- **Scheduling** (migration `0016_scheduling.sql`) — `drops` and `bundles` have nullable `goes_live_at`/`ends_at`. `/api/cron/activate` flips `active` on/off based on window.
- **Abandoned cart** — `CheckoutForm` (or cart page) writes a `cart_recoveries` row with a token, email, and items_json when the user enters an email but doesn't finish. `/api/cron/abandoned` picks up rows older than 2h with null `notified_at`/`recovered_at`, sends a recovery email containing `/cart/recover/[token]`, and stamps `notified_at`.

## Supabase schema (migrations)

Run in order; tracked idempotently by `scripts/migrate.mjs` in the `_migrations` table.

| # | File | Adds |
|---|---|---|
| 0001 | `init.sql` | `products`, `orders`, `order_items`, `contact_messages`, `subscribers`, `set_updated_at` trigger |
| 0002 | `rls.sql` | Enables RLS on all five; anon may only SELECT products; all other writes require service_role |
| 0003 | `create_order_rpc.sql` | `create_order_rpc(...)` security-definer fn; executable only by service_role |
| 0004 | `categories.sql` | `categories` table (slug/label/parent_slug/cover_image/sort_order) |
| 0005 | `storage.sql` | `product-images` bucket policies |
| 0006 | `drops.sql` | homepage Stories |
| 0007 | `reviews.sql` | customer reviews, approval flag |
| 0008 | `order_email.sql` | adds `orders.email` |
| 0009 | `collections.sql` | editorial collections + `collection_products` join |
| 0010 | `bundles.sql` | "complete the look" bundles + `bundle_products` |
| 0011 | `loyalty.sql` | Closet Coins — `loyalty_ledger` + `loyalty_balance` view, keyed by normalized phone |
| 0012 | `referrals.sql` | referral codes |
| 0013 | `price_alerts.sql` | price-drop subscriptions |
| 0014 | `site_settings.sql` | generic key/value settings (e.g. marquee items) |
| 0015 | `audit_log.sql` | admin action audit trail |
| 0016 | `scheduling.sql` | `goes_live_at`/`ends_at` on drops + bundles |
| 0017 | `qa_ugc.sql` | product Q&A |
| 0018 | `ugc_storage.sql` | UGC bucket |
| 0019 | `styles.sql` | mood-board styles |
| 0020 | `cart_recoveries.sql` | abandoned cart tokens |
| 0021 | `accessories.sql` | seeds "accessories" parent + caps/belts/bracelets children |

## Library modules (src/lib/)

### Supabase
- `supabase/client.ts` — browser anon client (`createBrowserClient` from `@supabase/ssr`). Accepts `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `supabase/server.ts` — RSC/route-handler server client with cookie propagation. Same key fallback.
- `supabase/admin.ts` — `server-only` service-role client. Singleton cached. Throws if called in browser.

### Domain
- `products.ts` — `fetchProducts/BySlug/Related/AllSlugs/DistinctBrands`, in-Node filter/sort, seed fallback.
- `categories.ts` — `fetchCategories`, hierarchy helpers, `FALLBACK_CATEGORIES`.
- `collections.ts` — editorial chapters. Join `collections` + `collection_products` + `products`.
- `bundles.ts` — "Complete the Look" fetch for PDP.
- `drops.ts` — home Stories. Uses plain `@supabase/supabase-js` client (no cookies needed) + admin client for the admin variant.
- `styles.ts` — mood boards.
- `reviews.ts` + `review-actions.ts` — approved reviews + submission/moderation actions.
- `qa.ts` + `qa-actions.ts` — answered Q&A + submission actions.
- `coupons.ts` — coupon codes.
- `loyalty.ts` — Closet Coins. `POINTS_PER_RUPEE = 1/10`, `MIN_REDEEM = 100`, `tierFor(lifetime)` → Bronze/Silver/Gold.
- `referrals.ts` — referral code creation/validation.
- `price-alert-actions.ts` — price-drop subscribe actions.
- `cart-recovery.ts` — writes `cart_recoveries` rows; used by checkout/cart drop-off.
- `orders.ts` — `createOrder` server action (see data flow above).
- `order-types.ts` — shared `CheckoutPayload` type.
- `delivery.ts` — shipping fees / zones helpers.
- `cities-pk.ts` — whitelist of Pakistani cities (advisory — accepts anything non-empty).
- `audit.ts` — `logAudit({action, entity, entity_id, summary})` fire-and-forget.
- `admin-analytics.ts` — dashboard KPIs: revenue-by-day, top sellers, status mix, velocity (running low / slow movers).
- `admin-actions.ts` — ALL admin server actions (products, categories, orders, drops, collections, bundles, styles, reviews, marquee, image upload).
- `admin-auth.ts` — password cookie auth.
- `site-config.ts` — single source of truth for brand/copy/contacts/WhatsApp/socials/brand list. `waLink()` and `telLink()` helpers.
- `site-settings.ts` — key/value settings read (e.g. `MARQUEE_KEY`).
- `i18n.ts` — tiny EN/UR dict + cookie `closet-lang`. `getLang()` / `t(key, lang)` / `getT()`.
- `size-charts.ts` — per-category size chart data for `SizeGuideModal`.
- `email.ts` — Resend HTTP calls. `sendOrderConfirmation`, `sendStatusUpdate`, `sendCartRecovery`. No-op when `RESEND_API_KEY` / `FROM_EMAIL` unset.
- `validators.ts` — checkout input cleaning + PK phone regex `^03[0-9]{9}$`.
- `rate-limit.ts` — in-process LRU for IP rate limits and idempotency.
- `format.ts` — `formatPKR`, `shortOrderCode`, `seededRandom`, `pluralize`.
- `types.ts` — `Product`, `CartItem`, `OrderDraft`, `Category`, `SIZES`, `ProductTag`. Also exports `CATEGORIES` static fallback list.
- `seed-data.ts` — full `SEED_PRODUCTS` array used when Supabase is absent.
- `fly-to-cart.ts` — animation util for "add to cart" image arc.
- `hooks/use-keyboard.ts`, `hooks/use-reveal.ts` — small client hooks.

## PWA / service worker

`public/sw.js` — Network-first for navigations (fallback to `/offline.html`), stale-while-revalidate for `/_next/static`, `/icons`, and `.woff`/`.woff2`. Skips non-GET and cross-origin. Installed by `components/app-shell/RegisterSW.tsx` on the client. `/sw.js` is served with `Cache-Control: no-cache, no-store, must-revalidate` (set in `next.config.ts`).

`public/manifest.json` — name/short_name/icons.

## Styling system

Tailwind v4 via `@import "tailwindcss"` in `globals.css`. `@theme inline { … }` block maps CSS custom properties into Tailwind's color/font scales so utility classes like `bg-paper`, `text-ink`, `bg-cream`, `text-accent-red`, `font-display` just work. Palette: `--ink` (near black), `--paper` (white), `--cream`/`--sand` (warm off-white), `--line` (borders), `--accent-red` (sale). Single font: **Ceramic.otf** (localFont), used for both body and `font-display`.

All animations are vanilla CSS in `globals.css` (`fade-up`, `marquee`, `shimmer`, `drawer-in`, `cart-bump`, `check-draw`, `heart-pop`, `soft-pulse`, `bar-rise`). View Transitions API is wired for grid-to-PDP image morphing via `viewTransitionName: product-<id>`. A `prefers-reduced-motion` block disables everything.

## Environment variables

| Var | Required? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | opt (DB features) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | opt | anon/publishable key (legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` still accepted) |
| `SUPABASE_SERVICE_ROLE_KEY` | opt (writes) | server-only service role for admin client |
| `SUPABASE_DB_URL` (or `DATABASE_URL`) | build-time | pg connection string for `scripts/migrate.mjs` (Session pooler on Vercel — IPv4) |
| `ADMIN_PASSWORD` | opt (admin) | enables `/admin` panel (min 4 chars) |
| `CRON_SECRET` | opt | shared secret for `/api/cron/*` outside Vercel |
| `RESEND_API_KEY` + `FROM_EMAIL` | opt | transactional email |

Missing env is **not** an error — every feature degrades to seed/no-op.
