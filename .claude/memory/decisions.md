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

<!-- e.g. "Editorial over catalog — every landing page has a point of view, not just a grid." -->
<!-- e.g. "Mobile-first always; desktop is a polish layer." -->
<!-- e.g. "One serif (Ceramic) for everything; no secondary typeface." -->

---

## Things we explicitly rejected

_Ideas that were considered and turned down, with why — so we don't re-debate them._

<!-- e.g. "No online payment gateway yet — COD only, until volume justifies the reconciliation overhead." -->
<!-- e.g. "No per-user accounts on storefront — everything is phone/email keyed, guest-first." -->

---

### 2026-04-23 — ESLint ban on admin-supabase imports lives inline in `eslint.config.mjs`, not as a separate `eslint-plugin-local` package

The "`@/lib/supabase/admin` must not be imported from a `\"use client\"` file" invariant is enforced as a small rule defined inline in `eslint.config.mjs` under the `local` plugin key. Reason: it's the only custom rule this repo needs, so a whole `eslint-plugin-local/` workspace package (separate `package.json`, build step, npm link) would be dead weight. Flat-config's `plugins: { local: { rules: { ... } } }` supports inline plugin objects natively. If a second custom rule shows up later, promote both to a real package then — not preemptively.

Rejected: using `no-restricted-imports` with a `patterns` glob like `src/components/**/*`. Glob ≠ `"use client"` — server components also live under `src/components/` (e.g. `ProductCard.tsx` and a few others are RSCs). The AST-level directive check is the only accurate signal.