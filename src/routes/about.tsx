import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/veyra/Logo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Veyra — Our Coaching Principles" },
      {
        name: "description",
        content:
          "Veyra is an AI fitness, grooming and habit coach built on respectful principles: no appearance scoring, no body shaming, no medical diagnosis.",
      },
      { property: "og:title", content: "About Veyra" },
      { property: "og:description", content: "Respectful, realistic coaching for fitness, habits and grooming." },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    icon: HeartHandshake,
    title: "No shaming, ever",
    text: "Veyra never rates appearance, compares you to other people or celebrities, or frames your body as a problem.",
  },
  {
    icon: ShieldCheck,
    title: "No medical claims",
    text: "Veyra gives general wellness guidance only. It does not diagnose, treat or prescribe. Medical concerns belong with a qualified professional.",
  },
  {
    icon: Lock,
    title: "Your data stays yours",
    text: "Your plan data belongs to your account. Presentation photos are analysed on your device and never stored.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/">Back to home</Link>
        </Button>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6">
        <h1 className="display-italic text-[clamp(2.2rem,5.5vw,3.6rem)]">
          Built for progress,
          <br />
          <span className="text-primary">not pressure.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Veyra is a single system for training, daily habits, grooming and presentation — designed for young
          adults in India who want to build a routine that actually lasts. Everything adapts to your week, your
          equipment and your honest feedback.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="panel p-5">
              <span className="grid size-10 place-items-center rounded-xl border border-border bg-primary/10 text-primary">
                <p.icon className="size-4" />
              </span>
              <h2 className="mt-4 text-base font-semibold">{p.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-10 flex flex-wrap items-center justify-between gap-4 p-8">
          <p className="font-display text-lg font-bold uppercase tracking-wide">Ready to start?</p>
          <Button asChild className="rounded-full px-6 font-semibold tracking-wide">
            <Link to="/auth">
              START FREE <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
