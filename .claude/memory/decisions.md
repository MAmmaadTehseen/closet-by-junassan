# Decisions

Durable decisions about what this store is and isn't. Update as they're made — don't revisit in passing.

Format for new entries: `### YYYY-MM-DD — <title>` followed by the decision, the reason, and any explicit alternatives that were rejected.

---

### 2026-04-23 — Guard service-role key leaks at lint time, not just runtime

`@/lib/supabase/admin` (`SUPABASE_SERVICE_ROLE_KEY`) already has two runtime defenses: `import "server-only"` and a `typeof window !== "undefined"` throw in `createAdminClient()`. Added a third check at edit time: local ESLint rule `local/no-admin-in-client` (in `eslint-rules/index.mjs`) fails lint if any `"use client"` file imports the admin module, via static `import`, `import()`, or `require()`. Relative paths ending in `/lib/supabase/admin` are covered too.

Reason: the blast radius of a single slip here (service-role key shipped in the browser bundle) is bad enough to warrant belt-and-braces. Lint is the earliest place we can shout.

Rejected alternatives:
- **`no-restricted-imports` with per-file overrides** — can't cleanly match on the `"use client"` directive without enumerating every client file. AST inspection is simpler and self-maintaining.
- **Pure runtime trust** — `server-only` only throws if the module is actually evaluated; a dead-branch import could still land the key in a chunk.
- **Hand-rolled env indirection** — over-engineered; the rule + `server-only` pair is sufficient.

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
