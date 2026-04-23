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

## 2026-04-23 08:45 UTC — claude/auto-20260423-0845
- Goal: Defer mount of delight widgets (SocialProof / ExitIntent / CursorCompanion) behind `requestIdleCallback` so their JS parse cost stays out of the user's first interactive window (feature-ideas #16).
- Changed:
  - `src/components/app-shell/IdleMount.tsx` (new) — small client wrapper that renders children only after `requestIdleCallback` fires (2s fallback via `setTimeout`, cleans up on unmount).
  - `src/components/app-shell/ClientShell.tsx` — wrap the three `next/dynamic({ssr:false})` delight widgets in `<IdleMount>`. `Toaster`, `CartDrawer`, `SearchPalette`, `RegisterSW`, `BackToTop`, `InstallPrompt` unchanged (they're needed for interactive paths or PWA install).
- Outcome: PR open — typecheck clean, lint clean on touched files, `/`, `/collections/all`, `/collections` all return 200 in dev. No new deps. Note: dev server requires `public/fonts/Ceramic.otf` to be present locally (pre-existing, documented in stack.md item 11); verified by dropping a placeholder OTF for the browser check only.

<!-- New entries go above this line. -->
