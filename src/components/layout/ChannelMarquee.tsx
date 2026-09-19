import { getTranslations } from "next-intl/server";
import { Trophy, Users, Briefcase, Palette, GitBranch, Sparkles, Terminal, Hash } from "lucide-react";

const CHANNEL_ICONS = [Trophy, Users, Briefcase, Palette, GitBranch, Sparkles, Terminal, Hash];
const FALLBACK_CHANNEL_ICON = Hash;

// Copies of the channel list rendered back-to-back for the loop. The
// translateX(-100%/COPY_COUNT) trick only stays gap-free while the visible
// viewport is narrower than (COPY_COUNT - 1) copies' width — 2 copies broke
// on any viewport wider than a single copy (5 short pills), showing an empty
// gap near the end of each cycle. 6 comfortably covers ultra-wide viewports.
const COPY_COUNT = 6;

/**
 * Ambient, continuously auto-scrolling strip under the header (pure CSS
 * keyframe loop, no motion/GSAP — no scroll-link or interaction to justify
 * either). Reuses Networking.channels so it needs no new copy. The whole
 * track is aria-hidden since the same channels are announced meaningfully in
 * the Networking section further down the page.
 */
export async function ChannelMarquee() {
  const t = await getTranslations("Networking");
  const channels = t.raw("channels") as string[];

  const track = channels.map((channel, index) => {
    const Icon = CHANNEL_ICONS[index] ?? FALLBACK_CHANNEL_ICON;
    return (
      <span key={channel} className="flex items-center gap-2 whitespace-nowrap px-6 text-sm font-medium text-brand-white">
        <Icon className="h-4 w-4 text-brand-teal" aria-hidden />
        {channel}
      </span>
    );
  });

  return (
    <div className="relative overflow-hidden bg-brand-dark py-2.5">
      {/* Left fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-dark to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-dark to-transparent" />
      <div aria-hidden="true" className="marquee-track flex w-max">
        {Array.from({ length: COPY_COUNT }, (_, copyIndex) => (
          <div key={copyIndex} className="flex shrink-0">
            {track}
          </div>
        ))}
      </div>
    </div>
  );
}
