# Changelog

A running log of feature work shipped on the Closet by Junassan storefront.
The newest entry is at the top. Each entry lists what was added, the files
touched, and the global e-commerce pattern that inspired it so it is easy to
audit and extend.

## 2026-04-23 — Conversion & discovery push (15 features)

Inspiration: Sephora / ASOS / Amazon / Zara / Nike / SHEIN / Glossier.

### New customer-facing pages

1. **`/compare` — Side-by-side product compare.**
   Build your own grid of up to 4 thrift pieces (price, size, condition,
   fabric, measurements, care). One-tap add-to-bag from the compare table.
   _Inspired by Amazon / Nike compare._
   - `src/app/(storefront)/compare/page.tsx`
   - `src/components/product/CompareView.tsx`
2. **`/brands` — Brand directory with A-Z jump nav.**
   Lists every label currently in stock, sorted by depth, with a hero image
   and "starts at" price. Letter index lets shoppers jump quickly.
   _Inspired by ASOS / Farfetch brand directory._
   - `src/app/(storefront)/brands/page.tsx`
3. **`/brands/[slug]` — Per-brand product pages (SEO).**
   Static-generated pages with deep meta and product grids per brand —
   indexable and added to the sitemap.
   - `src/app/(storefront)/brands/[slug]/page.tsx`
   - `src/lib/brands.ts`
4. **`/lookbook` — Editorial outfit stories.**
   Four signature looks ("Sunday in Lahore", "Studio Hours",
   "Karachi After Dark", "Office, but Make it Yours") that auto-pick
   complementary in-stock pieces and show a running "look total".
   _Inspired by Aritzia / Zara editorial._
   - `src/app/(storefront)/lookbook/page.tsx`
5. **`/faq` — Standalone FAQ with `FAQPage` JSON-LD.**
   10 evergreen Q&As covering COD, shipping, returns, sizing, authenticity,
   loyalty. Emits structured data so answers can show in Google rich
   results.
   - `src/app/(storefront)/faq/page.tsx`
6. **404 page rebuilt with trending picks.**
   Smart not-found: still ships the bold 404, but now also surfaces the
   currently-trending products so a wrong URL is a softer landing.
   _Inspired by Glossier / Bonobos 404 patterns._
   - `src/app/(storefront)/not-found.tsx`

### Cart & checkout improvements

7. **Free-shipping progress bar in the cart drawer.**
   Shows "Add Rs 850 more for free delivery" with a live-fill bar; flips to a
   green "You unlocked free delivery" state once threshold is reached.
   Threshold + flat fee live in `siteConfig.shipping`.
   _Inspired by Sephora / Glossier "spend more for free shipping" gamification._
   - `src/components/cart/FreeShippingMeter.tsx`
   - `src/components/cart/CartDrawer.tsx`
8. **"Save for later" action on every cart line.**
   Removes the item from the bag and silently adds it to the wishlist with
   a confirmation toast — encouraging shoppers to come back rather than
   delete intent.
   _Inspired by Amazon / ASOS._
   - `src/components/cart/CartDrawer.tsx`

### Product discovery on shop & PDP

9. **Compare store + floating "Compare bar".**
   Persistent (localStorage) selection capped at 4. Floating bottom bar
   shows thumbnails and a one-tap link to `/compare`.
   - `src/lib/compare-store.ts`
   - `src/components/product/CompareBar.tsx`
   - `src/components/product/CompareButton.tsx`
   - Wired into `ProductCard` and `ProductDetailClient`.
10. **"Complete the look" on every PDP.**
    Cross-category outfit row: anchors on the current item and recommends one
    in-stock piece per complementary category. Shows the running outfit total.
    _Inspired by Zara / Mango "Complete the look"._
    - `src/components/product/CompleteTheLook.tsx`
11. **Sale countdown banner on PDP.**
    Honest end-of-day countdown shown only on `limited` items or pieces
    discounted ≥ 40%. Resets at midnight — never fake urgency.
    - `src/components/product/SaleCountdown.tsx`
12. **Closet Coins loyalty earn widget on PDP.**
    Tells the shopper how many loyalty coins they will earn from this
    purchase and what those coins are worth in PKR. Rate is configured in
    `siteConfig.loyalty` so a future loyalty page can read the same numbers.
    _Inspired by Sephora Beauty Insider / Nike Membership._
    - `src/components/product/LoyaltyEarn.tsx`
13. **Trending searches + top brand chips in `⌘K` palette.**
    Empty-state suggestions surface six hand-curated trending queries
    ("denim", "linen", "silk", "white shirt", "sneakers", "tote bag") plus
    the six brands with the most stock right now. One tap fills the input.
    _Inspired by Algolia DocSearch / Vinted search._
    - `src/components/search/SearchPalette.tsx`
14. **Visual category chip strip on `/shop`.**
    Sticky horizontal-scroll chips ("All / Men / Women / Kids / Shoes /
    Bags") that toggle the `?category=` query param without a full
    navigation. Mobile-first.
    - `src/components/shop/CategoryChips.tsx`
    - `src/app/(storefront)/shop/page.tsx`

### Always-on global UI

15. **WhatsApp floating action button.**
    Bottom-left FAB with a soft ping animation that opens a pre-filled
    WhatsApp chat. Auto-hides on `/checkout` and `/admin`.
    _Inspired by every Pakistani DTC store + WhatsApp Business._
    - `src/components/ui/WhatsAppFab.tsx`
16. **PWA install prompt (dismissible, 14-day cooldown).**
    Subscribes to `beforeinstallprompt`, waits 6 s, shows a polite
    "Get the Closet app" card. Remembers a "later" dismissal for two weeks
    via `localStorage`.
    - `src/components/ui/InstallPrompt.tsx`

### Plumbing

- `src/lib/site-config.ts` — added `shipping.freeShippingThreshold`,
  `shipping.flatFee`, and the whole `loyalty` block (single source of
  truth — change once, applies everywhere).
- `src/components/app-shell/ClientShell.tsx` — registered the three new
  always-mounted client widgets (CompareBar, WhatsAppFab, InstallPrompt)
  via `dynamic({ ssr: false })` so they never block server rendering.
- `src/components/layout/Header.tsx` — mobile drawer now exposes
  Brands, Lookbook, FAQ.
- `src/components/layout/Footer.tsx` — Shop column links Brands &
  Lookbook; Help column links the standalone FAQ + Compare.
- `src/app/sitemap.ts` — emits routes for `/brands`, `/brands/[slug]`,
  `/lookbook`, `/compare`, `/faq` so they get indexed.

### Files added (summary)

```
src/lib/brands.ts
src/lib/compare-store.ts
src/components/cart/FreeShippingMeter.tsx
src/components/product/CompareBar.tsx
src/components/product/CompareButton.tsx
src/components/product/CompareView.tsx
src/components/product/CompleteTheLook.tsx
src/components/product/LoyaltyEarn.tsx
src/components/product/SaleCountdown.tsx
src/components/shop/CategoryChips.tsx
src/components/ui/InstallPrompt.tsx
src/components/ui/WhatsAppFab.tsx
src/app/(storefront)/brands/page.tsx
src/app/(storefront)/brands/[slug]/page.tsx
src/app/(storefront)/compare/page.tsx
src/app/(storefront)/faq/page.tsx
src/app/(storefront)/lookbook/page.tsx
```
