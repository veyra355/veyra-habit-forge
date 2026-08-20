/**
 * Face & Presentation Coach — analysis + plan logic.
 *
 * Scope is deliberately narrow: only technical/presentation factors
 * (lighting, clarity, framing, general presentation, grooming visibility).
 * No attractiveness scoring, no beauty ranking, no skin-tone judgement,
 * no medical or dermatological assessment, no celebrity comparison.
 */

export type PresentationStatus = "good" | "okay" | "improve" | "unknown";

export type PresentationCategory = {
  id: "lighting" | "framing" | "presentation" | "grooming" | "style";
  label: string;
  status: PresentationStatus;
  statusNote: string;
  tips: string[];
};

export type PresentationAnalysis = {
  createdAt: string;
  source: "camera" | "manual";
  categories: PresentationCategory[];
};

export type ImageMetrics = {
  brightness: number; // 0-100 average luma
  evenness: number; // 0-100, higher = more even lighting left/right
  clarity: number; // 0-100 edge energy proxy
  subjectFill: number; // 0-100 rough share of frame occupied by the subject region
  centering: number; // 0-100, higher = better centred
};

export const CAPTURE_GUIDANCE = [
  "Face the camera straight on",
  "Use good, even lighting — a window or lamp in front of you",
  "Keep the camera at a comfortable arm's length, around eye level",
  "Use a neutral or natural expression",
];

export const PRESENTATION_DISCLAIMER =
  "This is a general grooming and presentation tool, not a medical or diagnostic service. Veyra does not score attractiveness, rank faces, judge skin tone, or assess skin, scalp or hair conditions. For any health concern, please consult a qualified healthcare professional.";

/** Computes simple, non-identifying technical metrics from raw RGBA pixels. */
export function computeMetrics(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): ImageMetrics {
  let total = 0;
  let leftSum = 0;
  let rightSum = 0;
  let leftCount = 0;
  let rightCount = 0;
  let edgeEnergy = 0;
  let edgeSamples = 0;
  let brightPixels = 0;
  let brightX = 0;

  const luma = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const l = 0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!;
      luma[y * width + x] = l;
      total += l;
      if (x < width / 2) {
        leftSum += l;
        leftCount++;
      } else {
        rightSum += l;
        rightCount++;
      }
    }
  }

  const mean = total / (width * height);

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const c = luma[y * width + x]!;
      const gx = Math.abs(luma[y * width + x + 1]! - c);
      const gy = Math.abs(luma[(y + 1) * width + x]! - c);
      edgeEnergy += gx + gy;
      edgeSamples++;
      if (c > mean * 1.06) {
        brightPixels++;
        brightX += x;
      }
    }
  }

  const leftAvg = leftCount ? leftSum / leftCount : 0;
  const rightAvg = rightCount ? rightSum / rightCount : 0;
  const balance =
    Math.max(leftAvg, rightAvg) === 0
      ? 0
      : Math.min(leftAvg, rightAvg) / Math.max(leftAvg, rightAvg);
  const clarityRaw = edgeSamples ? edgeEnergy / edgeSamples : 0;
  const samplesTotal = edgeSamples || 1;
  const centerX = brightPixels ? brightX / brightPixels : width / 2;

  return {
    brightness: clamp((mean / 255) * 100),
    evenness: clamp(balance * 100),
    clarity: clamp((clarityRaw / 18) * 100),
    subjectFill: clamp((brightPixels / samplesTotal) * 100),
    centering: clamp(100 - (Math.abs(centerX - width / 2) / (width / 2)) * 100),
  };
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function statusFrom(score: number): PresentationStatus {
  if (score >= 72) return "good";
  if (score >= 48) return "okay";
  return "improve";
}

export const STATUS_LABEL: Record<PresentationStatus, string> = {
  good: "Good",
  okay: "Okay",
  improve: "Improve",
  unknown: "Not measured",
};

