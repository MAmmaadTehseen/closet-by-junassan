# Changelog

All notable changes to **Closet by Junassan** are tracked here.
Dates use YYYY-MM-DD. Newest drops go on top.

---

## 2026-04-23 — Big feature drop (16 new things)

This release adds a wide swath of storefront features inspired by what the
best e-commerce brands around the world are shipping right now (Gymshark
loyalty, Everlane sustainability, Aime Leon Dore lookbooks, Glossier quizzes,
Apple-like comparison tables, etc.) and localises them for the Pakistani thrift
audience.

### Added

1. **Compare Products** — A full side-by-side comparison system.
   - `src/lib/compare-store.ts` — Zustand store (persists to localStorage, max 4 items).
   - `src/components/product/CompareButton.tsx` — per-card toggle with toast feedback.
   - `src/components/product/CompareBar.tsx` — floating fixed-bottom bar that appears when items are in the list.
   - `src/components/product/CompareView.tsx` — responsive comparison table: price, discount, brand, category, size, condition, fabric, stock, tags.
   - Route: **/compare**.
   - Wired into `ProductCard`, the `ClientShell`, and the footer.

2. **Closet Club loyalty programme** — Full points system with tiers.
   - `src/lib/loyalty-store.ts` — Zustand store (join, earn, redeem, event history).
   - Tiers: Bronze / Silver / Gold / Platinum, each with a perk.
   - 4 redeemable rewards (Rs 150 off, free delivery, Rs 500 off, mystery piece).
   - Welcome bonus, review bonus, referral bonus wiring.
   - Route: **/rewards**.

3. **Gift Cards** — Fully interactive builder.
   - 5 preset denominations + custom amount (Rs 500 – Rs 50,000).
   - 4 card themes (Noir / Rose / Cream / Party) — live preview updates.
   - "To", "From", and personalised 140-char message.
   - Drops you straight into WhatsApp with a pre-filled order.
   - Route: **/gift-cards**.

4. **Curated Bundles** — Bundle storefront with discounts baked in.
   - `src/lib/bundles.ts` — 4 curator bundles (Weekend Out, Office Reset, Starter Closet, Gift Set).
   - 10–20% savings auto-computed vs. piece-by-piece subtotal.
   - Route: **/bundles**.

5. **Fit Finder** — 4-question size recommendation quiz.
   - Height → Chest → Waist → Preferred fit.
   - Algorithmic size recommendation (S/M/L/XL) with fit-preference bias.
   - One-tap "Shop size X" CTA that filters the shop.
   - Route: **/fit-finder**.

6. **Lookbook** — Four city-themed editorial edits.
   - Karachi Sunset, Islamabad Pine, Lahore Nights, Weekend Studio.
   - Each with mood, story, and a 4-colour palette.
   - Route: **/lookbook**.

7. **Journal (blog)** — Field-note style articles with dynamic routing.
   - 4 launch posts: spotting real denim, caring for preloved, 10-piece PK capsule, behind a drop.
   - Tag, read-time, hero cover, "keep reading" carousel.
   - Routes: **/journal**, **/journal/[slug]** (static-generated).

8. **Delivery Estimator** — Live zone-based delivery calculator.
   - `src/lib/delivery-zones.ts` — 5 zones (Metro, Punjab, Sindh, KP & Balochistan, North).
   - City picker (45 PK cities), business-day estimation skipping Sundays.
   - Shows delivery fee and expected courier journey steps.
   - Route: **/delivery**.

9. **Refer & Earn** — Personal referral code with share UX.
   - Auto-generated `CBJ-XXXX` code saved locally.
   - Native Web Share API where supported, copy-to-clipboard, WhatsApp deep-link.
   - Rs 500 off for friend, 250 points for referrer.
   - Route: **/refer**.

10. **Free-shipping progress bar** — Integrated into the cart drawer.
    - `src/components/cart/FreeShippingProgress.tsx`.
    - Threshold: Rs 5000. Shows remaining spend and animates to green on unlock.

11. **Multi-currency toggle** — PKR / USD / EUR / GBP / AED.
    - `src/lib/currency-store.ts` — Zustand store persisted.
    - `src/components/ui/CurrencySwitcher.tsx` — dropdown wired into header and mobile drawer.
    - Clear disclaimer toast: prices display only, charges stay in PKR.

12. **Brands A–Z** — Alphabetical brand directory with counts.
    - Auto-computed from the product catalogue.
    - Sticky letter-jump nav, click-through to filtered shop.
    - Route: **/brands**.

13. **Sustainability / Impact page** — Transparent impact math.
    - 4 live stats: pieces rehomed, water saved, CO₂ avoided, waste diverted.
    - 6 public commitments (no virgin plastic, inspected & graded, zero fast-fashion, etc.).
    - Route: **/sustainability**.

14. **Style Quiz** — 5-question archetype quiz.
    - Scoring across 5 archetypes (Minimalist, Streetwear, Classic, Romantic, Eclectic).
    - Gradient result card with palette, keywords, and one-click "shop your archetype".
    - Route: **/style-quiz**.

15. **Size Guide hub** — Unified size chart page.
    - One page covering Men / Women / Kids / Shoes / Bags.
    - Inline fit-finder callout and per-category measurement tips.
    - Route: **/size-guide**.

16. **Homepage Edits Strip** — `src/components/home/EditsStrip.tsx`.
    - 4-card discovery strip on the homepage linking to Bundles, Lookbook, Journal, and Fit Finder.
    - Inserted between the Limited Stock rail and How COD Works.

### Changed

- `src/components/layout/Header.tsx` — Added currency switcher + mobile nav links to Bundles, Lookbook, Journal, Closet Club, and Gift Cards.
- `src/components/layout/Footer.tsx` — New "Discover" column with all new pages; expanded "Shop" and "Help" columns; upgraded grid to 5 columns on large screens.
- `src/components/cart/CartDrawer.tsx` — Integrated the free-shipping progress bar above subtotal.
- `src/components/app-shell/ClientShell.tsx` — Registered `CompareBar` as a client overlay.
- `src/components/product/ProductCard.tsx` — Added `CompareButton` next to QuickView (desktop hover).
- `src/app/(storefront)/layout.tsx` — Bumped the layout's product fetch limit from 60 to 400 so the compare bar can always look up thumbnails.
- `src/app/sitemap.ts` — Added all 13 new top-level routes + all journal posts.

### Developer-facing notes

- All new client stores use `zustand/middleware/persist` and namespace their storage keys with the `closet-` prefix.
- All server-rendered new pages declare `export const revalidate = 3600;` where appropriate.
- No new npm dependencies. Everything is built with the existing toolchain (Next.js 16, React 19.2, Tailwind v4, lucide-react, Zustand).

---

## Pre-existing features (pre-2026-04-23)

These were already shipped before this release. Left here for posterity.

- Instagram-style grid, rails, hero, stories bar
- Mobile-first sticky header + slide-over nav
- Shop page with category / size / price filters and sort
- Product detail with gallery, lightbox, stock urgency, related items
- Wishlist (persisted), Quick View, Quick Add, Recently Viewed
- Cart drawer + full cart page + COD checkout
- Supabase-backed products and orders (with seed-data fallback)
- Admin area: products, orders, categories, customers, reviews, drops, command palette
- Order tracking, review capture via email code
- Exit-intent popup, social-proof ticker, marquee announcements
- Dark / light theme toggle
- SEO metadata, sitemap, robots.txt, organization JSON-LD
- PWA / service worker registration
