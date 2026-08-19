import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/veyra/Logo";
import { OptionGroup } from "@/components/veyra/OptionGroup";
import { useVeyra, type Onboarding } from "@/lib/veyra-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your plan — Veyra" },
      { name: "description", content: "Set up your personalized Veyra plan." },
    ],
  }),
  component: OnboardingPage,
});

const empty: Onboarding = {
  ageRange: "",
  experience: "",
  location: "",
  equipment: [],
  daysPerWeek: "",
  workoutTime: "",
  goals: [],
  sleepSchedule: "",
  activityLevel: "",
  workSchedule: "",
  timePerDay: "",
  diet: "",
  place: "",
};

const STEPS = ["About you", "Goals", "Lifestyle", "Preferences", "Confirmation"];

function OnboardingPage() {
  const { user, hydrated, onboarding, update } = useVeyra();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Onboarding>(onboarding ?? empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/auth", replace: true });
  }, [hydrated, user, navigate]);

  useEffect(() => {
    if (onboarding) setData(onboarding);
  }, [onboarding]);

  const set = <K extends keyof Onboarding>(
    key: K,
    value: Onboarding[K]
  ) => setData((p) => ({ ...p, [key]: value }));

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await (supabase as SupabaseClient)
      .from("profiles")
      .update({
        name: user.name,
        email: user.email,
        onboarding: data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      toast.error(`Failed to save onboarding: ${error.message}`);
      return;
    }
    update({ onboarding: data });
    navigate({ to: "/home", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
        <Logo />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:px-6">
        <div className="mb-6">
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>
        <div className="min-h-[60vh]">
          {step === 0 && (
            <>
              <Header
                title="About you"
                sub="This shapes how your first week is built."
              />
              <OptionGroup
                label="Age range"
                options={["16–20", "21–25", "26–30", "31–40", "40+"]}
                value={data.ageRange}
                onChange={(v) => set("ageRange", v)}
              />
              <OptionGroup
                label="Experience level"
                options={[
                  "Never worked out",
                  "Occasional exercise",
                  "Regular exerciser",
                  "Serious athlete",
                ]}
                value={data.experience}
                onChange={(v) => set("experience", v)}
              />
              <OptionGroup
                label="Location"
                options={[
                  "Home",
                  "Gym",
                  "Outdoors",
                  "Mix of these",
                  "No preference",
                ]}
                value={data.location}
                onChange={(v) => set("location", v)}
              />
            </>
          )}

          {step === 1 && (
            <>
              <Header
                title="Your goals"
                sub="Pick as many as apply. You can change these any time."
              />
              <OptionGroup
                label="What do you want to work on?"
                multi
                options={[
                  "General fitness",
                  "Strength",
                  "Endurance",
                  "Flexibility",
                  "Weight loss",
                  "Mental health",
                ]}
                value={data.goals}
                onChange={(v) => set("goals", v)}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Header
                title="Lifestyle"
                sub="So your plan fits the week you actually have."
              />
              <OptionGroup
                label="Typical sleep schedule"
                options={["Before 11 pm", "11 pm – 1 am", "After 1 am", "Irregular"]}
                value={data.sleepSchedule}
                onChange={(v) => set("sleepSchedule", v)}
              />
              <OptionGroup
                label="Work schedule"
                options={[
                  "9–5",
                  "Shift work",
                  "Flexible",
                  "Student",
                ]}
                value={data.workSchedule}
                onChange={(v) => set("workSchedule", v)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Header
                title="Preferences"
                sub="Final details before we build the plan."
              />
              <OptionGroup
                label="Food preference"
                options={[
                  "Vegetarian",
                  "Non-vegetarian",
                  "Eggetarian",
                  "Other",
                ]}
                value={data.diet}
                onChange={(v) => set("diet", v)}
              />
            </>
          )}

          {step === 4 && (
            <div className="py-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <PartyPopper className="size-6" />
              </span>
              <h2 className="mt-4 text-2xl font-semibold">All set!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your plan is being built. Let's make this year your best yet.
              </p>
              <Summary label="Experience" value={data.experience} />
              <Summary label="Primary goal" value={data.goals[0] ?? "TBD"} />
              <Summary label="Workout location" value={data.location} />
            </div>
          )}
        </div>
        {step < 4 && (
          <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
            <Button
              variant="ghost"
              className="tap"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </span>
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="tap"
              disabled={step === STEPS.length - 1}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className="flex justify-center gap-3 border-t border-border pt-5">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              className="tap"
            >
              Back
            </Button>
            <Button
              onClick={finish}
              loading={saving}
              className="tap"
            >
              Create my plan
            </Button>
          </div>
        )}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          We never ask you to rate your appearance or compare you to anyone else.
        </p>
      </div>
    </div>
  );
}

function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
