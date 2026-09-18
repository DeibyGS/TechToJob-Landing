import gsap from "gsap";
import { EASE, MEDIA_TABLET_UP, prefersReducedMotion, runInScope } from "./utils";

/**
 * Hero staged entrance (word-by-word headline → subheadline → logo
 * signature → showcase bento tiles → community status bar) plus, on
 * tablet/desktop only, a scroll-linked exit, mouse-driven depth parallax
 * + subtle tilt on the showcase wrap. Mobile gets the entrance only —
 * parallax/tilt/scroll-exit aren't worth their cost at that scale, and
 * cursor-driven effects don't apply to touch input. The tablet/desktop
 * behaviors are registered via `gsap.matchMedia()` so they activate/revert
 * live if the viewport crosses the breakpoint. No-ops entirely under
 * reduced motion.
 */
export function initHeroAnimation(container: HTMLElement): () => void {
  if (prefersReducedMotion()) return () => {};

  return runInScope(container, () => {
    const wordInners = container.querySelectorAll("[data-hero-word-inner]");
    const headline = container.querySelector("[data-hero-headline]");
    const subheadline = container.querySelector("[data-hero-subheadline]");
    const icon = container.querySelector("[data-hero-icon]");
    const showcaseGlow = container.querySelector("[data-mockup-glow]");
    const showcaseCards = container.querySelectorAll("[data-hero-showcase-card]");
    const midLayer = container.querySelector("[data-hero-mid-layer]");
    const showcaseWrap = container.querySelector("[data-mockup-wrap]");
    const communityBar = container.querySelector("[data-hero-community]");
    const scrollIndicator = container.querySelector("[data-hero-scroll-indicator]");

    // --- Entrance: staged reveal with dramatic rhythm ---
    const entrance = gsap.timeline();

    // Word-by-word headline reveal — each word gets clip-path + fade + y,
    // staggered by 0.08s. The wrapper (data-hero-word) has overflow-hidden
    // to mask each word, creating a cinematic line-by-line feel.
    if (wordInners.length) {
      entrance.fromTo(
        wordInners,
        { opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.5,
          stagger: 0.08,
          ease: EASE.entrance,
        },
        0.1,
      );
    } else if (headline) {
      // Fallback: if word spans weren't rendered (SSR edge case), animate
      // the whole headline as a single block with the original clip-path.
      entrance.fromTo(
        headline,
        { opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: EASE.entrance },
        0.1,
      );
    }

    if (subheadline) {
      entrance.fromTo(
        subheadline,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: EASE.entranceSoft },
        0.6,
      );
    }

    // Brand mark — legible, leads the composition (per docs/DESIGN.md,
    // this is the only readable "TechToJob" on first load, since the
    // header's own wordmark stays hidden until scrolled past).
    if (icon) {
      entrance.fromTo(icon, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE.entranceSoft }, 0);
    }

    if (showcaseGlow) {
      entrance.fromTo(
        showcaseGlow,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1.1, duration: 0.8, ease: EASE.entranceSoft },
        1.0, // subtle, after logo
      );
    }

    if (showcaseCards.length) {
      entrance.fromTo(
        showcaseCards,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: EASE.entranceSoft },
        1.1,
      );
    }

    // Community status bar — fades in after showcase cards
    if (communityBar) {
      entrance.fromTo(
        communityBar,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: EASE.entranceSoft },
        1.2,
      );
    }

    if (midLayer) {
      entrance.fromTo(
        midLayer.children,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: EASE.cta },
        1.3, // last to appear — ambient
      );
    }

    // Scroll indicator — fade in after everything else
    if (scrollIndicator) {
      entrance.fromTo(
        scrollIndicator,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: EASE.entranceSoft },
        1.5,
      );
    }

    // --- Desktop/tablet scroll + cursor behaviors ---
    const mm = gsap.matchMedia();

    mm.add(MEDIA_TABLET_UP, () => {
      // Scroll exit: driven off ONE shared timeline + ScrollTrigger
      const textEls = [headline, subheadline].filter((el): el is Element => el !== null);
      const exitTl = gsap.timeline({
        scrollTrigger: { trigger: container, start: "top top", end: "+=40%", scrub: true },
      });
      if (showcaseWrap) {
        exitTl.fromTo(
          showcaseWrap,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: 0.92, ease: EASE.scrub, duration: 40 },
          0,
        );
      }
      if (communityBar) {
        exitTl.fromTo(
          communityBar,
          { opacity: 1 },
          { opacity: 0, ease: EASE.scrub, duration: 10 },
          0,
        );
      }
      if (textEls.length) {
        exitTl.fromTo(textEls, { opacity: 1 }, { opacity: 0, ease: EASE.scrub, duration: 15 }, 0);
      }

      // Fade scroll indicator on exit
      if (scrollIndicator) {
        exitTl.fromTo(
          scrollIndicator,
          { opacity: 1 },
          { opacity: 0, ease: EASE.scrub, duration: 5 },
          0,
        );
      }

      // Depth parallax: 2 layers move at different rates toward the cursor
      // (the ambient wash used to be a 3rd layer here, but it now lives at
      // section level via SectionContainer's backgroundDecoration slot —
      // outside this GSAP scope — so it keeps its own CSS drift only).
      if (midLayer || showcaseWrap) {
        const quickToOpts = { duration: 0.6, ease: "power3.out" };
        const midX = midLayer ? gsap.quickTo(midLayer, "x", quickToOpts) : null;
        const midY = midLayer ? gsap.quickTo(midLayer, "y", quickToOpts) : null;
        const fgX = showcaseWrap ? gsap.quickTo(showcaseWrap, "x", quickToOpts) : null;
        const fgY = showcaseWrap ? gsap.quickTo(showcaseWrap, "y", quickToOpts) : null;

        // Subtle 3D tilt on the showcase wrapper
        let tiltX: gsap.QuickToFunc | null = null;
        let tiltY: gsap.QuickToFunc | null = null;
        if (showcaseWrap) {
          gsap.set(showcaseWrap, { transformPerspective: 800 });
          tiltX = gsap.quickTo(showcaseWrap, "rotationY", quickToOpts);
          tiltY = gsap.quickTo(showcaseWrap, "rotationX", quickToOpts);
        }

        const onMouseMove = (event: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          const relX = (event.clientX - rect.left) / rect.width - 0.5;
          const relY = (event.clientY - rect.top) / rect.height - 0.5;

          midX?.(relX * 8);
          midY?.(relY * 8);
          fgX?.(relX * 3);
          fgY?.(relY * 3);
          tiltX?.(relX * -6);
          tiltY?.(relY * 6);
        };

        container.addEventListener("mousemove", onMouseMove);
        return () => container.removeEventListener("mousemove", onMouseMove);
      }
    });
  });
}
