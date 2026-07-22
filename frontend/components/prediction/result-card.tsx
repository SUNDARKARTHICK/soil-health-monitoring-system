import { Download, FileSpreadsheet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generatePredictionPdf } from "@/lib/pdf-report";
import { exportPredictionToCsv } from "@/lib/csv-export";
import type { PredictionResult, SoilInput } from "@/types/soil";

const riskBadgeStyle: Record<string, string> = {
  Excellent: "bg-chlorophyll text-bedrock",
  Good: "bg-chlorophyll text-bedrock",
  Moderate: "bg-clay text-bedrock",
  Poor: "bg-oxide text-parchment",
};

const statusColor: Record<string, string> = {
  Green: "bg-chlorophyll",
  Yellow: "bg-clay",
  Red: "bg-oxide",
};

interface ResultCardProps {
  result: PredictionResult;
  input: SoilInput;
}

export function ResultCard({ result, input }: ResultCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-bedrock/50 dark:text-parchment/50">
              Prediction
            </p>
            <h3 className="mt-1 font-display text-2xl font-medium">
              {result.soilHealth}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${riskBadgeStyle[result.riskLevel]}`}
          >
            {result.riskLevel}
          </span>
        </div>

        {/* Confidence, rendered as a horizon-strip fill — same visual language as the hero */}
        <div className="mt-6">
          <div className="mb-1.5 flex justify-between font-mono text-xs text-bedrock/50 dark:text-parchment/50">
            <span>Confidence</span>
            <span>{result.confidence}%</span>
          </div>
          <div className="horizon-strip bg-loam/10 dark:bg-parchment/10">
            <div
              style={{ "--fill-to": `${result.confidence}%` } as React.CSSProperties}
              className="animate-horizon-fill rounded-full bg-horizon-sub"
            />
          </div>
        </div>

        <p className="mt-5 text-sm text-bedrock/70 dark:text-parchment/70">
          {result.explanation}
        </p>

        <div className="mt-6 space-y-2">
          {result.parameterAnalysis.map((param) => (
            <div key={param.parameter} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${statusColor[param.status]}`} />
                {param.label}
              </span>
              <span className="font-mono text-bedrock/60 dark:text-parchment/60">
                {param.value} <span className="text-bedrock/30 dark:text-parchment/30">/ {param.idealMin}–{param.idealMax}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2 border-t border-loam/10 pt-4 dark:border-parchment/10">
          <Button variant="secondary" size="sm" onClick={() => generatePredictionPdf(input, result)}>
            <Download size={14} /> PDF report
          </Button>
          <Button variant="secondary" size="sm" onClick={() => exportPredictionToCsv(input, result)}>
            <FileSpreadsheet size={14} /> Export CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
