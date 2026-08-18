import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Onboarding = {
  ageRange: string; experience: string; location: string; equipment: string[]; daysPerWeek: string; workoutTime: string;
  goals: string[]; sleepSchedule: string; activityLevel: string; workSchedule: string; timePerDay: string;
  diet: string; place: string; level: string; duration: string;
};
export type VeyraUser = { id: string; name: string; email: string; role: "user" | "admin"; plan: "free" | "starter" | "pro" | "elite"; joinedAt: string };
export type WorkoutSession = { id: string; date: string; title: string; feedback: "easy" | "good" | "challenging" | "too_difficult" | null };
export type HabitDefinition = { id: string; name: string; custom?: boolean };
export type ChatMessage = { id: string; role: "user" | "coach"; content: string };
export type VeyraState = {
  user: VeyraUser | null; onboarding: Onboarding | null; habits: HabitDefinition[]; completions: Record<string, string[]>;
  sessions: WorkoutSession[]; completedExercises: string[]; messages: ChatMessage[]; theme: "dark" | "light";
  notifications: { workout: boolean; habits: boolean; weekly: boolean }; privacy: { analytics: boolean; personalization: boolean };
};
export const DEFAULT_HABITS: HabitDefinition[] = [
  { id: "workout", name: "Workout" }, { id: "sleep", name: "Sleep routine" }, { id: "hydration", name: "Hydration" },
  { id: "grooming", name: "Personal grooming" }, { id: "movement", name: "Movement" }, { id: "focus", name: "Study/work focus" },
];
export const todayKey = () => new Date().toISOString().slice(0, 10);
const STORAGE_KEY = "veyra-ui-state-v2";
const initialState: VeyraState = { user: null, onboarding: null, habits: DEFAULT_HABITS, completions: {}, sessions: [], completedExercises: [], messages: [], theme: "dark", notifications: { workout: true, habits: true, weekly: true }, privacy: { analytics: true, personalization: true } };

type Ctx = VeyraState & { hydrated: boolean; update: (patch: Partial<VeyraState>) => void; signIn: (email: string, password: string) => Promise<{ error?: string; needsOnboarding?: boolean }>; signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>; signInWithGoogle: () => Promise<{ error?: string }>; signOut: () => Promise<void>; toggleHabit: (id: string, date?: string) => Promise<void>; addHabit: (name: string) => Promise<void>; removeHabit: (id: string) => Promise<void>; completeWorkout: (title: string, feedback: WorkoutSession["feedback"]) => Promise<void>; toggleExercise: (id: string) => void };
const VeyraContext = createContext<Ctx | null>(null);

async function loadUser(userId: string, fallbackEmail = "") {
  const { data: profile } = await (supabase as any).from("profiles").select("*").eq("id", userId).maybeSingle();
  const { data: habits } = await (supabase as any).from("habits").select("id,name,custom").eq("user_id", userId).order("created_at");
  const { data: completions } = await (supabase as any).from("habit_completions").select("habit_id,completed_on").eq("user_id", userId);
  const { data: sessions } = await (supabase as any).from("workout_sessions").select("id,workout_title,session_date,feedback").eq("user_id", userId).order("session_date", { ascending: false });
  const grouped: Record<string, string[]> = {};
  (completions ?? []).forEach((c: any) => { (grouped[c.completed_on] ??= []).push(c.habit_id); });
  return {
    user: { id: userId, name: profile?.name || fallbackEmail.split("@")[0] || "Friend", email: profile?.email || fallbackEmail, role: profile?.role === "admin" ? "admin" : "user", plan: profile?.plan || "free", joinedAt: profile?.created_at || new Date().toISOString() } as VeyraUser,
    onboarding: (profile?.onboarding as Onboarding | null) ?? null,
    habits: (habits?.length ? habits : DEFAULT_HABITS) as HabitDefinition[],
    completions: grouped,
    sessions: (sessions ?? []).map((s: any) => ({ id: s.id, date: s.session_date, title: s.workout_title, feedback: s.feedback })),
  };
}

