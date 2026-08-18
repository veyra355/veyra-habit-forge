import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Flame, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { StatCard } from "@/components/veyra/StatCard";
import { currentStreak, weekStats } from "@/lib/stats";
import { dayKey, todayKey, useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits — Veyra" },
      { name: "description", content: "Track sleep, hydration, movement, grooming and focus with encouraging streaks and monthly consistency." },
      { property: "og:title", content: "Habits — Veyra" },
      { property: "og:description", content: "Daily habits, weekly streaks, monthly consistency." },
    ],
  }),
  component: () => (
    <AppShell>
      <HabitsPage />
    </AppShell>
  ),
});

function HabitsPage() {
  const { state, toggleHabit, addHabit, removeHabit } = useVeyra();
  const [name, setName] = useState("");
  const week = weekStats(state);
  const today = state.completions[todayKey()] ?? [];

  const monthDays = Array.from({ length: 28 }, (_, i) => dayKey(27 - i));
  const habitCount = Math.max(state.habits.length, 1);
  const monthly = Math.round(
    (monthDays.reduce((a, d) => a + (state.completions[d] ?? []).length / habitCount, 0) / 28) * 100,
  );

  return (
    <>
      <PageHeader title="Habits" subtitle="Small daily wins compound. Missing a day is data, not failure." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Today" value={`${today.length}/${state.habits.length}`} progress={(today.length / habitCount) * 100} hint="Habits completed today" />
        <StatCard label="This week" value={`${week.habitPct}%`} progress={week.habitPct} hint="Average completion" />
        <StatCard label="This month" value={`${monthly}%`} progress={monthly} hint="28-day consistency" />
      </div>

      <div className="panel mt-4 p-4 sm:p-5">
        <p className="text-sm font-medium">Today&apos;s habits</p>
        <div className="mt-4 space-y-2">
          {state.habits.map((habit) => {
            const done = today.includes(habit.id);
            const streak = currentStreak(state, habit.id);
            return (
              <div
                key={habit.id}
                className={`flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors ${
                  done ? "border-primary bg-accent/60" : "bg-card"
                }`}
              >
                <button
                  onClick={() => toggleHabit(habit.id)}
                  aria-label={`Toggle ${habit.name}`}
                  className="-ml-1.5 grid size-11 shrink-0 place-items-center rounded-full transition-colors active:bg-muted"
                >
                  {done ? (
                    <CheckCircle2 className="size-5 text-primary" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground" />
                  )}
                </button>
                <span className="min-w-0 flex-1 text-sm font-medium">{habit.name}</span>
                {streak > 0 && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="size-3.5 text-chart-3" /> {streak}d
                  </span>
                )}
                {habit.custom && (
                  <button
                    onClick={() => removeHabit(habit.id)}
                    aria-label={`Remove ${habit.name}`}
                    className="-mr-1.5 grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-destructive active:bg-muted"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            addHabit(name.trim());
            setName("");
            toast.success("Habit added");
          }}
        >
          <Input
            placeholder="Add a habit — e.g. Read 10 pages"
            className="h-11 min-w-0 flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" variant="outline" className="tap h-11 shrink-0">
            <Plus className="mr-1 size-4" /> Add
          </Button>
        </form>
      </div>

      <div className="panel mt-4 p-4 sm:p-5">
        <p className="text-sm font-medium">Last 7 days</p>
        <div className="mt-4 space-y-2.5">
          {week.daily.map((d) => (
            <div key={d.date}>
              <div className="mb-1 flex justify-between text-xs">
                <span>{d.label}</span>
                <span className="text-muted-foreground">
                  {d.done}/{state.habits.length}
                </span>
              </div>
              <Progress value={d.pct} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      <SafetyNote>
        Streaks are here to encourage, not to pressure. If a week goes off track, restart with one habit — that
        is still progress.
      </SafetyNote>
    </>
  );
}
