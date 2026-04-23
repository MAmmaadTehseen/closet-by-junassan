# Closet by Junassan — Progress Log

A running log of every feature, component, and animation added to the site.
Each entry is dated and lists the concrete files touched plus what each change
does, so future updates can build on top without duplicating work.

---

## 2026-04-23 — Globe-inspired UI kit + home-page expansion

**Theme of this batch:** borrow one idea each from fashion capitals around the
world and fuse them into Closet's existing minimal-thrift aesthetic. All new
work is on branch `claude/compassionate-goldberg-8RN6b` → PR into `dev`.

### 1. Animation library (`src/app/globals.css`)

Fifteen net-new keyframes + utility classes (all respect
`prefers-reduced-motion`):

1. **`float-y`** — slow 6s vertical float for icons / chips (Milan luxury).
2. **`float-xy`** — drifting float with subtle rotation (Paris editorial).
3. **`fade-in-blur`** — opacity + filter-blur reveal (Parisian fashion intros).
4. **`text-gradient-flow`** — 3-color gradient sliding across text
   (Seoul K-beauty web vibe).
5. **`glow-pulse`** — expanding box-shadow ring for CTAs (Tokyo neon).
6. **`shine-sweep`** — diagonal light sweep on hover (Milan luxury watches).
7. **`tilt-in-3d`** — perspective entry (Dribbble / Framer portfolios).
8. **`badge-bounce`** — rotating bounce for NEW / SALE stickers (NYC streetwear).
9. **`sticker-wiggle`** — ±3° rotation loop for playful badges (Tokyo kawaii).
10. **`count-up`** — scale-in for numeric reveals.
11. **`tag-pop`** — chip scale entry with slight overshoot.
12. **`marquee-vertical`** — vertical ticker (Berlin typography).
13. **`underline-sweep`** — link hover underline that flips anchor side
    (Copenhagen minimal).
14. **`spotlight-drift`** + `.spotlight` wrapper — ambient drifting glow.
15. **`kinetic-scale`** — heart-beat scale (activity indicators).
16. **`slide-in-left` / `slide-in-right`** — directional entrances.
17. **`ring-sweep-slow`** — 22s rotation for seals / wax-stamps.
18. **`dash-draw`** — SVG stroke-dash draw-in (hand-drawn dividers).
19. **`aurora-drift`** + `.aurora` — animated multi-radial blurred blob
    (Seoul aurora / Icelandic northern-lights).
20. **`grid-drift`** + `.dot-grid` — seamlessly drifting dot grid background
    (Copenhagen graphic design).
21. **`gradient-spin`** + `.gradient-border` — conic gradient border with
    `@property --angle` (modern web).
22. **`.tilt-card`** — CSS that maps JS-written `--mx` / `--my` vars to
    `rotateX` / `rotateY` (Apple / Dribbble tilt cards).
23. **`.hover-lift`** — translate-up with elevated shadow on hover.
24. **`.glass`** — frosted backdrop-filter pill (iOS-style).
25. **`.text-reveal`** — letter-by-letter reveal driver (Linear / Bolt).

### 2. New UI primitives (`src/components/ui/…`)

26. **`ScrollProgress.tsx`** — top-of-page reading-progress bar (Medium /
    Substack). `rAF`-throttled, 2px tall, `scaleX` transform.
27. **`TiltCard.tsx`** — pointer-tracked 3D tilt wrapper. Writes CSS vars,
    respects `pointer: fine` and `prefers-reduced-motion`.
28. **`TextReveal.tsx`** — splits text into per-letter spans, staggers
    opacity + translate on IntersectionObserver entry.
29. **`CountUp.tsx`** — animated odometer-style counter. Tween on `rAF`
    with cubic easing, triggers on viewport entry.
30. **`Spotlight.tsx`** — cursor-following radial spotlight via
    `pointermove` → CSS vars (Vercel / Linear cards).
