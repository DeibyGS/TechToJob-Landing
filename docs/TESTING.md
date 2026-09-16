# Testing — TechToJob-Landing

Version: 1.0.0
Last updated: 2026-09-16

**Status: no automated test framework for v1.**

This is a static marketing page with no business logic, no state machine,
and no auth — the 10 sections are structure plus translated strings. The one
piece of "logic" (the Formspree `POST` in `NewsletterForm.tsx`) is a single
`fetch` call whose correctness is bounded by Formspree's own hosted
validation. An automated suite here would mostly test that `fetch` sends a
request, which isn't a meaningful signal for a 1-week solo landing page.

## Current verification strategy

Manual, run before every PR (full checklist in `README.md` →
`## Verifying a change`):

```bash
npm ci
npm run build     # confirms SSG of /es and /en
npm run lint
npx tsc --noEmit
npm run start      # smoke test on the production build, not `next dev`
```

Plus manual checks: `lang`/hreflang in the real HTML, language switcher with
JS disabled, all 10 sections in order, a real test submission to Formspree,
Lighthouse (Performance/Accessibility/SEO/Best Practices), responsive at
375/768/1440px.

## When this file gets filled in for real

If a real regression risk appears (e.g. the newsletter flow silently
breaking after a refactor), the correct escalation is a single Playwright
smoke test for that one flow — not a full suite. This file is kept as a
placeholder (per the project's full doc structure) rather than omitted, so
the structure is visible from day one.
