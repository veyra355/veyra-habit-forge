import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface LevelUpAnimationProps {
  level: number;
  onComplete?: () => void;
}

export function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-center border border-purple-500/30 shadow-2xl animate-[levelUp_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
          <div className="absolute top-4 left-4 animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute top-4 right-4 animate-bounce" style={{ animationDelay: "0.2s" }}>
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          <p className="text-purple-300 text-lg font-semibold tracking-widest mb-3">LEVEL UP!</p>
          <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            LEVEL {level}
          </div>
          <p className="text-slate-300 text-lg font-medium">You're on your way to greatness!</p>
        </div>
      </div>
    </div>
  );
}
