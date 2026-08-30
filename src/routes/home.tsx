import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Flame, RotateCcw, ScrollText, Shield, Swords, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/veyra/AppShell";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "ShadowBreaker — Break the Chain" },
      {
        name: "description",
        content:
          "A cinematic warrior journey for quitting porn and masturbation addiction with streaks, daily rules, transformation cards, and strict mentor guidance.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <HomePage />
    </AppShell>
  ),
});

type TransformationDay = {
  day: number;
  title: string;
  body: string;
  mind: string;
  difficulty: string;
  command: string;
};

const STORAGE_KEY = "shadowbreaker-streak";

const transformationTimeline: TransformationDay[] = [
  {
    day: 1,
    title: "The Gate Opens",
    body: "Your nervous system expects the old reward loop. Energy may swing and urges can arrive in sharp waves.",
    mind: "The enemy tests your identity immediately: boredom, loneliness, stress, and late-night scrolling.",
    difficulty: "High because the pattern is fresh and familiar.",
    command: "Do not negotiate. Leave the room, breathe, hydrate, and move your body for five minutes.",
  },
  {
    day: 2,
    title: "Withdrawal Fog",
    body: "Sleep, focus, and mood may feel uneven as your brain begins adjusting to less artificial stimulation.",
    mind: "Your thoughts may exaggerate discomfort and tell you one reset will not matter. That is bait.",
    difficulty: "Heavy mental noise, especially when alone with a phone.",
    command: "Lock your devices down, keep doors open, and win the next hour like a soldier.",
  },
  {
    day: 3,
    title: "First Fire Trial",
    body: "Urges may spike. Your body is learning that tension does not need to end in the old behavior.",
    mind: "You may feel irritated, restless, or tempted to peek. Peeking is the ambush before defeat.",
    difficulty: "Very high. Day 3 often feels like a direct duel.",
    command: "Stand up instantly. Cold water on your face. Ten push-ups or a hard walk. Break the trance.",
  },
  {
    day: 4,
    title: "Discipline Forms",
    body: "Your baseline energy may start stabilizing in small windows. Cravings still attack in cycles.",
    mind: "You are building proof that an urge can rise and fall without controlling you.",
    difficulty: "Medium-high; overconfidence is dangerous.",
    command: "Keep the rule wall intact. No triggers, no secret browsing, no excuses after sunset.",
  },
  {
    day: 5,
    title: "The Shadow Bargains",
    body: "Restlessness can turn into physical tension. Training, walking, and sleep protect the streak.",
    mind: "The mind may bargain: just images, just a minute, just once. Every bargain is a chain.",
    difficulty: "High because temptation becomes clever instead of loud.",
    command: "Name the urge out loud, then execute your emergency ritual before thinking further.",
  },
  {
    day: 6,
    title: "Clearer Eyes",
    body: "Some users notice better morning energy and less drained feeling, though waves can still hit hard.",
    mind: "Confidence grows when you keep promises. Shame loses power when discipline is repeated.",
    difficulty: "Medium; danger comes from relaxing your guard.",
    command: "Review why you started. Write one sentence: I am not returning to the cage.",
  },
  {
    day: 7,
    title: "First Seal Broken",
    body: "A full week clean is a real nervous-system victory. Your body has endured discomfort without obeying it.",
    mind: "You now possess evidence. You are not powerless; you are trained by repeated choices.",
    difficulty: "Medium-high; celebration can become permission if you are careless.",
    command: "Honor the week with sleep, training, and clean surroundings. The war continues tomorrow.",
  },
  {
    day: 14,
    title: "Second Gate",
    body: "Focus and drive may improve as your reward system gets more room to respond to real life.",
    mind: "Old memories and fantasies may resurface. Treat them as passing weather, not commands.",
    difficulty: "Uneven; some days feel easy, then a sudden storm hits.",
    command: "Stay humble. Double down on blockers, accountability, and evening structure.",
  },
  {
    day: 30,
    title: "The Black Banner Falls",
    body: "Many people report stronger self-control, steadier mood, and more energy for training, work, and relationships.",
    mind: "Your identity is shifting from resisting temptation to living as someone who does not serve it.",
    difficulty: "Strategic; the enemy now waits for stress, secrecy, and pride.",
    command: "Build a life too strong for the old habit to fit inside it.",
  },
];

const dailyRules = [
  "No porn, no edging, no masturbation, no peeking. The line must be bright red.",
  "Phone never enters the bathroom or bed. Darkness plus privacy is the old battlefield.",
  "When an urge hits, move within ten seconds: walk, push-ups, cold water, or call an ally.",
  "Train your body daily, even briefly. A warrior burns pressure through action.",
  "Sleep before the weak hours. Late-night fatigue turns discipline into dust.",
  "If you fall, report honestly, reset immediately, and rebuild without self-pity.",
];

