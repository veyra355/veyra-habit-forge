import { useEffect, useState } from "react";

/**
 * Full-screen ShadowBreaker opening cinematic played once per browser session.
 * It moves from a black logo reveal into a warrior-at-the-gate scene and closes
 * on the decisive written question that frames the user's journey.
 */
export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "gate" | "question" | "done">("logo");

  useEffect(() => {
    const toGate = setTimeout(() => setPhase("gate"), 1200);
    const toQuestion = setTimeout(() => setPhase("question"), 3000);
    const toDone = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 5200);
    return () => {
      clearTimeout(toGate);
      clearTimeout(toQuestion);
      clearTimeout(toDone);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,.2),transparent_18%),radial-gradient(circle_at_50%_45%,rgba(127,29,29,.4),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgba(127,29,29,.65),transparent),repeating-linear-gradient(90deg,rgba(255,255,255,.08)_0_1px,transparent_1px_86px)]" />

      <div
        className={`absolute rounded-3xl border border-red-700 bg-black/90 px-7 py-5 text-3xl font-black tracking-[0.3em] text-red-500 shadow-[0_0_90px_rgba(220,38,38,.55)] transition-all duration-1000 ${
          phase === "logo" ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        SHADOWBREAKER
      </div>

      <div
        className={`absolute flex flex-col items-center transition-all duration-1000 ${
          phase === "gate" || phase === "question"
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        <div className="relative h-72 w-80">
          <div className="absolute left-1/2 top-3 h-60 w-52 -translate-x-1/2 rounded-t-full border-4 border-red-950 bg-gradient-to-b from-slate-200/25 via-red-950/70 to-black shadow-[0_0_80px_rgba(255,255,255,.18)]" />
          <div className="absolute bottom-5 left-1/2 h-5 w-52 -translate-x-1/2 rounded bg-red-950" />
          <div className="absolute bottom-0 left-1/2 h-5 w-72 -translate-x-1/2 rounded bg-red-950/80" />
          <div className="absolute bottom-10 left-1/2 h-28 w-16 -translate-x-1/2 rounded-t-full bg-zinc-800" />
          <div className="absolute bottom-34 left-1/2 h-20 w-24 -translate-x-1/2 rounded-b-full bg-white/90 blur-[1px]" />
          <div className="absolute bottom-14 left-[58%] h-36 w-2 rotate-45 rounded bg-slate-200" />
        </div>
        <p
          className={`mt-5 max-w-sm text-center text-2xl font-black uppercase tracking-wide transition-opacity duration-700 ${
            phase === "question" ? "opacity-100" : "opacity-0"
          }`}
        >
          Are you ready to change your life?
        </p>
      </div>
    </div>
  );
}
