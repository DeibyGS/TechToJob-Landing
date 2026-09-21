# Spec: SEO & Best Practices Fixes

### Status: DRAFT
### Version: 1.0

### Recovered context
- **Project constitution** (`docs/constitution.md`): Static-first, no backend, TypeScript strict, Tailwind v4 CSS-first, next-intl `es`+`en`, one third-party integration (Formspree).
- **Competition brief** (`base.md` L249-299): SEO requirements include `lang`, `title` 50-60 chars, `description` 150-160, canonical, viewport, OpenGraph + Twitter Card (1200×630), JSON-LD Organization, `title.template`, Lighthouse SEO=100 target.
- **Lighthouse findings** (Sept 2026): 1 obsolete API warning, 1 third-party cookie, console errors, no source maps for large JS, canonical mismatch.
- **Audit session** (this session): 9 bugs identified across SEO, accessibility, and best practices. Messages/*.json confirmed complete — no `[TODO]` placeholders remain.

### What does it do?
Fixes all SEO, security, and best-practice gaps so the landing scores ≥95 on Lighthouse SEO and passes the competition rubric's technical requirements. Separated in two phases: Phase 1 targets critical SEO (rubric score impact), Phase 2 targets security hardening and accessibility polish.

---

## Phase 1 — Critical SEO Fixes (rubric: SEO 10% + Code 15%)

**Goal:** Fix everything that directly affects the SEO score and rubric compliance.

### Bugs addressed
| # | Bug | File | Impact |
|---|-----|------|--------|
| BUG-1 | `metadataBase` missing → canonical URL broken | `layout.tsx` | **Critical** — Lighthouse flags invalid canonical |
| BUG-2 | OpenGraph incomplete (missing title, description, url, siteName, locale, type) | `layout.tsx` | **High** — rubric requires full OG |
| BUG-3 | No Twitter Card metadata | `layout.tsx` | **High** — rubric requires Twitter Cards |
| BUG-4 | Hero logo missing `priority` (LCP impact) | `HeroStage.tsx` | **Medium** — performance metric |
| BUG-5 | `title` not using `title.template` pattern | `layout.tsx` | **Medium** — rubric explicit requirement |
| BUG-6 | `SITE_URL` points to custom domain, not deployed Vercel URL | `constants.ts` | **Critical** — canonical, OG, sitemap all wrong |

### Changes

1. **`src/lib/constants.ts`** — Update `SITE_URL` to the actual Vercel deployment URL (`https://tech-to-job-landing-nine.vercel.app`) until custom domain is configured.

2. **`src/app/[locale]/layout.tsx`** — In `generateMetadata`:
   - Add `metadataBase: new URL(SITE_URL)`
   - Change `title` to `{ template: "%s | TechToJob", default: t("title") }`
   - Expand `openGraph` with: `title`, `description`, `url`, `siteName`, `locale`, `type: "website"`, `images` with width/height/alt
   - Add `twitter` with: `card: "summary_large_image"`, `title`, `description`, `images`
   - Fix `alternates.languages` — self-referencing canonical per locale (currently correct structure, just wrong base URL)

3. **`src/app/sitemap.ts`** — URLs will auto-fix once `SITE_URL` is corrected (uses `SITE_URL` constant).

4. **`src/components/sections/HeroStage.tsx`** — Add `priority={true}` to the hero logo `<Image>` at line 74.

### Acceptance criteria
- `[MUST]` AC-1.1: `metadataBase` resolves to the deployed Vercel URL so all relative OG/canonical URLs compose correctly.
- `[MUST]` AC-1.2: `title` renders as `"TechToJob — Comunidad tech..." | TechToJob` in ES and equivalent in EN (template pattern).
- `[MUST]` AC-1.3: OpenGraph includes `title`, `description`, `url`, `siteName`, `locale`, `type`, and `images` with `width: 1200`, `height: 630`.
- `[MUST]` AC-1.4: Twitter Card includes `card: "summary_large_image"`, `title`, `description`, `images`.
- `[MUST]` AC-1.5: `alternates.canonical` for `/es` points to `<SITE_URL>/es` and for `/en` points to `<SITE_URL>/en` — both resolve to live pages.
- `[MUST]` AC-1.6: Hero logo `<Image>` has `priority={true}` attribute.
- `[MUST]` AC-1.7: `npx tsc --noEmit` passes clean.
- `[MUST]` AC-1.8: `npm run build` passes clean.
- `[SHOULD]` AC-1.9: Lighthouse SEO score ≥95 on mobile.

### Out of scope
- `[WONT]` Changing any copy/label text in messages/*.json.
- `[WONT]` Changing the visual design or layout of any section.
- `[WONT]` Adding new dependencies.

---

## Phase 2 — Security, Best Practices & Accessibility Polish

**Goal:** Harden security headers, fix semantic HTML gaps, and polish accessibility for the a11y rubric (10%).

### Bugs addressed
| # | Bug | File | Impact |
|---|-----|------|--------|
| BUG-7 | Footer uses `<section>` instead of `<footer>` HTML element | `FooterSection.tsx` | **Medium** — rubric: "usa footer donde corresponda" |
| BUG-8 | `aria-roledescription` hardcoded in Spanish ("carrusel", "diapositiva") | `TestimonialsCarousel.tsx` | **Low** — bilingual site, should be locale-aware or use WAI standard |
| BUG-9 | Pagination `aria-label` hardcoded in Spanish | `TestimonialsCarousel.tsx` | **Low** — same as above |
| NEW-1 | No security headers (HSTS, X-Frame-Options, X-Content-Type-Options) | `next.config.ts` | **Medium** — best practices |
| NEW-2 | `X-Powered-By` header exposed | `next.config.ts` | **Low** — reveals Next.js to scanners |
| NEW-3 | No `images.format` (AVIF/WebP not explicitly requested) | `next.config.ts` | **Low** — performance |
| NEW-4 | No WebSite JSON-LD schema | `layout.tsx` | **Low** — richer search results |

### Changes

1. **`next.config.ts`** — Add:
   - `poweredByHeader: false`
   - `images: { format: "image/avif", ... }` (merge with existing `remotePatterns`)
   - `headers()` returning security headers array:
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `X-DNS-Prefetch-Control: on`

2. **`src/components/sections/FooterSection.tsx`** — Wrap the footer content in a `<footer>` element. Either:
   - Option A: Add a `tag` prop to `SectionContainer` that defaults to `section` but allows `footer`
   - Option B: Wrap the inner content of `FooterSection` in `<footer>` inside the existing `SectionContainer`

3. **`src/components/ui/TestimonialsCarousel.tsx`**:
   - Change `aria-roledescription="carrusel"` to `aria-roledescription="carousel"` (WAI-ARIA standard, language-agnostic)
   - Change `aria-roledescription="diapositiva"` to `aria-roledescription="slide"`
   - Make pagination `aria-label` use the `t()` translation from `messages/*.json` (add key `Testimonials.paginationLabel` to both locale files)

4. **`messages/es.json`** and **`messages/en.json`** — Add `Testimonials.paginationLabel` key for translatable carousel pagination label.

5. **`src/app/[locale]/layout.tsx`** — Add `WebSite` JSON-LD alongside existing `Organization`:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "WebSite",
     "name": "TechToJob",
     "url": SITE_URL,
     "potentialAction": {
       "@type": "SearchAction",
       "target": `${SITE_URL}/es?q={search_term_string}`,
       "query-input": "required name=search_term_string"
     }
   }
   ```

### Acceptance criteria
- `[MUST]` AC-2.1: Footer renders inside a `<footer>` HTML element (verifiable via DevTools inspector).
- `[MUST]` AC-2.2: `aria-roledescription` values are `"carousel"` and `"slide"` (WAI-ARIA standard terms).
- `[MUST]` AC-2.3: Pagination `aria-label` is translatable via messages/*.json, not hardcoded.
- `[MUST]` AC-2.4: Response headers include `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`.
- `[MUST]` AC-2.5: `X-Powered-By` header is not present in responses.
- `[MUST]` AC-2.6: `npx tsc --noEmit` passes clean.
- `[MUST]` AC-2.7: `npm run build` passes clean.
- `[SHOULD]` AC-2.8: Lighthouse Best Practices score ≥90 on mobile.
- `[SHOULD]` AC-2.9: WebSite JSON-LD present in page source alongside Organization schema.

### Out of scope
- `[WONT]` Implementing actual search functionality (WebSite schema is structural only).
- `[WONT]` Adding analytics, tracking, or consent banners.
- `[WONT]` Changing any visible copy or design.
- `[WONT]` Third-party cookie investigation (Formspree cookie is out of our control).

---

### Dependency graph
```
Phase 1 (no internal dependencies — all tasks can run in parallel):
  T1 ─┐
  T2 ─┤
  T3 ─┼─→ BUILD VERIFICATION
  T4 ─┤
  T5 ─┘

Phase 2 (depends on Phase 1 being merged):
  T6 ─┐
  T7 ─┤
  T8 ─┼─→ BUILD VERIFICATION
  T9 ─┤
  T10─┘
```
