"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/animations/utils";

/**
 * Hides the header off-screen while the Hero (id="hero") is the active
 * viewport, sliding it into view once the visitor scrolls past it —
 * reversing on scroll back up. Under reduced motion, the header stays
 * permanently visible (no hide/reveal choreography) so navigation is never
 * gated behind a scroll gesture.
 */
export function HeaderReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const el = ref.current;

    const trigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom top",
      onEnter: () => el.classList.remove("-translate-y-full"),
      onLeaveBack: () => el.classList.add("-translate-y-full"),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 -translate-y-full bg-brand-white transition-transform duration-300 motion-reduce:static motion-reduce:translate-y-0"
    >
      {children}
    </div>
  );
}
