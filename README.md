# Closet by Junassan

Modern mobile-first e-commerce storefront for a Pakistani fashion thrift store. Cash on Delivery only.

Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Supabase**, and **Zustand**.

## Features

- Instagram-style product grid, rails, hero
- Mobile-first responsive layout, sticky header, slide-over nav
- Shop page with category / size / price filters and sort
- Product detail with gallery, stock urgency badges, related items
- Cart (persisted to localStorage) + COD checkout
- Supabase-backed products and orders (with automatic seed-data fallback)
- SEO meta tags, sitemap, robots.txt
- All contact info, socials, and WhatsApp number in a single config file

## Quick start

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — the site runs immediately using built-in seed data.

## Connecting Supabase (optional)

1. Create a project at https://supabase.com
2. Open the SQL editor and run:
   - `supabase/schema.sql`
   - `supabase/seed.sql` (or upload your own products)
3. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
   Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is still accepted as a fallback.
4. Restart `npm run dev` — products now load from Supabase; orders save to the `orders` / `order_items` tables.

## Customizing brand info

All contact details, socials, WhatsApp number, and copy live in one place:

- `src/lib/site-config.ts`

Edit there and the whole site updates.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19.2
- Tailwind CSS v4
- Supabase (`@supabase/ssr`)
- Zustand (cart persistence)
- lucide-react (icons)

## Deploy

Optimized for Vercel. Push to GitHub and import into Vercel — add the Supabase env vars in project settings.

## Future payment integration

The checkout is structured so a payment gateway can be added later without rewriting the flow:

- `src/lib/orders.ts` exposes `createOrder` with a `paymentMethod` field
- `src/components/checkout/CheckoutForm.tsx` has a swappable payment method block
