import { CheckCircle2, Circle } from "lucide-react";
import type { Quest } from "@/lib/game-system";

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  disabled?: boolean;
}

export function QuestCard({ quest, onComplete, disabled = false }: QuestCardProps) {
  const categoryIcons: Record<string, string> = {
    habit: "⭐",
    workout: "💪",
    nutrition: "🥗",
    sleep: "😴",
    meditation: "🧘",
  };
  const canComplete = !quest.completed && !disabled;

  return (
    <button
      type="button"
      disabled={!canComplete}
      aria-label={quest.completed ? `${quest.title} completed` : `Complete ${quest.title}`}
      className={`w-full text-left flex items-start gap-4 rounded-2xl border p-4 transition-all ${
        quest.completed
          ? "bg-emerald-500/10 border-emerald-500/30"
          : canComplete
            ? "bg-card border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
            : "bg-card border-border opacity-60 cursor-wait"
      }`}
      onClick={() => canComplete && onComplete(quest.id)}
    >
      <div className="flex-shrink-0 pt-1">
        {quest.completed ? <CheckCircle2 className="size-6 text-emerald-500" /> : <Circle className="size-6 text-muted-foreground" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2"><span className="text-lg">{categoryIcons[quest.category] ?? "⭐"}</span><h3 className={`font-semibold ${quest.completed ? "text-emerald-400 line-through" : "text-foreground"}`}>{quest.title}</h3></div>
        <p className="text-sm text-muted-foreground">{quest.description}</p>
      </div>
      <div className="flex-shrink-0 text-right"><div className="text-lg font-bold text-yellow-400">+{quest.xpReward}</div><div className="text-xs text-muted-foreground">XP</div></div>
    </button>
  );
}
