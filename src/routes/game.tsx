import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Flame, Gamepad2, Lock, Shield, Sparkles, Swords, Target, Trophy, Users, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { todayKey, useVeyra, xpForLevel } from "@/lib/veyra-store";

export const Route = createFileRoute("/game")({
  head: () => ({ meta: [
    { title: "Game Mode — Veyra" },
    { name: "description", content: "Turn your Veyra routine into quests, XP, ranks and achievements." },
  ] }),
  component: () => <AppShell><GameModePage /></AppShell>,
});

const RANKS = [
  { name: "Bronze", level: 1, icon: Shield, desc: "Your journey begins" },
  { name: "Silver", level: 6, icon: Swords, desc: "Consistency is forming" },
  { name: "Gold", level: 11, icon: Trophy, desc: "Strong routine unlocked" },
  { name: "Platinum", level: 31, icon: Crown, desc: "Elite consistency" },
];

function GameModePage() {
  const { state } = useVeyra();
  const today = state.completions[todayKey()] ?? [];
  const nextLevel = xpForLevel(state.currentLevel);
  const previousLevel = xpForLevel(Math.max(0, state.currentLevel - 1));
  const range = Math.max(1, nextLevel - previousLevel);
  const levelProgress = Math.max(0, Math.min(100, ((state.totalXp - previousLevel) / range) * 100));

  const quests = [
    { title: "Enter the Arena", detail: "Complete today's workout", reward: 200, done: today.includes("workout"), icon: Swords, href: "/workout" as const },
    { title: "Build the Streak", detail: "Complete a daily habit", reward: 20, done: today.length > 0, icon: Flame, href: "/habits" as const },
    { title: "Coach Mission", detail: "Ask AI Coach for your next mission", reward: 0, done: false, icon: Sparkles, href: "/coach" as const },
  ];
  const achievements = [
    { title: "First Step", detail: "Complete your first action", unlocked: state.totalXp > 0, icon: Target },
    { title: "On Fire", detail: "Reach a 3-day streak", unlocked: state.longestStreak >= 3, icon: Flame },
    { title: "Level Up", detail: "Reach Level 2", unlocked: state.currentLevel >= 2, icon: Zap },
    { title: "Gold Hunter", detail: "Reach Level 11", unlocked: state.currentLevel >= 11, icon: Trophy },
    { title: "Session Master", detail: "Complete 10 workout sessions", unlocked: state.sessions.length >= 10, icon: Swords },
    { title: "Consistency", detail: "Reach a 7-day best streak", unlocked: state.longestStreak >= 7, icon: Crown },
  ];

  return <>
    <PageHeader title="Game Mode" subtitle="Turn useful real-world actions into quests, XP, ranks and achievements." action={<Badge className="rounded-full px-3 py-1.5"><Gamepad2 className="mr-1.5 size-4" /> GAME ON</Badge>} />

    <section className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-purple-500/10 p-5 shadow-lg sm:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-primary"><Zap className="size-4" /> Player HUD</div>
          <div className="mt-3 flex flex-wrap items-end gap-3"><span className="text-5xl font-black tracking-tight">LVL {state.currentLevel}</span><Badge variant="secondary" className="mb-1 rounded-full">{state.currentRank}</Badge></div>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{Math.max(0, nextLevel - state.totalXp)} XP to your next level. Progress comes from consistency, not perfection.</p>
          <div className="mt-5"><div className="mb-2 flex justify-between text-xs font-semibold"><span>{state.totalXp} XP</span><span>{nextLevel} XP</span></div><Progress value={levelProgress} className="h-3" /></div>
          <div className="mt-5 flex flex-wrap gap-2"><Button asChild className="rounded-full"><Link to="/workout"><Swords className="mr-2 size-4" /> Start Quest</Link></Button><Button asChild variant="outline" className="rounded-full"><Link to="/habits">Daily Habits</Link></Button></div>
        </div>
        <div className="grid grid-cols-2 gap-3"><HudStat icon={Flame} label="Current streak" value={`${state.currentStreak}d`} /><HudStat icon={Trophy} label="Best streak" value={`${state.longestStreak}d`} /><HudStat icon={Swords} label="Sessions" value={`${state.sessions.length}`} /><HudStat icon={Zap} label="Total XP" value={`${state.totalXp}`} /></div>
      </div>
    </section>

    <section className="mt-7">
      <SectionTitle eyebrow="Daily quests" title="Today's mission board" trailing="Resets daily" />
      <div className="grid gap-3 lg:grid-cols-3">{quests.map((quest) => { const Icon = quest.icon; return <article key={quest.title} className={`rounded-3xl border p-5 transition-all ${quest.done ? "border-primary/50 bg-primary/10" : "border-border bg-card hover:border-primary/30"}`}>
        <div className="flex items-start justify-between gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Icon className="size-5" /></div><Badge variant={quest.done ? "default" : "outline"}>{quest.done ? "CLEARED" : quest.reward ? `+${quest.reward} XP` : "MISSION"}</Badge></div>
        <h3 className="mt-4 text-lg font-bold">{quest.title}</h3><p className="mt-1 text-sm text-muted-foreground">{quest.detail}</p>
        <Button asChild variant={quest.done ? "secondary" : "default"} className="mt-5 w-full rounded-full"><Link to={quest.href}>{quest.done ? "Review" : "Start mission"}</Link></Button>
      </article>; })}</div>
    </section>

    <section className="mt-7 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <SectionTitle eyebrow="Progression" title="Rank ladder" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{RANKS.map((rank) => { const Icon = rank.icon; const unlocked = state.currentLevel >= rank.level; return <div key={rank.name} className={`rounded-2xl border p-4 ${unlocked ? "border-primary/40 bg-primary/5" : "border-border opacity-60"}`}><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-secondary">{unlocked ? <Icon className="size-5 text-primary" /> : <Lock className="size-4" />}</div><div><p className="font-bold">{rank.name}</p><p className="text-xs text-muted-foreground">Level {rank.level} · {rank.desc}</p></div></div>{unlocked && <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary"><Check className="size-4" /> Unlocked</div>}</div>; })}</div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <SectionTitle eyebrow="Collection" title="Achievements" />
        <div className="mt-5 grid gap-2 sm:grid-cols-2">{achievements.map((item) => { const Icon = item.icon; return <div key={item.title} className={`rounded-2xl border p-3 ${item.unlocked ? "border-primary/40 bg-primary/5" : "border-border"}`}><div className="flex items-center gap-2"><Icon className={`size-4 ${item.unlocked ? "text-primary" : "text-muted-foreground"}`} /><span className="text-sm font-semibold">{item.title}</span></div><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p></div>; })}</div>
      </div>
    </section>

    <section className="mt-7 rounded-3xl border border-border bg-gradient-to-r from-card via-muted/40 to-card p-5 sm:p-6">
      <SectionTitle eyebrow="Game loop" title="Your Veyra progression" />
      <div className="mt-5 grid gap-3 sm:grid-cols-4"><LoopStep number="01" title="Choose" detail="Pick a quest" /><LoopStep number="02" title="Complete" detail="Do the real action" /><LoopStep number="03" title="Progress" detail="Build XP & streaks" /><LoopStep number="04" title="Unlock" detail="Reach new ranks" /></div>
    </section>

    <section className="mt-7 grid gap-4 sm:grid-cols-3">
      <QuickCard icon={Swords} title="Workout" detail="Train and earn progress" href="/workout" />
      <QuickCard icon={Target} title="Habits" detail="Clear today's habits" href="/habits" />
      <QuickCard icon={Sparkles} title="AI Coach" detail="Get your next mission" href="/coach" />
    </section>

    <div className="mt-7 flex items-center gap-3 rounded-3xl border border-border bg-muted/30 p-5"><Users className="size-5 shrink-0 text-primary" /><div><p className="font-semibold">Social-ready foundation</p><p className="text-sm text-muted-foreground">The UI is ready for future leaderboards, teams and challenges without pretending those features exist yet.</p></div></div>
    <SafetyNote>Game Mode is a motivation layer for general wellness. XP, ranks and streaks are not a measure of health, fitness level or personal worth. Missing a day does not mean you failed.</SafetyNote>
  </>;
}

function SectionTitle({ eyebrow, title, trailing }: { eyebrow: string; title: string; trailing?: string }) { return <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.18em] text-primary">{eyebrow}</p><h2 className="mt-1 text-xl font-bold">{title}</h2></div>{trailing && <span className="text-xs text-muted-foreground">{trailing}</span>}</div>; }
function HudStat({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) { return <div className="rounded-2xl border border-border bg-background/50 p-3"><Icon className="size-4 text-primary" /><p className="mt-2 text-xl font-black">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>; }
function LoopStep({ number, title, detail }: { number: string; title: string; detail: string }) { return <div className="rounded-2xl border border-border bg-background/60 p-4"><span className="text-xs font-black text-primary">{number}</span><p className="mt-2 font-bold">{title}</p><p className="text-xs text-muted-foreground">{detail}</p></div>; }
function QuickCard({ icon: Icon, title, detail, href }: { icon: typeof Flame; title: string; detail: string; href: "/workout" | "/habits" | "/coach" }) { return <Button asChild variant="outline" className="h-auto justify-start rounded-3xl p-4 text-left"><Link to={href}><Icon className="mr-3 size-5 shrink-0 text-primary" /><span><span className="block font-bold">{title}</span><span className="block text-xs font-normal text-muted-foreground">{detail}</span></span></Link></Button>; }
