import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SOCIAL_LINKS } from "@/lib/constants";

const FOOTER_LINK_HREFS: Record<string, string[]> = {
  talent: ["#talent", "#tournaments"],
  companies: ["#companies"],
  community: [SOCIAL_LINKS.discord, "#networking"],
};

// Brand icons aren't in lucide-react (it only ships generic UI glyphs) — real
// logo marks come from the Simple Icons CDN, tinted to our locked accent.
// LinkedIn isn't in the Simple Icons dataset (removed at some point, likely
// a brand-policy takedown) — it gets a plain "in" text badge instead of a
// reproduced logo mark, styled to match the other icons' size/weight.
const SIMPLE_ICONS_COLOR = "84c0bf";

const SOCIAL_ICONS = [
  { name: "Discord", href: SOCIAL_LINKS.discord, slug: "discord" },
  { name: "LinkedIn", href: SOCIAL_LINKS.linkedin, slug: null },
  { name: "X", href: SOCIAL_LINKS.x, slug: "x" },
  { name: "Instagram", href: SOCIAL_LINKS.instagram, slug: "instagram" },
] as const;

export async function FooterSection() {
  const t = await getTranslations("Footer");
  const columnKeys = ["talent", "companies", "community"] as const;

  return (
    <SectionContainer id="footer" background="dark">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <Image
            src="/logo/logo-negative.svg"
            alt="TechToJob"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
          <div className="mt-6 flex items-center gap-4">
            {SOCIAL_ICONS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                {social.slug ? (
                  <Image
                    src={`https://cdn.simpleicons.org/${social.slug}/${SIMPLE_ICONS_COLOR}`}
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center rounded-sm bg-brand-teal text-xs font-bold text-brand-dark"
                  >
                    in
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
        {columnKeys.map((key) => (
          <FooterColumn
            key={key}
            title={t(`columns.${key}.title`)}
            links={t.raw(`columns.${key}.links`) as string[]}
            hrefs={FOOTER_LINK_HREFS[key]}
          />
        ))}
      </div>
      <p className="mt-12 border-t border-brand-white/10 pt-6 text-sm text-brand-white/50">
        {t("legalNotice")}
      </p>
    </SectionContainer>
  );
}

function FooterColumn({
  title,
  links,
  hrefs,
}: {
  title: string;
  links: string[];
  hrefs: string[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-brand-white/60">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((label, index) => (
          <li key={label}>
            <a href={hrefs[index]} className="text-brand-white/80 hover:text-brand-white hover:underline">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
