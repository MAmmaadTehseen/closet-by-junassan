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

### 2026-04-24 — Editorial hero with a cursor-spotlight signature

The homepage hero is an editorial composition — eyebrow, oversize display headline (split across two lines with the second line italicized), short subheading, dual CTAs, and a row of three reassurance stats (rating / COD / drops). The background video previously used by `VideoHero` was dropped: the animation signature lives in the **cursor-tracked radial spotlight** instead, which layers two soft `radial-gradient` blobs (ink + accent-red, `mix-blend-mode: multiply`) that lerp toward the pointer. The video asset was net-neutral for brand expression and net-negative for LCP on PK mobile; the spotlight is all CSS + ~30 lines of rAF pointer-tracking and scales well on low-end devices.

### 2026-04-24 — Cursor interactions gate on pointer: fine + prefers-reduced-motion

Any new cursor-reactive effect we add must `matchMedia` on both `(pointer: fine)` and `(prefers-reduced-motion: reduce)` and render a static fallback (not no fallback) when either fails. The `HeroSpotlight` component is the reference implementation. Rejected: WebGL/shader hero effects — the closet-by-junassan audience is mobile-heavy and bandwidth-sensitive; the cost is visible to 95% of users while the effect only pays off for 5%.

### 2026-04-24 — One display serif, and it's Playfair Display

The storefront uses a single serif everywhere; no secondary typeface. That serif is **Playfair Display** (Google Font, OFL licensed — free for commercial use), loaded via `next/font/google` in `src/app/layout.tsx` and exposed as the `--font-ceramic` CSS variable. The variable name is retained as a stable indirection point: if a licensed Ceramic font is ever acquired, only `layout.tsx` changes.

<!-- e.g. "Editorial over catalog — every landing page has a point of view, not just a grid." -->
<!-- e.g. "Mobile-first always; desktop is a polish layer." -->

---

### 2026-04-24 — Smooth scroll is Lenis, not Locomotive / not Framer / not GSAP

Interpolated wheel/touch scroll is provided by `lenis` (~3 KB gz, zero peer deps). It's initialized once in `src/components/app-shell/LenisProvider.tsx` with a short `duration: 1.15` and a `1 − (1 − x)^3` ease, driven by a single `requestAnimationFrame` loop. The provider refuses to initialize when `prefers-reduced-motion: reduce` is set — in that case, native scrolling plus the existing `html { scroll-behavior: smooth }` take over. We rejected Locomotive Scroll (heavier, does its own layout), Framer Motion's scroll bits (the rest of the app doesn't use FM so pulling it in for scroll alone is disproportionate), and hand-rolling it (the edge cases — nested scroll containers, anchor navigation, iframes — are not worth the bytes saved).

### 2026-04-24 — i18n split: pure `i18n.ts` + server-only `i18n-server.ts` + client `useT()` via context

The i18n module had to be callable from both RSCs and client components, but the cookie read (`getLang`) uses `next/headers` which breaks client bundles under Turbopack. The resolution: `src/lib/i18n.ts` contains _only_ the pure, bundler-safe pieces (`DICT`, `Lang` / `TranslationKey` types, sync `t(key, lang, vars)` with `{var}` interpolation), and a new `src/lib/i18n-server.ts` holds everything `next/headers`-dependent behind `import "server-only"`. Client components never call `t()` directly with a `lang` argument — they read the language via `I18nProvider` (mounted once in the root layout with `lang` pulled from the server-side cookie read) and consume it through `useT()` / `useLang()` in `src/hooks/use-t.ts`. Rejected: (a) having every client component read `document.cookie` itself — that duplicates the lookup, races `router.refresh()`, and leaks the cookie name to N files; (b) a single combined module with runtime branching on `typeof window` — Turbopack still eagerly evaluates `next/headers` and errors the build. The provider pattern is the canonical RSC-era solution and keeps the sync path on the client.

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
