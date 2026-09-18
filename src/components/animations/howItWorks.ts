import gsap from "gsap";
import { EASE, MEDIA_DESKTOP_UP, prefersReducedMotion, runInScope } from "./utils";

/**
 * Pins the HowItWorks visual anchor and crossfades through its step panels
 * in sync with scroll, at >=1024px only — registered via `gsap.matchMedia()`
 * so it activates/reverts live if the viewport crosses the breakpoint,
 * instead of being decided once at mount. Below that breakpoint, and under
 * prefers-reduced-motion, this is a no-op — the section's mobile markup
 * (sequential Reveal cards, untouched) renders instead. Without JS, `steps`
 * stay in normal document flow (all visible, all readable) since the
 * absolute-stack layout is applied here, not in CSS.
 */
export function initHowItWorksScroll(container: HTMLElement): () => void {
  if (prefersReducedMotion()) return () => {};

  return runInScope(container, () => {
    const mm = gsap.matchMedia();

    mm.add(MEDIA_DESKTOP_UP, () => {
      const anchor = container.querySelector("[data-howitworks-anchor]");
      const steps = Array.from(container.querySelectorAll("[data-howitworks-step]"));
      const dots = Array.from(container.querySelectorAll("[data-howitworks-dot]"));
      const icons = Array.from(container.querySelectorAll("[data-howitworks-icon]"));
      if (steps.length < 2) return;

      gsap.set(steps, { position: "absolute", inset: 0 });
      gsap.set(steps.slice(1), { opacity: 0, y: 16 });
      gsap.set(dots, { opacity: 0 });
      if (dots[0]) gsap.set(dots[0], { opacity: 1 });
      gsap.set(icons.slice(1), { opacity: 0 });
      if (icons[0]) gsap.set(icons[0], { opacity: 1 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
        },
      });

      steps.forEach((step, index) => {
        if (index === 0) return;
        const at = index - 1;

        timeline.to(steps[index - 1], { opacity: 0, y: -16, ease: EASE.crossfade }, at);
        timeline.to(step, { opacity: 1, y: 0, ease: EASE.crossfade }, at);

        if (anchor) {
          timeline.fromTo(
            anchor,
            { scale: 1 },
            { scale: 1.04, yoyo: true, repeat: 1, ease: EASE.crossfade },
            at,
          );
        }
        if (dots[index]) {
          timeline.to(dots, { opacity: 0 }, at);
          timeline.to(dots[index], { opacity: 1 }, at);
        }
        if (icons[index - 1] && icons[index]) {
          timeline.to(icons[index - 1], { opacity: 0 }, at);
          timeline.to(icons[index], { opacity: 1 }, at);
        }
      });
    });
  });
}
