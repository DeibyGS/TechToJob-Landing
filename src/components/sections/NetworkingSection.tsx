import { getTranslations } from "next-intl/server";
import { Hash, Briefcase, FolderGit2, Layout, Server, Users } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";

// Index-mapped to Networking.channels (#jobs #projects #frontend #backend
// #networking) — same array shape reused by ChannelMarquee for continuity.
const CHANNEL_ICONS = [Briefcase, FolderGit2, Layout, Server, Users];
const FALLBACK_CHANNEL_ICON = Hash;
const PRIMARY_CHANNEL_COUNT = 2;

export async function NetworkingSection() {
  const t = await getTranslations("Networking");
  const channels = t.raw("channels") as string[];

  return (
    <SectionContainer id="networking" background="light" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 -z-10 h-72 w-72 rounded-full bg-brand-teal/10 blur-3xl" />
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-dark/70">{t("description")}</p>
      </Reveal>
      <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
        {channels.map((channel, index) => {
          const Icon = CHANNEL_ICONS[index] ?? FALLBACK_CHANNEL_ICON;
          const isPrimary = index < PRIMARY_CHANNEL_COUNT;
          return (
            <Reveal key={channel} delay={0.15 + index * 0.05} whileHover={{ scale: 1.05, y: -2 }}>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border border-brand-dark/10 bg-brand-teal/10 font-medium text-brand-dark ${
                  isPrimary ? "px-5 py-2.5 text-base" : "px-4 py-2 text-sm"
                }`}
              >
                <Icon className="h-4 w-4 text-brand-teal" strokeWidth={2} aria-hidden="true" />
                {channel}
              </span>
            </Reveal>
          );
        })}
      </Reveal>
    </SectionContainer>
  );
}
