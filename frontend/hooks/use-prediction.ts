"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPrediction, ApiError } from "@/lib/api-client";
import type { PredictionResult, SoilInput } from "@/types/soil";

/**
 * Stateless prediction workflow: send inputs to the FastAPI backend, get a
 * complete result back (health, confidence, risk, parameter analysis,
 * recommendations, feature importance). No history, no persistence -- V1 is
 * intentionally request/response only.
 */
export function usePrediction() {
  const mutation = useMutation<PredictionResult, Error, SoilInput>({
    mutationFn: fetchPrediction,
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    },
    onSuccess: (result) => {
      toast.success(`Prediction complete: ${result.soilHealth}`);
    },
  });

  return {
    result: mutation.data ?? null,
    isLoading: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
    predict: mutation.mutateAsync,
    reset: mutation.reset,
  };
}
