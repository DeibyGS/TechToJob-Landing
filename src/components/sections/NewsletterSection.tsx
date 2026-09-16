import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export async function NewsletterSection() {
  const t = await getTranslations("Newsletter");

  return (
    <SectionContainer id="newsletter" background="dark">
      <Reveal className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 text-brand-white/70">{t("description")}</p>
        <div className="mt-8 text-left">
          <NewsletterForm
            placeholder={t("placeholder")}
            submitLabel={t("submitLabel")}
            successMessage={t("successMessage")}
            errorMessage={t("errorMessage")}
            configNotice={t("configNotice")}
          />
        </div>
      </Reveal>
    </SectionContainer>
  );
}
