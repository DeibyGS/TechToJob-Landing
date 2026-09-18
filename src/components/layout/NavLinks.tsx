"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getLenis } from "@/components/animations/smoothScroll";
import { beginNavScroll, commitNavScroll } from "@/components/layout/HeaderReveal";
import { HEADER_SCROLL_OFFSET_PX } from "@/lib/constants";

type NavLink = { id: string; label: string };

type NavLinksProps = {
  links: NavLink[];
};

/**
 * Real <a href="#id"> anchors (works with JS disabled). Click handler routes
 * the scroll through the page's Lenis instance so it stays visually smooth
 * and in sync with Lenis's virtual scroll position — a native jump would
 * desync it. Falls back to scrollIntoView when Lenis isn't active (reduced
 * motion, or before mount).
 *
 * Active-section tracking uses a plain `IntersectionObserver`, not GSAP —
 * this is state-tracking, not choreography, so it stays outside the
 * GSAP-only-in-animations/*.ts scope the constitution reserves for real
 * scroll-driven animation (Hero/HowItWorks).
 */
export function NavLinks({ links }: NavLinksProps) {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  // While a nav click's animated scroll is in flight, the viewport sweeps
  // past every section between the current one and the target — including
  // ones with no nav link of their own (e.g. Talent) and ones whose link
  // sits elsewhere in this list (nav order doesn't match section order:
  // Companies sits between HowItWorks and Tournaments/Networking in the
  // page, but after them in the nav). Left alone, the observer below would
  // briefly mark whatever's mid-scroll as active. This ref suppresses it
  // for the duration of a click-triggered scroll.
  const suppressObserverRef = useRef(false);

  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    // A thin horizontal band near the top of the viewport (not the whole
    // viewport) — whichever section is crossing that band counts as
    // "active", which is what actually reads as correct while scrolling
    // past a tall section, rather than the entire section needing to be
    // fully visible.
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return;
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const closest = visible.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b,
        );
        setActiveId(closest.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();

    // Mark the clicked link active immediately instead of waiting for the
    // observer to agree once scrolling settles — see suppressObserverRef.
    // Also mute the header's automatic show/hide for the same reason: a nav
    // click can legitimately scroll back up past the Hero/HowItWorks
    // boundary (the -HEADER_SCROLL_OFFSET_PX clearance), which isn't the
    // user "going back to Hero" — see HeaderReveal.tsx's beginNavScroll.
    // The header itself is only force-shown once the scroll actually lands
    // (commitNavScroll, in resumeObserver below), not here — see that
    // function's comment for why doing it here instead looked wrong.
    setActiveId(id);
    suppressObserverRef.current = true;
    beginNavScroll();
    const resumeObserver = () => {
      suppressObserverRef.current = false;
      commitNavScroll();
    };

    const lenis = getLenis();
    if (lenis) {
      // Header is `fixed` once revealed (see HeaderReveal.tsx) — offset the
      // scroll target so its top edge isn't hidden underneath it.
      lenis.scrollTo(target, {
        offset: -HEADER_SCROLL_OFFSET_PX,
        duration: reduceMotion ? 0 : undefined,
        onComplete: resumeObserver,
      });
      // Safety net in case onComplete never fires (e.g. the scroll gets
      // interrupted) — comfortably longer than Lenis's default duration.
      window.setTimeout(resumeObserver, 1500);
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      resumeObserver();
    }
  };

  return (
    // Same pill-group language as LanguageSwitcher (rounded-full, per-item
    // padding, teal fill on the active/hovered item) so the header's two nav
    // controls read as one consistent system instead of two different ones.
    <nav
      aria-label="Sections"
      className="hidden items-center gap-1 rounded-full border border-brand-teal/25 bg-brand-white p-1 text-sm font-semibold shadow-[0_4px_16px_rgba(132,192,191,0.2)] md:flex"
    >
      {links.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={(event) => handleClick(event, id)}
            aria-current={isActive ? "true" : undefined}
            className={
              isActive
                ? "rounded-full bg-brand-teal px-3 py-1.5 text-brand-dark"
                : "rounded-full px-3 py-1.5 text-brand-dark/70 transition-colors hover:bg-brand-teal hover:text-brand-dark"
            }
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}
