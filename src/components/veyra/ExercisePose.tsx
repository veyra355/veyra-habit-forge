/**
 * A minimal, original stick-figure-style illustration used across Exercise
 * Academy step cards. `pose` roughly shapes the figure so each step looks
 * distinct without needing per-exercise artwork yet.
 */
export type Pose = "stand" | "squat-low" | "push-up-top" | "push-up-bottom" | "curl" | "plank" | "lunge" | "press-up";

export function ExercisePose({
  pose,
  className,
}: {
  pose: Pose;
  className?: string;
}) {
  const paths: Record<Pose, { body: string; limbs: string }> = {
    stand: {
      body: "M60 30c0 8-6 14-14 14s-14-6-14-14 6-14 14-14 14 6 14 14Zm-14 18v50",
      limbs: "M46 60 L30 90 M46 60 L62 90 M46 74 L30 66 M46 74 L62 66",
    },
    "squat-low": {
      body: "M60 30c0 8-6 14-14 14s-14-6-14-14 6-14 14-14 14 6 14 14Zm-14 18v26",
      limbs: "M46 74 L26 100 M46 74 L66 100 M46 62 L26 76 M46 62 L66 76",
    },
    "push-up-top": {
      body: "M28 40c0 8 6 14 14 14s14-6 14-14-6-14-14-14-14 6-14 14Zm14 14h56",
      limbs: "M98 54 L110 78 M42 54 L30 78 M60 54 L60 74 M78 54 L78 74",
    },
    "push-up-bottom": {
      body: "M28 62c0 8 6 14 14 14s14-6 14-14-6-14-14-14-14 6-14 14Zm14 14h56",
      limbs: "M98 76 L108 92 M42 76 L32 92 M60 76 L58 90 M78 76 L80 90",
    },
    curl: {
      body: "M60 30c0 8-6 14-14 14s-14-6-14-14 6-14 14-14 14 6 14 14Zm-14 18v50",
      limbs: "M46 60 L30 90 M46 60 L62 90 M46 62 L30 60 L36 44 M46 62 L62 60 L56 44",
    },
    plank: {
      body: "M28 62c0 8 6 14 14 14s14-6 14-14-6-14-14-14-14 6-14 14Zm14 14h64",
      limbs: "M106 76 L118 92 M42 76 L32 92 M60 76 L60 90 M84 76 L84 90",
    },
    lunge: {
      body: "M60 30c0 8-6 14-14 14s-14-6-14-14 6-14 14-14 14 6 14 14Zm-14 18v40",
      limbs: "M46 70 L22 78 M46 70 L64 100 M46 60 L28 68 M46 60 L60 74",
    },
    "press-up": {
      body: "M60 30c0 8-6 14-14 14s-14-6-14-14 6-14 14-14 14 6 14 14Zm-14 18v50",
      limbs: "M46 60 L30 90 M46 60 L62 90 M46 60 L28 30 M46 60 L64 30",
    },
  };

  const p = paths[pose];

  return (
    <svg viewBox="0 0 130 110" className={className} role="img" aria-label={`Figure demonstrating ${pose.replace("-", " ")} position`}>
      <path d={p.body} fill="none" stroke="var(--foreground)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={p.limbs} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
