import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Crown,
  MessageSquare,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/veyra/AppShell";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Veyra" },
      { name: "description", content: "Veyra admin overview: users, plans, coach usage and platform health." },
      { property: "og:title", content: "Admin Dashboard — Veyra" },
      { property: "og:description", content: "User, plan and coach usage overview." },
    ],
  }),
  component: () => (
    <AppShell>
      <AdminPage />
    </AppShell>
  ),
});

const METRICS = [
  { label: "Total users", value: "1,248", icon: Users, change: "+12% this week" },
  { label: "Active today", value: "342", icon: BarChart3, change: "+8% vs yesterday" },
  { label: "Coach messages", value: "8,921", icon: MessageSquare, change: "+24% this week" },
  { label: "Paid plans", value: "186", icon: Crown, change: "+6% this month" },
];

function AdminPage() {
  const { state } = useVeyra();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user?.role !== "admin") {
      navigate({ to: "/home", replace: true });
    }
  }, [state.user, navigate]);

  if (state.user?.role !== "admin") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">Redirecting…</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and key metrics." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="panel p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wide">{m.label}</span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">{m.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.change}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="panel p-6">
          <h3 className="font-semibold">Recent sign-ups</h3>
          <ul className="mt-4 space-y-3">
            {[
              { name: "Aarav Sharma", email: "aarav@gmail.com", plan: "free" },
              { name: "Priya Nair", email: "priya.n@example.com", plan: "plus" },
              { name: "Rohan Mehta", email: "rohan.m@example.com", plan: "pro" },
              { name: "Sneha Iyer", email: "sneha.i@example.com", plan: "free" },
            ].map((u) => (
              <li key={u.email} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium capitalize">
                  {u.plan}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel p-6">
          <h3 className="font-semibold">Plan distribution</h3>
          <div className="mt-6 space-y-4">
            {[
              { label: "Free", value: 1062, pct: 85 },
              { label: "Plus", value: 124, pct: 10 },
              { label: "Pro", value: 62, pct: 5 },
            ].map((p) => (
              <div key={p.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{p.label}</span>
                  <span className="text-muted-foreground">{p.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/home">Back to app</Link>
        </Button>
      </div>
    </>
  );
}
