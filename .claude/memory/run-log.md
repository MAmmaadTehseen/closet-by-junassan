# Run log

Append one block per agent run. Most recent at the top.

Format:

```
## YYYY-MM-DD HH:MM UTC — <branch>
- Goal:
- Changed:
- Outcome:
```

- **Goal** — one line, what the run was trying to do.
- **Changed** — bullets of files touched / migrations added / scripts run. Elide unchanged noise.
- **Outcome** — shipped / merged / blocked / follow-up needed. If blocked, say what on.

---

## 2026-04-23 09:30 UTC — claude/auto-20260423-0930
- Goal: Close the add-to-cart interaction loop by pulsing the drawer row for the just-added item, so the user sees a confirmation beat after the fly-to-cart arc lands (feature-ideas #12).
- Changed:
  - `src/lib/ui-store.ts` — added `lastAddedId` + `flashCartItem(id)`. The action nulls then sets after 16ms so re-adding the same item retriggers the CSS animation; auto-clears after 800ms via a module-scoped timer.
  - `src/app/globals.css` — new `@keyframes cart-row-pop` + `.cart-row-pop` (cream bg flash + tiny 1.012 scale, 0.75s). Reduced-motion already neutralized by the global block.
  - `src/components/cart/CartDrawer.tsx` — read `lastAddedId` from store, apply `cart-row-pop` on the matching `<li>`. Derivation only — no `useEffect`/`setState` (avoids the React 19 `react-hooks/set-state-in-effect` rule).
  - `src/components/product/AddToCartButton.tsx` / `QuickAddButton.tsx` / `StickyBuyBar.tsx` — call `flashCartItem(product.id)` alongside the existing `add()`/`openCart()`.
- Outcome: PR open — typecheck clean, lint clean on touched files, `/`, `/product/<slug>`, `/collections/all` all return 200 in dev. No new deps. CSS keyframe + `flashCartItem` confirmed present in shipped CSS and client JS bundles. Same note as the prior run on the missing `public/fonts/Ceramic.otf` (used a system OTF as placeholder for the dev smoke test only; not committed).

## 2026-04-23 08:45 UTC — claude/auto-20260423-0845
- Goal: Defer mount of delight widgets (SocialProof / ExitIntent / CursorCompanion) behind `requestIdleCallback` so their JS parse cost stays out of the user's first interactive window (feature-ideas #16).
- Changed:
  - `src/components/app-shell/IdleMount.tsx` (new) — small client wrapper that renders children only after `requestIdleCallback` fires (2s fallback via `setTimeout`, cleans up on unmount).
  - `src/components/app-shell/ClientShell.tsx` — wrap the three `next/dynamic({ssr:false})` delight widgets in `<IdleMount>`. `Toaster`, `CartDrawer`, `SearchPalette`, `RegisterSW`, `BackToTop`, `InstallPrompt` unchanged (they're needed for interactive paths or PWA install).
- Outcome: PR open — typecheck clean, lint clean on touched files, `/`, `/collections/all`, `/collections` all return 200 in dev. No new deps. Note: dev server requires `public/fonts/Ceramic.otf` to be present locally (pre-existing, documented in stack.md item 11); verified by dropping a placeholder OTF for the browser check only.

<!-- New entries go above this line. -->
