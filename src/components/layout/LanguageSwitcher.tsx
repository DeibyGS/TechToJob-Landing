"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type LanguageSwitcherProps = {
  currentLocale: string;
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    // Same pill-group language as NavLinks (rounded-full, subtle border,
    // near-transparent fill, teal on the active/hovered item) — both
    // controls only ever render inside the header once it's revealed
    // (light `brand-white` background), so they should read as one system.
    <nav
      aria-label="Language"
      className="flex items-center gap-1 rounded-full border border-brand-teal/25 bg-brand-white p-1 text-xs font-semibold shadow-[0_4px_16px_rgba(132,192,191,0.2)]"
    >
      {routing.locales.map((locale) => {
        const isCurrent = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={isCurrent ? "true" : undefined}
            className={
              isCurrent
                ? "rounded-full bg-brand-teal px-2.5 py-1 text-brand-dark"
                : "rounded-full px-2.5 py-1 text-brand-dark/70 transition-colors hover:bg-brand-teal hover:text-brand-dark"
            }
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
