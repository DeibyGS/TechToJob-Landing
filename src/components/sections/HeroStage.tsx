"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { initHeroAnimation } from "@/components/animations/hero";
import { useGsapScope } from "@/components/animations/utils";

type HeroStageProps = {
  headline: string;
  subheadline: string;
  badge: string;
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
  badge,
  community,
}: HeroStageProps) {
  const containerRef = useGsapScope<HTMLDivElement>(initHeroAnimation);

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

        {/* ── 5. Showcase — a single credible signal, not a competing trio.
            2026 hero-conversion guidance converges on one purposeful trust
            signal instead of several stat badges fighting the headline for
            attention; the other two facts this used to carry ("1 torneo
            activo", "100% gratuito") now live in the sections that actually
            back them up (Tournaments, Talent). ── */}
        <div data-mockup-wrap className="relative flex w-full max-w-md items-center justify-center">
          <span
            data-mockup-glow
            aria-hidden
            className="absolute inset-0 -z-10 scale-110 rounded-full bg-brand-teal/10 blur-2xl"
          />
          <span
            data-hero-showcase-card
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-white/15 bg-brand-white/[0.06] px-3 py-1.5 text-xs font-medium text-brand-white/80 backdrop-blur-md"
          >
            <Users className="h-3 w-3 shrink-0 text-brand-teal" strokeWidth={2} aria-hidden="true" />
            {badge}
          </span>
        </div>
      </div>

      {/* ── Bottom cluster: CTA. Natural height, no flex-1 — sits directly
          after the top cluster, which is what actually places it near the
          bottom of the viewport instead of wherever the whole stack's
          combined height centers to. ── */}
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
      </div>
    </div>
  );
}
