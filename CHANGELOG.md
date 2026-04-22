# Closet by Junassan — Changelog

Progress log for AI-assisted iterations on the storefront. Each entry lists
the features added, where they live in the codebase, and how to reach them
from the UI so a human reviewer can verify quickly.

---

## 2026-04-22 · Batch 01 — Major feature drop (16 additions)

**Branch:** `claude/clever-dirac-yglHL`
**Build:** `next build` → passes, 36 routes generated, including new `/gift-card` and `/rewards`.
**Inspiration:** patterns from Shopify, Zara, H&M, Farfetch, Nykaa, Depop, ThredUp, Vinted, Daraz — adapted to a COD-first Pakistani thrift boutique.

### New features

1. **Compare Products** — cross-page product comparison drawer.
   - Store: `src/lib/compare-store.ts` (Zustand + persist, max 4 items).
   - UI: `src/components/product/CompareButton.tsx`, `CompareDrawer.tsx`, `CompareBar.tsx` (floating bar shows when items are queued).
   - Wired into `ProductCard` top-right stack and PDP action row.
   - Side-by-side table shows price, brand, category, size, condition, stock, fabric.

2. **Free shipping progress bar** — visual nudge toward the Rs 3,500 threshold.
   - `src/components/cart/FreeShippingProgress.tsx` — embedded in `CartDrawer` and `CartView`.
   - Animated progress bar turns green + copy flips to "unlocked" at threshold.

3. **Complete the Look / Outfit builder** — PDP cross-sell.
   - `src/components/product/CompleteTheLook.tsx` — picks 3 complementary products based on a category map (e.g. men → shoes + bags), ranked by a deterministic seeded random so it's stable between navigations.
   - Checkbox per item, "add look to bag" button adds everything in one tap.

4. **Gift Card page** (`/gift-card`).
   - Server page: `src/app/(storefront)/gift-card/page.tsx`.
   - Live preview configurator: `GiftCardConfigurator.tsx` — amount chips + custom input, 4 visual themes (classic / rose / linen / emerald), recipient name + personal note, live preview, and a WhatsApp-prefilled order CTA.

5. **Loyalty program — Closet Coins.**
   - Store: `src/lib/coins-store.ts` (persisted; 50-coin welcome bonus, earn 1 coin per Rs 100, redeem at Rs 1 = 1 coin).
   - Widget: `src/components/rewards/CoinsWidget.tsx` with expandable 8-entry history.
   - Full page: `src/app/(storefront)/rewards/page.tsx` — ways to earn (shop / refer / review / tag on IG) + redemption ladder from Rs 100 off → early drop access (1,500 coins).
   - Cart page now shows "you'll earn N coins on this order".

6. **Price drop alert** — opt-in notifications for watched products.
   - `src/components/product/PriceDropAlert.tsx` — renders below AddToCart on in-stock PDPs with target-price suggestions (-10 / -20 / -30%), persists choice to localStorage, and opens a pre-filled WhatsApp message to the store.

7. **Multi-currency switcher.**
   - Store: `src/lib/currency-store.ts` — 6 currencies (PKR, USD, GBP, EUR, AED, SAR) with flags and approximate rates.
   - UI: `src/components/ui/CurrencySwitcher.tsx` (header, desktop), `src/components/ui/PriceDisplay.tsx` (SSR-safe component that renders PKR server-side and swaps to the chosen currency on hydration).
   - `ProductCard` and PDP price rows now use `PriceDisplay`.
   - Disclaimer: orders still charged in PKR; shown rates are for reference.

8. **Bundle deals banner** (`/` home).
   - `src/components/home/BundleBanner.tsx` — 3 promotions (BUNDLE2 / BUNDLE3 / FRIEND500) with dashed coupon pills, hover-lift cards.

9. **Size fit finder quiz.**
   - `src/components/product/SizeFitFinder.tsx` — 5-step wizard (gender → height/weight → chest/waist → fit preference → result) with cm/in toggle, chest-based size recommendation adjusted by fit preference, confidence score, and localStorage persistence.
   - Wired into PDP next to the existing Size Guide link.

