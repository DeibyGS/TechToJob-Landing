## Plan: scroll-block-sections

### Status: DRAFT
### Spec: `specs/scroll-block-sections/spec.md`

### Architecture Overview

The implementation follows ADR-002's dual-pattern approach:

```
┌─────────────────────────────────────────────────────┐
│  <main>  scroll-snap-type: y proximity              │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ HeroSection          GSAP scrub (exit)      │    │
│  │ background: dark gradient                   │    │
│  └─────────────────────────────────────────────┘    │
│         ↕ gradient transition                        │
│  ┌─────────────────────────────────────────────┐    │
│  │ HowItWorksSection    GSAP pin+scrub         │    │
│  │ background: light neutral                   │    │
│  └─────────────────────────────────────────────┘    │
│         ↕ gradient transition                        │
│  ┌─────────────────────────────────────────────┐    │
│  │ TalentSection        Reveal stagger+parallax│    │
│  │ background: mid-tone gradient               │    │
│  └─────────────────────────────────────────────┘    │
│         ... (same pattern for each section)          │
│  ┌─────────────────────────────────────────────┐    │
│  │ ClosingSection       Reveal dramatic CTA    │    │
│  │ background: dark closing gradient           │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Component Strategy

#### Tier 1: GSAP Pin+Scrub (3 sections)
| Section | Current State | Target State | Approach |
|---------|--------------|--------------|----------|
| HeroStage | GSAP word reveal, no exit | Add scroll-linked exit (parallax + fade) | Extend existing `initHeroAnimation` in `hero.ts` |
| HowItWorksStage | GSAP pin+scrub 3 steps | Add background color shift per step | Extend `initHowItWorksScroll` in `howItWorks.ts` |
| TournamentsStage | motion useScroll/useTransform | Full rewrite to GSAP pin+scrub | New `tournaments.ts` animation file, delete motion usage |

#### Tier 2: Reveal Variants (6 sections)
| Section | Reveal Strategy | Background |
|---------|----------------|------------|
| TalentSection | Stagger children + vertical parallax | Mid-tone gradient (brand-teal tint) |
| CompanySection | Scale-up reveal + counter animation | Light neutral with card shadows |
| NetworkingSection | Parallax decorative elements + fade | Gradient with floating elements |
| NewsSection | Stagger card grid reveal | Clean light background |
| NewsletterSection | Form reveal with emphasis | Dark (contrast before closing) |
| ClosingSection | Dramatic single reveal | Dark gradient (closing feel) |

### Visual Separation Strategy

**No hard borders.** Each section gets:
1. A unique `background` (solid, gradient, or subtle pattern)
2. Transition zones between sections using overlapping gradients or decorative elements
3. Different vertical padding to break uniform rhythm

**Color progression** (top to bottom):
```
Hero:        dark (#2f3436 based)
HowItWorks:  light (#f8f9fa-ish)
Talent:      mid-teal gradient
Company:     light warm
Tournaments: dark with accent
Networking:  mid-tone gradient
News:        clean light
Newsletter:  dark (contrast)
Closing:     dramatic dark gradient
```

### Reveal.tsx Extension

Current `Reveal.tsx` only supports simple fade-up. Extend with variants:

```tsx
// New variants to add
type RevealVariant = 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger';

// New props
interface RevealProps {
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number; // delay between children in stagger mode
  parallax?: number; // parallax offset amount
}
```

Each variant maps to CSS classes with pre-defined transitions, keeping the motion library as the animation engine.

### Scroll-Snap Integration with Lenis

Lenis scrolls the document body. scroll-snap applies to `<main>`. They coexist because:
- Lenis intercepts wheel/touch events and smoothly interpolates `window.scrollTo()`
- scroll-snap snaps the scroll position of the `<main>` element's scrollport
- The canonical wiring (`lenis.on('scroll', ScrollTrigger.update)`) ensures GSAP stays in sync

Key: use `scroll-snap-type: y proximity` (not mandatory) to avoid fighting Lenis's smooth interpolation.

### File Change Details

#### 1. `src/app/globals.css`
- Add `:root` section-background CSS custom properties
- Add scroll-snap rules on `main` element
- Add `.section-{name}` background classes
- Add gradient transition pseudo-elements between sections
- Add `prefers-reduced-motion` overrides for scroll-snap
- Add reveal animation keyframes (stagger, scale, parallax)

#### 2. `src/components/ui/Reveal.tsx`
- Add variant prop with CSS class switching
- Add stagger mode (uses `motion`'s `staggerChildren` in `variants`)
- Add parallax mode (uses `motion`'s `useTransform` for subtle Y offset)
- Maintain `useReducedMotion()` gate for accessibility

#### 3. `src/components/animations/tournaments.ts` (NEW)
- GSAP ScrollTrigger pin+scrub for TournamentsStage
- Pattern: same as `howItWorks.ts` but adapted for tournament content
- Dynamically imported from TournamentsStage.tsx

#### 4. Section files (Talent, Company, Networking, News, Newsletter, Closing)
- Import extended `Reveal` with appropriate variant
- Add `className` for section background
- No GSAP usage (per ADR-002)

#### 5. `src/components/animations/smoothScroll.ts`
- Verify Lenis config doesn't conflict with scroll-snap
- Add `scroll-snap-type` reset when `prefers-reduced-motion` is active

#### 6. Hero/HowItWorks animation files
- `hero.ts`: Add scroll-linked exit animation (opacity + translateY on the hero content as user scrolls past)
- `howItWorks.ts`: Add background color tween that interpolates as steps progress

### Risk Mitigation

| Risk | Mitigation | Test |
|------|-----------|------|
| Lenis + scroll-snap fight | Use `proximity` mode; Lenis scrolls body, snap on `<main>` | Manual scroll test on desktop + mobile |
| Too many ScrollTrigger instances | Max 3 pinned instances; others use IntersectionObserver | Lighthouse performance audit |
| Tournaments rewrite breaks existing | Full rewrite (not incremental); test before/after | Visual comparison screenshots |
| Mobile scroll-snap frustrating | `proximity` mode; test on real touch devices | Manual mobile testing |
| Stagger reveal performance | Use CSS `will-change: transform, opacity` sparingly; batch DOM reads | Chrome DevTools performance tab |

### Dependencies
- No new npm packages required
- Existing GSAP, motion, Lenis versions are sufficient
- No API or backend changes
- No i18n message key changes

### Rollout Strategy (per ADR-002)
Given the 500-line PR budget, split into chained PRs:

**PR 1 — Infrastructure + Tournaments** (~350 lines)
- globals.css scroll-snap + section backgrounds
- Reveal.tsx variants
- TournamentsStage.tsx GSAP upgrade
- new tournaments.ts animation

**PR 2 — Section Enhancements** (~300 lines)
- All 6 section files enhanced
- Hero/HowItWorks animation improvements
- smoothScroll.ts sync updates
- ADR-002 status update
