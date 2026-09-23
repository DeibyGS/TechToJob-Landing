import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { Reveal } from "@/components/ui/Reveal";
import { SOCIAL_LINKS } from "@/lib/constants";

export async function ClosingSection() {
  const t = await getTranslations("Closing");
  const tCommunity = await getTranslations("CommunityCta");

  return (
    <SectionContainer
      background="light"
      className="text-center"
      backgroundDecoration={
        <Image
          src="/images/closing/background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
      }
    >
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
          <Button
            label={tCommunity("ctaLabel")}
            hoverLabel={tCommunity("ctaHoverLabel")}
            href={SOCIAL_LINKS.discord}
            icon={<DiscordIcon />}
            target="_blank"
            rel="noopener noreferrer"
          />
        </Reveal>
        {/* Doubt-remover microcopy, not a Button prop — keeps Button generic
            for its 6 other callers (nav pills, BackToTop, Newsletter, ...).
            No member/company counts here per base.md: unconfirmed numbers
            are not allowed. */}
        <Reveal delay={0.25} className="mt-3">
          <p className="text-xs text-brand-dark/50">{t("ctaCaption")}</p>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
