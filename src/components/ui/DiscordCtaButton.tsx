"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, type LucideIcon } from "lucide-react";

type DiscordCtaButtonProps = {
  ctaLabel: string;
  ctaHoverLabel: string;
  ctaHref: string;
  /** Overrides the default Discord glyph — e.g. HowItWorksStage passes
   * each step's own icon so its 3 CTAs tie back to their step visually,
   * while still sharing this component's expand-on-hover mechanic. */
  icon?: LucideIcon;
};

// Discord isn't in lucide-react (it only ships generic UI glyphs) — same
// Simple Icons CDN convention as FooterSection.tsx's social row, tinted to
// brand-dark since this badge sits on a solid brand-teal button.
const DISCORD_ICON_COLOR = "2f3436";
const ICON_CLASSES = "h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5";

/**
 * The landing's canonical "join/enter the community" CTA — used by Hero
 * (`HeroStage.tsx`, inside its `data-hero-community` wrapper) and
 * ClosingSection.tsx verbatim (same component, same copy, same style —
 * not a look-alike), and by HowItWorksStage.tsx's 3 per-step buttons with
 * a custom `icon` (same href everywhere — all roads lead to the same
 * Discord). Its own shadow/glow and solid teal fill carry contrast
 * independent of whatever background it sits on, so it needs no dark/light
 * variant.
 *
 * Rests sized to `ctaLabel`; on hover/focus it animates its own width to
 * fit `ctaHoverLabel` and cross-fades the text. Both labels are measured
 * via ref (not guessed with a fixed max-width) so the button never sits
 * pre-sized to the longer label — that read as a CTA with a dead gap on
 * its right in an earlier version — and never clips the longer label
 * either. Label case comes from CSS `uppercase` (see className below), not
 * pre-capitalized copy — same convention as Button.tsx.
 *
 * Both label spans need explicit `w-max`: they're grid-stacked in the same
 * cell (col-start-1 row-start-1) so the cross-fade has no layout jump, but
 * CSS Grid's default `justify-items: stretch` then stretches BOTH spans to
 * the column's resolved width — which is sized to the wider of the two —
 * so an unconstrained `scrollWidth` read on the shorter span silently
 * reports the wider span's width too. `w-max` forces each span back to its
 * own intrinsic content width so the two measurements are actually distinct.
 *
 * Plain CSS `active:scale` here, not `motion` — this renders inside Hero's
 * GSAP `ScrollTrigger` scope (via `data-hero-community`), and the
 * constitution's hybrid-stack rule keeps GSAP and `motion` from sharing a
 * DOM subtree.
 */
export function DiscordCtaButton({ ctaLabel, ctaHoverLabel, ctaHref, icon: Icon }: DiscordCtaButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [widths, setWidths] = useState<{ collapsed: number; expanded: number } | null>(null);
  const collapsedRef = useRef<HTMLSpanElement>(null);
  const expandedRef = useRef<HTMLSpanElement>(null);

  const activate = useCallback(() => setIsActive(true), []);
  const deactivate = useCallback(() => setIsActive(false), []);

  useLayoutEffect(() => {
    if (collapsedRef.current && expandedRef.current) {
      setWidths({
        collapsed: collapsedRef.current.scrollWidth,
        expanded: expandedRef.current.scrollWidth,
      });
    }
  }, [ctaLabel, ctaHoverLabel]);

  return (
    <div data-hero-community>
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-teal px-5 py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap text-brand-dark uppercase shadow-[0_6px_20px_rgba(0,0,0,0.35),0_0_20px_rgba(132,192,191,0.25)] transition-shadow duration-300 ease-out hover:shadow-[0_10px_28px_rgba(0,0,0,0.4),0_0_32px_rgba(132,192,191,0.45)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark focus-visible:outline-none"
      >
        {Icon ? (
          <Icon
            className={ICON_CLASSES}
            aria-hidden
          />
        ) : (
          <Image
            src={`https://cdn.simpleicons.org/discord/${DISCORD_ICON_COLOR}`}
            alt=""
            width={16}
            height={16}
            unoptimized
            className={ICON_CLASSES}
          />
        )}
        {/* Width lives here, not on the <a> — this span's measured width is
            the label only, so the button's own flex layout (icon + gap +
            padding) still sizes itself around it instead of being fought
            over by two different width sources. */}
        <span
          className="relative grid h-4 shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
          style={widths ? { width: isActive ? widths.expanded : widths.collapsed } : undefined}
        >
          <span
            ref={collapsedRef}
            className="col-start-1 row-start-1 inline-flex w-max items-center gap-1.5 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0"
          >
            {ctaLabel}
          </span>
          <span
            ref={expandedRef}
            className="col-start-1 row-start-1 inline-flex w-max items-center gap-1.5 opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {ctaHoverLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </span>
      </a>
    </div>
  );
}
