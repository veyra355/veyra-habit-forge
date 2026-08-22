import { useEffect, useState } from "react";
import { CharacterStage } from "./CharacterStage";

/**
 * Full-screen intro played once per browser session before the landing page:
 * 1. The V mark scales/fades in.
 * 2. It fades out as the character (Stage 1 — the "before" state) fades in.
 * 3. After a beat, calls onComplete so the caller can reveal the real page
 *    (hero / login) underneath.
 *
 * Swap CharacterStage's internal SVG for the real manga-style illustration
 * later — this component doesn't need to change.
 */
export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "character" | "done">("logo");

  useEffect(() => {
    const toCharacter = setTimeout(() => setPhase("character"), 1100);
    const toDone = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3000);
    return () => {
      clearTimeout(toCharacter);
      clearTimeout(toDone);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <svg
        viewBox="0 0 32 32"
        className={`size-24 shrink-0 transition-all duration-700 ease-out ${
          phase === "logo" ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
        aria-hidden="true"
      >
        <path d="M4 6 L16 27 L28 6 L22.5 6 L16 17.5 L9.5 6 Z" fill="var(--lime)" />
      </svg>

      <div
        className={`absolute flex flex-col items-center transition-all duration-700 ease-out ${
          phase === "character" ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <CharacterStage stage={1} className="h-56 w-auto" />
        <p className="mt-4 text-sm font-medium tracking-[0.14em] uppercase text-muted-foreground">
          Your journey starts here
        </p>
      </div>
    </div>
  );
}
