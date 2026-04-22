# Changelog

All notable changes to **Closet by Junassan** are tracked here, newest first.
Each entry is what Claude (the agent in this repo) shipped on a given session
so the team can review the diff at a glance.

> Format inspired by [Keep a Changelog](https://keepachangelog.com).

---

## 2026-04-22 — "Borrowed from the best" drop

A 15-feature pass adding global e-commerce best-practices (Amazon-style bundles,
Shopify-style rewards, Nike-style currency switcher, SHEIN-style spin wheel,
ASOS-style style quiz, Zara-style trust badges) to the storefront. Every feature
is wired to existing brand tokens — no new design system pieces.

### Added

1. **Compare Products** — new `/compare` page plus a per-card scale-icon button
   and a sticky bottom tray. Up to 4 pieces side-by-side: brand, size, condition,
   fabric, stock, discount + add-to-bag direct from the table.
   - `src/lib/compare-store.ts`
   - `src/components/product/CompareButton.tsx`
   - `src/components/product/CompareTray.tsx`
   - `src/components/product/CompareView.tsx`
   - `src/app/(storefront)/compare/page.tsx`

2. **Free-shipping / priority dispatch progress bar** — gamified threshold
   (Rs 5,000) shown in both the cart drawer and the cart page summary.
   - `src/components/cart/FreeShippingBar.tsx`

3. **Closet Coins (loyalty)** — full points wallet (1 coin per Re 1 spent),
   persisted via Zustand. Earned automatically on order success. Redeem at
   checkout up to 30% of the cart.
   - `src/lib/coins-store.ts`
   - `src/components/cart/CoinRedeem.tsx`
   - `src/components/checkout/ClearCartOnSuccess.tsx` (extended to award coins)

4. **Rewards / Tier program** — `/rewards` page with wallet card, recent
   activity, and Cotton → Linen → Silk tier ladder.
   - `src/app/(storefront)/rewards/page.tsx`
   - `src/components/rewards/RewardsWallet.tsx`

5. **Spin-the-Wheel** — once-per-visitor SVG-rendered prize wheel with
   weighted prizes (Rs 200/500 off, 10% off, free-shipping bonus, mystery
   gift). Codes are inserted as real coupons.
   - `src/components/ui/SpinWheel.tsx`
   - `src/lib/coupons.ts` (added `SHIPFREE`, `SPIN500`, `GIFT`, `REFER15`)

6. **Frequently Bought Together** — bundle widget on every PDP. Selects 2
   in-stock related items, applies a 10% bundle discount, adds all in one
   click.
   - `src/components/product/FrequentlyBought.tsx`

7. **Trust badges** — six-point trust strip on the PDP (hand-inspected, COD,
   3-day returns, dispatch call, secure orders, authentic finds).
   - `src/components/product/TrustBadges.tsx`

8. **Multi-currency display switcher** — Pick PKR / USD / GBP / AED in the
   header (header pill with flags). Persisted; clearly labelled "checkout
   in PKR" so it's a UX nicety, not a price-engine claim.
   - `src/lib/currency-store.ts`
   - `src/components/ui/CurrencySwitch.tsx`
   - `src/components/ui/Price.tsx` (drop-in price component for future use)

9. **Style Quiz** — `/style-quiz`: a 5-step interactive curator that filters
   the catalog by audience, vibe, size, budget, and use-case. Animated
   progress bar, retake button, falls back gracefully when no exact match.
   - `src/app/(storefront)/style-quiz/page.tsx`
   - `src/components/style-quiz/StyleQuiz.tsx`

10. **Gift Cards** — `/gift-cards` with hero card preview, preset/custom
    amount picker, recipient + note fields, and a one-tap WhatsApp order
    deep-link.
    - `src/app/(storefront)/gift-cards/page.tsx`
    - `src/components/gift-card/GiftCardForm.tsx`

11. **Refer a Friend** — `/refer` with auto-generated personal code,
    copyable referral link, native share + WhatsApp / IG / FB share
    buttons, and "how it works" trio.
    - `src/app/(storefront)/refer/page.tsx`
    - `src/components/refer/ReferralWidget.tsx`

12. **Save for Later** — separate persisted store, "Save for later" button on
    every cart row, dedicated section under cart that survives refreshes.
    - `src/lib/saved-store.ts`
    - `src/components/cart/SavedForLater.tsx`

13. **WhatsApp Floating Action Button** — green pulsing FAB with a delayed
    welcome bubble, quick-message starters, and a fallback "call us" link.
    Hides on /admin and /checkout/success.
    - `src/components/ui/WhatsAppFab.tsx`

14. **Header upgrades** — added Style Quiz nav link, mobile menu links to
    Compare / Closet Coins / Refer & Earn / Gift Cards, and the new
    currency switcher next to the theme toggle.
    - `src/components/layout/Header.tsx`

15. **Footer upgrades** — new "Rewards" column linking to Closet Coins,
    Refer & Earn, Gift Cards, Wishlist; Style Quiz + Compare added to
    the Shop column.
    - `src/components/layout/Footer.tsx`

### Changed

- `src/components/product/ProductCard.tsx` — added a stacked compare button
  alongside wishlist (visible on hover, tappable on mobile).
- `src/components/cart/CartView.tsx` — refactored summary block to support
  coupon + coins discounts side-by-side, added Save for Later, restructured
  the empty state.
- `src/components/cart/CartDrawer.tsx` — top of the totals block now shows
  the free-shipping progress bar.
- `src/components/app-shell/ClientShell.tsx` — registers `CompareTray`,
  `SpinWheel`, and `WhatsAppFab` as dynamic, ssr-disabled components.
- `src/app/(storefront)/product/[slug]/page.tsx` — injected
  `<TrustBadges />` and `<FrequentlyBought />` blocks below the gallery
  before reviews.

### Notes for the next session

- Coupons added by the Spin Wheel (`SHIPFREE`, `SPIN500`, `GIFT`, `REFER15`)
  are simple subtractions for now — wire them to real promo logic in
  `lib/coupons.ts` once a backend table is added.
- Currency switcher is **display-only** for now. To make it real, add
  daily-refreshed FX rates via an API (e.g. `exchangerate.host`) and pass
  rates server-side to keep client bundle slim.
- Closet Coins are stored in `localStorage` only. Lift into Supabase once
  user accounts ship so coins follow the customer across devices.
- Bundle discount (`FrequentlyBought`) currently applies in the cart
  visually but the per-item price isn't reduced. When a real bundle SKU is
  introduced server-side, swap to an actual discounted line item.

