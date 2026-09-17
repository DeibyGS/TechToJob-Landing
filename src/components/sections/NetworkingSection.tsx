import { getTranslations } from "next-intl/server";
import { Hash } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";

export async function NetworkingSection() {
  const t = await getTranslations("Networking");
  const channels = t.raw("channels") as string[];

  return (
    <SectionContainer id="networking" background="light">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-dark/70">{t("description")}</p>
      </Reveal>
      <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
        {channels.map((channel, index) => (
          <Reveal key={channel} delay={0.15 + index * 0.05}>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-dark/10 bg-brand-teal/10 px-4 py-2 text-sm font-medium text-brand-dark"
            >
              <Hash className="h-4 w-4 text-brand-teal" strokeWidth={2} aria-hidden="true" />
              {channel}
            </span>
          </Reveal>
        ))}
      </Reveal>
    </SectionContainer>
  );
}
