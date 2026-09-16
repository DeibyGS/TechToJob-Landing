import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SOCIAL_LINKS } from "@/lib/constants";

export async function HeroSection() {
  const t = await getTranslations("Hero");
  const tCommon = await getTranslations("Common");

  return (
    <SectionContainer background="light" className="pt-16 md:pt-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl">
            {t("headline")}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-brand-dark/70">
            {t("subheadline")}
          </p>
          <Button href={SOCIAL_LINKS.discord} className="mt-8">
            {tCommon("ctaDiscord")}
          </Button>
        </Reveal>
        <Reveal delay={0.15} className="flex justify-center md:justify-end">
          <Image
            src="/logo/symbol-positive.svg"
            alt=""
            width={320}
            height={320}
            priority
            className="h-auto w-48 md:w-80"
          />
        </Reveal>
      </div>
    </SectionContainer>
  );
}
