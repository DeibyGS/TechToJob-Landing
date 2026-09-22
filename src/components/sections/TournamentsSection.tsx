import { getTranslations } from "next-intl/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Reveal } from "@/components/ui/Reveal";
import { TournamentsStage } from "./TournamentsStage";

function TournamentsBackground() {
  return (
    <>
      {/* Subtle radial gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(132,192,191,0.08), transparent 70%)",
        }}
      />
      {/* Watermark logo symbol */}
      <img
        aria-hidden
        src="/logo/simbolo-negativo.svg"
        alt=""
        className="absolute -right-20 top-1/2 h-[400px] w-auto -translate-y-1/2 opacity-[0.03] select-none"
      />
    </>
  );
}

export async function TournamentsSection() {
  const t = await getTranslations("Tournaments");
  const steps = t.raw("steps") as { title: string; description: string; gain?: string }[];

  return (
    <SectionContainer
      id="tournaments"
      background="dark"
      backgroundDecoration={<TournamentsBackground />}
    >
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl text-brand-white/70">{t("description")}</p>
      </Reveal>
      <TournamentsStage steps={steps} />
    </SectionContainer>
  );
}
