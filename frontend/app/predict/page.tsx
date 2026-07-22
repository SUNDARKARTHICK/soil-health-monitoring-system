"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputForm } from "@/components/prediction/input-form";
import { ResultCard } from "@/components/prediction/result-card";
import { usePrediction } from "@/hooks/use-prediction";
import type { SoilInput } from "@/types/soil";

// Chart-heavy components are dynamically imported so they don't bloat the
// initial bundle for a page whose primary job, on first load, is the form.
const ParameterRadarChart = dynamic(
  () => import("@/components/prediction/parameter-radar-chart").then((m) => m.ParameterRadarChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const FeatureImportanceChart = dynamic(
  () => import("@/components/prediction/feature-importance-chart").then((m) => m.FeatureImportanceChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const RecommendationPanel = dynamic(
  () => import("@/components/prediction/recommendation-panel").then((m) => m.RecommendationPanel),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return <div className="h-64 animate-pulse rounded-sh bg-loam/10 dark:bg-parchment/10" />;
}

// After this many ms of loading, show a proactive cold-start hint rather
// than waiting for the full request to time out. Render's free tier can
// take 30-50s to wake from idle; a bare skeleton for that long looks broken.
const SLOW_REQUEST_HINT_DELAY_MS = 6_000;

export default function PredictPage() {
  const { result, isLoading, error, predict } = usePrediction();
  const [lastInput, setLastInput] = useState<SoilInput | null>(null);
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowSlowHint(false);
      return;
    }
    const timer = setTimeout(() => setShowSlowHint(true), SLOW_REQUEST_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-medium">Check your soil health</h1>
      <p className="mt-2 max-w-xl text-bedrock/60 dark:text-parchment/60">
        Enter your latest test values below. Results are typically ready in under a second.
      </p>

      <h2 className="sr-only">Soil input and prediction results</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <InputForm
          isLoading={isLoading}
          onSubmit={(input) => {
            setLastInput(input);
            predict(input).catch(() => {
              // Error state and toast are already handled inside usePrediction.
            });
          }}
        />

        <div>
          {isLoading && (
            <div className="animate-pulse space-y-3 rounded-sh hairline-border bg-white/60 p-6 dark:bg-white/[0.03]">
              <div className="h-4 w-24 rounded bg-loam/10 dark:bg-parchment/10" />
              <div className="h-7 w-40 rounded bg-loam/10 dark:bg-parchment/10" />
              <div className="h-3 w-full rounded bg-loam/10 dark:bg-parchment/10" />
              <div className="h-20 w-full rounded bg-loam/10 dark:bg-parchment/10" />
            </div>
          )}

          {isLoading && showSlowHint && (
            <div
              role="status"
              className="mt-3 flex items-center gap-2 rounded-sh bg-clay/10 px-3 py-2 text-xs text-bedrock/70 dark:text-parchment/70"
            >
              <Loader2 size={14} className="animate-spin text-clay" />
              Still working — if the prediction service was idle, it can take up to a minute to wake up.
            </div>
          )}

          {!isLoading && error && (
            <div className="flex items-start gap-3 rounded-sh hairline-border bg-oxide/5 p-6">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-oxide" />
              <div>
                <p className="font-medium text-oxide">Prediction failed</p>
                <p className="mt-1 text-sm text-bedrock/60 dark:text-parchment/60">{error}</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isLoading && !error && result && lastInput && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ResultCard result={result} input={lastInput} />
              </motion.div>
            )}
          </AnimatePresence>

          {!isLoading && !error && !result && (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-sh border border-dashed border-loam/20 p-6 text-center text-sm text-bedrock/40 dark:border-parchment/20 dark:text-parchment/40">
              Your prediction will appear here.
            </div>
          )}
        </div>
      </div>

      {!isLoading && !error && result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid gap-6 lg:grid-cols-2"
        >
          <ParameterRadarChart parameters={result.parameterAnalysis} />
          {result.featureImportance && result.featureImportance.length > 0 && (
            <FeatureImportanceChart data={result.featureImportance} />
          )}
          {result.recommendations && (
            <div className="lg:col-span-2">
              <RecommendationPanel recommendations={result.recommendations} />
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
