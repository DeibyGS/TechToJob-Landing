import { getTranslations } from "next-intl/server";
import { HeaderLogo } from "@/components/layout/HeaderLogo";
import { NavLinks } from "@/components/layout/NavLinks";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { HeaderReveal } from "@/components/layout/HeaderReveal";

export async function Header({ locale }: { locale: string }) {
  const tNav = await getTranslations("Nav");

  // Order mirrors the actual section order in page.tsx — the active-link
  // highlight tracks scroll position, so a nav order that matches the page
  // is what keeps it advancing forward instead of jumping around.
  const links = [
    { id: "how-it-works", label: tNav("links.howItWorks") },
    { id: "talent", label: tNav("links.talent") },
    { id: "companies", label: tNav("links.companies") },
    { id: "tournaments", label: tNav("links.tournaments") },
    { id: "networking", label: tNav("links.community") },
    { id: "testimonials", label: tNav("links.testimonials") },
  ];

  return (
    <HeaderReveal>
      {/* md:grid with 1fr/auto/1fr columns — logo and language switcher get
          equal-width flanking columns regardless of their own content
          width, which is what makes the nav in the middle column land at
          the true center of the header instead of just the center of the
          leftover space next to an unevenly-sized neighbor. */}
      <header className="relative flex h-16 items-center justify-between gap-4 px-4 md:grid md:h-20 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <div className="md:justify-self-start">
          <HeaderLogo />
        </div>
        <div className="hidden md:flex md:justify-self-center">
          <NavLinks links={links} />
        </div>
        <div className="hidden md:flex md:justify-self-end">
          <LanguageSwitcher currentLocale={locale} />
        </div>
        {/* Mobile: hamburger menu (contains nav + language switcher) */}
        <MobileMenu links={links} currentLocale={locale} />
      </header>
    </HeaderReveal>
  );
}
