import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/veyra/Logo";
import { useVeyra } from "@/lib/veyra-store";

export const Route = createFileRoute("/auth")({ head: () => ({ meta: [
  { title: "Sign in to Veyra" },
  { name: "description", content: "Log in or create your Veyra account." },
] }), component: AuthPage });

function GoogleMark() { return <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true"><path fill="currentColor" d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.22Z"/><path fill="currentColor" d="M12 21.75c2.64 0 4.86-.87 6.48-2.36l-3.14-2.45c-.87.58-1.98.92-3.34.92-2.57 0-4.75-1.73-5.53-4.06H3.22v2.53A9.79 9.79 0 0 0 12 21.75Z"/></svg>; }

function AuthPage() {
  const { user, signIn, signUp, signInWithGoogle } = useVeyra();
  const navigate = useNavigate();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false);
  if (user) navigate({ to: "/home", replace: true });

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); if (!email || !password) return toast.error("Enter your email and password");
    setBusy(true); const result = await signIn(email, password); setBusy(false);
    if (result.error) return toast.error(result.error);
    toast.success("Welcome back"); navigate({ to: result.needsOnboarding ? "/onboarding" : "/home" });
  };
  const signup = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim() || !email || password.length < 6) return toast.error("Use your name, email and a password of at least 6 characters");
    setBusy(true); const result = await signUp(name, email, password); setBusy(false);
    if (result.error) return toast.error(result.error);
    if (result.needsEmailConfirmation) return toast.success("Check your email to confirm your Veyra account, then log in.");
    toast.success("Account created"); navigate({ to: "/onboarding" });
  };
  const google = async () => { setBusy(true); const result = await signInWithGoogle(); setBusy(false); if (result.error) toast.error(result.error); };

  return <div className="flex min-h-screen flex-col bg-background"><div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6"><Link to="/"><Logo /></Link></div><div className="flex flex-1 items-center justify-center px-4 pb-16"><div className="w-full max-w-md"><h1 className="text-center text-2xl font-semibold sm:text-3xl">Welcome to Veyra</h1><p className="mt-2 text-center text-sm text-muted-foreground">Build better habits. Feel better. Show up better.</p>
    <div className="panel mt-7 p-6"><Tabs defaultValue="login"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="login">Log in</TabsTrigger><TabsTrigger value="signup">Create account</TabsTrigger></TabsList>
      <TabsContent value="login" className="mt-5"><form onSubmit={login} className="space-y-4"><Field id="login-email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email"/><Field id="login-password" label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" autoComplete="current-password"/><Button type="submit" disabled={busy} className="w-full">{busy ? "Signing in…" : "Log in"}</Button></form></TabsContent>
      <TabsContent value="signup" className="mt-5"><form onSubmit={signup} className="space-y-4"><Field id="name" label="Name" value={name} onChange={setName} placeholder="Your name" autoComplete="name"/><Field id="signup-email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email"/><Field id="signup-password" label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" autoComplete="new-password"/><Button type="submit" disabled={busy} className="w-full">{busy ? "Creating account…" : "Create account"}</Button></form></TabsContent>
    </Tabs><div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border"/>or<span className="h-px flex-1 bg-border"/></div><Button variant="outline" disabled={busy} className="w-full gap-2" onClick={google}><GoogleMark/> Continue with Google</Button><p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">Your account and progress are securely stored with Supabase. If email confirmation is enabled, confirm your email before logging in.</p></div></div></div></div>;
}
function Field({ id, label, type = "text", value, onChange, placeholder, autoComplete }: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void; placeholder: string; autoComplete: string }) { return <div className="space-y-1.5"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} autoComplete={autoComplete}/></div>; }
