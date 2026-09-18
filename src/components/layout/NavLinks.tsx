"use client";

import { useReducedMotion } from "motion/react";
import { getLenis } from "@/components/animations/smoothScroll";

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
 */
export function NavLinks({ links }: NavLinksProps) {
  const reduceMotion = useReducedMotion();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();

    const lenis = getLenis();
    if (lenis) {
      // Header is `fixed` once revealed (see HeaderReveal.tsx) — offset the
      // scroll target so its top edge isn't hidden underneath it.
      lenis.scrollTo(target, { offset: -80, duration: reduceMotion ? 0 : undefined });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <nav aria-label="Sections" className="hidden items-center gap-6 text-sm font-medium md:flex">
      {links.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(event) => handleClick(event, id)}
          className="group relative text-brand-dark/70 transition-colors hover:text-brand-dark"
        >
          {label}
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand-teal transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
        </a>
      ))}
    </nav>
  );
}
