# Spec: TechToJob landing page

### Status: APPROVED
### Version: 1.0

### Recovered context
- Project constitution (`docs/constitution.md`): static-first, no backend/DB/auth,
  one third-party integration (Formspree) allowed, no emoji, English code /
  bilingual (es default + en) content.
- Relevant ADRs: none — classified as a design decision (low cost of
  reversal), not architectural. No `docs/adr/` in this project.
- Engram decisions: none found (`mem_search "TechToJob landing torneo"` — no
  prior memories, this is the first session on this project).
- Corrected assumptions from Step 2: none — all 7 assumptions confirmed
  as-is by Deiby, including: single spec for the whole landing; PR1
  (scaffold/tooling) already implemented and marked done in `tasks.md`;
  "IMPLEMENTED" status only requires structure + `[TODO]` copy placeholders,
  final marketing copy is Deiby's separate pass and does not block it.

### What does it do?

A single-page, static, bilingual (Spanish default + English) marketing
landing for **TechToJob**, a Discord-first tech community — built for
"Torneo #2", a design/dev competition. If it wins, this becomes the
company's real public website. The page presents 10 fixed sections in a
fixed order (Hero, How it works, Offer yourself as talent, Post as a
company, Tournaments, Networking, News, Newsletter, Closing, Footer),
communicates that TechToJob is a community — not a job board — and lets a
visitor join the Discord community or subscribe to a newsletter (via
Formspree, no backend of our own).

### Boundaries

**Always do:**
- Keep every user-facing string in `messages/{es,en}.json` — never hardcode
  copy in a `.tsx` file.
- Use `lucide-react` for any icon; never an emoji character.
- Follow the brand contrast table in `docs/DESIGN.md` (`brand-teal` never as
  small body text on white).
- Keep Formspree-specific code confined to `src/components/forms/NewsletterForm.tsx`.
- Use only the real, confirmed links in `src/lib/constants.ts` (Discord,
  LinkedIn, X, Instagram) — never invent member/company statistics.

**Ask first (do not proceed unilaterally):**
- Adding any external dependency not already listed in `docs/constitution.md`'s
  stack table.
- Changing the 3 mandatory brand colors or the font.
- Writing final marketing copy into `messages/*.json` (that's Deiby's pass,
  worth 25% of the competition score) — leave `[TODO]` placeholders instead.

**Never do:**
- Add a backend/API route, database, or authentication of our own.
- Hardcode Discord/social URLs outside `src/lib/constants.ts`.
- Commit a real Formspree form ID value (only the placeholder in
  `.env.local.example`).

### Acceptance criteria

#### Sections — structure (content itself is graded separately, not by AC)

- `[MUST]` AC-01: THE system shall render a Hero section with exactly one
  CTA button, linking to the Discord invite URL from `SOCIAL_LINKS.discord`.
- `[MUST]` AC-02: THE system shall render a "How it works" section as an
  ordered list of steps sourced from `HowItWorks.steps` in messages, with no
  hardcoded step count in JSX.
- `[MUST]` AC-03: THE system shall render a "Talent" section showing a
  structural example profile (stack, level, availability fields).
- `[MUST]` AC-04: THE system shall render a "Company" section mirroring the
  Talent section's visual pattern.
- `[MUST]` AC-05: THE system shall render a "Tournaments" section reusing
  the shared `Card` component.
- `[MUST]` AC-06: THE system shall render a "Networking" section listing
  channels/areas sourced from a messages array.
- `[MUST]` AC-07: THE system shall render a "News" section with exactly 3
  cards, each showing title/date/category/summary, generated via `.map()`
  over `News.items` — never a hardcoded 4th item.
- `[MUST]` AC-08: THE system shall render a "Newsletter" section with a form
  that submits via the isolated `NewsletterForm` component; the submit
  button label shall come from `Newsletter.submitLabel` in messages (not a
  hardcoded literal).
- `[MUST]` AC-09: THE system shall render a "Closing" section reusing the
  shared `Button` component with the same Discord CTA as the Hero.
- `[MUST]` AC-10: THE system shall render a Footer with link columns
  (talent, companies, community, legal), the 4 confirmed social links, and a
  legal notice, all sourced from messages + `lib/constants.ts`.

#### Internationalization

- `[MUST]` AC-11: WHEN a user visits `/` THE system shall redirect to the
  default locale `/es`.
