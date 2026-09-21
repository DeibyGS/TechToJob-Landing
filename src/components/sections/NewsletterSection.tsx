import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export async function NewsletterSection() {
  const t = await getTranslations("Newsletter");

  return (
    <SectionContainer id="newsletter" background="dark">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("headline")}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-brand-white/70">{t("description")}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 text-center sm:text-left">
            <NewsletterForm
              placeholder={t("placeholder")}
              submitLabel={t("submitLabel")}
              successMessage={t("successMessage")}
              errorMessage={t("errorMessage")}
              configNotice={t("configNotice")}
            />
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
