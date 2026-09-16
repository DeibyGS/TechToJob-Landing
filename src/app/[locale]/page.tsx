import { setRequestLocale, getTranslations } from "next-intl/server";
import { SOCIAL_LINKS } from "@/lib/constants";

export default async function HomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Common");

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <a
        href={SOCIAL_LINKS.discord}
        className="rounded-full bg-brand-teal px-6 py-3 font-semibold text-brand-dark"
      >
        {t("ctaDiscord")}
      </a>
    </main>
  );
}
