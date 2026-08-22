import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { IntroSequence } from "@/components/veyra/IntroSequence";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Dumbbell,
  Flame,
  Gamepad2,
  Menu,
  Play,
  ScissorsLineDashed,
  Sparkles,
  SquareCheckBig,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/veyra/Logo";
import { faqs, plans } from "@/lib/sample-data";
import { weekStats } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { useVeyra } from "@/lib/veyra-store";
import sculpture from "@/assets/hero-sculpture.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veyra — Build Your Best Routine | AI Fitness & Grooming Coach" },
      {
        name: "description",
        content:
          "Veyra is an AI-powered fitness, grooming and habit coach. Personalized workouts, grooming routines and daily habits in one premium system. Start free.",
      },
      { property: "og:title", content: "Veyra — Build Your Best Routine" },
      {
        property: "og:description",
        content:
          "Personalized workouts, grooming routines and daily habits — one system, infinite progress.",
      },
    ],
  }),
  component: Landing,
});

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "AI Coach", to: "/coach" },
  { label: "Body Builder", href: "#body-builder" },
  { label: "Grooming", to: "/grooming" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
] as const;

const FEATURES = [
  {
    icon: Dumbbell,
    title: "Fitness",
    text: "Science-backed workouts built around your goals.",
    color: "var(--lime)",
    to: "/workout",
  },
  {
    icon: ScissorsLineDashed,
    title: "Grooming",
    text: "Practical grooming and presentation routines.",
    color: "var(--cyan)",
    to: "/grooming",
  },
  {
    icon: SquareCheckBig,
    title: "Habits",
    text: "Daily habits and consistency systems.",
    color: "var(--purple)",
    to: "/habits",
  },
  {
    icon: Sparkles,
    title: "AI Coach",
    text: "Your personal AI coach that adapts to you.",
    color: "var(--lime-bright)",
    to: "/coach",
  },
] as const;

const STEPS = [
  {
    icon: Target,
    title: "Tell us your goals",
    text: "A short questionnaire about your schedule, setup and focus.",
  },
  {
    icon: Sparkles,
    title: "Get your plan",
    text: "Workouts, habits and grooming built around your real week.",
  },
  { icon: CalendarCheck, title: "Check in daily", text: "Log sessions and habits in seconds." },
  {
    icon: Brain,
    title: "Watch it adapt",
    text: "Volume, intensity and focus shift with your feedback.",
  },
];

