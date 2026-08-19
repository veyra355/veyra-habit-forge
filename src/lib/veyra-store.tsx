import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;
export type Onboarding = { ageRange: string; experience: string; location: string; equipment: string[]; daysPerWeek: string; workoutTime: string; goals: string[]; sleepSchedule: string; activityLevel: string; workSchedule: string; timePerDay: string; diet: string; place: string; level: string; duration: string };
export type VeyraUser = { id: string; name: string; email: string; role: "user" | "admin"; plan: "free" | "starter" | "pro" | "elite"; joinedAt: string };
export type WorkoutSession = { id: string; date: string; title: string; feedback: "easy" | "good" | "challenging" | "too_difficult" | null };
export type HabitDefinition = { id: string; name: string; custom?: boolean };
export type ChatMessage = { id: string; role: "user" | "coach"; content: string };
export type Rank = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "VEYRA";
export type VeyraState = { user: VeyraUser | null; onboarding: Onboarding | null; habits: HabitDefinition[]; completions: Record<string, string[]>; sessions: WorkoutSession[]; completedExercises: string[]; messages: ChatMessage[]; theme: "dark" | "light"; notifications: { workout: boolean; habits: boolean; weekly: boolean }; privacy: { analytics: boolean; personalization: boolean }; totalXp: number; currentLevel: number; currentRank: Rank; currentStreak: number; achievements: string[] };
export const DEFAULT_HABITS = ["Workout", "Sleep routine", "Hydration", "Personal grooming", "Movement", "Study/work focus"];
export const todayKey = () => new Date().toISOString().slice(0, 10);
export const dayKey = (daysAgo = 0) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); return d.toISOString().slice(0, 10); };
const STORAGE_KEY = "veyra-ui-state-v2";
const initialState: VeyraState = { user: null, onboarding: null, habits: [], completions: {}, sessions: [], completedExercises: [], messages: [], theme: "dark", notifications: { workout: true, habits: true, weekly: true }, privacy: { analytics: true, personalization: true }, totalXp: 0, currentLevel: 1, currentRank: "BRONZE", currentStreak: 0, achievements: [] };
type Result = { error?: string };
type Ctx = VeyraState & { state: VeyraState; hydrated: boolean; update: (patch: Partial<VeyraState>) => void; signIn: (email: string, password: string) => Promise<Result & { needsOnboarding?: boolean }>; signUp: (name: string, email: string, password: string) => Promise<Result & { needsEmailConfirmation?: boolean }>; signInWithGoogle: () => Promise<Result>; signOut: () => Promise<void>; toggleHabit: (id: string, date?: string) => Promise<void>; addHabit: (name: string) => Promise<void>; removeHabit: (id: string) => Promise<void>; completeWorkout: (title: string, feedback: WorkoutSession["feedback"]) => Promise<void>; toggleExercise: (id: string) => void };
const VeyraContext = createContext<Ctx | null>(null);
function toHabit(row: any): HabitDefinition { return { id: row.id, name: row.name, custom: !!row.custom }; }

export function levelFromXp(xp: number) {
  if (xp < 100) return 1;
  return Math.floor(Math.sqrt(xp / 25)) + 1;
}

export function rankFromLevel(level: number): Rank {
  if (level >= 76) return "VEYRA";
  if (level >= 51) return "MASTER";
  if (level >= 36) return "DIAMOND";
  if (level >= 21) return "PLATINUM";
  if (level >= 11) return "GOLD";
  if (level >= 6) return "SILVER";
  return "BRONZE";
}

export function nextRankLevel(rank: Rank) {
  return { BRONZE: 6, SILVER: 11, GOLD: 21, PLATINUM: 36, DIAMOND: 51, MASTER: 76, VEYRA: 100 }[rank];
}

function calculateStreak(completions: Record<string, string[]>) {
  let streak = 0;
  for (let i = 0; i < 365; i += 1) {
    if ((completions[dayKey(i)] ?? []).length === 0) break;
    streak += 1;
  }
  return streak;
}

