import type { Session } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Onboarding = { ageRange: string; experience: string; location: string; equipment: string[]; daysPerWeek: string; workoutTime: string; goals: string[]; sleepSchedule: string; activityLevel: string; workSchedule: string; timePerDay: string; diet: string; place: string; level: string; duration: string };
export type VeyraUser = { name: string; email: string; role: "user" | "admin"; plan: "free" | "starter" | "pro" | "elite"; joinedAt: string };
export type WorkoutSession = { id: string; date: string; title: string; feedback: "easy" | "good" | "challenging" | "too_difficult" | null };
export type HabitDefinition = { id: string; name: string; custom?: boolean };
export type ChatMessage = { id: string; role: "user" | "coach"; content: string };
export type VeyraState = { user: VeyraUser | null; onboarding: Onboarding | null; habits: HabitDefinition[]; completions: Record<string, string[]>; sessions: WorkoutSession[]; completedExercises: string[]; messages: ChatMessage[]; theme: "dark" | "light"; notifications: { workout: boolean; habits: boolean; weekly: boolean }; privacy: { analytics: boolean; personalization: boolean }; totalXp: number; currentLevel: number; currentRank: string; currentStreak: number; longestStreak: number };

export const DEFAULT_HABITS: HabitDefinition[] = [
  { id: "workout", name: "Workout" }, { id: "sleep", name: "Sleep routine" }, { id: "hydration", name: "Hydration" },
  { id: "grooming", name: "Personal grooming" }, { id: "movement", name: "Movement" }, { id: "focus", name: "Study/work focus" },
];
const HABIT_XP: Record<string, number> = { workout: 100, sleep: 30, hydration: 20, grooming: 25, movement: 20, focus: 30 };
export const todayKey = () => new Date().toISOString().slice(0, 10);
export const dayKey = (offset: number) => { const d = new Date(); d.setDate(d.getDate() - offset); return d.toISOString().slice(0, 10); };
export function xpForLevel(level: number) { return 25 * level ** 2; }
export function levelFromXp(xp: number) { let level = 1; while (xp >= xpForLevel(level) && level < 100) level += 1; return level; }
export function rankFromLevel(level: number) { if (level >= 31) return "Platinum"; if (level >= 11) return "Gold"; return "Bronze"; }

function streaks(completions: Record<string, string[]>) {
  let current = 0; for (let i = 0; i < 365; i += 1) { if (!(completions[dayKey(i)] ?? []).length) break; current += 1; }
  let longest = 0; let run = 0; for (let i = 364; i >= 0; i -= 1) { if ((completions[dayKey(i)] ?? []).length) { run += 1; longest = Math.max(longest, run); } else run = 0; }
  return { current, longest };
}
function withProgress(state: VeyraState, totalXp: number, completions = state.completions): VeyraState { const level = levelFromXp(Math.max(0, totalXp)); const s = streaks(completions); return { ...state, totalXp: Math.max(0, totalXp), currentLevel: level, currentRank: rankFromLevel(level), currentStreak: s.current, longestStreak: Math.max(state.longestStreak, s.longest) }; }

const STORAGE_KEY = "veyra-state-v3";
const initialState: VeyraState = { user: null, onboarding: null, habits: DEFAULT_HABITS, completions: {}, sessions: [], completedExercises: [], messages: [], theme: "dark", notifications: { workout: true, habits: true, weekly: true }, privacy: { analytics: true, personalization: true }, totalXp: 0, currentLevel: 1, currentRank: "Bronze", currentStreak: 0, longestStreak: 0 };
export type AuthResult = { error: string | null; needsEmailConfirmation?: boolean };
type Ctx = { state: VeyraState; hydrated: boolean; authLoading: boolean; update: (patch: Partial<VeyraState>) => void; signUpWithPassword: (name: string, email: string, password: string) => Promise<AuthResult>; signInWithPassword: (email: string, password: string) => Promise<AuthResult>; signInWithGoogle: () => Promise<AuthResult>; signOut: () => Promise<void>; toggleHabit: (id: string, date?: string) => void; addHabit: (name: string) => void; removeHabit: (id: string) => void; completeWorkout: (title: string, feedback: WorkoutSession["feedback"]) => void; toggleExercise: (id: string) => void };
const VeyraContext = createContext<Ctx | null>(null);

