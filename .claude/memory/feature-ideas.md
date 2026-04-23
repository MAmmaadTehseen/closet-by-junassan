# Feature ideas

Concrete, codebase-grounded ideas. Each is scoped small enough to land in a focused PR. Promote to a planning doc / decision before building.

## New user features

1. **WhatsApp-first order updates** — `siteConfig.contact.whatsappNumber` is hard-wired and already used for `waLink()`. `admin-actions.ts::updateOrderStatus` only fires Resend email on status changes. Add an optional "WhatsApp Cloud API" send alongside `sendStatusUpdate` so shipped/delivered notifications reach customers on the channel they already use. Rationale: email open rates are low in PK; WhatsApp is where the existing Instagram audience actually is.

2. **Size-based restock notifications** — `RestockNotify.tsx` exists but `products.size` is a single string per product. When a buyer wants "L" but only "M" is in stock, there's no signal. Add a `restock_alerts(product_id, size, email, phone)` table + PDP hook so the admin sees demand per size when restocking. Rationale: every unit of the shop is 1-of-1, so size-specific demand data is a direct buying signal.

3. **"Reserve for 15 min" on checkout entry** — the atomic stock decrement only happens at `createOrder`. If two shoppers add the same 1-of-1 piece, whoever hits submit first wins silently. Add a soft-reserve in `cart_recoveries` (or a new `cart_holds` table) that temporarily decrements stock when checkout starts, with a timer. Rationale: single-unit SKUs make the race condition very visible; customers bouncing after "sold out" at payment is a real drop-off.

4. **Customer review photos via existing UGC bucket** — `ReviewForm.tsx` + migrations `0007_reviews.sql` / `0018_ugc_storage.sql` exist; the UGC bucket is already provisioned. Let reviewers attach 1–3 photos, approved via `/admin/reviews`. Rationale: thrift buyers want to see the piece on a real body before trusting a 1-of-1; staff photos only go so far.

5. **Saved addresses keyed by phone** — checkout currently re-collects name/phone/city/address every time. Given phone is the de-facto identity (used by `loyalty_ledger`, referrals, reviews, my-orders lookup), auto-fill the address the next time the same phone is seen. Rationale: repeat-buyer friction reduction with zero account system.

## Backend improvements

6. **Move hot-path product filtering to SQL** — `lib/products.ts::fetchProducts` pulls all rows and filters in Node. At < ~500 products this is fine; the `/collections/all` page currently loads twice (once for the grid, once for `allForCount`). Fold filter + count into a single Supabase `.select(..., { count: "exact" }).range(...)` call, gated on `hasSupabaseEnv()` with the existing seed fallback preserved. Rationale: first-meaningful-paint on the main shop page is the highest-traffic read; the catalog will grow.

7. **Replace in-process rate limiter with Upstash Redis** — `lib/rate-limit.ts` header already flags this: the in-memory `Map` doesn't work across Vercel function instances or cold starts. For order posting + future OTP, swap to Upstash. Rationale: Vercel serverless has ephemeral isolates; current limiter silently fails open under any load.

8. **Dead-letter queue for email sends** — `lib/email.ts::send` is fire-and-forget and swallows errors. If Resend 5xxs during a status-change spike, customers silently don't get notified. Add an `email_outbox(status, attempts, payload_json, error, created_at)` table with a cron sweep for retries. Rationale: order-confirmation email is the single highest-signal trust moment post-checkout; losing it is expensive.

## Frontend polish

9. **Skeleton parity on every server-suspended island** — `ProductGridSkeleton` is used on `/collections/all`, but PDP reviews/QA/bundles render a blank gap until hydrated. Add matching `Skeleton` variants and wrap each section in `<Suspense>`. Rationale: current LCP feels fast, but below-the-fold sections pop in abruptly which undercuts the "editorial" feel.

10. **Sticky "Complete the look" on PDP** — `BundleStrip` renders once then scrolls off. On desktop, lift one bundle into the `ProductDetailClient` rail so it stays visible alongside "Add to bag" as the gallery scrolls. Rationale: bundle AOV lift is exactly the mechanic that justifies the feature; hiding it below the fold defeats it.

