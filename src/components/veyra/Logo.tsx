export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden="true">
        <path
          d="M4 6 L16 27 L28 6 L22.5 6 L16 17.5 L9.5 6 Z"
          fill="var(--lime)"
        />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-[0.14em] uppercase">Veyra</span>
      )}
    </span>
  );
}