export function analyzeMetrics(metrics: ImageMetrics): PresentationAnalysis {
  const lightingScore = Math.round(
    (metrics.brightness > 78
      ? 100 - (metrics.brightness - 78) * 2.2
      : (metrics.brightness / 55) * 100) *
      0.6 +
      metrics.evenness * 0.4,
  );
  const framingScore = Math.round(metrics.centering * 0.5 + fillScore(metrics.subjectFill) * 0.5);

  const lighting: PresentationCategory = {
    id: "lighting",
    label: "Lighting",
    status: statusFrom(clamp(lightingScore)),
    statusNote:
      metrics.brightness < 32
        ? "The frame reads quite dark, so detail is getting lost."
        : metrics.brightness > 82
          ? "The frame is very bright and some detail is washing out."
          : metrics.evenness < 62
            ? "Light is falling mostly on one side of the frame."
            : "Exposure and balance look workable.",
    tips: [
      metrics.brightness < 32
        ? "Face a window or add a lamp in front of you rather than behind."
        : metrics.brightness > 82
          ? "Step back from the direct light source or diffuse it with a curtain."
          : "Try facing a window for softer, more even lighting.",
      metrics.evenness < 70
        ? "Turn slightly so light reaches both sides of your face evenly."
        : "Avoid overhead-only light — front light is kinder and clearer.",
    ],
  };

  const framing: PresentationCategory = {
    id: "framing",
    label: "Camera framing",
    status: statusFrom(clamp(framingScore)),
    statusNote:
      metrics.subjectFill > 62
        ? "You're filling most of the frame, so the shot feels tight."
        : metrics.subjectFill < 18
          ? "You're quite small in the frame."
          : metrics.centering < 60
            ? "You're sitting off to one side of the frame."
            : "Distance and position look comfortable.",
    tips: [
      metrics.subjectFill > 62
        ? "Move the camera slightly farther away and keep it around eye level."
        : metrics.subjectFill < 18
          ? "Come a little closer so your head and shoulders fill the frame."
          : "Keep head and shoulders in frame with a little space above your head.",
      metrics.centering < 70
        ? "Centre yourself horizontally before capturing."
        : "Keep the lens at eye level rather than tilted up or down.",
    ],
  };

  const presentation: PresentationCategory = {
    id: "presentation",
    label: "Presentation",
    status: statusFrom(clamp(Math.round(metrics.clarity * 0.6 + metrics.evenness * 0.4))),
    statusNote:
      metrics.clarity < 40
        ? "The image looks soft or slightly blurred, which reads as less crisp on calls."
        : "The image reads clear and steady.",
    tips: [
      metrics.clarity < 40
        ? "Wipe the lens, hold steady, and let the camera focus before capturing."
        : "Sit tall with relaxed shoulders — posture does most of the work on camera.",
      "A neutral, natural expression with a small pause before speaking comes across as calm and confident.",
    ],
  };

  const grooming: PresentationCategory = {
    id: "grooming",
    label: "Grooming",
    status: metrics.clarity < 35 ? "unknown" : "okay",
    statusNote:
      metrics.clarity < 35
        ? "Not enough visible detail to comment on grooming visibility."
        : "Grooming visibility is fine to work with — habits matter more than any single photo.",
    tips: [
      "Keep a simple daily routine: cleanse, moisturise, SPF in the morning, tidy hair before calls.",
      "Trim and shape facial hair on a fixed schedule so it never needs a rushed fix.",
    ],
  };

  const style: PresentationCategory = {
    id: "style",
    label: "Style",
    status: "unknown",
    statusNote: "Clothing and colour coordination aren't assessed from a single close-up frame.",
    tips: [
      "Choose a top that contrasts with your background so you don't blend into the wall.",
      "Build 3–4 outfit combinations you trust so getting ready is never a decision.",
    ],
  };

  return {
    createdAt: new Date().toISOString(),
    source: "camera",
    categories: [lighting, framing, presentation, grooming, style],
  };
}

function fillScore(fill: number) {
  if (fill >= 24 && fill <= 55) return 100;
  if (fill < 24) return clamp((fill / 24) * 90);
  return clamp(100 - (fill - 55) * 2);
}

