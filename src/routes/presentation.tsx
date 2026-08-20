import { createFileRoute } from "@tanstack/react-router";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  CircleAlert,
  Info,
  Lightbulb,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell, PageHeader, SafetyNote } from "@/components/veyra/AppShell";
import {
  CAPTURE_GUIDANCE,
  PRESENTATION_DISCLAIMER,
  STATUS_LABEL,
  analyzeMetrics,
  buildPlan,
  computeMetrics,
  manualAnalysis,
  type PresentationAnalysis,
  type PresentationStatus,
} from "@/lib/presentation";

const STORAGE_KEY = "veyra-presentation-v1";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation Coach — Veyra" },
      {
        name: "description",
        content:
          "Check lighting, camera framing, presentation, grooming and style — then get a supportive 7-day and 30-day routine. No attractiveness scoring, ever.",
      },
      { property: "og:title", content: "Presentation Coach — Veyra" },
      {
        property: "og:description",
        content:
          "Practical lighting, framing, grooming and style feedback with a 7-day and 30-day routine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PresentationCoachPage />
    </AppShell>
  ),
});

type Step = "intro" | "camera" | "analyzing" | "results";

const STATUS_STYLE: Record<PresentationStatus, string> = {
  good: "bg-primary/15 text-primary border-primary/30",
  okay: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  improve: "bg-destructive/10 text-destructive border-destructive/30",
  unknown: "bg-muted text-muted-foreground border-border",
};

