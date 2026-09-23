import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { NetworkingPulse, type Fragment } from "@/components/sections/NetworkingPulse";
import { CommunityAvatarCluster } from "@/components/sections/CommunityAvatarCluster";

// Reused verbatim from HeroFragments — real community chatter already
// written and approved, not new copy invented just for this preview. A
// pool bigger than what's shown at once (3) so NetworkingPulse has
// something to rotate through. Same 6 identities also appear as avatars in
// CommunityAvatarCluster, so the "faces" and the "voices" are consistent.
const PULSE_FRAGMENT_INDEXES = [6, 5, 9, 8, 4, 0]; // Laura, Diego, Javi, Elena, Sofía, María

type ChannelData = {
  name: string;
  caption: string;
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
      {/* Watermark logo symbol — full section height, left side (Tournaments
          above uses the same mark on the right, alternating sides keeps two
          adjacent sections from stacking the same watermark on one edge). */}
      <img
        aria-hidden
        src="/logo/simbolo-negativo.svg"
        alt=""
        className="absolute -left-16 inset-y-0 h-full w-auto opacity-[0.03] select-none"
      />
    </>
  );
}

export async function NetworkingSection() {
  const [t, tFragments] = await Promise.all([
    getTranslations("Networking"),
    getTranslations("HeroFragments"),
  ]);
  const channelNames = t.raw("channels") as string[];
  const chipQuotes = t.raw("chipQuotes") as string[];
  const allFragments = tFragments.raw("fragments") as Fragment[];

  const channels: ChannelData[] = channelNames.map((name, i) => ({
    name,
    caption: chipQuotes[i] ?? "",
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

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal delay={0.1} className="h-full">
          <div className="h-full overflow-hidden rounded-2xl border border-brand-dark/10 bg-gradient-to-br from-brand-teal/80 via-brand-teal/5 to-white">
            <CommunityAvatarCluster channels={channels} />
          </div>
        </Reveal>
        <Reveal delay={0.22} className="h-full">
          <NetworkingPulse
            activityLabel={t("activityStrip")}
            channelName={t("pulseChannel")}
            chatPlaceholder={t("chatPlaceholder")}
            pool={pulsePool}
          />
        </Reveal>
      </div>
    </SectionContainer>
  );
}
