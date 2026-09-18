# TechToJob-Landing

Static, bilingual (es/en) marketing landing for **TechToJob**, a Discord-first
tech community — built for a design/dev competition. See `docs/ARCHITECTURE.md`
for the full technical picture and `AGENTS.md` for AI-agent conventions.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the
default locale (`/es`).

Copy `.env.local.example` to `.env.local` and set
`NEXT_PUBLIC_FORMSPREE_FORM_ID` to enable the newsletter form.

## Verifying a change

No automated test suite for v1 (see `docs/TESTING.md` for why). Before every
PR, run:

```bash
npm ci
npm run build     # confirms SSG of /es and /en
npm run lint
npx tsc --noEmit
npm run start      # smoke test the production build, not `next dev`
```

Then manually check, on the running production build:

- View source on `/es` and `/en`: `<html lang="es"|"en">` and
  `<link rel="alternate" hreflang="es"|"en"|"x-default">` present in the
  actual HTML.
- Language switcher works with JavaScript disabled (it's a real link).
- All 10 sections render in order; Hero and Closing CTAs open the Discord
  invite; footer social links point to the confirmed LinkedIn/X/Instagram
  URLs.
- Newsletter form: submit a test address, confirm it lands in the Formspree
  dashboard and the on-page success message renders.
- Lighthouse (Performance/Accessibility/SEO/Best Practices) — check the
  brand-teal contrast usage specifically passes the accessibility audit.
- Responsive at 375px / 768px / 1440px — no horizontal overflow, no broken
  wrapping on the longest placeholder strings in either locale.

## Docs

- `docs/ARCHITECTURE.md` — chosen architecture, alternatives, evolution path
- `docs/DESIGN.md` — brand tokens, contrast rules, reusable components
- `docs/API.md` / `docs/TESTING.md` — not applicable for v1 (see each file)
- `docs/constitution.md` — non-negotiable project principles

## Deploy

Deployed via Vercel, connected to this repo. Set
`NEXT_PUBLIC_FORMSPREE_FORM_ID` in the Vercel project's environment
variables before promoting to production.
