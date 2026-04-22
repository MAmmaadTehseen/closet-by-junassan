# Improvements Log

A running log of e-commerce enhancements made to **Closet by Junassan**.
Each entry links the change to a globally-proven pattern from Shopify stores,
Amazon, ASOS, and regional South-Asian e-commerce leaders.

---

## 2026-04-22 — Global e-commerce polish pass

Branch: `claude/happy-pasteur-bQeyQ`

### 1. Floating WhatsApp chat button

**Why:** Messaging-first checkout is the #1 trust builder in Pakistani /
South-Asian e-commerce (Daraz, HumMart, Sapphire all ship one). Shopify stores
globally use this pattern — it consistently lifts conversion by giving buyers a
real-human fallback before they abandon.

**What:**

- New component: `src/components/ui/FloatingWhatsApp.tsx`
- Sitewide, client-only, auto-hides on `/admin` and `/checkout` routes.
- After ~6 seconds a soft tooltip bubble ("Need help picking a piece?") appears
  once per session — dismissible, session-stored so it never nags.
- Green WhatsApp-brand circle (`#25D366`) sitting at `bottom-20 right-6` so it
  stacks **above** the existing `BackToTop` and **above** the mobile
  `StickyBuyBar` on PDPs.
- Uses `waLink()` from `src/lib/site-config.ts` — number is configurable in one
  place.

**Wired in:** `src/components/app-shell/ClientShell.tsx`
(dynamic import, `ssr: false` — matches the pattern already used for
`SocialProof` and `ExitIntent`).

### 2. Estimated delivery date on product pages

**Why:** Pioneered by Amazon, now standard on Zalando, ASOS, Myntra, Shopify's
"Shop" app. Turning *"3–5 working days"* into a concrete *"Arrives Sat 25 Apr —
Tue 28 Apr"* is one of the highest-ROI PDP tweaks — it removes the mental math
that causes hesitation.

**What:**

- New component: `src/components/product/DeliveryEstimate.tsx`
- Parses the day-range text from `siteConfig.shipping.deliveryDays` (so editing
  `site-config.ts` updates the estimate everywhere).
- Adds working days (skips Sundays) to today's date and renders a short
  `en-PK` formatted range.
- Rendered as a subtle truck-icon card with the COD reassurance line.
- Placed on the PDP just above the Add-to-Cart button — the exact position
  Amazon and ASOS use.

**Wired in:** `src/components/product/ProductDetailClient.tsx`
(only shown when the item is in stock).

### 3. "You save Rs X" absolute savings label

**Why:** Amazon, Flipkart, ASOS all show **both** the percentage off *and* the
rupee amount saved. The absolute number is more persuasive on thrift pieces
where the base price is already low — "Save 15%" feels smaller than "You save
Rs 450".

**What:** Added a small red-accent line under the existing price row on the PDP
when `original_price_pkr > price_pkr`. Reuses the existing `accent-red` token
and `formatPKR()` helper — no new styles.

**File:** `src/components/product/ProductDetailClient.tsx`

### 4. Home-page trust strip

**Why:** Every major storefront (Allbirds, Gymshark, Khaadi, Sana Safinaz) has
a 3–4-cell strip of trust signals right under the hero — COD, returns,
delivery, authenticity. The hero already has tiny inline badges; this is the
dedicated, scannable version that addresses buyer anxiety in the first
viewport.

**What:**

- New component: `src/components/home/TrustStrip.tsx` (server component —
  static icons + copy, no JS).
- 4 cells: Cash on Delivery · 3-Day Easy Returns · Flat Delivery in PK ·
  Inspected & Graded.
- `lucide-react` icons (`Wallet`, `Undo2`, `Truck`, `ShieldCheck`), existing
  Tailwind tokens (`bg-paper`, `bg-cream`, `border-border`).
- 2-col on mobile, 4-col on desktop — uses a 1px border grid, same visual
  language as the rest of the site.

**Wired in:** `src/app/(storefront)/page.tsx` — placed between `<Hero />` and
`<StoriesBar />`, which is the canonical "trust strip" slot on Shopify stores.

---

## How to preview

```bash
npm install
npm run dev
```

Then visit:

- `/` — see the new **TrustStrip** under the hero, and the floating WhatsApp
  button (bottom-right).
- `/shop` → click any product → see **delivery-date estimate** above
  Add-to-Cart, **"You save Rs X"** under the price row (on discounted items).

## Files touched

Created:

- `src/components/ui/FloatingWhatsApp.tsx`
- `src/components/product/DeliveryEstimate.tsx`
- `src/components/home/TrustStrip.tsx`
- `IMPROVEMENTS.md` (this file)

Edited:

- `src/components/app-shell/ClientShell.tsx` — mounted `FloatingWhatsApp`.
- `src/components/product/ProductDetailClient.tsx` — added `DeliveryEstimate`
  and the "You save Rs X" line.
- `src/app/(storefront)/page.tsx` — added `TrustStrip` between hero and
  stories bar.

## Guiding principles (for the next pass)

- Everything user-facing lives in `src/lib/site-config.ts` — update once,
  propagate everywhere.
- Client components only when we need browser APIs or state; server components
  by default (Next.js 16 convention in this repo).
- No new dependencies added.
- Respect the existing design tokens: `paper`, `ink`, `cream`, `border`,
  `accent-red`, `muted-foreground`.

---

## Ideas for the next pass (not implemented yet)

- **Bundle / "Complete the look"** on PDP — pick 2–3 items from the same
  category, one-click add-all. Strongest AOV lift on fashion stores (ASOS,
  Zara).
- **Free-delivery / COD-threshold progress bar** in the cart drawer — shown
  once thresholds are introduced (e.g. free delivery over Rs 3000).
- **Size-in-stock chips** across all size variants (the current PDP only
  renders the product's single size as a chip — expand once variants exist).
- **Reviews with photos** — the `Reviews` component exists; allow buyers to
  attach photos to lift trust on thrift pieces.
- **Pre-fill checkout city** based on IP — Pakistani stores commonly do this
  for Karachi/Lahore/Islamabad buyers.
- **"Recently sold" stock counter** — complement the existing SocialProof
  toasts with a persistent "14 sold this week" line on PDPs.
