"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Target, Upload, Gavel, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";

const STEP_ICONS = [Target, Upload, Gavel];
const FALLBACK_STEP_ICON = Sparkles;

type Step = { title: string; description: string };

type TournamentsStageProps = {
  steps: Step[];
};

/**
 * Client component handling Tournaments scroll-scrub on desktop (>=1024px)
 * and staggered reveal on mobile. Uses only `motion` (no GSAP).
 *
 * Desktop: tracks scroll progress through the section, maps it to per-step
 * opacity + y offset — 3 phases at ~0–33%, 33–66%, 66–100%.
 * Mobile: sequential Reveal-style entrance with staggered delays.
 * Reduced motion: all content static, no animation.
 */
export function TournamentsStage({ steps }: TournamentsStageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity0 = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const opacity1 = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);

  const y0 = useTransform(scrollYProgress, [0.1, 0.25], [20, 0]);
  const y1 = useTransform(scrollYProgress, [0.3, 0.45], [20, 0]);
  const y2 = useTransform(scrollYProgress, [0.5, 0.65], [20, 0]);

  const desktopOpacities = [opacity0, opacity1, opacity2];
  const desktopYs = [y0, y1, y2];

  const mobileDelays = [0, 0.1, 0.2];

  return (
    <div ref={sectionRef} className="mt-12">
      {/* Desktop: scroll-scrub 3-column grid */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index] ?? FALLBACK_STEP_ICON;
          const opacity = reduceMotion ? undefined : desktopOpacities[index];
          const y = reduceMotion ? undefined : desktopYs[index];

          return (
            <motion.div
              key={step.title}
              style={reduceMotion ? undefined : { opacity, y }}
            >
              <Card border="light" className="h-full">
                <Icon
                  className="h-6 w-6 text-brand-teal"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-brand-white/70">{step.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile: staggered reveal, single column */}
      <div className="grid gap-6 md:hidden">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index] ?? FALLBACK_STEP_ICON;

          return (
            <motion.div
              key={step.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: mobileDelays[index],
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Card border="light" className="h-full">
                <Icon
                  className="h-6 w-6 text-brand-teal"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-brand-white/70">{step.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
