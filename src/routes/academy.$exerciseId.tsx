import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AppShell, SafetyNote } from "@/components/veyra/AppShell";
import { ExercisePose, type Pose } from "@/components/veyra/ExercisePose";
import { getExerciseById } from "@/lib/exercise-data";
import { markAcademyVisited } from "@/lib/achievements";

export const Route = createFileRoute("/academy/$exerciseId")({
  loader: ({ params }) => {
    const exercise = getExerciseById(params.exerciseId);
    if (!exercise) throw notFound();
    return exercise;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Exercise"} — Veyra Academy` },
      { name: "description", content: loaderData?.summary ?? "" },
    ],
  }),
  component: ExerciseDetailPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="panel p-8 text-center">
        <p className="font-display text-lg font-bold">Exercise not found</p>
        <p className="mt-2 text-sm text-muted-foreground">This exercise isn't in the Academy yet.</p>
        <Link to="/academy" className="mt-4 inline-block text-sm font-semibold text-primary">
          Back to Academy
        </Link>
      </div>
    </AppShell>
  ),
});

const STEP_POSES: Record<string, Pose[]> = {
  "bodyweight-squat": ["stand", "squat-low", "squat-low", "stand"],
  "push-up": ["push-up-top", "push-up-bottom", "push-up-bottom", "push-up-top"],
  "dumbbell-curl": ["stand", "curl", "curl", "stand"],
  plank: ["plank", "plank", "plank", "plank"],
  "walking-lunge": ["stand", "lunge", "lunge", "stand"],
  "dumbbell-shoulder-press": ["stand", "stand", "press-up", "stand"],
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "bg-primary/15 text-primary",
  Intermediate: "bg-chart-4/15 text-chart-4",
  Advanced: "bg-destructive/15 text-destructive",
};

function ExerciseDetailPage() {
  const exercise = Route.useLoaderData();
  const poses: Pose[] = STEP_POSES[exercise.id] ?? ["stand", "stand", "stand", "stand"];

  useEffect(() => {
    markAcademyVisited(exercise.id);
  }, [exercise.id]);

  return (
    <AppShell>
      <Link to="/academy" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to Academy
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col items-center justify-center rounded-[26px] border border-border bg-muted/30 p-8">
          <ExercisePose pose={poses[1] ?? "stand"} className="h-48 w-48" />
        </div>

        <div>
          <h1 className="display-italic text-[clamp(1.9rem,4.4vw,3rem)]">{exercise.name}</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{exercise.summary}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge className={`rounded-full ${DIFFICULTY_COLOR[exercise.difficulty]}`}>{exercise.difficulty}</Badge>
            <Badge variant="outline" className="rounded-full">{exercise.equipment}</Badge>
            <Badge variant="outline" className="rounded-full">{exercise.category}</Badge>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Primary muscles</p>
              <p className="mt-1 text-sm">{exercise.primaryMuscles.join(", ")}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Secondary muscles</p>
              <p className="mt-1 text-sm">{exercise.secondaryMuscles.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">How to perform</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {exercise.steps.map((step, i) => (
            <div key={step.title} className="panel flex gap-4 p-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30">
                <ExercisePose pose={poses[i] ?? "stand"} className="h-12 w-12" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Step {i + 1}</p>
                <h3 className="mt-0.5 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" />
            <h3 className="font-semibold">Common mistakes</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {exercise.commonMistakes.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="text-destructive">•</span> {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <h3 className="font-semibold">Variations</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <p className="flex items-center gap-1.5 font-medium text-primary">
                <ChevronDown className="size-3.5" /> Easier
              </p>
              <p className="mt-1 text-muted-foreground">{exercise.easierVariation}</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 font-medium text-chart-4">
                <ChevronUp className="size-3.5" /> Harder
              </p>
              <p className="mt-1 text-muted-foreground">{exercise.harderVariation}</p>
            </div>
          </div>
        </div>
      </section>

      <SafetyNote>{exercise.safetyNote}</SafetyNote>
    </AppShell>
  );
}
