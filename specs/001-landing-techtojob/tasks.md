# Tasks: TechToJob landing page

Task sizes: S (<1h) | M (1-3h) | L (3-6h, consider splitting)
`[P]` = can run in parallel with other `[P]` tasks at the same dependency level.

## PR1 — `feat/cc-scaffold-tooling` (done, not yet committed)

- [x] T1 — Scaffold Next.js (App Router, TS, Tailwind v4, `--src-dir`), install
  `next-intl`/`motion`/`lucide-react`, wire `next.config.ts` + `src/proxy.ts` +
  `src/i18n/*`, brand tokens + Sora in `globals.css`, placeholder
  `[locale]/{layout,page}.tsx`, `lib/constants.ts`, `.env.local.example`,
  full docs bootstrap (`constitution.md`, `AGENTS.md`, `ARCHITECTURE.md`,
  `DESIGN.md`, `API.md`/`TESTING.md` stubs, `README.md`) [L] — implements
  AC-11, AC-12, AC-13, AC-22, AC-30 — Depends on: none
  - Done when: `npm run build && npm run lint && npx tsc --noEmit` all
    green, both `/es` and `/en` statically generated. **Verified — see
    build output from this session.**

## PR2 — `feat/cc-ui-primitives-brand`

- [ ] T2 — Build `Button`, `SectionContainer`, `Card` in `src/components/ui/`
  [M] — implements AC-01, AC-05, AC-08, AC-09 (structural prerequisites) —
  Depends on: T1
  - Done when: each primitive is used by at least 2 sections once PR3/PR4
    land (no premature 3rd variant).
- [ ] T3 — Build `LanguageSwitcher` using `next-intl`'s `Link`/`usePathname`
  [S] [P] — implements AC-15 — Depends on: T1
  - Done when: switching locale works with JavaScript disabled (real
    `<a>` href, verified via DevTools network-conditions or curl).
- [ ] T4 — Prepare and drop in brand assets: favicon (SVG + rasterized
  `.ico`/apple-touch-icon from `Símbolo*`), `og-image.png`, `public/logo/
  {symbol,logo}-{positive,negative}.svg` per `docs/DESIGN.md` logo matrix
  [S] [P] — implements AC-20 — Depends on: none
  - Done when: favicon renders in browser tab, OG image resolves at
    `/og-image.png`.
- [ ] T5 — Add `alternates.languages` (hreflang) + canonical to
  `generateMetadata` in `[locale]/layout.tsx` [S] — implements AC-14 —
  Depends on: T1
  - Done when: viewing page source on `/es` and `/en` shows both
    `hreflang` tags plus `x-default`.

## PR3 — `feat/cc-sections-1-to-5`

- [ ] T6 — `HeroSection` + `Hero` namespace in both locales [S] — implements
  AC-01, AC-16 — Depends on: T2
  - Done when: single CTA button links to `SOCIAL_LINKS.discord`.
- [ ] T7 — `HowItWorksSection` + `HowItWorks` namespace (steps array) [S]
  [P] — implements AC-02, AC-16 — Depends on: T2
  - Done when: step count matches `HowItWorks.steps.length` for both
    locales, no hardcoded count in JSX.
- [ ] T8 — `TalentSection` + `Talent` namespace [S] [P] — implements AC-03,
  AC-16 — Depends on: T2
  - Done when: renders stack/level/availability placeholder fields.
- [ ] T9 — `CompanySection` + `Company` namespace [S] [P] — implements
  AC-04, AC-16 — Depends on: T2, T8 (visual mirroring)
  - Done when: shares `TalentSection`'s layout pattern (not its code).
- [ ] T10 — `TournamentsSection` + `Tournaments` namespace, reusing `Card`
  [S] [P] — implements AC-05, AC-16 — Depends on: T2
  - Done when: uses `Card` component, not a bespoke card markup.
