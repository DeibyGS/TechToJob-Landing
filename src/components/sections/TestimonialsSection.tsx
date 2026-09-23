import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialsCarousel } from "@/components/ui/TestimonialsCarousel";

type TestimonialCopy = {
  name: string;
  role: string;
  quote: string;
};

type Testimonial = TestimonialCopy & {
  photo: string;
  profileUrl?: string;
};

// AI-generated placeholder portraits, filed under public/images/testimonials/
// — real member photos + verified profile links replace these before the
// site goes live (base.md requirement). Same file across both locales.
export const TESTIMONIAL_PHOTO_BY_NAME: Record<string, string> = {
  "Alex Dev": "/images/testimonials/alex-dev.webp",
  "Lucía Code": "/images/testimonials/lucia-code.webp",
  "Sara Ops": "/images/testimonials/sara-ops.webp",
  "Dani Back": "/images/testimonials/dani-back.webp",
  "Nuria UX": "/images/testimonials/nuria-ux.webp",
};

export async function TestimonialsSection() {
  const t = await getTranslations("Testimonials");
  const copy = t.raw("items") as TestimonialCopy[];
  const items: Testimonial[] = copy.map((item) => ({
    ...item,
    photo: TESTIMONIAL_PHOTO_BY_NAME[item.name] ?? "/images/testimonials/placeholder.jpg",
    // base.md requires the design to leave room for a profile link — "#" until
    // real LinkedIn URLs are collected, so the placeholder UI still shows it
    profileUrl: "#",
  }));
  const slideLabels = items.map((_, i) => t("slideLabel", { n: i + 1 }));

  return (
    <SectionContainer id="testimonials" background="dark" padding="compact">
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("headline")}</h2>
        <p className="mt-4 max-w-2xl text-brand-white/70">{t("description")}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <TestimonialsCarousel
          items={items}
          prevLabel={t("prevLabel")}
          nextLabel={t("nextLabel")}
          slideLabels={slideLabels}
          paginationLabel={t("paginationLabel")}
        />
      </Reveal>
    </SectionContainer>
  );
}
