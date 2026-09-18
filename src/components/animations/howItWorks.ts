import gsap from "gsap";
import { EASE, MEDIA_DESKTOP_UP, prefersReducedMotion, runInScope } from "./utils";
import { HEADER_HEIGHT_PX, PINNED_CONTENT_TOP_GAP_PX } from "@/lib/constants";

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

      // pointerEvents matters here, not just opacity: all 3 steps stack at
      // the same position (inset: 0), so without this the LAST one in DOM
      // order paints on top and intercepts hover/click for that whole area
      // regardless of which step is actually visible — only the last
      // step's CTA button was ever hoverable (confirmed by real usage).
      gsap.set(steps, { position: "absolute", inset: 0 });
      gsap.set(steps[0], { pointerEvents: "auto" });
      gsap.set(steps.slice(1), { opacity: 0, y: 16, pointerEvents: "none" });
      gsap.set(dots, { opacity: 0 });
      if (dots[0]) gsap.set(dots[0], { opacity: 1 });
      gsap.set(icons.slice(1), { opacity: 0 });
      if (icons[0]) gsap.set(icons[0], { opacity: 1 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          // Without this offset the pin snaps the section flush against
          // the true viewport top, reserving no space for the fixed header
          // (HeaderReveal.tsx) — content renders partially underneath it.
          // This also happens to make the pin engage later, in
          // scroll-distance terms, than HeaderReveal's own reveal
          // threshold (bottom top+=HEADER_REVEAL_BUFFER_PX on #hero, right
          // before this section) — so the header's slide-in has always
          // finished before this pin engages, instead of racing it.
          // PINNED_CONTENT_TOP_GAP_PX adds breathing room on top of that —
          // just clearing the header still read as visually cramped, flush
          // against its bottom edge with zero gap.
          start: `top top+=${HEADER_HEIGHT_PX + PINNED_CONTENT_TOP_GAP_PX}`,
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
        timeline.set(steps[index - 1], { pointerEvents: "none" }, at);
        timeline.set(step, { pointerEvents: "auto" }, at);

        if (anchor) {
          timeline.fromTo(
            anchor,
            { scale: 1 },
            { scale: 1.04, yoyo: true, repeat: 1, ease: EASE.crossfade },
            at,
          );
        }
        if (dots[index]) {
          if (dots[index - 1]) timeline.to(dots[index - 1], { opacity: 0 }, at);
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
