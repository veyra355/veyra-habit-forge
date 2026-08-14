import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, Dumbbell, Gauge, PartyPopper } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { todaysWorkout, upcomingWorkouts } from "@/lib/sample-data";
import { useVeyra, type WorkoutSession } from "@/lib/veyra-store";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Today's Workout — Veyra" },
      { name: "description", content: "Your adaptive session for today: exercises, sets, rest periods and simple form cues." },
      { property: "og:title", content: "Today's Workout — Veyra" },
      { property: "og:description", content: "Exercises, sets, rest and form cues for today." },
    ],
  }),
  component: () => (
    <AppShell>
      <WorkoutPage />
    </AppShell>
  ),
});

const FEEDBACK: { id: Exclude<WorkoutSession["feedback"], null>; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "good", label: "Good" },
  { id: "challenging", label: "Challenging" },
  { id: "too_difficult", label: "Too difficult" },
];

function WorkoutPage() {
  const { state, toggleExercise, completeWorkout, update } = useVeyra();
  const [feedback, setFeedback] = useState<WorkoutSession["feedback"]>(null);
  const [done, setDone] = useState(false);

  const completed = state.completedExercises.filter((id) =>
    todaysWorkout.exercises.some((e) => e.id === id),
  );
  const pct = Math.round((completed.length / todaysWorkout.exercises.length) * 100);

  const finish = () => {
    if (!feedback) {
      toast.error("Let us know how it felt so we can adapt your plan");
      return;
    }
    completeWorkout(todaysWorkout.title, feedback);
    update({ completedExercises: [] });
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <PartyPopper className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">Workout Complete 🎉</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Logged, along with your feedback. Your coach will use it to tune the next session — recovery counts
          as part of the plan, so take the rest of today easy.
        </p>
        <Button
          className="mt-7 rounded-full px-8"
          onClick={() => {
            setDone(false);
            setFeedback(null);
          }}
        >
          Back to workouts
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Today's Workout" subtitle="Adapted from your goals, equipment and last session feedback." />

      <div className="panel p-5">
        <h2 className="font-display text-xl font-semibold">{todaysWorkout.title}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <Clock className="size-3" /> {todaysWorkout.duration}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Gauge className="size-3" /> {todaysWorkout.difficulty}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Dumbbell className="size-3" /> {todaysWorkout.equipment}
          </Badge>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>
              {completed.length} of {todaysWorkout.exercises.length} exercises
            </span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {todaysWorkout.exercises.map((ex, i) => {
          const isDone = completed.includes(ex.id);
          return (
            <div key={ex.id} className={`panel p-5 transition-colors ${isDone ? "border-primary/60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Exercise {i + 1}</p>
                  <h3 className="mt-0.5 text-base font-semibold">{ex.name}</h3>
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">{ex.sets}</Badge>
                    <Badge variant="outline">{ex.reps}</Badge>
                    <Badge variant="outline">{ex.rest}</Badge>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{ex.instructions}</p>
                </div>
                <Button
                  variant={isDone ? "secondary" : "outline"}
                  className="rounded-full"
                  onClick={() => toggleExercise(ex.id)}
                >
                  {isDone ? <CheckCircle2 className="mr-1.5 size-4 text-primary" /> : <Circle className="mr-1.5 size-4" />}
                  {isDone ? "Completed" : "Mark Complete"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel mt-6 p-5">
        <p className="text-sm font-medium">How did this workout feel?</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          {FEEDBACK.map((f) => (
            <button
              key={f.id}
              onClick={() => setFeedback(f.id)}
              className={`rounded-xl border border-border px-4 py-3 text-sm transition-all hover:border-primary/50 ${
                feedback === f.id ? "border-primary bg-accent text-accent-foreground" : "bg-card"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button className="mt-4 w-full rounded-full sm:w-auto sm:px-10" onClick={finish}>
          Finish workout
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Your answer changes the next session&apos;s volume and intensity — “too difficult” scales things back, no
          judgement attached.
        </p>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Coming up</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {upcomingWorkouts.map((w) => (
          <div key={w.title} className="panel p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{w.day}</p>
            <p className="mt-1 font-medium">{w.title}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {w.duration} · {w.difficulty}
            </p>
          </div>
        ))}
      </div>

      <SafetyNote>
        This is general fitness guidance, not rehabilitation or injury treatment. If something hurts, stop and
        speak to a qualified healthcare professional before continuing.
      </SafetyNote>
    </>
  );
}
