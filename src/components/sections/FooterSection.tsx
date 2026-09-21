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
  { name: "LinkedIn", href: SOCIAL_LINKS.linkedin, slug: null },
  { name: "X", href: SOCIAL_LINKS.x, slug: "x" },
  { name: "Instagram", href: SOCIAL_LINKS.instagram, slug: "instagram" },
] as const;

export async function FooterSection() {
  const t = await getTranslations("Footer");

  return (
    <SectionContainer
      id="footer"
      background="dark"
      backgroundDecoration={
        <div className="pointer-events-none flex items-center justify-end" aria-hidden="true">
          <Image
            src="/logo/simbolo-negativo.svg"
            alt=""
            width={500}
            height={500}
            className="h-auto w-[400px] opacity-[0.04]"
          />
        </div>
      }
    >
      <footer className="relative">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Logo + social icons */}
          <div>
            <span className="relative block h-8 w-[140px]">
              <Image
                src="/logo/v1Negativo.png"
                alt="TechToJob"
                fill
                sizes="140px"
                className="object-contain"
              />
            </span>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_ICONS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-brand-white/60 transition-colors duration-200 hover:text-brand-teal"
                >
                  {social.slug ? (
                    <Image
                      src={`https://cdn.simpleicons.org/${social.slug}/${SIMPLE_ICONS_COLOR}`}
                      alt=""
                      width={24}
                      height={24}
                      unoptimized
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand-teal text-xs font-bold text-brand-dark"
                    >
                      in
                    </span>
                  )}
                </a>
              ))}
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

        {/* Bottom bar: legal links + copyright + back to top */}
        <div className="mt-12 border-t border-brand-teal/30 pt-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            {/* Legal links */}
            <div className="flex items-center gap-4 text-sm text-brand-white/50">
              <a href="#privacy" className="relative transition-colors duration-200 hover:text-brand-teal hover:drop-shadow-[0_0_6px_rgba(132,192,191,0.5)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand-teal after:transition-all after:duration-300 hover:after:w-full">
                {t("privacy")}
              </a>
              <span aria-hidden="true">|</span>
              <a href="#terms" className="relative transition-colors duration-200 hover:text-brand-teal hover:drop-shadow-[0_0_6px_rgba(132,192,191,0.5)] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-brand-teal after:transition-all after:duration-300 hover:after:w-full">
                {t("terms")}
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-brand-white/50">
              {t("legalNotice")}
            </p>

            {/* Back to top */}
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
            <a
              href={hrefs[index]}
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
