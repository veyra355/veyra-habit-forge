export type NutritionBasic = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

export const NUTRITION_BASICS: NutritionBasic[] = [
  {
    id: "calories",
    title: "Calories",
    summary: "The energy your body gets from food.",
    detail:
      "Calories measure energy. Your body uses that energy for everything — breathing, moving, digesting, thinking. Active teens generally need more calories than sedentary ones; the right amount depends on activity level, age and body size rather than a single fixed number.",
  },
  {
    id: "protein",
    title: "Protein",
    summary: "Builds and repairs muscle, skin and hair.",
    detail:
      "Protein is made of amino acids, the building blocks your body uses to repair muscle after workouts and support normal growth. Good sources include eggs, dairy, legumes, fish, chicken, paneer and tofu.",
  },
  {
    id: "carbohydrates",
    title: "Carbohydrates",
    summary: "Your body's main fuel source, especially for exercise.",
    detail:
      "Carbs break down into glucose, which powers your muscles and brain. Whole grains, fruit, rice and roti provide steady energy along with fiber and micronutrients — they aren't something to fear or avoid.",
  },
  {
    id: "fats",
    title: "Fats",
    summary: "Support hormones, brain function and vitamin absorption.",
    detail:
      "Fats are essential, not optional. Nuts, seeds, ghee, oils and dairy provide fats your body needs for hormone production (including growth-related hormones during teenage years) and to absorb vitamins A, D, E and K.",
  },
  {
    id: "fiber",
    title: "Fiber",
    summary: "Keeps digestion healthy and helps you feel full.",
    detail:
      "Found in vegetables, fruits, whole grains and legumes, fiber supports digestion and gut health, and helps meals feel more satisfying.",
  },
  {
    id: "hydration",
    title: "Hydration",
    summary: "Water affects energy, focus and workout performance.",
    detail:
      "Even mild dehydration can affect concentration and energy levels. Water, milk, and water-rich foods (fruits, vegetables, dal) all contribute to daily hydration — there's no need for exotic drinks.",
  },
];

export type FoodItem = {
  id: string;
  name: string;
  category: "Protein-rich" | "Grains" | "Fruits" | "Vegetables" | "Dairy" | "Nuts & Seeds" | "Legumes" | "Indian Staples";
  servingInfo: string;
  keyNutrients: string;
  beginnerNote: string;
};

export const FOOD_ITEMS: FoodItem[] = [
  { id: "eggs", name: "Eggs", category: "Protein-rich", servingInfo: "1 large egg", keyNutrients: "High-quality protein, healthy fats, vitamin D", beginnerNote: "One of the most complete, affordable protein sources — great after a workout." },
  { id: "chicken-breast", name: "Chicken Breast", category: "Protein-rich", servingInfo: "~100g cooked", keyNutrients: "Lean protein, B vitamins", beginnerNote: "Low in fat, high in protein — a common base for a balanced meal." },
  { id: "paneer", name: "Paneer", category: "Protein-rich", servingInfo: "~50g cube", keyNutrients: "Protein, calcium, fat", beginnerNote: "A great vegetarian protein source, common in Indian cooking." },
  { id: "fish", name: "Fish", category: "Protein-rich", servingInfo: "~100g cooked", keyNutrients: "Protein, omega-3 fats", beginnerNote: "Provides protein plus fats that support heart and brain health." },
  { id: "rice", name: "Rice", category: "Grains", servingInfo: "1 cup cooked", keyNutrients: "Carbohydrates, some fiber (esp. brown rice)", beginnerNote: "A steady energy source and a staple across most Indian meals." },
  { id: "roti", name: "Roti / Chapati", category: "Grains", servingInfo: "1 medium roti", keyNutrients: "Carbohydrates, fiber", beginnerNote: "Whole-wheat roti adds more fiber than refined-flour options." },
  { id: "oats", name: "Oats", category: "Grains", servingInfo: "1/2 cup dry", keyNutrients: "Carbohydrates, fiber, some protein", beginnerNote: "A filling breakfast option that digests slowly, keeping energy steady." },
  { id: "banana", name: "Banana", category: "Fruits", servingInfo: "1 medium", keyNutrients: "Carbohydrates, potassium, fiber", beginnerNote: "An easy pre- or post-workout snack for quick, natural energy." },
  { id: "apple", name: "Apple", category: "Fruits", servingInfo: "1 medium", keyNutrients: "Fiber, vitamin C", beginnerNote: "A simple, portable snack with natural sweetness and fiber." },
  { id: "orange", name: "Orange", category: "Fruits", servingInfo: "1 medium", keyNutrients: "Vitamin C, fiber", beginnerNote: "Good for immune support and a refreshing snack option." },
  { id: "spinach", name: "Spinach (Palak)", category: "Vegetables", servingInfo: "1 cup cooked", keyNutrients: "Iron, vitamins A & C, fiber", beginnerNote: "An easy way to add iron and vitamins to dal or sabzi." },
  { id: "broccoli", name: "Broccoli", category: "Vegetables", servingInfo: "1 cup cooked", keyNutrients: "Fiber, vitamin C, vitamin K", beginnerNote: "A filling, low-calorie vegetable that works well steamed or stir-fried." },
  { id: "sweet-potato", name: "Sweet Potato", category: "Vegetables", servingInfo: "1 medium", keyNutrients: "Carbohydrates, fiber, vitamin A", beginnerNote: "A nutrient-dense carb source, good alongside a protein source." },
  { id: "curd", name: "Curd / Yogurt", category: "Dairy", servingInfo: "1 cup", keyNutrients: "Protein, calcium, probiotics", beginnerNote: "Supports digestion and adds protein to any meal — very common at Indian lunches." },
  { id: "milk", name: "Milk", category: "Dairy", servingInfo: "1 cup", keyNutrients: "Protein, calcium, vitamin D", beginnerNote: "An easy way to add protein and calcium, especially during growth years." },
  { id: "almonds", name: "Almonds", category: "Nuts & Seeds", servingInfo: "~10 almonds", keyNutrients: "Healthy fats, protein, vitamin E", beginnerNote: "A calorie-dense snack — a small handful goes a long way." },
  { id: "peanuts", name: "Peanuts / Chana", category: "Nuts & Seeds", servingInfo: "~30g", keyNutrients: "Protein, healthy fats, fiber", beginnerNote: "An affordable, filling snack — roasted chana is a common Indian option too." },
  { id: "chana", name: "Chana (Chickpeas)", category: "Legumes", servingInfo: "1 cup cooked", keyNutrients: "Protein, fiber, complex carbs", beginnerNote: "A vegetarian protein staple, works in curries, salads or roasted as a snack." },
  { id: "rajma", name: "Rajma (Kidney Beans)", category: "Legumes", servingInfo: "1 cup cooked", keyNutrients: "Protein, fiber, iron", beginnerNote: "Pairs well with rice for a filling, protein-fiber balanced meal." },
  { id: "dal", name: "Dal (Lentils)", category: "Indian Staples", servingInfo: "1 cup cooked", keyNutrients: "Protein, fiber, iron", beginnerNote: "One of the most common and affordable protein + fiber combos in Indian meals." },
  { id: "sabzi", name: "Mixed Sabzi", category: "Indian Staples", servingInfo: "1 cup", keyNutrients: "Vitamins, fiber, varies by vegetables used", beginnerNote: "A flexible way to get vegetables and fiber into a balanced thali." },
];

export const FOOD_CATEGORIES = [
  "Protein-rich",
  "Grains",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Nuts & Seeds",
  "Legumes",
  "Indian Staples",
] as const;
