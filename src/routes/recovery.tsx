import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Flame, Shield, Sparkles, Trophy } from "lucide-react";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { RecoveryHub } from "@/components/veyra/RecoveryHub";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/recovery")({
  head: () => ({
    meta: [
      { title: "Recovery — Private Streaks & Check-ins | Veyra" },
      {
        name: "description",
        content:
          "A private Veyra space for recovery streaks, daily check-ins, urge-management methods and milestone rewards. Never shared with friends or leaderboards.",
      },
      { property: "og:title", content: "Recovery — Private Streaks & Check-ins | Veyra" },
      {
        property: "og:description",
        content: "Track healthy routines privately with streaks, milestones and calm urge-management methods.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <RecoveryPage />
    </AppShell>
  ),
});

export type UrgeLevel = "low" | "medium" | "high";
type RecoveryDay = {
  date: string;
  pornFree: boolean;
  masturbationFree: boolean;
  urge: UrgeLevel | null;
  triggers: string[];
};
type RecoveryState = { days: Record<string, RecoveryDay> };

const STORAGE_KEY = "veyra-recovery-v1";
const MILESTONES = [3, 7, 14, 30, 60, 90] as const;
const MILESTONE_XP: Record<number, number> = { 3: 30, 7: 70, 14: 150, 30: 350, 60: 600, 90: 1000 };
const TRIGGERS = ["Late-night phone", "Boredom", "Stress", "Loneliness", "Social feeds", "Low sleep"];

function keyFor(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function loadRecovery(): RecoveryState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw) as RecoveryState;
    return parsed?.days ? parsed : { days: {} };
  } catch {
    return { days: {} };
  }
}
function saveRecovery(state: RecoveryState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private storage unavailable — keep in-memory only */
  }
}
function streak(days: Record<string, RecoveryDay>, field: "pornFree" | "masturbationFree") {
  let total = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days[keyFor(cursor)]?.[field]) {
    total += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return total;
}
function bestStreak(days: Record<string, RecoveryDay>, field: "pornFree" | "masturbationFree") {
  const marked = Object.values(days)
    .filter((d) => d[field])
    .map((d) => d.date)
    .sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const date of marked) {
    if (prev) {
      const gap = (new Date(date).getTime() - new Date(prev).getTime()) / 86400000;
      run = gap === 1 ? run + 1 : 1;
    } else run = 1;
    best = Math.max(best, run);
    prev = date;
  }
  return best;
}

