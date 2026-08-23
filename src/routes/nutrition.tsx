import { createFileRoute } from "@tanstack/react-router";
import { Apple } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { FOOD_CATEGORIES, FOOD_ITEMS, NUTRITION_BASICS } from "@/lib/nutrition-data";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Nutrition Academy — Veyra" },
      {
        name: "description",
        content: "Learn the basics of nutrition and explore foods, including common Indian staples.",
      },
    ],
  }),
  component: NutritionPage,
});

function NutritionPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", ...FOOD_CATEGORIES];
  const visibleFoods =
    activeCategory === "All" ? FOOD_ITEMS : FOOD_ITEMS.filter((f) => f.category === activeCategory);

  return (
    <AppShell>
      <PageHeader
        title="Nutrition Academy"
        subtitle="The basics of food, explained simply — plus a browsable food guide including common Indian staples."
      />

      <section>
        <h2 className="font-display text-lg font-bold">Nutrition Basics</h2>
        <Accordion type="single" collapsible className="mt-3">
          {NUTRITION_BASICS.map((b) => (
            <AccordionItem key={b.id} value={b.id}>
              <AccordionTrigger>
                <div className="text-left">
                  <p className="font-medium">{b.title}</p>
                  <p className="text-xs font-normal text-muted-foreground">{b.summary}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {b.detail}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Food Explorer</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleFoods.map((food) => (
            <div key={food.id} className="panel p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{food.name}</h3>
                <Badge variant="outline" className="shrink-0 rounded-full text-[10px]">{food.category}</Badge>
              </div>
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">{food.servingInfo}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Key nutrients: </span>
                {food.keyNutrients}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{food.beginnerNote}</p>
            </div>
          ))}
        </div>
      </section>

      <SafetyNote>
        This is general nutrition education, not a prescribed diet plan. Everyone's needs differ —
        for specific dietary requirements or concerns, talk to a registered dietitian or doctor.
      </SafetyNote>
    </AppShell>
  );
}
