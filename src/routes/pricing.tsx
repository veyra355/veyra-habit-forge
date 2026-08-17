import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/veyra/Logo";
import { plans } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Veyra Plans from ₹0 to ₹699" },
      {
        name: "description",
        content:
          "Veyra plans: Free at ₹0, Starter ₹99/month, Pro ₹299/month and Elite ₹699/month. Start free, upgrade when the routine sticks.",
      },
      { property: "og:title", content: "Pricing — Veyra" },
      { property: "og:description", content: "Free, Starter ₹99, Pro ₹299, Elite ₹699 per month." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { state, update } = useVeyra();
  const navigate = useNavigate();

  const choose = (id: string) => {
    if (!state.user) {
      navigate({ to: "/auth" });
      return;
    }
    if (id === "free") {
      update({ user: { ...state.user, plan: "free" } });
      toast.success("You're on the Free plan");
      navigate({ to: "/home" });
      return;
    }
    // No payment gateway is connected yet — never fake a successful upgrade.
    toast.info("Checkout isn't connected yet", {
      description: "Paid plans unlock once a payment provider is set up for this project.",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={state.user ? "/home" : "/"}>
          <Logo />
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to={state.user ? "/home" : "/"}>{state.user ? "Back to app" : "Back to home"}</Link>
        </Button>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
        <div className="text-center">
          <h1 className="display-italic text-[clamp(2.1rem,5vw,3.4rem)]">
            Choose your <span className="text-primary">plan.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Start free. Upgrade when the routine already feels like yours. Cancel any time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const current = state.user?.plan === p.id;
            return (
              <div
                key={p.id}
                className={cn("panel flex flex-col p-6", p.highlight && "border-primary/40 glow-lime")}
              >
                {p.highlight && <span className="mb-3 self-start eyebrow text-primary">Recommended</span>}
                <p className="eyebrow text-muted-foreground">{p.name}</p>
                <p className="mt-2 font-display text-4xl font-bold">
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
                  disabled={current}
                  onClick={() => choose(p.id)}
                >
                  {current ? "Current plan" : p.cta}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          A payment provider is not connected yet, so paid plans can&apos;t be purchased. Free stays free.
        </p>
      </div>
    </div>
  );
}
