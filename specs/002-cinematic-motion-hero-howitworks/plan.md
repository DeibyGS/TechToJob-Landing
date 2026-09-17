# Plan: Cinematic Motion — Hero & HowItWorks (Phase 1)

### Affected files

| File | Action | Reason |
|------|--------|--------|
| `package.json` | MODIFY | add `gsap`, `lenis` |
| `docs/constitution.md` | MODIFY | approve GSAP core/ScrollTrigger/Lenis; document hybrid `motion`+GSAP rule (AC-10) |
| `src/components/animations/utils.ts` | CREATE | reduced-motion check, shared easing constants, `gsap.context` helper |
| `src/components/animations/smoothScroll.ts` | CREATE | Lenis init + ScrollTrigger proxy sync + reduced-motion guard |
| `src/components/providers/SmoothScrollProvider.tsx` | CREATE | client component, initializes Lenis/ScrollTrigger once, wraps `children` |
| `src/app/[locale]/layout.tsx` | MODIFY | wrap `children` in `SmoothScrollProvider` |
| `messages/es.json`, `messages/en.json` | MODIFY | add `HeroMockup` namespace, `[TODO]` micro-copy (channel names, sender labels, message snippets) |
| `src/components/sections/HeroMockup.tsx` | CREATE | static illustrated community mockup (SVG/CSS/React, brand tokens) |
| `src/components/animations/hero.ts` | CREATE | entrance timeline + scroll-linked exit (desktop/tablet); simplified mobile variant |
| `src/components/sections/HeroSection.tsx` | MODIFY | host `HeroMockup`, hook into `hero.ts` via a new client sub-component (Server Component shell preserved) |
| `src/components/animations/howItWorks.ts` | CREATE | pinned/scrubbed 3-step timeline (`≥lg`); no-op below `lg` |
| `src/components/sections/HowItWorksSection.tsx` | MODIFY | hook into `howItWorks.ts` on `≥lg`; keep existing `Reveal`-based rendering below `lg` |
| `src/components/ui/Reveal.tsx` | READ | unchanged — reused as the mobile fallback for HowItWorks |
| `src/app/globals.css` | READ | reuse existing `@theme` tokens for the mockup, no new tokens expected |
| `docs/adr/ADR-001-hybrid-motion-gsap-stack.md` | CREATE | records the animation-stack decision (see spec Recovered context) |

### Dependencies
- New packages: `gsap` (core, ~23KB gzip) + `gsap/ScrollTrigger` (tree-shaken
  import), `lenis` (~3KB gzip). Both dynamically imported inside client
  components so they never enter the shared/root bundle.
- No API/DB/auth involved — static content only, consistent with the
  project's static-first architecture.
- Reused components: `SectionContainer`, `Button`, `Reveal` (mobile fallback
  for HowItWorks), existing brand tokens in `globals.css`.
- Formspree, `NewsletterForm.tsx`: untouched, out of scope.

### Explicit technical assumptions
- We assume GSAP 3.13+ ships ScrollTrigger under the same free core license
  (confirmed via 2026 trend research) → if this changes, fall back to
  `motion`'s `useScroll`/`useTransform` for a reduced-fidelity version of the
  same sections and update the ADR.
- We assume Lenis's default (non-transform, RAF-based) integration mode is
  compatible with the project's existing `position: sticky`/pin usage → if a
  conflict appears during implementation, switch Lenis to its documented
  "content wrapper" mode and re-verify.
- We assume `next/dynamic` (or a plain dynamic `import()` inside
  `useEffect`) is sufficient to keep GSAP/Lenis out of the initial bundle
  under Next.js 16 + Turbopack → verify with a bundle-analyzer pass in T14.

### Non-functional requirements
- **Performance**: no hard Lighthouse floor (Deiby's call — feel over
  score), but: zero animated `width/height/top/left/margin/padding`
  (transform/opacity only, AC-09); no CLS from the Hero mockup (reserve
  space via a fixed aspect-ratio/min-height container before JS runs); GSAP
  + Lenis must not block first contentful paint (dynamic import only).
- **Accessibility**: `prefers-reduced-motion: reduce` fully disables Lenis
  (native scroll instead), ScrollTrigger pin/scrub, and idle motion (AC-08);
  DOM order matches reading/visual order regardless of animation state;
  focus states and keyboard navigation unaffected by pin/scrub; no keyboard
  trap from the pinned HowItWorks section.
- **Mobile / touch**: no pin below `1024px` (AC-07); Lenis touch config must
  not fight native momentum scrolling; no accidental horizontal scroll
  introduced by any transform.
- **i18n**: animation code holds zero copy; `HeroMockup` micro-copy goes
  through `messages/{es,en}.json` like everything else in the project.
- **Bundle**: GSAP/Lenis code-split away from sections still using `motion`
  (Talent, Company, Networking, News, Newsletter, Closing, Footer,
  Tournaments).

### Animation Map

