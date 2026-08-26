export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ExerciseStep = {
  title: string;
  detail: string;
};

export type Exercise = {
  id: string;
  name: string;
  category: "Legs" | "Chest" | "Back" | "Arms" | "Core" | "Full Body";
  equipment: "No equipment" | "Dumbbells" | "Bodyweight";
  difficulty: Difficulty;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  summary: string;
  steps: ExerciseStep[];
  commonMistakes: string[];
  safetyNote: string;
  easierVariation: string;
  harderVariation: string;
  /** Optional real photo path (e.g. "/exercises/bodyweight-squat.jpg").
   * Falls back to the illustrated ExercisePose when not set. */
  imageUrl?: string;
};

export const EXERCISES: Exercise[] = [
  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    category: "Legs",
    equipment: "No equipment",
    difficulty: "Beginner",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    summary:
      "A foundational lower-body movement that trains the muscles you use every time you sit, stand, or climb stairs.",
    steps: [
      { title: "Starting position", detail: "Stand with feet shoulder-width apart, toes slightly turned out, chest up." },
      { title: "Lower down", detail: "Push your hips back and bend your knees, as if sitting into a chair, keeping your heels on the ground." },
      { title: "Reach depth", detail: "Lower until your thighs are roughly parallel to the floor, or as far as feels controlled." },
      { title: "Drive back up", detail: "Push through your heels to stand back up, squeezing your glutes at the top." },
    ],
    commonMistakes: [
      "Knees caving inward — keep them tracking over your toes.",
      "Heels lifting off the ground — shift weight back into your heels.",
      "Rounding the lower back — keep your chest lifted throughout.",
    ],
    safetyNote: "Stop if you feel sharp knee or lower-back pain. Mild muscle fatigue is normal; joint pain is not.",
    easierVariation: "Box squat — lightly tap a chair or box behind you at the bottom before standing back up.",
    harderVariation: "Add a pause at the bottom for 2 seconds, or hold a weight at your chest (goblet squat).",
  },
  {
    id: "push-up",
    name: "Push-Up",
    category: "Chest",
    equipment: "No equipment",
    difficulty: "Beginner",
    primaryMuscles: ["Chest", "Triceps"],
    secondaryMuscles: ["Shoulders", "Core"],
    summary: "A classic upper-body pressing movement that builds chest, shoulder and arm strength using just body weight.",
    steps: [
      { title: "Starting position", detail: "Hands slightly wider than shoulders, body in a straight line from head to heels." },
      { title: "Lower down", detail: "Bend your elbows at about a 45° angle from your body, lowering your chest toward the floor." },
      { title: "Bottom position", detail: "Stop just before your chest touches the floor, keeping your core braced." },
      { title: "Push back up", detail: "Press through your palms to return to the starting position, without letting your hips sag." },
    ],
    commonMistakes: [
      "Hips sagging toward the floor — brace your core to keep a straight line.",
      "Elbows flaring straight out to the sides — keep them at roughly 45°.",
      "Only lowering halfway — aim for a fuller range of motion as strength allows.",
    ],
    safetyNote: "Wrist discomfort is common for beginners — try performing on fists or using push-up handles if needed.",
    easierVariation: "Knee push-up — perform the same movement with knees on the ground instead of toes.",
    harderVariation: "Elevate your feet on a step, or add a slow 3-second lowering phase.",
  },
  {
    id: "dumbbell-curl",
    name: "Dumbbell Curl",
    category: "Arms",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primaryMuscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    summary: "A simple, focused movement for building arm strength and size, and a good introduction to dumbbell handling.",
    steps: [
      { title: "Starting position", detail: "Stand holding a dumbbell in each hand, arms fully extended, palms facing forward." },
      { title: "Curl up", detail: "Bend your elbows, bringing the dumbbells toward your shoulders, keeping your upper arms still." },
      { title: "Squeeze", detail: "Pause briefly at the top and squeeze your biceps." },
      { title: "Lower slowly", detail: "Control the weight back down to the starting position — don't just let it drop." },
    ],
    commonMistakes: [
      "Swinging the body to generate momentum — keep your torso still.",
      "Letting elbows drift forward — keep them close to your sides.",
      "Rushing the lowering phase — control is where a lot of the benefit comes from.",
    ],
    safetyNote: "Choose a weight you can lift with good form for all reps — form breakdown is the main injury risk here.",
    easierVariation: "Use lighter dumbbells, or perform one arm at a time for more focus.",
    harderVariation: "Slow the lowering phase to a 3-4 second count, or try alternating arms.",
  },
  {
    id: "plank",
    name: "Plank",
    category: "Core",
    equipment: "No equipment",
    difficulty: "Beginner",
    primaryMuscles: ["Core"],
    secondaryMuscles: ["Shoulders", "Glutes"],
    summary: "An isometric hold that builds core stability — the foundation for almost every other movement.",
    steps: [
      { title: "Starting position", detail: "Forearms on the ground, elbows under shoulders, legs extended behind you." },
      { title: "Straight line", detail: "Form a straight line from head to heels — no sagging hips, no piked-up hips." },
      { title: "Brace", detail: "Squeeze your glutes and pull your belly button in toward your spine." },
      { title: "Hold", detail: "Breathe steadily and hold the position for the target time." },
    ],
    commonMistakes: [
      "Hips sagging down — this puts strain on the lower back.",
      "Hips piking up too high — reduces how much your core actually works.",
      "Holding your breath — keep breathing normally throughout.",
    ],
    safetyNote: "Stop if you feel lower-back pain rather than core fatigue — check your hip position first.",
    easierVariation: "Knee plank — perform with knees on the ground instead of toes, shortening the lever.",
    harderVariation: "Extend hold time, or lift one foot slightly off the ground for a few seconds at a time.",
  },
  {
    id: "walking-lunge",
    name: "Walking Lunge",
    category: "Legs",
    equipment: "No equipment",
    difficulty: "Intermediate",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    summary: "A single-leg movement that builds strength, balance and coordination — useful for sports and everyday movement alike.",
    steps: [
      { title: "Starting position", detail: "Stand tall, feet hip-width apart." },
      { title: "Step forward", detail: "Take a controlled step forward, lowering your hips until both knees are bent around 90°." },
      { title: "Check position", detail: "Front knee should track over the front foot, back knee hovering just above the floor." },
      { title: "Step through", detail: "Push through your front heel to bring your back leg forward into the next step." },
    ],
    commonMistakes: [
      "Front knee collapsing inward — keep it tracking in line with your toes.",
      "Taking too short a step — this can strain the front knee.",
      "Leaning too far forward — keep your torso mostly upright.",
    ],
    safetyNote: "Practice near a wall or sturdy surface for balance support if you're new to this movement.",
    easierVariation: "Reverse lunge (step backward instead of forward) — often easier to balance with.",
    harderVariation: "Hold a light dumbbell in each hand, or add a pause at the bottom of each step.",
  },
  {
    id: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    category: "Arms",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    primaryMuscles: ["Shoulders"],
    secondaryMuscles: ["Triceps", "Core"],
    summary: "An overhead pressing movement that builds shoulder strength and stability.",
    steps: [
      { title: "Starting position", detail: "Sit or stand, holding dumbbells at shoulder height, palms facing forward." },
      { title: "Brace your core", detail: "Engage your core and avoid arching your lower back." },
      { title: "Press up", detail: "Push the dumbbells straight overhead until your arms are extended, without locking out hard." },
      { title: "Lower with control", detail: "Bring the dumbbells back down to shoulder height under control." },
    ],
    commonMistakes: [
      "Arching the lower back excessively — keep your core braced throughout.",
      "Flaring elbows out too wide at the bottom — keep a slight forward angle.",
      "Using momentum from the legs (unless intentionally doing a push press).",
    ],
    safetyNote: "Choose a weight that allows a controlled, pain-free range of motion — shoulder joints are sensitive to poor form.",
    easierVariation: "Seated with back support, and lighter dumbbells.",
    harderVariation: "Standing (rather than seated) to add core-stability demand, or slow the lowering phase.",
  },
];

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
