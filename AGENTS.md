<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — TechToJob-Landing

This file is the single source of truth for AI agent context in this project.
Both Claude Code (via `CLAUDE.md` → `@AGENTS.md`) and other tools (e.g.
OpenCode, which reads `AGENTS.md` natively) load this same file — never
duplicate its content elsewhere.

## Project overview

Single-page, static, bilingual (es/en) marketing landing for **TechToJob**,
a Discord-first tech community (not a job board). Built for a design/dev
competition; if it wins, this becomes the company's real public site.
Next.js App Router, `src/app/[locale]/page.tsx` assembles 10 fixed sections
from `src/components/sections/`. No backend of our own — the only external
call is a Formspree POST from the newsletter form.

## Constitution

Before any spec, plan, or implementation: read `docs/constitution.md`. Those
principles are non-negotiable and override defaults below when they conflict.

## Commands

- Run: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Test: none configured for v1 — see `docs/TESTING.md`

## Style and conventions

TypeScript strict mode. Tailwind CSS v4 (CSS-first `@theme` in
`src/app/globals.css`, no `tailwind.config.js`). All code identifiers in
English; all user-facing copy lives in `messages/{es,en}.json`, never inline
in a `.tsx` file. No emoji anywhere in the UI — icons come from
`lucide-react`. See `docs/DESIGN.md` for brand tokens and contrast rules.

## Rules

- Do not modify `specs/` except through the `/sdd` workflow.
- Do not add external dependencies without first updating
  `docs/constitution.md` and the plan.
- Do not write final marketing copy into `messages/*.json` — that's Deiby's
  pass (worth 25% of the competition score). Leave `[TODO]` placeholders.
- Do not add a backend/API route, database, or auth — see Architecture
  Principles in `docs/constitution.md`.
- The only file allowed to know about Formspree is
  `src/components/forms/NewsletterForm.tsx`.

## When finishing any task

- Run `npm run build && npm run lint && npx tsc --noEmit` and confirm all are
  green before reporting done.
- For UI changes, manually verify both `/es` and `/en` render correctly.
