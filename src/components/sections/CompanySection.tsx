import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { BulletList } from "@/components/ui/BulletList";
import { CompanyCard } from "@/components/ui/CompanyCard";
import { Reveal } from "@/components/ui/Reveal";

type ExampleCard = {
  stackLabel: string;
  stackValue: string;
  levelLabel: string;
  levelValue: string;
  engagementLabel: string;
  engagementValue: string;
};

export async function CompanySection() {
  const t = await getTranslations("Company");
  const bullets = t.raw("bullets") as string[];
  const exampleCard = t.raw("exampleCard") as ExampleCard;

  return (
    <SectionContainer
      id="companies"
      background="light"
      backgroundDecoration={
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-brand-teal/5 blur-3xl" />
          <div className="absolute -left-32 bottom-1/4 h-48 w-48 rounded-full bg-brand-teal/5 blur-3xl" />
        </div>
      }
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Texto — izquierda */}
        <div>
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

        {/* Card visual — derecha */}
        <Reveal delay={0.2}>
          <CompanyCard {...exampleCard} />
        </Reveal>
      </div>
    </SectionContainer>
  );
}
