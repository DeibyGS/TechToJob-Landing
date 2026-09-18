# Project Constitution — TechToJob-Landing

Version: 1.2.0
Last updated: 2026-09-18

Non-negotiable principles. Every spec, plan, and task must comply with these.
AI agents are strictly forbidden from violating this file. Changes here should
be rare — only when a fundamental project decision changes, not per-feature.

## Architecture Principles

- Static-first: every page/route is statically generated (`generateStaticParams`).
  No server-side data fetching, no database, no server actions.
- Server Components by default; a component becomes `"use client"` only when
  it needs interactivity (currently: the newsletter form, scroll-reveal
  wrappers using `motion`, and the GSAP-driven Hero/HowItWorks animation
  hooks — see Animation Stack below).
- One third-party integration point (Formspree) is allowed for the newsletter
  form; no other external service calls without updating this file first.
- No dynamic CMS, no auth, no user accounts — this is a marketing landing
  page, not the future job platform itself.

## Animation Stack (hybrid — see ADR-001, ADR-002)

- **`motion`** (existing) is the animation library for simple `whileInView`
  reveals on non-flagship sections — unchanged, still drives `Reveal.tsx`.
- **GSAP core + `gsap/ScrollTrigger` + Lenis** (added in `specs/002-cinematic-
  motion-hero-howitworks`) are approved *only* for sections that need real
  pin/scrub scroll choreography. Phase 1: Hero, HowItWorks. Phase 2
  (`docs/adr/ADR-002-scroll-block-sections.md`, proposed): TournamentsSection
  is approved to join this list once implemented — its `TournamentsStage.tsx`
  has ordered internal state worth scrubbing, same as HowItWorks. GSAP code
  lives exclusively under `src/components/animations/*.ts`, dynamically
  imported so it never enters the shared bundle for sections that don't use
  it.
- **Block-entrance sections** (ADR-002 Phase 2b): the 6 remaining sections
  with no internal ordered state (Talent, Company, Networking, News,
  Newsletter, Closing) do **not** get GSAP pin/scrub — they get CSS
  `scroll-snap` (native, no new JS) combined with the existing `Reveal`
  `whileInView` entrance. No constitution change needed for these beyond
  recording the `scroll-snap` CSS addition here.
- **Hard rule**: GSAP and `motion` are never mixed on the same DOM subtree.
  Adding GSAP to a new section, or any GSAP plugin beyond core +
  ScrollTrigger, requires updating this file and (if architecturally
  significant) a new ADR — see `docs/adr/ADR-001-hybrid-motion-gsap-stack.md`
  and `docs/adr/ADR-002-scroll-block-sections.md`.
- All scroll-linked/entrance animation must respect `prefers-reduced-motion`
  completely (smooth scroll, pin, scrub, parallax, and `scroll-snap` all
  disabled or inert; content remains fully usable) — non-negotiable
  regardless of library.

## Technology Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript | strict mode, no `any` |
| Runtime | Node.js (Vercel) | static export, no custom server |
| Framework | Next.js 16 (App Router) | `--src-dir`, Turbopack |
| Styling | Tailwind CSS v4 | CSS-first `@theme`, no `tailwind.config.js` |
| i18n | next-intl | `app/[locale]/`, locales `es` (default) + `en` |
| Animation | motion (ex-Framer Motion) + GSAP core/ScrollTrigger + Lenis | hybrid, see Animation Stack above; all respect `prefers-reduced-motion` |
| Icons | lucide-react | no emoji anywhere in the UI |
| Forms | Formspree (plain `fetch`, no SDK) | isolated in `NewsletterForm.tsx` |
| Database | none | static site, no persistence |
| Auth | none | |
| Testing | none for v1 | see `docs/TESTING.md` stub for when this changes |

## Security Constraints

- Never hardcode the Formspree form ID — read from
  `NEXT_PUBLIC_FORMSPREE_FORM_ID` (public by necessity: the POST is client-side).
- Never invent member/company counts or unconfirmed statistics anywhere in
  copy — competition rubric requirement, not just a style preference.
- Never log form submissions or any user input.

## Naming Conventions

- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities/config.
- Variables/functions/components: camelCase / PascalCase, always in English.
- i18n message keys: PascalCase namespace matching the component name
  (e.g. `Hero`, `HowItWorks`) with camelCase leaf keys.
- Env vars: `SCREAMING_SNAKE_CASE`, `NEXT_PUBLIC_` prefix only when the value
  is genuinely safe to expose client-side.

## Banned Patterns

- No `any` type in TypeScript.
- No hardcoded user-facing copy inside `.tsx` files — everything through
  `messages/{es,en}.json`.
- No emoji as icons or decoration anywhere in the UI — use `lucide-react`.
- No backend/API route of our own unless this file is updated first (see
  Architecture Principles).
- No premature abstraction: don't extract a shared component until it's
  reused in 2+ places.

## File Structure Rules

```
src/
  app/[locale]/       — routes, layout, page (SSG per locale)
  i18n/                — next-intl routing/navigation/request config
  lib/                 — constants and small pure utilities
  components/
    ui/                — only genuinely reused primitives (Button, Card, SectionContainer)
    forms/              — NewsletterForm (only file that knows Formspree)
    sections/           — one file per landing section, imported once by page.tsx
messages/{es,en}.json  — all user-facing copy
```

## Language

Code and identifiers in English; user-facing content in Spanish (default)
and English (`app/[locale]/`, `messages/*.json`).

## Open Questions / Deferred Decisions

- [PENDING] Full tournament rubric percentages beyond content (25%),
  code/structure (15%), SEO (10%) — unknown at time of writing, may affect
  scope if a "functionality" criterion exists. See `docs/ARCHITECTURE.md`
  evolution path.
