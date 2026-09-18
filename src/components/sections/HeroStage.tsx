"use client";

import Image from "next/image";
import { ArrowDown, Tag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { initHeroAnimation } from "@/components/animations/hero";
import { useGsapScope } from "@/components/animations/utils";

type ShowcaseItem = { title: string; category: string };

type HeroStageProps = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  showcaseItems: ShowcaseItem[];
};

/**
 * Client boundary for the Hero's animated content. GSAP (see animations/hero.ts)
 * targets the `data-hero-*` elements directly, except the CTA — that stays
 * wrapped in a plain span so GSAP animates the wrapper, never the `motion.a`
 * button itself (constitution's "never mix motion + GSAP on the same DOM
 * subtree" rule).
 *
 * Layout: centered column with oversized headline leading the composition.
 * Logo is a small "signature" below the CTA, not the focal point.
 * Showcase cards are reduced in prominence — they provide context, not drama.
 *
 * Depth layers, back to front, each on its own element so a mouse-parallax
 * transform (animations/hero.ts, gsap.quickTo) never competes with another
 * animation's transform on the same node:
 *   background (data-hero-bg-layer): ambient blob + grain texture
 *   midground  (data-hero-mid-layer): 2 small floating teal accents
 *   foreground (data-mockup-wrap): the showcase card stack + its glow
 */
export function HeroStage({ headline, subheadline, ctaLabel, ctaHref, showcaseItems }: HeroStageProps) {
  const containerRef = useGsapScope<HTMLDivElement>(initHeroAnimation);
  const reduceMotion = useReducedMotion();

  const words = headline.split(" ");

  return (
    <div ref={containerRef} className="hero-grain relative flex flex-col items-center gap-6 text-center">
      {/* ── Background layer ── */}
      <div data-hero-bg-layer aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="hero-wash-blob absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/10 blur-3xl" />
      </div>

      {/* ── Midground layer ── */}
      <div data-hero-mid-layer aria-hidden className="pointer-events-none absolute inset-0 -z-[5]">
        <span className="hero-accent-float absolute top-[20%] left-[15%] h-3 w-3 rounded-full bg-brand-teal/60" />
        <span className="hero-accent-float absolute right-[18%] bottom-[15%] h-2 w-2 rounded-full bg-brand-teal/40" />
      </div>

      {/* ── 1. Headline — OVERSIZED, word-by-word reveal ── */}
      <h1 data-hero-headline className="max-w-4xl text-5xl font-bold tracking-tight text-balance md:text-7xl lg:text-8xl">
        {words.map((word, i) => (
          <span key={i} data-hero-word className="inline-block overflow-hidden">
            <span data-hero-word-inner className="inline-block">
              {word}
            </span>
            {i < words.length - 1 && "\u00A0"}
          </span>
        ))}
      </h1>

      {/* ── 2. Subheadline ── */}
      <p
        data-hero-subheadline
        className="max-w-lg text-base leading-relaxed text-brand-white/70 md:text-lg"
      >
        {subheadline}
      </p>

      {/* ── 3. CTA ── */}
      <span data-hero-cta className="inline-block">
        <Button href={ctaHref}>{ctaLabel}</Button>
      </span>

      {/* ── 4. Logo — small "signature", below the CTA ── */}
      <Image
        data-hero-icon
        src="/logo/logo-negative.svg"
        alt="TechToJob"
        width={613}
        height={340}
        className="mt-4 h-10 w-auto opacity-50 md:h-12"
      />

      {/* ── 5. Showcase cards — reduced prominence ── */}
      <div data-mockup-wrap className="relative mt-4 w-full max-w-xs">
        <span
          data-mockup-glow
          aria-hidden
          className="absolute inset-0 -z-10 scale-110 rounded-full bg-brand-teal/15 blur-2xl"
        />
        <div className="relative min-h-28">
          {showcaseItems.map((item, index) => (
            <Card
              key={item.title}
              data-hero-showcase-card
              className="absolute inset-0 flex flex-col justify-center bg-brand-white/90 text-left shadow-sm"
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-dark/60">
                <Tag className="h-3 w-3 text-brand-teal" strokeWidth={2} aria-hidden="true" />
                {item.category}
              </span>
              <p className="mt-1 text-sm font-semibold text-brand-dark line-clamp-2">{item.title}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* ── 6. Scroll indicator ── */}
      <div data-hero-scroll-indicator className="absolute bottom-8 left-1/2 -translate-x-1/2">
        {!reduceMotion && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 text-brand-white/40" />
          </motion.div>
        )}
      </div>

      {/* ── Gradient fade at bottom — transitions to next section ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-brand-white"
      />
    </div>
  );
}
