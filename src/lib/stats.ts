import { dayKey, type VeyraState } from "./veyra-store";

export function weekStats(state: VeyraState) {
  const days = Array.from({ length: 7 }, (_, i) => dayKey(6 - i));
  const habitCount = Math.max(state.habits.length, 1);
  const daily = days.map((d) => {
    const done = (state.completions[d] ?? []).length;
    return {
      date: d,
      label: new Date(d).toLocaleDateString("en-IN", { weekday: "short" }),
      done,
      pct: Math.round((done / habitCount) * 100),
    };
  });
  const workouts = state.sessions.filter((s) => days.includes(s.date)).length;
  const habitPct = Math.round(daily.reduce((a, d) => a + d.pct, 0) / 7);
  const consistency = Math.round((daily.filter((d) => d.done > 0).length / 7) * 100);
  return { days, daily, workouts, habitPct, consistency };
}

export function monthStats(state: VeyraState) {
  const habitCount = Math.max(state.habits.length, 1);
  return Array.from({ length: 4 }, (_, w) => {
    const offsets = Array.from({ length: 7 }, (_, i) => (3 - w) * 7 + i);
    const dates = offsets.map(dayKey);
    const habits = Math.round(
      dates.reduce((a, d) => a + ((state.completions[d] ?? []).length / habitCount) * 100, 0) / 7,
    );
    return {
      week: `W${w + 1}`,
      workouts: state.sessions.filter((s) => dates.includes(s.date)).length,
      habits,
    };
  });
}

export function currentStreak(state: VeyraState, habitId: string) {
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    if ((state.completions[dayKey(i)] ?? []).includes(habitId)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
