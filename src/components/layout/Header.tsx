import Image from "next/image";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Header({ locale }: { locale: string }) {
  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-8">
      <Image
        src="/logo/logo-positive.svg"
        alt="TechToJob"
        width={140}
        height={32}
        priority
        className="h-8 w-auto"
      />
      <LanguageSwitcher currentLocale={locale} />
    </header>
  );
}
