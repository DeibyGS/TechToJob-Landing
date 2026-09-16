import { getTranslations } from "next-intl/server";
import { Target, Upload, Gavel } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

const STEP_ICONS = [Target, Upload, Gavel];

export async function TournamentsSection() {
  const t = await getTranslations("Tournaments");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <SectionContainer background="dark">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-white/70">{t("description")}</p>
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = STEP_ICONS[index];
          return (
            <Reveal key={step.title} delay={index * 0.1}>
              <Card className="h-full border-brand-white/15">
                <Icon
                  className="h-6 w-6 text-brand-teal"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-brand-white/70">{step.description}</p>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </SectionContainer>
  );
}
