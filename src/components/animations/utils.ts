import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// useLayoutEffect warns during SSR (it never runs there); useEffect is its
// server-safe equivalent. Picking the right one per environment avoids that
// warning while still running synchronously-before-paint on the client.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

/**
 * One-time snapshot, not reactive — if the OS setting changes mid-session,
 * GSAP-driven animations (unlike `motion`'s `useReducedMotion` hook) won't
 * re-evaluate until the next full page load. Acceptable here: GSAP setup
 * runs once per mount inside a plain function, outside React's render cycle.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Mirrors this project's Tailwind breakpoints (`md`/`lg`, both CSS-first
// `@theme` defaults — Tailwind v4 has no exported JS token to import
// instead). If either breakpoint is ever customized in globals.css, update
// these to match.
export const MEDIA_TABLET_UP = "(min-width: 768px)";
export const MEDIA_DESKTOP_UP = "(min-width: 1024px)";

export const EASE = {
  entrance: "power3.out",
  entranceSoft: "power2.out",
  cta: "back.out(1.4)",
  scrub: "none",
  crossfade: "power2.inOut",
} as const;

/**
 * Scopes a GSAP timeline setup to a DOM node via gsap.context and returns a
 * ready-to-use useEffect cleanup function that reverts every tween/trigger
 * created inside `setup` — including any `gsap.matchMedia()` breakpoint
 * conditions registered inside it.
 */
export function runInScope(scope: Element | null, setup: () => void): () => void {
  if (!scope) return () => {};
  const ctx = gsap.context(setup, scope);
  return () => ctx.revert();
}

/**
 * Wires a ref to a GSAP `init` function, and cleans it up on unmount. Runs
 * the init synchronously before the browser paints (useLayoutEffect, not
 * useEffect) so GSAP's initial hidden/absolute state is never visible for a
 * frame before the animation takes over — otherwise the SSR-rendered markup
 * (fully visible, normal flow) flashes before snapping into its animated
 * starting state. Shared by every "Stage" client component (Hero,
 * HowItWorks) so each one only has to say which init function it uses.
 */
export function useGsapScope<T extends HTMLElement>(init: (el: T) => () => void) {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    return init(ref.current);
  }, [init]);

  return ref;
}
