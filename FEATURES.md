# Features Changelog

Human-readable changelog of features added by Claude. Newest first.

---

## 2026-04-22 — Heavy-duty pass #1 (15 additions)

Inspiration drawn from leading international storefronts (Zara, Aritzia, COS,
SSENSE, Asos, Nike) and power-user apps (Linear, Superhuman). Every addition is
non-destructive and additive — no existing feature was removed or rewritten.

### Shopping tools

1. **Product compare** — `src/lib/compare-store.ts`, `CompareButton.tsx`,
   `CompareBar.tsx`, and a dedicated `/compare` page with side-by-side specs
   (brand, price, discount, stock, fabric, measurements, care) plus inline
   add-to-bag. Compare up to 4 pieces. Persisted to localStorage.

2. **Price drop alerts** — `src/lib/price-alert-store.ts` + `PriceAlertButton.tsx`
   on every PDP. Customers set a target price with a slider; we surface that
   watchlist so the team can WhatsApp them on drops.

3. **Size recommender** — `SizeRecommender.tsx` on PDP. Quick height/weight/build
   quiz that suggests a size with confidence level, and flags when the listed
   size differs from the recommendation.

4. **Shop the look** — `ShopTheLook.tsx` home section. Curated outfit with
   toggleable pieces, running total with savings, and one-tap "add the set".

### Cart & checkout

5. **Spend-tier perks** — `src/lib/cart-perks.ts` + `CartPerksBar.tsx` in both
   the cart drawer and cart page. Progress bar toward the next reward
   (free wrap → priority dispatch → free returns) and a live savings badge.

6. **Gift note** — `GiftNote.tsx` in checkout. Optional handwritten-style note
   (220 chars) appended to order notes for the packing team.

7. **Order journey timeline** — `OrderTimeline.tsx` on the success page. 5-stage
   visual tracker (placed → confirmation call → packed → dispatched → delivered)
   with animated pulse on the current stage.

8. **Confetti on success** — `Confetti.tsx`. Lightweight canvas burst on order
   confirmation. Respects `prefers-reduced-motion`.

### Home page

9. **Bundle banner** — `BundleBanner.tsx`. Explains the spend-tier rewards to
   new shoppers before they reach the cart.

10. **Brands marquee** — `BrandsMarquee.tsx`. Infinite scrolling strip of the
    brands the store has curated, populated from live products.

11. **Trust strip** — `TrustStrip.tsx`. 6-block grid hammering home COD, flat
    delivery, 3-day returns, inspections, confirmation calls, and weekly drops.

### Navigation & power users

12. **Keyboard shortcuts overlay** — `KeyboardShortcuts.tsx`. Press `?` to open.
    `/` or `s` opens search; `g h` home, `g s` shop, `g w` wishlist, `g k`
    compare, `g c` cart, `g t` track. `Esc` closes any drawer.

13. **Floating WhatsApp bubble** — `FloatingWhatsApp.tsx`. Sticky helper that
    appears after a short dwell, expands into a mini-chat card, and dismisses
    per-session.

14. **Reading progress bar** — `ReadingProgress.tsx` at the top of every
    product detail page, showing scroll depth of long product copy.

### International shoppers

15. **Display currency toggle** — `src/lib/currency-store.ts` +
    `CurrencySelector.tsx` in the footer. Switch PKR ↔ USD / GBP / AED for quick
    reference. Settlement remains PKR on delivery.

### Files added

```
FEATURES.md
src/app/(storefront)/compare/page.tsx
src/components/cart/CartPerksBar.tsx
src/components/checkout/GiftNote.tsx
src/components/home/BrandsMarquee.tsx
src/components/home/BundleBanner.tsx
src/components/home/ShopTheLook.tsx
src/components/home/TrustStrip.tsx
src/components/order/OrderTimeline.tsx
src/components/product/CompareBar.tsx
src/components/product/CompareButton.tsx
src/components/product/CompareView.tsx
src/components/product/PriceAlertButton.tsx
src/components/product/SizeRecommender.tsx
src/components/ui/Confetti.tsx
src/components/ui/CurrencySelector.tsx
src/components/ui/FloatingWhatsApp.tsx
src/components/ui/KeyboardShortcuts.tsx
src/components/ui/ReadingProgress.tsx
src/lib/cart-perks.ts
src/lib/compare-store.ts
src/lib/currency-store.ts
src/lib/price-alert-store.ts
```

### Files touched (additive only)

```
src/app/(storefront)/cart/page.tsx         · pass product originals to CartView
src/app/(storefront)/checkout/success/page.tsx · add Confetti + OrderTimeline
src/app/(storefront)/page.tsx              · add 4 new home sections
src/components/app-shell/ClientShell.tsx   · register CompareBar, KeyboardShortcuts, FloatingWhatsApp
src/components/cart/CartDrawer.tsx         · mount CartPerksBar (compact)
src/components/cart/CartView.tsx           · mount CartPerksBar (full)
src/components/checkout/CheckoutForm.tsx   · add GiftNote field
src/components/layout/Footer.tsx           · add CurrencySelector
src/components/layout/Header.tsx           · add Compare nav link
src/components/product/ProductCard.tsx     · add CompareButton
src/components/product/ProductDetailClient.tsx · add ReadingProgress, SizeRecommender, PriceAlertButton
```

### Verification

- `npx tsc --noEmit` passes clean.
- `npx next build` succeeds with the new `/compare` route registered as a
  prerendered static page and no regressions to existing routes.
