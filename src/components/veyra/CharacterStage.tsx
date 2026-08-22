/**
 * Placeholder character illustration.
 *
 * This renders a simple black & white geometric figure standing in for the
 * real manga-style character art (4 stages, weak -> peak form).
 * Swap the <svg> markup below with the real illustration assets once they're
 * ready — keep the same `stage` prop contract (1-4) so nothing else needs to
 * change.
 */
export type CharacterStageLevel = 1 | 2 | 3 | 4;

const STAGE_CONFIG: Record<
  CharacterStageLevel,
  { headR: number; shoulderY: number; armSpread: number; stroke: number; label: string }
> = {
  1: { headR: 15, shoulderY: 148, armSpread: 20, stroke: 2, label: "Stage 1" },
  2: { headR: 16, shoulderY: 136, armSpread: 30, stroke: 2.5, label: "Stage 2" },
  3: { headR: 17, shoulderY: 124, armSpread: 40, stroke: 3, label: "Stage 3" },
  4: { headR: 18, shoulderY: 112, armSpread: 50, stroke: 3.5, label: "Stage 4" },
};

export function CharacterStage({
  stage,
  className,
  showLabel = false,
}: {
  stage: CharacterStageLevel;
  className?: string;
  showLabel?: boolean;
}) {
  const c = STAGE_CONFIG[stage];
  const headCy = 130 - (4 - stage) * 4;
  const hipY = 220;

  return (
    <svg
      viewBox="0 0 120 240"
      className={className}
      role="img"
      aria-label={`Character progression ${c.label}`}
    >
      <ellipse
        cx="60"
        cy={headCy}
        rx={c.headR}
        ry={c.headR + 1}
        fill="none"
        stroke="#0B0B0B"
        strokeWidth={c.stroke}
      />
      <path
        d={`M ${60 - c.headR - 5} ${c.shoulderY} L ${60 + c.headR + 5} ${c.shoulderY} L ${60 + c.headR - 2} ${hipY} L ${60 - c.headR + 2} ${hipY} Z`}
        fill="#0B0B0B"
        fillOpacity={0.06 + stage * 0.01}
        stroke="#0B0B0B"
        strokeWidth={c.stroke}
      />
      <path
        d={`M ${60 - c.headR - 5} ${c.shoulderY + 8} L ${60 - c.headR - 5 - c.armSpread} ${c.shoulderY - c.armSpread * 0.6}`}
        stroke="#0B0B0B"
        strokeWidth={c.stroke + 3}
        strokeLinecap="round"
      />
      <path
        d={`M ${60 + c.headR + 5} ${c.shoulderY + 8} L ${60 + c.headR + 5 + c.armSpread} ${c.shoulderY - c.armSpread * 0.6}`}
        stroke="#0B0B0B"
        strokeWidth={c.stroke + 3}
        strokeLinecap="round"
      />
      {showLabel && (
        <text x="60" y="238" textAnchor="middle" fontSize="11" fill="#5F5E5A" fontFamily="sans-serif">
          {c.label}
        </text>
      )}
    </svg>
  );
}
