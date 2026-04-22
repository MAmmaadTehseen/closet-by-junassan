# Changelog

A running log of feature work added to Closet by Junassan. Newest batches first.

---

## 2026-04-22 — Batch 01 · "Conversion + delight" (14 features)

Ideas drawn from global e-commerce leaders (Amazon, Shopify, ASOS, Myntra,
Sephora, Zara, Nike, Uniqlo) and adapted for a COD-first Pakistani thrift
storefront. Net: 14 new shopper-facing features, fully typed, SSR-safe,
passing `next build`. No database or schema changes required.

### Global shell additions
1. **Scroll progress bar** — thin bar at the very top tracks page scroll.
   Reinforces progress through long PDP / shop pages.
   _File:_ `src/components/ui/ScrollProgress.tsx`
2. **Floating WhatsApp chat bubble** — persistent 1-tap contact bubble with
   auto-dismissable "Need help choosing?" hint; hidden in `/admin`. Matches
   the region's dominant support channel.
   _Files:_ `src/components/ui/WhatsAppBubble.tsx`,
   `src/components/ui/brand-icons.tsx` (added `WhatsAppIcon`).
3. **Keyboard-shortcut overlay** — press `?` anywhere to open a cheat-sheet;
   adds `/` (search), `c` (cart), and `g h/s/d/w/c` for nav jumps (GitHub-style).
   Ignores typing targets automatically.
   _File:_ `src/components/ui/KeyboardShortcuts.tsx`

### Cart & checkout
4. **Free-gift progress bar in cart drawer** — Shopify-style threshold meter
   ("Add Rs X more for a free mystery accessory"). Configurable via
   `siteConfig.perks.freeGiftThreshold`.
   _Files:_ `src/components/cart/CartDrawer.tsx`, `src/lib/site-config.ts`.
5. **Save-for-later store + cart-page section** — separate from wishlist;
   "Move to bag" restores items cleanly. Persisted to localStorage.
   _Files:_ `src/lib/saved-store.ts`, `src/components/cart/CartView.tsx`.
6. **Gift-card codes in coupon system** — `GIFT-0500` pattern parses to a
   Rs 500 flat-off voucher (generalized 3–5 digit suffix). Also added
   `BUNDLE10` and `FIRST10` codes. Cart copy now advertises the pattern.
   _Files:_ `src/lib/coupons.ts`, `src/components/cart/CartView.tsx`.
7. **Sticky mobile order-peek on checkout** — collapsible summary bar under
   the sticky header so mobile shoppers always see what they're paying for.
   _Files:_ `src/components/checkout/MobileOrderPeek.tsx`,
   `src/components/checkout/CheckoutForm.tsx`.

### Product detail page
8. **Delivery countdown** — "Order in the next 3h 22m for arrival by Fri Apr 25"
   line under the add-to-cart button. Uses a 5 PM dispatch cutoff model,
   ticks every 30 seconds via `useSyncExternalStore` (SSR-safe, no flicker).
   _Files:_ `src/components/product/DeliveryCountdown.tsx`,
   `src/lib/delivery.ts` (added `nextDispatchCutoff`, `formatTimeToCutoff`,
   `expectedArrivalBy`).
9. **Complete-the-look bundle** — PDP section showing the current item + 3
   hand-picked pairings with a 10% bundle discount (redeems via `BUNDLE10`
   code). Select/deselect individual pieces, price recalculates live.
   _File:_ `src/components/product/CompleteTheLook.tsx`.
10. **Urdu price transliteration** — renders the PKR price as Urdu words
    (e.g. `ایک ہزار پانچ سو روپے`) below the numeral. Uses the Pakistani
    lakh/crore word system; works up to 9 crore.
    _Files:_ `src/lib/urdu-number.ts`,
    `src/components/product/ProductDetailClient.tsx`.
11. **Product-compare flow (up to 3 pieces)** — wishlist-style toggle on the
    PDP, a sticky bottom pill showing the current selection, and a wide
    drawer with a side-by-side attribute table (brand, price, size,
    condition, fabric, stock) + per-column "Add to bag".
    _Files:_ `src/lib/compare-store.ts`,
    `src/components/compare/CompareToggle.tsx`,
    `src/components/compare/CompareBar.tsx`,
    `src/components/compare/CompareDrawer.tsx`,
    `src/components/app-shell/ClientShell.tsx`.
12. **Price-drop alerts** — PDP toggle that captures the current price and
    stores it locally. The wishlist page now lists all watched pieces and
    highlights any that dropped since you subscribed. Amazon-style.
    _Files:_ `src/lib/price-drop-store.ts`,
    `src/components/product/PriceDropToggle.tsx`,
    `src/components/product/PriceDropList.tsx`,
    `src/app/(storefront)/wishlist/page.tsx`.

### Home page
13. **FAQ section with schema.org FAQPage JSON-LD** — six answers most
    commonly asked by Pakistani shoppers (authenticity, COD, delivery,
    fit, drops, cleaning). Ships with rich-result markup for Google.
    _Files:_ `src/components/home/Faq.tsx`, `src/app/(storefront)/page.tsx`.
14. **Just-Restocked rail** — new `fetchRestocked()` query surfaces
    items still in supply (stock ≥ 2), newest first, as a home rail.
    _Files:_ `src/lib/products.ts`, `src/app/(storefront)/page.tsx`.

### Verification

- `npx tsc --noEmit` — clean.
- `npx next build` — 34 routes built, no warnings.
- `npx eslint` — same `5 errors / 2 warnings` baseline as before this batch
  (all pre-existing set-state-in-effect items in Admin/Stories/Gallery/
  ThemeToggle). New code adds zero net lint issues.

### Conventions followed

- No new dependencies. All features built with existing Zustand / Tailwind v4
  / lucide-react.
- No DB changes. Price-drop, save-for-later, and compare are all localStorage
  via Zustand `persist`.
- Client stores guarded against SSR; `DeliveryCountdown` uses
  `useSyncExternalStore` with a `getServerSnapshot` returning `0` to avoid
  hydration mismatches.
- All copy stays COD-first and Pakistan-local (Urdu line, WhatsApp as
  primary contact, Rs-denominated gift cards, lakh/crore wording).
