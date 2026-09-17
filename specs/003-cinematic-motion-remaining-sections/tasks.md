## Tasks — Phase 2: Cinematic Motion Remaining Sections

### Sub-fase 2A — Talent + Company

- [ ] 2A.1 Enhance `TalentSection.tsx` with staggered `Reveal` instances
  (headline → description+bullets → card), delay 0/0.1/0.2 [S]
  - Files: `src/components/sections/TalentSection.tsx`
  - AC: AC-2A1, AC-2A3

- [ ] 2A.2 Enhance `CompanySection.tsx` with matching stagger pattern
  (preserve `md:order-1`/`md:order-2` grid) [S]
  - Files: `src/components/sections/CompanySection.tsx`
  - AC: AC-2A2, AC-2A3

- [ ] 2A.3 (Optional) Add subtle parallax to example cards via thin
  client wrapper or enhanced `Reveal` [S]
  - Depends: 2A.1, 2A.2
  - AC: AC-2A-S1
  - Skip if parallax adds complexity without visible benefit

### Sub-fase 2B — Tournaments (flagship)

- [ ] 2B.1 Create `TournamentsStage.tsx` — Client Component shell with
  `useRef`, `useScroll`, `useTransform` for 3-step scroll-scrub [M]
  - Files: `src/components/sections/TournamentsStage.tsx`
  - AC: AC-2B1, AC-2B2, AC-2B3, AC-2B6

- [ ] 2B.2 Implement scroll-scrub animation: per-step opacity + y offset
  mapped via `useTransform` with 3-phase ranges [M]
  - Depends: 2B.1
  - AC: AC-2B2, AC-2B3, AC-2B7

- [ ] 2B.3 Add scroll reversal coherence — ensure upward scroll reverses
  step transitions without flash [S]
  - Depends: 2B.2
  - AC: AC-2B4

- [ ] 2B.4 Add mobile fallback — `Reveal`-based sequential entrance for
  `< 1024px` viewport [S]
  - Depends: 2B.1
  - AC: AC-2B5

- [ ] 2B.5 Add `useReducedMotion` guard — disable scroll-scrub, render
  steps statically [S]
  - Depends: 2B.1
  - AC: AC-G2

- [ ] 2B.6 Refactor `TournamentsSection.tsx` into thin Server Component
  shell that renders headline/description and delegates steps to
  `TournamentsStage` [S]
  - Depends: 2B.1, 2B.2, 2B.4, 2B.5
  - AC: AC-2B1, AC-2B6

- [ ] 2B.7 (Optional) Add `useSpring` smoothing for scroll-progress
  mapping [S]
  - Depends: 2B.2
  - AC: AC-2B-S1

- [ ] 2B.8 (Optional) Add active-step scale/opacity emphasis [S]
  - Depends: 2B.2
  - AC: AC-2B-S2

### Sub-fase 2C — Networking, News, Newsletter, Closing, Footer

- [ ] 2C.1 Enhance `NetworkingSection.tsx` — staggered `Reveal` per
  channel tag [S]
  - Files: `src/components/sections/NetworkingSection.tsx`
  - AC: AC-2C1

- [ ] 2C.2 Enhance `NewsSection.tsx` — featured card with prominent
  reveal + staggered secondary cards [S]
  - Files: `src/components/sections/NewsSection.tsx`
  - AC: AC-2C2

- [ ] 2C.3 Enhance `NewsletterSection.tsx` — headline → description →
  form sequential reveals [S]
  - Files: `src/components/sections/NewsletterSection.tsx`
  - AC: AC-2C3

- [ ] 2C.4 Enhance `ClosingSection.tsx` — headline+description → CTA
  coordinated entrance [S]
  - Files: `src/components/sections/ClosingSection.tsx`
  - AC: AC-2C4

- [ ] 2C.5 Footer — keep static (no animation) [S]
  - Files: none
  - AC: AC-2C5

### Validation

- [ ] V.1 Run `npm run build && npm run lint && npx tsc --noEmit` — all
  green [S]
- [ ] V.2 Manual visual review: desktop (`>= 1024px`) and mobile
  (`< 1024px`), both locales (`/es`, `/en`) [S]
- [ ] V.3 Verify `prefers-reduced-motion` disables all new animations
  (Chrome DevTools emulation) [S]
- [ ] V.4 Verify Tournaments scroll-scrub reversal (scroll up/down
  through section) [S]

### Parallelizable
- 2A.1 and 2A.2 can run in parallel [P]
- 2C.1, 2C.2, 2C.3, 2C.4 can all run in parallel [P]
- 2B.7 and 2B.8 can run in parallel [P]