/** Baseline guidance when the user continues without camera access. */
export function manualAnalysis(): PresentationAnalysis {
  return {
    createdAt: new Date().toISOString(),
    source: "manual",
    categories: [
      {
        id: "lighting",
        label: "Lighting",
        status: "unknown",
        statusNote: "Not measured — no image was captured.",
        tips: [
          "Face a window or place a lamp in front of you, never behind.",
          "Avoid overhead-only light; front light is more even.",
        ],
      },
      {
        id: "framing",
        label: "Camera framing",
        status: "unknown",
        statusNote: "Not measured — no image was captured.",
        tips: [
          "Keep the camera at eye level, roughly an arm's length away.",
          "Frame head and shoulders with a little space above your head.",
        ],
      },
      {
        id: "presentation",
        label: "Presentation",
        status: "unknown",
        statusNote: "General guidance only.",
        tips: [
          "Sit tall, shoulders relaxed, chin level.",
          "Pause for a breath before you start speaking.",
        ],
      },
      {
        id: "grooming",
        label: "Grooming",
        status: "unknown",
        statusNote: "General guidance only.",
        tips: [
          "Cleanse, moisturise and apply SPF each morning.",
          "Keep hair and facial hair on a fixed trim schedule.",
        ],
      },
      {
        id: "style",
        label: "Style",
        status: "unknown",
        statusNote: "General guidance only.",
        tips: [
          "Pick tops that contrast with your usual background.",
          "Prepare a few outfit combinations in advance.",
        ],
      },
    ],
  };
}

export type PlanDay = { label: string; items: string[] };

export function buildPlan(analysis: PresentationAnalysis | null): {
  week: PlanDay[];
  month: PlanDay[];
} {
  const needsLighting = analysis?.categories.find((c) => c.id === "lighting")?.status === "improve";
  const needsFraming = analysis?.categories.find((c) => c.id === "framing")?.status === "improve";

  const week: PlanDay[] = [
    {
      label: "Day 1 — Set the basics",
      items: [
        "Gentle cleanser morning and evening, light moisturiser after",
        needsLighting
          ? "Find one spot at home with good front lighting and make it your call spot"
          : "Note your best-lit spot at home for calls",
        "10-minute walk and lights off at a fixed time tonight",
      ],
    },
    {
      label: "Day 2 — Sun protection",
      items: [
        "Add SPF 30+ every morning, even indoors near windows",
        "Full glass of water with each meal",
        "20–30 minute workout or brisk walk",
      ],
    },
    {
      label: "Day 3 — Hair care",
      items: [
        "Wash hair with a mild shampoo; condition mid-lengths to ends",
        "Decide your trim schedule (every 3–4 weeks)",
        "5 minutes of neck and shoulder mobility",
      ],
    },
    {
      label: "Day 4 — Posture",
      items: [
        "Two posture resets: chest open, shoulders down, chin level",
        needsFraming
          ? "Set your camera at eye level and check the framing once"
          : "Check your on-camera posture once on a call",
        "Strength session or bodyweight circuit",
      ],
    },
    {
      label: "Day 5 — Style prep",
      items: [
        "Lay out 3 outfit combinations for the coming week",
        "Iron or steam what you actually wear most",
        "Sleep routine: screens down 30 minutes before bed",
      ],
    },
    {
      label: "Day 6 — Hygiene reset",
      items: [
        "Nails, wash bedsheets and towels, restock basics",
        "Clean your phone and laptop camera lens",
        "Longer walk or a light conditioning session",
      ],
    },
    {
      label: "Day 7 — Review",
      items: [
        "Retake a presentation check and compare notes, not looks",
        "Pick the two habits that were easiest and keep them",
        "Plan next week's training days and sleep window",
      ],
    },
  ];

  const month: PlanDay[] = [
    {
      label: "Week 1 — Foundation",
      items: [
        "Lock a simple morning and evening skincare routine (cleanse, moisturise, SPF)",
        "Fixed sleep and wake times, 7 days out of 7",
        "Three short workouts and daily walks",
      ],
    },
    {
      label: "Week 2 — Consistency",
      items: [
        "Add a fourth training day and one mobility session",
        "Hair wash and trim schedule on the calendar",
        "Daily posture resets while working",
      ],
    },
    {
      label: "Week 3 — Presentation",
      items: [
        "Set up your lighting and camera position once, permanently",
        "Practise a 60-second intro on camera twice this week",
        "Refine outfit combinations that photograph well",
      ],
    },
    {
      label: "Week 4 — Lock it in",
      items: [
        "Review what stuck and drop anything you dread",
        "Hydration, sleep and SPF are non-negotiables now",
        "Re-run the presentation check and update your routine",
      ],
    },
  ];

  return { week, month };
}