- [ ] T11 — Assemble sections 1-5 in `[locale]/page.tsx` in rubric order [S]
  — implements AC-01–AC-05 (integration) — Depends on: T6, T7, T8, T9, T10
  - Done when: `npm run build` succeeds with all 5 sections rendering on
    both locales.

## PR4 — `feat/cc-sections-6-to-10-formspree`

- [ ] T12 — `NetworkingSection` + `Networking` namespace (channel list) [S]
  [P] — implements AC-06, AC-16 — Depends on: T2
  - Done when: channel list renders from a messages array.
- [ ] T13 — `NewsSection` + `News` namespace (3 items), reusing `Card` [S]
  [P] — implements AC-07, AC-16 — Depends on: T2
  - Done when: exactly 3 cards render via `.map()` over `News.items`,
    never a hardcoded 4th.
- [ ] T14 — `NewsletterForm.tsx` (client component, Formspree `fetch`,
  idle/pending/success/error states) [M] — implements AC-08, AC-27, AC-28,
  AC-29, AC-31, AC-E1 — Depends on: T2
  - Done when: valid submission shows `Newsletter.successMessage`; a
    simulated failed submission shows `Newsletter.errorMessage` without
    clearing the email input; missing env var disables submit with a
    configuration notice instead of firing a request.
- [ ] T15 — `NewsletterSection` + `Newsletter` namespace, renders
  `NewsletterForm` [S] — implements AC-08 — Depends on: T14
  - Done when: `NewsletterSection.tsx` contains zero Formspree-specific
    code (verified via `grep -ri formspree src/components/sections/`).
- [ ] T16 — `ClosingSection` + `Closing` namespace, reuses `Button` +
  same Discord CTA as Hero [S] [P] — implements AC-09, AC-16 — Depends on: T2
  - Done when: CTA href matches `SOCIAL_LINKS.discord`.
- [ ] T17 — `FooterSection` + `Footer` namespace (4 link columns + social
  links + legal notice) [M] [P] — implements AC-10, AC-16 — Depends on: T2
  - Done when: all 4 social hrefs come from `SOCIAL_LINKS`, no inline URL.
- [ ] T18 — Assemble sections 6-10 in `[locale]/page.tsx`, completing the
  full 10-section order [S] — implements AC-06–AC-10 (integration) —
  Depends on: T12, T13, T15, T16, T17
  - Done when: `npm run build` succeeds, all 10 sections render on both
    locales in rubric order.
- [ ] T19 — Unsupported-locale 404 check (`app/[locale]/layout.tsx`
  `notFound()` path) [S] — implements AC-E2 — Depends on: T1
  - Done when: visiting `/fr` returns a 404 on the production build.

## PR5 — `feat/cc-seo-i18n-polish`

- [ ] T20 — `src/app/sitemap.ts` listing both locale URLs [S] [P] —
  implements AC-18 — Depends on: T11, T18
  - Done when: `/sitemap.xml` lists `/es` and `/en`.
- [ ] T21 — `src/app/robots.ts` [S] [P] — implements AC-19 — Depends on: T1
  - Done when: `/robots.txt` resolves and allows crawling.
- [ ] T22 — JSON-LD `Organization` structured data in `[locale]/layout.tsx`
  using only confirmed `SOCIAL_LINKS` [S] — implements AC-21 — Depends on: T1
  - Done when: structured-data testing shows valid `Organization` schema,
    no invented member/company counts.
- [ ] T23 — Full hreflang/lang audit across all 10 sections + README
  "Verifying a change" checklist run [M] — implements AC-13, AC-14, AC-15,
  AC-17, AC-24, AC-26 (final verification pass) — Depends on: T18, T20
  - Done when: every item in `README.md` → "Verifying a change" passes,
    including Lighthouse accessibility/contrast.

## Traceability note

Every `[MUST]` AC in `spec.md` maps to at least one task above. AC-23
(brand colors dominate) and AC-25 (no emoji) are cross-cutting — verified
per-section during code review (T6–T17) rather than a single dedicated
task, and re-checked in T23's final audit pass.
