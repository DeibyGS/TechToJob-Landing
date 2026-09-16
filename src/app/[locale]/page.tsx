import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { TalentSection } from "@/components/sections/TalentSection";
import { CompanySection } from "@/components/sections/CompanySection";
import { TournamentsSection } from "@/components/sections/TournamentsSection";
import { NetworkingSection } from "@/components/sections/NetworkingSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ClosingSection } from "@/components/sections/ClosingSection";
import { FooterSection } from "@/components/sections/FooterSection";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header locale={locale} />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TalentSection />
        <CompanySection />
        <TournamentsSection />
        <NetworkingSection />
        <NewsSection />
        <NewsletterSection />
        <ClosingSection />
      </main>
      <FooterSection />
    </>
  );
}
