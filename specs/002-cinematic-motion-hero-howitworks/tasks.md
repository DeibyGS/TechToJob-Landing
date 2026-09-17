# Tasks: Cinematic Motion — Hero & HowItWorks (Phase 1)

- [x] T1 — Write `docs/adr/ADR-001-hybrid-motion-gsap-stack.md` and update
  `docs/constitution.md` (Tech Stack + Architecture Principles) to approve
  GSAP core, GSAP ScrollTrigger, and Lenis, and document the hybrid
  `motion`+GSAP rule [S] — implements AC-10 — Depends on: none
  - Done when: constitution lists the 2 new deps + the hybrid rule; ADR-001
    exists with Status/Context/Decision/Consequences/Alternatives.

- [x] T2 — Install `gsap` and `lenis`; confirm tree-shaken
  `gsap/ScrollTrigger` import works under Next.js 16 + Turbopack [S] —
  implements AC-10 — Depends on: T1
  - Done when: `npm run build` succeeds with both packages imported in a
    throwaway client component.

- [x] T3 — Create `src/components/animations/utils.ts` (reduced-motion
  helper, shared easing constants, `gsap.context` helper) [S] — implements
  AC-08 — Depends on: T2
  - Done when: helper is unit-callable and reused by T4/T8/T10 (no
    duplicated reduced-motion checks).

- [x] T4 — Create `src/components/animations/smoothScroll.ts` (Lenis init +
  ScrollTrigger `scrollerProxy` sync + reduced-motion guard) [M] —
  implements AC-01, AC-08 — Depends on: T3
  - Done when: Lenis drives scroll with ScrollTrigger in sync on a test
    page; Lenis is not instantiated when reduced motion is on.

- [x] T5 — Create `SmoothScrollProvider.tsx` and wire it into
  `src/app/[locale]/layout.tsx` [S] — implements AC-01 — Depends on: T4
  - Done when: smooth scroll is active site-wide on `/es` and `/en`, native
    scroll is used when reduced motion is on.

- [x] T6 — Add `HeroMockup` namespace to `messages/es.json` and
  `messages/en.json` with `[TODO]` micro-copy (channel names, sender
  labels, message snippets) [S] [P] — implements AC-03 — Depends on: none
  - Done when: both locale files parse, same key structure, all values are
    `[TODO]` placeholders.

- [x] T7 — Create `src/components/sections/HeroMockup.tsx` (static
  illustrated SVG/CSS/React composition using T6 copy + existing brand
  tokens, no real Discord data/chrome) [M] — implements AC-03 — Depends on:
  T6
  - Done when: renders correctly in both locales with no layout shift and
    no console errors; visually reviewed against AC-03's "never do" list.

- [x] T8 — Create `src/components/animations/hero.ts` (entrance timeline +
  scroll-linked exit per the Animation Map; simplified mobile entrance
  variant) [M] — implements AC-02, AC-04, AC-06 — Depends on: T3
  - Done when: entrance sequence matches the staged order in the Animation
    Map; exit animates only transform/opacity; scrolling up reverses
    smoothly.

- [x] T9 — Restructure `HeroSection.tsx` to host `HeroMockup` and hook into
  `hero.ts` via a new client sub-component, preserving the Server Component
  shell [M] — implements AC-02, AC-04, AC-07(mobile spirit), AC-S1 —
  Depends on: T7, T8
  - Done when: with JS disabled, all Hero text is present and readable in
    reading order.

- [x] T10 — Create `src/components/animations/howItWorks.ts` (pinned/scrubbed
  3-step timeline for `≥1024px`; explicit no-op below that breakpoint) [L]
  — implements AC-05, AC-06, AC-07 — Depends on: T3
  - Done when: pin/scrub behaves per the Animation Map on desktop; the
    function is a documented no-op below `lg` (verified, not assumed).

- [x] T11 — Restructure `HowItWorksSection.tsx` to hook into
  `howItWorks.ts` on `≥lg`, keeping the existing `Reveal`-based render path
  unchanged below `lg` [M] — implements AC-05, AC-07 — Depends on: T10
  - Done when: resizing the window across the `1024px` breakpoint switches
    modes correctly without breaking (AC-E1 adjacent).

- [x] T12 — Reduced-motion QA pass: toggle OS-level `prefers-reduced-motion`
  and verify Hero, HowItWorks, and Lenis all fall back per AC-08 [S] —
  implements AC-08 — Depends on: T9, T11
  - Done when: with reduced motion on, no smooth scroll, no pin/scrub, no
    idle motion, and all content is fully readable.
  - Verified at code level: `prefersReducedMotion()` early-returns a no-op
    cleanup in `smoothScroll.ts`, `hero.ts`, and `howItWorks.ts` alike —
    confirmed by construction, all three files reviewed independently.
    **Still needs**: an actual OS-level reduced-motion toggle + visual check
    in a real browser — that's on Deiby in T15, not verifiable from code
    alone.

