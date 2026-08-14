import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Dumbbell,
  LineChart,
  Moon,
  ScissorsLineDashed,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/veyra/Logo";
import { faqs, plans } from "@/lib/sample-data";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veyra — Your AI Fitness & Grooming Coach" },
      {
        name: "description",
        content:
          "Veyra builds personalized fitness, habit and grooming routines that adapt to your goals, schedule and progress. Start free.",
      },
      { property: "og:title", content: "Veyra — Your AI Fitness & Grooming Coach" },
      {
        property: "og:description",
        content: "Build better habits. Feel better. Show up better.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: Target, title: "Tell us your goals", text: "A short questionnaire about your schedule, setup and what you want to improve." },
  { icon: Sparkles, title: "Get your personalized plan", text: "Workouts, habits and grooming routines built around your real week." },
  { icon: CalendarCheck, title: "Check in every day", text: "Log sessions and habits in seconds. Tell us how each workout felt." },
  { icon: Brain, title: "Watch your plan adapt", text: "Your coach adjusts volume, intensity and focus from your feedback." },
];

const features = [
  { icon: Dumbbell, title: "Personalized workouts", text: "Home, gym or outdoors — matched to your equipment and time." },
  { icon: Brain, title: "Adaptive AI coaching", text: "Your plan shifts as your energy, schedule and feedback change." },
  { icon: CheckCircle2, title: "Habit tracking", text: "Sleep, water, movement and focus with streaks that encourage." },
  { icon: ScissorsLineDashed, title: "Grooming routines", text: "Simple hair, skin, style and presentation basics you can keep." },
  { icon: LineChart, title: "Progress analytics", text: "Weekly and monthly trends without vanity metrics." },
  { icon: Sparkles, title: "AI Coach", text: "Ask for a shorter session, a weekly plan or a grooming routine." },
];

function DashboardPreview() {
  return (
    <div className="panel overflow-hidden p-3 shadow-[var(--shadow-lift)] sm:p-4">
      <div className="mb-3 flex items-center gap-1.5 px-1">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-chart-3/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
        <span className="ml-2 text-xs text-muted-foreground">Veyra · Today</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Today&apos;s workout</p>
          <p className="mt-1 font-display text-lg font-semibold">Full Body Strength — Foundation</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">38 min</Badge>
            <Badge variant="secondary">Intermediate</Badge>
            <Badge variant="secondary">Dumbbells</Badge>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Habit progress</p>
          <div className="mt-3 space-y-2.5">
            {[
              ["Sleep", 80],
              ["Water", 60],
              ["Movement", 100],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{label}</span>
                  <span className="text-muted-foreground">{value}%</span>
                </div>
                <Progress value={value as number} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Grooming routine</p>
          <ul className="mt-3 space-y-2 text-sm">
            {["Morning: cleanse + SPF", "Evening: cleanse + moisturise", "Weekly: trim & nails"].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                <span className="text-muted-foreground">{i}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Weekly progress</p>
          <div className="mt-3 flex items-end gap-2">
            {[40, 65, 55, 80, 70, 95, 85].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-primary/80" style={{ height: `${h * 0.6}px` }} />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">4 of 5 planned workouts · 78% habits completed</p>
        </div>
      </div>
    </div>
  );
}

function Landing() {
  const { state, update } = useVeyra();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => update({ theme: state.theme === "dark" ? "light" : "dark" })}
            >
              {state.theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button asChild size="sm">
              <Link to="/auth">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
              Build better habits. Feel better. Show up better.
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-balance-tight sm:text-5xl lg:text-6xl">
              Your AI-powered fitness &amp; grooming coach.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Personalized routines for fitness, habits, grooming and everyday wellness—adapted to your goals
              and progress.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/auth">
                  Start Free <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <a href="#how">See How It Works</a>
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No appearance scores. No body comparisons. Just realistic, supportive guidance.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section id="how" className="border-y border-border bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Four steps, then it runs with you.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="panel p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <s.icon className="size-4" />
                  </span>
                  <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Everything in one calm place</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="panel p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
                <f.icon className="size-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold sm:text-3xl">Simple pricing</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/pricing">Compare plans <ArrowRight className="ml-1 size-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`panel p-6 ${p.highlight ? "ring-2 ring-primary" : ""}`}
              >
                {p.highlight && <Badge className="mb-3">Most popular</Badge>}
                <p className="font-display text-sm uppercase tracking-wide text-muted-foreground">{p.name}</p>
                <p className="mt-2 font-display text-3xl font-semibold">
                  {p.price}
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="panel flex flex-col items-center gap-5 p-10 text-center sm:p-14">
          <h2 className="max-w-xl text-2xl font-semibold text-balance-tight sm:text-4xl">
            Start building your routine today.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Free to begin. Upgrade only when the routine has already become yours.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/auth">Start Free</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Logo />
            <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">About</a>
              <a href="#faq" className="hover:text-foreground">Privacy</a>
              <a href="#faq" className="hover:text-foreground">Terms</a>
              <a href="mailto:hello@veyra.app" className="hover:text-foreground">Contact</a>
            </nav>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Veyra provides general fitness, habit and grooming guidance only. It does not diagnose conditions,
            prescribe medication or replace professional medical care. For any medical concern, consult a
            qualified healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
