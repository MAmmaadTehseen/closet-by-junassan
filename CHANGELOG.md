# Changelog

All notable feature additions to **Closet by Junassan** are tracked here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## 2026-04-23 — Heavy-duty feature drop #1

Global e-commerce patterns adapted for a Pakistani COD-first thrift store.
Fifteen new features across storefront, PDP and storewide nav.

### Added

1. **Compare products** — pick up to 4 pieces across the shop and see price,
   size, condition, fabric and stock side-by-side.
   - `src/lib/compare-store.ts` — zustand store persisted to `localStorage`
   - `src/components/product/CompareButton.tsx` — toggle from any product card
   - `src/components/product/CompareBar.tsx` — floating footer bar while compare has items
   - `src/app/(storefront)/compare/page.tsx` + `CompareView.tsx` — full comparison table

2. **Shop the Look · Bundles** — four curated capsules (Weekend Casual,
   Office Starter, Little Explorer, Date Night) auto-built from current stock,
   each with its own bundle discount (10–15%) that applies when added to cart.
   - `src/lib/bundles.ts`
   - `src/app/(storefront)/bundles/page.tsx`
   - `src/app/(storefront)/bundles/AddBundleToCart.tsx`

3. **Junassan Club · Loyalty rewards** — join for 100 welcome points,
   earn 1 pt per rupee, redeem at 4 tiers (Rs 10 / 50 / 110 / 300 off),
   and climb from Cotton → Linen → Silk → Cashmere for perks.
   - `src/lib/rewards-store.ts`
   - `src/app/(storefront)/rewards/page.tsx` + `RewardsView.tsx`

4. **Gift cards** — digital gift cards from Rs 1,000 with five presets
   plus a custom amount, live card preview, optional recipient name and
   personal note, WhatsApp checkout.
   - `src/app/(storefront)/gift-cards/page.tsx`
   - `src/app/(storefront)/gift-cards/GiftCardForm.tsx`

5. **Dedicated FAQ page** — five sections (Ordering, Delivery, Sizing,
   Returns, About) replacing the `/contact#faq` anchor with a proper
   standalone page.
   - `src/app/(storefront)/faq/page.tsx`

6. **Size Converter** — cross-reference US / UK / EU / PK / cm sizes for
   women & men tops, bottoms, and shoes; tap any row to highlight
   equivalents across systems.
   - `src/app/(storefront)/size-converter/page.tsx` + `SizeConverter.tsx`

7. **Flash sale countdown banner** — weekly auto-rolling deadline
   (every Sunday 23:59 PKT) on the homepage with live days/hours/mins/secs
   counter and CTA into `/deals`.
   - `src/components/home/FlashSaleBanner.tsx`

8. **Delivery estimator on PDP** — type your city, get a tighter 2–3 day
   window for Karachi/Lahore/Islamabad/Rawalpindi, 3–5 elsewhere, with an
   actual calendar window.
   - `src/components/product/DeliveryEstimator.tsx`

9. **Price drop alerts** — subscribe to be pinged if a product's price
   drops. Data lives in `localStorage` under `closet-price-alerts`.
   - `src/components/product/PriceDropAlert.tsx`

10. **Shareable wishlist** — every wishlist now exposes a copy/share link
    (`/wishlist?ids=…`). Opening a shared link auto-adds the pieces that
    still exist in stock.
    - Updated `src/components/product/WishlistView.tsx`

11. **Keyboard shortcuts overlay** — press `?` anywhere for the help dialog.
    New bindings: `/` search, `c` cart, `t` theme, `g h / g s / g d / g w /
    g c / g b / g r / g f / g j` for Home / Shop / Deals / Wishlist /
    Compare / Bundles / Rewards / FAQ / Journal.
    - `src/components/ui/KeyboardShortcuts.tsx`

12. **Journal** — blog-style content hub with a featured hero, 3 categorised
    posts, author/date/read-time, and per-post detail pages with related
    reads.
    - `src/lib/journal.ts`
    - `src/app/(storefront)/journal/page.tsx`
    - `src/app/(storefront)/journal/[slug]/page.tsx`

13. **Referral program** — auto-generates a unique device-local code
    (e.g. `SOFT-DENIM-47`), share link, WhatsApp deep link and copy
    buttons. "Give Rs 300, Get Rs 300" mechanic.
    - `src/app/(storefront)/referrals/page.tsx`
    - `src/app/(storefront)/referrals/ReferralCard.tsx`

14. **Ambassador landing page** — 15% commission, monthly styled parcels,
    co-curated rails, application CTA that opens a pre-filled WhatsApp
    message, and a roster preview.
    - `src/app/(storefront)/ambassadors/page.tsx`

15. **Trending + recent searches in ⌘K palette** — empty-state chips for the
    eight hottest trending queries plus the user's last 6 searches, persisted
    to `localStorage`.
    - Updated `src/components/search/SearchPalette.tsx`

### Changed

- Product card now exposes a "Compare" chip on hover (desktop) beside the
  Quick View button.
- Product detail page now includes the Price Drop Alert, the Compare chip,
  and a live Delivery Estimator.
- `Footer.tsx` gets a new "Closet Club" column linking to all new pages and
  consolidates connect links.
- `Header.tsx` mobile nav now links to Bundles, Rewards, Gift Cards, Journal
  and FAQ in addition to the existing shop/wishlist/contact.
- `ClientShell.tsx` mounts `CompareBar` and `KeyboardShortcuts` globally.
- Home page now renders `FlashSaleBanner` between Trending and Limited Stock
  rails.

### Notes

- All new client stores (compare, rewards, price alerts, referral code,
  recent searches) are `localStorage`-first and survive reloads on device.
  No backend schema changes were required.
- Routing follows the existing Next.js 16 App Router conventions: storefront
  pages live under `src/app/(storefront)/…`, with `page.tsx` server components
  that hand off to a neighbouring `*Client.tsx`/`*View.tsx` where interaction
  is needed.
- Typography, colour tokens and motion tokens are all reused from
  `src/app/globals.css` — no new CSS required.

---

*For setup instructions and project tech stack see `README.md`.*
