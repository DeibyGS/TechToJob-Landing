import { getTranslations } from "next-intl/server";
import Image from "next/image";
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
  const readMoreLabel = t("readMoreLabel");

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
            <NewsCard item={item} featured={index === 0} readMoreLabel={readMoreLabel} />
          </Reveal>
        ))}
      </div>
    </SectionContainer>
  );
}

function NewsCard({
  item,
  featured,
  readMoreLabel,
}: {
  item: NewsItem;
  featured: boolean;
  readMoreLabel: string;
}) {
  if (featured) {
    return (
      <Card
        as="article"
        border="light"
        className="relative flex h-full flex-col overflow-hidden bg-brand-dark text-brand-white md:flex-row md:items-center md:gap-10"
      >
        <Image
          src="/images/news/featured-banner.webp"
          alt=""
          fill
          sizes="(min-width: 768px) 1152px, 100vw"
          className="object-cover"
          loading="lazy"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/30"
        />
        <div className="relative flex-1">
          <CategoryBadge category={item.category} />
          <h3 className="mt-4 text-2xl font-semibold md:text-3xl">{item.title}</h3>
          <p className="mt-3 text-brand-white/70">{item.summary}</p>
          <ReadMoreLink label={readMoreLabel} title={item.title} onDark />
        </div>
        <span className="relative mt-6 flex shrink-0 items-center gap-1.5 text-sm text-brand-white/50 md:mt-0">
          <Calendar className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {item.date}
        </span>
      </Card>
    );
  }

  return (
    <Card as="article" className="relative flex h-full flex-col overflow-hidden">
      <Image
        src="/images/news/regular-card-texture.webp"
        alt=""
        fill
        sizes="(min-width: 768px) 576px, 100vw"
        className="object-cover"
        loading="lazy"
      />
      <div className="relative">
        <CategoryBadge category={item.category} />
        <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
        <p className="mt-2 text-brand-dark/70">{item.summary}</p>
        <span className="mt-4 flex items-center gap-1.5 text-sm text-brand-dark/50">
          <Calendar className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          {item.date}
        </span>
        <ReadMoreLink label={readMoreLabel} title={item.title} />
      </div>
    </Card>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-teal">
      <Tag className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      {category}
    </span>
  );
}

// Same underline-grow + teal-glow hover as the footer's links — a deliberate
// reused pattern so any interactive text link on the site reads the same way.
// base.md bans bare "read more" link text: the visible label stays short,
// but the accessible name (screen readers, crawlers) includes the entry title.
function ReadMoreLink({ label, title, onDark }: { label: string; title: string; onDark?: boolean }) {
  return (
    <a
      href="#"
      className={`relative mt-4 block text-sm font-semibold transition-colors duration-200 hover:text-brand-teal hover:drop-shadow-[0_0_6px_rgba(132,192,191,0.5)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand-teal after:transition-all after:duration-300 hover:after:w-full ${
        onDark ? "text-brand-white/70" : "text-brand-dark/70"
      }`}
    >
      {label}
      <span className="sr-only">: {title}</span>
    </a>
  );
}
