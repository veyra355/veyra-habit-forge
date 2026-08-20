import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Check,
  Dumbbell,
  Flame,
  Gamepad2,
  HeartPulse,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppShell, SafetyNote } from "@/components/veyra/AppShell";
import { StatCard } from "@/components/veyra/StatCard";
import { groomingRoutines, todaysWorkout } from "@/lib/sample-data";
import { weekStats } from "@/lib/stats";
import { todayKey, useVeyra, xpForLevel } from "@/lib/veyra-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Veyra — Your Daily Quest" },
      {
        name: "description",
        content: "A game-like health dashboard for goals, quests, exercise and progress.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <HomePage />
    </AppShell>
  ),
});

type Quest = {
  id: string;
  title: string;
  detail: string;
  reward: number;
  duration: string;
  exerciseIndex?: number;
};

const DEFAULT_QUESTS: Quest[] = [
  {
    id: "warmup",
    title: "Activate your body",
    detail: "Easy warm-up and mobility before the main mission.",
    reward: 60,
    duration: "5 min",
    exerciseIndex: 5,
  },
  {
    id: "squat",
    title: "Power stance",
    detail: "Controlled bodyweight squats with clean form.",
    reward: 120,
    duration: "3 × 12",
    exerciseIndex: 0,
  },
  {
    id: "pushup",
    title: "Push the limit",
    detail: "Push-ups with a beginner knee option when needed.",
    reward: 140,
    duration: "3 × 8–12",
    exerciseIndex: 1,
  },
  {
    id: "recovery",
    title: "Lock in recovery",
    detail: "Finish with gentle mobility and a short walk.",
    reward: 80,
    duration: "15 min",
    exerciseIndex: 5,
  },
];

