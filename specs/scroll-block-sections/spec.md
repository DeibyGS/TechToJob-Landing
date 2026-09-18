## Spec: scroll-block-sections

### Status: DRAFT
### Version: 1.0

### Recovered context
- Project constitution: `docs/constitution.md` v1.2.0 — Animation Stack section
- Relevant ADRs: `docs/adr/ADR-001-hybrid-motion-gsap-stack.md`, `docs/adr/ADR-002-scroll-block-sections.md`
- Corrected assumptions: all 5 assumptions surface-approved by user (see conversation)

### What does it do? (observable behavior, not implementation)
Each of the 9 sections inside `<main>` renders as a visually distinct scroll "block" with its own background treatment and entrance animation. Sections with ordered internal content (Hero, HowItWorks, Tournaments) advance through states as the user scrolls (pin+scrub). Sections without ordered content (Talent, Company, Networking, News, Newsletter, Closing) settle into view via CSS scroll-snap with rich reveal animations. Transitions between sections feel fluid and intentional — no abrupt jumps, no uniform whitespace gaps.

### What files does it touch?
| File | Action | Reason |
|------|--------|--------|
| `src/app/globals.css` | MODIFY | Add scroll-snap container, section background variables, transition gradients, reduced-motion overrides |
| `src/components/sections/TournamentsStage.tsx` | MODIFY | Upgrade from motion useScroll to GSAP pin+scrub (per ADR-002 Phase 2a) |
| `src/components/sections/TalentSection.tsx` | MODIFY | Add rich Reveal variant (stagger + parallax) |
| `src/components/sections/CompanySection.tsx` | MODIFY | Add scroll-triggered counter animation + parallax |
| `src/components/sections/NetworkingSection.tsx` | MODIFY | Add parallax decorative elements + stagger reveal |
| `src/components/sections/NewsSection.tsx` | MODIFY | Add stagger card reveal + background parallax |
| `src/components/sections/NewsletterSection.tsx` | MODIFY | Add background transition + form reveal |
| `src/components/sections/ClosingSection.tsx` | MODIFY | Add dramatic CTA reveal |
| `src/components/sections/HeroStage.tsx` | MODIFY | Add exit transition (parallax + fade on scroll-out) |
| `src/components/sections/HowItWorksStage.tsx` | MODIFY | Add background color transition between steps |
| `src/components/animations/smoothScroll.ts` | MODIFY | Ensure Lenis ↔ GSAP ↔ scroll-snap sync |
| `src/components/ui/Reveal.tsx` | MODIFY | Extend with new reveal variants (stagger, parallax, scale) |
| `src/app/[locale]/page.tsx` | READ | Verify section order and wrapper structure |
| `docs/adr/ADR-002-scroll-block-sections.md` | MODIFY | Update status from Proposed to Accepted |

### Dependencies
- APIs / endpoints used: none
- DB tables / relevant RLS: none
- Auth pattern: none
- Reused components: `Reveal.tsx`, `SectionContainer`, GSAP animations (`hero.ts`, `howItWorks.ts`), Lenis smooth scroll

### Acceptance criteria

#### EARS format (for technical/system requirements):
- `[MUST]` The system shall apply `scroll-snap-type: y proximity` to the `<main>` scroll container
- `[MUST]` The system shall apply `scroll-snap-align: start` to each `<section>` element inside `<main>`
- `[MUST]` WHEN `prefers-reduced-motion: reduce` is active THE system SHALL disable scroll-snap, pin, scrub, and parallax effects while keeping content fully usable
- `[MUST]` The system shall assign each section a distinct background treatment (solid color, gradient, or pattern) that differs from its adjacent sections
- `[MUST]` THE system shall render visual transitions between sections using gradient crossfades or decorative elements, not hard borders
- `[SHOULD]` WHEN a section with ordered internal content (Hero, HowItWorks, Tournaments) enters the viewport THE system SHALL animate its internal content through ordered states via GSAP pin+scrub
- `[SHOULD]` WHEN a section without ordered content (Talent, Company, Networking, News, Newsletter, Closing) enters the viewport THE system SHALL reveal its content using Reveal variants (fade-up, stagger, parallax, scale) triggered by IntersectionObserver
- `[SHOULD]` The system shall complete all entrance animations within 600ms of the section entering the viewport
- `[COULD]` WHERE a section has decorative elements THE system SHALL apply subtle parallax movement to those elements on scroll
- `[COULD]` THE system shall use staggered reveals for lists/grids of items (cards, stats, logos) with 80-120ms delay between items

