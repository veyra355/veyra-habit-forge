import { Shield, Zap, Lock, Trophy, SmartphoneOff, Moon, Users, Wind, ChevronRight, Sparkles } from "lucide-react";

export function RecoveryHub({ pornStreak, masturbationStreak }: { pornStreak: number; masturbationStreak: number }) {
  const milestones = [3, 7, 14, 30, 60, 90];
  const longest = Math.max(pornStreak, masturbationStreak);
  const next = milestones.find((m) => m > longest) ?? 90;
  const progress = Math.min(100, (longest / next) * 100);

  return (
    <section id="recovery" className="relative mt-4 overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-black via-zinc-950 to-primary/10 p-4 shadow-2xl sm:p-6">
      <div className="pointer-events-none absolute -left-24 top-10 size-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-red-500/15 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-primary"><Shield className="size-4" /> Recovery Mode</div>
          <h2 className="display-italic mt-2 text-3xl sm:text-4xl">Train your discipline.</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">A private space for healthier routines, streaks and self-awareness. Progress matters more than perfection.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-primary/20 bg-black/60 p-4 shadow-[0_0_30px_rgba(220,30,45,.08)]"><p className="text-xs text-muted-foreground">Digital habit streak</p><p className="mt-1 text-3xl font-black text-primary">{pornStreak}<span className="ml-1 text-sm font-semibold">days</span></p></div>
            <div className="rounded-2xl border border-primary/20 bg-black/60 p-4 shadow-[0_0_30px_rgba(220,30,45,.08)]"><p className="text-xs text-muted-foreground">Personal goal streak</p><p className="mt-1 text-3xl font-black text-primary">{masturbationStreak}<span className="ml-1 text-sm font-semibold">days</span></p></div>
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-black/50 p-4">
            <div className="flex items-center justify-between text-xs"><span className="font-semibold">Next milestone: {next} days</span><span className="text-muted-foreground">{longest}/{next}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(220,30,45,.8)] transition-all duration-700" style={{ width: `${progress}%` }} /></div>
            <p className="mt-2 text-xs text-muted-foreground">Milestones: {milestones.join(" · ")} days</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm [perspective:1000px]">
          <div className="absolute inset-x-8 bottom-1 h-10 rounded-full bg-primary/30 blur-2xl" />
          <div className="group relative flex min-h-[360px] items-end justify-center overflow-hidden rounded-[2rem] border border-primary/35 bg-[radial-gradient(circle_at_50%_25%,rgba(220,30,45,.28),transparent_38%),linear-gradient(180deg,#171717,#050505)] shadow-[0_0_45px_rgba(220,30,45,.16)] [transform:rotateY(-5deg)] transition-transform duration-500 hover:[transform:rotateY(0deg)_scale(1.015)]">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,.08)_48%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-primary/30 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary"><Sparkles className="size-3" /> 3D Guardian</div>
            <div className="absolute bottom-4 left-4 right-4 z-10 rounded-2xl border border-white/10 bg-black/65 p-3 text-center backdrop-blur-md"><p className="text-sm font-bold">Keep moving forward.</p><p className="mt-0.5 text-[11px] text-muted-foreground">Your streak is one part of the journey.</p></div>
            <img src="/veyra-mascot-3d.svg" alt="Veyra warrior guardian mascot" className="relative z-0 h-[350px] w-auto origin-bottom drop-shadow-[0_0_35px_rgba(220,30,45,.42)] transition-transform duration-500 group-hover:scale-[1.04]" />
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RecoveryMethod icon={<SmartphoneOff />} title="Remove triggers" text="Use device controls and make distracting content harder to reach." />
        <RecoveryMethod icon={<Moon />} title="Protect your night" text="Keep the phone away from your bed and create a calm wind-down routine." />
        <RecoveryMethod icon={<Wind />} title="Ride the urge" text="Pause, breathe, change your environment and give yourself time to choose." />
        <RecoveryMethod icon={<Users />} title="Get support" text="If a habit feels difficult to control, talk to a trusted person or qualified counsellor." />
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-sm font-bold"><Trophy className="size-4 text-primary" /> Streak rewards</div>
          <p className="mt-1 text-xs text-muted-foreground">3d +30 XP · 7d +70 XP · 14d +150 XP · 30d +350 XP · 90d +1000 XP</p>
        </div>
        <div className="rounded-2xl border border-border bg-black/40 p-4">
          <div className="flex items-center gap-2 text-sm font-bold"><Zap className="size-4 text-primary" /> Track your changes</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Notice your own patterns in sleep, focus, mood, energy and workout consistency. Changes vary from person to person and are not guaranteed by a streak.</p>
        </div>
      </div>

      <div className="relative mt-4 rounded-2xl border border-border bg-muted/20 p-4">
        <div className="flex items-start gap-3"><Lock className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-sm font-semibold">Private by default</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Recovery check-ins are personal. Veyra should never place this information on public profiles, leaderboards or friend feeds.</p></div></div>
      </div>
    </section>
  );
}

function RecoveryMethod({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="group rounded-2xl border border-border bg-black/35 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30"><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span><span className="text-sm font-bold">{title}</span></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p><ChevronRight className="mt-2 size-3 text-primary opacity-60 transition-transform group-hover:translate-x-1" /></div>;
}
