"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/components/animations/utils";
import { HEADER_REVEAL_BUFFER_PX } from "@/lib/constants";

// Lets NavLinks.tsx pause this ScrollTrigger for the duration of a
// click-triggered scroll, so its automatic show/hide can't react to transit
// through the Hero/HowItWorks boundary — a nav click is never actually "the
// user going back to look at Hero" (the one case this component's auto-hide
// is meant for).
//
// Earlier attempts manually toggled the header's class directly (a boolean
// `suppressed` flag gating the callbacks) instead of pausing the trigger
// itself. That desynced GSAP's own internal "have we crossed the threshold"
// state from the DOM: if the click-scroll actually crossed the threshold
// while the callback was muted, GSAP still silently recorded that crossing
// internally — so scrolling back up into Hero afterward found GSAP already
// believing it had "used up" that transition, and never fired onLeaveBack
// again (confirmed against a real screenshot: fully back at the top of
// Hero, header still showing). `ScrollTrigger.disable()`/`.enable()` is the
// correct primitive for this — disable() stops it from reacting at all;
// enable() re-checks the CURRENT scroll position and fires whichever of
// onEnter/onLeaveBack the real position calls for, so GSAP's internal state
// can never drift from the DOM.
let triggerInstance: ScrollTrigger | null = null;

export function beginNavScroll() {
  triggerInstance?.disable(false);
}

export function commitNavScroll() {
  triggerInstance?.enable();
}

// HeaderLogo's color-cycle animation is wasted if it runs on mount: the
// header is translated off-screen for the entire Hero, so by the time it's
// actually revealed the animation already finished. This lets HeaderLogo
// defer starting it until the header is revealed for the first time —
// subsequent reveals (scrolling back up into Hero and down again) don't
// re-trigger it, matching the "runs once" intent.
let hasRevealedOnce = false;
let firstRevealListener: (() => void) | null = null;

export function onFirstReveal(listener: () => void) {
  if (hasRevealedOnce) {
    listener();
    return;
  }
  firstRevealListener = listener;
}

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
      // Pushes the hide/reveal threshold further into the Hero than its
      // exact bottom edge — reasonable slack for ordinary scroll-settling,
      // but see beginNavScroll above for why nav clicks don't rely on this
      // alone.
      start: `bottom top+=${HEADER_REVEAL_BUFFER_PX}`,
      onEnter: () => {
        el.classList.remove("-translate-y-full");
        if (!hasRevealedOnce) {
          hasRevealedOnce = true;
          firstRevealListener?.();
          firstRevealListener = null;
        }
      },
      onLeaveBack: () => el.classList.add("-translate-y-full"),
    });
    triggerInstance = trigger;

    return () => {
      trigger.kill();
      triggerInstance = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 -translate-y-full border-b border-brand-teal/25 bg-brand-white shadow-[0_1px_16px_rgba(132,192,191,0.35)] transition-transform duration-300 motion-reduce:static motion-reduce:translate-y-0"
    >
      {children}
    </div>
  );
}