async function loadUser(userId: string, fallbackEmail = "") {
  const [profileRes, habitsRes, completionsRes, sessionsRes] = await Promise.all([
    db.from("profiles").select("id,name,email,role,plan,onboarding,notifications,privacy,created_at,total_xp,current_level,current_rank,current_streak,achievements").eq("id", userId).maybeSingle(),
    db.from("habits").select("id,name,custom").eq("user_id", userId).order("created_at"),
    db.from("habit_completions").select("habit_id,completed_on").eq("user_id", userId),
    db.from("workout_sessions").select("id,workout_title,session_date,feedback").eq("user_id", userId).order("session_date", { ascending: false }),
  ]);
  const firstError = [profileRes.error, habitsRes.error, completionsRes.error, sessionsRes.error].find(Boolean);
  if (firstError) throw new Error(firstError.message);
  const grouped: Record<string, string[]> = {};
  (completionsRes.data ?? []).forEach((c: any) => { (grouped[c.completed_on] ??= []).push(c.habit_id); });
  const totalXp = Number(profileRes.data?.total_xp ?? 0);
  const currentLevel = Number(profileRes.data?.current_level ?? levelFromXp(totalXp));
  const currentRank = rankFromLevel(currentLevel);
  const currentStreak = calculateStreak(grouped);
  return {
    user: { id: userId, name: profileRes.data?.name || fallbackEmail.split("@")[0] || "Friend", email: profileRes.data?.email || fallbackEmail, role: profileRes.data?.role === "admin" ? "admin" : "user", plan: ["free", "starter", "pro", "elite"].includes(profileRes.data?.plan) ? profileRes.data.plan : "free", joinedAt: profileRes.data?.created_at || new Date().toISOString() } as VeyraUser,
    onboarding: (profileRes.data?.onboarding as Onboarding | null) ?? null,
    habits: (habitsRes.data ?? []).map(toHabit), completions: grouped,
    sessions: (sessionsRes.data ?? []).map((s: any) => ({ id: s.id, date: s.session_date, title: s.workout_title, feedback: s.feedback })),
    notifications: profileRes.data?.notifications ?? initialState.notifications, privacy: profileRes.data?.privacy ?? initialState.privacy,
    totalXp, currentLevel, currentRank, currentStreak,
    achievements: Array.isArray(profileRes.data?.achievements) ? profileRes.data.achievements : [],
  };
}

