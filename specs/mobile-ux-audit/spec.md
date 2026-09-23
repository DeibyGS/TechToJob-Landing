# Spec: Mobile UX Audit & Fixes

**Status:** IMPLEMENTED
**Version:** 1.0
**Date:** 2026-09-21

### Recovered context
- **Project constitution** (`docs/constitution.md`): Static-first, no backend, TypeScript strict, Tailwind v4 CSS-first, next-intl `es`+`en`.
- **Competition brief** (`base.md` L328): Responsive = 15% of rubric. "Se prueba en móvil real, no solo en el inspector."
- **Lighthouse scores** (Sept 2026): SEO=100, Performance=99, Accessibility=97, Best Practices=58 (not evaluated in rubric).
- **Audit session**: 12 mobile issues identified across navigation, touch targets, layout, and consistency.

### What does it do?
Fixes all mobile UX gaps so the landing passes real-device testing for the competition's Responsive criterion (15%). Adds hamburger navigation, fixes WCAG touch targets, centers the newsletter CTA, reduces hero chat fragment opacity on mobile, and standardizes teal usage.

---

## Phase 1 — Critical: Navigation & Touch Targets

**Goal:** Mobile users can navigate to any section and all interactive elements meet WCAG 2.5.8 (44×44px minimum).

### Bugs addressed

| # | Bug | File | Impact |
|---|-----|------|--------|
| M-1 | NavLinks `hidden md:flex` — zero navigation on mobile | `NavLinks.tsx:115` | **Critical** — no way to jump to sections |
| M-2 | Carousel prev/next arrows positioned outside container (`-translate-x-3`), clipped by `overflow-hidden` | `TestimonialsCarousel.tsx:233-240` | **Critical** — arrows unreachable on mobile |
| M-3 | Footer social icons 24×24px — below WCAG 44×44px minimum | `FooterSection.tsx:54-79` | **Critical** — WCAG 2.5.8 fail |
| M-4 | LanguageSwitcher buttons ~30px height — below 44×44px | `LanguageSwitcher.tsx:28` | **Medium** — difficult to tap |
| M-5 | NavLinks pill buttons ~34px height — below 44×44px (visible on tablet 768-1023px) | `NavLinks.tsx:121` | **Medium** — touch target too small |
| M-6 | Pagination dots 8×8px with no padding — impossible to tap | `TestimonialsCarousel.tsx:258` | **Medium** — no accessible carousel navigation |

### Changes

1. **`src/components/layout/Header.tsx`** — Restructure header layout on mobile:
   - Below `md`: replace `LanguageSwitcher` position with a hamburger `<button>` (Lucide `Menu` icon, 44×44px touch target)
   - Keep `LanguageSwitcher` rendered but move it inside the mobile menu overlay
   - Desktop (`md:`): keep current layout (NavLinks + LanguageSwitcher, no hamburger)

2. **New: `src/components/layout/MobileMenu.tsx`** — Client component:
   - Full-width dropdown panel below header (not drawer — simpler, matches existing pill-group aesthetic)
   - Contains: NavLinks (vertical list, full-width pills) + LanguageSwitcher at the bottom
   - Open/close via `useState`, triggered by hamburger button in Header
   - Close on: link click, language switch, outside click, Escape key
   - `aria-expanded`, `aria-controls`, `role="dialog"` for a11y
   - Animated open/close with `motion` (slide down + fade, respects `prefers-reduced-motion`)

3. **`src/components/layout/NavLinks.tsx`** — Export a vertical variant:
   - Keep existing horizontal `md:flex` nav as-is
   - Accept optional `orientation?: "horizontal" | "vertical"` prop (default `"horizontal"`)
   - Vertical: `flex-col`, full-width pills, larger padding (`px-4 py-3` → ~48px height)
   - Used by MobileMenu in vertical mode

