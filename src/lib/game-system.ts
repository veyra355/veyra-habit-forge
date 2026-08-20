/**
 * VEYRA GAME SYSTEM
 * Complete game mechanics for XP, Levels, Ranks, Achievement systems
 */

export type Rank =
  "STARTER" | "BUILDER" | "DISCIPLINED" | "FOCUSED" | "CONSISTENT" | "ELITE" | "MASTER" | "VEYRA";

export interface GameStats {
  totalXp: number;
  currentLevel: number;
  currentRank: Rank;
  currentStreak: number;
  longestStreak: number;
  dailyXp: number;
  weeklyXp: number;
  achievements: string[];
  questsCompleted: number;
  lastQuestDate: string | null;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: "daily" | "weekly";
  category: "habit" | "workout" | "nutrition" | "sleep" | "meditation";
  completed: boolean;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// XP CALCULATIONS
export const XP_PER_LEVEL: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  6: 1000,
  7: 1350,
  8: 1750,
  9: 2200,
  10: 2700,
};

export function calculateLevelFromXp(xp: number): number {
  if (xp < 100) return 1;
  return Math.floor(Math.sqrt(xp / 25)) + 1;
}

export function getXpRequiredForLevel(level: number): number {
  if (level <= 10) {
    return XP_PER_LEVEL[level] || 0;
  }
  return Math.floor((level - 1) * 500 + (level - 1) * (level - 1) * 50);
}

export function getProgressToNextLevel(currentXp: number): {
  current: number;
  total: number;
  percentage: number;
} {
  const currentLevel = calculateLevelFromXp(currentXp);
  const nextLevel = currentLevel + 1;
  const currentRequired = getXpRequiredForLevel(currentLevel);
  const nextRequired = getXpRequiredForLevel(nextLevel);
  const xpIntoLevel = currentXp - currentRequired;
  const xpForLevel = nextRequired - currentRequired;

  return {
    current: xpIntoLevel,
    total: xpForLevel,
    percentage: (xpIntoLevel / xpForLevel) * 100,
  };
}

// RANK SYSTEM
export function getRankFromLevel(level: number): Rank {
  if (level >= 76) return "VEYRA";
  if (level >= 51) return "MASTER";
  if (level >= 36) return "ELITE";
  if (level >= 21) return "CONSISTENT";
  if (level >= 11) return "FOCUSED";
  if (level >= 6) return "DISCIPLINED";
  if (level >= 2) return "BUILDER";
  return "STARTER";
}

export function getRankInfo(rank: Rank): { label: string; color: string; icon: string } {
  const ranks: Record<Rank, { label: string; color: string; icon: string }> = {
    STARTER: { label: "The Starter", color: "from-slate-500 to-slate-600", icon: "🌱" },
    BUILDER: { label: "The Builder", color: "from-blue-500 to-blue-600", icon: "🔨" },
    DISCIPLINED: { label: "The Disciplined", color: "from-cyan-500 to-blue-600", icon: "⚡" },
    FOCUSED: { label: "The Focused", color: "from-purple-500 to-pink-600", icon: "🎯" },
    CONSISTENT: { label: "The Consistent", color: "from-pink-500 to-rose-600", icon: "🔥" },
    ELITE: { label: "The Elite", color: "from-yellow-500 to-orange-600", icon: "👑" },
    MASTER: { label: "The Master", color: "from-orange-500 to-red-600", icon: "⚔️" },
    VEYRA: { label: "VEYRA", color: "from-violet-500 via-purple-500 to-pink-500", icon: "✨" },
  };
  return ranks[rank];
}

// DEFAULT QUESTS
export const DEFAULT_DAILY_QUESTS: Quest[] = [
  {
    id: "daily-workout",
    title: "Complete Today's Workout",
    description: "Finish your planned workout session",
    xpReward: 50,
    type: "daily",
    category: "workout",
    completed: false,
  },
  {
    id: "daily-habits",
    title: "Complete All Habits",
    description: "Finish all 6 of your daily habits",
    xpReward: 30,
    type: "daily",
    category: "habit",
    completed: false,
  },
  {
    id: "daily-hydration",
    title: "Stay Hydrated",
    description: "Drink water throughout the day",
    xpReward: 20,
    type: "daily",
    category: "nutrition",
    completed: false,
  },
  {
    id: "daily-sleep",
    title: "Sleep on Time",
    description: "Get 7-8 hours of quality sleep",
    xpReward: 25,
    type: "daily",
    category: "sleep",
    completed: false,
  },
  {
    id: "daily-meditation",
    title: "Meditate",
    description: "Complete a 10-minute meditation session",
    xpReward: 20,
    type: "daily",
    category: "meditation",
    completed: false,
  },
  {
    id: "daily-nutrition",
    title: "Log Your Meals",
    description: "Track your nutrition for the day",
    xpReward: 15,
    type: "daily",
    category: "nutrition",
    completed: false,
  },
];

