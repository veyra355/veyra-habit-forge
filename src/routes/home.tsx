import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Droplets, Dumbbell, Moon, Sparkles, Target, Wind } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { StatCard } from "@/components/veyra/StatCard";
import { groomingRoutines, todaysWorkout } from "@/lib/sample-data";
import { greeting, weekStats } from "@/lib/stats";
import { todayKey, useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Today — Veyra" },
      { name: "description", content: "Your daily focus: today's workout, habits, grooming routine and weekly progress in one place." },
      { property: "og:title", content: "Today — Veyra" },
      { property: "og:description", content: "Your daily focus, habits and progress." },
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

function HomePage() {
  const { state, toggleHabit } = useVeyra();
  const week = weekStats(state);
  const today = state.completions[todayKey()] ?? [];
  const firstName = state.user?.name.split(" ")[0] ?? "there";
  const goals = state.onboarding?.goals ?? [];

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        subtitle={
          goals.length
            ? `Today's focus: ${goals.slice(0, 2).join(" and ").toLowerCase()}.`
            : "Today's focus: one session, plus your daily habits."
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Today&apos;s workout</p>
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
            {todaysWorkout.equipment}. Work at a pace where your form stays clean — that&apos;s the whole goal today.
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
              Based on your last session feedback, keep today&apos;s intensity steady and prioritise sleep tonight.
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
                  className={`flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left text-sm transition-all hover:border-primary/50 ${
                    done ? "border-primary bg-accent text-accent-foreground" : "bg-card"
                  }`}
                >
                  <Icon className={`size-4 ${done ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="flex-1">{habit.name}</span>
                  <span className="text-xs text-muted-foreground">{done ? "Done" : "Tap"}</span>
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
        <StatCard label="Workouts" value={`${week.workouts}/5`} progress={(week.workouts / 5) * 100} hint="Planned sessions this week" />
        <StatCard label="Habits completed" value={`${week.habitPct}%`} progress={week.habitPct} hint="Across all your habits" />
        <StatCard label="Consistency" value={`${week.consistency}%`} progress={week.consistency} hint="Days you showed up" />
        <StatCard label="Milestones" value={`${state.sessions.length}`} hint="Total sessions logged with Veyra" />
      </div>

      <div className="panel mt-4 p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Daily habit completion</p>
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
        Veyra offers general wellness and fitness guidance only. It does not diagnose conditions or treat
        injuries. For symptoms, pain, medication or medical questions, please consult a qualified healthcare
        professional.
      </SafetyNote>
    </>
  );
}
