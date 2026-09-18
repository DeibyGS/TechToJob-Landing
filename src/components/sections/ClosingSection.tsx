import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { DiscordCtaButton } from "@/components/ui/DiscordCtaButton";
import { Reveal } from "@/components/ui/Reveal";
import { SOCIAL_LINKS } from "@/lib/constants";

export async function ClosingSection() {
  const t = await getTranslations("Closing");
  const tCommunity = await getTranslations("CommunityCta");

  return (
    <SectionContainer background="light" className="text-center">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            {t("headline")}
          </h2>
          <p className="mt-4 text-brand-dark/70">{t("description")}</p>
        </Reveal>
        {/* Exactly the Hero's CTA — same component, same copy, same style,
            not a look-alike. Its dark drop-shadow/teal glow carry contrast
            on their own regardless of this section's light background. */}
        <Reveal delay={0.15} className="mt-8 flex justify-center">
          <DiscordCtaButton
            ctaLabel={tCommunity("ctaLabel")}
            ctaHoverLabel={tCommunity("ctaHoverLabel")}
            ctaHref={SOCIAL_LINKS.discord}
          />
        </Reveal>
      </div>
    </SectionContainer>
  );
}
