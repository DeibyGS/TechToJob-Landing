import { getTranslations } from "next-intl/server";
import { HeaderLogo } from "@/components/layout/HeaderLogo";
import { NavLinks } from "@/components/layout/NavLinks";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { HeaderReveal } from "@/components/layout/HeaderReveal";

export async function Header({ locale }: { locale: string }) {
  const tNav = await getTranslations("Nav");

  const links = [
    { id: "how-it-works", label: tNav("links.howItWorks") },
    { id: "companies", label: tNav("links.companies") },
    { id: "tournaments", label: tNav("links.tournaments") },
    { id: "networking", label: tNav("links.community") },
    { id: "testimonials", label: tNav("links.testimonials") },
  ];

  return (
    <HeaderReveal>
      <header className="flex h-16 items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <HeaderLogo />
        <NavLinks links={links} />
        <LanguageSwitcher currentLocale={locale} />
      </header>
    </HeaderReveal>
  );
}
