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

- [x] T2 — Build `Button`, `SectionContainer`, `Card` in `src/components/ui/`
  [M] — implements AC-01, AC-05, AC-08, AC-09 (structural prerequisites) —
  Depends on: T1
  - Done when: each primitive is used by at least 2 sections once PR3/PR4
    land (no premature 3rd variant). Built with `motion` tactile feedback
    on `Button` (`whileTap`, respects `useReducedMotion`); shape-consistency
    lock applied (pill buttons, `rounded-2xl` cards) per `docs/DESIGN.md`.
- [x] T3 — Build `LanguageSwitcher` using `next-intl`'s `Link`/`usePathname`
  [S] [P] — implements AC-15 — Depends on: T1
  - Done when: switching locale works with JavaScript disabled (real
    `<a>` href, verified via DevTools network-conditions or curl).
- [x] T4 — Prepare and drop in brand assets: favicon, `og-image.png`,
  `public/logo/{symbol,logo}-{positive,negative}.svg` per `docs/DESIGN.md`
  logo matrix [S] [P] — implements AC-20 — Depends on: none
  - Done when: favicon renders in browser tab, OG image resolves at
    `/og-image.png`. **Note**: used Next's file-convention favicon
    (`src/app/icon.svg` + `apple-icon.png`) instead of a hand-built
    `.ico` — no ICO conversion tool available locally (`sips` only), and
    Next auto-generates the correct `<link>` tags from `icon.svg` /
    `apple-icon.png`, which all evergreen browsers support. Verified the
    `Negativo` SVG variants are teal-on-transparent (not white) from their
    source, corrected the OG-image composition plan accordingly
    (`v2Negativo` on `brand-dark`, not `v2Positivo`/`v2Degradado`).
- [x] T5 — Add `alternates.languages` (hreflang) + canonical to
  `generateMetadata` in `[locale]/layout.tsx` [S] — implements AC-14 —
  Depends on: T1
  - Done when: viewing page source on `/es` and `/en` shows both
    `hreflang` tags plus `x-default`. **Done in PR1** — was written as part
    of the initial `[locale]/layout.tsx` (`generateMetadata` already
    includes `alternates.languages` with `es`/`en`/`x-default`).

## PR3 — `feat/cc-sections-1-to-5`

- [x] T6 — `HeroSection` + `Hero` namespace in both locales [S] — implements
  AC-01, AC-16 — Depends on: T2
  - Done when: single CTA button links to `SOCIAL_LINKS.discord`. Asymmetric
    split layout (text left, brand symbol mark right), no eyebrow.
- [x] T7 — `HowItWorksSection` + `HowItWorks` namespace (steps array) [S]
  [P] — implements AC-02, AC-16 — Depends on: T2
  - Done when: step count matches `HowItWorks.steps.length` for both
    locales, no hardcoded count in JSX. 3-column step row with typographic
    `01/02/03` numerals (not "Step 1" labels).
- [x] T8 — `TalentSection` + `Talent` namespace [S] [P] — implements AC-03,
  AC-16 — Depends on: T2
  - Done when: renders stack/level/availability placeholder fields. Split
    layout (text+bullets left, example profile card right via new shared
    `DefinitionRow` primitive).
- [x] T9 — `CompanySection` + `Company` namespace [S] [P] — implements
  AC-04, AC-16 — Depends on: T2, T8 (visual mirroring)
  - Done when: shares `TalentSection`'s layout pattern (not its code).
    Mirrored order (card left, text right) via `md:order-1`/`md:order-2` —
    same pattern, visually distinct rhythm.
- [x] T10 — `TournamentsSection` + `Tournaments` namespace, reusing `Card`
  [S] [P] — implements AC-05, AC-16 — Depends on: T2
  - Done when: uses `Card` component, not a bespoke card markup. Dark-band
    background, 3-card grid with Lucide icons (Target/Upload/Gavel) — a
    distinct layout family from the Talent/Company split pair, breaking
    the zigzag per `docs/DESIGN.md`'s consistency locks.
