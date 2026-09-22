import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { HeroStage, type ShowcaseItem } from "@/components/sections/HeroStage";
import { HeroChatFragments, type Fragment } from "@/components/sections/HeroChatFragments";
import { SOCIAL_LINKS } from "@/lib/constants";

function HeroBackground({ chatFragments }: { chatFragments: Fragment[] }) {
  return (
    <>
      <div className="hero-wash absolute" />
      <div className="hero-grain absolute inset-0" />
      <div
        className="absolute top-1/2 left-1/2 h-[26rem] w-[613px] -translate-x-1/2 -translate-y-1/2 opacity-[0.18] blur-2xl md:h-[34rem]"
        style={{ backgroundImage: "url(/logo/logo-negative.svg)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
        aria-hidden="true"
      />
      <HeroChatFragments fragments={chatFragments} />
    </>
  );
}

export async function HeroSection() {
  const [t, tNews, tCommunity, tShowcase, tFragments] = await Promise.all([
    getTranslations("Hero"),
    getTranslations("News"),
    getTranslations("CommunityCta"),
    getTranslations("HeroShowcase"),
    getTranslations("HeroFragments"),
  ]);
  const rawItems = tNews.raw("items") as unknown[];
  const showcaseItems = rawItems.filter(
    (item): item is ShowcaseItem =>
      typeof item === "object" && item !== null && "title" in item && "category" in item,
  );
  const showcaseStats = tShowcase.raw("stats") as string[];
  const chatFragments = tFragments.raw("fragments") as Fragment[];

  return (
    <SectionContainer
      id="hero"
      background="dark"
      fullHeight
      backgroundDecoration={<HeroBackground chatFragments={chatFragments} />}
    >
      <HeroStage
        headline={t("headline")}
        subheadline={t("subheadline")}
        showcaseItems={showcaseItems}
        showcaseStats={showcaseStats}
        community={{
          ctaLabel: tCommunity("ctaLabel"),
          ctaHoverLabel: tCommunity("ctaHoverLabel"),
          ctaHref: SOCIAL_LINKS.discord,
        }}
      />
    </SectionContainer>
  );
}
