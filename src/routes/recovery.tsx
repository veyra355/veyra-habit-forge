import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/veyra/AppShell";
import { RecoveryHub } from "@/components/veyra/RecoveryHub";

export const Route = createFileRoute("/recovery")({
  head: () => ({
    meta: [
      { title: "Recovery — Veyra" },
      { name: "description", content: "A private recovery space for streaks, healthy routines and progress." },
    ],
  }),
  component: () => <AppShell><RecoveryPage /></AppShell>,
});

type RecoveryDay = {
  date: string;
  pornFree: boolean;
  masturbationFree: boolean;
  urge: "low" | "medium" | "high" | null;
};

type RecoveryState = { days: Record<string, RecoveryDay> };
const STORAGE_KEY = "veyra-recovery-v1";

function loadRecovery(): RecoveryState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw) as RecoveryState;
    return parsed?.days ? parsed : { days: {} };
  } catch {
    return { days: {} };
  }
}

function streak(days: Record<string, RecoveryDay>, field: "pornFree" | "masturbationFree") {
  let total = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (!days[key]?.[field]) break;
    total += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return total;
}

function RecoveryPage() {
  const [recovery, setRecovery] = useState<RecoveryState>({ days: {} });
  useEffect(() => setRecovery(loadRecovery()), []);

  const streaks = useMemo(() => ({
    porn: streak(recovery.days, "pornFree"),
    masturbation: streak(recovery.days, "masturbationFree"),
  }), [recovery.days]);

  return (
    <>
      <PageHeader
        title="Recovery"
        subtitle="Your private discipline hub — build healthier routines one day at a time."
      />
      <RecoveryHub pornStreak={streaks.porn} masturbationStreak={streaks.masturbation} />
    </>
  );
}
