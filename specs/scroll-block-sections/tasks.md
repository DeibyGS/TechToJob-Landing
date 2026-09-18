## Tasks: scroll-block-sections

### Status: DRAFT
### Spec: `specs/scroll-block-sections/spec.md`
### Plan: `specs/scroll-block-sections/plan.md`

---

### PR 1 — Infrastructure + Tournaments

#### Task 1.1: Add section background system to globals.css [S]
- Add CSS custom properties for section backgrounds under `:root`
- Add `.section-hero`, `.section-howitworks`, `.section-talent`, `.section-company`, `.section-tournaments`, `.section-networking`, `.section-news`, `.section-newsletter`, `.section-closing` classes
- Add gradient transition pseudo-elements (using `::before` or `::after` on sections)
- Add `prefers-reduced-motion` overrides
- **Files:** `src/app/globals.css`
- **Verify:** `npm run build` passes

#### Task 1.2: Add scroll-snap to main container [S]
- Add `scroll-snap-type: y proximity` to `<main>` element
- Add `scroll-snap-align: start` to each `<section>` inside main
- Add `scroll-padding-top` to account for fixed header
- Add `prefers-reduced-motion` override that disables snap
- **Files:** `src/app/globals.css`
- **Verify:** `npm run build` passes; scroll snaps to sections in browser

#### Task 1.3: Extend Reveal.tsx with variants [M]
- Add `variant` prop: `'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger'`
- Add `stagger` prop for delay between children (default: 100ms)
- Add `parallax` prop for subtle Y offset on scroll
- Implement each variant using motion's `variants` + `staggerChildren`
- Maintain `useReducedMotion()` gate
- **Files:** `src/components/ui/Reveal.tsx`
- **Verify:** `npx tsc --noEmit` passes; existing Reveal usage unchanged

#### Task 1.4: Create GSAP animation for Tournaments [L]
- Create `src/components/animations/tournaments.ts`
- Implement ScrollTrigger pin+scrub pattern (same structure as `howItWorks.ts`)
- Adapt for tournament-specific content (states/rounds)
- Register ScrollTrigger plugin
- Export `initTournamentsScroll` function
- **Files:** `src/components/animations/tournaments.ts` (NEW)
- **Verify:** `npx tsc --noEmit` passes

#### Task 1.5: Upgrade TournamentsStage.tsx to GSAP [L]
- Remove all `motion`/`useScroll`/`useTransform` usage
- Import and call `initTournamentsScroll` from `tournaments.ts`
- Add GSAP ref setup with `useGsapScope` hook
- Add `prefers-reduced-motion` bypass
- **Files:** `src/components/sections/TournamentsStage.tsx`
- **Verify:** `npx tsc --noEmit` passes; Tournaments scroll-scrubs correctly

#### Task 1.6: Add section backgrounds to TournamentsSection [S]
- Add section background class to TournamentsSection wrapper
- Add decorative elements (if applicable)
- **Files:** `src/components/sections/TournamentsSection.tsx`
- **Verify:** `npm run build` passes

#### Task 1.7: Validate PR 1 [S]
- Run `npm run build && npm run lint && npx tsc --noEmit`
- Manually test scroll-snap behavior
- Manually test Tournaments pin+scrub
- Test `prefers-reduced-motion`
- **Files:** none (validation only)
- **Verify:** All checks green

---

### PR 2 — Section Enhancements

#### Task 2.1: Add section backgrounds to all 6 sections [S]
- Apply section background classes to Talent, Company, Networking, News, Newsletter, Closing
- Add any needed decorative wrapper elements
- **Files:** `src/components/sections/TalentSection.tsx`, `CompanySection.tsx`, `NetworkingSection.tsx`, `NewsSection.tsx`, `NewsletterSection.tsx`, `ClosingSection.tsx`
- **Verify:** `npm run build` passes; each section has distinct background

#### Task 2.2: Enhance TalentSection with stagger+parallax Reveal [S]
- Replace basic `Reveal` with extended variant (stagger children + parallax)
- Configure appropriate delay and distance
- **Files:** `src/components/sections/TalentSection.tsx`
- **Verify:** `npm run build` passes; content staggers in on scroll

