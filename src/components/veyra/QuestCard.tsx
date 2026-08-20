import { CheckCircle2, Circle } from "lucide-react";
import type { Quest } from "@/lib/game-system";

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
}

export function QuestCard({ quest, onComplete }: QuestCardProps) {
  const categoryIcons: Record<string, string> = {
    habit: "⭐",
    workout: "💪",
    nutrition: "🥗",
    sleep: "😴",
    meditation: "🧘",
  };

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
        quest.completed
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/80 cursor-pointer"
      }`}
      onClick={() => !quest.completed && onComplete(quest.id)}
    >
      <div className="flex-shrink-0 pt-1">
        {quest.completed ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        ) : (
          <Circle className="w-6 h-6 text-slate-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{categoryIcons[quest.category]}</span>
          <h3
            className={`font-semibold ${quest.completed ? "text-emerald-400 line-through" : "text-slate-100"}`}
          >
            {quest.title}
          </h3>
        </div>
        <p className="text-sm text-slate-400">{quest.description}</p>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-bold text-yellow-400">+{quest.xpReward}</div>
        <div className="text-xs text-slate-400">XP</div>
      </div>
    </div>
  );
}