#### Given/When/Then (for user stories):
- `[MUST]` Given the user is at the top of the page, When they scroll down to the HowItWorks section, Then the section background transitions smoothly from the Hero's dark theme to HowItWorks' lighter theme
- `[MUST]` Given the user is scrolling through Tournaments, When they reach the section, Then the content advances through tournament states (1→2→3) as they scroll, pinning the section in place
- `[MUST]` Given the user scrolls to the Talent section, When the section enters the viewport, Then its content elements reveal with staggered timing (not all at once)
- `[MUST]` Given the user has `prefers-reduced-motion` enabled, When they scroll through any section, Then all animations are disabled and sections scroll normally without snap, pin, or parallax
- `[SHOULD]` Given the user is on mobile (viewport < 768px), When they scroll, Then the scroll-snap behavior is less aggressive (proximity mode) to avoid frustrating small-scroll gestures
- `[SHOULD]` Given the user scrolls back up to a previous section, When the section re-enters the viewport, Then its entrance animation replays (not stuck in final state)

### Explicit assumptions
- We assume GSAP pin+scrub is only for sections with ordered internal state (Hero, HowItWorks, Tournaments) per ADR-002 → if a section gains ordered state later, it can be upgraded to GSAP with a constitution update
- We assume scroll-snap on `<main>` does not break Lenis smooth scroll → Lenis scrolls the document body, scroll-snap applies to `<main>`, they operate at different levels; the canonical Lenis+GSAP wiring already handles this
- We assume CSS scroll-snap `proximity` mode is better than `mandatory` for a landing page → mandatory can cause frustrating over-snapping on short scroll gestures; proximity is more forgiving
- We assume no new npm dependencies are needed → everything achievable with existing GSAP + motion + Lenis + CSS

### Non-functional requirements
- Performance: All scroll animations shall maintain 60fps on mid-range mobile devices (2024 baseline); no layout thrashing from animation code
- Accessibility: `prefers-reduced-motion: reduce` disables all scroll-linked animations; all content remains fully readable and navigable without animation
- Bundle size: No new JavaScript dependencies; GSAP code stays dynamically imported per ADR-001

### Edge cases / risks
- Lenis + scroll-snap conflict → Mitigated by Lenis scrolling the document body while scroll-snap applies to `<main>`; test with actual scroll behavior
- Tournaments GSAP upgrade breaks existing motion-based animations → Mitigated by rewriting TournamentsStage.tsx entirely (not mixing GSAP and motion on same DOM)
- Scroll-snap causes frustrating UX on mobile with short content sections → Mitigated by using `proximity` mode (not `mandatory`) and testing on real devices
- Too many simultaneous ScrollTrigger instances cause jank → Mitigated by max 3 pinned ScrollTrigger instances (Hero, HowItWorks, Tournaments); other sections use lightweight IntersectionObserver

### Task breakdown (execution order)
1. Create Reveal variants system (extend Reveal.tsx with stagger, parallax, scale) [M]
2. Add section background system to globals.css (variables, gradients, transitions) [S]
3. Add scroll-snap to main container in globals.css + reduced-motion overrides [S]
4. Upgrade TournamentsStage.tsx from motion to GSAP pin+scrub [L]
5. Improve HeroStage.tsx with exit transition [M]
6. Improve HowItWorksStage.tsx with background transitions between steps [M]
7. Enhance TalentSection.tsx with stagger+parallax Reveal [S]
8. Enhance CompanySection.tsx with counter animation + parallax [M]
9. Enhance NetworkingSection.tsx with parallax decorative elements [S]
10. Enhance NewsSection.tsx with stagger card reveal [S]
11. Enhance NewsletterSection.tsx with background transition + form reveal [S]
12. Enhance ClosingSection.tsx with dramatic CTA reveal [S]
13. Update smoothScroll.ts for Lenis ↔ scroll-snap sync [S]
14. Update ADR-002 status to Accepted [S]
15. Run build + lint + typecheck validation [S]

### Out of scope
- `[WONT]` Adding GSAP pin+scrub to sections without ordered internal state (Talent, Company, Networking, News, Newsletter, Closing) — per ADR-002
- `[WONT]` Installing new animation libraries or dependencies
- `[WONT]` Changing the section order in page.tsx
- `[WONT]` Modifying section content or i18n message keys
- `[WONT]` Adding navigation indicators (dots, progress bar) — user explicitly declined

### Open questions
- None — all assumptions resolved via user approval
