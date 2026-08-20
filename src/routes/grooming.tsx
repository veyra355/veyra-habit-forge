import { createFileRoute } from "@tanstack/react-router";
import { Sun, Moon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import { groomingCategories, groomingRoutines } from "@/lib/sample-data";

export const Route = createFileRoute("/grooming")({
  head: () => ({
    meta: [
      { title: "Grooming — Veyra" },
      {
        name: "description",
        content:
          "Simple hair, skin, grooming, style and presentation routines you can actually keep up with.",
      },
      { property: "og:title", content: "Grooming — Veyra" },
      {
        property: "og:description",
        content: "Simple routines for hair, skin, style and presentation.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <GroomingPage />
    </AppShell>
  ),
});

function GroomingPage() {
  return (
    <>
      <PageHeader
        title="Grooming"
        subtitle="Small, repeatable routines. Educational guidance only — never a diagnosis, never a score."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="panel p-5">
          <div className="flex items-center gap-2">
            <Sun className="size-4 text-primary" />
            <p className="text-sm font-medium">Morning routine</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {groomingRoutines.morning.map((i) => (
              <li key={i}>· {i}</li>
            ))}
          </ul>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-2">
            <Moon className="size-4 text-primary" />
            <p className="text-sm font-medium">Evening routine</p>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {groomingRoutines.evening.map((i) => (
              <li key={i}>· {i}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="hair">
          <TabsList className="no-scrollbar -mx-4 flex h-auto w-[calc(100%+2rem)] justify-start gap-1 overflow-x-auto px-4 sm:mx-0 sm:w-full sm:flex-wrap sm:px-1">
            {groomingCategories.map((c) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className="min-h-10 shrink-0 whitespace-nowrap px-4"
              >
                {c.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {groomingCategories.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-5">
              <div className="panel p-4 sm:p-6">
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                <Accordion type="single" collapsible className="mt-4">
                  {c.items.map((item) => (
                    <AccordionItem key={item.name} value={item.name}>
                      <AccordionTrigger className="min-h-12 text-left text-sm">
                        {item.name}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {item.detail}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <SafetyNote>
        Veyra does not diagnose skin, scalp or hair conditions and makes no promises about permanent
        physical changes. For persistent concerns — hair loss, acne, rashes, irritation — please
        consult a dermatologist or another qualified healthcare professional.
      </SafetyNote>
    </>
  );
}
