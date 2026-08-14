import { createFileRoute } from "@tanstack/react-router";
import { Award, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { StatCard } from "@/components/veyra/StatCard";
import { monthStats, weekStats } from "@/lib/stats";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Veyra" },
      { name: "description", content: "Weekly and monthly trends for workouts, habit completion and consistency, without vanity metrics." },
      { property: "og:title", content: "Progress — Veyra" },
      { property: "og:description", content: "Weekly and monthly trends for your routine." },
    ],
  }),
  component: () => (
    <AppShell>
      <ProgressPage />
    </AppShell>
  ),
});

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-foreground)",
};

function ProgressPage() {
  const { state } = useVeyra();
  const week = weekStats(state);
  const month = monthStats(state);

  return (
    <>
      <PageHeader title="Progress" subtitle="A calm read on how the last week and month actually went." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Workouts (week)" value={`${week.workouts}/5`} progress={(week.workouts / 5) * 100} icon={<TrendingUp className="size-4" />} />
        <StatCard label="Habit completion" value={`${week.habitPct}%`} progress={week.habitPct} />
        <StatCard label="Consistency" value={`${week.consistency}%`} progress={week.consistency} hint="Days with at least one habit" />
        <StatCard label="Milestones" value={`${state.sessions.length}`} icon={<Award className="size-4" />} hint="Sessions logged in total" />
      </div>

      <div className="panel mt-4 p-5">
        <p className="text-sm font-medium">Your Week</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You completed {week.workouts} of 5 planned workouts this week, with {week.habitPct}% habit completion.
          {week.workouts >= 4
            ? " Next week, your coach recommends maintaining your current schedule."
            : " Next week, your coach recommends keeping sessions shorter but more frequent to rebuild rhythm."}
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <p className="text-sm font-medium">Habit completion this week</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pct" name="Completion %" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <p className="text-sm font-medium">Workout consistency trend (4 weeks)</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={month}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="workouts" name="Workouts" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5 lg:col-span-2">
          <p className="text-sm font-medium">Habit trend (4 weeks)</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={month}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="habits" name="Habit completion %" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.18} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel mt-4 p-5">
        <p className="text-sm font-medium">Completed sessions</p>
        <div className="mt-3 divide-y divide-border">
          {state.sessions.slice(0, 8).map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2.5 text-sm">
              <span>{s.title}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                {(s.feedback ?? "logged").replace("_", " ")}
              </span>
            </div>
          ))}
          {!state.sessions.length && (
            <p className="py-3 text-sm text-muted-foreground">No sessions logged yet — your first one starts the trend.</p>
          )}
        </div>
      </div>

      <SafetyNote>
        These numbers describe your logged activity only. They are not health measurements, and Veyra makes no
        medical claims from them.
      </SafetyNote>
    </>
  );
}
