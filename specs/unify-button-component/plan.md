# Plan: Unify Button Component

### Affected files

| File | Action | Reason |
|------|--------|--------|
| `src/components/ui/Button.tsx` | MODIFY (full rewrite) | Becomes the single shared component: `variant="cta"` (replaces `DiscordCtaButton`'s behavior) and `variant="pill"` (replaces the duplicated nav-pill classNames). |
| `src/components/ui/DiscordCtaButton.tsx` | DELETE | Folded into `Button`'s `cta` variant. |
| `src/components/sections/HeroStage.tsx` | MODIFY | `<DiscordCtaButton {...community} />` → `<Button variant="cta" ... />`. |
| `src/components/sections/ClosingSection.tsx` | MODIFY | Same swap. |
| `src/components/sections/HowItWorksStage.tsx` | MODIFY | Same swap for each of the 3 step CTAs; investigate + fix AC-06 (step 1 hover). |
| `src/components/forms/NewsletterForm.tsx` | MODIFY | Replace the inline `<button>` (added earlier this session as a stopgap) with `<Button variant="cta" type="submit" .../>`. |
| `src/components/ui/BackToTop.tsx` | MODIFY | Replace raw `<a>` with `<Button variant="cta" trailingIcon={ArrowUp} .../>` — fixes the missing `group` class bug for free by construction. |
| `src/components/layout/NavLinks.tsx` | MODIFY | Replace the raw `<a>` + manual className ternary with `<Button variant="pill" .../>`, keeping its own `onClick`/Lenis/`IntersectionObserver` logic untouched. |
| `src/components/layout/LanguageSwitcher.tsx` | MODIFY | Replace the raw `Link` + manual className ternary with the pill variant's className, but keep rendering `next-intl`'s `Link` itself (see "Polymorphism" below) — do not lose the `scroll={false}` fix already applied. |
| `src/app/globals.css` | READ only | No changes expected — no new keyframes needed (`cta`'s expand-on-hover reuses the existing width-measurement pattern already proven in `DiscordCtaButton`). |

### Component API sketch

Two variants, not three — `BackToTop` turns out to be a plain `cta`-variant usage with a custom trailing icon (`ArrowUp` instead of `ArrowRight`) rather than its own visual language once the missing `group` class bug is fixed. This keeps the component surface smaller, which directly serves the "escalable y mantenible" requirement.

```tsx
type ButtonVariant = "cta" | "pill";

type CommonProps = {
  variant?: ButtonVariant; // default "cta"
  label: string;
  className?: string;
};

// cta-only
type CtaExtras = {
  hoverLabel?: string;       // defaults to `label` → no text swap, arrow-only reveal (AC-04)
  icon?: LucideIcon;         // leading icon; omitted → Discord CDN glyph (Hero/Closing default today)
  trailingIcon?: LucideIcon; // defaults to ArrowRight; BackToTop passes ArrowUp
};

// pill-only
type PillExtras = {
  isActive?: boolean;
};

// Polymorphic "as" — needed so LanguageSwitcher can render next-intl's
// locale-aware `Link` instead of a plain `<a>`, without the shared
// component knowing anything about next-intl.
type AsAnchor = { href: string; as?: ElementType; external?: boolean };
type AsButton = { href?: undefined; type?: "button" | "submit"; onClick?: React.MouseEventHandler; disabled?: boolean };

type ButtonProps = CommonProps & Partial<CtaExtras> & Partial<PillExtras> & (AsAnchor | AsButton);
```

- `variant="cta"` renders the current `DiscordCtaButton` markup/mechanic (ref-measured collapsed/expanded label widths, cross-fade, trailing icon) exactly as-is, generalized to accept any `trailingIcon` (default `ArrowRight`) instead of hardcoding it.
- `variant="pill"` renders the current `NavLinks`/`LanguageSwitcher` markup (rounded-full, border, `isActive` fill) with no hover-expand mechanic — just the existing `hover:bg-brand-teal` treatment.
- `as` prop: when provided (e.g. `LanguageSwitcher` passing next-intl's `Link`), the component renders that element type instead of `<a>`, forwarding `href`/`locale`/`scroll` and any other props through — this is the only way to satisfy AC-08 without the shared component importing next-intl itself (would violate the "generic UI component" boundary).

### Dependencies
- `lucide-react` — `ArrowRight` (existing), `ArrowUp` (new, for BackToTop).
- `next/image` — existing Discord CDN glyph fallback, unchanged.
- No new packages.

### Explicit technical assumptions
- We assume `NavLinks.tsx`'s `IntersectionObserver`/`suppressObserverRef`/Lenis-click logic stays entirely inside `NavLinks.tsx` — `Button` only receives `isActive` + `onClick` + `href`, it has no awareness of scroll behavior. If this assumption is wrong (i.e. `Button` needs scroll awareness), stop and re-open the spec.
- We assume the step-1-hover bug (AC-06) is caused by something in `howItWorks.ts`'s GSAP pin/scrub setup (confirmed today: `pointerEvents:"none"` is already correctly set on steps 2-3 from the start, so the bug is elsewhere — likely the ScrollTrigger `pin` spacer or trigger element). If root-causing takes longer than one focused investigation pass, treat it as a separate `BUG-XXX` follow-up rather than blocking this PR — flag in the PR body, do not silently drop the AC.
- We assume `focus-visible:ring-offset-brand-dark` (used today on dark-background CTAs) needs to become `ring-offset-brand-white` for CTAs sitting on light backgrounds (Closing section is `background="light"`) — the component needs a way to know its own background context. Simplest: accept `className` override for ring-offset color per call-site (light-bg call-sites already pass extra `className` today), not a new prop.

### Non-functional requirements
- **Accessibility**: every interactive instance keeps a visible `focus-visible` ring; `aria-current="true"` preserved for active nav pills; disabled state (`aria-disabled`/`disabled`) preserved for Newsletter's pending submit.
- **Bundle size**: net negative — one file deleted (`DiscordCtaButton.tsx`), one simplified (`Button.tsx`), no new dependencies.
- **Motion constraint**: zero `motion` import in `Button.tsx` (hard constitution rule) — verified by `grep -c "from \"motion" src/components/ui/Button.tsx` returning 0 post-implementation.

### Edge cases / risks
- **Risk**: folding `BackToTop` into the `cta` variant could visually change its shadow/shape slightly if `cta`'s exact classes don't match `BackToTop`'s current ones 1:1. → Mitigation: diff the two className strings before replacing; carry over any BackToTop-specific value (e.g. its shadow color) as a `className` override rather than silently normalizing it to Hero's exact shadow if they differ.
- **Risk**: `LanguageSwitcher`'s `as={Link}` polymorphism could break TypeScript prop-forwarding (locale-aware `Link` has a `locale` prop that plain `<a>` doesn't). → Mitigation: type the `as` prop loosely enough (`ElementType`) that TS doesn't fight it, and spread any extra caller-supplied props (`{...rest}`) through untyped at the `Button` boundary — the caller (LanguageSwitcher) remains responsible for passing valid props for whatever `as` it supplies.
- **Risk**: AC-06's root cause might require touching GSAP timeline code, which is higher-risk than a pure styling change. → Mitigation: per "Ask first" boundary in spec.md, confirm the specific fix approach with Deiby before touching `howItWorks.ts` if it comes to that.
