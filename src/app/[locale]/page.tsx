import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { TalentSection } from "@/components/sections/TalentSection";
import { CompanySection } from "@/components/sections/CompanySection";
import { TournamentsSection } from "@/components/sections/TournamentsSection";

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
      </main>
    </>
  );
}
