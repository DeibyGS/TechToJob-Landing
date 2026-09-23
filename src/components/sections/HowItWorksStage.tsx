"use client";

import { UserPlus, Code2, Briefcase } from "lucide-react";
import { initHowItWorksScroll } from "@/components/animations/howItWorks";
import { useGsapScope } from "@/components/animations/utils";
import { Button } from "@/components/ui/Button";

type Step = { title: string; description: string; cta: string; href: string };

type HowItWorksStageProps = {
  headline: string;
  steps: Step[];
};

// Index-mapped to `steps` (Join / Show what you can do / Find opportunities),
// same pattern as TournamentsStage's STEP_ICONS.
const STEP_ICONS = [UserPlus, Code2, Briefcase];

/**
 * Desktop-only (>=1024px) pinned/scrubbed variant of HowItWorks. Hidden
 * below that breakpoint via `hidden lg:flex` — the mobile sequential-reveal
 * markup (in HowItWorksSection) is what renders there instead, including
 * its own copy of the section headline. `headline` is rendered a second
 * time here (desktop only — HowItWorksSection's own copy is `lg:hidden`,
 * see there) specifically so it's *inside* the div GSAP pins: it used to
 * live only in the parent, above this component, in normal scroll flow —
 * which meant it scrolled out of view before the pin ever engaged, so it
 * was gone for the entire step 1-3 scrub instead of staying visible
 * throughout (confirmed by real usage: barely visible at step 1, fully
 * gone by step 2).
 */
export function HowItWorksStage({ headline, steps }: HowItWorksStageProps) {
  const containerRef = useGsapScope<HTMLDivElement>(initHowItWorksScroll);

  return (
    <div ref={containerRef} className="relative hidden lg:flex lg:flex-col lg:gap-12">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{headline}</h2>
      <div className="grid lg:grid-cols-2 lg:items-center lg:gap-16">
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
        {/* flex-col + gap (not the dots row's own margin) so the dots stay
            reserved space below the steps box regardless of what the GSAP
            pin does inside it — see the inner div's own comment. */}
        <div className="flex flex-col gap-8">
          {/* min-h is a floor, not a measured value — once the GSAP pin
              below pulls all 3 steps out of flow (position: absolute),
              nothing else guarantees this wrapper stays tall enough for
              the longest step's copy across both locales. 280px leaves
              real margin over today's (short) content. Dots used to live
              INSIDE this div too (`mt-8` sibling after the steps) — but
              once the steps became `position: absolute`, they stopped
              contributing to this div's flow height, so the dots' own
              margin collapsed toward the top instead of sitting below the
              steps, landing right on top of each step's own "01"/"02"/"03"
              index (confirmed by real usage). Moving the dots to be a
              flex sibling of this div, not a child inside it, fixes that
              unconditionally — their position no longer depends on
              whatever GSAP did to this div's children.  */}
          <div className="relative min-h-[340px]">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index];
              // Only the Discord step is an external link — the others are
              // in-page anchors, so they shouldn't open a new tab.
              const isExternal = step.href.startsWith("http");
              return (
                <div key={step.title} data-howitworks-step className="flex flex-col gap-3">
                  <span className="text-sm font-semibold text-brand-dark/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                  <p className="text-brand-dark/70">{step.description}</p>
                  {/* Same expand-on-hover CTA as Hero/Closing (Button
                      variant="cta" — zero `motion` dependency by design, so
                      it's safe inside this GSAP-pinned subtree per the
                      constitution's hybrid-stack rule), not a one-off
                      lookalike, so every CTA on the landing behaves
                      identically. Leading icon reuses this step's own
                      STEP_ICONS entry — the same icon already shown in the
                      anchor circle for this step. `hoverLabel` is omitted
                      on purpose: there's no distinct "hover" phrasing per
                      step, so hovering only reveals the arrow (width
                      still animates to make room for it) rather than
                      swapping text. Part of the step's own fading div
                      (data-howitworks-step above), not a separate GSAP
                      target — it inherits that div's opacity/y tween
                      automatically, so it crossfades in sync with the rest
                      of the step's content for free. */}
                  <div className="mt-1">
                    <Button
                      icon={Icon ? <Icon /> : undefined}
                      label={step.cta}
                      href={step.href}
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            {steps.map((step) => (
              <span key={step.title} className="relative h-1.5 w-8 overflow-hidden rounded-full bg-brand-dark/15">
                <span data-howitworks-dot className="absolute inset-0 rounded-full bg-brand-teal" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
