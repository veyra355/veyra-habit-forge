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
 * Original Veyra mascot — a small baby dragon character (an original
 * design, not based on any existing branded mascot). Ties into the app's
 * "Health RPG" framing — the idea being this companion grows alongside the
 * user's level. Faces are built from simple eye + mouth paths per
 * expression.
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
      aria-label={`Veyra mascot baby dragon, ${expression}`}
      style={{ transform: `translateY(${bob}px)`, transition: animate ? "none" : "transform 0.2s" }}
    >
      {/* Wings (small, folded, behind the head) */}
      <path d="M22 58 Q10 48 14 32 Q26 40 30 54 Z" fill="var(--primary)" opacity="0.55" />
      <path d="M98 58 Q110 48 106 32 Q94 40 90 54 Z" fill="var(--primary)" opacity="0.55" />

      {/* Spiky back ridge */}
      <path d="M50 30 L54 20 L58 30 M60 28 L64 17 L68 28 M70 30 L74 20 L78 30" stroke="var(--primary)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Head */}
      <ellipse cx="60" cy="62" rx="29" ry="27" fill="var(--primary)" />

      {/* Horns */}
      <path d="M42 40 Q38 28 44 22" stroke="var(--primary)" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M78 40 Q82 28 76 22" stroke="var(--primary)" strokeWidth="7" fill="none" strokeLinecap="round" />

      {/* Snout */}
      <ellipse cx="60" cy="78" rx="15" ry="11" fill="var(--background)" opacity="0.28" />

      {/* Nostrils */}
      <circle cx="54" cy="78" r="2" fill="#0a0a0a" opacity="0.7" />
      <circle cx="66" cy="78" r="2" fill="#0a0a0a" opacity="0.7" />

      {/* Face */}
      <g>{face}</g>
    </svg>
  );
}

const FACES: Record<MascotExpression, ReactElement> = {
  happy: (
    <>
      <circle cx="48" cy="58" r="4.5" fill="#0a0a0a" />
      <circle cx="72" cy="58" r="4.5" fill="#0a0a0a" />
      <path d="M52 82 Q60 88 68 82" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  excited: (
    <>
      <path d="M43 54 L51 58 L43 62" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M77 54 L69 58 L77 62" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 80 Q60 92 70 80" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  thinking: (
    <>
      <circle cx="48" cy="58" r="4" fill="#0a0a0a" />
      <circle cx="72" cy="56" r="4" fill="#0a0a0a" />
      <path d="M53 84 Q60 80 68 84" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="38" r="3" fill="#0a0a0a" opacity="0.5" />
      <circle cx="98" cy="30" r="2" fill="#0a0a0a" opacity="0.35" />
    </>
  ),
  confused: (
    <>
      <circle cx="48" cy="60" r="4.5" fill="#0a0a0a" />
      <circle cx="72" cy="56" r="4.5" fill="#0a0a0a" />
      <path d="M52 84 Q60 88 68 82" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M40 46 Q46 42 52 46" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  celebrating: (
    <>
      <path d="M43 56 Q48 50 53 56" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M67 56 Q72 50 77 56" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M48 80 Q60 96 72 80" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  encouraging: (
    <>
      <circle cx="48" cy="58" r="4.5" fill="#0a0a0a" />
      <circle cx="72" cy="58" r="4.5" fill="#0a0a0a" />
      <path d="M50 82 Q60 90 70 82" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </>
  ),
  explaining: (
    <>
      <ellipse cx="48" cy="58" rx="4" ry="5" fill="#0a0a0a" />
      <ellipse cx="72" cy="58" rx="4" ry="5" fill="#0a0a0a" />
      <ellipse cx="60" cy="86" rx="7" ry="6" fill="#0a0a0a" />
    </>
  ),
  surprised: (
    <>
      <circle cx="48" cy="58" r="5.5" fill="#0a0a0a" />
      <circle cx="72" cy="58" r="5.5" fill="#0a0a0a" />
      <ellipse cx="60" cy="86" rx="6" ry="8" fill="#0a0a0a" />
    </>
  ),
  concerned: (
    <>
      <circle cx="48" cy="60" r="4" fill="#0a0a0a" />
      <circle cx="72" cy="60" r="4" fill="#0a0a0a" />
      <path d="M50 88 Q60 82 70 88" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M40 46 L52 44" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M80 46 L68 44" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
};
