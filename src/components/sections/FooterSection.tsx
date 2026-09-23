import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { BackToTop } from "@/components/ui/BackToTop";
import { SOCIAL_LINKS } from "@/lib/constants";

const FOOTER_LINK_HREFS: Record<string, string[]> = {
  talent: ["#talent", "#tournaments"],
  companies: ["#companies"],
  community: [SOCIAL_LINKS.discord, "#networking"],
};

const SIMPLE_ICONS_COLOR = "84c0bf";

const SOCIAL_ICONS = [
  { name: "Discord", href: SOCIAL_LINKS.discord, slug: "discord" },
  { name: "X", href: SOCIAL_LINKS.x, slug: "x" },
  { name: "Instagram", href: SOCIAL_LINKS.instagram, slug: "instagram" },
] as const;

export async function FooterSection() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <SectionContainer
      id="footer"
      background="dark"
      padding="compact"
      backgroundDecoration={
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden" aria-hidden="true">
          <Image
            src="/logo/simbolo-negativo.svg"
            alt=""
            width={600}
            height={600}
            className="h-full w-auto opacity-[0.04] object-contain"
          />
        </div>
      }
    >
      <footer className="relative">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Logo + tagline + social icons */}
          <div>
            <span className="relative block h-8 w-[140px]">
              <Image
                src="/logo/logo-negative.svg"
                alt="TechToJob"
                fill
                sizes="140px"
                className="object-contain"
              />
            </span>
            <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-brand-white/60">
              {t("tagline")}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_ICONS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-brand-white/60 transition-colors duration-200 hover:text-brand-teal"
                >
                  <Image
                    src={`https://cdn.simpleicons.org/${social.slug}/${SIMPLE_ICONS_COLOR}`}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                  />
                </a>
              ))}
              {/* LinkedIn — hand-coded badge for visual distinction */}
              <a
                href={SOCIAL_LINKS.linkedin}
                aria-label="LinkedIn"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full text-brand-white/60 transition-colors duration-200 hover:text-brand-teal"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand-teal text-xs font-bold text-brand-dark"
                >
                  in
                </span>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINK_HREFS).map(([key, hrefs]) => (
            <FooterColumn
              key={key}
              title={t(`columns.${key}.title`)}
              links={t.raw(`columns.${key}.links`) as string[]}
              hrefs={hrefs}
            />
          ))}
        </div>

        {/* Bottom bar: privacy/terms left · copyright center · back to top right */}
        <div className="mt-8 border-t border-brand-teal/30 pt-5">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            {/* Privacy + Terms — left */}
            <div className="flex items-center gap-4 text-sm text-brand-white/60">
              <a href="#privacy" className="relative transition-colors duration-200 hover:text-brand-teal hover:drop-shadow-[0_0_6px_rgba(132,192,191,0.5)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand-teal after:transition-all after:duration-300 hover:after:w-full">
                {t("privacy")}
              </a>
              <span aria-hidden="true">|</span>
              <a href="#terms" className="relative transition-colors duration-200 hover:text-brand-teal hover:drop-shadow-[0_0_6px_rgba(132,192,191,0.5)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand-teal after:transition-all after:duration-300 hover:after:w-full">
                {t("terms")}
              </a>
            </div>

            {/* Copyright — center */}
            <p className="text-sm text-brand-white/60">
              &copy; {year} TechToJob. {t("rights")}
            </p>

            {/* Back to top — right */}
            <BackToTop label={t("backToTop")} />
          </div>
        </div>
      </footer>
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
      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((label, index) => (
          <li key={label}>
            {/* hrefs[index] pairs positionally with links[index] — falls back
                to "#" so a locale/copy edit that drops a translated link
                never renders an <a> with an undefined href. */}
            <a
              href={hrefs[index] ?? "#"}
              className="relative text-sm text-brand-white/70 transition-colors duration-200 hover:text-brand-teal hover:drop-shadow-[0_0_6px_rgba(132,192,191,0.5)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand-teal after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
