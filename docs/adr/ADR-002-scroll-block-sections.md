# ADR-002: Scroll-block sections beyond Hero/HowItWorks

## Status
Proposed — 2026-09-18

## Context
`ADR-001` scoped GSAP core + `ScrollTrigger` + Lenis pin/scrub choreography to
Hero and HowItWorks only ("Phase 1"), explicitly flagging that any extension
to a new section requires updating `docs/constitution.md` and, if
architecturally significant, a new ADR (`docs/constitution.md:33-36`).

Deiby wants the rest of the landing to eventually read as distinct
scroll-driven "blocks" — the pattern he described (a block's internal content
advancing 1→2→3 as the user scrolls, before releasing to the next section)
already exists in the codebase for `HowItWorksStage` (pin+scrub, desktop
only). The question this ADR resolves: does that same pin+scrub pattern
belong on all 9 sections, or only some of them?

An audit of `src/components/sections/*.tsx` (line counts + presence of a
`*Stage.tsx` companion, the existing signal for "structured, multi-state
visual content") found:

- **Sections with real internal state to scrub**: `HeroSection`/`HeroStage`
  (done), `HowItWorksSection`/`HowItWorksStage` (done), `TournamentsSection`/
  `TournamentsStage.tsx` (108 lines, already uses `motion`'s `useScroll` —
  the closest existing candidate for a GSAP pin/scrub upgrade).
- **Single-block sections with no internal steps** (21-61 lines each, no
  `Stage.tsx`): `TalentSection`, `CompanySection`, `NetworkingSection`,
  `NewsSection`, `NewsletterSection`, `ClosingSection`. Nothing about their
  content has an ordered sequence to advance through.

## Decision
Extend the Animation Stack's GSAP scope in two different ways depending on
what a section's content actually needs — not uniformly:

1. **`TournamentsSection` gets the same GSAP pin+scrub pattern as
   HowItWorks** (Phase 2a): pin the section, scrub its `TournamentsStage`
   through its states as the user scrolls, release to the next section.
   Reuses the proven `HowItWorksStage` implementation as a template.
2. **The 6 single-block sections get a lighter "block entrance" pattern**
   (Phase 2b), not pin/scrub: CSS `scroll-snap` (`scroll-snap-type: y` on the
   scroll container, `scroll-snap-align: start` per `<section>`) so each
   section settles fully into view, combined with the *existing* `Reveal`
   `whileInView` component for their entrance animation — no new GSAP
   instances. This is a `motion`-only change, no constitution update needed
   for these 6 sections' animation library, only the scroll-snap CSS
   addition.
3. GSAP pin/scrub stays reserved for sections whose content has genuine
   ordered internal state (Hero, HowItWorks, Tournaments) — not applied
   uniformly to all 9 sections.

`docs/constitution.md`'s Animation Stack section is amended alongside this
ADR to record Tournaments as an approved GSAP pin/scrub section, and to
document the CSS `scroll-snap` addition for the remaining sections.

## Consequences

**Positive**
- Matches tool cost to actual content shape — only 3 of 9 sections carry the
  overhead of a pinned `ScrollTrigger` instance, not all 9.
- Reuses a proven pattern (`HowItWorksStage`) for Tournaments instead of
  inventing a new one.
- CSS `scroll-snap` for the other 6 sections is native, has no JS runtime
  cost, and degrades gracefully (still respects `prefers-reduced-motion` via
  `Reveal`'s existing `useReducedMotion()` gate).

**Negative**
- Two distinct "block" behaviors now exist on the same page (pin+scrub vs.
  snap+reveal) — a future contributor needs to know which sections are which
  and why. Mitigated by this ADR + the constitution's classification table.
- `TournamentsSection` implementation is new work, not a copy-paste — its
  `Stage.tsx` content differs from HowItWorks's 3-step structure and needs
  its own choreography design.

**Neutral**
- Total pinned `ScrollTrigger` instance count on the page goes from 2 to 3
  (Hero doesn't pin, it only scrubs an exit; HowItWorks pins; Tournaments
  would pin) — worth a perf smoke-check (Lighthouse / real mid-range mobile)
  once Tournaments ships, not before.

## Alternatives considered
1. **GSAP pin+scrub on all 9 sections** — rejected: 6 of the 9 sections have
   no internal ordered state to scrub through, so pinning them would be
   animating for its own sake (`docs/DESIGN.md`'s "no decoration-only
   motion" rule) and adds pinned-`ScrollTrigger` overhead with no narrative
   payoff. Also the highest scroll-jank risk on mid-range mobile of the
   options considered.
2. **CSS `scroll-snap` everywhere, no GSAP expansion** — rejected: doesn't
   deliver what Deiby actually asked for (the "1→2→3 as you scroll" internal
   advance) for Tournaments, which does have real step-like content worth
   scrubbing, same as HowItWorks.
3. **Mixed: pin+scrub where content has steps, snap+reveal where it doesn't
   (chosen)** — best fit: content shape decides the pattern per section,
   keeps the constitution's "justify GSAP per section" discipline from
   ADR-001 intact, and reuses working code (`HowItWorksStage`) rather than
   inventing a new mechanism.

## Rollout (tracked outside this ADR)
Implementation is out of scope for this document and for the Hero-polish PR
that prompted it — it requires its own `/sdd` spec (mandatory for
architectural work per `~/.claude/rules/pre-spec-questions.md`) and, given
the project's 500-line PR budget, a `/chained-pr` split: Tournaments
pin/scrub first (closest to existing pattern), then the 6 snap+reveal
sections as one or two grouped follow-up PRs.
