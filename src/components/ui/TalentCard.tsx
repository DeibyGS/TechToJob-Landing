import { Clock } from "lucide-react";
import { SkillBadge } from "@/components/ui/SkillBadge";

interface TalentCardProps {
  name?: string;
  initials?: string;
  role?: string;
  available?: boolean;
  availableSince?: string;
  skills?: string[];
  cta?: string;
}

export function TalentCard({
  name = "Ana García",
  initials = "AG",
  role = "Frontend Developer",
  available = true,
  availableSince = "Desde hace 2 semanas",
  skills = ["React", "Next.js", "Node.js", "TypeScript"],
  cta = "Ver portfolio",
}: TalentCardProps) {
  return (
    <div className="group relative w-full max-w-md overflow-hidden rounded-xl border border-gray-200/60 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:max-w-none">
      {/* Watermark logo */}
      <svg
        className="absolute -right-6 top-0 h-full w-auto text-brand-teal/10"
        viewBox="0 0 287.52 287.53"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M285.14,7.61c2.4,4.6,2.43,15.58,2.36,22.7,0,7.39.01,15.82,0,22.64-.11,5.76.08,12.37-2.48,17.39-3.88,6.91-14.38,7.55-22.28,8.36-36.51.38-70.18,25.82-77.31,62.18-4.9,25.83-7.04,37.99-35.88,42.8-37.09,4.49-67.03,33.69-70.16,71.28-.67,6.27-.9,13.51-2.33,19.33-2.4,12.28-11.06,13.07-21.58,13.19-9.37.11-20.65,0-30,.03C.45,287.88-.07,280.95,0,257.22c0-7.2,0-15.4,0-22.12.11-5.92-.14-12.93,2.56-18.05,5.83-9.46,23.42-7.43,33.9-9.42,25.56-3.44,48.39-19.89,59.4-42.93,17.63-34.77-14.56-73.02-48-82.33-6.47-1.93-13.32-2.91-20.1-3.42-8.73-.81-22.33-1.19-25.76-9.6C.25,65.29.03,59.19,0,51.9,0,44.71,0,35.97,0,28.67.11,7.13.37-.26,24.71.03c6.49-.02,13.69-.02,20.31-.02,8.97.26,20.36-1.16,26.84,3.51,7.13,6.43,6.22,19.11,7.45,28.39.55,5.43,1.51,10.77,3.04,15.97,7.76,26.33,30.07,49.37,57.7,52.97,17.94,1.53,34.84-8.86,46.94-21.31,16.55-17.43,20.91-36.61,22.33-59.9C211.39-.67,220.58.11,237.48.01c4.84,0,10.29,0,15.48,0,10.59.48,27.65-2.12,32.12,7.46l.06.13Z" />
      </svg>
      {/* Header: avatar + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-sm font-bold text-white">
          {initials}
        </div>
        <span className="font-medium text-brand-dark">{name}</span>
      </div>

      {/* Role */}
      <h3 className="mt-4 text-xl font-semibold text-brand-dark">{role}</h3>

      {/* Availability row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {available && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Disponible
          </span>
        )}
        <span className="flex items-center gap-1.5 text-gray-500">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {availableSince}
        </span>
      </div>

      {/* Skill badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </div>

      {/* CTA button */}
      <button
        type="button"
        className="mt-5 w-full rounded-xl bg-teal-600 py-3 text-center text-sm font-medium text-white transition-colors duration-150 hover:bg-teal-700"
      >
        {cta}
      </button>
    </div>
  );
}
