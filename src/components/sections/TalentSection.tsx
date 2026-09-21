import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { BulletList } from "@/components/ui/BulletList";
import { TalentCard } from "@/components/ui/TalentCard";
import { Reveal } from "@/components/ui/Reveal";

export async function TalentSection() {
  const t = await getTranslations("Talent");
  const bullets = t.raw("bullets") as string[];

  return (
    <SectionContainer id="talent" background="light">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Card visual — izquierda (orden invertido en mobile) */}
        <Reveal className="order-2 lg:order-1">
          <TalentCard />
        </Reveal>

        {/* Texto — derecha */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("headline")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-brand-dark/70">{t("description")}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <BulletList bullets={bullets} />
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
