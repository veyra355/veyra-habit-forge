export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden="true">
        <path d="M16 2 L27 8 V16 C27 23 22 28 16 30 C10 28 5 23 5 16 V8 Z" fill="#7f1d1d" />
        <path d="M16 6 L22 10 V16 C22 20 19.5 23.5 16 25 C12.5 23.5 10 20 10 16 V10 Z" fill="#ef4444" opacity="0.82" />
        <path d="M11 21 L22 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-[0.14em] uppercase">
          ShadowBreaker
        </span>
      )}
    </span>
  );
}
