# Design — TechToJob-Landing

Version: 1.0.0
Last updated: 2026-09-16

Created because this project has a UI. The reusable-components inventory
below is the part that matters most in practice — check it before creating
any new component, so work doesn't silently duplicate an existing one.

## Design principles

TechToJob is a community, not a job board — the design should feel like a
tech community hub (confident, direct, builder-oriented), never like a
generic corporate job-listing site. Avoid stock-photo-of-people-in-an-office
aesthetics; favor typography, brand color, and iconography (Lucide) over
photography. No emoji anywhere, no AI-template-default look (see the `taste`
skill, invoked during section implementation).

## Design tokens

| Token | Value | Notes |
|---|---|---|
| Color — `brand-dark` | `#2f3436` | Body text, headings; text on `brand-teal` |
| Color — `brand-teal` | `#84c0bf` | Backgrounds, button fills, icons, borders — never small body text on white |
| Color — `brand-white` | `#ffffff` | Base background; text on `brand-dark` |
| Font — all | Sora (`next/font/google`, weights 400/600/700) | Loaded once in `[locale]/layout.tsx`, exposed as `--font-sora` → consumed by Tailwind's `--font-sans` |
| Spacing scale | Tailwind default | No custom scale needed for a single-page site |
| Radius scale | Tailwind default | |

### Contrast rules (mandatory — graded under accessibility)

| Token | Allowed | Forbidden |
|---|---|---|
| `brand-dark` | Body text, headings, text on `brand-teal` fills | — |
| `brand-teal` | Section backgrounds, button fills (paired with `brand-dark` text), icon fills, borders, large decorative shapes | Body copy text color on white, any small text |
| `brand-white` | Base page background, text on `brand-dark` | Text on `brand-teal` |

Recommended CTA pairing: `bg-brand-teal text-brand-dark`. Verify the real
contrast ratio with Lighthouse before shipping; if it falls short at the
chosen button size, fall back to `bg-brand-dark text-brand-white` and keep
teal strictly decorative.

## Reusable components (mandatory — keep current)

| Component | Location | Used for | Do NOT recreate as |
|---|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | Hero CTA, Newsletter submit, Closing CTA | A one-off styled `<a>`/`<button>` per section |
| `SectionContainer` | `src/components/ui/SectionContainer.tsx` | Max-width/padding/background wrapper for all 10 sections | Per-section ad-hoc container divs |
| `Card` | `src/components/ui/Card.tsx` | News items (×3), Tournaments steps | A near-duplicate card variant per section |

Update this table whenever a new reusable component is added.

## Layout

Single-column, full-width sections stacked vertically in the fixed rubric
order (Hero → Footer). `SectionContainer` caps content width and applies
consistent horizontal padding; no sidebar, no multi-column page grid.

## Responsive behavior

Mobile-first, Tailwind default breakpoints (`sm`/`md`/`lg`) — no custom
breakpoints needed for a single-page site. Verify no horizontal overflow at
375px (mobile), 768px (tablet), 1440px (desktop) for every section.

## Accessibility

- Contrast: see table above — verify with Lighthouse before shipping.
- Focus-visible states required on every interactive element (CTA buttons,
  language switcher, newsletter input/button).
- Alt text: logo images get a real `alt`; purely decorative shapes get
  `alt=""`.
- Language switcher must be a real `<a>`/`next-intl` `Link` (works with JS
  disabled) — never a JS-only toggle.
- Motion respects `prefers-reduced-motion` (via `motion` library defaults).

## Animation / motion

`motion` (ex-Framer Motion) for scroll-reveal and micro-interactions.
Subtle, short-duration (150-300ms) transitions — nothing that blocks
reading the content. Never animate purely for decoration on a slow
connection; respect `prefers-reduced-motion`.

## Logo usage matrix

| Context | Asset | Background |
|---|---|---|
| Favicon / small icon | `Símbolo*` family (SVG + rasterized PNG for `.ico`/apple-touch-icon) | any |
| Header logo | `v2Positivo.svg` | Light (`brand-white`) sections |
| Footer / dark sections | `v2Negativo.svg` | `brand-dark` background |
| OG image (1200×630) | Composited from `v2Positivo`/`v2Degradado` | Static, one per site (not per-locale) |

`Degradado` and `Black` logo variants stay out of `public/` — risk of
clashing with the flat brand palette the rubric grades; source files remain
untouched in `~/Downloads/LogotiposTechToJob/`.

## Forbidden patterns

- No emoji anywhere in the UI — use `lucide-react` icons.
- No inline styles, no ad-hoc one-off colors outside the token table above.
- No stock photography of generic "office people" — see Design principles.
- No hardcoded copy in `.tsx` files — everything through `messages/*.json`.
