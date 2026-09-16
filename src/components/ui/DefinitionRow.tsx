type DefinitionRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

export function DefinitionRow({ label, value, isLast = false }: DefinitionRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${isLast ? "" : "border-b border-brand-dark/10"}`}
    >
      <span className="text-sm text-brand-dark/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