## Animations

11. **View-transition-backed product ↔ PDP morph** — wiring partially exists (`viewTransitionName: product-<id>` on `ProductCard.tsx` + PDP `Gallery`, plus `::view-transition-old/new` CSS in `globals.css`). Currently runs only on same-origin full navigations. Verify it actually triggers on `/collections/all` → `/product/[slug]` and add a `document.startViewTransition` fallback on programmatic navigation. Rationale: the infrastructure cost has already been paid; this is a pure-polish payoff.

12. **Cart-drawer item fly-in** — `lib/fly-to-cart.ts` animates an image arc to `#cart-target`, but the drawer itself doesn't react with a micro-bounce when the item lands. Add a short `cart-bump` pulse on the drawer's new row (animation already defined in `globals.css`). Rationale: closes the loop of the add-to-cart interaction; right now it "arrives" without a confirmation beat. _(in PR: claude/auto-20260423-0930 — new `cart-row-pop` keyframe + `ui-store.flashCartItem(id)` wired from the 3 add-to-bag call sites; drawer derives the bumped row from store state, no setState-in-effect)_

## DX

13. **Supabase-backed preview data seed script** — `SEED_PRODUCTS` covers reads but not orders/reviews/Q&A. A one-shot `scripts/seed-preview.mjs` that hydrates a preview Supabase project with a plausible cross-section would make `/admin/*` pages demoable without manually clicking through each CRUD. Rationale: admin pages currently render mostly empty on fresh environments, which makes reviewing UI changes to them a pain.

14. **ESLint rule banning raw admin-supabase imports from client files** — `supabase/admin.ts` has `import "server-only"` + a runtime throw, but a stray `"use client"` file that imports it would fail at runtime rather than at lint. A narrow `no-restricted-imports` rule (or custom `eslint-plugin-local`) saying `@/lib/supabase/admin` is forbidden in files with `"use client"` catches the class of mistake at save. Rationale: the worst outcome here (service-role key in bundle) is severe enough to warrant a belt-and-braces check.

## Performance

15. ~~**Image-format-aware hero poster**~~ — obsolete. `VideoHero.tsx` was retired in `feat/hero-cursor-lenis-i18n` in favor of `HeroEditorial`, which has no video asset / poster.

16. **Defer `SocialProof` + `ExitIntent` + `CursorCompanion` behind `requestIdleCallback`** — `ClientShell.tsx` already uses `next/dynamic({ ssr: false })` which ships the JS at hydrate time. These components don't need to be ready for several seconds. Wrap mounts in `requestIdleCallback` (with a `setTimeout` fallback) to push their JS parse cost off the interactive window. Rationale: these are "delight" features; none of them should contend with the main thread during the user's first scroll. _(in PR: claude/auto-20260423-0845 — landed via new `IdleMount` wrapper in `src/components/app-shell/IdleMount.tsx`)_

## i18n follow-ups

17. **Translate `MegaMenu` sub-panel labels** — `feat/hero-cursor-lenis-i18n` translated the 5 top-level MEGA_MENU items (Men/Women/Shoes/Collections/Deals) but left the 13 sub-panel labels (Clothing / Shoes / Sale / Activewear / Accessories / Mens / Womens / Kids …) in English. Add `nav.sub.*` keys to `DICT` and consume them via `labelKey` on the sub-link items. Rationale: second biggest visible-to-user English surface after the pass, and mechanically trivial once the top level is done.

18. **Translate `CheckoutForm` field labels + validation messages** — `src/components/checkout/CheckoutForm.tsx` (~420 lines, client) still has English labels/placeholders/inline errors. Add a `checkout.form.*` key set and a small `useT()` refactor. Rationale: the eyebrow + title are translated but the form underneath isn't, which will look half-done to any Urdu-reading buyer.

19. **Translate server-action error returns** — mutations in `lib/admin-actions.ts` / `lib/order-actions.ts` / similar return `{ ok: false, error: "..." }` with English strings that surface as toasts. Pass a `lang` arg or move to a key-based error shape so the toaster can render the right language. Rationale: happy-path is translated; error path silently reverts to English, which is exactly when the user most needs legibility.
