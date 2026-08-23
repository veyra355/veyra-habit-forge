import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/veyra/Logo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Veyra" },
      {
        name: "description",
        content: "How Veyra collects, uses and protects your data.",
      },
    ],
  }),
  component: PrivacyPage,
});

const LAST_UPDATED = "23 August 2026";

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/">Back to home</Link>
        </Button>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:px-6">
        <h1 className="display-italic text-[clamp(2rem,5vw,3rem)]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_p]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <section>
            <p>
              Veyra ("we", "our", "the app") is a fitness, grooming and habit-tracking app. This
              policy explains what information we collect, why we collect it, and how it is
              stored and used.
            </p>
          </section>

          <section>
            <h2>Information we collect</h2>
            <ul>
              <li>Account information: your name and email address (via email or Google sign-in).</li>
              <li>
                Profile information you provide: age, height, weight, activity level and fitness
                goals, used only to personalise your workout, habit and grooming plan.
              </li>
              <li>
                Activity data: workouts completed, habits checked off, quests completed, streaks
                and XP.
              </li>
              <li>
                AI Coach conversations: messages you send to the AI Coach are processed to
                generate a response and are stored so you can see your conversation history.
              </li>
              <li>Payment information (Pro/Elite plans): handled entirely by our payment
                processor — we do not see or store your card or UPI details.
              </li>
            </ul>
          </section>

          <section>
            <h2>How we use your information</h2>
            <ul>
              <li>To generate personalised workout, habit and grooming plans.</li>
              <li>To power the AI Coach's responses to your questions.</li>
              <li>To track your progress, streaks and XP within the app.</li>
              <li>To process payments for paid plans, if you choose to upgrade.</li>
              <li>We do not sell your personal data to third parties, and we do not show ads.</li>
            </ul>
          </section>

          <section>
            <h2>Where your data is stored</h2>
            <p>
              Your account and app data are stored using Supabase, a secure cloud database
              provider. AI Coach messages are additionally sent to our AI provider to generate a
              response, in line with their own data-handling terms.
            </p>
          </section>

          <section>
            <h2>Teenage users</h2>
            <p>
              Veyra is intended for teenagers and young adults. We collect only the information
              needed to provide the app's core features (age, height, weight, activity data) and
              do not use this information for advertising or share it with data brokers. Veyra
              does not provide medical diagnoses — health, skin or medical concerns should always
              be directed to a qualified professional. If you are a parent or guardian and have
              questions about your teenager's data, please contact us using the details below.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              You can request a copy of your data, ask us to correct it, or request that your
              account and associated data be deleted, at any time, by contacting us using the
              details below.
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be reflected by
              updating the "Last updated" date above.
            </p>
          </section>

          <section>
            <h2>Contact us</h2>
            <p>
              For any privacy questions or data requests, contact us at{" "}
              <span className="font-medium text-foreground">[add your contact email here]</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
