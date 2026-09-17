import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { TournamentsStage } from "./TournamentsStage";

export async function TournamentsSection() {
  const t = await getTranslations("Tournaments");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <SectionContainer id="tournaments" background="dark">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-white/70">{t("description")}</p>
      </Reveal>
      <TournamentsStage steps={steps} />
    </SectionContainer>
  );
}
