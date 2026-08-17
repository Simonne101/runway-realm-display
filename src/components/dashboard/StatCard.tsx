import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <p className="mt-4 font-display text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}