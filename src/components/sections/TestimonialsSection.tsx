import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  timestamp: string;
  channel?: string;
};

export async function TestimonialsSection() {
  const t = await getTranslations("Testimonials");
  const items = t.raw("items") as Testimonial[];
  const slideLabels = (items as unknown[]).map((_: unknown, i: number) => t("slideLabel", { n: i + 1 }));

  return (
    <SectionContainer id="testimonials" background="dark">
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("headline")}</h2>
        <p className="mt-4 max-w-2xl text-brand-white/70">{t("description")}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <TestimonialsCarousel
          items={items}
          channelLabel={t("channelLabel")}
          channelDescription={t("channelDescription")}
          prevLabel={t("prevLabel")}
          nextLabel={t("nextLabel")}
          slideLabels={slideLabels}
          paginationLabel={t("paginationLabel")}
        />
      </Reveal>
    </SectionContainer>
  );
}
