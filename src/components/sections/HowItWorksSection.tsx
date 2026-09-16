import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";

export async function HowItWorksSection() {
  const t = await getTranslations("HowItWorks");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <SectionContainer background="light">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal
            key={step.title}
            delay={index * 0.1}
            className="flex flex-col gap-3 border-t border-brand-dark/10 pt-6"
          >
            <span className="text-sm font-semibold text-brand-dark/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-brand-dark/70">{step.description}</p>
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}
