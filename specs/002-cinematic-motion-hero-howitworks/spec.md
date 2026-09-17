# Spec: Cinematic Motion — Hero & HowItWorks (Phase 1)

### Status: IMPLEMENTED
### Version: 1.0

### Recovered context
- Project constitution (`docs/constitution.md`): static-first, Server Components by
  default (client only when interactivity is required — currently only the
  newsletter form and the `Reveal` scroll-reveal wrapper), `motion` (ex-Framer
  Motion) is the only approved animation library, no dynamic data/CMS, one
  external integration point (Formspree), no invented statistics in copy.
- `AGENTS.md`: no hardcoded user-facing copy in `.tsx` — everything through
  `messages/{es,en}.json`; Deiby writes final marketing copy, agents leave
  `[TODO]` placeholders; no new external dependency without updating the
  constitution first.
- No prior ADRs exist in this project (`docs/adr/` did not exist before this
  feature). `ADR-001-hybrid-motion-gsap-stack.md` is being created alongside
  this spec to record the animation-stack decision below.
- No relevant Engram decisions found for "animation"/"motion" prior to this
  session.
- Corrected assumptions from Step 2 (confirmed by Deiby, 2026-09-17):
  1. Phase 1 scope = Hero + HowItWorks + shared animation infra only. The
     other 8 sections keep their current `Reveal` fade and get their own
     spec(s) later.
  2. `Reveal.tsx` is not modified — it keeps serving every non-flagship
     section, including HowItWorks below the `lg` breakpoint (mobile
     fallback).
  3. The Hero's community mockup is 100% static illustration (SVG/CSS/React),
     no real Discord data, no Discord trademarked chrome, built from existing
     brand tokens.
  4. No new marketing copy in this spec beyond small illustrative UI
     micro-copy inside the mockup (channel names, sender labels, message
     snippets) — added as new `[TODO]` keys in `messages/{es,en}.json` for
     Deiby's later pass, same pattern as the rest of the project.
  5. Mobile gets a deliberately different (reduced) choreography, not a
     scaled-down copy of desktop.
  6. `docs/constitution.md` is updated as part of this feature (not a
     separate change) to approve GSAP core, GSAP ScrollTrigger, and Lenis,
     and to document the hybrid `motion` + GSAP rule.
  7. No automated animation tests — this project has no test runner
     configured (`docs/TESTING.md` is a stub). "Done" = build/lint/tsc green
     + Deiby's manual visual review on desktop and mobile, in both locales.
  8. This phase will very likely exceed the 500-line PR budget (new
     `animations/` folder, new mockup component, two rewritten sections, new
     deps, constitution update) — it executes as chained PRs via
     `/chained-pr`, not as a single PR.

### What does it do?
Transforms the Hero and HowItWorks sections of the TechToJob landing page
into a cinematic, scroll-driven experience inspired by the motion *principles*
of Apple product pages (rhythm, depth, staged reveals, scroll-linked
storytelling) — without copying Apple's visual branding. The Hero gains a
staged entrance sequence built around a new illustrated "community mockup"
visual, and HowItWorks becomes a pinned, scroll-scrubbed 3-step narrative on
larger screens. Every other section is unaffected in this phase. The
experience must degrade gracefully: fully usable with JavaScript disabled or
failed, fully usable with `prefers-reduced-motion` enabled, and fully usable
on mobile with a simpler, purpose-built (not scaled-down) animation.

### Boundaries
**Always do:**
- Respect `prefers-reduced-motion: reduce` completely — disable smooth
  scroll, scroll-linked animation, pin/scrub, and any idle/floating motion.
- Keep sections as Server Components except where a new client boundary is
  strictly required for the animation (mirrors the existing `Reveal` pattern).
- Animate only `transform` and `opacity` for anything scroll-linked or
  entrance-related.
- Keep `es`/`en` at full parity — animation code must not embed any copy.
- Reuse existing brand tokens (`globals.css`), the `Sora` font, and existing
  UI primitives (`Button`, `SectionContainer`, `Card`) wherever they fit.

**Ask first (do not proceed unilaterally):**
- Adding any GSAP plugin beyond core + ScrollTrigger (e.g. SplitText,
  Draggable, MorphSVG), even though GSAP plugins are now free.
- Extending pinned/scrubbed treatment to a third section in this same phase.
- Any change to `messages/{es,en}.json` keys that already hold Deiby's final
  copy (Hero headline/subheadline, HowItWorks step titles/descriptions) —
  only new mockup-microcopy keys may be added, as `[TODO]`.

**Never do:**
- Use real Discord screenshots, real usernames/avatars, or Discord's
  trademarked UI chrome in the community mockup.
- Animate `width`, `height`, `top`, `left`, `margin`, or `padding` for
  scroll-linked or entrance effects.
