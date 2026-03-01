"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LandingHero } from "@/components/landing-hero";
import { Stepper } from "@/components/stepper";
import { ImportForm } from "@/components/import-form";
import { LoadingScreen } from "@/components/loading-screen";
import { ReviewGrid } from "@/components/review-grid";
import { ExportPanel } from "@/components/export-panel";
import { CalendarEvent } from "@/lib/types";

type Step = "landing" | "import" | "loading" | "review" | "export";

const stepIndex: Record<Step, number> = {
  landing: -1,
  import: 0,
  loading: 0,
  review: 1,
  export: 2,
};

// Diagonal katana-slash reveal: top leads, bottom follows (\-direction sweep)
const pageVariants = {
  initial: { clipPath: "polygon(0% 0%, 8% 0%, -8% 100%, 0% 100%)" },
  animate: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    clipPath: "polygon(100% 0%, 115% 0%, 95% 100%, 80% 100%)",
    transition: { duration: 0.39, ease: [0.55, 0, 1, 0.45] as const },
  },
};

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courseName, setCourseName] = useState("");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setCourseName(formData.get("courseName") as string);
    setTimezone(formData.get("timezone") as string);
    setStep("loading");

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to extract events.");
        setStep("import");
        return;
      }

      if (data.events.length === 0) {
        setError("No events found in the syllabus. Try pasting a different section.");
        setStep("import");
        return;
      }

      setEvents(data.events);
      setStep("review");
    } catch {
      setError("Network error. Please try again.");
      setStep("import");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = (id: string, updated: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleToggleEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const handleReset = () => {
    setEvents([]);
    setCourseName("");
    setError(null);
    setStep("landing");
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {step === "landing" && (
          <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <LandingHero onGetStarted={() => setStep("import")} />
          </motion.div>
        )}

        {(step === "import" || step === "loading") && (
          <motion.div key="import" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <Stepper currentStep={stepIndex[step]} />
              {step === "loading" ? (
                <LoadingScreen />
              ) : (
                <>
                  {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <ImportForm onSubmit={handleExtract} loading={loading} />
                </>
              )}
            </div>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div key="review" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="max-w-6xl mx-auto px-4 py-12">
              <Stepper currentStep={stepIndex[step]} />
              <ReviewGrid
                events={events}
                timezone={timezone}
                onUpdate={handleUpdateEvent}
                onDelete={handleDeleteEvent}
                onToggle={handleToggleEvent}
                onExport={() => setStep("export")}
                onBack={() => setStep("import")}
              />
            </div>
          </motion.div>
        )}

        {step === "export" && (
          <motion.div key="export" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <Stepper currentStep={stepIndex[step]} />
              <ExportPanel
                events={events.filter((e) => e.selected)}
                courseName={courseName}
                timezone={timezone}
                onReset={handleReset}
                onBack={() => setStep("review")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
