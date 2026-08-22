import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/veyra/Logo";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return <PolicyLayout title="Privacy Policy" updated="August 22, 2026">
    <p>Veyra is designed to help you manage fitness, habits, grooming and wellness information. This page explains, at a high level, how information is handled by the app.</p>
    <h2>Information you provide</h2><p>This can include your account details, profile information, goals, routines, habit activity and other information you choose to enter.</p>
    <h2>How information is used</h2><p>Veyra uses information to provide and improve your requested features, personalize your experience, maintain account security and provide support.</p>
    <h2>Authentication and service providers</h2><p>Veyra may rely on third-party infrastructure such as authentication, database, storage and payment providers. Their handling of information is governed by their own policies.</p>
    <h2>Security</h2><p>We use reasonable technical and organizational measures to protect information. No internet service can guarantee absolute security.</p>
    <h2>Your choices</h2><p>You can review available account and privacy preferences in Veyra. For requests about your information, contact support.</p>
    <h2>Updates</h2><p>This policy may be updated as Veyra changes. The date above indicates the latest revision shown on this page.</p>
    <p className="text-xs text-muted-foreground">This product-level policy should be reviewed and finalized for the jurisdictions and services used by Veyra before commercial launch.</p>
  </PolicyLayout>;
}

function PolicyLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return <main className="min-h-screen bg-background px-4 py-8 sm:px-6"><div className="mx-auto max-w-3xl"><Link to="/" aria-label="Veyra home"><Logo /></Link><article className="panel mt-8 p-6 sm:p-10"><p className="text-sm text-muted-foreground">Last updated {updated}</p><h1 className="mt-2 text-3xl font-semibold">{title}</h1><div className="mt-8 space-y-5 text-sm leading-7 text-muted-foreground [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">{children}</div><div className="mt-10 border-t pt-6 text-sm"><Link to="/support" className="underline underline-offset-4">Need help? Contact Veyra support.</Link></div></article></div></main>;
}
