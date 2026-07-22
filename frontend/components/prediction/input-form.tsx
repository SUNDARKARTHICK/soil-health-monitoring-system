"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { soilInputSchema, type SoilInputForm } from "@/lib/validations/soil-schema";

const DEFAULT_INPUT: SoilInputForm = {
  pH: 6.5,
  nitrogen: 100,
  phosphorus: 40,
  potassium: 90,
  organicMatter: 3,
};

const EXAMPLE_INPUT: SoilInputForm = {
  pH: 4.8,
  nitrogen: 30,
  phosphorus: 15,
  potassium: 20,
  organicMatter: 1.2,
};

const FIELDS: Array<{ key: keyof SoilInputForm; label: string; unit: string; step: string }> = [
  { key: "pH", label: "Soil pH", unit: "", step: "0.1" },
  { key: "nitrogen", label: "Nitrogen (N)", unit: "kg/ha", step: "1" },
  { key: "phosphorus", label: "Phosphorus (P)", unit: "kg/ha", step: "1" },
  { key: "potassium", label: "Potassium (K)", unit: "kg/ha", step: "1" },
  { key: "organicMatter", label: "Organic matter", unit: "%", step: "0.1" },
];

interface InputFormProps {
  onSubmit: (input: SoilInputForm) => void;
  isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SoilInputForm>({
    resolver: zodResolver(soilInputSchema),
    defaultValues: DEFAULT_INPUT,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-sh hairline-border bg-white/60 p-6 dark:bg-white/[0.03]"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-medium">Soil parameters</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => reset(EXAMPLE_INPUT)}
            className="flex items-center gap-1 text-xs text-bedrock/50 hover:text-bedrock dark:text-parchment/50 dark:hover:text-parchment"
          >
            <Sparkles size={14} /> Example
          </button>
          <button
            type="button"
            onClick={() => reset(DEFAULT_INPUT)}
            className="flex items-center gap-1 text-xs text-bedrock/50 hover:text-bedrock dark:text-parchment/50 dark:hover:text-parchment"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1.5 block text-sm text-bedrock/70 dark:text-parchment/70">
              {field.label} {field.unit && <span className="text-bedrock/40 dark:text-parchment/40">({field.unit})</span>}
            </span>
            <Input type="number" step={field.step} {...register(field.key)} />
            {errors[field.key] && (
              <span className="mt-1 block text-xs text-oxide">{errors[field.key]?.message}</span>
            )}
          </label>
        ))}
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={isLoading}>
        {isLoading ? "Analyzing…" : "Check soil health"}
      </Button>
    </form>
  );
}
