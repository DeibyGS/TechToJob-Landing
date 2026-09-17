# ADR-001: Hybrid `motion` + GSAP animation stack

## Status
Accepted — 2026-09-17

## Context
The landing is being redesigned to feel cinematic and premium, inspired by
the motion *principles* of Apple product pages (staged reveals, scroll-linked
storytelling, pinned sections) — not their branding. The project already uses
`motion` v13 (ex-Framer Motion) for simple `whileInView` fade/translate
reveals across all 10 sections (`Reveal.tsx`), and `docs/constitution.md`
currently names `motion` as the only approved animation library.

`motion`'s `useScroll`/`useTransform` hooks can drive basic scroll-linked
opacity/scale, but they do not match GSAP ScrollTrigger's control over
pinning, scrub timing, and multi-step timeline coordination — the exact
capability needed for a pinned, scroll-scrubbed narrative section (see
`specs/002-cinematic-motion-hero-howitworks`). 2026 industry consensus (see
that spec's research) is explicit: GSAP wins when motion is central to a
product's identity (scroll-driven brand sites, editorial, award-style work);
`motion`/Framer wins when animation supports UX without defining it. This
project's new ambition falls in the former category for its Hero and
HowItWorks sections specifically — not for the other 8, more conventional,
sections.

## Decision
Adopt a **hybrid** animation stack rather than replacing `motion` outright:

- **`motion` (existing)** stays the animation library for simple
  `whileInView` reveals on non-flagship sections (Talent, Company,
  Tournaments, Networking, News, Newsletter, Closing, Footer). No change to
  `Reveal.tsx`.
- **GSAP core + `gsap/ScrollTrigger` + Lenis (new)** are added specifically
  for sections that need real pin/scrub choreography — Phase 1 covers Hero
  and HowItWorks only. GSAP code lives exclusively under
  `src/components/animations/*.ts` and is dynamically imported so it never
  enters the shared bundle for routes/sections that don't use it.
- A hard rule prevents the two systems from fighting over the same DOM
  subtree: GSAP and `motion` are never mixed on the same element or its
  descendants.

`docs/constitution.md`'s Technology Stack and Architecture Principles are
updated alongside this ADR to reflect both libraries and this rule.

## Consequences

**Positive**
- Unlocks pin/scrub choreography that `motion` alone cannot match, directly
  serving the "cinematic, Apple-inspired" goal for the two sections where it
  matters most.
- Minimizes new-dependency footprint — 6 of 10 sections keep using the
  already-installed `motion`, avoiding a full-project migration.
- Clear ownership boundary (`animations/*.ts` = GSAP, `Reveal.tsx` = motion)
  keeps the two systems from becoming entangled or duplicating logic.

**Negative**
- Two animation systems now coexist in the codebase, raising the learning
  surface for future contributors — mitigated by the strict "never mixed on
  the same DOM subtree" rule and by keeping GSAP usage confined to two files.
- Adds ~26KB gzip (GSAP core + ScrollTrigger) + ~3KB gzip (Lenis) to the
  routes that load Hero/HowItWorks, code-split away from the rest.
- If a future section needs pin/scrub too, the same "does this justify GSAP"
  judgment call has to be made again — not a one-time decision.

**Neutral**
- `docs/constitution.md`'s "Server Components by default" principle now has
  two client-boundary reasons instead of one (newsletter form, motion
  reveals) — documented, not a violation.

## Alternatives considered
1. **GSAP + ScrollTrigger + Lenis everywhere** (replace `motion` entirely) —
   rejected: forces a full rewrite of 8 already-working sections for no
   behavioral gain there, and leaves `motion` as a dead dependency unless
   also removed in the same pass. Higher blast radius for equal payoff.
2. **`motion`-only** (no new dependencies) — rejected: `useScroll`/
   `useTransform` cannot deliver true pin/scrub/multi-timeline choreography;
   the result would not meet the "cinematic, Apple-inspired" bar the spec
   commits to. Confirmed against 2026 industry consensus, not assumed.
3. **Hybrid (chosen)** — best fit: matches tool capability to where it's
   actually needed, keeps the dependency addition scoped and justified in
   the ADR/spec, and preserves everything already working.
