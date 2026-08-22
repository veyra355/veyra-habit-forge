import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { VeyraProvider } from "@/lib/veyra-store";
import { reportLovableError } from "../lib/lovable-error-reporting";

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top, hsl(var(--primary)/0.10), transparent_42%)]" />
      <div className="relative w-full max-w-lg text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-80">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">V</span>
          Veyra
        </Link>
        <div className="mt-10 rounded-3xl border border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <PageShell>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">404</div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        This page doesn’t exist, may have moved, or the link is no longer available.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Back to Veyra
        </Link>
        <button type="button" onClick={() => window.history.back()} className="inline-flex h-11 items-center justify-center rounded-xl border border-input bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
          Go back
        </button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">If you think this is a mistake, please contact support.</p>
    </PageShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <PageShell>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-2xl font-bold text-destructive">!</div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Veyra couldn’t load this page correctly. Try again, or return to the home page.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => { router.invalidate(); reset(); }} className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Try again
        </button>
        <Link to="/" className="inline-flex h-11 items-center justify-center rounded-xl border border-input bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
          Back to Veyra
        </Link>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">If the problem keeps happening, please contact support.</p>
    </PageShell>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Veyra — AI Fitness & Grooming Coach" },
      { name: "description", content: "Personalized routines for fitness, habits, grooming and everyday wellness—adapted to your goals and progress." },
      { name: "author", content: "Veyra" },
      { property: "og:title", content: "Veyra — AI Fitness & Grooming Coach" },
      { property: "og:description", content: "Build better habits. Feel better. Show up better." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500,0,9..40,600;1,9..40,400&family=Manrope:wght@200..800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <VeyraProvider>
        <Outlet />
        <Toaster position="top-center" />
      </VeyraProvider>
    </QueryClientProvider>
  );
}
