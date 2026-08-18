import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function OptionGroup({
  label,
  options,
  value,
  onChange,
  multi = false,
  columns = 2,
}: {
  label: string;
  options: string[];
  value: string | string[];
  onChange: (next: string | string[]) => void;
  multi?: boolean;
  columns?: 1 | 2 | 3;
}) {
  const selected = (opt: string) => (multi ? (value as string[]).includes(opt) : value === opt);

  const toggle = (opt: string) => {
    if (!multi) return onChange(opt);
    const list = value as string[];
    onChange(list.includes(opt) ? list.filter((v) => v !== opt) : [...list, opt]);
  };

  return (
    <div>
      <p className="mb-2.5 text-sm font-medium">{label}</p>
      <div
        className={cn(
          "grid gap-2",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-2 sm:grid-cols-3",
        )}
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              "flex min-h-12 items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition-all hover:border-primary/50 active:bg-muted",
              selected(opt) && "border-primary bg-accent text-accent-foreground",
            )}
          >
            <span className="min-w-0">{opt}</span>
            {selected(opt) && <Check className="size-4 shrink-0 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}
