export type Exercise = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  instructions: string;
};

export const todaysWorkout = {
  title: "Full Body Strength — Foundation",
  duration: "38 min",
  difficulty: "Intermediate",
  equipment: "Dumbbells, mat (bodyweight alternatives included)",
  focus: "Strength & posture",
  exercises: [
    {
      id: "ex-1",
      name: "Bodyweight Squat",
      sets: "3 sets",
      reps: "12 reps",
      rest: "60s rest",
      instructions:
        "Feet shoulder-width apart, chest tall. Sit back through the hips and drive evenly through both feet. Stop the set if form breaks down.",
    },
    {
      id: "ex-2",
      name: "Push-Up (knees optional)",
      sets: "3 sets",
      reps: "8–12 reps",
      rest: "60s rest",
      instructions:
        "Hands under shoulders, body in one line. Lower with control, elbows at roughly 45°, and press back up.",
    },
    {
      id: "ex-3",
      name: "Dumbbell Row",
      sets: "3 sets",
      reps: "10 reps each side",
      rest: "45s rest",
      instructions:
        "Hinge at the hips with a flat back. Pull the dumbbell towards your hip, pause, then lower slowly.",
    },
    {
      id: "ex-4",
      name: "Glute Bridge",
      sets: "3 sets",
      reps: "15 reps",
      rest: "45s rest",
      instructions:
        "Lie on your back, heels close to hips. Press hips up until your body is level, squeeze, then lower.",
    },
    {
      id: "ex-5",
      name: "Dead Bug",
      sets: "2 sets",
      reps: "40 seconds",
      rest: "30s rest",
      instructions:
        "Keep your lower back gently pressed down. Extend opposite arm and leg slowly, breathing steadily.",
    },
    {
      id: "ex-6",
      name: "Cooldown Stretch Flow",
      sets: "1 round",
      reps: "5 minutes",
      rest: "—",
      instructions:
        "Hip flexor stretch, chest opener, hamstring stretch and neck release. Move gently and never force a stretch.",
    },
  ] as Exercise[],
};

export const upcomingWorkouts = [
  { day: "Tomorrow", title: "Mobility & Recovery Flow", duration: "22 min", difficulty: "Easy" },
  { day: "Sunday", title: "Upper Body Push", duration: "35 min", difficulty: "Intermediate" },
  { day: "Tuesday", title: "Conditioning Circuit", duration: "28 min", difficulty: "Challenging" },
];

export const groomingRoutines = {
  morning: [
    "Rinse face with lukewarm water and a gentle cleanser",
    "Light moisturiser suited to your skin type",
    "Broad-spectrum sunscreen (SPF 30+)",
    "Comb hair while slightly damp, avoid harsh pulling",
  ],
  evening: [
    "Cleanse to remove sweat, dust and pollution",
    "Moisturise before bed",
    "Trim or tidy facial hair every 2–3 days",
    "Brush teeth, floss, and set out tomorrow's outfit",
  ],
};

export const groomingCategories = [
  {
    id: "hair",
    title: "Hair",
    blurb: "Simple, repeatable care instead of complicated routines.",
    items: [
      {
        name: "Basic hair-care routine",
        detail:
          "Wash 2–3 times a week with a mild shampoo, condition the mid-lengths and ends, and pat dry rather than rubbing.",
      },
      {
        name: "Hair-care habits",
        detail:
          "Avoid very hot water, give your scalp a gentle massage while washing, and keep a regular trim schedule every 6–8 weeks.",
      },
      {
        name: "Hairstyle inspiration",
        detail:
          "Match your style to hair texture and daily effort level. Low-maintenance crops, textured mid-length and side-part styles all work well in Indian humidity.",
      },
    ],
  },
  {
    id: "skin",
    title: "Skin",
    blurb: "Educational basics only — never a diagnosis.",
    items: [
      {
        name: "Simple skincare routine",
        detail: "Cleanse, moisturise, protect. Three steps done consistently beat ten steps done occasionally.",
      },
      {
        name: "Sun protection",
        detail:
          "Use SPF 30+ every morning, reapply on long outdoor days, and remember shade and clothing count too.",
      },
      {
        name: "General skincare education",
        detail:
          "Skin reacts to sleep, hydration, stress and climate. Give any new routine 3–4 weeks before judging results.",
      },
    ],
  },
  {
    id: "grooming",
    title: "Grooming",
    blurb: "The everyday maintenance layer.",
    items: [
      { name: "Hygiene", detail: "Daily shower, clean clothes, deodorant, and a fresh towel rotation." },
      {
        name: "Facial-hair grooming",
        detail: "Define your neckline and cheek line, trim in the direction of growth, and keep blades clean and sharp.",
      },
      { name: "Nail care", detail: "Trim weekly, keep edges smooth, and clean under the nails after workouts." },
    ],
  },
  {
    id: "style",
    title: "Style",
    blurb: "Fit and coordination over trends.",
    items: [
      {
        name: "Outfit suggestions",
        detail: "Build around 8–10 pieces that mix easily: two pairs of trousers, denim, plain tees, one overshirt, clean sneakers.",
      },
      { name: "Colour coordination", detail: "Anchor with neutrals, add one accent colour, and keep textures varied." },
      {
        name: "Occasion-based styling",
        detail: "College, work, family functions and evenings out each get one default outfit you never have to think about.",
      },
    ],
  },
  {
    id: "presentation",
    title: "Presentation",
    blurb: "How you carry the routine into the room.",
    items: [
      { name: "Posture", detail: "Stack ribs over hips, relax the shoulders down, and take short posture breaks while studying." },
      { name: "Organization", detail: "Lay out clothes and bag the night before to remove morning friction." },
      {
        name: "Communication habits",
        detail: "Steady pace, eye contact, and one clear point at a time. Small practice reps compound.",
      },
    ],
  },
];

