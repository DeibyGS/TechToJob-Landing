# Project Constitution — TechToJob-Landing

Version: 1.0.0
Last updated: 2026-09-16

Non-negotiable principles. Every spec, plan, and task must comply with these.
AI agents are strictly forbidden from violating this file. Changes here should
be rare — only when a fundamental project decision changes, not per-feature.

## Architecture Principles

- Static-first: every page/route is statically generated (`generateStaticParams`).
  No server-side data fetching, no database, no server actions.
- Server Components by default; a component becomes `"use client"` only when
  it needs interactivity (currently: only the newsletter form).
- One third-party integration point (Formspree) is allowed for the newsletter
  form; no other external service calls without updating this file first.
- No dynamic CMS, no auth, no user accounts — this is a marketing landing
  page, not the future job platform itself.

## Technology Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript | strict mode, no `any` |
| Runtime | Node.js (Vercel) | static export, no custom server |
| Framework | Next.js 16 (App Router) | `--src-dir`, Turbopack |
| Styling | Tailwind CSS v4 | CSS-first `@theme`, no `tailwind.config.js` |
| i18n | next-intl | `app/[locale]/`, locales `es` (default) + `en` |
| Animation | motion (ex-Framer Motion) | respects `prefers-reduced-motion` |
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