async function currentUserId() { const { data } = await supabase.auth.getUser(); return data.user?.id ?? null; }
async function loadProfile(session: Session): Promise<{ user: VeyraUser; onboarding: Onboarding | null }> {
  const email = session.user.email ?? ""; const meta = session.user.user_metadata ?? {}; const fallbackName = String(meta["display_name"] ?? meta["full_name"] ?? email.split("@")[0] ?? "Friend");
  try { const { data } = await supabase.from("profiles").select("display_name, email, plan, onboarding, created_at").eq("id", session.user.id).maybeSingle(); return { user: { name: data?.display_name || fallbackName, email: data?.email || email, role: email.toLowerCase().startsWith("admin") ? "admin" : "user", plan: (data?.plan as VeyraUser["plan"]) || "free", joinedAt: data?.created_at || session.user.created_at || new Date().toISOString() }, onboarding: (data?.onboarding as Onboarding | null) ?? null }; }
  catch { return { user: { name: fallbackName, email, role: email.toLowerCase().startsWith("admin") ? "admin" : "user", plan: "free", joinedAt: session.user.created_at || new Date().toISOString() }, onboarding: null }; }
}
async function loadRemoteState(userId: string) {
  const [p, h, c, w] = await Promise.all([
    supabase.from("user_progress").select("total_xp, level, rank, current_streak, longest_streak").eq("user_id", userId).maybeSingle(),
    supabase.from("habits").select("id, key, name, is_custom, sort_order").eq("user_id", userId).order("sort_order"),
    supabase.from("habit_completions").select("habit_id, completed_on, habits!inner(key)").eq("user_id", userId).order("completed_on", { ascending: false }).limit(1000),
    supabase.from("workout_sessions").select("id, performed_on, title, feedback").eq("user_id", userId).order("performed_on", { ascending: false }).limit(100),
  ]);
  const habits: HabitDefinition[] = h.data?.length ? h.data.map((x) => ({ id: x.key, name: x.name, custom: x.is_custom })) : DEFAULT_HABITS;
  const completions: Record<string, string[]> = {};
  for (const row of c.data ?? []) { const rel = Array.isArray(row.habits) ? row.habits[0] : row.habits; if (rel?.key) completions[row.completed_on] = [...(completions[row.completed_on] ?? []), rel.key]; }
  const sessions = (w.data ?? []).map((x) => ({ id: x.id, date: x.performed_on, title: x.title, feedback: (x.feedback as WorkoutSession["feedback"]) ?? null }));
  return { totalXp: p.data?.total_xp ?? 0, currentLevel: p.data?.level ?? 1, currentRank: p.data?.rank ? p.data.rank.charAt(0).toUpperCase() + p.data.rank.slice(1) : "Bronze", currentStreak: p.data?.current_streak ?? 0, longestStreak: p.data?.longest_streak ?? 0, habits, completions, sessions };
}
function authError(error: unknown) { return error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "Something went wrong. Please try again."; }

