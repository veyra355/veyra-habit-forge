import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Flame, Plus, Trash2, ShieldCheck, LockKeyhole, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
      {
        name: "description",
        content:
          "Track daily habits and a private recovery streak with encouraging progress tools.",
      },
      { property: "og:title", content: "Habits — Veyra" },
      { property: "og:description", content: "Daily habits, recovery streaks and consistency." },
    ],
  }),
  component: () => (
    <AppShell>
      <HabitsPage />
    </AppShell>
  ),
});

type RecoveryDay = {
  date: string;
  pornFree: boolean;
  masturbationFree: boolean;
  urge: "low" | "medium" | "high" | null;
};

type RecoveryState = {
  days: Record<string, RecoveryDay>;
};

const RECOVERY_STORAGE_KEY = "veyra-recovery-v1";

function loadRecovery(): RecoveryState {
  try {
    const raw = window.localStorage.getItem(RECOVERY_STORAGE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw) as RecoveryState;
    return parsed?.days ? parsed : { days: {} };
  } catch {
    return { days: {} };
  }
}

function saveRecovery(state: RecoveryState) {
  try {
    window.localStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the UI usable if browser storage is unavailable.
  }
}

function recoveryStreak(days: Record<string, RecoveryDay>, field: "pornFree" | "masturbationFree") {
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (!days[key]?.[field]) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function longestRecoveryStreak(days: Record<string, RecoveryDay>, field: "pornFree" | "masturbationFree") {
  const dates = Object.keys(days)
    .filter((date) => days[date]?.[field])
    .sort();
  let best = 0;
  let run = 0;
  let previous = "";

  for (const date of dates) {
    const current = new Date(`${date}T00:00:00`);
    const prev = previous ? new Date(`${previous}T00:00:00`) : null;
    const consecutive = prev
      ? Math.round((current.getTime() - prev.getTime()) / 86400000) === 1
      : false;
    run = consecutive ? run + 1 : 1;
    best = Math.max(best, run);
    previous = date;
  }

  return best;
}

function HabitsPage() {
  const { state, toggleHabit, addHabit, removeHabit } = useVeyra();
  const [name, setName] = useState("");
  const week = weekStats(state);
  const today = state.completions[todayKey()] ?? [];
  const [recovery, setRecovery] = useState<RecoveryState>({ days: {} });

  useEffect(() => {
    setRecovery(loadRecovery());
  }, []);

  const todayRecovery = useMemo(() => {
    const existing = recovery.days[todayKey()];
    return existing ?? {
      date: todayKey(),
      pornFree: false,
      masturbationFree: false,
      urge: null,
    };
  }, [recovery.days]);

  const monthDays = Array.from({ length: 28 }, (_, i) => dayKey(27 - i));
  const habitCount = Math.max(state.habits.length, 1);
  const monthly = Math.round(
    (monthDays.reduce((a, d) => a + (state.completions[d] ?? []).length / habitCount, 0) / 28) *
      100,
  );

  function updateRecovery(patch: Partial<RecoveryDay>) {
    const next: RecoveryState = {
      days: {
        ...recovery.days,
        [todayKey()]: { ...todayRecovery, ...patch },
      },
    };
    setRecovery(next);
    saveRecovery(next);
  }

  const pornStreak = recoveryStreak(recovery.days, "pornFree");
  const masturbationStreak = recoveryStreak(recovery.days, "masturbationFree");
  const bestPornStreak = longestRecoveryStreak(recovery.days, "pornFree");
  const bestMasturbationStreak = longestRecoveryStreak(recovery.days, "masturbationFree");

  return (
    <>
      <PageHeader
        title="Habits"
        subtitle="Small daily wins compound. Missing a day is data, not failure."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Today"
          value={`${today.length}/${state.habits.length}`}
          progress={(today.length / habitCount) * 100}
          hint="Habits completed today"
        />
        <StatCard
          label="This week"
          value={`${week.habitPct}%`}
          progress={week.habitPct}
          hint="Average completion"
        />
        <StatCard
          label="This month"
          value={`${monthly}%`}
          progress={monthly}
          hint="28-day consistency"
        />
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

      <section id="recovery" className="panel mt-4 overflow-hidden border-primary/20 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">Recovery</p>
                <p className="text-xs text-muted-foreground">Private digital-habit progress</p>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Track your progress privately and build healthier routines. A setback does not erase the work you have already done.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
            <LockKeyhole className="size-3.5" /> Private on this device
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={`rounded-2xl border p-4 ${todayRecovery.pornFree ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-pressed={todayRecovery.pornFree}
                onClick={() => updateRecovery({ pornFree: !todayRecovery.pornFree })}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-background transition-all active:scale-95"
              >
                {todayRecovery.pornFree ? <CheckCircle2 className="size-6 text-primary" /> : <Circle className="size-6 text-muted-foreground" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-medium">Porn-free day</p>
                <p className="text-xs text-muted-foreground">Current streak: {pornStreak}d · Best: {bestPornStreak}d</p>
              </div>
              <Flame className="size-5 text-chart-3" />
            </div>
          </div>

          <div className={`rounded-2xl border p-4 ${todayRecovery.masturbationFree ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-pressed={todayRecovery.masturbationFree}
                onClick={() => updateRecovery({ masturbationFree: !todayRecovery.masturbationFree })}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-background transition-all active:scale-95"
              >
                {todayRecovery.masturbationFree ? <CheckCircle2 className="size-6 text-primary" /> : <Circle className="size-6 text-muted-foreground" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-medium">Masturbation-free day</p>
                <p className="text-xs text-muted-foreground">Current streak: {masturbationStreak}d · Best: {bestMasturbationStreak}d</p>
              </div>
              <Flame className="size-5 text-chart-3" />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <p className="text-sm font-semibold">Urge check-in</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Optional: how strong were your urges today?</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as const).map((level) => (
              <Button
                key={level}
                type="button"
                variant={todayRecovery.urge === level ? "default" : "outline"}
                className="h-10 capitalize"
                onClick={() => updateRecovery({ urge: todayRecovery.urge === level ? null : level })}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Consistency &gt; perfection.</strong> If a streak ends, your previous progress still counts. Focus on the next healthy choice.
        </div>
      </section>

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
        Streaks are here to encourage, not to pressure. Recovery data stays local to this browser for now and is not shared with friends, leaderboards or public profiles.
      </SafetyNote>
    </>
  );
}
