# Spec: Unify Button Component

### Status: APPROVED
### Version: 1.0

### Recovered context
- **Project constitution** (`docs/constitution.md`, Animation Stack section): "GSAP and `motion` are never mixed on the same DOM subtree." `Button.tsx` and `DiscordCtaButton.tsx` are already zero-`motion`-dependency by design specifically so they're safe inside the GSAP `ScrollTrigger` subtrees of Hero and HowItWorks. The unified component must preserve this.
- **No relevant ADRs** — this is a component-level design consolidation, not an architectural decision (low cost of reversal, contained to `src/components/ui/`).
- **Prior audit findings this session**:
  - `Button.tsx` (generic, shine-sweep hover) has exactly one real consumer (`NewsletterForm.tsx`) — it never established the "consistent site-wide button" it was meant to.
  - `DiscordCtaButton.tsx` is the de facto standard: used verbatim by Hero, all 3 HowItWorks steps, and Closing. Same component, same behavior everywhere it's already used.
  - `BackToTop.tsx` has an independent bug: its `<a>` is missing the `group` class, so `group-hover:-translate-y-0.5` on its arrow span never fires.
  - `NavLinks.tsx` and `LanguageSwitcher.tsx` already share one pill visual language (confirmed via existing code comment), but duplicate the className strings — consolidation here is a DRY win, not a bug fix.
- **User decisions (this session, via clarifying questions)**:
  1. One single `Button` component replaces both `Button.tsx` and `DiscordCtaButton.tsx` — not two parallel components.
  2. The arrow standard across the site: hidden at rest, appears on hover together with a width expansion (matches today's `DiscordCtaButton` behavior) — this becomes the CTA-style default everywhere.
  3. Scope explicitly includes: action CTAs (Hero, HowItWorks×3, Closing, Newsletter submit), nav pills (`NavLinks`, `LanguageSwitcher`), and `BackToTop`.

### What does it do? (observable behavior, not implementation)
Every clickable element on the landing that currently looks like a "button" (filled CTA, nav pill, or the footer's back-to-top control) is driven by one shared component, so a single visual/behavioral change updates all of them consistently. Concretely:
- Every CTA-style button (Hero's "Unirse a la comunidad", the 3 HowItWorks step CTAs, Closing's CTA, Newsletter's submit, and the footer's "Volver arriba") has **identical height, padding, corner radius, fill color, and glow shadow** — no visible size mismatch between any two of them.
- On every CTA-style button, hovering reveals a trailing arrow (and swaps the label to a hover-specific one, where one is provided) — no CTA is missing this feedback, and none show the arrow while at rest.
- Nav pills (section links in the header, the ES/EN language switcher) keep their existing pill look, now driven by the same shared component as everything else, so future visual tweaks to "how a pill looks" only need to happen in one place.
- The footer's "Volver arriba" control visibly lifts/reacts on hover (currently broken — no hover feedback at all).

### Boundaries
**Always do:**
- Preserve `prefers-reduced-motion` behavior already present in each consumer (Hero/HowItWorks/Closing/Newsletter/NavLinks already respect it where applicable).
- Preserve all existing `aria-*`, `role`, and keyboard-focus (`focus-visible`) behavior — this is a visual/structural consolidation, not an accessibility regression.
- Keep zero runtime dependency on `motion` in the shared component itself (plain CSS transitions/animations only).

**Ask first (do not proceed unilaterally):**
- Changing any copy/label text (that's Deiby's own pass — out of scope here regardless).
- Changing the underlying GSAP pin/scrub timeline in `howItWorks.ts` beyond what's strictly needed to fix AC-06 (the step 1 hover bug) — if the fix requires touching the timeline, confirm the approach before applying it.

**Never do:**
- Add `motion` (or any new animation library) as a dependency of the shared component.
- Change `NavLinks`' Lenis-scroll click behavior or `IntersectionObserver` active-section tracking logic — only the pill's *rendering/styling* is being consolidated, not its navigation behavior.
- Change `LanguageSwitcher`'s use of `next-intl`'s locale-aware `Link` for actual navigation — the shared component must be able to render as that `Link` for this one case, not force a plain `<a>`.

### Acceptance criteria

- `[MUST]` AC-01: The system shall render every CTA-style button (Hero, HowItWorks step 1/2/3, Closing, Newsletter submit, BackToTop) with the same height, horizontal padding, border radius, and fill/shadow treatment.
- `[MUST]` AC-02: WHEN a user hovers any CTA-style button THE system SHALL reveal a trailing arrow that was not visible at rest.
- `[MUST]` AC-03: WHEN a CTA-style button is given a distinct hover label (e.g. Hero's "Conectar con la comunidad") THE system SHALL cross-fade from the resting label to the hover label without a layout jump.
- `[MUST]` AC-04: Given a CTA-style button with no distinct hover label (e.g. each HowItWorks step CTA), WHEN hovered THE system SHALL reveal only the trailing arrow, keeping the same label text.
- `[MUST]` AC-05: WHEN a user hovers or focuses the "Volver arriba" control THE system SHALL visibly animate it (lift and/or arrow movement) — today it shows no hover feedback at all.
- `[MUST]` AC-06: Given the HowItWorks section is scrolled into its pinned/scrubbed state showing step 1, WHEN a user hovers step 1's CTA, THEN the hover animation fires exactly like it does for steps 2 and 3 (currently reported broken for step 1 specifically).
- `[MUST]` AC-07: The nav section links (header) and the language switcher (ES/EN) shall keep their current pill appearance (rounded pill, subtle border, teal fill on active/hover) after being re-driven by the shared component.
- `[MUST]` AC-08: Given the language switcher, WHEN a user switches locale, THEN the navigation still resolves through `next-intl`'s locale-aware routing (correct `/es`/`/en` prefixing) — the shared component must not force a plain anchor that bypasses this.
- `[SHOULD]` AC-09: WHEN `prefers-reduced-motion` is enabled THE system SHALL still show every button's resting label/state without relying on the hover-reveal transition to convey information.
- `[MUST]` AC-10: Given a screen-reader or keyboard-only user, WHEN they tab to any CTA-style button, THEN a visible focus ring appears (parity with today's `focus-visible` treatment) and the accessible label reflects the resting (non-hover) label so it's never announced with a stale mid-transition value.

#### Error cases
- `[MUST]` AC-E1: Given the Newsletter form's submit button is disabled (submission pending), WHEN a user attempts to interact with it, THEN it shows the disabled visual state and does not trigger a second submission.

### Edge cases
- A CTA-style button that never gets a distinct hover label (HowItWorks steps) must not show an awkward "swap to identical text" flicker — only the arrow should animate in.
- BackToTop's arrow direction (up) differs from every other CTA-style button's arrow direction (right) — the shared component must support a custom trailing icon per usage, not hardcode `ArrowRight`.
- The language switcher's "button" isn't a real navigation event handler — it's next-intl's `Link` — the shared component's polymorphism must not break locale prefixing or the existing `scroll={false}` fix already applied there.

### Out of scope
- `[WONT]` Changing any button's copy/label wording.
- `[WONT]` Redesigning the nav pill or CTA visual language itself (colors, shapes) — this is a consolidation of existing, already-approved looks into one component, not a redesign.
- `[WONT]` Touching `TournamentsStage.tsx` or any section not currently using `Button.tsx`/`DiscordCtaButton.tsx`/raw button-like markup identified in this session's audit.
