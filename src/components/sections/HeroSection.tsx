import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { HeroStage } from "@/components/sections/HeroStage";
import { HeroChatFragments, type Fragment } from "@/components/sections/HeroChatFragments";
import { SOCIAL_LINKS } from "@/lib/constants";

function HeroBackground({ chatFragments }: { chatFragments: Fragment[] }) {
  return (
    <>
      <div className="hero-wash absolute" />
      <div className="hero-grain absolute inset-0" />
      {/* Real <img> (not a CSS background-image) because this blurred mark is
          the page's LCP element: an <img> in the HTML is found by the
          browser's preload scanner, while a background url() is only fetched
          after styles resolve. Eager + high fetch priority per the Next 16
          image docs (`priority` is deprecated there). */}
      <div
        className="absolute top-1/2 left-1/2 h-[26rem] w-[613px] -translate-x-1/2 -translate-y-1/2 opacity-[0.18] blur-2xl md:h-[34rem]"
        aria-hidden="true"
      >
        <Image src="/logo/logo-negative.svg" alt="" fill loading="eager" fetchPriority="high" sizes="613px" className="object-contain" />
      </div>
      <HeroChatFragments fragments={chatFragments} />
    </>
  );
}

export async function HeroSection() {
  const [t, tCommunity, tShowcase, tFragments] = await Promise.all([
    getTranslations("Hero"),
    getTranslations("CommunityCta"),
    getTranslations("HeroShowcase"),
    getTranslations("HeroFragments"),
  ]);
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
        badge={tShowcase("badge")}
        community={{
          ctaLabel: tCommunity("ctaLabel"),
          ctaHoverLabel: tCommunity("ctaHoverLabel"),
          ctaHref: SOCIAL_LINKS.discord,
        }}
      />
    </SectionContainer>
  );
}
