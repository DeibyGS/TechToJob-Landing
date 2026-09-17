## Spec: Cinematic Motion — Remaining Sections (Phase 2)

### Status: DRAFT
### Version: 1.0

### Recovered context
- Project constitution (`docs/constitution.md`): `motion` is the only animation
  library for non-flagship sections; GSAP is reserved for sections with real
  pin/scrub choreography (currently Hero + HowItWorks from Phase 1). Phase 2
  keeps `motion` only — no GSAP addition.
- `AGENTS.md`: no hardcoded user-facing copy in `.tsx`; everything through
  `messages/{es,en}.json`; no new external dependencies without updating
  constitution first.
- Phase 1 spec (`specs/002-cinematic-motion-hero-howitworks/spec.md`):
  established the hybrid animation stack, AC-09 (transform+opacity only),
  `prefers-reduced-motion` rules, and the `Reveal.tsx` baseline. All apply here.
- ADR-001 (`docs/adr/ADR-001-hybrid-motion-gsap-stack.md`): documents the
  hybrid stack decision. Phase 2 does not change this ADR — it extends the
  `motion` side of the stack, not the GSAP side.
- No relevant Engram decisions beyond Phase 1 discoveries (GSAP matchMedia
  reactivity, useLayoutEffect pre-paint flash, AC-09 backgroundColor violation).

### What does it do?
Brings the remaining 8 landing-page sections (Talent, Company, Tournaments,
Networking, News, Newsletter, Closing, Footer) up to the same motion quality
bar established by Phase 1, using only the `motion` library. Each section gains
scroll-linked entrance animations that are richer than the current plain `Reveal`
fade — including staggered reveals, coordinated sequences, and in the case of
Tournaments, a scroll-scrubbed 3-step narrative on desktop. The Hero and
HowItWorks sections are untouched (they keep their GSAP treatment from Phase 1).

### What files does it touch?
| File | Action | Reason |
|------|--------|--------|
| `src/components/sections/TalentSection.tsx` | MODIFY | Enhanced entrance: staggered headline → description → bullets → card |
| `src/components/sections/CompanySection.tsx` | MODIFY | Mirror of Talent treatment (reversed grid order) |
| `src/components/sections/TournamentsSection.tsx` | MODIFY | Convert to Client Component for scroll-scrub |
| `src/components/sections/TournamentsStage.tsx` | CREATE | Client wrapper hosting the scroll-scrub animation logic |
| `src/components/animations/tournaments.ts` | CREATE | Scroll-scrub init function using `useScroll`/`useTransform` |
| `src/components/sections/NetworkingSection.tsx` | MODIFY | Staggered channel-tag reveal |
| `src/components/sections/NewsSection.tsx` | MODIFY | Featured card emphasis + staggered secondary cards |
| `src/components/sections/NewsletterSection.tsx` | MODIFY | Headline → description → form reveal sequence |
| `src/components/sections/ClosingSection.tsx` | MODIFY | Coordinated headline + CTA entrance |
| `src/components/sections/FooterSection.tsx` | MODIFY | Optional: subtle column stagger (or keep static) |

### Dependencies
- Reused components: `Reveal` (baseline), `Card`, `SectionContainer`, `BulletList`, `DefinitionRow`
- Animation library: `motion` (ex-Framer Motion) — already installed, no new deps
- Hooks used: `useScroll`, `useTransform`, `useInView`, `useReducedMotion` from `motion/react`
- No GSAP, no ScrollTrigger, no Lenis additions

### Acceptance criteria

#### General (all sections)
- `[MUST]` AC-G1: Every entrance animation introduced by this feature SHALL
  animate only `transform` and `opacity` CSS properties — no `backgroundColor`,
  `width`, `height`, `top`, `left`, `margin`, or `padding`.
- `[MUST]` AC-G2: WHILE the user's OS has `prefers-reduced-motion: reduce`
  enabled, THE system SHALL disable all scroll-linked and entrance animations —
  all content SHALL remain fully visible and readable without depending on
  scroll position or animation state.
- `[MUST]` AC-G3: WHEN JavaScript fails to load or execute, every section
  SHALL still display its full text content in reading order — content must
  never be hidden behind an animation's initial state.
- `[MUST]` AC-G4: THE system SHALL NOT modify `Reveal.tsx` — it continues to
  serve as the baseline reveal for any section not covered by this spec.
- `[MUST]` AC-G5: THE system SHALL NOT add GSAP, ScrollTrigger, or any new
  dependency to achieve the animations in this spec — only `motion` (already
  installed) is used.
- `[MUST]` AC-G6: WHEN a user switches locale (es↔en) after the page has
  loaded, THE system SHALL handle any height changes from translated text
  without breaking animation state or causing layout jumps.

#### Sub-fase 2A — Talent + Company
- `[MUST]` AC-2A1: WHEN the Talent section enters the viewport, THE system
  SHALL reveal its elements in a staggered sequence: headline → description →
  bullet list → example card, each with a perceptible delay.
- `[MUST]` AC-2A2: WHEN the Company section enters the viewport, THE system
  SHALL reveal its elements in a staggered sequence: headline → description →
  bullet list → example card (mirrored grid order preserved).
- `[MUST]` AC-2A3: THE system SHALL NOT pin or scrub the Talent or Company
  sections — entrance-only animation, no scroll-linked behavior.
- `[SHOULD]` AC-2A-S1: THE system should apply a subtle vertical parallax
  offset to the example card in Talent/Company — the card scrolls at a
  slightly different rate than the text content, creating depth.
- `[SHOULD]` AC-2A-S2: THE stagger delay between elements should be
  approximately 80–120ms, adjustable without code duplication.

