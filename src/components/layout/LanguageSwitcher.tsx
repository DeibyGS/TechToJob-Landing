"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

type LanguageSwitcherProps = {
  currentLocale: string;
  /** Callback when language is switched (used by mobile menu to close itself). */
  onSwitch?: () => void;
};

export function LanguageSwitcher({ currentLocale, onSwitch }: LanguageSwitcherProps) {
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
      {routing.locales.map((locale) => (
        <Button
          key={locale}
          variant="pill"
          as={Link}
          className="px-3 py-2"
          label={locale.toUpperCase()}
          href={pathname}
          locale={locale}
          scroll={false}
          isActive={locale === currentLocale}
          aria-current={locale === currentLocale ? "true" : undefined}
          onClick={onSwitch}
        />
      ))}
    </nav>
  );
}
