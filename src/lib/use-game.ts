import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { periodStartFor } from "@/lib/game";
import { useVeyra } from "@/lib/veyra-store";

export type QuestPeriod = "daily" | "weekly" | "mission";

export type GameQuest = {
  id: string;
  key: string;
  title: string;
  description: string;
  period: QuestPeriod;
  xp: number;
  sortOrder: number;
  periodStart: string;
  completed: boolean;
};

export type GameAchievement = {
  id: string;
  key: string;
  title: string;
  description: string;
  metric: string;
  threshold: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type GameData = {
  quests: GameQuest[];
  achievements: GameAchievement[];
};

async function fetchGameData(): Promise<GameData> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { quests: [], achievements: [] };

  const [questRes, completionRes, achievementRes, unlockedRes] = await Promise.all([
    supabase
      .from("quests")
      .select("id, key, title, description, period, xp, sort_order")
      .eq("is_active", true)
      .order("sort_order"),
    supabase.from("quest_completions").select("quest_id, period_start").eq("user_id", userId),
    supabase
      .from("achievements")
      .select("id, key, title, description, metric, threshold, sort_order")
      .order("sort_order"),
    supabase.from("user_achievements").select("achievement_id, unlocked_at").eq("user_id", userId),
  ]);

  const doneKeys = new Set(
    (completionRes.data ?? []).map((row) => `${row.quest_id}:${row.period_start}`),
  );
  const quests: GameQuest[] = (questRes.data ?? []).map((row) => {
    const period = row.period as QuestPeriod;
    const periodStart = periodStartFor(period);
    return {
      id: row.id,
      key: row.key,
      title: row.title,
      description: row.description ?? "",
      period,
      xp: row.xp,
      sortOrder: row.sort_order,
      periodStart,
      completed: doneKeys.has(`${row.id}:${periodStart}`),
    };
  });

  const unlockedMap = new Map(
    (unlockedRes.data ?? []).map((row) => [row.achievement_id, row.unlocked_at]),
  );
  const achievements: GameAchievement[] = (achievementRes.data ?? []).map((row) => ({
    id: row.id,
    key: row.key,
    title: row.title,
    description: row.description,
    metric: row.metric,
    threshold: row.threshold,
    unlocked: unlockedMap.has(row.id),
    unlockedAt: unlockedMap.get(row.id) ?? null,
  }));

  return { quests, achievements };
}

export function useGame() {
  const { state, authLoading, awardXp } = useVeyra();
  const queryClient = useQueryClient();
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);

  const enabled = !authLoading && Boolean(state.user);
  const query = useQuery({
    queryKey: ["veyra-game"],
    queryFn: fetchGameData,
    enabled,
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: async (quest: GameQuest) => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id;
      if (!userId) throw new Error("You need to be signed in.");

      // The unique (user_id, quest_id, period_start) index is the real guard
      // against duplicate XP; a repeat click simply conflicts and awards nothing.
      const { error } = await supabase.from("quest_completions").insert({
        user_id: userId,
        quest_id: quest.id,
        period_start: quest.periodStart,
        xp_awarded: quest.xp,
      });
      if (error) {
        if (error.code === "23505") return { duplicate: true as const, levelUp: false, level: 0 };
        throw error;
      }
      const result = await awardXp(quest.xp, "quest", `${quest.key}:${quest.periodStart}`);
      return {
        duplicate: false as const,
        levelUp: result?.levelUp ?? false,
        level: result?.level ?? state.currentLevel,
      };
    },
    onSuccess: (result, quest) => {
      if (result.duplicate) {
        toast.info("Quest already cleared — no extra XP.");
      } else {
        toast.success(`${quest.title} cleared · +${quest.xp} XP`);
        if (result.levelUp) setLevelUpTo(result.level);
      }
      void queryClient.invalidateQueries({ queryKey: ["veyra-game"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Could not complete that quest.");
    },
  });

  const completeQuest = useCallback(
    (quest: GameQuest) => {
      if (quest.completed || mutation.isPending) return;
      mutation.mutate(quest);
    },
    [mutation],
  );

  const quests = query.data?.quests ?? [];
  return {
    loading: enabled && query.isLoading,
    quests,
    daily: quests.filter((q) => q.period === "daily"),
    weekly: quests.filter((q) => q.period === "weekly"),
    missions: quests.filter((q) => q.period === "mission"),
    achievements: query.data?.achievements ?? [],
    completeQuest,
    completing: mutation.isPending,
    levelUpTo,
    clearLevelUp: () => setLevelUpTo(null),
  };
}
