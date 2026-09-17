import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { HeroStage } from "@/components/sections/HeroStage";
import { SOCIAL_LINKS } from "@/lib/constants";

export async function HeroSection() {
  const [t, tCommon, tMockup] = await Promise.all([
    getTranslations("Hero"),
    getTranslations("Common"),
    getTranslations("HeroMockup"),
  ]);
  const mockupMessages = tMockup.raw("messages") as { sender: string; text: string }[];

  return (
    <SectionContainer background="light" className="pt-16 md:pt-24">
      <HeroStage
        headline={t("headline")}
        subheadline={t("subheadline")}
        ctaLabel={tCommon("ctaDiscord")}
        ctaHref={SOCIAL_LINKS.discord}
        mockup={{
          channelLabel: tMockup("channelLabel"),
          onlineLabel: tMockup("onlineLabel"),
          messages: mockupMessages,
        }}
      />
    </SectionContainer>
  );
}
