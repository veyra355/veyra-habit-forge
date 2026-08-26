import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { AppShell, PageHeader } from "@/components/veyra/AppShell";
import { ExercisePose } from "@/components/veyra/ExercisePose";
import { EXERCISES } from "@/lib/exercise-data";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Exercise Academy — Veyra" },
      {
        name: "description",
        content: "Learn how to perform exercises correctly — steps, muscles worked, and common mistakes to avoid.",
      },
    ],
  }),
  component: AcademyIndexPage,
});

const COVER_POSE = {
  "bodyweight-squat": "squat-low",
  "push-up": "push-up-bottom",
  "dumbbell-curl": "curl",
  plank: "plank",
  "walking-lunge": "lunge",
  "dumbbell-shoulder-press": "press-up",
} as const;

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "bg-primary/15 text-primary",
  Intermediate: "bg-chart-4/15 text-chart-4",
  Advanced: "bg-destructive/15 text-destructive",
};

function AcademyIndexPage() {
  return (
    <AppShell>
      <PageHeader
        title="Exercise Academy"
        subtitle="Learn the movement before you load it up. Steps, muscles worked, and mistakes to avoid."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXERCISES.map((ex) => (
          <Link
            key={ex.id}
            to="/academy/$exerciseId"
            params={{ exerciseId: ex.id }}
            className="group panel flex flex-col p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/30 py-6">
              {ex.imageUrl ? (
                <img
                  src={ex.imageUrl}
                  alt={`Demonstration of ${ex.name}`}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <ExercisePose pose={COVER_POSE[ex.id as keyof typeof COVER_POSE]} className="h-24 w-24" />
              )}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{ex.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{ex.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge className={`rounded-full ${DIFFICULTY_COLOR[ex.difficulty]}`}>{ex.difficulty}</Badge>
              <Badge variant="outline" className="rounded-full">{ex.equipment}</Badge>
              <Badge variant="outline" className="rounded-full">{ex.category}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
