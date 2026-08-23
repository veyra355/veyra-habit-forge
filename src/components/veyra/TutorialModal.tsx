import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Mascot, type MascotExpression } from "./Mascot";

export const TUTORIAL_SEEN_KEY = "veyra-tutorial-seen";

type TutorialStep = {
  title: string;
  body: string;
  mascotExpression: MascotExpression;
};

const STEPS: TutorialStep[] = [
  {
    title: "Meet Veyra",
    body: "Hey! I'm Veyra — I'll help you get the hang of things around here.",
    mascotExpression: "happy",
  },
  {
    title: "Choose your goal",
    body: "You'll set a training focus — strength, athletic, general fitness, or mobility. Change it anytime.",
    mascotExpression: "explaining",
  },
  {
    title: "Your dashboard",
    body: "This is home base — your level, streak, and today's quest all live here.",
    mascotExpression: "explaining",
  },
  {
    title: "Quests",
    body: "Quests are small, doable tasks — a workout, a habit, a grooming step. Complete them to earn XP.",
    mascotExpression: "encouraging",
  },
  {
    title: "XP & Levels",
    body: "XP adds up as you complete quests. Enough XP and you level up, unlocking new content.",
    mascotExpression: "excited",
  },
  {
    title: "Exercise lessons",
    body: "Every exercise has its own page — how to do it, what it trains, and common mistakes to avoid.",
    mascotExpression: "explaining",
  },
  {
    title: "Streaks",
    body: "Streaks track your consistency. Miss a day? No shame — just pick back up whenever you're ready.",
    mascotExpression: "encouraging",
  },
  {
    title: "Nutrition",
    body: "Quick, practical lessons on food and habits — no extreme diets, just useful basics.",
    mascotExpression: "happy",
  },
  {
    title: "Track your progress",
    body: "See your workouts, habits, and streaks over time on your Progress page.",
    mascotExpression: "thinking",
  },
  {
    title: "You're all set!",
    body: "That's the tour. You can replay this anytime from your profile. Let's get your first quest going!",
    mascotExpression: "celebrating",
  },
];

export function TutorialModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step] ?? STEPS[0]!;

  const finish = () => {
    try {
      window.localStorage.setItem(TUTORIAL_SEEN_KEY, "true");
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
    onClose();
  };

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md rounded-t-[28px] border border-border bg-card p-6 shadow-2xl sm:rounded-[28px]">
        <button
          onClick={finish}
          aria-label="Skip tutorial"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <Mascot expression={current.mascotExpression} size={88} />
          <h2 className="mt-4 font-display text-xl font-bold">{current.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
        </div>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          {step + 1} / {STEPS.length}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground">
            Skip tutorial
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            <Button size="sm" onClick={isLast ? finish : () => setStep((s) => s + 1)}>
              {isLast ? "Let's go!" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
