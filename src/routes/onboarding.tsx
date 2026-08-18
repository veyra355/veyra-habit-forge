import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/veyra/Logo";
import { OptionGroup } from "@/components/veyra/OptionGroup";
import { useVeyra, type Onboarding } from "@/lib/veyra-store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your plan — Veyra" },
      { name: "description", content: "Answer a few questions about your goals, schedule and setup so Veyra can build your personalized plan." },
      { property: "og:title", content: "Set up your plan — Veyra" },
      { property: "og:description", content: "A few questions, then your plan is ready." },
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
  level: "",
  duration: "",
};

const STEPS = ["About you", "Goals", "Lifestyle", "Preferences", "Confirmation"];

function OnboardingPage() {
  const { state, hydrated, update } = useVeyra();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Onboarding>(state.onboarding ?? empty);

  useEffect(() => {
    if (hydrated && !state.user) navigate({ to: "/auth", replace: true });
  }, [hydrated, state.user, navigate]);

  const set = <K extends keyof Onboarding>(key: K, value: Onboarding[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const finish = () => {
    update({ onboarding: data });
    toast.success("Your plan is ready");
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
        <Logo />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom))] sm:px-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </span>
            <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
        </div>

        <div className="panel space-y-7 p-4 sm:p-8">
          {step === 0 && (
            <>
              <Header title="About you" sub="This shapes how your first week is built." />
              <OptionGroup label="Age range" options={["16–20", "21–25", "26–30", "31–40", "40+"]} value={data.ageRange} onChange={(v) => set("ageRange", v as string)} columns={3} />
              <OptionGroup label="Fitness experience" options={["Just starting", "Some experience", "Consistent for months", "Very experienced"]} value={data.experience} onChange={(v) => set("experience", v as string)} />
              <OptionGroup label="Workout location" options={["Home", "Gym", "Outdoors", "Mix of these"]} value={data.location} onChange={(v) => set("location", v as string)} />
              <OptionGroup label="Available equipment" multi options={["None (bodyweight)", "Dumbbells", "Resistance bands", "Pull-up bar", "Full gym", "Yoga mat"]} value={data.equipment} onChange={(v) => set("equipment", v as string[])} />
              <OptionGroup label="Days available per week" options={["2", "3", "4", "5", "6"]} value={data.daysPerWeek} onChange={(v) => set("daysPerWeek", v as string)} columns={3} />
              <OptionGroup label="Typical workout time" options={["Early morning", "Morning", "Afternoon", "Evening", "Late night"]} value={data.workoutTime} onChange={(v) => set("workoutTime", v as string)} />
            </>
          )}

          {step === 1 && (
            <>
              <Header title="Your goals" sub="Pick as many as apply. You can change these any time." />
              <OptionGroup
                label="What do you want to work on?"
                multi
                options={[
                  "General fitness",
                  "Strength",
                  "Mobility",
                  "Endurance",
                  "Better daily habits",
                  "Grooming",
                  "Skincare basics",
                  "Hair-care routine",
                  "Personal style",
                  "Better sleep",
                  "Better consistency",
                ]}
                value={data.goals}
                onChange={(v) => set("goals", v as string[])}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Header title="Lifestyle" sub="So your plan fits the week you actually have." />
              <OptionGroup label="Typical sleep schedule" options={["Before 11 pm", "11 pm – 1 am", "After 1 am", "Irregular"]} value={data.sleepSchedule} onChange={(v) => set("sleepSchedule", v as string)} />
              <OptionGroup label="Activity level" options={["Mostly sitting", "Lightly active", "Moderately active", "Very active"]} value={data.activityLevel} onChange={(v) => set("activityLevel", v as string)} />
              <OptionGroup label="Work / study schedule" options={["Student", "9-to-5 job", "Shift work", "Flexible / remote"]} value={data.workSchedule} onChange={(v) => set("workSchedule", v as string)} />
              <OptionGroup label="Available time per day" options={["15 min", "30 min", "45 min", "60+ min"]} value={data.timePerDay} onChange={(v) => set("timePerDay", v as string)} columns={2} />
            </>
          )}

          {step === 3 && (
            <>
              <Header title="Preferences" sub="Final details before we build the plan." />
              <OptionGroup label="Food preference" options={["Vegetarian", "Non-vegetarian", "Eggetarian", "Other"]} value={data.diet} onChange={(v) => set("diet", v as string)} />
              <OptionGroup label="Where you'll train" options={["Home", "Gym", "Outdoor"]} value={data.place} onChange={(v) => set("place", v as string)} columns={3} />
              <OptionGroup label="Training level" options={["Beginner", "Intermediate", "Advanced"]} value={data.level} onChange={(v) => set("level", v as string)} columns={3} />
              <OptionGroup label="Preferred workout duration" options={["20 min", "30 min", "45 min", "60 min"]} value={data.duration} onChange={(v) => set("duration", v as string)} columns={2} />
            </>
          )}

          {step === 4 && (
            <div className="py-6 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <PartyPopper className="size-6" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold">Your personal plan is ready.</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                We&apos;ve set up workouts, daily habits and a grooming routine around{" "}
                {data.goals.length ? data.goals.slice(0, 2).join(" and ").toLowerCase() : "your goals"}. You can adjust
                everything later.
              </p>
              <div className="mt-6 grid gap-2 text-left sm:grid-cols-2">
                <Summary label="Level" value={data.level || data.experience || "Beginner"} />
                <Summary label="Training at" value={data.place || data.location || "Home"} />
                <Summary label="Days / week" value={data.daysPerWeek || "4"} />
                <Summary label="Session length" value={data.duration || data.timePerDay || "30 min"} />
              </div>
              <Button size="lg" className="tap mt-8 w-full rounded-full sm:w-auto sm:px-10" onClick={finish}>
                Build My Plan
              </Button>
            </div>
          )}

          {step < 4 && (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
              <Button variant="ghost" className="tap" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="mr-1.5 size-4" /> Back
              </Button>
              <Button className="tap flex-1 rounded-full sm:flex-none sm:px-8" onClick={() => setStep((s) => s + 1)}>
                Continue <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          We never ask you to rate your appearance, and we never compare you to anyone else.
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
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
