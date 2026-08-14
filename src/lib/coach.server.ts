/**
 * Coach service layer.
 *
 * This is the single place where a real AI provider gets wired in later.
 * The caller passes a sanitized context object (profile, goals, recent
 * workouts, habit history, feedback). API keys are read from server-side
 * environment variables inside the handler and are never sent to the browser.
 *
 * Guardrails encoded here are product rules, not decoration: no diagnosis,
 * no medication, no extreme dieting, no appearance scoring.
 */

export type CoachContext = {
  name?: string | undefined;
  goals?: string[] | undefined;
  level?: string | undefined;
  place?: string | undefined;
  duration?: string | undefined;
  daysPerWeek?: string | undefined;
  diet?: string | undefined;
  recentWorkouts?: { title: string; date: string; feedback: string | null }[] | undefined;
  habitCompletionRate?: number | undefined;
};

export const COACH_SYSTEM_PROMPT = `You are Veyra, a supportive fitness, habit and grooming coach for young adults in India.
Give practical, realistic, encouraging guidance. Never diagnose conditions, never prescribe medication,
never recommend extreme diets, excessive exercise or unhealthy weight loss, never score appearance or
compare the user to celebrities. If the user mentions symptoms, injuries, medication or medical treatment,
recommend consulting a qualified healthcare professional. Keep answers short, concrete and actionable.`;

const MEDICAL_TERMS = [
  "pain",
  "injury",
  "injured",
  "hurts",
  "fever",
  "medicine",
  "medication",
  "tablet",
  "doctor",
  "symptom",
  "rash",
  "infection",
  "thyroid",
  "diabetes",
  "blood pressure",
  "swelling",
  "sprain",
];

const EXTREME_TERMS = ["starve", "crash diet", "fasting for days", "lose 10 kg in a week", "steroid"];

function medicalRedirect() {
  return `That sounds like something a qualified healthcare professional should look at — I'm not able to assess symptoms, injuries or medication.

Please check in with a doctor or physiotherapist first. Once you're cleared, tell me any limitations and I'll keep your sessions gentle and well within them.`;
}

function extremeRedirect() {
  return `I won't help with anything extreme — crash diets, very large calorie cuts or performance drugs cause more harm than progress.

What genuinely works: a repeatable weekly schedule, balanced meals with enough protein, steady sleep, and small increases over time. Want me to build that version of the plan?`;
}

/**
 * Deterministic MVP responder. Replace the body with a call to your AI
 * provider (using COACH_SYSTEM_PROMPT + context) when the backend is live.
 */
export function generateCoachReply(message: string, context: CoachContext): string {
  const text = message.toLowerCase();
  const name = context.name?.split(" ")[0] ?? "there";
  const goals = context.goals?.length ? context.goals.slice(0, 3).join(", ") : "general fitness";
  const duration = context.duration ?? "30–40 minutes";
  const place = context.place ?? "home";

  if (MEDICAL_TERMS.some((t) => text.includes(t))) return medicalRedirect();
  if (EXTREME_TERMS.some((t) => text.includes(t))) return extremeRedirect();

  if (text.includes("shorter") || text.includes("short on time") || text.includes("less time")) {
    return `No problem, ${name}. Here's the 18-minute version of today's session:

1. Bodyweight squat — 3 x 10
2. Push-up — 3 x 8
3. Dumbbell row — 2 x 10 each side
4. Dead bug — 2 x 30s

Rest 45s between sets and skip the finisher. A short session logged beats a long session skipped.`;
  }

  if (text.includes("workout") || text.includes("train") || text.includes("session")) {
    return `Today's session for ${goals}, built for ${place} and about ${duration}:

Warm-up (5 min): easy marching, arm circles, hip openers
Main block:
1. Squat — 3 x 12, 60s rest
2. Push-up — 3 x 8–12, 60s rest
3. Row — 3 x 10 each side, 45s rest
4. Glute bridge — 3 x 15, 45s rest
Cooldown (5 min): hip flexor, chest and hamstring stretches

Stop a set when your form changes rather than pushing to failure, and tell me how it felt afterwards so I can adjust the next one.`;
  }

  if (text.includes("consistent") || text.includes("consistency") || text.includes("motivat")) {
    const rate = context.habitCompletionRate ?? 65;
    return `You're at roughly ${rate}% habit completion — that's a real base to build on, ${name}.

This week, try three things:
1. Anchor your workout to a fixed time slot instead of "sometime today".
2. Keep a 20-minute minimum version for low-energy days.
3. Protect sleep first; everything else gets easier after that.

Missing one day is data, not failure. Just don't miss two in a row.`;
  }

  if (text.includes("focus") || text.includes("today")) {
    return `Today's focus: strength plus your sleep routine.

One session (about ${duration}), water through the day, and lights off at a consistent time tonight. If energy is low, do the short version and still tick the habit — momentum is the goal this week.`;
  }

  if (text.includes("week") || text.includes("routine") || text.includes("plan")) {
    return `Here's a simple weekly frame based on ${context.daysPerWeek ?? "4"} training days:

Mon — Full body strength (${duration})
Tue — Mobility + walk
Wed — Upper body push/pull
Thu — Rest, sleep routine focus
Fri — Lower body strength
Sat — Conditioning circuit, shorter
Sun — Rest, grooming reset and plan next week

Keep grooming and hydration daily. We'll adjust after your feedback on the first two sessions.`;
  }

  if (text.includes("groom") || text.includes("skin") || text.includes("hair") || text.includes("style")) {
    return `A simple routine you can actually keep:

Morning — gentle cleanser, light moisturiser, SPF 30+, tidy hair
Evening — cleanse off sweat and dust, moisturise, trim facial hair every 2–3 days
Weekly — nails, wash bedsheets and towels, lay out outfits for the week

Give it 3–4 weeks before judging results. For any persistent skin or scalp concern, see a dermatologist — I can't assess conditions.`;
  }

  if (text.includes("diet") || text.includes("food") || text.includes("eat") || text.includes("meal")) {
    const diet = context.diet ?? "vegetarian";
    return `Nothing restrictive — just structure. A ${diet}-friendly frame:

• Protein at every meal (dal, paneer, curd, soya, eggs or chicken depending on your preference)
• A fruit or vegetable at two meals
• Carbs around training — roti, rice, oats are fine
• Water with every meal

Feeling energetic through your sessions is the metric that matters. For specific nutrition needs, a registered dietitian is the right call.`;
  }

  return `Got it, ${name}. Based on your goals (${goals}) and a ${place} setup, my suggestion is to keep this week simple: one strength session, one mobility session, and your daily habits.

Ask me to "create today's workout", "make today shorter", "build my weekly routine" or "suggest a grooming routine" and I'll put it together.`;
}
