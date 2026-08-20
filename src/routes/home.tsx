import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Droplets,
  Dumbbell,
  Flame,
  Moon,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Wind,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { StatCard } from "@/components/veyra/StatCard";
import { groomingRoutines, todaysWorkout } from "@/lib/sample-data";
import { greeting, weekStats } from "@/lib/stats";
import { dayKey, todayKey, useVeyra, xpForLevel } from "@/lib/veyra-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Today — Veyra" },
      { name: "description", content: "Your daily focus, quests, XP and progress in one place." },
      { property: "og:title", content: "Today — Veyra" },
      { property: "og:description", content: "Your daily focus, quests and progression." },
    ],
  }),
  component: () => (
    <AppShell>
      <HomePage />
    </AppShell>
  ),
});

const HABIT_ICONS: Record<string, typeof Moon> = {
  sleep: Moon,
  hydration: Droplets,
  movement: Wind,
  grooming: Sparkles,
  workout: Dumbbell,
  focus: Target,
};

const QUESTS = [
  { id: "workout", title: "Enter the Arena", reward: "+200 XP", icon: Dumbbell },
  { id: "habits", title: "Complete 3 daily habits", reward: "+90 XP", icon: Target },
  { id: "streak", title: "Protect your streak", reward: "+50 XP", icon: Flame },
];

function HomePage() {
  const { state, toggleHabit } = useVeyra();
  const week = weekStats(state);
  const today = state.completions[todayKey()] ?? [];
  const firstName = state.user?.name.split(" ")[0] ?? "there";
  const goals = state.onboarding?.goals ?? [];
  const nextLevelXp = xpForLevel(state.currentLevel);
  const previousLevelXp = xpForLevel(Math.max(0, state.currentLevel - 1));
  const levelRange = Math.max(1, nextLevelXp - previousLevelXp);
  const levelProgress = Math.max(
    0,
    Math.min(100, ((state.totalXp - previousLevelXp) / levelRange) * 100),
  );
  const completedToday = today.length;

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        subtitle={
          goals.length
            ? `Today's mission: ${goals.slice(0, 2).join(" and ").toLowerCase()}.`
            : "Today's mission: show up, earn XP and build momentum."
        }
        action={
          <Badge className="rounded-full px-3 py-1.5 text-xs" variant="secondary">
            <Zap className="mr-1 size-3.5" /> {state.currentRank} · LVL {state.currentLevel}
          </Badge>
        }
      />

      <section className="panel relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Trophy className="size-4" /> Player progression
            </div>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-black tracking-tight">Level {state.currentLevel}</span>
              <span className="pb-1 text-sm font-semibold text-muted-foreground">
                {state.currentRank}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {Math.max(0, nextLevelXp - state.totalXp)} XP until your next level.
            </p>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-medium">
                <span>{state.totalXp} total XP</span>
                <span>{nextLevelXp} XP</span>
              </div>
              <Progress value={levelProgress} className="h-2.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GameStat icon={Flame} label="Current streak" value={`${state.currentStreak}d`} />
            <GameStat icon={Shield} label="Best streak" value={`${state.longestStreak}d`} />
            <GameStat icon={Zap} label="Today" value={`${completedToday} done`} />
            <GameStat icon={Trophy} label="Sessions" value={`${state.sessions.length}`} />
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Daily quests
            </p>
            <h2 className="mt-1 text-lg font-semibold">
              Build your character, one mission at a time.
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">{completedToday} actions logged</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {QUESTS.map((quest) => {
            const Icon = quest.icon;
            const done =
              quest.id === "workout"
                ? today.includes("workout")
                : quest.id === "habits"
                  ? completedToday >= 3
                  : state.currentStreak > 0;
            return (
              <div
                key={quest.id}
                className={`panel p-4 transition-all ${done ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="size-5" />
                  </div>
                  <Badge variant={done ? "default" : "outline"}>
                    {done ? "Cleared" : quest.reward}
                  </Badge>
                </div>
                <h3 className="mt-4 font-semibold">{quest.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {done ? "Quest complete. Keep your momentum." : `Reward ${quest.reward}`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Today&apos;s workout
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold">{todaysWorkout.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{todaysWorkout.duration}</Badge>
                <Badge variant="secondary">{todaysWorkout.difficulty}</Badge>
                <Badge variant="secondary">{todaysWorkout.exercises.length} exercises</Badge>
              </div>
            </div>
            <Button asChild className="rounded-full">
              <Link to="/workout">Start Workout</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {todaysWorkout.equipment}. Work at a pace where your form stays clean — that&apos;s the
            whole goal today.
          </p>
        </div>

        <div className="panel flex flex-col justify-between p-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">AI Coach</p>
            </div>
            <p className="mt-3 text-sm font-medium">Your coach has a suggestion for today.</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Based on your last session feedback, keep today&apos;s intensity steady and prioritise
              sleep tonight.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 rounded-full">
            <Link to="/coach">Open AI Coach</Link>
          </Button>
        </div>

        <div className="panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Habits today</p>
            <Link to="/habits" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {state.habits.slice(0, 6).map((habit) => {
              const Icon = HABIT_ICONS[habit.id] ?? Activity;
              const done = today.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left text-sm transition-all hover:border-primary/50 ${done ? "border-primary bg-accent text-accent-foreground" : "bg-card"}`}
                >
                  <Icon className={`size-4 ${done ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="flex-1">{habit.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {done ? "Done · XP earned" : "Tap · earn XP"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Grooming</p>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-medium">Morning routine</p>
              <ul className="mt-1.5 space-y-1 text-muted-foreground">
                {groomingRoutines.morning.slice(0, 3).map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium">Evening routine</p>
              <ul className="mt-1.5 space-y-1 text-muted-foreground">
                {groomingRoutines.evening.slice(0, 3).map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
            <Link to="/grooming">Open grooming</Link>
          </Button>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">This week</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Workouts"
          value={`${week.workouts}/5`}
          progress={(week.workouts / 5) * 100}
          hint="Planned sessions this week"
        />
        <StatCard
          label="Habits completed"
          value={`${week.habitPct}%`}
          progress={week.habitPct}
          hint="Across all your habits"
        />
        <StatCard
          label="Consistency"
          value={`${week.consistency}%`}
          progress={week.consistency}
          hint="Days you showed up"
        />
        <StatCard
          label="Milestones"
          value={`${state.sessions.length}`}
          hint="Total sessions logged with Veyra"
        />
      </div>

      <div className="panel mt-4 p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Daily habit completion
        </p>
        <div className="mt-4 space-y-2.5">
          {week.daily.map((d) => (
            <div key={d.date}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{d.label}</span>
                <span className="text-muted-foreground">{d.pct}%</span>
              </div>
              <Progress value={d.pct} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      <SafetyNote>
        Veyra offers general wellness and fitness guidance only. It does not diagnose conditions or
        treat injuries. For symptoms, pain, medication or medical questions, please consult a
        qualified healthcare professional.
      </SafetyNote>
    </>
  );
}

function GameStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-3">
      <Icon className="size-4 text-primary" />
      <p className="mt-2 text-lg font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
