import type { ReactNode } from "react";

import { Progress } from "@/components/ui/progress";

export function StatCard({
  label,
  value,
  hint,
  progress,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  progress?: number;
  icon?: ReactNode;
}) {
  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      {progress !== undefined && <Progress value={progress} className="mt-3 h-1.5" />}
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
