"use client";

import { UserPlus, Code2, Briefcase } from "lucide-react";
import { initHowItWorksScroll } from "@/components/animations/howItWorks";
import { useGsapScope } from "@/components/animations/utils";

type Step = { title: string; description: string };

type HowItWorksStageProps = {
  steps: Step[];
};

// Index-mapped to `steps` (Join / Show what you can do / Find opportunities),
// same pattern as TournamentsStage's STEP_ICONS.
const STEP_ICONS = [UserPlus, Code2, Briefcase];

/**
 * Desktop-only (>=1024px) pinned/scrubbed variant of HowItWorks. Hidden
 * below that breakpoint via `hidden lg:grid` — the mobile sequential-reveal
 * markup (in HowItWorksSection) is what renders there instead.
 */
export function HowItWorksStage({ steps }: HowItWorksStageProps) {
  const containerRef = useGsapScope<HTMLDivElement>(initHowItWorksScroll);

  return (
    <div ref={containerRef} className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="relative flex h-64 w-64 items-center justify-center justify-self-center">
        <span
          aria-hidden
          className="howitworks-ring absolute h-80 w-80 rounded-full border border-dashed border-brand-teal/20"
        />
        <div
          data-howitworks-anchor
          className="relative flex h-64 w-64 items-center justify-center rounded-full bg-brand-teal/10"
        >
          <span aria-hidden className="absolute h-48 w-48 rounded-full bg-brand-teal/5" />
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            if (!Icon) return null;
            return (
              <Icon
                key={step.title}
                data-howitworks-icon
                aria-hidden
                className="absolute h-16 w-16 text-brand-teal md:h-20 md:w-20"
                style={{ opacity: index === 0 ? 1 : 0 }}
              />
            );
          })}
        </div>
      </div>
      <div className="relative min-h-[240px]">
        {steps.map((step, index) => (
          <div key={step.title} data-howitworks-step className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-brand-dark/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl font-semibold">{step.title}</h3>
            <p className="text-brand-dark/70">{step.description}</p>
          </div>
        ))}
        <div className="mt-8 flex gap-2">
          {steps.map((step) => (
            <span key={step.title} className="relative h-1.5 w-8 overflow-hidden rounded-full bg-brand-dark/15">
              <span data-howitworks-dot className="absolute inset-0 rounded-full bg-brand-teal" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
