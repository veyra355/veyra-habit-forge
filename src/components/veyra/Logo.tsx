export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
        <span className="font-display text-sm font-bold">V</span>
      </span>
      {!compact && <span className="font-display text-lg font-semibold tracking-tight">Veyra</span>}
    </span>
  );
}
