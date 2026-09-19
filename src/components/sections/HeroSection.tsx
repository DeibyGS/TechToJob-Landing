import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { HeroStage, type ShowcaseItem } from "@/components/sections/HeroStage";
import { HeroChatFragments, type Fragment } from "@/components/sections/HeroChatFragments";
import { SOCIAL_LINKS } from "@/lib/constants";

// Rendered via SectionContainer's `backgroundDecoration` slot so it washes
// the ENTIRE section (corners included), not just the centered max-w-7xl
// column HeroStage's own content lives in — a plain sibling inside HeroStage
// can only ever cover that narrower box.
//
// `.hero-wash` is a CSS class (globals.css), not discrete blob elements —
// fixed-rem-sized blurred circles don't scale with viewport width, so on a
// wide screen (1512px+) the gaps between corner blobs went uncovered,
// leaving visible dark bands down the middle-left/middle-right edges
// (confirmed against a real screenshot, not a guess). A background made of
// several percentage-positioned radial-gradients scales with the box by
// construction, so it always reaches full width/height with no gaps.
function HeroBackground({ chatFragments }: { chatFragments: Fragment[] }) {
  return (
    <>
      <div className="hero-wash absolute" />
      <div className="hero-grain absolute inset-0" />
      <Image
        src="/logo/logo-negative.svg"
        alt=""
        width={613}
        height={340}
        className="absolute top-1/2 left-1/2 h-[26rem] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.18] blur-2xl md:h-[34rem]"
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
