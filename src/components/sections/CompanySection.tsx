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
    <SectionContainer background="light">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal className="md:order-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("headline")}
          </h2>
          <p className="mt-4 text-brand-dark/70">{t("description")}</p>
          <BulletList bullets={bullets} />
        </Reveal>
        <Reveal delay={0.15} className="md:order-1">
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
