import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { prefersReducedMotion } from "./utils";

// ScrollTrigger is registered once in ./utils (imported above).

/**
 * Starts Lenis-driven smooth scrolling synced to GSAP's ticker/ScrollTrigger.
 * No-ops under prefers-reduced-motion — native scroll is used instead.
 * Returns a cleanup function for the caller's useEffect.
 */
export function initSmoothScroll(): () => void {
  if (typeof window === "undefined" || prefersReducedMotion()) {
    return () => {};
  }

  const lenis = new Lenis();
  const onTick = (time: number) => lenis.raf(time * 1000);

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(onTick);
    lenis.destroy();
  };
}
