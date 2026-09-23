import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Trophy, Users, Briefcase, GitBranch, Hash, type LucideIcon } from "lucide-react";
import { TESTIMONIAL_PHOTO_BY_NAME } from "@/components/sections/TestimonialsSection";

type ChannelData = {
  name: string;
  caption: string;
};

// Same 5 channels the old bento leaned on, same icons as the header's
// ChannelMarquee so a channel's icon stays consistent everywhere it appears.
const CHIP_CHANNELS: { index: number; Icon: LucideIcon; top: number; left: number; mobileVisible: boolean }[] = [
  { index: 0, Icon: Trophy, top: 6, left: 4, mobileVisible: true }, // torneos
  { index: 2, Icon: Briefcase, top: 1, left: 74, mobileVisible: true }, // oportunidades
  { index: 1, Icon: Users, top: 70, left: 72, mobileVisible: false }, // comunidad
  { index: 4, Icon: GitBranch, top: 92, left: 28, mobileVisible: false }, // open-source
  { index: 7, Icon: Hash, top: 38, left: 2, mobileVisible: true }, // networking
];

const BLOBS = [
  "top-[-10%] left-[-8%] h-56 w-56 bg-brand-teal/10",
  "bottom-[-15%] right-[-10%] h-64 w-64 bg-brand-teal/10",
  "top-[35%] left-[45%] h-40 w-40 bg-brand-teal/[0.07]",
];

type AvatarSpec = {
  name: string;
  top: number;
  left: number;
  mobileSize: string;
  desktopSize: string;
  anchor?: boolean;
  hiddenOnMobile?: boolean;
};

// Coordinates are center-points (top/left %) checked pairwise against each
// avatar's radius so none of them fully overlap at the ~600×450 baseline
// this was designed against — denser toward the middle, thinning at the
// edges, echoing the reference cluster Deiby shared. `anchor` doubles as the
// "spot color" flag: the 2 largest faces stay in full color, the rest are
// grayscale — draws the eye and breaks up the all-gray flatness.
const AVATARS: AvatarSpec[] = [
  { name: "Laura", top: 42, left: 38, mobileSize: "h-14 w-14", desktopSize: "lg:h-24 lg:w-24", anchor: true },
  { name: "Alex Dev", top: 58, left: 62, mobileSize: "h-14 w-14", desktopSize: "lg:h-28 lg:w-28", anchor: true },
  { name: "Diego", top: 20, left: 55, mobileSize: "h-10 w-10", desktopSize: "lg:h-16 lg:w-16" },
  { name: "Lucía Code", top: 68, left: 30, mobileSize: "h-10 w-10", desktopSize: "lg:h-20 lg:w-20" },
  { name: "Javi", top: 30, left: 18, mobileSize: "h-10 w-10", desktopSize: "lg:h-16 lg:w-16" },
  { name: "Sara Ops", top: 78, left: 55, mobileSize: "h-10 w-10", desktopSize: "lg:h-16 lg:w-16" },
  { name: "Elena", top: 10, left: 30, mobileSize: "h-8 w-8", desktopSize: "lg:h-12 lg:w-12" },
  { name: "Sofía", top: 15, left: 78, mobileSize: "h-8 w-8", desktopSize: "lg:h-14 lg:w-14" },
  { name: "María", top: 48, left: 85, mobileSize: "", desktopSize: "lg:h-12 lg:w-12", hiddenOnMobile: true },
  { name: "Dani Back", top: 85, left: 20, mobileSize: "", desktopSize: "lg:h-14 lg:w-14", hiddenOnMobile: true },
  { name: "Nuria UX", top: 62, left: 8, mobileSize: "", desktopSize: "lg:h-12 lg:w-12", hiddenOnMobile: true },
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

// Static export — public/ is on disk at build time, so this file-existence
// check is free and safe here (never runs client-side). Lets the section
// ship today and self-upgrade the moment Deiby drops the real photo in,
// with no code change: falls back to a DiceBear avatar (same one
// NetworkingPulse already uses) instead of a broken image.
function resolveAvatarPhoto(name: string): string {
  const testimonialPhoto = TESTIMONIAL_PHOTO_BY_NAME[name];
  if (testimonialPhoto) return testimonialPhoto;

  const slug = slugify(name);
  const filePath = path.join(process.cwd(), "public", "images", "community", `${slug}.webp`);
  if (fs.existsSync(filePath)) return `/images/community/${slug}.webp`;

  return `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

/**
 * Replaces the old channel bento: an organic cluster of community-member
 * avatars with a few legible channel chips and decorative blurred bubbles
 * behind them — the "who's already here" social-proof pattern, not a grid.
 */
export function CommunityAvatarCluster({ channels }: { channels: ChannelData[] }) {
  const avatars = AVATARS.map((avatar) => ({ ...avatar, photo: resolveAvatarPhoto(avatar.name) }));

  return (
    <div className="relative h-[260px] w-full overflow-hidden lg:h-full">
      {/* Accessible equivalent of the decorative chips below — the real content */}
      <ul className="sr-only">
        {CHIP_CHANNELS.map(({ index }) => (
          <li key={channels[index].name}>
            {channels[index].name}: {channels[index].caption}
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="absolute inset-0">
        {BLOBS.map((classes, i) => (
          <span key={i} className={`absolute hidden rounded-full blur-3xl lg:block ${classes}`} />
        ))}

        {/* Chips render first (behind, in DOM order) and sit at z-0 — pure
            background atmosphere, never allowed to cover a photo */}
        {CHIP_CHANNELS.map(({ index, Icon, top, left, mobileVisible }) => (
          <div
            key={channels[index].name}
            className={`absolute z-0 max-w-[12rem] items-start gap-1.5 rounded-2xl border border-brand-dark/5 bg-white/70 px-3 py-2 text-[11px] font-medium leading-snug text-brand-dark/70 shadow-[0_2px_8px_rgba(47,52,54,0.06)] lg:text-xs ${mobileVisible ? "flex" : "hidden lg:flex"}`}
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal/70" strokeWidth={2} aria-hidden="true" />
            {channels[index].caption}
          </div>
        ))}

        {avatars.map((avatar) => (
          <div
            key={avatar.name}
            className={`absolute z-10 overflow-hidden rounded-full ${avatar.anchor ? "border-[3px]" : "border-2 grayscale"} border-brand-teal/50 shadow-[0_6px_16px_rgba(47,52,54,0.18)] ${avatar.hiddenOnMobile ? "hidden lg:block" : avatar.mobileSize} ${avatar.desktopSize}`}
            style={{ top: `${avatar.top}%`, left: `${avatar.left}%`, transform: "translate(-50%, -50%)" }}
          >
            <Image
              src={avatar.photo}
              alt=""
              fill
              unoptimized={avatar.photo.startsWith("http")}
              sizes="112px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