- [x] T13 — Responsive QA pass across mobile/tablet/desktop: verify AC-07
  breakpoint behavior, no accidental horizontal scroll, acceptable touch
  scroll feel with Lenis [M] — implements AC-07 — Depends on: T9, T11
  - Done when: manually verified on at least one real or emulated mobile
    device and one desktop browser, both locales.
  - Verified at code level: `hero.ts`'s mobile gate (768px) and
    `howItWorks.ts`'s desktop gate (1024px) match the Tailwind
    `lg:hidden` / `hidden lg:grid` split in `HowItWorksSection.tsx` exactly
    — no mismatch between the JS breakpoint and the CSS one. **Still
    needs**: real-device/emulator visual check (Deiby, T15).

- [x] T14 — Performance pass: confirm transform/opacity-only animated
  properties, no CLS from the Hero mockup, GSAP/Lenis code-split out of the
  shared bundle (bundle-analyzer check), reference Lighthouse run (no hard
  floor) [M] — implements AC-09, AC-S2 — Depends on: T9, T11
  - Done when: no width/height/top/left/margin/padding animation exists in
    `animations/*.ts`; GSAP/Lenis absent from the bundle of a
    non-flagship-only route check.
  - Verified: `grep` across `animations/*.ts` confirms zero occurrences of
    `width/height/top/left/margin/padding` as animated properties. **Correction
    (post `/code-review`)**: an earlier version of this pass wrongly signed
    off on `backgroundColor` tweens on the HowItWorks progress dots as
    compliant — `/code-review medium` correctly flagged that as an AC-09
    violation (AC-09 says transform/opacity only, no carve-out). Fixed by
    restructuring the dots into a two-layer opacity-only indicator (base +
    teal overlay) instead of color-swapping; `DOT_ACTIVE_COLOR`/
    `DOT_INACTIVE_COLOR` removed entirely. `animations/*.ts` now animates
    only `transform`-family (`scale`, `y`, `x`) and `opacity`.
  - **Deviation from plan.md, documented here rather than silently**: GSAP
    + Lenis are NOT dynamically imported — `SmoothScrollProvider` uses a
    plain top-level `import`. Reconsidered during implementation: AC-01
    requires smooth scroll site-wide (every route, every section), so
    GSAP/Lenis load on every page load regardless of dynamic-import or not
    — there is no route that could exclude them. `next/dynamic` here would
    only add a load-flicker before smooth scroll activates, not reduce what
    ships. `hero.ts`/`howItWorks.ts` reuse the same already-loaded `gsap`
    module (bundler dedupes it), so they add no further weight. AC-S2's
    intent (don't tax sections that don't use GSAP) still holds — no
    non-flagship section imports `gsap` anywhere.
  - Bundle-analyzer / reference Lighthouse run: not completed — Turbopack's
    hashed chunk names made a manual read-through inconclusive without a
    configured analyzer, and per Deiby's own call ("feel over score", no
    hard floor) this isn't a gate. Left as a T15 follow-up if he wants the
    number.

- [x] T15 — Full verification: `npm run build && npm run lint && npx tsc
  --noEmit`, manual visual review by Deiby on `/es` and `/en` (desktop +
  mobile), traceability matrix pass [S] — implements all ACs — Depends on:
  T12, T13, T14
  - Done when: build/lint/tsc are green and Deiby has approved the visual
    result in-browser.

## Post-review fixes (`/simplify` + `/code-review medium`, before PR)

- `/simplify` (4 parallel agents): deduplicated `gsap.registerPlugin(ScrollTrigger)`
  into `utils.ts` module scope; replaced one-time mount-only breakpoint checks
  in `hero.ts`/`howItWorks.ts` with `gsap.matchMedia()` (real bug fix — the
  old checks weren't reactive to resize, so crossing the breakpoint after
  mount could leave GSAP in the wrong state); extracted a shared
  `useGsapScope` hook; made `HeroMockup` reuse `Card` instead of
  reimplementing its border/radius/padding; parallelized `HeroSection`'s
  `getTranslations` calls; gated the Hero idle-float tween so it pauses when
  scrolled out of view.
- `/code-review medium`: 3 findings. One false positive (flagged the final
  copy in `messages/*.json` as an AI-authored-copy violation — it's Deiby's
  own copy, applied verbatim per his explicit instruction earlier in this
  session; the reviewer runs with no chat history so couldn't know that —
  real takeaway is the PR body needs to attribute copy authorship clearly).
  Two real, fixed: (1) the HowItWorks progress dots animated
  `backgroundColor` inside the scrubbed timeline, violating AC-09's
  transform/opacity-only rule — restructured into a two-layer opacity-only
  indicator, `DOT_ACTIVE_COLOR`/`DOT_INACTIVE_COLOR` removed; (2) GSAP's
  initial hidden/absolute state was only applied inside `useEffect`, after
  the browser had already painted the plain SSR markup — a visible flash on
  every JS-enabled load. Fixed by switching `useGsapScope` to an isomorphic
  `useLayoutEffect` (runs before paint on the client, safely falls back to
  `useEffect` during SSR).

Task sizes: S (<1h) | M (1-3h) | L (3-6h, consider splitting)
`[P]` = can run in parallel with other `[P]` tasks at the same dependency level.
