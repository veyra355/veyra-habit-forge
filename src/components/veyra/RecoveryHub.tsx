import { Shield, Zap, Lock, Trophy, SmartphoneOff, Moon, Dumbbell, Users, Wind, ChevronRight } from "lucide-react";

export function RecoveryHub({ pornStreak, masturbationStreak }: { pornStreak: number; masturbationStreak: number }) {
  const milestones = [3, 7, 14, 30, 60, 90];
  const longest = Math.max(pornStreak, masturbationStreak);
  const next = milestones.find((m) => m > longest) ?? 90;
  const progress = Math.min(100, (longest / next) * 100);

  return (
    <section id="recovery" className="relative mt-4 overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-background p-4 shadow-2xl sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-primary"><Shield className="size-4" /> Recovery Mode</div>
          <h2 className="display-italic mt-2 text-3xl sm:text-4xl">Train your discipline.</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">A private space to build healthier routines, understand triggers and keep your streak moving. Your goal is progress, not perfection.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-background/70 p-4"><p className="text-xs text-muted-foreground">Digital habit streak</p><p className="mt-1 text-3xl font-black text-primary">{pornStreak}<span className="ml-1 text-sm font-semibold">days</span></p></div>
            <div className="rounded-2xl border border-border bg-background/70 p-4"><p className="text-xs text-muted-foreground">Personal goal streak</p><p className="mt-1 text-3xl font-black text-primary">{masturbationStreak}<span className="ml-1 text-sm font-semibold">days</span></p></div>
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between text-xs"><span className="font-semibold">Next milestone: {next} days</span><span className="text-muted-foreground">{longest}/{next}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} /></div>
            <p className="mt-2 text-xs text-muted-foreground">Milestones: {milestones.join(" · ")} days</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-x-8 bottom-2 h-8 rounded-full bg-black/60 blur-xl" />
          <div className="relative flex min-h-[310px] items-end justify-center overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
            <div className="absolute right-4 top-4 rounded-full border border-primary/30 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">Veyra Guardian</div>
            <img src="/veyra-mascot-3d.svg" alt="Veyra warrior guardian mascot" className="h-[310px] w-auto drop-shadow-[0_0_28px_rgba(220,30,45,.35)] transition-transform duration-500 hover:scale-[1.03]" />
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RecoveryMethod icon={<SmartphoneOff />} title="Remove triggers" text="Use content filters and keep tempting apps/sites out of easy reach." />
        <RecoveryMethod icon={<Moon />} title="Protect your night" text="Keep the phone away from your bed and build a consistent wind-down routine." />
        <RecoveryMethod icon={<Wind />} title="Ride the urge" text="Pause, breathe, change rooms and give yourself a few minutes before acting." />
        <RecoveryMethod icon={<Users />} title="Get support" text="If the habit feels hard to control, talk to a trusted adult or qualified counsellor." />
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-sm font-bold"><Trophy className="size-4 text-primary" /> Streak rewards</div>
          <p className="mt-1 text-xs text-muted-foreground">3d +30 XP · 7d +70 XP · 14d +150 XP · 30d +350 XP · 90d +1000 XP</p>
        </div>
        <div className="rounded-2xl border border-border bg-background/60 p-4">
          <div className="flex items-center gap-2 text-sm font-bold"><Zap className="size-4 text-primary" /> What may improve</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Track your own changes in sleep, focus, mood, energy and workout consistency. These effects vary from person to person and are not guaranteed just from maintaining a streak.</p>
        </div>
      </div>

      <div className="relative mt-4 rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3"><Lock className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-sm font-semibold">Private by default</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Recovery check-ins are personal. Veyra should never put this information on public profiles, leaderboards or friend feeds.</p></div></div>
      </div>
    </section>
  );
}

function RecoveryMethod({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="group rounded-2xl border border-border bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30"><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span><span className="text-sm font-bold">{title}</span></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p><ChevronRight className="mt-2 size-3 text-primary opacity-60 transition-transform group-hover:translate-x-1" /></div>;
}
