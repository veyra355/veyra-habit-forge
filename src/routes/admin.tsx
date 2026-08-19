import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, Crown, MessageSquare, Users } from "lucide-react";
import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { AppShell, PageHeader } from "@/components/veyra/AppShell";
import { useVeyra } from "@/lib/veyra-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Veyra" },
      { name: "description", content: "Veyra admin overview and platform health." },
    ],
  }),
  component: AdminPage,
});

const db = supabase as SupabaseClient;

interface OverviewData {
  total_users: number;
  active_today: number;
  coach_messages: number;
  paid_plans: number;
  recent_signups: Array<{
    name: string;
    email: string;
    plan: string;
    created_at: string;
  }>;
  plan_distribution: Record<string, number>;
}

function AdminPage() {
  const { state, hydrated } = useVeyra();
  const navigate = useNavigate();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && state.user?.role !== "admin") {
      navigate({ to: "/home", replace: true });
    }
  }, [hydrated, state.user, navigate]);

  useEffect(() => {
    if (!hydrated || state.user?.role !== "admin") return;
    setLoading(true);
    db.rpc("get_admin_overview").then(
      (response: { data: OverviewData | null; error: Error | null }) => {
        setLoading(false);
        if (response.error) {
          toast.error(`Failed to load admin data: ${response.error.message}`);
          return;
        }
        if (response.data) setData(response.data);
      }
    );
  }, [hydrated, state.user]);

  if (!hydrated || state.user?.role !== "admin") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  const metrics = data
    ? [
        {
          label: "Total users",
          value: data.total_users.toLocaleString(),
          icon: Users,
        },
        {
          label: "Active today",
          value: data.active_today.toLocaleString(),
          icon: BarChart3,
        },
        {
          label: "Coach messages",
          value: data.coach_messages.toLocaleString(),
          icon: MessageSquare,
        },
        {
          label: "Paid plans",
          value: data.paid_plans.toLocaleString(),
          icon: Crown,
        },
      ]
    : [];

  const plans = data ? Object.entries(data.plan_distribution) : [];

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Live platform metrics from Supabase."
      />
      {loading && (
        <p className="mb-4 text-sm text-muted-foreground">Loading live metrics…</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </span>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>
      {data?.recent_signups && data.recent_signups.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Recent Signups</h3>
          <div className="mt-4 space-y-2">
            {data.recent_signups.slice(0, 5).map((signup) => (
              <div key={signup.email} className="rounded-lg border p-3">
                <p className="font-medium">{signup.name}</p>
                <p className="text-sm text-muted-foreground">{signup.email}</p>
                <p className="text-xs text-muted-foreground">
                  Plan: {signup.plan}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {plans.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Plan Distribution</h3>
          <div className="mt-4 space-y-2">
            {plans.map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <span>{plan}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
