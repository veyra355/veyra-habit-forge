import { useEffect, useState, type ReactElement } from "react";

export type MascotExpression =
  | "happy"
  | "excited"
  | "thinking"
  | "confused"
  | "celebrating"
  | "encouraging"
  | "explaining"
  | "surprised"
  | "concerned";

/**
 * Original Veyra mascot — a small baby dragon, drawn with organic
 * hand-shaped paths rather than stacked geometric primitives, so it reads
 * as an illustrated character rather than a generated icon. An original
 * design, not based on any existing branded mascot.
 */
export function Mascot({
  expression = "happy",
  size = 96,
  className,
  animate = true,
}: {
  expression?: MascotExpression;
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  const [bob, setBob] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      setBob(Math.sin((t - start) / 700) * 3);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const face = FACES[expression];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 132"
      className={className}
      role="img"
      aria-label={`Veyra mascot baby dragon, ${expression}`}
      style={{ transform: `translateY(${bob}px)`, transition: animate ? "none" : "transform 0.2s" }}
    >
      {/* Tail, curling from behind the body */}
      <path
        d="M78 108 Q100 106 102 122 Q94 118 88 122"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Body, slightly rounded/asymmetric rather than a perfect circle */}
      <path
        d="M38 116 Q28 96 34 78 Q40 62 58 58 Q80 54 92 72 Q100 84 92 100 Q84 116 62 118 Q46 119 38 116 Z"
        fill="var(--primary)"
      />

      {/* Belly plate */}
      <path
        d="M52 100 Q60 94 70 98 Q76 101 74 110 Q64 114 56 109 Q51 105 52 100 Z"
        fill="var(--background)"
        opacity="0.22"
      />

      {/* Wings, asymmetric folded shapes */}
      <path
        d="M30 76 Q14 70 12 52 Q26 54 34 68 Q36 74 30 76 Z"
        fill="var(--primary)"
        opacity="0.6"
      />
      <path
        d="M96 66 Q112 58 112 40 Q98 44 92 58 Q90 64 96 66 Z"
        fill="var(--primary)"
        opacity="0.6"
      />

      {/* Back spikes, irregular sizes for a hand-drawn feel */}
      <path
        d="M52 58 L56 44 L62 57 M64 55 L69 40 L75 54 M76 58 L80 47 L85 59"
        stroke="var(--primary)"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Head, an organic rounded-triangle rather than a perfect oval */}
      <path
        d="M34 46 Q30 28 48 20 Q66 12 80 24 Q92 34 88 50 Q84 66 64 68 Q42 69 34 46 Z"
        fill="var(--primary)"
      />

      {/* Horns, uneven lengths */}
      <path d="M46 22 Q40 10 46 2" stroke="var(--primary)" strokeWidth="6.5" fill="none" strokeLinecap="round" />
      <path d="M68 18 Q76 8 74 3" stroke="var(--primary)" strokeWidth="6.5" fill="none" strokeLinecap="round" />

      {/* Snout, offset rather than perfectly centered */}
      <path
        d="M46 52 Q58 44 72 50 Q76 56 70 62 Q58 68 48 60 Q44 56 46 52 Z"
        fill="var(--background)"
        opacity="0.26"
      />
      <circle cx="54" cy="55" r="1.8" fill="#0a0a0a" opacity="0.7" />
      <circle cx="65" cy="53" r="1.8" fill="#0a0a0a" opacity="0.7" />

      {/* Face */}
      <g>{face}</g>
    </svg>
  );
}

const FACES: Record<MascotExpression, ReactElement> = {
  happy: (
    <>
      <circle cx="46" cy="36" r="4.2" fill="#0a0a0a" />
      <circle cx="68" cy="33" r="4.2" fill="#0a0a0a" />
      <path d="M48 44 Q57 50 66 43" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </>
  ),
  excited: (
    <>
      <path d="M41 32 L49 36 L41 40" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M73 29 L65 33 L73 37" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 43 Q57 54 68 42" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </>
  ),
  thinking: (
    <>
      <circle cx="46" cy="36" r="3.8" fill="#0a0a0a" />
      <circle cx="68" cy="32" r="3.8" fill="#0a0a0a" />
      <path d="M49 45 Q57 42 64 46" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <circle cx="96" cy="16" r="2.8" fill="#0a0a0a" opacity="0.5" />
      <circle cx="102" cy="8" r="2" fill="#0a0a0a" opacity="0.35" />
    </>
  ),
  confused: (
    <>
      <circle cx="46" cy="38" r="4.2" fill="#0a0a0a" />
      <circle cx="68" cy="32" r="4.2" fill="#0a0a0a" />
      <path d="M48 45 Q57 49 66 43" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 24 Q44 20 50 24" stroke="#0a0a0a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </>
  ),
  celebrating: (
    <>
      <path d="M41 34 Q46 28 51 34" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M63 31 Q68 25 73 31" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M44 43 Q57 58 70 42" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </>
  ),
  encouraging: (
    <>
      <circle cx="46" cy="36" r="4.2" fill="#0a0a0a" />
      <circle cx="68" cy="33" r="4.2" fill="#0a0a0a" />
      <path d="M47 44 Q57 51 67 43" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </>
  ),
  explaining: (
    <>
      <ellipse cx="46" cy="36" rx="3.8" ry="4.8" fill="#0a0a0a" />
      <ellipse cx="68" cy="33" rx="3.8" ry="4.8" fill="#0a0a0a" />
      <ellipse cx="58" cy="47" rx="6.5" ry="5.5" fill="#0a0a0a" />
    </>
  ),
  surprised: (
    <>
      <circle cx="46" cy="36" r="5.2" fill="#0a0a0a" />
      <circle cx="68" cy="33" r="5.2" fill="#0a0a0a" />
      <ellipse cx="58" cy="47" rx="5.5" ry="7.5" fill="#0a0a0a" />
    </>
  ),
  concerned: (
    <>
      <circle cx="46" cy="38" r="3.8" fill="#0a0a0a" />
      <circle cx="68" cy="35" r="3.8" fill="#0a0a0a" />
      <path d="M47 47 Q57 42 66 47" stroke="#0a0a0a" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 26 L49 24" stroke="#0a0a0a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M76 22 L66 25" stroke="#0a0a0a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    </>
  ),
};