4. **`src/components/layout/LanguageSwitcher.tsx`** — Increase touch targets:
   - Change `px-2.5 py-1` → `px-3 py-2` (minimum ~40px height, close to 44px with text)
   - Or wrap each button in a 44×44px touch area

5. **`src/components/ui/TestimonialsCarousel.tsx`** — Fix arrows and dots:
   - Arrows: change `-translate-x-3`/`translate-x-3` → `left-2`/`right-2` on mobile (positioned inside container)
   - Dots: wrap each `<button>` in a 44×44px touch area (`p-2` on the button, visual dot stays small inside)

6. **`src/components/sections/FooterSection.tsx`** — Increase social icon touch targets:
   - Wrap each `<a>` with `p-2.5` or change to `h-11 w-11 flex items-center justify-center` (44×44px)

### Acceptance criteria
- `[MUST]` AC-1.1: Hamburger icon visible on mobile (<768px), hidden on desktop (≥768px)
- `[MUST]` AC-1.2: Mobile menu contains all 5 NavLinks + LanguageSwitcher
- `[MUST]` AC-1.3: Mobile menu closes on link click, language switch, outside click, and Escape
- `[MUST]` AC-1.4: All interactive elements (nav links, language buttons, social icons, carousel arrows, pagination dots) have ≥44×44px touch targets
- `[MUST]` AC-1.5: Carousel arrows are visible and clickable on mobile (not clipped)
- `[MUST]` AC-1.6: `aria-expanded` on hamburger, `role="dialog"` on mobile menu
- `[MUST]` AC-1.7: `npx tsc --noEmit` passes clean
- `[MUST]` AC-1.8: `npm run build` passes clean
- `[SHOULD]` AC-1.9: Mobile menu animation respects `prefers-reduced-motion`

### Out of scope
- `[WONT]` Changing nav link order or labels
- `[WONT]` Adding new navigation sections
- `[WONT]` Drawer-style animation (user chose classic dropdown)

---

## Phase 2 — Mobile Polish: Layout & Content

**Goal:** Fix visual issues that affect readability and usability on small screens.

### Bugs addressed

| # | Bug | File | Impact |
|---|-----|------|--------|
| M-7 | Hero headline `text-5xl` (48px) on 320px screens — CTA may clip below fold | `HeroStage.tsx:87` | **Medium** — smallest phones affected |
| M-8 | Newsletter "Quiero recibirlas" button aligned left on mobile — should be centered | `NewsletterSection.tsx:21`, `NewsletterForm.tsx:63` | **Medium** — user-reported |
| M-9 | Hero chat fragments opacity 0.65/0.9 on mobile — too prominent, blocking content | `HeroChatFragments.tsx:36,43` | **Medium** — user-reported |

### Changes

1. **`src/components/sections/HeroStage.tsx`** — Responsive headline font:
   - Add `text-4xl` for very narrow screens: `text-4xl text-5xl md:text-6xl` (Tailwind mobile-first, `text-4xl` = 36px as base, `text-5xl` = 48px at `sm`)

2. **`src/components/sections/NewsletterSection.tsx`** — Center form on mobile:
   - Change wrapper `<div className="mt-8 text-left">` → `<div className="mt-8 sm:text-left">`
   - This makes the form center-aligned on mobile (<640px) and left-aligned on desktop

3. **`src/components/forms/NewsletterForm.tsx`** — Center button on mobile:
   - On mobile (`flex-col` layout), the submit button should be centered
   - Add `self-center` to the button wrapper div on mobile, or adjust the `flex-col` to `items-center` below `sm`

4. **`src/components/sections/HeroChatFragments.tsx`** — Reduce mobile opacity:
   - For the 2 fragments visible on mobile (`show: "always"`):
     - Fragment at `top: "10%" right: "2%"`: reduce opacity from `0.65` → `0.35`
     - Fragment at `bottom: "15%" right: "0%"`: reduce opacity from `0.9` → `0.45`
   - These are the mid/fg layers — still visible but won't compete with headline + CTA