function PresentationCoachPage() {
  const [step, setStep] = useState<Step>("intro");
  const [analysis, setAnalysis] = useState<PresentationAnalysis | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAnalysis(JSON.parse(raw) as PresentationAnalysis);
        setStep("results");
      }
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreaming(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setStep("camera");
      setStreaming(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      setError(
        "Camera access wasn't granted, so there's nothing to analyse. You can allow access in your browser settings, or continue without the camera for general guidance.",
      );
      setStep("intro");
    }
  }, []);

  const persist = useCallback((next: PresentationAnalysis) => {
    setAnalysis(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — results stay in memory only */
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      toast.error("The camera is still warming up — try again in a second.");
      return;
    }
    const w = 240;
    const h = Math.round((video.videoHeight / video.videoWidth) * w) || 240;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);
    const result = analyzeMetrics(computeMetrics(data, w, h));
    // Discard pixels immediately: nothing is uploaded and no image is stored.
    canvas.width = 0;
    canvas.height = 0;
    stopCamera();
    setStep("analyzing");
    window.setTimeout(() => {
      persist(result);
      setStep("results");
    }, 900);
  }, [persist, stopCamera]);

  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAnalysis(null);
    setStep("intro");
    toast.success("Presentation data cleared from this device.");
  }, []);

  return (
    <>
      <PageHeader
        title="Presentation Coach"
        subtitle="Feedback on lighting, framing, grooming visibility and presentation — never on how you look."
        action={
          analysis && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  stopCamera();
                  setStep("intro");
                }}
              >
                <RefreshCw className="mr-2 size-4" /> New check
              </Button>
              <Button variant="ghost" size="sm" onClick={clearData}>
                <Trash2 className="mr-2 size-4" /> Clear data
              </Button>
            </div>
          )
        }
      />

      {step === "intro" && (
        <IntroScreen
          error={error}
          onStart={startCamera}
          onSkip={() => {
            persist(manualAnalysis());
            setStep("results");
          }}
        />
      )}

      {step === "camera" && (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="panel overflow-hidden p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-xl bg-muted">
              <video
                ref={videoRef}
                playsInline
                muted
                className="aspect-square w-full scale-x-[-1] object-cover"
              />
              <div className="pointer-events-none absolute inset-[12%] rounded-[50%] border-2 border-dashed border-primary/50" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={capture} disabled={!streaming}>
                <Camera className="mr-2 size-4" /> Capture &amp; analyse
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  stopCamera();
                  setStep("intro");
                }}
              >
                Cancel
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              The frame is analysed on your device the moment you capture it, then discarded. No
              photo is uploaded and none is saved by default.
            </p>
          </div>

          <div className="panel p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="size-4 text-primary" /> Before you capture
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {CAPTURE_GUIDANCE.map((g) => (
                <li key={g} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {step === "analyzing" && (
        <div className="panel p-8 text-center">
          <Sparkles className="mx-auto size-6 animate-pulse text-primary" />
          <p className="mt-3 text-sm font-medium">Checking lighting, clarity and framing…</p>
          <Progress value={70} className="mx-auto mt-4 h-1.5 max-w-sm" />
          <p className="mt-3 text-xs text-muted-foreground">
            Running on your device. Nothing is being uploaded.
          </p>
        </div>
      )}

      {step === "results" && analysis && (
        <Results analysis={analysis} onRetake={startCamera} onClear={clearData} />
      )}

      <SafetyNote>{PRESENTATION_DISCLAIMER}</SafetyNote>
    </>
  );
}

function IntroScreen({
  error,
  onStart,
  onSkip,
}: {
  error: string | null;
  onStart: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <div className="panel p-5 sm:p-6">
        <Badge variant="secondary" className="mb-3">
          Presentation, not appearance
        </Badge>
        <h2 className="text-lg font-semibold">What this actually checks</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Veyra looks at the technical and presentation factors you can control — how well-lit and
          clear the frame is, where the camera sits, and whether your grooming is visible enough to
          comment on. That&apos;s it.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">We do</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>· Lighting quality and balance</li>
              <li>· Image clarity</li>
              <li>· Camera framing and distance</li>
              <li>· General presentation and posture cues</li>
              <li>· Grooming visibility, when technically possible</li>
              <li>· Expression and delivery suggestions</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              We never
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>· Score attractiveness or beauty</li>
              <li>· Rank or rate your face</li>
              <li>· Compare you to celebrities or AI beauty standards</li>
              <li>· Judge skin tone</li>
              <li>· Diagnose skin or hair conditions</li>
              <li>· Call any feature a flaw</li>
            </ul>
          </div>
        </div>

        {error && (
          <p className="mt-4 flex gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={onStart}>
            <Camera className="mr-2 size-4" /> Use camera
          </Button>
          <Button variant="outline" onClick={onSkip}>
            <CameraOff className="mr-2 size-4" /> Continue without camera
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Camera permission is only requested when you tap &quot;Use camera&quot;.
        </p>
      </div>

      <div className="panel p-5 sm:p-6">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-4 text-primary" /> How your image is handled
        </p>
        <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
          <li>
            The camera preview stays in your browser. When you capture, a single frame is measured
            on your device for brightness, evenness, sharpness and position.
          </li>
          <li>
            That frame is held in memory only for the moment of measurement, then discarded. No
            image is uploaded to any server and none is saved by default.
          </li>
          <li>
            Only the resulting text guidance is kept on this device so you can come back to it — and
            you can delete it any time with &quot;Clear data&quot;.
          </li>
        </ul>
        <p className="mt-4 flex gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <span>
            Prefer not to use the camera? Continue without it and you&apos;ll still get the full
            grooming and presentation routine.
          </span>
        </p>
      </div>
    </div>
  );
}

function Results({
  analysis,
  onRetake,
  onClear,
}: {
  analysis: PresentationAnalysis;
  onRetake: () => void;
  onClear: () => void;
}) {
  const plan = buildPlan(analysis);
  return (
    <>
      <p className="mb-4 text-xs text-muted-foreground">
        {analysis.source === "camera"
          ? "Measured from one on-device frame, which was discarded straight after."
          : "General guidance — no camera image was used."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {analysis.categories.map((c) => (
          <div key={c.id} className="panel p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{c.label}</p>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[c.status]}`}
              >
                {STATUS_LABEL[c.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{c.statusNote}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.tips.map((t) => (
                <li key={t} className="flex gap-2 text-muted-foreground">
                  <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="panel mt-6 p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Your improvement plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Healthy, realistic habits — grooming, hair care, basic skincare, sun protection, sleep,
          exercise, posture, style and hygiene. Start where you are; every day you tick counts.
        </p>
        <Tabs defaultValue="week" className="mt-5">
          <TabsList>
            <TabsTrigger value="week">7-day reset</TabsTrigger>
            <TabsTrigger value="month">30-day routine</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="mt-4 grid gap-3 sm:grid-cols-2">
            {plan.week.map((d) => (
              <PlanCard key={d.label} label={d.label} items={d.items} />
            ))}
          </TabsContent>
          <TabsContent value="month" className="mt-4 grid gap-3 sm:grid-cols-2">
            {plan.month.map((d) => (
              <PlanCard key={d.label} label={d.label} items={d.items} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={onRetake}>
          <Camera className="mr-2 size-4" /> Run another check
        </Button>
        <Button variant="outline" onClick={onClear}>
          <Trash2 className="mr-2 size-4" /> Delete my analysis data
        </Button>
      </div>
    </>
  );
}

function PlanCard({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium">{label}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>· {i}</li>
        ))}
      </ul>
    </div>
  );
}
