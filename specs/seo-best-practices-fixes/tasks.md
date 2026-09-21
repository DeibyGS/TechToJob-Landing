# Tasks: SEO & Best Practices Fixes

## Phase 1 — Critical SEO Fixes

- [x] T1 — Fix `SITE_URL` in constants.ts to Vercel deployment URL [S] — implements BUG-6/AC-1.1 — Depends on: none
  - Done when: `SITE_URL` in `src/lib/constants.ts` equals the actual deployed Vercel URL. `npx tsc --noEmit` clean.

- [x] T2 — Add `metadataBase` + fix canonical + title.template in layout.tsx [M] — implements BUG-1, BUG-5/AC-1.1, AC-1.2, AC-1.5 — Depends on: T1
  - Done when: `generateMetadata` in `src/app/[locale]/layout.tsx` includes `metadataBase: new URL(SITE_URL)`, `title` uses `{ template: "%s | TechToJob", default: t("title") }`, and `alternates.canonical` resolves to correct per-locale URLs. `npx tsc --noEmit` clean.

- [x] T3 — Expand OpenGraph metadata in layout.tsx [M] — implements BUG-2/AC-1.3 — Depends on: T1
  - Done when: `openGraph` in `generateMetadata` includes `title`, `description`, `url`, `siteName`, `locale`, `type: "website"`, and `images` array with `{ url, width: 1200, height: 630, alt }`. All values pulled from `SITE_URL` and `getTranslations`.

- [x] T4 — Add Twitter Card metadata in layout.tsx [S] — implements BUG-3/AC-1.4 — Depends on: T1
  - Done when: `twitter` object in `generateMetadata` includes `card: "summary_large_image"`, `title`, `description`, `images`. All values from translations + `SITE_URL`.

- [x] T5 — Add `priority` to hero logo Image in HeroStage.tsx [S] — implements BUG-4/AC-1.6 — Depends on: none
  - Done when: The `<Image>` at `src/components/sections/HeroStage.tsx` line 74 has `priority={true}`. `npx tsc --noEmit` clean.

- [x] T6 — Phase 1 build verification [S] — implements AC-1.7, AC-1.8 — Depends on: T1, T2, T3, T4, T5
  - Done when: `npx tsc --noEmit` passes, `npm run build` passes, `npm run lint` passes.

---

## Phase 2 — Security, Best Practices & Accessibility

- [x] T7 — Add security headers + disable poweredByHeader + AVIF images in next.config.ts [M] — implements NEW-1, NEW-2, NEW-3/AC-2.4, AC-2.5 — Depends on: none
  - Done when: `next.config.ts` has `poweredByHeader: false`, `formats: ["image/avif"]`, and `headers()` returning array with `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `X-DNS-Prefetch-Control`. `npm run build` clean.

- [x] T8 — Wrap footer in `<footer>` HTML element [M] — implements BUG-7/AC-2.1 — Depends on: none
  - Done when: `src/components/sections/FooterSection.tsx` renders its content inside a `<footer>` element. DevTools inspector shows `<footer>` in the footer section. `npx tsc --noEmit` clean.

- [x] T9 — Fix aria-roledescription + pagination label in TestimonialsCarousel [S] — implements BUG-8, BUG-9/AC-2.2, AC-2.3 — Depends on: none
  - Done when: `aria-roledescription` values are `"carousel"` and `"slide"` (WAI-ARIA standard terms). Pagination `aria-label` uses `t("Testimonials.paginationLabel")`. Both `messages/es.json` and `messages/en.json` have the new `Testimonials.paginationLabel` key. `npx tsc --noEmit` clean.

- [x] T10 — Add WebSite JSON-LD schema in layout.tsx [S] — implements NEW-4/AC-2.9 — Depends on: none
  - Done when: A `WEBSITE_JSON_LD` constant with `@type: "WebSite"` is defined and injected via `<script type="application/ld+json">` alongside the existing `ORGANIZATION_JSON_LD`. `npx tsc --noEmit` clean.

- [x] T11 — Phase 2 build verification [S] — implements AC-2.6, AC-2.7 — Depends on: T7, T8, T9, T10
  - Done when: `npx tsc --noEmit` passes, `npm run build` passes, `npm run lint` passes. Manual check: `/es` and `/en` render correctly, footer shows `<footer>` tag in DevTools, security headers visible in Network tab.

---

Task sizes: S (<1h) | M (1-3h)
`[P]` = can run in parallel with other `[P]` tasks at the same dependency level.
