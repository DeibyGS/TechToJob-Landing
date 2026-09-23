"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { getLenis } from "@/components/animations/smoothScroll";
import { beginNavScroll, commitNavScroll, flashHeaderBorder } from "@/components/layout/HeaderReveal";
import { Button } from "@/components/ui/Button";

type NavLink = { id: string; label: string };

type NavLinksProps = {
  links: NavLink[];
  /** Vertical layout for mobile menu, horizontal for desktop nav. */
  orientation?: "horizontal" | "vertical";
  /** Callback when a link is clicked (used by mobile menu to close itself). */
  onLinkClick?: () => void;
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
export function NavLinks({ links, orientation = "horizontal", onLinkClick }: NavLinksProps) {
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
    // boundary (the header's scroll-margin-top clearance), which isn't the
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
      flashHeaderBorder();
    };

    // Close mobile menu if callback provided
    onLinkClick?.();

    const lenis = getLenis();
    if (lenis) {
      // Safety net in case onComplete never fires (e.g. the scroll gets
      // interrupted) — comfortably longer than Lenis's default duration.
      // Cancelled by onComplete below so a normal landing only ever runs
      // resumeObserver (and its flashHeaderBorder call) once, not twice.
      const safetyTimeoutId = window.setTimeout(resumeObserver, 1500);

      // No explicit offset here — Lenis reads the target's CSS
      // scroll-margin-top natively (globals.css, `section[id]`) to keep the
      // fixed header (HeaderReveal.tsx) from covering the target's top edge.
      // Passing an offset on top of that would double-count the clearance.
      lenis.scrollTo(target, {
        duration: reduceMotion ? 0 : undefined,
        onComplete: () => {
          clearTimeout(safetyTimeoutId);
          resumeObserver();
        },
      });
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
      className={
        orientation === "vertical"
          ? "flex flex-col gap-1"
          : "hidden items-center gap-1 rounded-full border border-brand-teal/25 bg-brand-white p-1 text-sm font-semibold shadow-[0_4px_16px_rgba(132,192,191,0.2)] md:flex"
      }
    >
      {links.map(({ id, label }) => (
        <Button
          key={id}
          variant="pill"
          className={orientation === "vertical" ? "w-full px-4 py-3 text-base" : "px-3 py-1.5"}
          label={label}
          href={`#${id}`}
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => handleClick(event, id)}
          isActive={activeId === id}
          aria-current={activeId === id ? "true" : undefined}
        />
      ))}
    </nav>
  );
}
