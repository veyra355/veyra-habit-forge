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

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.25h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07Z"
      />
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
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) {
    return "Facebook sign-in isn't set up yet — please use email instead for now.";
  }
  return message;
}

function AuthPage() {
  const { state, hydrated, authLoading, signInWithPassword } = useVeyra();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [settingPassword, setSettingPassword] = useState(false);
  const [oauthReturning, setOauthReturning] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("oauth=1")) setOauthReturning(true);
  }, []);

  // A password-reset email link lands here with an auth event of
  // PASSWORD_RECOVERY (Supabase parses the token from the URL itself).
  // Without this, the reset link just dumped the user back on the normal
  // login form with no way to actually set a new password.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return void toast.error("Password must be at least 6 characters.");
    setSettingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(friendlyAuthError(error.message));
        return;
      }
      toast.success("Password updated — you're all set.");
      setIsRecovery(false);
      navigate({ to: "/home", replace: true });
    } finally {
      setSettingPassword(false);
    }
  };

  useEffect(() => {
    if (hydrated && !authLoading && state.user && !isRecovery) {
      navigate({ to: state.onboarding ? "/home" : "/onboarding", replace: true });
    }
  }, [hydrated, authLoading, state.user, state.onboarding, isRecovery, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || facebookLoading || resetLoading) return;
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
    if (submitting || facebookLoading || resetLoading) return;
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

  useEffect(() => {
    if (oauthReturning && hydrated && !authLoading && !state.user) {
      setOauthReturning(false);
    }
  }, [oauthReturning, hydrated, authLoading, state.user]);

  const handleFacebook = async () => {
    if (submitting || facebookLoading || resetLoading) return;
    setFacebookLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth?oauth=1`,
        },
      });
      if (error) {
        toast.error(friendlyAuthError(error.message));
        setFacebookLoading(false);
      }
    } catch (error) {
      toast.error(friendlyAuthError(error instanceof Error ? error.message : "Google sign-in failed."));
      setFacebookLoading(false);
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

  const busy = submitting || facebookLoading || resetLoading;

  // Avoid flashing the login form for a split second while we're still
  // figuring out whether the user is already signed in (or mid Google
  // OAuth redirect) — show a quiet loading state instead.
  const showLoadingScreen = !hydrated || authLoading || (oauthReturning && !isRecovery);

  if (showLoadingScreen) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <Logo />
        <p className="text-sm text-muted-foreground">
          {oauthReturning ? "Completing your Facebook sign-in…" : "Loading…"}
        </p>
      </div>
    );
  }

  if (isRecovery) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6"><Logo /></div>
        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-md">
            <h1 className="text-center text-2xl font-semibold sm:text-3xl">Set a new password</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Choose a new password for your account.
            </p>
            <div className="panel mt-7 p-6">
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={settingPassword}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={settingPassword}>
                  {settingPassword ? "Updating password..." : "Update password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <Button variant="outline" className="w-full gap-2" onClick={handleFacebook} disabled={busy}><FacebookMark /> {facebookLoading ? "Connecting to Facebook..." : "Continue with Facebook"}</Button>
            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">Your account, XP, habits and workout progress sync securely across devices.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
