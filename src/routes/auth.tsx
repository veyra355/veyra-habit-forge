import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/veyra/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to Veyra" },
      { name: "description", content: "Log in or create your free Veyra account to get your personalized fitness, habit and grooming plan." },
      { property: "og:title", content: "Sign in to Veyra" },
      { property: "og:description", content: "Log in or create your free Veyra account." },
    ],
  }),
  component: AuthPage,
});

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1A6.2 6.2 0 1 1 16.1 7.3l2.7-2.6A9.9 9.9 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.08-1.3-.2-2.1H12Z" />
    </svg>
  );
}

function friendlyAuthError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (m.includes("email not confirmed")) return "Please confirm your email before logging in.";
  if (m.includes("user already registered")) return "An account with this email already exists. Try logging in.";
  if (m.includes("password should be at least")) return "Password must be at least 6 characters.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return message;
}

function AuthPage() {
  const { state, hydrated, authLoading, signInWithPassword } = useVeyra();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (hydrated && !authLoading && state.user) {
      navigate({ to: state.onboarding ? "/home" : "/onboarding", replace: true });
    }
  }, [hydrated, authLoading, state.user, state.onboarding, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || googleLoading || resetLoading) return;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return void toast.error("Enter your email and password");
    setSubmitting(true);
    try {
      const result = await signInWithPassword(cleanEmail, password);
      if (result.error) toast.error(friendlyAuthError(result.error));
      else toast.success("Welcome back");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || googleLoading || resetLoading) return;
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !cleanEmail || password.length < 6) {
      return void toast.error("Add your name, email and a password of at least 6 characters");
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { display_name: cleanName },
          // Always return to Veyra after email confirmation instead of Supabase's default URL.
          emailRedirectTo: `${window.location.origin}/auth?confirmed=1`,
        },
      });
      if (error) {
        toast.error(friendlyAuthError(error.message));
        return;
      }
      if (!data.session) {
        toast.success("Account created. Confirm your email — Veyra will open automatically.");
        return;
      }
      toast.success("Account created — let's build your plan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (submitting || googleLoading || resetLoading) return;
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth?oauth=1`,
        },
      });
      if (error) {
        toast.error(friendlyAuthError(error.message));
        setGoogleLoading(false);
      }
    } catch (error) {
      toast.error(friendlyAuthError(error instanceof Error ? error.message : "Google sign-in failed."));
      setGoogleLoading(false);
    }
  };

  const handleReset = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return void toast.error("Enter your email first");
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/auth?reset=1`,
      });
      if (error) toast.error(friendlyAuthError(error.message));
      else toast.success("If an account exists, a password reset email is on its way.");
    } finally {
      setResetLoading(false);
    }
  };

  const busy = submitting || googleLoading || resetLoading;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6"><Link to="/"><Logo /></Link></div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <h1 className="text-center text-2xl font-semibold sm:text-3xl">Welcome to Veyra</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Build better habits. Feel better. Show up better.</p>
          <div className="panel mt-7 p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" disabled={busy}>Log in</TabsTrigger>
                <TabsTrigger value="signup" disabled={busy}>Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-5">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5"><Label htmlFor="login-email">Email</Label><Input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} /></div>
                  <div className="space-y-1.5"><Label htmlFor="login-password">Password</Label><Input id="login-password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} /></div>
                  <button type="button" onClick={handleReset} disabled={busy} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{resetLoading ? "Sending reset email..." : "Forgot password?"}</button>
                  <Button type="submit" className="w-full" disabled={busy}>{submitting ? "Signing you in..." : "Log in"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="mt-5">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} disabled={busy} /></div>
                  <div className="space-y-1.5"><Label htmlFor="signup-email">Email</Label><Input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} /></div>
                  <div className="space-y-1.5"><Label htmlFor="signup-password">Password</Label><Input id="signup-password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} /></div>
                  <Button type="submit" className="w-full" disabled={busy}>{submitting ? "Creating your account..." : "Create account"}</Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
            <Button variant="outline" className="w-full gap-2" onClick={handleGoogle} disabled={busy}><GoogleMark /> {googleLoading ? "Connecting to Google..." : "Continue with Google"}</Button>
            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">Your account, XP, habits and workout progress sync securely across devices.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
