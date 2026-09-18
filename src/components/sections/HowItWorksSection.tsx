import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { UserPlus, Code2, Briefcase } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { HowItWorksStage } from "@/components/sections/HowItWorksStage";
import { SOCIAL_LINKS } from "@/lib/constants";

// Mirrors HowItWorksStage's STEP_ICONS mapping for the mobile sequential list.
const STEP_ICONS = [UserPlus, Code2, Briefcase];

export async function HowItWorksSection() {
  const t = await getTranslations("HowItWorks");
  const steps = t.raw("steps") as { title: string; description: string; cta: string }[];

  return (
    <SectionContainer
      id="how-it-works"
      background="light"
      backgroundDecoration={
        <div className="pointer-events-none flex h-full items-center justify-end" aria-hidden="true">
          <Image
            src="/logo/simbolo-negativo.svg"
            alt=""
            width={800}
            height={800}
            className="h-[90%] w-auto opacity-[0.12]"
          />
        </div>
      }
    >
      {/* lg:hidden — the desktop-pinned HowItWorksStage below renders its
          own copy of this same headline, INSIDE the div GSAP pins, so it
          stays visible across all 3 steps instead of scrolling away before
          the pin engages. This copy is mobile/tablet-only so the headline
          still isn't duplicated in the DOM at any given breakpoint. */}
      <Reveal className="lg:hidden">
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
        <HowItWorksStage headline={t("headline")} steps={steps} ctaHref={SOCIAL_LINKS.discord} />
      </div>
    </SectionContainer>
  );
}
