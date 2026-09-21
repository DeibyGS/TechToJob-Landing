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

// NavLinks.tsx offsets its click-to-scroll target by this many px so the
// fixed header (once revealed) doesn't cover it — literally the header's
// height, not an independent guess.
export const HEADER_SCROLL_OFFSET_PX = HEADER_HEIGHT_PX;

// HeaderReveal.tsx's show/hide ScrollTrigger buffer must stay meaningfully
// LARGER than HEADER_SCROLL_OFFSET_PX — not just larger — or a nav-link
// landing spot can end up back on the "hidden" side of the threshold and
// the header hides itself right after being used to navigate. This used to
// be an independent magic number (100) with only a 20px margin over the
// offset, which wasn't enough slack for real-world scroll-settling
// variance and reproduced exactly that bug.
export const HEADER_REVEAL_BUFFER_PX = 160;