#### Sub-fase 2B — Tournaments (flagship)
- `[MUST]` AC-2B1: WHILE viewport width is 1024px or greater AND the user
  has not enabled reduced motion, WHEN the user scrolls through the
  Tournaments section, THE system SHALL display the 3 steps (Reto, Entrega,
  Jurado) in a scroll-scrubbed sequence — each step fades/translates in as
  scroll progresses, synchronized to scroll position.
- `[MUST]` AC-2B2: THE system SHALL use `useScroll` from `motion/react` to
  track scroll progress through the Tournaments section container, and
  `useTransform` to map scroll progress to per-step opacity and vertical offset.
- `[MUST]` AC-2B3: THE scroll-scrubbed animation SHALL divide the scroll
  progress into 3 roughly equal phases — step 1 visible at ~0–33%, step 2
  at ~33–66%, step 3 at ~66–100%.
- `[MUST]` AC-2B4: WHEN a user scrolls upward through the Tournaments
  section, the animation SHALL reverse coherently — steps fade out in reverse
  order matching the current scroll position, with no jump or flash.
- `[MUST]` AC-2B5: WHILE viewport width is below 1024px, THE Tournaments
  section SHALL use a sequential per-step reveal-on-view animation (the
  existing `Reveal` pattern) instead of scroll-scrub — matching HowItWorks'
  mobile fallback from Phase 1.
- `[MUST]` AC-2B6: THE Tournaments section SHALL be converted from a Server
  Component to a Client Component (or use a Client Component wrapper) to
  access `useScroll`/`useTransform` hooks.
- `[MUST]` AC-2B7: THE scroll-scrub animation SHALL NOT block or delay the
  initial paint of the Tournaments headline and description — those elements
  should be visible immediately; only the step cards animate on scroll.
- `[SHOULD]` AC-2B-S1: THE system should use `useSpring` or equivalent
  smoothing on the scroll-progress mapping to avoid jittery step transitions
  during fast scrolling.
- `[SHOULD]` AC-2B-S2: THE active step card should have a subtle scale or
  opacity emphasis (e.g. opacity 1 for active, 0.3 for inactive) to make the
  current step visually distinct.
- `[COULD]` AC-2B-C1: THE system could add a subtle horizontal slide (x
  offset) to entering steps for additional depth, still within the
  transform-only constraint.

#### Sub-fase 2C — Networking, News, Newsletter, Closing, Footer
- `[MUST]` AC-2C1: WHEN the Networking section enters the viewport, THE
  system SHALL reveal channel tags with a staggered delay — each tag appears
  sequentially, not all at once.
- `[MUST]` AC-2C2: WHEN the News section enters the viewport, THE system
  SHALL reveal the featured card (first item) with a slightly more prominent
  entrance than the secondary cards, which stagger in.
- `[MUST]` AC-2C3: WHEN the Newsletter section enters the viewport, THE
  system SHALL reveal headline → description → form in sequence.
- `[MUST]` AC-2C4: WHEN the Closing section enters the viewport, THE system
  SHALL reveal headline and CTA button in a coordinated entrance.
- `[MUST]` AC-2C5: THE Footer section SHALL either remain static (no
  animation) or use a subtle single-stage reveal — no staggered or
  scroll-linked animation.
- `[SHOULD]` AC-2C-S1: ALL 2C sections should use `Reveal` with custom
  `variants` or sequential `Reveal` instances rather than introducing new
  client-side animation code.

### Explicit assumptions
- The current `Reveal` component works via `whileInView` from `motion` —
  sub-fase 2C sections can enhance it with `variants` or chained `Reveal`
  instances without creating new client components.
- Tournaments' scroll-scrub requires `useScroll`/`useTransform` (client hooks)
  — the section must become a Client Component or use a client wrapper, same
  pattern as `HeroStage.tsx` / `HowItWorksStage.tsx` from Phase 1.
- The 1024px breakpoint for Tournaments' desktop treatment matches the
  `MEDIA_DESKTOP_UP` constant already defined in `animations/utils.ts`.
- No new i18n keys are needed — all copy already exists in `messages/*.json`.
- Footer animation is optional and low-priority — if it adds complexity
  without visible benefit, keep it static.

### Edge cases / risks
- Tournaments scroll-scrub on very short viewports (landscape mobile > 1024px):
  pin duration may feel disproportionately long → mitigate by setting a
  minimum section height or limiting scrub range.
- Locale switch after mount changes rendered text height → scroll-trigger
  measurements may drift → use `ScrollTrigger.refresh()` equivalent or
  `useEffect` dependency on locale to recalculate.
- `Reveal` with `variants` may conflict with existing `delay` prop usage →
  test each section to ensure stagger timing is additive, not overridden.

### Task breakdown (execution order)
1. Create spec.md (this file) [S]
2. Create plan.md — animation patterns, component changes, file map [M]
3. Sub-fase 2A: Enhance Talent + Company entrance animations [M]
4. Sub-fase 2B: Build Tournaments scroll-scrub (client wrapper + animation) [L]
5. Sub-fase 2C: Enhance Networking, News, Newsletter, Closing reveals [M]
6. Validate: build + lint + tsc + visual review [S]

### Out of scope
- `[WONT]` Modifying Hero or HowItWorks sections (Phase 1, already shipped).
- `[WONT]` Adding GSAP, ScrollTrigger, or any new animation dependency.
- `[WONT]` Modifying `Reveal.tsx` — it stays as the baseline reveal wrapper.
- `[WONT]` New marketing copy or i18n key changes.
- `[WONT]` Automated visual regression or animation tests.
- `[WONT]` Canvas, WebGL, or video-based animations.
- `[WONT]` Formspree config, Vercel deploy, or domain changes.

### Open questions
- None — all clarified by user input (sub-fases, Option A motion-only, Tournaments
  as flagship, no tests).
