export const SOCIAL_LINKS = {
  discord: "https://discord.gg/h9FFgKdkRd",
  linkedin: "https://www.linkedin.com/company/techtojob/",
  x: "https://x.com/techtojob",
  instagram: "https://www.instagram.com/techtojob",
} as const;

// TODO: Switch to custom domain once DNS is configured and verified.
// Tracked in docs/ARCHITECTURE.md evolution notes.
export const SITE_URL = "https://tech-to-job-landing-nine.vercel.app";

// The header's real rendered height at the desktop breakpoint every
// scroll-position calculation below cares about (`Header.tsx`'s `md:h-20`
// — the GSAP-driven consumers of this constant only run at >=1024px, where
// `md:` is already active). Single source of truth so "80" doesn't end up
// independently guessed in three different places that happen to agree by
// coincidence — keep this in sync if `Header.tsx`'s height class changes.
export const HEADER_HEIGHT_PX = 80;

// Extra breathing room (beyond HEADER_HEIGHT_PX) for content pinned right
// under the header — e.g. HowItWorksStage's GSAP pin. Without this, pinned
// content's top edge rests flush against the header's bottom edge with
// zero gap, which reads as visually cramped even though nothing is
// actually hidden underneath it anymore.
export const PINNED_CONTENT_TOP_GAP_PX = 56;

// The click-to-scroll clearance NavLinks.tsx relies on so the fixed header
// (once revealed) doesn't cover a section's top edge lives in globals.css's
// `section[id] { scroll-margin-top: 80px }` — Lenis reads that natively when
// resolving an element scroll target, so NavLinks.tsx passes no explicit JS
// offset (doing both double-counts the clearance). Keep that CSS value in
// sync with HEADER_HEIGHT_PX above if the header's height class ever changes.

// HeaderReveal.tsx's show/hide ScrollTrigger buffer must stay meaningfully
// LARGER than the header's scroll clearance (HEADER_HEIGHT_PX, effectively —
// see globals.css above) — not just larger — or a nav-link landing spot can
// end up back on the "hidden" side of the threshold and the header hides
// itself right after being used to navigate. This used to be an independent
// magic number (100) with only a 20px margin over the clearance, which
// wasn't enough slack for real-world scroll-settling variance and
// reproduced exactly that bug.
export const HEADER_REVEAL_BUFFER_PX = 160;