### Acceptance criteria
- `[MUST]` AC-2.1: Hero headline renders at 36px on 320px screens (not 48px)
- `[MUST]` AC-2.2: Newsletter form + button centered on mobile (<640px)
- `[MUST]` AC-2.3: Chat fragments on mobile have opacity ≤0.45 (down from 0.65/0.9)
- `[MUST]` AC-2.4: CTA button visible above the fold on iPhone SE (320px viewport)
- `[MUST]` AC-2.5: `npx tsc --noEmit` passes clean
- `[MUST]` AC-2.6: `npm run build` passes clean
- `[SHOULD]` AC-2.7: Verify at 375px (iPhone 14) and 320px (iPhone SE) — no content clipping

### Out of scope
- `[WONT]` Changing chat fragment content or positions
- `[WONT]` Adding new fragments for mobile
- `[WONT]` Changing newsletter form fields or validation

---

## Phase 3 — Consistency & Hardening

**Goal:** Standardize design tokens and fix minor inconsistencies.

### Bugs addressed

| # | Bug | File | Impact |
|---|-----|------|--------|
| M-10 | `TalentCard`/`CompanyCard` use `bg-teal-600` instead of `bg-brand-teal` | `TalentCard.tsx:72`, `CompanyCard.tsx:68` | **Low** — visual inconsistency |
| M-11 | Lenis smooth scroll active on mobile — may interfere with native scroll | `smoothScroll.ts` | **Low** — potential jank on low-end devices |
| M-12 | `scroll-margin-top: 5rem` vs header `h-16` (4rem) — 1rem gap on anchor jumps | `globals.css:20` | **Low** — imprecise scroll positioning |

### Changes

1. **`src/components/ui/TalentCard.tsx`** and **`src/components/ui/CompanyCard.tsx`**:
   - Change `bg-teal-600` → `bg-brand-teal` on CTA buttons

2. **`src/components/animations/smoothScroll.ts`**:
   - Add mobile check: skip Lenis initialization when `window.innerWidth < 768`
   - Or use `matchMedia("(min-width: 768px")` to conditionally enable
   - Fallback: native smooth scroll on mobile

3. **`src/app/globals.css`**:
   - Change `scroll-margin-top: 5rem` → `scroll-margin-top: 4rem` to match header height (`h-16` = 4rem = 64px)

### Acceptance criteria
- `[MUST]` AC-3.1: TalentCard and CompanyCard CTA buttons use `bg-brand-teal`
- `[MUST]` AC-3.2: Lenis does not initialize on viewports <768px
- `[MUST]` AC-3.3: `scroll-margin-top` matches header height (4rem)
- `[MUST]` AC-3.4: `npx tsc --noEmit` passes clean
- `[MUST]` AC-3.5: `npm run build` passes clean
- `[SHOULD]` AC-3.6: Smooth scroll still works on desktop (Lenis intact)

### Out of scope
- `[WONT]` Removing Lenis entirely
- `[WONT]` Changing GSAP animation behavior
- `[WONT]` Adding new animations

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
  T7 ─┼─→ BUILD VERIFICATION
  T8 ─┘

Phase 3 (depends on Phase 2 being merged):
  T9  ─┐
  T10 ─┼─→ BUILD VERIFICATION
  T11 ─┘
```

### Files touched (summary)

| Phase | Files |
|-------|-------|
| 1 | `Header.tsx`, new `MobileMenu.tsx`, `NavLinks.tsx`, `LanguageSwitcher.tsx`, `TestimonialsCarousel.tsx`, `FooterSection.tsx` |
| 2 | `HeroStage.tsx`, `NewsletterSection.tsx`, `NewsletterForm.tsx`, `HeroChatFragments.tsx` |
| 3 | `TalentCard.tsx`, `CompanyCard.tsx`, `smoothScroll.ts`, `globals.css` |
