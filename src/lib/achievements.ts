import type { VeyraState } from "./veyra-store";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name, resolved in the UI layer
  isUnlocked: (ctx: AchievementContext) => boolean;
};

export type AchievementContext = {
  state: VeyraState;
  totalHabitCompletions: number;
  academyVisitedCount: number;
};

export const ACADEMY_VISITED_KEY = "veyra-academy-visited";

export function markAcademyVisited(exerciseId: string) {
  try {
    const raw = window.localStorage.getItem(ACADEMY_VISITED_KEY);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    set.add(exerciseId);
    window.localStorage.setItem(ACADEMY_VISITED_KEY, JSON.stringify([...set]));
  } catch {
    // ignore storage errors
  }
}

export function getAcademyVisitedCount(): number {
  try {
    const raw = window.localStorage.getItem(ACADEMY_VISITED_KEY);
    return raw ? (JSON.parse(raw) as string[]).length : 0;
  } catch {
    return 0;
  }
}

export function countHabitCompletions(completions: VeyraState["completions"]): number {
  return Object.values(completions).reduce((sum, day) => sum + day.length, 0);
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-quest",
    title: "First Quest",
    description: "Complete your very first quest or habit.",
    icon: "Sparkles",
    isUnlocked: (c) => c.state.totalXp > 0,
  },
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Earn your first 100 XP.",
    icon: "Zap",
    isUnlocked: (c) => c.state.totalXp >= 100,
  },
  {
    id: "consistency",
    title: "Consistency",
    description: "Reach a 3-day streak.",
    icon: "Flame",
    isUnlocked: (c) => c.state.currentStreak >= 3,
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Reach a 7-day streak.",
    icon: "CalendarCheck",
    isUnlocked: (c) => c.state.currentStreak >= 7 || c.state.longestStreak >= 7,
  },
  {
    id: "habit-builder",
    title: "Habit Builder",
    description: "Complete habits 5 times in total.",
    icon: "SquareCheckBig",
    isUnlocked: (c) => c.totalHabitCompletions >= 5,
  },
  {
    id: "exercise-explorer",
    title: "Exercise Explorer",
    description: "Open 3 different lessons in the Exercise Academy.",
    icon: "Dumbbell",
    isUnlocked: (c) => c.academyVisitedCount >= 3,
  },
  {
    id: "academy-graduate",
    title: "Academy Graduate",
    description: "Open every exercise currently in the Academy.",
    icon: "GraduationCap",
    isUnlocked: (c) => c.academyVisitedCount >= 6,
  },
  {
    id: "level-up",
    title: "Level Up",
    description: "Reach level 3.",
    icon: "Trophy",
    isUnlocked: (c) => c.state.currentLevel >= 3,
  },
  {
    id: "dedicated",
    title: "Dedicated",
    description: "Reach a 14-day streak at your peak.",
    icon: "Award",
    isUnlocked: (c) => c.state.longestStreak >= 14,
  },
];

export function getAchievementContext(state: VeyraState): AchievementContext {
  return {
    state,
    totalHabitCompletions: countHabitCompletions(state.completions),
    academyVisitedCount: getAcademyVisitedCount(),
  };
}
