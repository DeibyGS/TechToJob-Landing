"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type LanguageSwitcherProps = {
  currentLocale: string;
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Language" className="flex gap-2 text-sm font-medium">
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
                ? "font-bold text-brand-dark underline underline-offset-4"
                : "text-brand-dark hover:underline"
            }
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
