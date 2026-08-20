import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Lock,
  Moon,
  Palette,
  Shield,
  Sun,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppShell, PageHeader } from "@/components/veyra/AppShell";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Veyra" },
      {
        name: "description",
        content: "Manage your Veyra account, preferences, notifications and privacy settings.",
      },
      { property: "og:title", content: "Profile & Settings — Veyra" },
      { property: "og:description", content: "Account, preferences and privacy." },
    ],
  }),
  component: () => (
    <AppShell>
      <ProfilePage />
    </AppShell>
  ),
});

function ProfilePage() {
  const { state, update, signOut } = useVeyra();
  const user = state.user!;
  const [name, setName] = useState(user.name);

  const saveName = () => {
    update({ user: { ...user, name } });
    toast.success("Profile updated");
  };

  const toggleNotification = (key: keyof typeof state.notifications) => {
    update({ notifications: { ...state.notifications, [key]: !state.notifications[key] } });
  };

  const togglePrivacy = (key: keyof typeof state.privacy) => {
    update({ privacy: { ...state.privacy, [key]: !state.privacy[key] } });
  };

  return (
    <>
      <PageHeader
        title="Profile & Settings"
        subtitle="Your account, preferences and data choices."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 sm:p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="grid size-20 place-items-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-4 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium capitalize">
              {user.plan} plan
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Member since {new Date(user.joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">Account</h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="display-name">Display name</Label>
                <Input id="display-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email} disabled />
              </div>
            </div>
            <Button className="tap mt-4 w-full rounded-full sm:w-auto sm:px-8" onClick={saveName}>
              Save changes
            </Button>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">Plan</h3>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <div className="min-w-0">
                <p className="font-medium capitalize">{user.plan}</p>
                <p className="text-sm text-muted-foreground">
                  {user.plan === "free"
                    ? "Upgrade to unlock full coaching."
                    : "You're on a paid plan."}
                </p>
              </div>
              <Button asChild variant="outline" className="tap shrink-0 rounded-full">
                <Link to="/pricing">Manage</Link>
              </Button>
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">Appearance</h3>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant={state.theme === "light" ? "default" : "outline"}
                className="tap flex-1 gap-2 rounded-full"
                onClick={() => update({ theme: "light" })}
              >
                <Sun className="size-4" /> Light
              </Button>
              <Button
                variant={state.theme === "dark" ? "default" : "outline"}
                className="tap flex-1 gap-2 rounded-full"
                onClick={() => update({ theme: "dark" })}
              >
                <Moon className="size-4" /> Dark
              </Button>
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="mt-4 space-y-3">
              {[
                {
                  key: "workout" as const,
                  label: "Workout reminders",
                  desc: "Daily nudges before your scheduled session.",
                },
                {
                  key: "habits" as const,
                  label: "Habit reminders",
                  desc: "Evening check-ins for your tracked habits.",
                },
                {
                  key: "weekly" as const,
                  label: "Weekly summary",
                  desc: "A recap of your consistency and progress.",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    className="shrink-0"
                    checked={state.notifications[item.key]}
                    onCheckedChange={() => toggleNotification(item.key)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">Privacy</h3>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Usage analytics</p>
                  <p className="text-xs text-muted-foreground">
                    Help us improve by sharing anonymous usage data.
                  </p>
                </div>
                <Switch
                  className="shrink-0"
                  checked={state.privacy.analytics}
                  onCheckedChange={() => togglePrivacy("analytics")}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Personalization</p>
                  <p className="text-xs text-muted-foreground">
                    Let the coach adapt recommendations to your history.
                  </p>
                </div>
                <Switch
                  className="shrink-0"
                  checked={state.privacy.personalization}
                  onCheckedChange={() => togglePrivacy("personalization")}
                />
              </div>
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-muted-foreground" />
              <h3 className="font-semibold">Security</h3>
            </div>
            <button
              onClick={() => toast.info("Password reset link sent (demo)")}
              className="mt-4 flex min-h-12 w-full items-center justify-between rounded-xl border border-border bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50 active:bg-muted"
            >
              <span className="text-sm font-medium">Change password</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </section>

          <Button variant="destructive" className="tap w-full rounded-full" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
}
