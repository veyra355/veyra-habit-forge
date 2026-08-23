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
 * Original Veyra mascot — a small spark/blob creature (not a copy of any
 * existing character). The notch on top echoes the V brand mark. Faces are
 * built from simple eye + mouth paths per expression, kept minimal so it
 * reads as "friendly companion" rather than a cutesy chibi character.
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
      aria-label={`Veyra mascot, ${expression}`}
      style={{ transform: `translateY(${bob}px)`, transition: animate ? "none" : "transform 0.2s" }}
    >
      {/* Body: rounded blob with a small V-notch on top */}
      <path
        d="M60 14c-24 0-40 18-40 42 0 22 16 40 40 40s40-18 40-40c0-24-16-42-40-42Z"
        fill="var(--primary)"
      />
      <path d="M46 16 L60 32 L74 16 L66 16 L60 24 L54 16 Z" fill="var(--background)" />

      {/* Face */}
      <g>{face}</g>
    </svg>
  );
}

const FACES: Record<MascotExpression, ReactElement> = {
  happy: (
    <>
      <circle cx="46" cy="60" r="4.5" fill="#0a0a0a" />
      <circle cx="74" cy="60" r="4.5" fill="#0a0a0a" />
      <path d="M46 74 Q60 84 74 74" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  excited: (
    <>
      <path d="M42 56 L50 60 L42 64" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M78 56 L70 60 L78 64" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44 72 Q60 90 76 72" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  thinking: (
    <>
      <circle cx="46" cy="60" r="4" fill="#0a0a0a" />
      <circle cx="74" cy="58" r="4" fill="#0a0a0a" />
      <path d="M50 78 Q60 74 72 78" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="88" cy="40" r="3" fill="#0a0a0a" opacity="0.5" />
      <circle cx="94" cy="32" r="2" fill="#0a0a0a" opacity="0.35" />
    </>
  ),
  confused: (
    <>
      <circle cx="46" cy="62" r="4.5" fill="#0a0a0a" />
      <circle cx="74" cy="58" r="4.5" fill="#0a0a0a" />
      <path d="M50 78 Q60 82 70 76" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M40 46 Q46 42 52 46" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  celebrating: (
    <>
      <path d="M42 58 Q46 52 50 58" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M70 58 Q74 52 78 58" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M44 72 Q60 92 76 72" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  encouraging: (
    <>
      <circle cx="46" cy="60" r="4.5" fill="#0a0a0a" />
      <circle cx="74" cy="60" r="4.5" fill="#0a0a0a" />
      <path d="M48 76 Q60 82 72 76" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  explaining: (
    <>
      <ellipse cx="46" cy="60" rx="4" ry="5" fill="#0a0a0a" />
      <ellipse cx="74" cy="60" rx="4" ry="5" fill="#0a0a0a" />
      <ellipse cx="60" cy="78" rx="7" ry="6" fill="#0a0a0a" />
    </>
  ),
  surprised: (
    <>
      <circle cx="46" cy="60" r="5.5" fill="#0a0a0a" />
      <circle cx="74" cy="60" r="5.5" fill="#0a0a0a" />
      <ellipse cx="60" cy="78" rx="6" ry="8" fill="#0a0a0a" />
    </>
  ),
  concerned: (
    <>
      <circle cx="46" cy="62" r="4" fill="#0a0a0a" />
      <circle cx="74" cy="62" r="4" fill="#0a0a0a" />
      <path d="M48 80 Q60 74 72 80" stroke="#0a0a0a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M40 48 L52 46" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M80 48 L68 46" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
};
