import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/veyra/Logo";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to Veyra" },
      {
        name: "description",
        content:
          "Log in or create your free Veyra account to get your personalized fitness, habit and grooming plan.",
      },
      { property: "og:title", content: "Sign in to Veyra" },
      { property: "og:description", content: "Log in or create your free Veyra account." },
    ],
  }),
  component: AuthPage,
});

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1A6.2 6.2 0 1 1 16.1 7.3l2.7-2.6A9.9 9.9 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4 9.6-9.7 0-.7-.08-1.3-.2-2.1H12Z"
      />
    </svg>
  );
}

function AuthPage() {
  const { state, hydrated, authLoading, signUpWithPassword, signInWithPassword, signInWithGoogle } =
    useVeyra();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (hydrated && !authLoading && state.user)
      navigate({ to: state.onboarding ? "/home" : "/onboarding", replace: true });
  }, [hydrated, authLoading, state.user, state.onboarding, navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return void toast.error("Enter your email and password");
    setSubmitting(true);
    const result = await signInWithPassword(email, password);
    setSubmitting(false);
    if (result.error) return void toast.error(result.error);
    toast.success("Welcome back");
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email || password.length < 6)
      return void toast.error("Add your name, email and a password of at least 6 characters");
    setSubmitting(true);
    const result = await signUpWithPassword(name, email, password);
    setSubmitting(false);
    if (result.error) return void toast.error(result.error);
    if (result.needsEmailConfirmation)
      return void toast.success("Check your email to confirm your account, then log in");
    toast.success("Account created — let's build your plan");
  };
  const handleGoogle = async () => {
    const result = await signInWithGoogle();
    if (result.error) toast.error(result.error);
  };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <h1 className="text-center text-2xl font-semibold sm:text-3xl">Welcome to Veyra</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Build better habits. Feel better. Show up better.
          </p>
          <div className="panel mt-7 p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-5">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset will be connected next")}
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </button>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Logging in..." : "Log in"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="mt-5">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or{" "}
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={handleGoogle}>
              <GoogleMark /> Continue with Google
            </Button>
            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
              Your account, XP, habits and workout progress sync securely across devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
