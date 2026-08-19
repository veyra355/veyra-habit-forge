// Veyra progression engine — pure, scalable maths shared by UI and database.
// Level thresholds: xpForLevel(n) = 25 * (n - 1) * (n + 2)
// L1 = 0, L2 = 100, L3 = 250, L4 = 450, L5 = 700, ... (mirrors the SQL functions)

export type RankKey =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "veyra";

export type RankMeta = {
  key: RankKey;
  label: string;
  title: string;
  minLevel: number;
  /** null = open ended */
  maxLevel: number | null;
  /** css class applied to rank surfaces */
  theme: string;
};

export const RANKS: RankMeta[] = [
  { key: "bronze", label: "Bronze", title: "The Starter", minLevel: 1, maxLevel: 5, theme: "rank-bronze" },
  { key: "silver", label: "Silver", title: "The Builder", minLevel: 6, maxLevel: 10, theme: "rank-silver" },
  { key: "gold", label: "Gold", title: "The Disciplined", minLevel: 11, maxLevel: 20, theme: "rank-gold" },
  { key: "platinum", label: "Platinum", title: "The Consistent", minLevel: 21, maxLevel: 35, theme: "rank-platinum" },
  { key: "diamond", label: "Diamond", title: "The Elite", minLevel: 36, maxLevel: 50, theme: "rank-diamond" },
  { key: "master", label: "Master", title: "The Master", minLevel: 51, maxLevel: 75, theme: "rank-master" },
  { key: "veyra", label: "Veyra", title: "Beyond Levels", minLevel: 76, maxLevel: null, theme: "rank-veyra" },
];

export function xpForLevel(level: number): number {
  return Math.max(0, 25 * (level - 1) * (level + 2));
}

export function levelForXp(xp: number): number {
  const safe = Math.max(0, Math.floor(xp));
  return Math.max(1, Math.floor((-1 + Math.sqrt(1 + 4 * (2 + safe / 25))) / 2));
}

export function rankForLevel(level: number): RankMeta {
  return [...RANKS].reverse().find((r) => level >= r.minLevel) ?? RANKS[0]!;
}

export function rankByKey(key: string): RankMeta {
  return RANKS.find((r) => r.key === key) ?? RANKS[0]!;
}

export function nextRank(key: RankKey): RankMeta | null {
  const i = RANKS.findIndex((r) => r.key === key);
  return i >= 0 && i < RANKS.length - 1 ? RANKS[i + 1]! : null;
}

export type LevelProgress = {
  level: number;
  totalXp: number;
  levelFloor: number;
  levelCeiling: number;
  intoLevel: number;
  levelSpan: number;
  pct: number;
};

export function levelProgress(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const levelFloor = xpForLevel(level);
  const levelCeiling = xpForLevel(level + 1);
  const levelSpan = Math.max(1, levelCeiling - levelFloor);
  const intoLevel = Math.max(0, totalXp - levelFloor);
  return {
    level,
    totalXp,
    levelFloor,
    levelCeiling,
    intoLevel,
    levelSpan,
    pct: Math.min(100, Math.round((intoLevel / levelSpan) * 100)),
  };
}

export type RankProgress = {
  rank: RankMeta;
  next: RankMeta | null;
  levelsRemaining: number;
  xpRemaining: number;
  pct: number;
};

export function rankProgress(totalXp: number): RankProgress {
  const level = levelForXp(totalXp);
  const rank = rankForLevel(level);
  const next = nextRank(rank.key);
  if (!next) {
    return { rank, next: null, levelsRemaining: 0, xpRemaining: 0, pct: 100 };
  }
  const floor = xpForLevel(rank.minLevel);
  const ceiling = xpForLevel(next.minLevel);
  const span = Math.max(1, ceiling - floor);
  return {
    rank,
    next,
    levelsRemaining: Math.max(0, next.minLevel - level),
    xpRemaining: Math.max(0, ceiling - totalXp),
    pct: Math.min(100, Math.max(0, Math.round(((totalXp - floor) / span) * 100))),
  };
}

/** Monday-anchored ISO week start, used as the weekly quest period key. */
export function weekStartKey(date = new Date()): string {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export const MISSION_PERIOD = "1970-01-01";

export function periodStartFor(period: "daily" | "weekly" | "mission", date = new Date()): string {
  if (period === "mission") return MISSION_PERIOD;
  if (period === "weekly") return weekStartKey(date);
  return date.toISOString().slice(0, 10);
}