function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="4"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--lime)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * Math.min(100, Math.max(0, value))) / 100}
        style={{ transition: "stroke-dashoffset 900ms ease-out" }}
      />
    </svg>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const { state } = useVeyra();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item, i) =>
            "to" in item ? (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  i === 0 && "bg-secondary text-primary",
                )}
              >
                {item.label}
                {i === 0 && (
                  <span className="mx-auto mt-0.5 block h-0.5 w-5 rounded-full bg-primary" />
                )}
              </a>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden rounded-full sm:inline-flex">
            <Link to="/auth">Log in</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full px-4 font-semibold tracking-wide">
            <Link to={state.user ? "/home" : "/auth"}>
              {state.user ? "OPEN APP" : "START FREE"} <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 py-3 lg:hidden">
          <div className="flex flex-col">
            {NAV.map((item) =>
              "to" in item ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </a>
              ),
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const { state } = useVeyra();
  const week = state.user ? weekStats(state) : null;
  const progress = week ? week.consistency : 78;

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 68% 35%, rgba(255,255,255,0.13), transparent 70%), radial-gradient(45% 40% at 10% 10%, rgba(53,231,255,0.06), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-2 lg:pb-16 lg:pt-16">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            <Gamepad2 className="size-3.5" /> HEALTH RPG · AI coach adapts daily
          </span>

          <h1 className="mt-6 display-italic text-[clamp(2.6rem,7vw,4.6rem)]">
            Build your streak.
            <br />
            <span className="text-primary">Not your stress.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Workouts, grooming and habits that turn into daily quests — not a generic plan
            you'll quit in 3 days. Earn XP, keep your streak, level up for real.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-7 font-semibold tracking-wide glow-lime"
            >
              <Link to="/auth">
                START YOUR FREE PLAN <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border px-6"
            >
              <a href="#how">
                <Play className="mr-2 size-4" /> See how it works
              </a>
            </Button>
          </div>

          <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["Personalized", "Built around your week"],
              ["AI-powered", "Adapts to your feedback"],
              ["One system", "Fitness, habits, grooming"],
            ].map(([title, sub]) => (
              <div key={title} className="glass p-3.5">
                <p className="font-display text-sm font-bold uppercase tracking-wide text-primary">
                  {title}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -z-0 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 hud-ring" />
          <div className="absolute left-1/2 top-1/2 -z-0 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
          <div
            className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6"
            style={{ boxShadow: "0 0 60px -12px rgba(255,255,255,0.25), 0 20px 50px -20px rgba(0,0,0,0.8)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow text-primary">Player HUD</p>
                <p className="mt-1 font-display text-2xl font-black">LVL 7</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Trophy className="size-6 text-primary" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="font-semibold">2,140 XP</span>
              <span className="text-muted-foreground">2,500 XP</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[86%] rounded-full bg-primary" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-border/70 bg-background/50 p-2.5 text-center">
                <Flame className="mx-auto size-3.5 text-primary" />
                <p className="mt-1 text-sm font-black">12d</p>
                <p className="text-[9px] uppercase tracking-wide text-muted-foreground">streak</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-2.5 text-center">
                <Zap className="mx-auto size-3.5 text-primary" />
                <p className="mt-1 text-sm font-black">+320</p>
                <p className="text-[9px] uppercase tracking-wide text-muted-foreground">today</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/50 p-2.5 text-center">
                <CheckCircle2 className="mx-auto size-3.5 text-primary" />
                <p className="mt-1 text-sm font-black">3/4</p>
                <p className="text-[9px] uppercase tracking-wide text-muted-foreground">quests</p>
              </div>
            </div>

            <div className="mt-5 flex gap-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div
                  key={`${day}-${i}`}
                  className={cn(
                    "flex h-8 flex-1 items-center justify-center rounded-lg text-[11px] font-bold",
                    i < 4 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="glass absolute -bottom-4 right-0 flex max-w-[17rem] items-center gap-3 p-4 sm:right-2">
            <div className="relative grid shrink-0 place-items-center">
              <ProgressRing value={progress} />
              <span className="absolute font-display text-xs font-bold">{progress}%</span>
            </div>
            <div className="min-w-0">
              <p className="eyebrow text-muted-foreground">Your progress</p>
              <p className="mt-1 text-xs leading-snug text-foreground/90">
                Keep pushing. You&apos;re getting closer to your goal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="glass grid gap-0 divide-y divide-border p-2 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {FEATURES.map((f) => (
          <div key={f.title} className="group flex items-start gap-3.5 p-5">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-border"
              style={{
                background: "rgba(255,255,255,0.03)",
                color: f.color,
                boxShadow: `0 0 24px -12px ${f.color}`,
              }}
            >
              <f.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold uppercase tracking-wide">{f.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full"
              aria-label={`Open ${f.title}`}
            >
              <Link to={f.to}>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

const FOCUS = ["Strength", "Athletic", "General Fitness", "Mobility"] as const;

function BodyBuilder() {
  const { state } = useVeyra();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"current" | "goal">("current");
  const [focus, setFocus] = useState<string>("Strength");

  const build = () => {
    if (!state.user) {
      navigate({ to: "/auth" });
      return;
    }
    toast.success(`Plan focus set to ${focus}`);
    navigate({ to: "/onboarding" });
  };

  return (
    <section id="body-builder" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-20">
      <div className="glass overflow-hidden p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 eyebrow text-primary">
              <Sparkles className="size-3.5" /> Body Builder
            </span>
            <h2 className="mt-5 display-italic text-[clamp(2rem,4.4vw,3rem)]">
              Visualize.
              <br />
              Plan.
              <br />
              <span className="text-primary">Transform.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Build a training goal and let Veyra create a plan around it. No appearance scores, no
              comparisons — just a realistic path to a stronger, more consistent you.
            </p>
          </div>

          <div>
            <div className="mx-auto flex w-full max-w-xs rounded-full border border-border bg-secondary/60 p-1">
              {(["current", "goal"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                    tab === t
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative mx-auto mt-6 max-w-[15rem] overflow-hidden rounded-[1.75rem] border border-border">
              <div className="absolute left-1/2 top-1/2 aspect-square w-[110%] -translate-x-1/2 -translate-y-1/2 hud-ring opacity-60" />
              <img
                src={sculpture}
                alt="Classical sculpture reference used in the Body Builder planner"
                loading="lazy"
                width={1024}
                height={1280}
                className={cn(
                  "h-full w-full object-cover transition-all duration-500",
                  tab === "goal" && "scale-105 contrast-115",
                )}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(5,7,6,0.9), rgba(5,7,6,0) 55%)",
                }}
              />
              <p className="absolute inset-x-0 bottom-3 text-center eyebrow text-muted-foreground">
                {tab === "current" ? "Current focus" : "Goal focus"}
              </p>
            </div>
          </div>

          <div className="panel p-5">
            <p className="eyebrow text-muted-foreground">Adjust your goals</p>
            <p className="mt-4 text-xs font-medium text-foreground/80">Training focus</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FOCUS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFocus(f)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-xs transition-colors",
                    focus === f
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs font-medium text-foreground/80">Goal stage</p>
            <div className="mt-2 flex gap-2">
              {["Current", "Target"].map((g) => (
                <span
                  key={g}
                  className={cn(
                    "flex-1 rounded-xl border border-border px-3 py-2.5 text-center text-xs",
                    (g === "Current") === (tab === "current")
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {g}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
              Height and weight stay optional profile measurements — Veyra never presents height as
              something it can change.
            </p>
            <Button
              onClick={build}
              className="mt-5 w-full rounded-full font-semibold tracking-wide"
            >
              BUILD MY PLAN <ArrowRight className="ml-1.5 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Landing() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.sessionStorage.getItem("veyra-intro-seen");
  });

  const handleIntroComplete = () => {
    window.sessionStorage.setItem("veyra-intro-seen", "true");
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen">
      {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
      <Navbar />
      <Hero />
      <FeatureStrip />
      <BodyBuilder />

      <section id="how" className="border-y border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="display-italic text-[clamp(1.7rem,3.4vw,2.4rem)]">How it works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Four steps, then it runs with you.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="panel p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl border border-border bg-primary/10 text-primary">
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="display-italic text-[clamp(1.7rem,3.4vw,2.4rem)]">Plans</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/pricing">
              Compare plans <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={cn(
                "panel flex flex-col p-6",
                p.highlight && "border-primary/40 glow-lime",
              )}
            >
              {p.highlight && (
                <span className="mb-3 self-start eyebrow text-primary">Recommended</span>
              )}
              <p className="eyebrow text-muted-foreground">{p.name}</p>
              <p className="mt-2 font-display text-3xl font-bold">
                {p.price}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.highlight ? "default" : "outline"}
                className="mt-6 rounded-full"
              >
                <Link to="/pricing">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-y border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="display-italic text-[clamp(1.7rem,3.4vw,2.4rem)]">Questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="glass flex flex-col items-center gap-5 p-10 text-center sm:p-16">
          <h2 className="display-italic max-w-2xl text-[clamp(1.9rem,4.4vw,3rem)]">
            Start building your <span className="text-primary">best routine</span> today.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Free to begin. Upgrade only when the routine already feels like yours.
          </p>
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full px-8 font-semibold tracking-wide glow-lime"
          >
            <Link to="/auth">
              START FREE <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Logo />
            <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
              <Link to="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
              <Link to="/coach" className="hover:text-foreground">
                AI Coach
              </Link>
              <a href="mailto:hello@veyra.app" className="hover:text-foreground">
                Contact
              </a>
            </nav>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Veyra provides general fitness, habit and grooming guidance only. It does not diagnose
            conditions, prescribe medication or replace professional medical care. For any medical
            concern, consult a qualified healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
