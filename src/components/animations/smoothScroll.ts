import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { prefersReducedMotion } from "./utils";

// ScrollTrigger is registered once in ./utils (imported above).

let activeLenis: Lenis | null = null;

/**
 * Exposes the active Lenis instance so anchor-nav clicks (NavLinks) can
 * scroll through Lenis instead of desyncing it with a native jump. Returns
 * null when smooth scroll is off (reduced motion, or before mount).
 */
export function getLenis(): Lenis | null {
  return activeLenis;
}

/**
 * Starts Lenis-driven smooth scrolling synced to GSAP's ticker/ScrollTrigger.
 * No-ops under prefers-reduced-motion — native scroll is used instead.
 * Returns a cleanup function for the caller's useEffect.
 */
export function initSmoothScroll(): () => void {
  if (typeof window === "undefined" || prefersReducedMotion()) {
    return () => {};
  }

  // Skip Lenis on mobile — native scroll is smoother on touch devices
  if (window.innerWidth < 768) {
    return () => {};
  }

  const lenis = new Lenis();
  activeLenis = lenis;
  const onTick = (time: number) => lenis.raf(time * 1000);

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(onTick);
    lenis.destroy();
    activeLenis = null;
  };
}
