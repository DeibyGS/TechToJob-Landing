import { CheckCircle2 } from "lucide-react";

interface BulletListProps {
  bullets: string[];
}

export function BulletList({ bullets }: BulletListProps) {
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}
