"use client";

import Image from "next/image";
import { ArrowDown, Sparkles, Trophy, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { initHeroAnimation } from "@/components/animations/hero";
import { useGsapScope } from "@/components/animations/utils";

export type ShowcaseItem = { title: string; category: string };

// One icon per News.items position (index-based, not category-string-based,
// since the category label is translated — es/en order is the same content,
// just different words) — gives each tile a distinct visual identity.
const SHOWCASE_ICONS = [Trophy, Users, Sparkles];

type HeroStageProps = {
  headline: string;
  subheadline: string;
  showcaseItems: ShowcaseItem[];
  showcaseStats: string[];
  community: {
    ctaLabel: string;
    ctaHoverLabel: string;
    ctaHref: string;
  };
};

/**
 * Client boundary for the Hero's animated content. GSAP (see animations/hero.ts)
 * targets the `data-hero-*` elements directly.
 *
 * Layout: two flex groups, not one flat stack. The top cluster (logo,
 * headline, subheadline, showcase) is `flex-1` and self-centers, absorbing
 * all the leftover viewport height; the CTA + scroll indicator sit in a
 * second, natural-height group right after it — which is what actually
 * pins them toward the bottom of the viewport instead of wherever the
 * whole 6-element stack's combined height happens to center to.
 *
 * Depth layer (mouse-parallax via animations/hero.ts): foreground
 * (data-mockup-wrap), the showcase card stack + its glow.
 * (Background wash — 5 blurred blobs — lives at section level via
 * SectionContainer's backgroundDecoration slot, outside this GSAP scope.)
 */
export function HeroStage({
  headline,
  subheadline,
  showcaseItems,
  showcaseStats,
  community,
}: HeroStageProps) {
  const containerRef = useGsapScope<HTMLDivElement>(initHeroAnimation);
  const reduceMotion = useReducedMotion();

  const words = headline.split(" ");

  return (
    <div
      ref={containerRef}
      data-hero-content
      className="relative isolate flex flex-1 flex-col items-center text-center"
    >
      {/* ── Top cluster: logo, headline, subheadline, showcase. `flex-1` so
          it absorbs the leftover height and self-centers within it — this
          is what keeps the CTA/scroll-indicator group below from being
          dragged up by the combined height of everything above it. ── */}
      <div data-hero-top-cluster className="flex flex-1 flex-col items-center justify-center gap-3 md:gap-4">
        {/* ── Brand mark — per docs/DESIGN.md's Logo usage matrix: the fused
            icon+wordmark, visible and legible, centered above the headline.
            Required specifically because the header's own "TechToJob"
            wordmark stays hidden until the visitor scrolls past the Hero —
            this is the only brand-name text on first load. */}
        <Image
          data-hero-icon
          src="/logo/logo-negative.svg"
          alt="TechToJob"
          width={613}
          height={340}
          priority
          className="h-12 w-auto md:h-24"
        />

        {/* ── 1. Headline — OVERSIZED, word-by-word reveal ── */}
        <h1
          data-hero-headline
          className="max-w-4xl text-4xl font-bold tracking-tight text-balance drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:text-5xl md:text-7xl lg:text-8xl"
        >
          {words.map((word, i) => (
            <span key={i} data-hero-word className="inline-block overflow-hidden">
              <span data-hero-word-inner className="inline-block">
                {word}
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>

        {/* ── 2. Subheadline ── */}
        <p
          data-hero-subheadline
          className="max-w-lg text-base leading-relaxed text-brand-white/70 drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] md:text-lg"
        >
          {subheadline}
        </p>

        {/* ── 5. Showcase — compact stat strip over real News.items, single
            row of pill chips (icon + one short line each) instead of cards.
            2026 landing trend: rotating testimonial/showcase carousels
            convert worse than simultaneous social-proof widgets — same
            content, just no longer sequential. Chips size to their own text
            and wrap as a row instead of being squeezed into fixed grid
            columns, so they can't force multi-line wrapping the way a 2-col
            card grid did (that pushed the CTA/scroll-indicator below the
            fold on short viewports — confirmed against a real screenshot). ── */}
        <div data-mockup-wrap className="relative flex w-full max-w-md flex-wrap items-center justify-center gap-2">
          <span
            data-mockup-glow
            aria-hidden
            className="absolute inset-0 -z-10 scale-110 rounded-full bg-brand-teal/10 blur-2xl"
          />
          {showcaseItems.map((item, index) => {
            const ItemIcon = SHOWCASE_ICONS[index] ?? Sparkles;
            return (
              // The idle CSS drift lives on this wrapper, not on the pill GSAP
              // targets below — both would animate `transform`, and a CSS
              // keyframe and a GSAP tween writing the same property on the
              // same element fight each other (visible jank).
              <span key={item.title} className="hero-showcase-float">
                <span
                  data-hero-showcase-card
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-white/15 bg-brand-white/[0.06] px-3 py-1.5 text-xs font-medium text-brand-white/80 backdrop-blur-md"
                >
                  <ItemIcon className="h-3 w-3 shrink-0 text-brand-teal" strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">{item.category}: </span>
                  {showcaseStats[index] ?? item.title}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Bottom cluster: CTA + scroll indicator. Natural height, no
          flex-1 — sits directly after the top cluster, which is what
          actually places it near the bottom of the viewport instead of
          wherever the whole stack's combined height centers to. ── */}
      <div className="flex flex-col items-center gap-3 pb-2 md:gap-4 md:pb-4">
        {/* ── 6. Community status bar ── */}
        <Button
          data-hero-community
          label={community.ctaLabel}
          hoverLabel={community.ctaHoverLabel}
          href={community.ctaHref}
          icon={<DiscordIcon />}
          target="_blank"
          rel="noopener noreferrer"
        />

        {/* ── 7. Scroll indicator — in normal flow (not absolute) so it never
            overlaps the CTA above it regardless of how tall the Hero's
            content ends up on a given viewport. ── */}
        <div data-hero-scroll-indicator>
          {!reduceMotion && (
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.08]"
            >
              <ArrowDown className="h-6 w-6 text-brand-white/70" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