function HomePage() {
  const { state } = useVeyra();
  const week = weekStats(state);
  const today = state.completions[todayKey()] ?? [];
  const firstName = state.user?.name.split(" ")[0] ?? "Player";
  const goals = state.onboarding?.goals ?? [];
  const [showIntro, setShowIntro] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [goal, setGoal] = useState("");
  const [activeGoal, setActiveGoal] = useState(
    goals.length ? goals.slice(0, 2).join(" + ") : "Build a stronger daily routine",
  );
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [completed, setCompleted] = useState<string[]>([]);
  const [selectedExercise, setSelectedExercise] = useState(0);

  useEffect(() => {
    try {
      const seen = window.sessionStorage.getItem("veyra-intro-seen");
      if (!seen) {
        setShowIntro(true);
        const timer = window.setTimeout(() => {
          setShowIntro(false);
          window.sessionStorage.setItem("veyra-intro-seen", "1");
        }, 1800);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // Storage can be unavailable in privacy-restricted browsers; the app still works.
    }
  }, []);

  const nextLevelXp = xpForLevel(state.currentLevel);
  const previousLevelXp = xpForLevel(Math.max(0, state.currentLevel - 1));
  const levelRange = Math.max(1, nextLevelXp - previousLevelXp);
  const levelProgress = Math.max(
    0,
    Math.min(100, ((state.totalXp - previousLevelXp) / levelRange) * 100),
  );
  const exercise = todaysWorkout.exercises[selectedExercise] ?? todaysWorkout.exercises[0];
  const earnedQuestXp = completed.reduce((sum, id) => {
    const quest = quests.find((item) => item.id === id);
    return sum + (quest?.reward ?? 0);
  }, 0);
  const generatedForGoal = useMemo(() => {
    const text = activeGoal.toLowerCase();
    const focus = text.includes("strength") || text.includes("muscle") ? "strength" : "fitness";
    return focus === "strength"
      ? [
          { ...DEFAULT_QUESTS[0], title: "Prime your strength" },
          { ...DEFAULT_QUESTS[1], title: "Build lower-body power" },
          { ...DEFAULT_QUESTS[2], title: "Build upper-body power" },
          { ...DEFAULT_QUESTS[3], title: "Recover like a pro" },
        ]
      : DEFAULT_QUESTS.map((quest) => ({ ...quest }));
  }, [activeGoal]);

  function createGoal() {
    const cleanGoal = goal.trim();
    if (!cleanGoal) return;
    setActiveGoal(cleanGoal);
    setQuests(generatedForGoal);
    setCompleted([]);
    setGoal("");
    setGoalOpen(false);
  }

  function completeQuest(id: string) {
    setCompleted((current) => (current.includes(id) ? current : [...current, id]));
  }

  return (
    <div className="relative pb-10">
      {showIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-[28px] border border-primary/30 bg-primary/10 shadow-[0_0_80px_hsl(var(--primary)/0.25)] animate-pulse">
              <Gamepad2 className="size-9 text-primary" />
            </div>
            <p className="mt-6 text-4xl font-black tracking-[0.25em]">VEYRA</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Enter your next level
            </p>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden rounded-[30px] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-5 shadow-2xl sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-primary/15 text-primary hover:bg-primary/15">
                <Gamepad2 className="mr-1 size-3.5" /> HEALTH RPG
              </Badge>
              <span className="text-xs text-muted-foreground">Welcome back, {firstName}</span>
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
              Your body. Your goal. <span className="text-primary">Your next level.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Turn one real-world goal into a simple daily quest. Complete missions, learn the
              movement, earn XP and keep your streak alive.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => setGoalOpen(true)}
                className="h-12 rounded-2xl px-6 text-base font-bold shadow-lg shadow-primary/20"
              >
                <Target className="mr-2 size-5" /> SET GOAL
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl">
                <Link to="/workout">
                  Enter workout <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[26px] border border-border/70 bg-background/55 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Player HUD</p>
                <p className="mt-1 text-xl font-black">LVL {state.currentLevel}</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Trophy className="size-6 text-primary" />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="font-semibold">{state.totalXp + earnedQuestXp} XP</span>
              <span className="text-muted-foreground">{nextLevelXp} XP</span>
            </div>
            <Progress value={Math.min(100, levelProgress + earnedQuestXp / Math.max(1, levelRange) * 100)} className="mt-2 h-3" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <HudStat icon={Flame} value={`${state.currentStreak}d`} label="streak" />
              <HudStat icon={Zap} value={`+${earnedQuestXp}`} label="quest XP" />
              <HudStat icon={Trophy} value={`${completed.length}/${quests.length}`} label="cleared" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7 rounded-[26px] border border-primary/15 bg-card/70 p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-4" /> Active mission
            </div>
            <h2 className="mt-2 text-xl font-black">{activeGoal}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Veyra converted your goal into today&apos;s quest path.</p>
          </div>
          <Button variant="ghost" className="rounded-xl" onClick={() => setGoalOpen(true)}>
            Change goal
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quests.map((quest, index) => {
            const done = completed.includes(quest.id);
            return (
              <button
                key={quest.id}
                onClick={() => {
                  setSelectedExercise(quest.exerciseIndex ?? 0);
                  completeQuest(quest.id);
                }}
                className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg ${done ? "border-primary/50 bg-primary/5" : "border-border bg-background/40"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex size-10 items-center justify-center rounded-xl ${done ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                    {done ? <Check className="size-5" /> : <span className="text-sm font-black">0{index + 1}</span>}
                  </span>
                  <Badge variant="outline" className="text-[10px]">+{quest.reward} XP</Badge>
                </div>
                <h3 className="mt-4 font-bold">{quest.title}</h3>
                <p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">{quest.detail}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold">
                  <span>{quest.duration}</span>
                  <span className={done ? "text-primary" : "text-muted-foreground"}>{done ? "CLEARED" : "START QUEST"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Dumbbell className="size-4" /> Movement lab
              </div>
              <h2 className="mt-1 text-xl font-black">{exercise.name}</h2>
            </div>
            <Badge variant="secondary">{exercise.sets} · {exercise.reps}</Badge>
          </div>
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[300px] overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-5">
              <div className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_80px_hsl(var(--primary)/0.12)]" />
              <img
                src={exercise.poseImage}
                alt={`${exercise.name} movement demonstration`}
                className="relative z-10 mx-auto h-[300px] w-full object-contain drop-shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/70 bg-background/80 p-3 text-xs backdrop-blur">
                <span className="font-bold text-primary">FORM FIRST</span> · Move slowly enough to keep control.
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-2">
                <MiniInfo label="Sets" value={exercise.sets} />
                <MiniInfo label="Reps" value={exercise.reps} />
                <MiniInfo label="Rest" value={exercise.rest} />
              </div>
              <div className="mt-5 rounded-2xl bg-secondary/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">How to perform</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{exercise.instructions}</p>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border p-4">
                <HeartPulse className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-xs leading-5 text-muted-foreground">
                  Stop if you feel pain, dizziness or unusual symptoms. Veyra is general wellness guidance, not medical care.
                </p>
              </div>
              <Button asChild className="mt-5 w-full rounded-xl">
                <Link to="/workout">Open full workout</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-border bg-card p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-4" /> AI Coach
            </div>
            <h2 className="mt-2 text-lg font-black">Your next move</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep today simple: finish one quest, learn the movement, then decide whether you want to continue. Consistency beats an overloaded plan.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full rounded-xl">
              <Link to="/coach">Talk to AI Coach</Link>
            </Button>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">This week</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard label="Workouts" value={`${week.workouts}/5`} progress={(week.workouts / 5) * 100} hint="Planned sessions" />
              <StatCard label="Habits" value={`${week.habitPct}%`} progress={week.habitPct} hint="Completed" />
            </div>
          </div>
        </div>
      </section>

      <SafetyNote>
        Veyra offers general wellness and fitness guidance only. It does not diagnose conditions or treat injuries. For symptoms, pain, medication or medical questions, consult a qualified healthcare professional.
      </SafetyNote>

      {goalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="goal-title">
          <div className="w-full max-w-xl rounded-[30px] border border-primary/20 bg-card p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">MISSION BUILDER</Badge>
                <h2 id="goal-title" className="mt-3 text-2xl font-black">What do you want to achieve?</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Type it naturally. Veyra will turn it into a small, actionable quest path.
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setGoalOpen(false)} aria-label="Close goal builder">
                <X className="size-5" />
              </Button>
            </div>
            <textarea
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") createGoal();
              }}
              placeholder="Example: I want to build a consistent fitness routine…"
              className="mt-6 min-h-32 w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm outline-none ring-primary/30 transition focus:border-primary focus:ring-4"
              autoFocus
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {["Build daily fitness", "Improve strength", "Move more every day"].map((suggestion) => (
                <button key={suggestion} onClick={() => setGoal(suggestion)} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
                  {suggestion}
                </button>
              ))}
            </div>
            <Button onClick={createGoal} disabled={!goal.trim()} className="mt-6 h-12 w-full rounded-2xl font-bold">
              Generate my quests <Sparkles className="ml-2 size-4" />
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">Prototype quest generation is local and does not expose any API secret.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function HudStat({ icon: Icon, value, label }: { icon: typeof Flame; value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/50 p-2.5">
      <Icon className="size-3.5 text-primary" />
      <p className="mt-1 text-sm font-black">{value}</p>
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}