export function VeyraProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VeyraState>(initialState); const [hydrated, setHydrated] = useState(false); const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => { try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setState((p) => ({ ...p, ...(JSON.parse(raw) as Partial<VeyraState>) })); } catch { /* ignore */ } setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: state.theme, notifications: state.notifications, privacy: state.privacy, completedExercises: state.completedExercises, messages: state.messages })); }, [state.theme, state.notifications, state.privacy, state.completedExercises, state.messages, hydrated]);
  useEffect(() => { if (hydrated) document.documentElement.classList.toggle("dark", state.theme === "dark"); }, [state.theme, hydrated]);

  const hydrateSession = useCallback(async (session: Session) => { const [{ user, onboarding }, remote] = await Promise.all([loadProfile(session), loadRemoteState(session.user.id)]); setState((p) => withProgress({ ...p, user, onboarding, ...remote }, remote.totalXp, remote.completions)); }, []);
  useEffect(() => { let cancelled = false; supabase.auth.getSession().then(async ({ data }) => { if (cancelled) return; if (data.session) await hydrateSession(data.session); if (!cancelled) setAuthLoading(false); }).catch(() => { if (!cancelled) setAuthLoading(false); }); const { data: listener } = supabase.auth.onAuthStateChange((event, session) => { if (event === "SIGNED_OUT" || !session) { setState((p) => ({ ...initialState, theme: p.theme, notifications: p.notifications, privacy: p.privacy })); setAuthLoading(false); } else void hydrateSession(session).finally(() => setAuthLoading(false)); }); return () => { cancelled = true; listener.subscription.unsubscribe(); }; }, [hydrateSession]);

  const update = useCallback((patch: Partial<VeyraState>) => { setState((p) => ({ ...p, ...patch })); if (patch.onboarding) void currentUserId().then((id) => { if (id) return supabase.from("profiles").update({ onboarding: patch.onboarding }).eq("id", id); }); }, []);
  const signUpWithPassword = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => { const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: name.trim() } } }); if (error) return { error: authError(error) }; return data.session ? { error: null } : { error: null, needsEmailConfirmation: true }; }, []);
  const signInWithPassword = useCallback(async (email: string, password: string): Promise<AuthResult> => { const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password }); return { error: error ? authError(error) : null }; }, []);
  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => { const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/home` } }); return { error: error ? authError(error) : null }; }, []);
  const signOut = useCallback(async () => { await supabase.auth.signOut(); }, []);
  const awardXp = useCallback(async (amount: number, source: string, sourceKey: string) => { if (!state.user) return; const { data, error } = await supabase.rpc("award_xp", { _amount: amount, _source: source, _source_key: sourceKey }); if (!error && data) setState((p) => ({ ...p, totalXp: data.total_xp, currentLevel: data.level, currentRank: data.rank.charAt(0).toUpperCase() + data.rank.slice(1), currentStreak: data.current_streak, longestStreak: data.longest_streak })); }, [state.user]);

  const toggleHabit = useCallback((id: string, date = todayKey()) => { if (!state.user) return; const done = state.completions[date]?.includes(id) ?? false; setState((p) => { const list = p.completions[date] ?? []; const next = done ? list.filter((x) => x !== id) : [...list, id]; return withProgress(p, p.totalXp + (HABIT_XP[id] ?? 20) * (done ? -1 : 1), { ...p.completions, [date]: next }); }); void currentUserId().then(async (userId) => { if (!userId) return; const { data: habit } = await supabase.from("habits").select("id").eq("user_id", userId).eq("key", id).maybeSingle(); if (!habit?.id) return; if (done) await supabase.from("habit_completions").delete().eq("user_id", userId).eq("habit_id", habit.id).eq("completed_on", date); else { const { error } = await supabase.from("habit_completions").insert({ user_id: userId, habit_id: habit.id, completed_on: date }); if (!error) await awardXp(HABIT_XP[id] ?? 20, "habit", `${id}:${date}`); } }); }, [state.user, state.completions, awardXp]);
  const addHabit = useCallback((name: string) => { const key = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`; setState((p) => ({ ...p, habits: [...p.habits, { id: key, name, custom: true }] })); void currentUserId().then((userId) => { if (userId) void supabase.from("habits").insert({ user_id: userId, key, name, is_custom: true, xp: 20, sort_order: state.habits.length }); }); }, [state.habits.length]);
  const removeHabit = useCallback((id: string) => setState((p) => ({ ...p, habits: p.habits.filter((h) => h.id !== id) })), []);
  const completeWorkout = useCallback((title: string, feedback: WorkoutSession["feedback"]) => { setState((p) => ({ ...p, sessions: [{ id: `local-${Date.now()}`, date: todayKey(), title, feedback }, ...p.sessions] })); void currentUserId().then(async (userId) => { if (!userId) return; const date = todayKey(); const { error } = await supabase.from("workout_sessions").insert({ user_id: userId, title, feedback, performed_on: date }); if (!error) await awardXp(200, "workout", `workout:${date}`); }); }, [awardXp]);
  const toggleExercise = useCallback((id: string) => setState((p) => ({ ...p, completedExercises: p.completedExercises.includes(id) ? p.completedExercises.filter((e) => e !== id) : [...p.completedExercises, id] })), []);
  const value = useMemo<Ctx>(() => ({ state, hydrated, authLoading, update, signUpWithPassword, signInWithPassword, signInWithGoogle, signOut, toggleHabit, addHabit, removeHabit, completeWorkout, toggleExercise }), [state, hydrated, authLoading, update, signUpWithPassword, signInWithPassword, signInWithGoogle, signOut, toggleHabit, addHabit, removeHabit, completeWorkout, toggleExercise]);
  return <VeyraContext.Provider value={value}>{children}</VeyraContext.Provider>;
}
export function useVeyra() { const ctx = useContext(VeyraContext); if (!ctx) throw new Error("useVeyra must be used inside VeyraProvider"); return ctx; }