export function VeyraProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VeyraState>(initialState); const [hydrated, setHydrated] = useState(false);
  const applyUser = useCallback(async (userId: string, email = "") => { const data = await loadUser(userId, email); setState(prev => ({ ...prev, ...data })); return data; }, []);
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setState(prev => ({ ...prev, ...(JSON.parse(raw) as Partial<VeyraState>), user: null })); } catch { /* ignore corrupt UI preferences */ }
    let mounted = true;
    db.auth.getSession().then(async ({ data, error }: any) => { if (error) console.error("[Veyra] session restore failed", error); if (mounted && data.session) { try { await applyUser(data.session.user.id, data.session.user.email ?? ""); } catch (e) { console.error("[Veyra] user restore failed", e); } } if (mounted) setHydrated(true); });
    const { data: listener } = db.auth.onAuthStateChange((_event: string, session: any) => { setTimeout(() => { if (!mounted) return; if (session) void applyUser(session.user.id, session.user.email ?? "").catch(e => console.error("[Veyra] auth sync failed", e)); else setState(prev => ({ ...initialState, theme: prev.theme })); }, 0); });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [applyUser]);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: state.theme, notifications: state.notifications, privacy: state.privacy })); }, [state.theme, state.notifications, state.privacy, hydrated]);
  useEffect(() => { if (hydrated) document.documentElement.classList.toggle("dark", state.theme === "dark"); }, [state.theme, hydrated]);
  const update = useCallback((patch: Partial<VeyraState>) => setState(prev => ({ ...prev, ...patch })), []);

  const awardXp = useCallback(async (amount: number, nextCompletions?: Record<string, string[]>) => {
    if (!state.user || amount <= 0) return;
    const nextXp = state.totalXp + amount;
    const nextLevel = levelFromXp(nextXp);
    const nextRank = rankFromLevel(nextLevel);
    const nextStreak = nextCompletions ? calculateStreak(nextCompletions) : state.currentStreak;
    const achievements = [...state.achievements];
    if (nextXp >= 1000 && !achievements.includes("1000_XP")) achievements.push("1000_XP");
    if (nextLevel >= 10 && !achievements.includes("LEVEL_10")) achievements.push("LEVEL_10");
    if (nextStreak >= 7 && !achievements.includes("7_DAY_STREAK")) achievements.push("7_DAY_STREAK");
    const { error } = await db.from("profiles").update({ total_xp: nextXp, current_level: nextLevel, current_rank: nextRank, current_streak: nextStreak, achievements }).eq("id", state.user.id);
    if (error) throw new Error(error.message);
    setState(prev => ({ ...prev, totalXp: nextXp, currentLevel: nextLevel, currentRank: nextRank, currentStreak: nextStreak, achievements }));
  }, [state.user, state.totalXp, state.currentStreak, state.achievements]);

  const signIn = useCallback(async (email: string, password: string) => { const { data, error } = await db.auth.signInWithPassword({ email: email.trim(), password }); if (error) return { error: error.message }; if (!data.user) return { error: "Unable to create a session. Please try again." }; try { const loaded = await applyUser(data.user.id, data.user.email ?? email); return { needsOnboarding: !loaded.onboarding }; } catch (e) { await db.auth.signOut(); return { error: e instanceof Error ? e.message : "Could not load your Veyra profile." }; } }, [applyUser]);
  const signUp = useCallback(async (name: string, email: string, password: string) => { const { data, error } = await db.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() } } }); if (error) return { error: error.message }; if (!data.user) return { error: "Account creation did not return a user." }; if (!data.session) return { needsEmailConfirmation: true }; try { await applyUser(data.user.id, email); return {}; } catch (e) { return { error: e instanceof Error ? e.message : "Could not load your new profile." }; } }, [applyUser]);
  const signInWithGoogle = useCallback(async () => { const { error } = await db.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth` } }); return error ? { error: error.message } : {}; }, []);
  const signOut = useCallback(async () => { const { error } = await db.auth.signOut(); if (error) console.error("[Veyra] sign out failed", error); setState(prev => ({ ...initialState, theme: prev.theme })); }, []);
  const toggleHabit = useCallback(async (id: string, date = todayKey()) => {
    if (!state.user) return;
    const existing = state.completions[date]?.includes(id);
    const result = existing ? await db.from("habit_completions").delete().eq("user_id", state.user.id).eq("habit_id", id).eq("completed_on", date) : await db.from("habit_completions").insert({ user_id: state.user.id, habit_id: id, completed_on: date });
    if (result.error) throw new Error(result.error.message);
    const nextCompletions = { ...state.completions, [date]: existing ? (state.completions[date] ?? []).filter(x => x !== id) : [...(state.completions[date] ?? []), id] };
    const nextStreak = calculateStreak(nextCompletions);
    setState(prev => ({ ...prev, completions: nextCompletions, currentStreak: nextStreak }));
    if (!existing) await awardXp(20, nextCompletions);
  }, [state.user, state.completions, awardXp]);
  const addHabit = useCallback(async (name: string) => { if (!state.user || !name.trim()) return; const { data, error } = await db.from("habits").insert({ user_id: state.user.id, name: name.trim(), custom: true }).select("id,name,custom").single(); if (error) throw new Error(error.message); if (data) setState(prev => ({ ...prev, habits: [...prev.habits, toHabit(data)] })); }, [state.user]);
  const removeHabit = useCallback(async (id: string) => { if (!state.user) return; const { error } = await db.from("habits").delete().eq("id", id).eq("user_id", state.user.id); if (error) throw new Error(error.message); setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id), completions: Object.fromEntries(Object.entries(prev.completions).map(([d, ids]) => [d, ids.filter(x => x !== id)])) })); }, [state.user]);
  const completeWorkout = useCallback(async (title: string, feedback: WorkoutSession["feedback"]) => { if (!state.user) return; const { data, error } = await db.from("workout_sessions").insert({ user_id: state.user.id, workout_title: title, feedback }).select("id,workout_title,session_date,feedback").single(); if (error) throw new Error(error.message); const session = { id: data.id, date: data.session_date, title: data.workout_title, feedback: data.feedback } as WorkoutSession; setState(prev => ({ ...prev, sessions: [session, ...prev.sessions] })); const workoutHabit = state.habits.find(h => h.name.toLowerCase() === "workout"); if (workoutHabit && !state.completions[todayKey()]?.includes(workoutHabit.id)) await toggleHabit(workoutHabit.id); else await awardXp(30); }, [state.user, state.habits, state.completions, toggleHabit, awardXp]);
  const toggleExercise = useCallback((id: string) => setState(prev => ({ ...prev, completedExercises: prev.completedExercises.includes(id) ? prev.completedExercises.filter(e => e !== id) : [...prev.completedExercises, id] })), []);
  const value = useMemo(() => ({ ...state, state, hydrated, update, signIn, signUp, signInWithGoogle, signOut, toggleHabit, addHabit, removeHabit, completeWorkout, toggleExercise }), [state, hydrated, update, signIn, signUp, signInWithGoogle, signOut, toggleHabit, addHabit, removeHabit, completeWorkout, toggleExercise]);
  return <VeyraContext.Provider value={value}>{children}</VeyraContext.Provider>;
}
export function useVeyra() { const ctx = useContext(VeyraContext); if (!ctx) throw new Error("useVeyra must be used inside VeyraProvider"); return ctx; }
