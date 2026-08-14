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
  plan: "free" | "plus" | "pro";
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
  completions: Record<string, string[]>; // date -> habit ids
  sessions: WorkoutSession[];
  completedExercises: string[];
  messages: ChatMessage[];
  theme: "dark" | "light";
  notifications: { workout: boolean; habits: boolean; weekly: boolean };
  privacy: { analytics: boolean; personalization: boolean };
};

export const DEFAULT_HABITS: HabitDefinition[] = [
  { id: "workout", name: "Workout" },
  { id: "sleep", name: "Sleep routine" },
  { id: "hydration", name: "Hydration" },
  { id: "grooming", name: "Personal grooming" },
  { id: "movement", name: "Movement" },
  { id: "focus", name: "Study/work focus" },
];

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const dayKey = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

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

const STORAGE_KEY = "veyra-state-v1";

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
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as VeyraState) });
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
      const next = list.includes(id) ? list.filter((h) => h !== id) : [...list, id];
      return { ...prev, completions: { ...prev.completions, [date]: next } };
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
    setState((prev) => ({
      ...prev,
      sessions: [
        { id: `s-${Date.now()}`, date: todayKey(), title, feedback },
        ...prev.sessions,
      ],
      completions: {
        ...prev.completions,
        [todayKey()]: Array.from(new Set([...(prev.completions[todayKey()] ?? []), "workout"])),
      },
    }));
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
