const SKILL_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  React: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  "Next.js": { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-800" },
  TypeScript: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "Node.js": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  JavaScript: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  Python: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  Tailwind: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  GraphQL: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500" },
  Docker: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-600" },
  AWS: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  Figma: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

const DEFAULT_COLOR = { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

interface SkillBadgeProps {
  skill: string;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  const colors = SKILL_COLORS[skill] ?? DEFAULT_COLOR;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`}
        aria-hidden="true"
      />
      {skill}
    </span>
  );
}
