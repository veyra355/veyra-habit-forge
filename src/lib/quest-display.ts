import type { Achievement, Quest } from "@/lib/game-system";
import type { GameAchievement, GameQuest } from "@/lib/use-game";

export type { GameAchievement, GameQuest };

/** Maps a database quest onto the visual categories used by QuestCard. */
export function questCategory(quest: GameQuest): Quest["category"] {
  const haystack = `${quest.key} ${quest.title}`.toLowerCase();
  if (haystack.includes("workout") || haystack.includes("train")) return "workout";
  if (haystack.includes("sleep")) return "sleep";
  if (haystack.includes("hydrat") || haystack.includes("meal") || haystack.includes("nutri"))
    return "nutrition";
  if (haystack.includes("focus") || haystack.includes("mind") || haystack.includes("breath"))
    return "meditation";
  return "habit";
}

export function toQuestCardModel(quest: GameQuest): Quest {
  return {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    xpReward: quest.xp,
    type: quest.period === "weekly" ? "weekly" : "daily",
    category: questCategory(quest),
    completed: quest.completed,
  };
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  xp: "⚡",
  level: "🔷",
  streak: "🔥",
  rank_ups: "👑",
  workouts: "🏋️",
  habits_done: "✅",
};

export function toAchievementCardModel(achievement: GameAchievement): Achievement {
  return {
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    icon: ACHIEVEMENT_ICONS[achievement.metric] ?? "🏆",
    xpReward: 0,
    ...(achievement.unlockedAt ? { unlockedAt: achievement.unlockedAt } : {}),
  };
}
