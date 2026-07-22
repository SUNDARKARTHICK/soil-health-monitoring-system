import type { PredictionResult, SoilInput } from "@/types/soil";

export function exportPredictionToCsv(input: SoilInput, result: PredictionResult) {
  const rows = [
    ["Field", "Value"],
    ["pH", String(input.pH)],
    ["Nitrogen (kg/ha)", String(input.nitrogen)],
    ["Phosphorus (kg/ha)", String(input.phosphorus)],
    ["Potassium (kg/ha)", String(input.potassium)],
    ["Organic matter (%)", String(input.organicMatter)],
    ["Predicted health", result.soilHealth],
    ["Confidence (%)", String(result.confidence)],
    ["Risk level", result.riskLevel],
    ["Date", new Date(result.timestamp).toLocaleString()],
  ];

  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `soil-health-report-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
