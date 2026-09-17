import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card } from "@/components/ui/Card";
import { BulletList } from "@/components/ui/BulletList";
import { DefinitionRow } from "@/components/ui/DefinitionRow";
import { Reveal } from "@/components/ui/Reveal";

export async function CompanySection() {
  const t = await getTranslations("Company");
  const bullets = t.raw("bullets") as string[];

  return (
    <SectionContainer id="companies" background="light">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="md:order-2">
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
        <Reveal delay={0.2} className="md:order-1">
          <Card className="bg-brand-dark/[0.03]">
            <DefinitionRow
              label={t("exampleCard.stackLabel")}
              value={t("exampleCard.stackValue")}
            />
            <DefinitionRow
              label={t("exampleCard.levelLabel")}
              value={t("exampleCard.levelValue")}
            />
            <DefinitionRow
              label={t("exampleCard.engagementLabel")}
              value={t("exampleCard.engagementValue")}
              isLast
            />
          </Card>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
