import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/veyra/Logo";

type StatusPageProps = {
  code?: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryTo?: "/" | "/auth" | "/support";
  secondaryLabel?: string;
  secondaryTo?: "/" | "/auth" | "/support";
};

export function StatusPage({
  code,
  title,
  description,
  primaryLabel = "Back to Veyra",
  primaryTo = "/",
  secondaryLabel = "Get support",
  secondaryTo = "/support",
}: StatusPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-lg text-center">
        <Link to="/" className="inline-flex justify-center" aria-label="Veyra home">
          <Logo />
        </Link>
        <div className="panel mt-8 p-8 sm:p-10">
          {code && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{code}</p>}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to={primaryTo} className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {primaryLabel}
            </Link>
            <Link to={secondaryTo} className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