31. **`SectionDivider.tsx`** — three artistic SVG dividers: `wave`, `notch`,
    `dots` (with per-dot soft-pulse stagger).
32. **`FloatingWhatsApp.tsx`** — sticky chat orb that appears after 8 %
    scroll. Green pulse ring, quick-reply glass sheet, keyboard-accessible.
33. **`KineticText.tsx`** — horizontal kinetic marquee that speeds up with
    scroll velocity (Studio Freight).
34. **`Confetti.tsx`** — zero-dependency canvas confetti for
    order-success / celebration moments.

### 3. New home sections (`src/components/home/…`)

35. **`StatsStrip.tsx`** — 4-column animated-counter strip (Milan luxury).
36. **`BrandWall.tsx`** — marquee logo-wall of labels we carry.
37. **`ShopByMood.tsx`** — mood cards (Desi Minimalist, Campus Cool, Mehndi
    Nights, Thrift Sneakerhead) with TiltCard + hover-lift + emoji glyphs
    (Pinterest / AirBnB curation tiles).
38. **`TrustStrip.tsx`** — inverted dark marquee of trust signals
    (Shopify standard, luxury brand ribbon).
39. **`Lookbook.tsx`** — editorial magazine layout (Paris Vogue / WSJ): one
    tall hero tile + two stacked tiles + pull-quote card with TiltCard +
    `shine-sweep` hover + dot-grid background.
40. **`TimelineStory.tsx`** — 4-step "how a piece reaches you" timeline
    with floating step badges and a hairline connector.
41. **`ValueProps.tsx`** — 4-card benefits grid wrapped in `Spotlight`.
42. **`SustainabilityBanner.tsx`** — deep-green impact panel with
    aurora blob, animated gradient counter, and a kinetic-text ribbon
    (Patagonia / Copenhagen sustainable-fashion inspo).
43. **`SaleCountdown.tsx`** — live-ticking countdown to the next Sunday
    8 PM PKT drop. 4 tabular-num blocks, dot-grid background.
44. **`PressStrip.tsx`** — "As seen in" quote cards for Pakistani media
    mentions (Dawn Weekender, Mashion, Something Haute, Hip In Pakistan).
45. **`FAQAccordion.tsx`** — 6-question accordion with smooth
    `grid-template-rows` transition (Stripe-style accordion).

### 4. Integration

46. **`src/app/(storefront)/page.tsx`** — home page now threads together
    20+ sections in a narrative arc: Hero → Trust ribbon → Stories →
    New arrivals → Stats → Categories → Drop countdown → Deals rail →
    Shop-by-mood → Featured collection → Lookbook → Bento picks →
    Brand wall → Editor's note → Trending rail → Timeline → Limited rail →
    Value props → How COD works → Sustainability → COD banner →
    Testimonials → Press → FAQ → Newsletter.
47. **`src/components/app-shell/ClientShell.tsx`** — wired in
    `ScrollProgress` (top bar) + `FloatingWhatsApp` (sticky chat orb).

### Design references mined

- Tokyo / Shibuya street-fashion: sticker-wiggle, kinetic text.
- Seoul K-beauty product pages: gradient-flow text, aurora blobs.
- Paris Vogue magazine: editorial Lookbook grid, blur-in reveals.
- Milan luxury brands: shine-sweep on hover, slow float animations.
- NYC streetwear drops: countdown block, bold press stickers.
- Copenhagen minimalism: dot-grid backgrounds, geometric dividers.
- Patagonia / circular fashion: sustainability tally banner.
- Shopify / Vercel / Linear: trust ribbon, spotlight cards, scroll progress.

### Verified

- `npx tsc --noEmit` — clean.
- `npx eslint <new files>` — clean.
- `npx next build` — successful (45 routes generated).

### Count

**47 concrete additions** in this batch (25 keyframes/utility classes,
9 UI primitives, 11 home sections, 2 integration points).
