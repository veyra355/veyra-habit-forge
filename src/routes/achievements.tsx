import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  CalendarCheck,
  Dumbbell,
  Flame,
  GraduationCap,
  Lock,
  Sparkles,
  SquareCheckBig,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell, PageHeader } from "@/components/veyra/AppShell";
import { ACHIEVEMENTS, countHabitCompletions, getAcademyVisitedCount } from "@/lib/achievements";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [{ title: "Achievements — Veyra" }],
  }),
  component: AchievementsPage,
});

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Zap,
  Flame,
  CalendarCheck,
  SquareCheckBig,
  Dumbbell,
  GraduationCap,
  Trophy,
  Award,
};

function AchievementsPage() {
  const { state } = useVeyra();
  const [ready, setReady] = useState(false);
  const [academyVisitedCount, setAcademyVisitedCount] = useState(0);

  useEffect(() => {
    setAcademyVisitedCount(getAcademyVisitedCount());
    setReady(true);
  }, []);

  const ctx = useMemo(
    () => ({
      state,
      totalHabitCompletions: countHabitCompletions(state.completions),
      academyVisitedCount,
    }),
    [state, academyVisitedCount],
  );
  const unlockedCount = ready ? ACHIEVEMENTS.filter((a) => a.isUnlocked(ctx)).length : 0;

  return (
    <AppShell>
      <PageHeader
        title="Achievements"
        subtitle={
          ready
            ? `${unlockedCount} / ${ACHIEVEMENTS.length} unlocked — keep going!`
            : "Loading your badges…"
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = a.isUnlocked(ctx);
          const Icon = ICONS[a.icon] ?? Trophy;
          return (
            <div
              key={a.id}
              className={`panel flex items-start gap-3.5 p-4 transition-opacity ${
                unlocked ? "" : "opacity-50"
              }`}
            >
              <div
                className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                  unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {unlocked ? <Icon className="size-5" /> : <Lock className="size-5" />}
              </div>
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