export const faqs = [
  {
    q: "Is Veyra a medical or diagnostic service?",
    a: "No. Veyra offers general fitness, habit and grooming guidance only. For symptoms, injuries, medication or any medical concern, please consult a qualified healthcare professional.",
  },
  {
    q: "Do I need a gym?",
    a: "No. During onboarding you tell us whether you train at home, in a gym or outdoors, and what equipment you have. Plans are built around that.",
  },
  {
    q: "How does the plan adapt?",
    a: "After each session you tell us how it felt. Your coach uses that feedback, along with your habit history and schedule, to adjust volume and intensity.",
  },
  {
    q: "How much time do I need per day?",
    a: "Most plans work with 20–40 minutes. Short days are supported — you can always ask your coach for a shorter version.",
  },
  {
    q: "Will Veyra rate my appearance?",
    a: "Never. There are no attractiveness scores, body comparisons or celebrity comparisons anywhere in the product.",
  },
];

export const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    tagline: "Get started and build the habit.",
    cta: "Start Free",
    features: ["Limited AI coaching", "Basic workout generation", "Basic habit tracking", "Basic grooming routine"],
  },
  {
    id: "plus",
    name: "Plus",
    price: "₹499",
    tagline: "For consistent, adaptive training.",
    cta: "Upgrade to Plus",
    highlight: true,
    features: [
      "Personalized workouts",
      "Adaptive workout planning",
      "Habit tracking",
      "Grooming routines",
      "AI Coach",
      "Progress dashboard",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹999",
    tagline: "Maximum personalization and insight.",
    cta: "Upgrade to Pro",
    features: [
      "Everything in Plus",
      "Advanced personalization",
      "Detailed progress analysis",
      "More AI coaching",
      "Advanced routines",
    ],
  },
];

export const adminMetrics = {
  totalUsers: 12840,
  activeUsers: 5312,
  freeUsers: 9410,
  paidUsers: 3430,
  plusUsers: 2380,
  proUsers: 1050,
  workoutCompletions: 48219,
  aiRequests: 132904,
  dau: [
    { day: "Mon", users: 3820, workouts: 1420, ai: 4210 },
    { day: "Tue", users: 4180, workouts: 1610, ai: 4620 },
    { day: "Wed", users: 4460, workouts: 1720, ai: 4890 },
    { day: "Thu", users: 4310, workouts: 1580, ai: 4710 },
    { day: "Fri", users: 5010, workouts: 1890, ai: 5320 },
    { day: "Sat", users: 5312, workouts: 2140, ai: 5680 },
    { day: "Sun", users: 4720, workouts: 1760, ai: 5010 },
  ],
  recent: [
    { email: "a****@gmail.com", plan: "Pro", region: "Mumbai", status: "Active" },
    { email: "r****@outlook.com", plan: "Plus", region: "Bengaluru", status: "Active" },
    { email: "s****@gmail.com", plan: "Free", region: "Delhi", status: "Trial" },
    { email: "k****@yahoo.in", plan: "Plus", region: "Pune", status: "Active" },
    { email: "m****@gmail.com", plan: "Free", region: "Hyderabad", status: "Churn risk" },
  ],
};

export const monthlyTrend = [
  { week: "W1", workouts: 3, habits: 62 },
  { week: "W2", workouts: 4, habits: 71 },
  { week: "W3", workouts: 3, habits: 68 },
  { week: "W4", workouts: 4, habits: 79 },
];
