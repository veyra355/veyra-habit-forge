import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Onboarding = {
  ageRange: string;
  experience: string;
  location: string;
  equipment: string[];
  daysPerWeek: string;
  workoutTime: string;
  goals: string[];
  sleepSchedule: string;
  activityLevel: string;
  workSchedule: string;
  timePerDay: string;
  diet: string;
  place: string;
  level: string;
  duration: string;
};

export type VeyraUser = {
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "starter" | "pro" | "elite";
  joinedAt: string;
};

export type WorkoutSession = {
  id: string;
  date: string;
  title: string;
  feedback: "easy" | "good" | "challenging" | "too_difficult" | null;
};

export type HabitDefinition = { id: string; name: string; custom?: boolean };

export type ChatMessage = { id: string; role: "user" | "coach"; content: string };

export type VeyraState = {
  user: VeyraUser | null;
  onboarding: Onboarding | null;
  habits: HabitDefinition[];
  completions: Record<string, string[]>;
  sessions: WorkoutSession[];
  completedExercises: string[];
  messages: ChatMessage[];
  theme: "dark" | "light";
  notifications: { workout: boolean; habits: boolean; weekly: boolean };
  privacy: { analytics: boolean; personalization: boolean };
  totalXp: number;
  currentLevel: number;
  currentRank: string;
  currentStreak: number;
  longestStreak: number;
};

export const DEFAULT_HABITS: HabitDefinition[] = [
  { id: "workout", name: "Workout" },
  { id: "sleep", name: "Sleep routine" },
  { id: "hydration", name: "Hydration" },
  { id: "grooming", name: "Personal grooming" },
  { id: "movement", name: "Movement" },
  { id: "focus", name: "Study/work focus" },
];

const HABIT_XP: Record<string, number> = {
  workout: 100,
  sleep: 30,
  hydration: 20,
  grooming: 25,
  movement: 20,
  focus: 30,
};

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const dayKey = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

export function xpForLevel(level: number) {
  return 25 * level ** 2;
}

export function levelFromXp(xp: number) {
  let level = 1;
  while (xp >= xpForLevel(level) && level < 100) level += 1;
  return level;
}

export function rankFromLevel(level: number) {
  if (level >= 31) return "Platinum";
  if (level >= 11) return "Gold";
  return "Bronze";
}

