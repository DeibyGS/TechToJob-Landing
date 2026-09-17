import { getTranslations } from "next-intl/server";
import { Calendar, Tag } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

type NewsItem = {
  title: string;
  date: string;
  category: string;
  summary: string;
};

export async function NewsSection() {
  const t = await getTranslations("News");
  const items = t.raw("items") as NewsItem[];

  return (
    <SectionContainer id="news" background="light">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <Reveal
            key={item.title}
            delay={index === 0 ? 0 : 0.1 + (index - 1) * 0.1}
            className={index === 0 ? "md:col-span-2" : undefined}
          >
            <NewsCard item={item} featured={index === 0} />
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}

function NewsCard({ item, featured }: { item: NewsItem; featured: boolean }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center gap-4 text-sm text-brand-dark/60">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {item.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Tag className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {item.category}
        </span>
      </div>
      <h3
        className={`mt-4 font-semibold ${featured ? "text-2xl" : "text-xl"}`}
      >
        {item.title}
      </h3>
      <p className="mt-2 text-brand-dark/70">{item.summary}</p>
    </Card>
  );
}
