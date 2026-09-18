import { getTranslations } from "next-intl/server";
import { UserPlus, Code2, Briefcase } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { HowItWorksStage } from "@/components/sections/HowItWorksStage";

// Mirrors HowItWorksStage's STEP_ICONS mapping for the mobile sequential list.
const STEP_ICONS = [UserPlus, Code2, Briefcase];

export async function HowItWorksSection() {
  const t = await getTranslations("HowItWorks");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <SectionContainer id="how-it-works" background="light">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:hidden md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index];
          return (
            <Reveal
              key={step.title}
              delay={index * 0.1}
              className="flex flex-col gap-3 border-t border-brand-dark/10 pt-6"
            >
              {Icon && <Icon className="h-8 w-8 text-brand-teal" aria-hidden />}
              <span className="text-sm font-semibold text-brand-dark/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-brand-dark/70">{step.description}</p>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-12">
        <HowItWorksStage steps={steps} />
      </div>
    </SectionContainer>
  );
}
