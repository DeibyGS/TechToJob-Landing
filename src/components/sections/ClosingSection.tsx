import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SOCIAL_LINKS } from "@/lib/constants";

export async function ClosingSection() {
  const t = await getTranslations("Closing");
  const tCommon = await getTranslations("Common");

  return (
    <SectionContainer background="light" className="text-center">
      <Reveal className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          {t("headline")}
        </h2>
        <p className="mt-4 text-brand-dark/70">{t("description")}</p>
        <Button href={SOCIAL_LINKS.discord} className="mt-8">
          {tCommon("ctaDiscord")}
        </Button>
      </Reveal>
    </SectionContainer>
  );
}
