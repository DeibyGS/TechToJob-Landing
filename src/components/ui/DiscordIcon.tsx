import Image from "next/image";

// Discord isn't in lucide-react (it only ships generic UI glyphs). Duck-types
// as a LucideIcon (accepts className + aria-hidden) so it can be passed as
// Button's `icon` prop like any other lucide icon — Button itself stays
// unaware that "Discord" is a special case.
const DISCORD_ICON_COLOR = "2f3436";

export function DiscordIcon({ className, "aria-hidden": ariaHidden }: { className?: string; "aria-hidden"?: boolean }) {
  return (
    <Image
      src={`https://cdn.simpleicons.org/discord/${DISCORD_ICON_COLOR}`}
      alt=""
      width={16}
      height={16}
      unoptimized
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}
