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
 * Original Veyra mascot — a small lion cub character (an original design,
 * not based on any existing branded mascot). Confident and energetic
 * without looking aggressive, fitting the fitness/strength theme. Faces are
 * built from simple eye + mouth paths per expression.
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
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={`Veyra mascot lion cub, ${expression}`}
      style={{ transform: `translateY(${bob}px)`, transition: animate ? "none" : "transform 0.2s" }}
    >
      {/* Mane: a soft ring behind the head */}
      <circle cx="60" cy="62" r="40" fill="var(--primary)" opacity="0.55" />

      {/* Head */}
      <circle cx="60" cy="60" r="30" fill="var(--primary)" />

      {/* Ears */}
      <circle cx="34" cy="34" r="11" fill="var(--primary)" />
      <circle cx="86" cy="34" r="11" fill="var(--primary)" />
      <circle cx="34" cy="34" r="5.5" fill="var(--background)" opacity="0.35" />
      <circle cx="86" cy="34" r="5.5" fill="var(--background)" opacity="0.35" />

      {/* Snout */}
      <ellipse cx="60" cy="74" rx="16" ry="12" fill="var(--background)" opacity="0.28" />

      {/* Nose */}
      <path d="M54 70 Q60 66 66 70 Q64 74 60 74 Q56 74 54 70 Z" fill="#0a0a0a" />

      {/* Face */}
      <g>{face}</g>
    </svg>
  );
}

const FACES: Record<MascotExpression, ReactElement> = {
  happy: (
    <>
      <circle cx="48" cy="56" r="4.5" fill="#0a0a0a" />
      <circle cx="72" cy="56" r="4.5" fill="#0a0a0a" />
      <path d="M52 82 Q60 88 68 82" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  excited: (
    <>
      <path d="M43 52 L51 56 L43 60" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M77 52 L69 56 L77 60" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 80 Q60 92 70 80" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  thinking: (
    <>
      <circle cx="48" cy="56" r="4" fill="#0a0a0a" />
      <circle cx="72" cy="54" r="4" fill="#0a0a0a" />
      <path d="M53 84 Q60 80 68 84" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="36" r="3" fill="#0a0a0a" opacity="0.5" />
      <circle cx="98" cy="28" r="2" fill="#0a0a0a" opacity="0.35" />
    </>
  ),
  confused: (
    <>
      <circle cx="48" cy="58" r="4.5" fill="#0a0a0a" />
      <circle cx="72" cy="54" r="4.5" fill="#0a0a0a" />
      <path d="M52 84 Q60 88 68 82" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M40 42 Q46 38 52 42" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  celebrating: (
    <>
      <path d="M43 54 Q48 48 53 54" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M67 54 Q72 48 77 54" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M48 80 Q60 96 72 80" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  encouraging: (
    <>
      <circle cx="48" cy="56" r="4.5" fill="#0a0a0a" />
      <circle cx="72" cy="56" r="4.5" fill="#0a0a0a" />
      <path d="M50 82 Q60 90 70 82" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  explaining: (
    <>
      <ellipse cx="48" cy="56" rx="4" ry="5" fill="#0a0a0a" />
      <ellipse cx="72" cy="56" rx="4" ry="5" fill="#0a0a0a" />
      <ellipse cx="60" cy="84" rx="7" ry="6" fill="#0a0a0a" />
    </>
  ),
  surprised: (
    <>
      <circle cx="48" cy="56" r="5.5" fill="#0a0a0a" />
      <circle cx="72" cy="56" r="5.5" fill="#0a0a0a" />
      <ellipse cx="60" cy="84" rx="6" ry="8" fill="#0a0a0a" />
    </>
  ),
  concerned: (
    <>
      <circle cx="48" cy="58" r="4" fill="#0a0a0a" />
      <circle cx="72" cy="58" r="4" fill="#0a0a0a" />
      <path d="M50 86 Q60 80 70 86" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M40 44 L52 42" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M80 44 L68 42" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
};
