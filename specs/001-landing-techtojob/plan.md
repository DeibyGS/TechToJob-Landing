# Plan: TechToJob landing page

Technical design for `spec.md`. Full architecture rationale lives in
`docs/ARCHITECTURE.md` — this file only maps the spec's ACs to concrete
files and technical decisions specific to this feature.

### Affected files

| File | Action | Reason |
|------|--------|--------|
| `next.config.ts` | CREATE (done, PR1) | `withNextIntl` plugin + `turbopack.root` |
| `src/proxy.ts` | CREATE (done, PR1) | next-intl locale detection (Next 16 "Proxy" convention) |
| `src/i18n/{routing,navigation,request}.ts` | CREATE (done, PR1) | next-intl config: locales, typed nav, message loading |
| `src/app/[locale]/layout.tsx` | CREATE (done, PR1) | `<html lang>`, Sora font, hreflang metadata, `generateStaticParams` |
| `src/app/[locale]/page.tsx` | MODIFY (PR3+PR4) | Currently a placeholder CTA — grows into the 10-section assembly |
| `src/app/globals.css` | CREATE (done, PR1) | `@theme` brand tokens |
| `src/lib/constants.ts` | CREATE (done, PR1) | `SOCIAL_LINKS` |
| `messages/{es,en}.json` | MODIFY (every PR) | One namespace added per section as it's built |
| `src/components/ui/{Button,SectionContainer,Card}.tsx` | CREATE (PR2) | Only 3 patterns reused ≥2 times |
| `src/components/layout/LanguageSwitcher.tsx` | CREATE (PR2) | Real-link locale switcher (AC-15) |
| `public/{favicon.svg,favicon.ico,apple-touch-icon.png,og-image.png}` | CREATE (PR2) | From `~/Downloads/LogotiposTechToJob/` per `docs/DESIGN.md` logo matrix |
| `public/logo/{symbol,logo}-{positive,negative}.svg` | CREATE (PR2) | Header/footer logo per background |
| `src/components/sections/{Hero,HowItWorks,Talent,Company,Tournaments}Section.tsx` | CREATE (PR3) | AC-01 – AC-05 |
| `src/components/sections/{Networking,News,Newsletter,Closing,Footer}Section.tsx` | CREATE (PR4) | AC-06 – AC-10 |
| `src/components/forms/NewsletterForm.tsx` | CREATE (PR4) | AC-08, AC-27, AC-28, AC-29, AC-31, AC-E1 |
| `.env.local.example` | CREATE (done, PR1) | `NEXT_PUBLIC_FORMSPREE_FORM_ID` placeholder |
| `src/app/sitemap.ts` | CREATE (PR5) | AC-18 |
| `src/app/robots.ts` | CREATE (PR5) | AC-19 |
| `src/app/[locale]/layout.tsx` (JSON-LD) | MODIFY (PR5) | AC-21 |

### Dependencies

- External services: Formspree (hosted form endpoint, free tier) — the only
  external network call in the app.
- APIs / endpoints of our own: none (AC-30).
- DB tables: none.
- Auth pattern: none — fully public, static page.
- Reused components: `Button`, `SectionContainer`, `Card` (see
  `docs/DESIGN.md` reusable-components table) — every section reuses these
  instead of ad-hoc markup.
- Libraries: `next-intl` (i18n), `motion` (animation), `lucide-react`
  (icons) — all already installed in PR1.

### Explicit technical assumptions

- We assume `next-intl`'s default strict message lookup throws at build
  time on a missing key → if false (some future config change silences it),
  AC-17 needs an explicit CI check instead of relying on `npm run build`
  failing.
- We assume Vercel's default Node.js runtime handles the client-side
  Formspree `fetch` with no special config → if a CSP or `next.config.ts`
  header rule is added later that blocks outbound fetches, it needs an
  explicit allowlist for `formspree.io`.

### Non-functional requirements

- Performance: Lighthouse Performance score green on the production build
  (`npm run start`); no specific numeric budget beyond that — no
  bundle-size target was set in the (partial) rubric we have.
- Accessibility: Lighthouse Accessibility green, contrast table in
  `docs/DESIGN.md` respected (AC-24, AC-26), keyboard focus-visible on all
  interactive elements, real `alt` text on logo images.
- SEO: hreflang/lang correctness (AC-13, AC-14), sitemap/robots (AC-18,
  AC-19), JSON-LD (AC-21).
- Mobile: mobile-first, no horizontal overflow at 375/768/1440px (edge case
  in `spec.md`).

### Edge cases / risks (technical mitigation)

- Risk: a translator/typo introduces a key present in `es.json` but missing
  in `en.json` → mitigation: AC-17, caught by `npm run build` before every
  PR (README "Verifying a change" checklist).
- Risk: `brand-teal` CTA fails contrast at the chosen button size →
  mitigation: documented fallback pairing (`bg-brand-dark text-brand-white`)
  already specified in `docs/DESIGN.md`, verified via Lighthouse before
  shipping (AC-26).
- Risk: Formspree form ID missing in a preview/dev environment → mitigation:
  AC-31, disable submit + show a configuration notice instead of a broken
  fetch.
