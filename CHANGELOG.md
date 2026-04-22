# Changelog — Closet by Junassan

A running log of features added by the Claude build agent, grouped by day.
Newest at the top. Each entry includes the feature, what it does, where it lives
and the inspiration (the "idea from around the world").

---

## 2026-04-22 — Heavy-duty drop #1 (15 new things)

Fifteen new e-commerce features inspired by the best storefronts on the internet
(Shopify / Zalora / ASOS / SSENSE / Amazon / Daraz / Nike / Lulus / End. /
Ssense / Shein). All additive — no existing flow touched beyond mounting points.

### 1. Floating WhatsApp FAB
- **What**: Site-wide sticky "chat on WhatsApp" button on every storefront page.
- **Where**: `src/components/ui/WhatsAppFab.tsx`, mounted in `ClientShell.tsx`.
- **Inspiration**: Daraz PK and most Asian e-commerce stores — 1-tap WhatsApp
  is how Pakistani customers actually buy.

### 2. Flash Deals countdown banner
- **What**: Rotating flash-deal bar with a live HH:MM:SS countdown to midnight,
  shown on the home page above the product rails.
- **Where**: `src/components/home/FlashDeals.tsx`, mounted in `(storefront)/page.tsx`.
- **Inspiration**: Shein, Daraz "daily deals", Amazon Lightning Deals.

### 3. Compare Products (up to 4)
- **What**: Persistent compare store + "Add to compare" on every product card +
  a `/compare` page that shows a side-by-side spec table (price, brand, size,
  stock, condition, fabric) with direct add-to-cart.
- **Where**: `src/lib/compare-store.ts`, `src/components/product/CompareButton.tsx`,
  `src/components/product/CompareBar.tsx`, `src/app/(storefront)/compare/page.tsx`.
- **Inspiration**: Best Buy, Flipkart, Zalando compare-table UX.

### 4. Size Recommender
- **What**: Modal that takes height / chest / waist / weight + fit preference
  and returns a recommended size (S/M/L/XL) using a simple rules engine. Entry
  point added to the product detail page next to the size picker.
- **Where**: `src/lib/size-recommender.ts`,
  `src/components/product/SizeRecommender.tsx`,
  mounted from `ProductDetailClient.tsx`.
- **Inspiration**: ASOS "Fit Assistant", True Fit, Zalora size-finder.

### 5. Currency toggle (PKR / USD preview)
- **What**: Header toggle that previews every price across the site in USD at
  a fixed indicative rate (read-only — checkout still charges PKR). Persists in
  localStorage. `formatPKR` is currency-aware via a shared store.
- **Where**: `src/lib/currency-store.ts`,
  `src/components/ui/CurrencyToggle.tsx`,
  updated `src/lib/format.ts`, mounted in `Header.tsx`.
- **Inspiration**: SSENSE, Farfetch, Mr Porter — international pricing previews.

### 6. Gift wrap + gift message at checkout
- **What**: Opt-in gift wrap (Rs 200) with a 140-char gift-message textarea,
  both persisted with the order. Summary line shows in the cart review.
- **Where**: `src/components/checkout/GiftOptions.tsx`,
  updated `CheckoutForm.tsx` and `OrderDraft` / `createOrder`.
- **Inspiration**: Lulus, Nordstrom, Net-a-Porter gift options.

### 7. Tiered bulk discount (Buy More Save More)
- **What**: Automatic quantity discount — 2 items → 5% off, 3 items → 10% off,
  4+ items → 15% off, computed live in the cart drawer and cart page with a
  "you're Rs X away from 10% off" nudge.
- **Where**: `src/lib/bulk-discount.ts`,
  `src/components/cart/BulkDiscountMeter.tsx`,
  wired into `CartDrawer.tsx`, `CartView.tsx` and `CheckoutForm.tsx`.
- **Inspiration**: Gymshark, Shein bundle discounts, H&M member tiers.

### 8. Loyalty / referral code after purchase
- **What**: On the order-success page, generate a deterministic "CBJ-FRIEND"
  referral code tied to the order short-code. Shareable via WhatsApp / native
  share, redeemable at checkout as a new `FRIEND` coupon (Rs 300 off).
- **Where**: `src/lib/referral.ts`,
  `src/components/checkout/ReferralCard.tsx`,
  updated `src/lib/coupons.ts`.
- **Inspiration**: Uber, Airbnb, ShareASale-style referral loops.

### 9. Wishlist share via URL
- **What**: Share-your-wishlist button on `/wishlist` that encodes the product
  IDs in a URL. Opening that URL on another device prefills the wishlist view
  with the shared items ("Your friend's picks").
- **Where**: `src/components/product/WishlistShare.tsx`,
  `src/app/(storefront)/wishlist/shared/page.tsx`.
- **Inspiration**: Amazon wishlist sharing, Pinterest board share.

### 10. Brands directory
- **What**: `/brands` page listing every brand on the site with a piece-count
  and link to a filtered shop view. Alphabetical index, searchable.
- **Where**: `src/app/(storefront)/brands/page.tsx`, footer link added.
- **Inspiration**: SSENSE, End. Clothing "designers" index.

### 11. Lookbook
- **What**: `/lookbook` page with styled editorial looks (cover image + 2-3
  shoppable products), pulled from real products in seed/DB.
- **Where**: `src/app/(storefront)/lookbook/page.tsx`,
  `src/lib/lookbook.ts`, footer link added.
- **Inspiration**: Net-a-Porter "The Edit", Zara editorials, Everlane lookbooks.

### 12. "Complete the Look" on product pages
- **What**: On every product page below the detail panel, a curated "Complete
  the look" rail that picks 3 complementary products from different categories
  (e.g. a shirt shows trousers + shoes + a bag). Deterministic + seeded so the
  recommendation is stable.
- **Where**: `src/lib/complete-the-look.ts`,
  `src/components/product/CompleteTheLook.tsx`,
  mounted in `product/[slug]/page.tsx`.
- **Inspiration**: ASOS "Buy the look", Zara outfits, Nike complete-your-fit.

### 13. Creators / Affiliates page
- **What**: `/creators` landing for influencers and resellers to apply with
  Instagram handle + follower count. Mailto submission, branded copy.
- **Where**: `src/app/(storefront)/creators/page.tsx`, footer link added.
- **Inspiration**: ShopMy, Gymshark Athletes, LTK creator program.

### 14. Shipping estimator on product page
- **What**: "Deliver to…" city picker on every product page; shows the exact
  delivery window (3–5 working days) for the chosen city and whether COD is
  available. Uses the shared `PK_CITIES` list and remembers the last city.
- **Where**: `src/components/product/ShippingEstimator.tsx`,
  mounted in `ProductDetailClient.tsx`.
- **Inspiration**: Amazon "Deliver to…", Flipkart, Myntra pin-code check.

### 15. Recently Viewed full page
- **What**: Dedicated `/recently-viewed` route listing everything the shopper
  has looked at (from the existing `recent-store`), with "clear history" +
  "move all to wishlist" bulk actions.
- **Where**: `src/app/(storefront)/recently-viewed/page.tsx`,
  `src/components/product/RecentlyViewedPage.tsx`.
- **Inspiration**: Amazon "Your browsing history", ASOS recent items.

---