- `[MUST]` AC-12: THE system shall statically generate both `/es` and `/en`
  via `generateStaticParams`.
- `[MUST]` AC-13: WHILE rendering any locale THE system shall set
  `<html lang>` to that locale's code.
- `[MUST]` AC-14: THE system shall render
  `<link rel="alternate" hreflang="es"|"en"|"x-default">` tags in the
  static HTML `<head>` for both locales.
- `[MUST]` AC-15: THE language switcher shall be a real navigable link
  (not a JS-only toggle) — verified by working with JavaScript disabled.
- `[MUST]` AC-16: No user-facing string shall be hardcoded inside a `.tsx`
  file — all copy sourced from `messages/{es,en}.json`.
- `[MUST]` AC-17: `messages/es.json` and `messages/en.json` shall have
  structurally identical keys — verified by `npm run build` succeeding
  (next-intl throws on a missing message key during static generation).

#### SEO

- `[MUST]` AC-18: THE system shall generate `/sitemap.xml` listing both
  locale versions of the page.
- `[MUST]` AC-19: THE system shall generate `/robots.txt`.
- `[MUST]` AC-20: THE system shall include Open Graph and Twitter Card
  metadata referencing a real `og-image.png`.
- `[SHOULD]` AC-21: THE system shall include JSON-LD `Organization`
  structured data using only the confirmed real social links — never
  invented member/company counts.

#### Brand identity & accessibility

- `[MUST]` AC-22: THE body font shall be Sora across every page.
- `[MUST]` AC-23: THE three mandatory brand colors (`#2f3436`, `#84c0bf`,
  `#ffffff`) shall visually dominate the design, per the token table in
  `docs/DESIGN.md`.
- `[MUST]` AC-24: `brand-teal` shall never be used as small body-text color
  on a white background.
- `[MUST]` AC-25: No emoji character shall appear anywhere in the rendered
  UI — icons come from `lucide-react` only.
- `[SHOULD]` AC-26: A Lighthouse Accessibility audit shall show no contrast
  violations on the shipped color pairs.

#### Newsletter (Formspree)

- `[MUST]` AC-27: WHEN the newsletter form is submitted with a valid email
  THE system shall POST to the Formspree endpoint configured via
  `NEXT_PUBLIC_FORMSPREE_FORM_ID`.
- `[MUST]` AC-28: WHEN the Formspree submission succeeds THE system shall
  display `Newsletter.successMessage`.
- `[SHOULD]` AC-31: IF `NEXT_PUBLIC_FORMSPREE_FORM_ID` is not set THEN the
  system shall disable the submit button and show a configuration notice,
  rather than attempting a request to an invalid URL.
- `[MUST]` AC-29: Only `NewsletterForm.tsx` shall contain Formspree-specific
  code — verified by review/grep for "formspree" across `src/`.

#### Scope / architecture guardrails

- `[MUST]` AC-30: THE project shall contain zero server-side API routes,
  zero database connections, and zero authentication code.

#### Error cases

- `[MUST]` AC-E1: WHEN the Formspree submission fails (network error or a
  non-2xx response), THE system shall display `Newsletter.errorMessage` and
  shall NOT clear the user's entered email from the input.
- `[MUST]` AC-E2: WHEN an unsupported locale is requested (e.g. `/fr`), THE
  system shall respond with a 404 via `notFound()`.

### Edge cases (business-observable)

- A visitor with JavaScript disabled can still navigate every link and
  switch language (all navigation is real `<a>`/`Link` hrefs).
- The longest placeholder string in either locale does not cause horizontal
  overflow at a 375px viewport.
- The News section always shows exactly 3 items, even before Deiby's real
  copy replaces the `[TODO]` placeholders.

### Out of scope

- `[WONT]` A real backend/job platform (talent database, company job
  postings, tournament submission system, authentication) — this landing
  only links out to Discord/social.
- `[WONT]` A CMS for the News section — 3 static mock entries only.
- `[WONT]` Additional locales beyond `es`/`en`.
- `[WONT]` An automated test suite (see `docs/TESTING.md` for why and when
  this changes).
- `[WONT]` A real ESP (Mailchimp/Brevo) beyond Formspree — noted as a clean
  future swap point in `docs/ARCHITECTURE.md`, not built now.
- `[WONT]` Final marketing copy — Deiby's separate pass; does not block this
  spec's `IMPLEMENTED` status (confirmed with Deiby).
