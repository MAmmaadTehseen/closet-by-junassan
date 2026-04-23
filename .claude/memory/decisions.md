# Decisions

Durable decisions about what this store is and isn't. Update as they're made — don't revisit in passing.

Format for new entries: `### YYYY-MM-DD — <title>` followed by the decision, the reason, and any explicit alternatives that were rejected.

---

## Product direction

_What problem this store is solving, who it serves, and which outcomes matter._

<!-- e.g. "Primary goal is Instagram-driven discovery → COD conversion for 18–28yo buyers in PK metro cities." -->

---

## Design principles

_The aesthetic and UX rules that changes should stay inside._

### 2026-04-24 — One display serif, and it's Playfair Display

The storefront uses a single serif everywhere; no secondary typeface. That serif is **Playfair Display** (Google Font, OFL licensed — free for commercial use), loaded via `next/font/google` in `src/app/layout.tsx` and exposed as the `--font-ceramic` CSS variable. The variable name is retained as a stable indirection point: if a licensed Ceramic font is ever acquired, only `layout.tsx` changes.

<!-- e.g. "Editorial over catalog — every landing page has a point of view, not just a grid." -->
<!-- e.g. "Mobile-first always; desktop is a polish layer." -->

---

## Things we explicitly rejected

_Ideas that were considered and turned down, with why — so we don't re-debate them._

### 2026-04-24 — Don't ship the donationware "Ceramic" font

The original design used "Ceramic" (Wino S Kadir / weknow Design, distributed on DaFont). It's **donationware: free for personal use only; commercial use requires contacting the author for a paid license**. Closet by Junassan is a commercial COD storefront, so bundling `Ceramic.otf` in the repo and serving it to every visitor would be a license violation. We rejected (a) committing the donationware file anyway and (b) paying for a commercial Ceramic license at this stage, in favor of a free-for-commercial Google Font (Playfair Display). If the brand later wants the exact Ceramic glyphs enough to justify the license fee, the swap-back procedure lives in `public/fonts/README.txt`.

<!-- e.g. "No online payment gateway yet — COD only, until volume justifies the reconciliation overhead." -->
<!-- e.g. "No per-user accounts on storefront — everything is phone/email keyed, guest-first." -->

---

## Frontend patterns

### 2026-04-23 — Transient UI animation state lives in the store, not via setState-in-effect
React 19's `react-hooks/set-state-in-effect` rule flags the common "mirror a prop into local state and auto-clear after N ms" pattern as an anti-pattern. For short-lived animation triggers (e.g. `cart-row-pop` on the drawer row that was just added to), the state now lives in the relevant Zustand store and the store action owns the set/clear timer via a module-scoped `setTimeout`. Components read the id directly and apply the class when it matches — no `useEffect`, no local mirror state. To retrigger the CSS animation when the same id flashes twice, the store sets the id to `null` then to the new id one frame later.

Rejected alternative: `eslint-disable-next-line react-hooks/set-state-in-effect` inside a local `useState`+`useEffect` pair. Works, but hides the anti-pattern and duplicates the timer in every consumer. Keeping the transient in the store is less code and one source of truth.