#### Task 2.3: Enhance CompanySection with counter animation + parallax [M]
- Add scroll-triggered counter animation for stats/numbers
- Use Reveal scale variant for company logos/cards
- Add subtle parallax on decorative elements
- **Files:** `src/components/sections/CompanySection.tsx`
- **Verify:** `npm run build` passes; counters animate on scroll

#### Task 2.4: Enhance NetworkingSection with parallax elements [S]
- Add parallax decorative elements (dots, lines, shapes)
- Use Reveal fade variant for main content
- **Files:** `src/components/sections/NetworkingSection.tsx`
- **Verify:** `npm run build` passes

#### Task 2.5: Enhance NewsSection with stagger card reveal [S]
- Use Reveal stagger variant for news cards grid
- Configure 80-120ms delay between cards
- **Files:** `src/components/sections/NewsSection.tsx`
- **Verify:** `npm run build` passes; cards stagger in

#### Task 2.6: Enhance NewsletterSection with background transition + form reveal [S]
- Apply dark background class
- Use Reveal scale variant for form emphasis
- **Files:** `src/components/sections/NewsletterSection.tsx`
- **Verify:** `npm run build` passes

#### Task 2.7: Enhance ClosingSection with dramatic CTA reveal [S]
- Apply dramatic dark gradient background
- Use Reveal variant with larger distance/duration for impact
- **Files:** `src/components/sections/ClosingSection.tsx`
- **Verify:** `npm run build` passes

#### Task 2.8: Improve HeroStage exit transition [M]
- Extend `hero.ts` animation to include scroll-linked exit
- Add opacity + translateY tween tied to scroll position
- Content fades/slides out as user scrolls past hero
- **Files:** `src/components/animations/hero.ts`, `src/components/sections/HeroStage.tsx`
- **Verify:** `npm run build` passes; hero content exits smoothly on scroll

#### Task 2.9: Improve HowItWorksStage background transitions [M]
- Extend `howItWorks.ts` to include background color tween
- Background shifts subtly as user scrubs through steps
- **Files:** `src/components/animations/howItWorks.ts`, `src/components/sections/HowItWorksStage.tsx`
- **Verify:** `npm run build` passes; background changes per step

#### Task 2.10: Update smoothScroll.ts for sync [S]
- Verify Lenis config works with scroll-snap
- Add any needed scroll-snap reset for reduced-motion
- **Files:** `src/components/animations/smoothScroll.ts`
- **Verify:** `npm run build` passes; smooth scroll + snap coexist

#### Task 2.11: Update ADR-002 status [S]
- Change status from "Proposed" to "Accepted"
- Add implementation date
- **Files:** `docs/adr/ADR-002-scroll-block-sections.md`
- **Verify:** File updated

#### Task 2.12: Final validation [S]
- Run `npm run build && npm run lint && npx tsc --noEmit`
- Test all 9 sections on desktop and mobile
- Test `prefers-reduced-motion` on all sections
- Test both `/es` and `/en` locales
- **Files:** none (validation only)
- **Verify:** All checks green, all sections visually distinct and animated

---

### Dependency Graph

```
1.1 (CSS backgrounds) ──┐
1.2 (scroll-snap)    ───┤
1.3 (Reveal variants) ──┼── 1.7 (Validate PR1)
1.4 (tournaments.ts) ───┤
1.5 (TournamentsStage) ─┤
1.6 (Tournaments bg)  ──┘
                          │
                          ▼
2.1 (All section bgs) ───┐
2.2 (Talent)          ───┤
2.3 (Company)         ───┤
2.4 (Networking)      ───┼── 2.12 (Final validation)
2.5 (News)            ───┤
2.6 (Newsletter)      ───┤
2.7 (Closing)         ───┤
2.8 (Hero exit)       ───┤
2.9 (HowItWorks bg)   ───┤
2.10 (smoothScroll)   ───┤
2.11 (ADR-002)        ───┘
```

Tasks 2.2-2.11 are all independent of each other (can be done in any order or parallel) but all depend on 2.1 being done first.
