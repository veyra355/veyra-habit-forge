import type { Achievement } from "@/lib/game-system";

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

export function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all aspect-square ${
        unlocked
          ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 hover:border-pink-500/50"
          : "bg-slate-800/30 border-slate-700 opacity-50"
      }`}
    >
      <div className="text-4xl mb-2">{achievement.icon}</div>
      <h3 className="text-center text-sm font-semibold text-slate-100">{achievement.title}</h3>
      <p className="text-xs text-slate-400 text-center mt-1">{achievement.description}</p>
      {unlocked && (
        <div className="text-xs text-yellow-400 font-semibold mt-2">+{achievement.xpReward} XP</div>
      )}
    </div>
  );
}