function RecoveryPage() {
  const { awardXp } = useVeyra();
  const [recovery, setRecovery] = useState<RecoveryState>({ days: {} });
  const [celebration, setCelebration] = useState<number | null>(null);
  const today = keyFor(new Date());

  useEffect(() => setRecovery(loadRecovery()), []);

  const day: RecoveryDay = recovery.days[today] ?? {
    date: today,
    pornFree: false,
    masturbationFree: false,
    urge: null,
    triggers: [],
  };

  const patchDay = useCallback(
    (patch: Partial<RecoveryDay>) => {
      setRecovery((prev) => {
        const base = prev.days[today] ?? { date: today, pornFree: false, masturbationFree: false, urge: null, triggers: [] };
        const next: RecoveryState = { days: { ...prev.days, [today]: { ...base, ...patch, date: today } } };
        saveRecovery(next);
        return next;
      });
    },
    [today],
  );

  const streaks = useMemo(
    () => ({
      porn: streak(recovery.days, "pornFree"),
      masturbation: streak(recovery.days, "masturbationFree"),
      bestPorn: bestStreak(recovery.days, "pornFree"),
      bestMasturbation: bestStreak(recovery.days, "masturbationFree"),
    }),
    [recovery.days],
  );
  const current = Math.max(streaks.porn, streaks.masturbation);
  const best = Math.max(streaks.bestPorn, streaks.bestMasturbation, current);

  useEffect(() => {
    if (!current) return;
    const hit = MILESTONES.find((m) => m === current);
    if (!hit) return;
    const seenKey = `veyra-recovery-milestone-${hit}`;
    if (window.localStorage.getItem(seenKey)) return;
    window.localStorage.setItem(seenKey, "1");
    setCelebration(hit);
    void awardXp(MILESTONE_XP[hit] ?? 30, "recovery", `recovery-milestone:${hit}`);
    const timer = setTimeout(() => setCelebration(null), 4200);
    return () => clearTimeout(timer);
  }, [current, awardXp]);

  return (
    <>
      <PageHeader
        title="Recovery"
        subtitle="Your private discipline hub — build healthier routines one day at a time. Nothing here is shared with friends or leaderboards."
      />

      <RecoveryHub
        pornStreak={streaks.porn}
        masturbationStreak={streaks.masturbation}
        bestStreak={best}
        currentStreak={current}
      />

      <section className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl border border-primary/25 bg-card/70 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[.18em] text-primary">
            <Check className="size-4" /> Daily private check-in
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <CheckinToggle
              label="Digital habit kept today"
              active={day.pornFree}
              onClick={() => patchDay({ pornFree: !day.pornFree })}
            />
            <CheckinToggle
              label="Personal goal kept today"
              active={day.masturbationFree}
              onClick={() => patchDay({ masturbationFree: !day.masturbationFree })}
            />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Urge level today</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => patchDay({ urge: day.urge === level ? null : level })}
                className={cn(
                  "tap min-h-11 rounded-2xl border border-border bg-black/30 px-3 text-sm font-bold capitalize transition-colors",
                  day.urge === level && "border-primary/70 bg-primary/15 text-primary",
                )}
              >
                {level}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What made today harder?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TRIGGERS.map((trigger) => {
              const on = day.triggers.includes(trigger);
              return (
                <button
                  key={trigger}
                  type="button"
                  onClick={() =>
                    patchDay({
                      triggers: on ? day.triggers.filter((t) => t !== trigger) : [...day.triggers, trigger],
                    })
                  }
                  className={cn(
                    "tap min-h-10 rounded-full border border-border bg-black/30 px-4 text-xs font-semibold transition-colors",
                    on && "border-primary/70 bg-primary/15 text-primary",
                  )}
                >
                  {trigger}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Missed a day? Nothing is lost — you simply start the next one. Check-ins are notes to yourself, not a score.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="rounded-3xl border border-border bg-card/70 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[.18em] text-primary">
              <Flame className="size-4" /> Streaks
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Stat label="Current streak" value={current} />
              <Stat label="Best streak" value={best} />
            </div>
            <div className="mt-4 space-y-2">
              {MILESTONES.map((m) => (
                <div key={m} className="flex items-center gap-3 text-xs">
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border text-[10px] font-black",
                      current >= m ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground",
                    )}
                  >
                    {m}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${Math.min(100, (current / m) * 100)}%` }}
                    />
                  </div>
                  <span className="shrink-0 font-semibold text-muted-foreground">+{MILESTONE_XP[m]} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/70 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[.18em] text-primary">
              <Sparkles className="size-4" /> Your progress
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              People notice changes differently. Some see shifts in routine, sleep, focus, mood or energy; others notice
              very little for a while, and that is normal too. A streak does not guarantee any physical transformation,
              and there is no ranking of how &quot;well&quot; you are doing. Use these notes to understand your own
              patterns, and speak to a trusted person or a qualified counsellor if a habit feels hard to control.
            </p>
          </div>
        </div>
      </section>

      <SafetyNote>
        Veyra is an educational fitness and habit companion, not a medical or mental-health service. Recovery check-ins
        stay private on this device and are never added to profiles, friend feeds or leaderboards.
      </SafetyNote>

      {celebration !== null && (
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 fade-in rounded-3xl border border-primary/50 bg-gradient-to-br from-zinc-950 to-primary/20 p-8 text-center shadow-[0_0_60px_rgba(220,30,45,.35)] duration-500">
            <Trophy className="mx-auto size-12 text-primary drop-shadow-[0_0_18px_rgba(220,30,45,.8)]" />
            <p className="display-italic mt-3 text-4xl">{celebration}-day milestone</p>
            <p className="mt-1 text-sm text-muted-foreground">
              +{MILESTONE_XP[celebration]} XP added to your Veyra progress.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[.2em] text-primary">
              <Shield className="size-3.5" /> Keep moving forward
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CheckinToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className={cn("tap h-auto min-h-14 justify-start gap-3 rounded-2xl px-4 text-left text-sm font-semibold")}
    >
      <span
        className={cn(
          "grid size-6 shrink-0 place-items-center rounded-full border",
          active ? "border-transparent bg-background/20" : "border-border",
        )}
      >
        {active && <Check className="size-3.5" />}
      </span>
      <span className="min-w-0 whitespace-normal">{label}</span>
    </Button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-black/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-black text-primary">
        {value}
        <span className="ml-1 text-sm font-semibold">days</span>
      </p>
    </div>
  );
}
