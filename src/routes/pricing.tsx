import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/veyra/Logo";
import { plans } from "@/lib/sample-data";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Veyra" },
      { name: "description", content: "Veyra plans: Free at ₹0, Plus at ₹499/month and Pro at ₹999/month. Start free, upgrade when the routine sticks." },
      { property: "og:title", content: "Pricing — Veyra" },
      { property: "og:description", content: "Free, Plus ₹499/month, Pro ₹999/month." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { state, update } = useVeyra();
  const navigate = useNavigate();

  const choose = (id: string) => {
    if (!state.user) return navigate({ to: "/auth" });
    if (id === "free") {
      update({ user: { ...state.user, plan: "free" } });
      toast.success("You're on the Free plan");
    } else {
      update({ user: { ...state.user, plan: id as "plus" | "pro" } });
      toast.success(`Checkout placeholder — ${id === "plus" ? "Plus" : "Pro"} activated in demo mode`);
    }
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={state.user ? "/home" : "/"}>
          <Logo />
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to={state.user ? "/home" : "/"}>{state.user ? "Back to app" : "Back to home"}</Link>
        </Button>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Choose your plan</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Start free. Upgrade when the routine already feels like yours. Cancel any time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className={`panel flex flex-col p-6 ${p.highlight ? "ring-2 ring-primary" : ""}`}>
              {p.highlight && <Badge className="mb-3 self-start">Most popular</Badge>}
              <p className="font-display text-sm uppercase tracking-wide text-muted-foreground">{p.name}</p>
              <p className="mt-2 font-display text-4xl font-semibold">
                {p.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-7 w-full rounded-full"
                variant={p.highlight ? "default" : "outline"}
                onClick={() => choose(p.id)}
              >
                {state.user?.plan === p.id ? "Current plan" : p.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Payments are not live yet — upgrade buttons are placeholder checkout actions for this MVP.
        </p>
      </div>
    </div>
  );
}
