## Architecture

Phase 2 extends the `motion` side of the hybrid animation stack established in
Phase 1. No new libraries are added. The architecture is:

```
Server Components (default)
  └─ Reveal.tsx (motion whileInView) — baseline for 2C sections

Client Components (only where scroll-linked hooks are needed)
  └─ TournamentsStage.tsx — wraps useScroll/useTransform for scroll-scrub
```

### Animation patterns by sub-fase

**2A (Talent + Company) — Staggered reveal + parallax**
- Pattern: wrap each element group in its own `Reveal` with incremental `delay`,
  OR use a single `motion.div` with `variants` and `staggerChildren`.
- Parallax (optional): use `useScroll` + `useTransform` on the card element
  only, mapping `y` to a fraction of scroll progress. Keep it subtle (10–20px
  range).
- Both sections remain Server Components — parallax on a single element can be
  achieved via a thin Client Component wrapper or by enhancing `Reveal`.

**2B (Tournaments) — Scroll-scrub 3-step narrative**
- Pattern: same architecture as Phase 1's HowItWorks.
  - `TournamentsSection.tsx` stays as the Server Component shell (renders
    headline, description, passes data as props).
  - `TournamentsStage.tsx` is a new Client Component that receives step data
    and hosts the scroll-scrub logic.
- Animation implementation:
  - `useScroll({ target: containerRef })` — tracks scroll progress through
    the section.
  - `useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 1, 1])` —
    step 1 opacity.
  - `useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 1, 1])` —
    step 2 opacity.
  - `useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 0, 1])` —
    step 3 opacity.
  - Y offsets via parallel `useTransform` with small range (e.g. 20px → 0).
  - Optional `useSpring` wrapping for smoothing.
- Mobile fallback: use `gsap.matchMedia()` equivalent — check viewport at
  mount, use `Reveal` with stagger for `< 1024px`. Since we're not using GSAP,
  implement via `window.matchMedia` + `useEffect` to conditionally apply
  scroll-scrub or reveal-only mode.
- `prefers-reduced-motion`: `useReducedMotion()` from `motion/react` — when
  true, skip all `useScroll`/`useTransform` setup, render steps statically.

**2C (Networking, News, Newsletter, Closing, Footer) — Enhanced reveals**
- Pattern: chain multiple `Reveal` components with staggered `delay` values,
  or use `motion.div` with `variants` + `staggerChildren` for coordinated
  group entrance.
- All remain Server Components — no client hooks needed.
- Footer: either static (no animation) or single `Reveal` on the whole block.

## Component changes

### TalentSection.tsx (MODIFY)
- Current: 2 `Reveal` wrappers (text + card), basic fade.
- New: 4 `Reveal` instances (headline, description+bullets, card) with stagger
  delays: `delay={0}` / `delay={0.1}` / `delay={0.2}`.
- Optional: extract a `ParallaxCard` client wrapper for the card's subtle
  vertical offset — OR keep it simple with just staggered reveals.

### CompanySection.tsx (MODIFY)
- Mirror of Talent: same stagger pattern, grid order preserved (`md:order-1` /
  `md:order-2`).

### TournamentsSection.tsx (MODIFY → Server shell)
- Becomes a thin Server Component: renders `<SectionContainer>`, headline,
  description, and delegates step rendering to `<TournamentsStage>`.
- Passes `steps` array as props to the client wrapper.

### TournamentsStage.tsx (CREATE → Client Component)
- `"use client"` — receives `steps: { title: string; description: string }[]`.
- Uses `useRef` for the container, `useScroll` for progress tracking.
- Renders 3 step cards with `motion.div` wrapping, each with `style={{ opacity, y }}`
  driven by `useTransform`.
- Desktop (`>= 1024px`): scroll-scrub mode.
- Mobile (`< 1024px`): sequential `Reveal` fallback.
- Respects `useReducedMotion()`.

### NetworkingSection.tsx (MODIFY)
- Replace single `Reveal` wrapping all tags with individual `Reveal` per tag
  with staggered delay.

### NewsSection.tsx (MODIFY)
- Featured card: `Reveal` with `delay={0}`.
- Secondary cards: `Reveal` with `delay={0.1}` / `delay={0.2}`.

### NewsletterSection.tsx (MODIFY)
- 3 `Reveal` instances: headline (`delay={0}`), description (`delay={0.1}`),
  form (`delay={0.2}`).

### ClosingSection.tsx (MODIFY)
- 2 `Reveal` instances: headline+description (`delay={0}`), CTA button
  (`delay={0.15}`).

### FooterSection.tsx (MODIFY or KEEP STATIC)
- Decision: keep static. Footer is the page close — adding animation here
  risks feeling sluggish without visual benefit. If the user requests it
  later, a single `Reveal` on the whole block is trivial to add.

## File map

```
src/
  components/
    animations/
      tournaments.ts          ← CREATE: scroll-scrub init logic (optional, could live inline in TournamentsStage)
    sections/
      TalentSection.tsx       ← MODIFY: staggered reveals
      CompanySection.tsx      ← MODIFY: staggered reveals (mirror)
      TournamentsSection.tsx  ← MODIFY: thin server shell
      TournamentsStage.tsx    ← CREATE: client scroll-scrub wrapper
      NetworkingSection.tsx   ← MODIFY: staggered tags
      NewsSection.tsx         ← MODIFY: featured emphasis + stagger
      NewsletterSection.tsx   ← MODIFY: sequential reveals
      ClosingSection.tsx      ← MODIFY: coordinated entrance
      FooterSection.tsx       ← KEEP STATIC (or minimal reveal)
```

## Risks
- Tournaments scroll-scrub complexity → mitigate by reusing Phase 1 patterns
  (HowItWorksStage.tsx as reference) and keeping the transform range small.
- `useScroll` accuracy on locale switch → add locale as dependency to
  recalculate scroll triggers.
- Motion-only scroll-scrub may feel less smooth than GSAP's scrub → use
  `useSpring` for smoothing; accept that GSAP-level scrub fidelity is out of
  scope for this phase.