const scoldings = [
  "You dropped your blade. Do not dress defeat up as stress. Stand up, reset the count, and earn your honor back today.",
  "The shadow did not overpower you; you opened the gate. Close it. Clean your environment. Return to discipline now.",
  "No excuses. A warrior studies the failure, seals the weakness, and starts again before shame becomes another chain.",
];

function HomePage() {
  const { state } = useVeyra();
  const firstName = state.user?.name.split(" ")[0] ?? "Warrior";
  const [streak, setStreak] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [mentorMessage, setMentorMessage] = useState(
    "Eyes forward. Today you do not bargain with the shadow. You obey the code and protect the streak.",
  );

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
    setStreak(Number.isFinite(saved) ? saved : 0);
    if (!window.sessionStorage.getItem("shadowbreaker-intro-seen")) {
      setShowIntro(true);
      const timer = window.setTimeout(() => {
        setShowIntro(false);
        window.sessionStorage.setItem("shadowbreaker-intro-seen", "1");
      }, 5200);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const unlockedDays = useMemo(
    () => transformationTimeline.filter((item) => item.day <= Math.max(1, streak || 1)),
    [streak],
  );

  function addCleanDay() {
    setStreak((current) => {
      const next = current + 1;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      setMentorMessage(`Good. Day ${next} is claimed. Do not celebrate by lowering your guard.`);
      return next;
    });
  }

  function relapse() {
    const message = scoldings[Math.floor(Math.random() * scoldings.length)];
    setStreak(0);
    window.localStorage.setItem(STORAGE_KEY, "0");
    setMentorMessage(message);
  }

  return (
    <div className="relative overflow-hidden pb-10 text-slate-100">
      {showIntro && <OpeningCinematic />}

      <section className="relative overflow-hidden rounded-[2rem] border border-red-900/70 bg-black p-5 shadow-[0_0_60px_rgba(127,29,29,0.35)] sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(220,38,38,0.28),transparent_35%),linear-gradient(135deg,rgba(0,0,0,0.2),rgba(69,10,10,0.55))]" />
        <div className="absolute -right-16 top-6 h-64 w-64 rounded-full bg-red-700/20 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <Badge className="border border-red-500/40 bg-red-950/80 text-red-100 hover:bg-red-950/80">
              SHADOWBREAKER PROTOCOL
            </Badge>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">
              Break the chain. <span className="text-red-500">Claim the streak.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-red-100/75 sm:text-base">
              {firstName}, this is not a clinic dashboard. This is a warrior&apos;s ascent out of porn
              and masturbation addiction—one clean day, one hard choice, one locked gate at a time.
            </p>
            <div className="mt-6 grid max-w-xl grid-cols-2 gap-3">
              <RulePanel icon={Flame} label="Days Clean" value={`${streak}`} oversized />
              <RulePanel icon={Shield} label="Current Rank" value={streak >= 30 ? "Iron Will" : streak >= 7 ? "Gate Guard" : "Initiate"} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={addCleanDay} className="h-12 rounded-xl bg-red-700 px-6 font-black hover:bg-red-600">
                <Swords className="mr-2 size-5" /> Mark Clean Day
              </Button>
              <Button onClick={relapse} variant="outline" className="h-12 rounded-xl border-red-800 bg-black/60 font-black text-red-100 hover:bg-red-950">
                <RotateCcw className="mr-2 size-5" /> Relapse Reset
              </Button>
            </div>
          </div>
          <MentorCard message={mentorMessage} />
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-red-900/70 bg-zinc-950 p-5 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-red-500">
            <ScrollText className="size-4" /> Daily Rules
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase">The Code of No Return</h2>
          <div className="mt-5 space-y-3">
            {dailyRules.map((rule, index) => (
              <div key={rule} className="rounded-2xl border border-red-950 bg-black/70 p-4">
                <p className="text-sm font-black leading-6"><span className="mr-3 text-xl text-red-500">{index + 1}.</span>{rule}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-red-900/70 bg-zinc-950 p-5 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-red-500">
            <Zap className="size-4" /> Transformation Timeline
          </div>
          <h2 className="mt-2 text-2xl font-black uppercase">Unlocked Battle Cards</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {unlockedDays.map((item) => <TransformationCard key={item.day} item={item} />)}
          </div>
        </div>
      </section>

      <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs leading-5 text-amber-100/80">
        <AlertTriangle className="mr-2 inline size-4" /> ShadowBreaker is motivational habit support, not medical care. If compulsive sexual behavior is harming your life or you feel unsafe, contact a qualified mental health professional or local emergency support.
      </div>
    </div>
  );
}

function RulePanel({ icon: Icon, label, value, oversized = false }: { icon: typeof Flame; label: string; value: string; oversized?: boolean }) {
  return <div className="rounded-2xl border border-red-900/70 bg-black/75 p-4"><Icon className="size-5 text-red-500" /><p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-200/60">{label}</p><p className={oversized ? "text-5xl font-black text-red-500" : "text-2xl font-black"}>{value}</p></div>;
}

function MentorCard({ message }: { message: string }) {
  return <div className="relative min-h-[420px] overflow-hidden rounded-[1.75rem] border border-red-800 bg-gradient-to-b from-zinc-900 via-black to-red-950 p-5"><div className="absolute inset-0 opacity-60 [background-image:linear-gradient(115deg,transparent_0_42%,rgba(220,38,38,.25)_43%,transparent_44%),repeating-linear-gradient(100deg,rgba(255,255,255,.16)_0_1px,transparent_1px_14px)]" /><div className="relative mx-auto mt-4 h-64 w-44"><div className="absolute left-1/2 top-2 h-24 w-20 -translate-x-1/2 rounded-full bg-slate-100 shadow-[0_0_35px_rgba(255,255,255,.45)]" /><div className="absolute left-1/2 top-16 h-40 w-32 -translate-x-1/2 rounded-t-[4rem] border border-red-500/40 bg-zinc-800" /><div className="absolute left-9 top-24 h-28 w-5 rotate-12 rounded-full bg-zinc-700"><span className="absolute inset-x-1 top-5 h-14 rounded-full bg-red-700/70" /></div><div className="absolute right-9 top-24 h-28 w-5 -rotate-12 rounded-full bg-zinc-700"><span className="absolute inset-x-1 top-4 h-16 rounded-full bg-red-700/70" /></div><div className="absolute right-3 top-12 h-60 w-2 rotate-45 rounded-full bg-slate-300 shadow-[0_0_18px_rgba(255,255,255,.35)]" /><div className="absolute left-1/2 top-0 h-36 w-28 -translate-x-1/2 rounded-b-full bg-white/90 blur-[1px]" /></div><div className="relative rounded-2xl border border-red-800 bg-black/80 p-4"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-500">Sensei Kage · Rain Mentor</p><p className="mt-2 text-sm font-bold leading-6 text-red-50">“{message}”</p></div></div>;
}

function TransformationCard({ item }: { item: TransformationDay }) {
  return <article className="rounded-2xl border border-red-900 bg-black p-4 shadow-[inset_0_0_0_1px_rgba(239,68,68,.12)]"><div className="flex items-start justify-between gap-3"><Badge className="bg-red-700 text-white hover:bg-red-700">DAY {item.day}</Badge><span className="text-[10px] font-black uppercase tracking-widest text-red-300/60">Unlocked</span></div><h3 className="mt-3 text-lg font-black uppercase text-red-100">{item.title}</h3><div className="mt-3 space-y-2 text-xs leading-5 text-red-100/75"><p><b className="text-red-400">Body:</b> {item.body}</p><p><b className="text-red-400">Mind:</b> {item.mind}</p><p><b className="text-red-400">Difficulty:</b> {item.difficulty}</p><p className="rounded-xl border border-red-950 bg-red-950/35 p-3 font-black text-red-50">COMMAND: {item.command}</p></div></article>;
}

function OpeningCinematic() {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black text-white"><div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(127,29,29,.35),transparent_45%)]" /><div className="absolute bottom-0 h-2/3 w-full bg-[linear-gradient(to_top,rgba(127,29,29,.55),transparent),repeating-linear-gradient(90deg,rgba(255,255,255,.09)_0_1px,transparent_1px_90px)]" /><div className="relative flex flex-col items-center text-center"><div className="animate-in fade-in zoom-in duration-1000 rounded-3xl border border-red-700 bg-black/80 px-6 py-4 text-3xl font-black tracking-[0.28em] text-red-500 shadow-[0_0_80px_rgba(220,38,38,.45)]">SHADOWBREAKER</div><div className="mt-8 h-52 w-72 animate-in fade-in slide-in-from-bottom-8 duration-1000 rounded-t-full border-x-4 border-t-4 border-red-900 bg-gradient-to-b from-red-950 to-black"><div className="mx-auto mt-10 h-28 w-20 rounded-t-full bg-zinc-800 shadow-[0_-30px_70px_rgba(255,255,255,.2)]" /><div className="mx-auto mt-6 h-4 w-48 rounded bg-red-950" /><div className="mx-auto mt-4 h-4 w-60 rounded bg-red-950/80" /></div><p className="mt-8 max-w-sm animate-in fade-in duration-1000 text-2xl font-black uppercase tracking-wide">Are you ready to change your life?</p></div></div>;
}