function streaks(completions: Record<string, string[]>) {
  let current = 0;
  for (let i = 0; i < 365; i += 1) {
    if ((completions[dayKey(i)] ?? []).length === 0) break;
    current += 1;
  }

  let longest = 0;
  let run = 0;
  for (let i = 364; i >= 0; i -= 1) {
    if ((completions[dayKey(i)] ?? []).length > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }
  return { current, longest };
}

function withProgress(state: VeyraState, totalXp: number, completions = state.completions): VeyraState {
  const level = levelFromXp(Math.max(0, totalXp));
  const streak = streaks(completions);
  return {
    ...state,
    totalXp: Math.max(0, totalXp),
    currentLevel: level,
    currentRank: rankFromLevel(level),
    currentStreak: streak.current,
    longestStreak: Math.max(state.longestStreak, streak.longest),
  };
}

function seedCompletions(habits: HabitDefinition[]) {
  const seeded: Record<string, string[]> = {};
  for (let i = 1; i <= 27; i++) {
    const pool = habits.filter(() => Math.random() > 0.32).map((h) => h.id);
    seeded[dayKey(i)] = pool;
  }
  return seeded;
}

function seedSessions(): WorkoutSession[] {
  const titles = ["Full Body Strength", "Mobility Flow", "Upper Body Push", "Conditioning Circuit"];
  const feedback: WorkoutSession["feedback"][] = ["good", "challenging", "easy", "good"];
  return [2, 4, 7, 9].map((offset, i) => ({
    id: `seed-${i}`,
    date: dayKey(offset),
    title: titles[i]!,
    feedback: feedback[i]!,
  }));
}

const STORAGE_KEY = "veyra-state-v2";

const initialState: VeyraState = {
  user: null,
  onboarding: null,
  habits: DEFAULT_HABITS,
  completions: {},
  sessions: [],
  completedExercises: [],
  messages: [],
  theme: "dark",
  notifications: { workout: true, habits: true, weekly: true },
  privacy: { analytics: true, personalization: true },
  totalXp: 0,
  currentLevel: 1,
  currentRank: "Bronze",
  currentStreak: 0,
  longestStreak: 0,
};

type Ctx = {
  state: VeyraState;
  hydrated: boolean;
  update: (patch: Partial<VeyraState>) => void;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  toggleHabit: (id: string, date?: string) => void;
  addHabit: (name: string) => void;
  removeHabit: (id: string) => void;
  completeWorkout: (title: string, feedback: WorkoutSession["feedback"]) => void;
  toggleExercise: (id: string) => void;
};

const VeyraContext = createContext<Ctx | null>(null);

export function VeyraProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VeyraState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<VeyraState>;
        setState({ ...initialState, ...saved, habits: saved.habits?.length ? saved.habits : DEFAULT_HABITS });
      }
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme, hydrated]);

  const update = useCallback((patch: Partial<VeyraState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const signIn = useCallback((name: string, email: string) => {
    setState((prev) => ({
      ...prev,
      user: {
        name,
        email,
        role: email.trim().toLowerCase().startsWith("admin") ? "admin" : "user",
        plan: prev.user?.plan ?? "free",
        joinedAt: prev.user?.joinedAt ?? new Date().toISOString(),
      },
      habits: prev.habits.length ? prev.habits : DEFAULT_HABITS,
      completions: Object.keys(prev.completions).length
        ? prev.completions
        : seedCompletions(prev.habits.length ? prev.habits : DEFAULT_HABITS),
      sessions: prev.sessions.length ? prev.sessions : seedSessions(),
    }));
  }, []);

  const signOut = useCallback(() => {
    setState((prev) => ({ ...initialState, theme: prev.theme }));
  }, []);

  const toggleHabit = useCallback((id: string, date = todayKey()) => {
    setState((prev) => {
      const list = prev.completions[date] ?? [];
      const wasDone = list.includes(id);
      const next = wasDone ? list.filter((h) => h !== id) : [...list, id];
      const delta = (HABIT_XP[id] ?? 20) * (wasDone ? -1 : 1);
      return withProgress(prev, prev.totalXp + delta, { ...prev.completions, [date]: next });
    });
  }, []);

  const addHabit = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      habits: [
        ...prev.habits,
        { id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, name, custom: true },
      ],
    }));
  }, []);

  const removeHabit = useCallback((id: string) => {
    setState((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }));
  }, []);

  const completeWorkout = useCallback((title: string, feedback: WorkoutSession["feedback"]) => {
    setState((prev) => {
      const date = todayKey();
      const completedToday = prev.completions[date] ?? [];
      const alreadyDone = completedToday.includes("workout");
      const completions = {
        ...prev.completions,
        [date]: Array.from(new Set([...completedToday, "workout"])),
      };
      const next = {
        ...prev,
        sessions: [{ id: `s-${Date.now()}`, date, title, feedback }, ...prev.sessions],
        completions,
      };
      return withProgress(next, prev.totalXp + (alreadyDone ? 0 : HABIT_XP.workout + 100), completions);
    });
  }, []);

  const toggleExercise = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      completedExercises: prev.completedExercises.includes(id)
        ? prev.completedExercises.filter((e) => e !== id)
        : [...prev.completedExercises, id],
    }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      state,
      hydrated,
      update,
      signIn,
      signOut,
      toggleHabit,
      addHabit,
      removeHabit,
      completeWorkout,
      toggleExercise,
    }),
    [state, hydrated, update, signIn, signOut, toggleHabit, addHabit, removeHabit, completeWorkout, toggleExercise],
  );

  return <VeyraContext.Provider value={value}>{children}</VeyraContext.Provider>;
}

export function useVeyra() {
  const ctx = useContext(VeyraContext);
  if (!ctx) throw new Error("useVeyra must be used inside VeyraProvider");
  return ctx;
}
