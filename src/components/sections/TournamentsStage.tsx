"use client";

import { motion, useReducedMotion } from "motion/react";
import { Target, Upload, Gavel, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const STEP_ICONS = [Target, Upload, Gavel];
const FALLBACK_STEP_ICON = Sparkles;

type Step = { title: string; description: string; gain?: string };

type TournamentsStageProps = {
  steps: Step[];
};

/**
 * Timeline layout with step numbers and viewport-triggered stagger.
 * Desktop: horizontal timeline with connector line and arrow between steps.
 * Mobile: vertical timeline with connector line on the left.
 * All animations use whileInView — cards appear as soon as the section
 * enters the viewport, no extra scroll needed.
 */
export function TournamentsStage({ steps }: TournamentsStageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12">
      {/* Desktop: horizontal timeline */}
      <div className="hidden md:flex md:items-start md:gap-0">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index] ?? FALLBACK_STEP_ICON;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.title} className="flex items-start">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex-1"
              >
                <Card border="light" className="relative h-full">
                  <span
                    className="mb-3 inline-block text-sm font-bold text-brand-teal/40"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    className="h-6 w-6 text-brand-teal"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-brand-white/70">{step.description}</p>
                  {step.gain && (
                    <p className="mt-3 text-sm font-medium text-brand-teal">
                      {step.gain}
                    </p>
                  )}
                </Card>
              </motion.div>
              {/* Connector arrow between steps */}
              {!isLast && (
                <div className="flex items-center self-center px-3">
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                  >
                    <ArrowRight className="h-5 w-5 text-brand-teal/30" />
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="relative flex flex-col gap-0 md:hidden">
        {/* Vertical connector line */}
        <div
          aria-hidden="true"
          className="absolute left-[19px] top-0 bottom-0 w-px bg-brand-teal/20"
        />
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
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex items-start gap-4 py-4"
            >
              {/* Step number dot on the timeline */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-teal/30 bg-brand-dark text-sm font-bold text-brand-teal">
                {index + 1}
              </div>
              {/* Card content */}
              <div className="flex-1">
                <Card border="light">
                  <Icon
                    className="h-5 w-5 text-brand-teal"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-brand-white/70">
                    {step.description}
                  </p>
                  {step.gain && (
                    <p className="mt-2 text-xs font-medium text-brand-teal">
                      {step.gain}
                    </p>
                  )}
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
