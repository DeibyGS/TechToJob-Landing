# Tasks: Unify Button Component

- [x] T1 — Build the shared `Button` component (`cta` + `pill` variants, polymorphic `as`) [L] — implements AC-01, AC-02, AC-03, AC-04, AC-07, AC-08, AC-09, AC-10 — Depends on: none
  - Done when: `Button.tsx` exports both variants; `cta` reproduces `DiscordCtaButton`'s ref-measured expand/cross-fade mechanic generalized for any `trailingIcon`; `pill` reproduces the current nav-pill classNames with `isActive`; `as` prop lets a caller render a different element (e.g. `next-intl`'s `Link`) while still getting the pill className; zero `motion` import (`grep -c "from \"motion" src/components/ui/Button.tsx` → 0). Shipped with a small deviation: `icon`/`trailingIcon` are typed as a custom `IconComponent` (not lucide-react's `LucideIcon`) so DiscordIcon.tsx's plain function component satisfies the type too.

- [x] T2 — Migrate Hero, Closing, HowItWorks (3 steps) to `variant="cta"` [M] — implements AC-01, AC-02, AC-03, AC-04 — Depends on: T1
  - Done when: `HeroStage.tsx`, `ClosingSection.tsx`, `HowItWorksStage.tsx` no longer import `DiscordCtaButton`; visual output unchanged (same height/padding/shadow) for Hero/Closing/steps 2-3; step 1 still reproduces the pre-existing hover bug at this point (fixed in T5, not here) so this task's diff stays purely mechanical.

- [x] T3 — Migrate Newsletter submit button to `variant="cta"` [S] — implements AC-01, AC-E1 — Depends on: T1
  - Done when: `NewsletterForm.tsx`'s inline `<button>` (added as a same-session stopgap) is replaced by `<Button variant="cta" type="submit" disabled={...} .../>`; height/padding now comes from the shared component, not a hand-copied className string; pending-disabled state still visually disables the button and blocks a second submit.

- [x] T4 — Migrate `BackToTop` to `variant="cta"` with `trailingIcon={ArrowUp}` [S] [P] — implements AC-01, AC-05 — Depends on: T1
  - Done when: hover/focus now visibly animates (lift + arrow reveal) — the missing `group` class bug is gone because it's structurally impossible to reintroduce via the shared component; arrow points up, not right.

- [x] T5 — Investigate and fix the HowItWorks step-1 hover bug [M] — implements AC-06 — Depends on: T2
  - Root cause found via devtools (Deiby inspected the element under the cursor while hovering step 1's button — it highlighted step 2's `<a>` instead). The timeline's `.set()` calls for `pointerEvents` lived at the same timeline position (`at`) as the `.to()` opacity tweens. `.set()` is instantaneous while `.to()` interpolates — so at timeline progress 0 (page load, before any real scroll), pointerEvents already flipped to step 2 while step 1's opacity tween was still at 0% progress (visually fully opaque). Fixed by moving both `.set()` calls to position `">"` (right after the opacity tween finishes) in `howItWorks.ts`.

- [x] T6 — Migrate `NavLinks` to `variant="pill"` [M] [P] — implements AC-07, AC-10 — Depends on: T1
  - Done when: `NavLinks.tsx` renders `<Button variant="pill" isActive={...} onClick={...} href={...} />` per link; `IntersectionObserver`, `suppressObserverRef`, and the Lenis-scroll `handleClick` logic are unchanged, living entirely in `NavLinks.tsx`; visual output (pill look, active/hover states) unchanged.

- [x] T7 — Migrate `LanguageSwitcher` to `variant="pill"` via the `as` prop [S] [P] — implements AC-07, AC-08 — Depends on: T1
  - Done when: `LanguageSwitcher.tsx` renders `<Button variant="pill" as={Link} locale={locale} href={pathname} scroll={false} isActive={isCurrent} .../>` (or equivalent); locale-prefixed navigation still works correctly for both `es` and `en`; the `scroll={false}` fix from earlier this session is preserved.

- [x] T8 — Delete `DiscordCtaButton.tsx` [S] — implements (cleanup, no direct AC) — Depends on: T2, T3, T4
  - Done when: no remaining imports of `DiscordCtaButton` anywhere in `src/`; `npx tsc --noEmit` clean.

- [ ] T9 — Manual visual + accessibility verification pass [M] — implements AC-01 through AC-10, AC-E1 — Depends on: T2, T3, T4, T5, T6, T7, T8
  - Done when: every CTA-style button visually matches (height/padding/shadow) side by side in the browser (both `/es` and `/en`); tab-through confirms `focus-visible` rings on all of them; `prefers-reduced-motion` toggled on shows resting labels without relying on hover; Newsletter's disabled-pending state still blocks double-submit.

Task sizes: S (<1h) | M (1-3h) | L (3-6h, consider splitting)
`[P]` = can run in parallel with other `[P]` tasks at the same dependency level (T4, T6, T7 all only depend on T1).
