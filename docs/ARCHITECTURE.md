# Architecture — TechToJob-Landing

Version: 1.0.0
Last updated: 2026-09-16

Filled once during `/project-init`, kept in sync only when an architectural
decision changes (see `~/.claude/rules/adr-convention.md`). Any session
touching code should read this before writing anything.

## Chosen architecture

Static-generated (SSG via `generateStaticParams`) Next.js App Router site,
TypeScript, Tailwind v4, `next-intl` for locale-prefixed routing (`/es`,
`/en`), deployed to Vercel, zero backend/database, one third-party form
endpoint (Formspree).

**Why:** component reuse for repeating card patterns (News ×3, Tournaments
steps), officially-documented App-Router-native i18n via `next-intl`
(referenced directly by the competition rubric), TypeScript catches
locale-key typos at compile time, Vercel deploy is zero-config for this
stack, and the 1-week solo deadline favors a stack already known over
evaluating alternatives from scratch.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Plain HTML/CSS/JS | No component reuse across repeating card sections; shipping two full language copies would mean hand-duplicating markup, risking an inline-text violation under the i18n grading criterion. |
| Astro | No direct rubric alignment (rubric explicitly names `next-intl`/Next.js as the reference path); no time budget to evaluate a second framework's i18n story in one week. |
| Custom backend/DB for talent profiles, company postings, tournaments, auth | Explicitly out of scope — this deliverable only links out to Discord/social, it is not the platform itself. |
| CMS (Contentful/Sanity/etc.) for News | 3 static mock entries don't justify CMS setup time for v1; documented below as a clean future swap point. |
| Mailchimp/Brevo for newsletter | Rejected for v1 in favor of Formspree (free, zero backend, isolated behind `NewsletterForm.tsx` for an easy later swap). |

## Project structure

```
src/
  app/
    [locale]/
      layout.tsx      — root layout: <html lang>, Sora font, hreflang metadata
      page.tsx         — assembles the 10 sections in rubric order
    sitemap.ts
    robots.ts
    globals.css        — @theme brand tokens
  i18n/
    routing.ts          — defineRouting(['es','en'])
    navigation.ts        — typed Link/redirect/usePathname
    request.ts            — loads messages/{locale}.json
  lib/
    constants.ts          — SOCIAL_LINKS (discord/linkedin/x/instagram)
  components/
    ui/                    — Button, SectionContainer, Card (only ≥2-use patterns)
    forms/
      NewsletterForm.tsx     — only file that knows Formspree
    sections/                — one component per of the 10 required sections
  proxy.ts                    — next-intl locale detection (Next 16 "Proxy" convention)
messages/
  es.json / en.json             — all user-facing copy
docs/                            — this file, DESIGN.md, API.md, TESTING.md, constitution.md
```

## Module responsibilities

| Directory/module | Responsibility |
|---|---|
| `src/app/[locale]/` | Routing, static generation, per-locale metadata |
| `src/i18n/` | next-intl wiring — routing table, navigation helpers, message loading |
| `src/components/sections/` | One section = one component = one `messages/*.json` namespace |
| `src/components/ui/` | Genuinely reused visual primitives only |
| `src/components/forms/NewsletterForm.tsx` | The single Formspree integration point |
| `src/lib/constants.ts` | Real external URLs (Discord/social) — never inline in components |

## Dependency rules

- Sections may depend on `components/ui/*` and `lib/constants.ts`, never on
  each other directly.
- `components/ui/*` must NOT depend on `components/sections/*` (one-way).
- Business logic: none — this is presentation only.
- The only infrastructure/external-API logic lives in
  `components/forms/NewsletterForm.tsx` (Formspree fetch).
- UI logic lives entirely in `components/`; `app/[locale]/page.tsx` only
  composes, it holds no markup of its own beyond section ordering.
- Shared utilities live in `lib/` — reused only when actually reused
  elsewhere, not pre-emptively.

## Data flow

Request → `proxy.ts` (locale detection/redirect) → `[locale]/layout.tsx`
(static, sets `<html lang>`, loads messages) → `[locale]/page.tsx` → 10
section components, each pulling its own translated strings via
`getTranslations(namespace)`. The only runtime (non-static) interaction is
the newsletter form's client-side POST to Formspree.

## Evolution path

- **New locale**: append to `routing.locales` in `src/i18n/routing.ts` +
  add `messages/xx.json` — no route code changes needed.
- **News → real CMS**: replace the static `News.items` read in
  `NewsSection.tsx` with a fetch call; `Card` rendering downstream is
  unchanged.
- **Formspree → real ESP** (Mailchimp/Brevo): rewrite
  `NewsletterForm.tsx` only; `NewsletterSection.tsx` and everything else is
  untouched.
- **If the full "IT job platform" ships later**: that is a separate
  service/repo, not a fork of this landing — this repo stays the marketing
  front door.

## Open questions

- [PENDING] Full competition rubric percentages beyond content (25%),
  code/structure (15%), SEO (10%) — if a "functionality" criterion exists,
  revisit the no-backend decision in `docs/constitution.md`.
