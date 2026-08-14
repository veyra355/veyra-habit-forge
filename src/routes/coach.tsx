import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { askCoach } from "@/lib/coach.functions";
import { weekStats } from "@/lib/stats";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Your AI Coach — Veyra" },
      { name: "description", content: "Ask your Veyra coach for today's workout, a shorter session, a weekly routine or a simple grooming plan." },
      { property: "og:title", content: "Your AI Coach — Veyra" },
      { property: "og:description", content: "Guidance built on your goals, history and feedback." },
    ],
  }),
  component: () => (
    <AppShell>
      <CoachPage />
    </AppShell>
  ),
});

const PROMPTS = [
  "Create today's workout.",
  "Make today's workout shorter.",
  "Help me stay consistent this week.",
  "What should I focus on today?",
  "Build my weekly routine.",
  "Suggest a simple grooming routine.",
];

function CoachPage() {
  const { state, update } = useVeyra();
  const ask = useServerFn(askCoach);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const week = weekStats(state);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, pending]);

  const send = async (text: string) => {
    if (!text.trim() || pending) return;
    const userMsg = { id: `u-${Date.now()}`, role: "user" as const, content: text.trim() };
    update({ messages: [...state.messages, userMsg] });
    setInput("");
    setPending(true);
    try {
      const res = await ask({
        data: {
          message: text.trim(),
          context: {
            name: state.user?.name,
            goals: state.onboarding?.goals,
            level: state.onboarding?.level,
            place: state.onboarding?.place,
            duration: state.onboarding?.duration,
            daysPerWeek: state.onboarding?.daysPerWeek,
            diet: state.onboarding?.diet,
            habitCompletionRate: week.habitPct,
            recentWorkouts: state.sessions.slice(0, 5).map((s) => ({
              title: s.title,
              date: s.date,
              feedback: s.feedback,
            })),
          },
        },
      });
      update({
        messages: [...state.messages, userMsg, { id: `c-${Date.now()}`, role: "coach", content: res.reply }],
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <PageHeader title="Your AI Coach" subtitle="Built on your profile, goals, history and session feedback." />

      <div className="panel flex h-[62vh] min-h-[420px] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {!state.messages.length && (
            <div className="mx-auto max-w-md py-8 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <Sparkles className="size-5" />
              </span>
              <p className="mt-4 text-sm font-medium">How can I help today?</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Ask for a session, a schedule or a routine. I&apos;ll keep it realistic and doable.
              </p>
            </div>
          )}
          {state.messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/60 text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                Coach is thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <Input placeholder="Ask your coach…" value={input} onChange={(e) => setInput(e.target.value)} />
            <Button type="submit" size="icon" disabled={pending} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>

      <SafetyNote>
        Your coach gives general fitness, habit and grooming guidance. It does not diagnose conditions, prescribe
        medication, or recommend extreme diets or excessive training. For symptoms, injuries, medication or
        treatment questions, please consult a qualified healthcare professional.
      </SafetyNote>
    </>
  );
}