#### Hero
| | Entrance (on load) | Scroll-linked exit |
|---|---|---|
| Trigger | mount (`useEffect`, `gsap.context`) | `ScrollTrigger`, trigger = Hero container, `start: "top top"`, `end: "+=40%"` |
| Duration/stagger | headline line-reveal 0.6s/line, 0.08s stagger; subheadline 0.5s @ +0.45s; CTA 0.4s @ +0.65s; mockup cards stagger-in 0.4s each, 0.06s stagger @ +0.3s; mockup container fade+scale 0.8s @ 0s | scrubbed to scroll progress (no fixed duration — tied 1:1 to scroll) |
| Easing | `power3.out` (headline/mockup), `power2.out` (subheadline), `back.out(1.4)` (CTA) | `none` (linear — scrub animations should track scroll, not add their own easing curve) |
| Properties | opacity, scale, translateY, clip-path (line-reveal mask) | scale 1→0.92, translateY 0→-40px, opacity 1→0 |
| Sticky/pin | no | no — Hero scrolls away normally after fading |
| Scroll-up behavior | n/a (one-shot on mount) | automatic — GSAP scrub is bidirectional by construction (AC-06) |
| Responsive | mobile: entrance only, no idle float, fewer mockup cards animated individually (grouped fade) | mobile: scroll-linked exit skipped entirely — not worth the perf cost at this scale (AC-07 spirit applied here too, documented, not a formal AC) |
| Perf cost | low | low — 1 ScrollTrigger instance, transform/opacity only |
| Optional (AC-C1) | idle float loop (±4px translateY, 6-8s yoyo) after entrance completes, desktop/tablet only, fully skipped under reduced motion | — |

#### HowItWorks (flagship #2)
| | Pinned/scrubbed (`≥1024px`) | Mobile fallback (`<1024px`) |
|---|---|---|
| Trigger | `ScrollTrigger.create`, pin the section, `start: "top top"`, `end: "+=200%"`, `scrub: true` | existing `Reveal` `whileInView` per step (no GSAP) |
| Duration | tied to scroll (no fixed duration); each step occupies ~1/3 of the pin range | `Reveal` default: 0.6s, `ease [0.16,1,0.3,1]` |
| Easing | `power2.inOut` for step crossfades (no bounce/elastic on scrubbed tweens — GSAP best practice) | as `Reveal.tsx` already defines |
| Properties | step copy: opacity 1→0 / 0→1 + translateY ∓16px (crossfade, slight overlap, no gap); visual anchor: subtle scale pulse 1→1.04→1 or ≤4° rotation on each step change | opacity, translateY (unchanged `Reveal` behavior) |
| Sticky/pin | yes, section pinned for the scroll range | no |
| Scroll-up behavior | automatic reversal (scrub), steps go 3→2→1 (AC-06) | natural — `Reveal` is `once: true`, no re-trigger needed scrolling up |
| Responsive | enabled only at `≥1024px` (Tailwind `lg:`) — pin on mobile is fragile (address-bar resize, touch jank) so it is not attempted, not just scaled down | sequential reveal — a different animation, not a scaled copy (per Deiby's explicit requirement) |
| Perf cost | medium — the one "expensive" animation in this phase; mitigated via `gsap.context()` scoping + cleanup on unmount, no nested ScrollTriggers, `will-change: transform` only while the pin is active | low — reuses existing pattern |

#### Shared infra
- `SmoothScrollProvider`: initializes Lenis once at the locale-layout level;
  if `prefers-reduced-motion: reduce`, Lenis is never instantiated (native
  scroll used instead) — checked once via `utils.ts`'s reduced-motion helper.
- Lenis synced to `ScrollTrigger` via `scrollerProxy` per the current (2026)
  recommended Next.js integration pattern.
- `gsap.context()` scopes every timeline to its component and returns a
  cleanup function invoked on unmount / locale change, preventing listener
  leaks across client-side navigations (AC-E1 mitigation, combined with
  `ScrollTrigger.refresh()` after locale-driven re-renders).

### Edge cases / risks (technical mitigation)
- ScrollTrigger listeners leaking across App Router client navigations →
  `gsap.context()` per component + cleanup in `useEffect` return.
- Locale switch changes text length, shifting pin distances (AC-E1) →
  `ScrollTrigger.refresh()` triggered after the locale-driven re-render;
  containers use fixed min-heights where feasible to minimize the shift.
- Hydration mismatch risk (GSAP writes to the DOM outside React) → all GSAP
  DOM writes happen inside `useEffect` only, using refs.
- Lenis vs. existing `position: sticky` usage elsewhere in the app → verify
  during T4/T5; switch Lenis mode if a conflict is found (see technical
  assumptions above).
- Two motion systems co-existing (`motion` + GSAP) → hard rule: GSAP only
  lives inside `src/components/animations/*.ts`, never mixed with `motion`
  on the same DOM subtree, to avoid conflicting transforms on one element.
- Phase exceeds the 500-line PR budget → split at execution time via
  `/chained-pr` (e.g. PR A = infra + constitution + Hero, PR B =
  HowItWorks), both traced back to this single spec.
