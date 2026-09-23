import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { ChannelMarquee } from "@/components/layout/ChannelMarquee";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { CompanySection } from "@/components/sections/CompanySection";
import { TalentSection } from "@/components/sections/TalentSection";
import { TournamentsSection } from "@/components/sections/TournamentsSection";
import { NetworkingSection } from "@/components/sections/NetworkingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { SectionDivider } from "@/components/ui/SectionDivider";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header locale={locale} />
      <ChannelMarquee />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <SectionDivider />
        <TalentSection />
        <CompanySection />
        <TournamentsSection />
        <NetworkingSection />
        <TestimonialsSection />
        <NewsSection />
        <NewsletterSection />
        <ClosingSection />
      </main>
      <FooterSection />
    </>
  );
}
