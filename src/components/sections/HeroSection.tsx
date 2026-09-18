import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { HeroStage } from "@/components/sections/HeroStage";
import { SOCIAL_LINKS } from "@/lib/constants";

type ShowcaseItem = { title: string; category: string };

export async function HeroSection() {
  const [t, tNews, tCommunity] = await Promise.all([
    getTranslations("Hero"),
    getTranslations("News"),
    getTranslations("HeroCommunity"),
  ]);
  const rawItems = tNews.raw("items") as unknown[];
  const showcaseItems = rawItems.filter(
    (item): item is ShowcaseItem =>
      typeof item === "object" && item !== null && "title" in item && "category" in item,
  );

  return (
    <SectionContainer id="hero" background="dark" fullHeight className="overflow-hidden">
      <HeroStage
        headline={t("headline")}
        subheadline={t("subheadline")}
        showcaseItems={showcaseItems}
        community={{
          members: tCommunity("members"),
          online: tCommunity("online"),
          channels: tCommunity.raw("channels") as string[],
          channelOnline: tCommunity("channelOnline"),
          ctaLabel: tCommunity("ctaLabel"),
          ctaHoverLabel: tCommunity("ctaHoverLabel"),
          ctaHref: SOCIAL_LINKS.discord,
        }}
      />
    </SectionContainer>
  );
}