export function VeyraProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VeyraState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  const applyUser = useCallback(async (userId: string, email = "") => {
    const data = await loadUser(userId, email);
    setState(prev => ({ ...prev, ...data }));
    return data;
  }, []);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setState(prev => ({ ...prev, ...(JSON.parse(raw) as Partial<VeyraState>), user: null })); } catch { /* ignore */ }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => { if (mounted && data.session) await applyUser(data.session.user.id, data.session.user.email ?? ""); if (mounted) setHydrated(true); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (session) void applyUser(session.user.id, session.user.email ?? ""); else setState(prev => ({ ...initialState, theme: prev.theme })); });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [applyUser]);

  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: state.theme, notifications: state.notifications, privacy: state.privacy })); }, [state.theme, state.notifications, state.privacy, hydrated]);
  useEffect(() => { if (hydrated) document.documentElement.classList.toggle("dark", state.theme === "dark"); }, [state.theme, hydrated]);
  const update = useCallback((patch: Partial<VeyraState>) => setState(prev => ({ ...prev, ...patch })), []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    if (data.user) { const loaded = await applyUser(data.user.id, data.user.email ?? email); return { needsOnboarding: !loaded.onboarding }; }
    return {};
  }, [applyUser]);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() } } });
    if (error) return { error: error.message };
    if (data.user && data.session) await applyUser(data.user.id, email);
    return {};
  }, [applyUser]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth` } });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => { await supabase.auth.signOut(); setState(prev => ({ ...initialState, theme: prev.theme })); }, []);

  const toggleHabit = useCallback(async (id: string, date = todayKey()) => {
    if (!state.user) return;
    const existing = state.completions[date]?.includes(id);
    if (existing) await (supabase as any).from("habit_completions").delete().eq("user_id", state.user.id).eq("habit_id", id).eq("completed_on", date);
    else await (supabase as any).from("habit_completions").insert({ user_id: state.user.id, habit_id: id, completed_on: date });
    setState(prev => { const list = prev.completions[date] ?? []; return { ...prev, completions: { ...prev.completions, [date]: existing ? list.filter(x => x !== id) : [...list, id] } }; });
  }, [state.user, state.completions]);

  const addHabit = useCallback(async (name: string) => { if (!state.user || !name.trim()) return; const { data } = await (supabase as any).from("habits").insert({ user_id: state.user.id, name: name.trim(), custom: true }).select("id,name,custom").single(); if (data) setState(prev => ({ ...prev, habits: [...prev.habits, data] })); }, [state.user]);
  const removeHabit = useCallback(async (id: string) => { if (!state.user) return; await (supabase as any).from("habits").delete().eq("id", id).eq("user_id", state.user.id); setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) })); }, [state.user]);
  const completeWorkout = useCallback(async (title: string, feedback: WorkoutSession["feedback"]) => { if (!state.user) return; const { data } = await (supabase as any).from("workout_sessions").insert({ user_id: state.user.id, workout_title: title, feedback }).select("id,workout_title,session_date,feedback").single(); if (data) { const session = { id: data.id, date: data.session_date, title: data.workout_title, feedback: data.feedback }; setState(prev => ({ ...prev, sessions: [session, ...prev.sessions] })); const habit = prevHabit(state.habits, "workout"); if (habit) await toggleHabit("workout"); } }, [state.user, state.habits, toggleHabit]);
  const toggleExercise = useCallback((id: string) => setState(prev => ({ ...prev, completedExercises: prev.completedExercises.includes(id) ? prev.completedExercises.filter(e => e !== id) : [...prev.completedExercises, id] })), []);

  const value = useMemo(() => ({ ...state, hydrated, update, signIn, signUp, signInWithGoogle, signOut, toggleHabit, addHabit, removeHabit, completeWorkout, toggleExercise }), [state, hydrated, update, signIn, signUp, signInWithGoogle, signOut, toggleHabit, addHabit, removeHabit, completeWorkout, toggleExercise]);
  return <VeyraContext.Provider value={value}>{children}</VeyraContext.Provider>;
}
function prevHabit(habits: HabitDefinition[], name: string) { return habits.find(h => h.name.toLowerCase() === name); }
export function useVeyra() { const ctx = useContext(VeyraContext); if (!ctx) throw new Error("useVeyra must be used inside VeyraProvider"); return ctx; }
