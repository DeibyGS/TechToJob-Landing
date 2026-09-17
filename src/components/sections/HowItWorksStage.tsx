"use client";

import Image from "next/image";
import { initHowItWorksScroll } from "@/components/animations/howItWorks";
import { useGsapScope } from "@/components/animations/utils";

type Step = { title: string; description: string };

type HowItWorksStageProps = {
  steps: Step[];
};

/**
 * Desktop-only (>=1024px) pinned/scrubbed variant of HowItWorks. Hidden
 * below that breakpoint via `hidden lg:grid` — the mobile sequential-reveal
 * markup (in HowItWorksSection) is what renders there instead.
 */
export function HowItWorksStage({ steps }: HowItWorksStageProps) {
  const containerRef = useGsapScope<HTMLDivElement>(initHowItWorksScroll);

  return (
    <div ref={containerRef} className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
      <div
        data-howitworks-anchor
        className="flex h-64 w-64 items-center justify-center justify-self-center rounded-full bg-brand-teal/10"
      >
        <Image src="/logo/symbol-positive.svg" alt="" width={140} height={140} className="h-28 w-28" />
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
