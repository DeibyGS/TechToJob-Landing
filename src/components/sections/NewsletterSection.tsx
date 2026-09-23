import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Mail } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export async function NewsletterSection() {
  const t = await getTranslations("Newsletter");

  return (
    <SectionContainer
      id="newsletter"
      background="dark"
      backgroundDecoration={
        <Image
          src="/images/newsletter/background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-70"
          loading="lazy"
        />
      }
    >
      <Reveal className="mx-auto max-w-xl">
        <Card border="light" className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand-teal/40 bg-brand-teal/10">
            <Mail className="h-5 w-5 text-brand-teal" strokeWidth={2} aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {t("headline")}
          </h2>
          <p className="mt-4 text-brand-white/70">{t("description")}</p>
          <div className="mt-8 text-center sm:text-left">
            <NewsletterForm
              placeholder={t("placeholder")}
              submitLabel={t("submitLabel")}
              successMessage={t("successMessage")}
              errorMessage={t("errorMessage")}
              configNotice={t("configNotice")}
            />
          </div>
        </Card>
      </Reveal>
    </SectionContainer>
  );
}