- [x] T11 — Assemble sections 1-5 in `[locale]/page.tsx` in rubric order [S]
  — implements AC-01–AC-05 (integration) — Depends on: T6, T7, T8, T9, T10
  - Done when: `npm run build` succeeds with all 5 sections rendering on
    both locales. Also added a minimal `Header` (logo + `LanguageSwitcher`,
    not one of the 10 required sections but necessary chrome — the
    switcher built in PR2 had nowhere to render until now). Verified
    visually with a headless-Chromium screenshot (scroll-triggered to fire
    `Reveal`'s `whileInView`), no console errors, responsive collapse
    confirmed at 390px.

## PR4 — `feat/cc-sections-6-to-10-formspree`

- [x] T12 — `NetworkingSection` + `Networking` namespace (channel list) [S]
  [P] — implements AC-06, AC-16 — Depends on: T2
  - Done when: channel list renders from a messages array. Pill-list
    layout with a `Hash` icon per channel.
- [x] T13 — `NewsSection` + `News` namespace (3 items), reusing `Card` [S]
  [P] — implements AC-07, AC-16 — Depends on: T2
  - Done when: exactly 3 cards render via `.map()` over `News.items`,
    never a hardcoded 4th. Asymmetric layout (1 featured full-width +
    2 below, `md:grid-cols-2`) — avoids the banned "3 equal generic
    cards" pattern and the "empty trailing bento cell" bug an earlier
    3-column version had (caught by visual review, fixed).
- [x] T14 — `NewsletterForm.tsx` (client component, Formspree `fetch`,
  idle/pending/success/error states) [M] — implements AC-08, AC-27, AC-28,
  AC-29, AC-31, AC-E1 — Depends on: T2
  - Done when: valid submission shows `Newsletter.successMessage`; a
    simulated failed submission shows `Newsletter.errorMessage` without
    clearing the email input; missing env var disables submit with a
    configuration notice instead of firing a request. All 3 states
    verified interactively via a headless-Chromium script (filled email,
    submitted against a deliberately fake Formspree ID, confirmed the
    error message rendered and the email stayed in the input).
- [x] T15 — `NewsletterSection` + `Newsletter` namespace, renders
  `NewsletterForm` [S] — implements AC-08 — Depends on: T14
  - Done when: `NewsletterSection.tsx` contains zero Formspree-specific
    code (verified via `grep -ri formspree src/components/sections/` —
    zero matches).
- [x] T16 — `ClosingSection` + `Closing` namespace, reuses `Button` +
  same Discord CTA as Hero [S] [P] — implements AC-09, AC-16 — Depends on: T2
  - Done when: CTA href matches `SOCIAL_LINKS.discord`. Centered
    editorial/manifesto layout (the one deliberate exception to the
    anti-centered-hero rule — this is the final message moment, not a
    generic split).
- [x] T17 — `FooterSection` + `Footer` namespace (4 link columns + social
  links + legal notice) [M] [P] — implements AC-10, AC-16 — Depends on: T2
  - Done when: all 4 social hrefs come from `SOCIAL_LINKS`, no inline URL.
    Real brand icons via Simple Icons CDN (`lucide-react` doesn't ship
    brand logos) — except LinkedIn, absent from the Simple Icons dataset
    (confirmed via the published icon list, not a lookup mistake), so it
    gets a `bg-brand-teal text-brand-dark` "in" text badge instead of a
    reproduced logo mark.
- [x] T18 — Assemble sections 6-10 in `[locale]/page.tsx`, completing the
  full 10-section order [S] — implements AC-06–AC-10 (integration) —
  Depends on: T12, T13, T15, T16, T17
  - Done when: `npm run build` succeeds, all 10 sections render on both
    locales in rubric order. Verified visually (full-page + per-section
    screenshots after scroll-triggering `Reveal`), zero console errors on
    the real interaction test.
- [x] T19 — Unsupported-locale 404 check (`app/[locale]/layout.tsx`
  `notFound()` path) [S] — implements AC-E2 — Depends on: T1
  - Done when: visiting `/fr` returns a 404 on the production build.
    **Verified, mechanism is slightly different than assumed**: next-intl's
    proxy (locale-prefix mode `always`) redirects a bare `/fr` to
    `/es/fr` (307) before our layout ever sees it, and `/es/fr` then
    404s via Next's native routing (no matching page for segment `fr`
    under `[locale]=es`) — not our own `notFound()` call. Our layout's
    `hasLocale` guard stays as a defensive backstop for a locale segment
    that reaches the layout directly; end-to-end user-facing behavior
    (a 404) matches the AC either way.

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