10. **Sustainability Impact counter** (home section).
    - `src/components/home/ImpactCounter.tsx` — 4 animated stat cards (water saved, CO₂ avoided, garments re-homed, happy wardrobes) with `IntersectionObserver`-triggered count-up using `requestAnimationFrame` easing.

11. **Product FAQ accordion** — 6 curated Q&As on every PDP.
    - `src/components/product/ProductFAQ.tsx` — authenticity, returns, condition, delivery, payment, restocks.

12. **Trending + recent searches** in the search palette.
    - Store: `src/lib/search-history-store.ts` (persisted, max 6).
    - `SearchPalette` now shows a trending-searches chip row plus a recent-searches section with clear-history button when the input is empty. Submitting a search pushes it to history.

13. **Flash Sale countdown banner** (home).
    - `src/components/home/FlashSaleBanner.tsx` — live DHMS countdown that resets weekly (ends end-of-Sunday UTC), dark hero layout, CTA to `/deals`.

14. **Recently Viewed rail on homepage.**
    - Re-used existing `RecentlyViewed` component on the home page once the user has visited any PDP; slots between the Limited Stock rail and the Impact counter.

15. **WhatsApp floating action button.**
    - `src/components/ui/WhatsAppFab.tsx` — appears after 1.4s, bottom-right on every storefront page (hidden on `/admin` and `/checkout`), with an expandable mini-chat card and brand-green pulsing ring.

16. **Scratch-to-reveal exit coupon.**
    - `src/components/ui/ScratchCoupon.tsx` — appears after ~18s of site time (once per user), renders a `<canvas>` scratch layer with pointer events, randomly picks from 4 codes (JUN500 / FIRST15 / CBJSHIP / DROP10), and reveals once ~35% is scratched.

### Wiring & integration changes

- `src/components/app-shell/ClientShell.tsx` — mounts `CompareBar`, `CompareDrawer`, `WhatsAppFab`, and `ScratchCoupon` globally.
- `src/components/layout/Header.tsx` — desktop header now has the currency switcher; mobile drawer gained `Gift Cards` and `Rewards` nav links.
- `src/components/layout/Footer.tsx` — Shop column gained `Gift Cards` and `Closet Coins` links.
- `src/app/(storefront)/page.tsx` — home feed re-ordered to include `FlashSaleBanner`, `BundleBanner`, `RecentlyViewed`, and `ImpactCounter`.
- `src/app/(storefront)/product/[slug]/page.tsx` — now passes `allProducts` into `ProductDetailClient` so `CompleteTheLook` can surface complementary picks.
- `src/components/product/ProductDetailClient.tsx` — integrated `CompareButton` (pill variant), `PriceDropAlert`, `SizeFitFinder`, `CompleteTheLook`, `ProductFAQ`, and swapped raw `formatPKR` for `PriceDisplay`.
- `src/components/cart/CartDrawer.tsx` + `CartView.tsx` — embed `FreeShippingProgress`; CartView also shows coin earn + balance.

### Verification

- `npx tsc --noEmit` — passes.
- `npx next build` — passes. All 36 routes generate, including new `/gift-card` and `/rewards`.
- Pre-existing ESLint warnings in `AdminCommandPalette`, `StoriesBar`, `StoryViewer`, `GalleryLightbox`, `ThemeToggle` are unrelated and pre-date this batch.

### What to try in the browser

- Home: scroll past the flash-countdown → bundle cards → impact counter.
- Open any product: scroll to "Complete the look" + check the FAQ; tap "Find my size" to take the quiz; tap the compare icon on 2+ product cards to surface the floating compare bar.
- Top-right (desktop): switch currency — prices across cards & PDPs update instantly.
- Stay on the site ~20s without buying: the scratch-coupon modal appears (clears for 7 days once dismissed via exit-intent logic).
- Cart drawer/page: the free-shipping progress bar animates toward Rs 3,500; the rewards widget previews coin earning.

---

## Template for next batch

```
## YYYY-MM-DD · Batch NN — <summary>

**Branch:** <branch>
**Build:** <outcome>

### New features
1. **<Feature>** — <one-liner>.
   - Files: `...`
   - UX: <where to find it>

### Wiring changes
- ...

### Verification
- ...
```
