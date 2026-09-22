import { getTranslations } from "next-intl/server";
import { Hash, Briefcase, FolderGit2, Layout, Server, Users, MessageCircle } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";

const CHANNEL_ICONS = [Briefcase, FolderGit2, Layout, Server, Users];
const FALLBACK_CHANNEL_ICON = Hash;

type ChannelData = {
  name: string;
  description: string;
};

function NetworkingBackground() {
  return (
    <>
      {/* Subtle radial gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 70%, rgba(132,192,191,0.06), transparent 70%)",
        }}
      />
      {/* Watermark logo symbol */}
      <img
        aria-hidden
        src="/logo/simbolo-negativo.svg"
        alt=""
        className="absolute -left-16 bottom-0 h-[350px] w-auto opacity-[0.03] select-none"
      />
    </>
  );
}

export async function NetworkingSection() {
  const t = await getTranslations("Networking");
  const channelNames = t.raw("channels") as string[];
  const channelDescriptions = t.raw("channelDescriptions") as string[];

  const channels: ChannelData[] = channelNames.map((name, i) => ({
    name,
    description: channelDescriptions[i] ?? "",
  }));

  return (
    <SectionContainer
      id="networking"
      background="light"
      className="relative overflow-hidden"
      backgroundDecoration={<NetworkingBackground />}
    >
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-dark/70">{t("description")}</p>
      </Reveal>

      {/* Channel cards grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel, index) => {
          const Icon = CHANNEL_ICONS[index] ?? FALLBACK_CHANNEL_ICON;

          return (
            <Reveal key={channel.name} delay={0.1 + index * 0.06}>
              <div className="group flex items-start gap-4 rounded-2xl border border-brand-dark/10 bg-brand-teal/5 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal/20 hover:bg-brand-teal/10 hover:shadow-md hover:shadow-brand-teal/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10">
                  <Icon
                    className="h-5 w-5 text-brand-teal"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-brand-dark">
                    {channel.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-dark/60">
                    {channel.description}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Activity strip */}
      <Reveal delay={0.4} className="mt-8">
        <div className="flex items-center justify-center gap-2 text-sm text-brand-dark/40">
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>{t("activityStrip")}</span>
        </div>
      </Reveal>
    </SectionContainer>
  );
}
