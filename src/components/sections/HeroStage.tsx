"use client";

import { Button } from "@/components/ui/Button";
import { HeroMockup } from "./HeroMockup";
import { initHeroAnimation } from "@/components/animations/hero";
import { useGsapScope } from "@/components/animations/utils";

type HeroStageProps = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  mockup: {
    channelLabel: string;
    onlineLabel: string;
    messages: { sender: string; text: string }[];
  };
};

/**
 * Client boundary for the Hero's animated content. GSAP (see animations/hero.ts)
 * targets the `data-hero-*` elements directly, except the CTA — that stays
 * wrapped in a plain span so GSAP animates the wrapper, never the `motion.a`
 * button itself (constitution's "never mix motion + GSAP on the same DOM
 * subtree" rule).
 */
export function HeroStage({ headline, subheadline, ctaLabel, ctaHref, mockup }: HeroStageProps) {
  const containerRef = useGsapScope<HTMLDivElement>(initHeroAnimation);

  return (
    <div ref={containerRef} className="grid items-center gap-12 md:grid-cols-2">
      <div>
        <h1 data-hero-headline className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl">
          {headline}
        </h1>
        <p
          data-hero-subheadline
          className="mt-6 max-w-md text-base leading-relaxed text-brand-dark/70"
        >
          {subheadline}
        </p>
        <span data-hero-cta className="mt-8 inline-block">
          <Button href={ctaHref}>{ctaLabel}</Button>
        </span>
      </div>
      <div className="flex justify-center md:justify-end">
        <HeroMockup {...mockup} />
      </div>
    </div>
  );
}
