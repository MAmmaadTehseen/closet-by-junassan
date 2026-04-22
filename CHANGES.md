# Changes log

A running log of features added by AI sessions. Each batch lists the inspirations
from global e-commerce sites and the files touched.

---

## 2026-04-22 — Round 1 · Global e-commerce upgrade pack (15 features)

Heavy-duty pass: 15 new components, one new store, one new page, plus wiring across
the homepage, product page, cart drawer, layout shell, and footer. All features were
inspired by patterns used at scale by leading e-commerce sites worldwide.

### New features

| # | Feature | Inspired by | Where it shows |
|---|---|---|---|
| 1 | **Scroll progress bar** — thin top indicator of page scroll | NYT, Medium, Glossier | Every storefront page |
| 2 | **Mobile bottom tab bar** — Home / Shop / Find / Wish / Bag / Order | Amazon, Instagram Shop, Sephora | Mobile, all storefront pages |
| 3 | **Free-delivery progress meter** — "Add Rs X more for FREE delivery" | Aritzia, ASOS, Sephora | Cart drawer & cart page |
| 4 | **Cookie consent banner** — Accept all / Essential only | H&M, Zara (GDPR pattern) | First visit, dismissable |
| 5 | **WhatsApp floating action button** — pulses, with timed prompt | Daraz, Flipkart, regional PK/IN ecom | Mobile + desktop |
| 6 | **Trust badges strip** — 4-up trust grid below the hero | Shopify themes, Allbirds, Glossier | Homepage |
| 7 | **Featured brands marquee** — auto-scrolling brand logos with counts | StockX, Ssense, Nordstrom | Homepage |
| 8 | **Shop the Look** — curated outfit module with hero piece + add-ons | Net-a-Porter, ASOS, Mr Porter | Homepage |
| 9 | **Compare pieces** — store + sticky bottom bar + side-by-side page | Amazon, Best Buy, Argos | Cards, PDP, /compare page |
| 10 | **Delivery date estimator** — "Get it Mon 28 Apr — Wed 30 Apr" with PKT cutoff timer | Amazon Prime, Daraz, Zara | Product detail page |
| 11 | **Order confidence card** — 4-up trust grid (authentic / COD / returns / call) | Sephora, Allbirds, Apple | Product detail page |
| 12 | **Style quiz** — 3-step picker that deep-links into filtered shop | Stitch Fix, Sephora, Warby Parker | Homepage |
| 13 | **Loyalty / referral card** — "Give Rs 500, Get Rs 500" with code copy + WA share | Uber, Airbnb, Cred | Homepage |
| 14 | **Cart upsell rail** — "You might also like" inline grid in the bag drawer | Shopify, Sephora, Amazon | Cart drawer |
| 15 | **Compare CTA in product card** — quick-add to compare from any grid | Amazon, John Lewis | Product cards |

### New files

```
src/lib/compare-store.ts                     # zustand store, persisted, max 4
src/components/ui/ScrollProgressBar.tsx
src/components/ui/CookieConsent.tsx
src/components/ui/WhatsAppFAB.tsx
src/components/layout/MobileTabBar.tsx
src/components/cart/FreeShippingProgress.tsx
src/components/cart/CartUpsell.tsx
src/components/home/TrustBadgesStrip.tsx
src/components/home/BrandsCarousel.tsx
src/components/home/ShopTheLook.tsx
src/components/home/StyleQuiz.tsx
src/components/home/LoyaltyReferralCard.tsx
src/components/product/CompareButton.tsx
src/components/product/CompareBar.tsx
src/components/product/CompareView.tsx
src/components/product/DeliveryEstimator.tsx
src/components/product/OrderConfidenceCard.tsx
src/app/(storefront)/compare/page.tsx
```

### Modified files

```
src/app/(storefront)/layout.tsx              # mobile bottom-spacer for tab bar
src/app/(storefront)/page.tsx                # added 5 new sections to home
src/components/app-shell/ClientShell.tsx     # mounts 6 new global UI pieces
src/components/cart/CartDrawer.tsx           # accepts products; renders upsell + free-ship meter
src/components/layout/Footer.tsx             # added /compare link
src/components/product/ProductCard.tsx       # added Compare quick-action
src/components/product/ProductDetailClient.tsx # added Delivery, Confidence, Compare CTAs
src/components/ui/BackToTop.tsx              # repositioned above mobile tab bar
```

### Patterns reused / preserved

- **No new icon dependencies** — every icon is from existing `lucide-react`.
- **Zustand + persist** — Compare store mirrors the existing Cart/Wishlist/Recent stores.
- **Tailwind v4 tokens** — uses `bg-cream`, `text-ink`, `bg-paper`, `border-border` etc., no new colors.
- **Reveal/Marquee animations** — reused existing `Reveal` and `.marquee` CSS.
- **Toast feedback** — `toast.success` / `toast.error` from existing `Toaster`.
- **Dynamic imports** — new client-only widgets are lazy-loaded via `next/dynamic` to keep TTI fast.
- **Mobile-first** — every floating element respects `safe-area-inset-bottom` and stacks above the tab bar.

### Verified

- `npx eslint src/` — no new errors introduced (5 pre-existing files still fail).
- `npx tsc --noEmit` — clean.
- `next build` — builds successfully, including the new `/compare` static route.

### Notes for next round

Ideas to consider for the next batch:
- Visual search / image upload search
- Live order tracking timeline UI
- AR/photo try-on placeholder using product image overlays
- Loyalty points balance + tier card (gold/platinum)
- Shopping live-stream / drop calendar
- Multi-language toggle (Urdu / English)
- WhatsApp checkout flow as a parallel CTA
- Bundle builder ("Build your own 3-piece pack at 15% off")
- Product reviews with photo uploads
- Personalized "for you" rail powered by recently-viewed history