- Ship a pinned/scrubbed HowItWorks on viewports below `1024px` (see AC-07).
- Block initial content paint on GSAP/Lenis loading.
- Invent membership/company statistics or any content not already approved.

### Acceptance criteria

- `[MUST]` AC-01: WHILE the user's OS does not request reduced motion, WHEN
  the user scrolls the landing page, THE system SHALL apply smooth inertial
  scrolling across the page.
- `[MUST]` AC-02: WHEN the Hero section first enters the viewport on page
  load, THE system SHALL reveal the headline, subheadline, CTA, and community
  mockup in a staged sequence (not simultaneously) without causing layout
  shift.
- `[MUST]` AC-03: THE system shall render the Hero's community mockup using
  only static illustrative placeholder content — no real Discord data, no
  real usernames or avatars, no Discord trademarked UI chrome.
- `[MUST]` AC-04: WHEN a user scrolls past the Hero section, THE system SHALL
  visually transition the Hero content out (scale/fade) using only
  `transform` and `opacity`.
- `[MUST]` AC-05: WHILE a user scrolls through the HowItWorks section on a
  viewport 1024px wide or greater, THE system SHALL pin the section's visual
  anchor in place and advance through the 3 steps' copy in sync with scroll
  position.
- `[MUST]` AC-06: Given a user scrolling upward through a scroll-linked
  animation (Hero exit or HowItWorks steps), When the scroll direction
  reverses, Then the animation SHALL reverse coherently to match the current
  scroll position, with no jump or flash of content.
- `[MUST]` AC-07: WHILE viewport width is below 1024px, THE HowItWorks
  section SHALL use a sequential per-step reveal-on-view animation (the
  existing `Reveal` pattern) instead of a pinned/scrubbed timeline.
- `[MUST]` AC-08: WHILE the user's OS has `prefers-reduced-motion: reduce`
  enabled, THE system SHALL disable smooth scrolling, scroll-linked
  animation, pin behavior, and any parallax/floating motion — all content
  SHALL remain fully visible and readable without depending on scroll
  position.
- `[MUST]` AC-09: THE system shall animate only `transform` and `opacity` CSS
  properties for every scroll-linked and entrance animation introduced by
  this feature.
- `[MUST]` AC-10: WHEN this feature is approved, `docs/constitution.md` SHALL
  document GSAP core, GSAP ScrollTrigger, and Lenis as approved dependencies
  and SHALL state the hybrid animation-stack rule (`motion` for simple
  reveals on non-flagship sections; GSAP for pin/scrub on flagship sections).
- `[SHOULD]` AC-S1: WHEN JavaScript fails to load or execute, THE Hero and
  HowItWorks sections SHALL still display their full text content in reading
  order — content must never be hidden behind an animation's initial state.
- `[SHOULD]` AC-S2: THE system should keep GSAP and Lenis code out of the
  initial JS bundle for sections that do not use them.
- `[COULD]` AC-C1: THE Hero mockup could include a subtle idle floating loop
  after its entrance sequence completes, fully paused under reduced motion.

#### Error / edge cases
- `[MUST]` AC-E1: Given a user switches locale (es↔en) after the page has
  loaded, When the translated text changes the rendered height of Hero or
  HowItWorks content, Then the system SHALL refresh scroll-trigger
  measurements so pin/scrub distances stay accurate.
- `[MUST]` AC-E2: Given a user rapidly scrolls (flings) through the pinned
  HowItWorks section, When scroll position changes faster than one animation
  frame, Then the step copy SHALL still land on the correct step for the
  final scroll position, with no visual tearing or stuck intermediate state.

### Edge cases (business-observable)
- User resizes the browser window across the `1024px` breakpoint live
  (desktop) — HowItWorks must correctly switch between pinned and
  sequential-reveal behavior without breaking.
- User lands directly mid-page (e.g. via browser back/forward scroll
  restoration) without the Hero entrance ever playing — HowItWorks pin/scrub
  must still initialize correctly.
- Very short viewport height (e.g. landscape mobile, if it somehow exceeds
  1024px width) — pin duration must not feel disproportionately long relative
  to visible content.

### Out of scope
- `[WONT]` Animating Talent, Company, Tournaments, Networking, News,
  Newsletter, Closing, or Footer — deferred to later phases/specs.
- `[WONT]` Real Discord screenshots, branding, or trademarked UI chrome.
- `[WONT]` New marketing copy beyond mockup UI micro-copy placeholders.
- `[WONT]` Formspree real config, `SITE_URL`/domain update, or Vercel deploy
  — explicitly paused for the duration of this phase.
- `[WONT]` Canvas, WebGL, or frame-by-frame video/image-sequence treatment.
- `[WONT]` Automated animation or visual-regression tests.
- `[WONT]` GSAP plugins beyond core + ScrollTrigger.
