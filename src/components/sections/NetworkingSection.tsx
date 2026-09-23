import { getTranslations } from "next-intl/server";
import { Trophy, Users, Briefcase, GitBranch, Hash } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { NetworkingPulse, type Fragment } from "@/components/sections/NetworkingPulse";

// Reused verbatim from HeroFragments — real community chatter already
// written and approved, not new copy invented just for this preview. A
// pool bigger than what's shown at once (3) so NetworkingPulse has
// something to rotate through.
const PULSE_FRAGMENT_INDEXES = [6, 5, 9, 8, 4, 0]; // Laura, Diego, Javi, Elena, Sofía, María

type ChannelData = {
  name: string;
  caption: string;
};

// Only the 5 channels most relevant to "growing in the community" — not
// all 8 (those still show in the header's ChannelMarquee). Same icons as
// that marquee, so a channel's icon stays consistent everywhere it
// appears. `size` drives the bento's asymmetry: the two channels base.md
// leans on most (torneos, oportunidades) get the large solid tiles.
const GROWTH_CHANNELS = [
  { index: 0, Icon: Trophy, size: "lg" as const }, // torneos
  { index: 2, Icon: Briefcase, size: "lg" as const }, // oportunidades
  { index: 1, Icon: Users, size: "sm" as const }, // comunidad
  { index: 4, Icon: GitBranch, size: "sm" as const }, // open-source
  { index: 7, Icon: Hash, size: "wide" as const }, // networking
];

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
        className="absolute -left-16 inset-y-0 h-full w-auto opacity-[0.03] select-none"
      />
      {/* Second watermark, bottom-right — same mark the navbar uses (dark
          ink, meant for light backgrounds), to break up the empty white
          space at the bottom of the section. */}
      <img
        aria-hidden
        src="/logo/symbol-positive.svg"
        alt=""
        className="absolute -bottom-12 right-6 h-44 w-44 opacity-[0.05] select-none"
      />
    </>
  );
}

type TileSize = "lg" | "sm" | "wide";

// 6-column base grid: "lg" tiles take half the row each (3/6), "sm" and
// "wide" take a third each (2/6) — wider than a plain quarter-split so the
// 3-tile second row doesn't cramp its text.
const TILE_STYLES: Record<TileSize, string> = {
  lg: "col-span-3 bg-brand-teal text-brand-dark",
  sm: "col-span-2 bg-white border border-brand-dark/10 text-brand-dark",
  wide: "col-span-2 bg-brand-teal/10 border border-brand-teal/20 text-brand-dark",
};

/**
 * Asymmetric bento of the 5 channels most tied to "growing in the
 * community" — not a uniform grid, and not all 8 (the rest already show in
 * the header's ChannelMarquee). Each tile carries a short caption on how
 * that specific channel helps you grow, instead of just naming it.
 */
function GrowthGrid({ channels }: { channels: ChannelData[] }) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {GROWTH_CHANNELS.map(({ index, Icon, size }) => {
        const channel = channels[index];
        const isLg = size === "lg";
        return (
          <div key={channel.name} className={`flex flex-col gap-2 rounded-2xl p-5 ${TILE_STYLES[size]}`}>
            <Icon className={isLg ? "h-6 w-6" : "h-5 w-5 text-brand-teal"} strokeWidth={2} aria-hidden="true" />
            <h3 className={isLg ? "text-base font-semibold" : "text-sm font-semibold"}>{channel.name}</h3>
            <p className={isLg ? "text-sm text-brand-dark/80" : "text-xs text-brand-dark/60"}>{channel.caption}</p>
          </div>
        );
      })}
    </div>
  );
}

export async function NetworkingSection() {
  const [t, tFragments] = await Promise.all([
    getTranslations("Networking"),
    getTranslations("HeroFragments"),
  ]);
  const channelNames = t.raw("channels") as string[];
  const growthCaptions = t.raw("growthCaptions") as string[];
  const allFragments = tFragments.raw("fragments") as Fragment[];

  const channels: ChannelData[] = channelNames.map((name, i) => ({
    name,
    caption: growthCaptions[i] ?? "",
  }));
  const pulsePool = PULSE_FRAGMENT_INDEXES.map((i) => allFragments[i]).filter(Boolean);

  return (
    <SectionContainer
      id="networking"
      background="light"
      padding="compact"
      className="relative overflow-hidden"
      backgroundDecoration={<NetworkingBackground />}
    >
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-dark/70">{t("description")}</p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-brand-dark/10 bg-white p-6">
            <GrowthGrid channels={channels} />
          </div>
        </Reveal>
        <Reveal delay={0.22}>
          <NetworkingPulse activityLabel={t("activityStrip")} pool={pulsePool} />
        </Reveal>
      </div>
    </SectionContainer>
  );
}