export const DEFAULT_WEEKLY_QUESTS: Quest[] = [
  {
    id: "weekly-5workouts",
    title: "5 Workouts This Week",
    description: "Complete 5 workout sessions",
    xpReward: 100,
    type: "weekly",
    category: "workout",
    completed: false,
  },
  {
    id: "weekly-streak",
    title: "Maintain Your Streak",
    description: "Don't miss a single day this week",
    xpReward: 150,
    type: "weekly",
    category: "habit",
    completed: false,
  },
  {
    id: "weekly-consistency",
    title: "90% Consistency",
    description: "Complete 90% of your habits all week",
    xpReward: 120,
    type: "weekly",
    category: "habit",
    completed: false,
  },
];

// ACHIEVEMENTS
export const ACHIEVEMENTS: Achievement[] = [
  // Habit Achievements
  {
    id: "first-habit",
    title: "🌱 First Step",
    description: "Complete your first habit",
    icon: "🌱",
    xpReward: 10,
  },
  {
    id: "3day-streak",
    title: "🔥 On Fire",
    description: "Achieve a 3-day streak",
    icon: "🔥",
    xpReward: 25,
  },
  {
    id: "7day-streak",
    title: "⚡ Momentum",
    description: "Achieve a 7-day streak",
    icon: "⚡",
    xpReward: 50,
  },
  {
    id: "30day-streak",
    title: "🏆 Unstoppable",
    description: "Achieve a 30-day streak",
    icon: "🏆",
    xpReward: 150,
  },
  {
    id: "100day-streak",
    title: "👑 Legend",
    description: "Achieve a 100-day streak",
    icon: "👑",
    xpReward: 500,
  },
  // Workout Achievements
  {
    id: "first-workout",
    title: "💪 Starting Strong",
    description: "Complete your first workout",
    icon: "💪",
    xpReward: 15,
  },
  {
    id: "5-workouts",
    title: "🏃 Moving",
    description: "Complete 5 workouts",
    icon: "🏃",
    xpReward: 40,
  },
  {
    id: "25-workouts",
    title: "⚙️ Grinder",
    description: "Complete 25 workouts",
    icon: "⚙️",
    xpReward: 100,
  },
  {
    id: "100-workouts",
    title: "🚀 Beast Mode",
    description: "Complete 100 workouts",
    icon: "🚀",
    xpReward: 300,
  },
  // Level Achievements
  {
    id: "level-5",
    title: "📈 Rising",
    description: "Reach Level 5",
    icon: "📈",
    xpReward: 30,
  },
  {
    id: "level-10",
    title: "🎯 Double Digits",
    description: "Reach Level 10",
    icon: "🎯",
    xpReward: 75,
  },
  {
    id: "level-25",
    title: "⭐ Elite",
    description: "Reach Level 25",
    icon: "⭐",
    xpReward: 200,
  },
  {
    id: "level-50",
    title: "👑 Supreme",
    description: "Reach Level 50",
    icon: "👑",
    xpReward: 500,
  },
];

export function checkAndUnlockAchievements(
  gameStats: GameStats,
  newXp: number,
  streak: number,
  workoutCount: number,
): string[] {
  const unlocked: string[] = [];

  // Streak-based achievements
  if (streak >= 3 && !gameStats.achievements.includes("3day-streak")) unlocked.push("3day-streak");
  if (streak >= 7 && !gameStats.achievements.includes("7day-streak")) unlocked.push("7day-streak");
  if (streak >= 30 && !gameStats.achievements.includes("30day-streak"))
    unlocked.push("30day-streak");
  if (streak >= 100 && !gameStats.achievements.includes("100day-streak"))
    unlocked.push("100day-streak");

  // Level-based achievements
  const currentLevel = calculateLevelFromXp(newXp);
  if (currentLevel >= 5 && !gameStats.achievements.includes("level-5")) unlocked.push("level-5");
  if (currentLevel >= 10 && !gameStats.achievements.includes("level-10")) unlocked.push("level-10");
  if (currentLevel >= 25 && !gameStats.achievements.includes("level-25")) unlocked.push("level-25");
  if (currentLevel >= 50 && !gameStats.achievements.includes("level-50")) unlocked.push("level-50");

  // Workout-based achievements
  if (workoutCount >= 1 && !gameStats.achievements.includes("first-workout"))
    unlocked.push("first-workout");
  if (workoutCount >= 5 && !gameStats.achievements.includes("5-workouts"))
    unlocked.push("5-workouts");
  if (workoutCount >= 25 && !gameStats.achievements.includes("25-workouts"))
    unlocked.push("25-workouts");
  if (workoutCount >= 100 && !gameStats.achievements.includes("100-workouts"))
    unlocked.push("100-workouts");

  return unlocked;
}
