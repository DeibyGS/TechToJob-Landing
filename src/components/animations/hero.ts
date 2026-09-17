import gsap from "gsap";
import { EASE, MEDIA_TABLET_UP, prefersReducedMotion, runInScope } from "./utils";

/**
 * Hero staged entrance (headline -> subheadline -> CTA -> mockup messages)
 * plus, on tablet/desktop only, a scroll-linked exit (scale/fade) and a
 * paused-when-offscreen idle float. Mobile gets the entrance only — the
 * scroll-linked exit and idle float aren't worth their cost at that scale.
 * The tablet/desktop behaviors are registered via `gsap.matchMedia()` so
 * they activate/revert live if the viewport crosses the breakpoint, instead
 * of being decided once at mount. No-ops entirely under reduced motion.
 */
export function initHeroAnimation(container: HTMLElement): () => void {
  if (prefersReducedMotion()) return () => {};

  return runInScope(container, () => {
    const headline = container.querySelector("[data-hero-headline]");
    const subheadline = container.querySelector("[data-hero-subheadline]");
    const cta = container.querySelector("[data-hero-cta]");
    const mockupRoot = container.querySelector("[data-mockup-root]");
    const mockupMessages = container.querySelectorAll("[data-mockup-message]");

    const entrance = gsap.timeline();

    if (mockupRoot) {
      entrance.from(mockupRoot, { opacity: 0, scale: 0.96, duration: 0.8, ease: EASE.entrance }, 0);
    }
    if (headline) {
      entrance.from(
        headline,
        { opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: EASE.entrance },
        0.1,
      );
    }
    if (subheadline) {
      entrance.from(subheadline, { opacity: 0, y: 10, duration: 0.5, ease: EASE.entranceSoft }, 0.4);
    }
    if (cta) {
      entrance.from(cta, { opacity: 0, scale: 0.95, duration: 0.4, ease: EASE.cta }, 0.6);
    }
    if (mockupMessages.length) {
      entrance.from(
        mockupMessages,
        { opacity: 0, y: 8, duration: 0.35, stagger: 0.06, ease: EASE.entranceSoft },
        0.35,
      );
    }

    const mm = gsap.matchMedia();

    mm.add(MEDIA_TABLET_UP, () => {
      if (mockupRoot) {
        gsap.to(mockupRoot, {
          scale: 0.92,
          y: -40,
          opacity: 0,
          ease: EASE.scrub,
          scrollTrigger: { trigger: container, start: "top top", end: "+=40%", scrub: true },
        });

        gsap.to(mockupRoot, {
          y: -6,
          duration: 3.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: entrance.duration(),
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause play pause",
          },
        });
      }

      const textEls = [headline, subheadline, cta].filter((el): el is Element => el !== null);
      if (textEls.length) {
        gsap.to(textEls, {
          opacity: 0,
          ease: EASE.scrub,
          scrollTrigger: { trigger: container, start: "top top", end: "+=15%", scrub: true },
        });
      }
    });
  });
}
