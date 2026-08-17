import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Dumbbell,
  Home,
  LineChart,
  ScissorsLineDashed,
  ScanFace,
  Sparkles,
  SquareCheckBig,
  User,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVeyra } from "@/lib/veyra-store";
import { Logo } from "./Logo";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/grooming", label: "Grooming", icon: ScissorsLineDashed },
  { to: "/presentation", label: "Presentation", icon: ScanFace },
  { to: "/habits", label: "Habits", icon: SquareCheckBig },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/coach", label: "AI Coach", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { state, hydrated, update, signOut } = useVeyra();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && !state.user) navigate({ to: "/auth", replace: true });
  }, [hydrated, state.user, navigate]);

  if (!hydrated || !state.user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading your plan…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/home" className="shrink-0">
            <Logo />
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  pathname === item.to && "bg-secondary text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            {state.user.role === "admin" && (
              <Button asChild variant="ghost" size="icon" aria-label="Admin dashboard">
                <Link to="/admin">
                  <ShieldCheck className="size-4" />
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => update({ theme: state.theme === "dark" ? "light" : "dark" })}
            >
              {state.theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign out"
              onClick={() => {
                signOut();
                navigate({ to: "/", replace: true });
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-16">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="display-italic text-[clamp(1.6rem,3.6vw,2.2rem)]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SafetyNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
