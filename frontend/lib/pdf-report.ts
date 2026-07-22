import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { PredictionResult, SoilInput } from "@/types/soil";

export function generatePredictionPdf(input: SoilInput, result: PredictionResult) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Soil Health Monitoring Report", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date(result.timestamp).toLocaleString()}`, 14, 27);

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`Prediction: ${result.soilHealth} (${result.confidence}% confidence)`, 14, 40);
  doc.setFontSize(11);
  doc.text(`Risk level: ${result.riskLevel}`, 14, 47);

  const explanationLines = doc.splitTextToSize(result.explanation, 180);
  doc.text(explanationLines, 14, 56);

  autoTable(doc, {
    startY: 56 + explanationLines.length * 5 + 6,
    head: [["Parameter", "Value", "Healthy range", "Status"]],
    body: result.parameterAnalysis.map((p) => [
      p.label,
      String(p.value),
      `${p.idealMin}–${p.idealMax}`,
      p.status,
    ]),
    headStyles: { fillColor: [91, 58, 41] }, // loam brown
  });

  if (result.recommendations) {
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    let y = finalY + 10;

    const section = (title: string, items: string[]) => {
      if (items.length === 0) return;
      doc.setFontSize(12);
      doc.text(title, 14, y);
      y += 6;
      doc.setFontSize(10);
      items.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, 180);
        doc.text(lines, 16, y);
        y += lines.length * 5;
      });
      y += 4;
    };

    section("Natural amendments", result.recommendations.natural);
    section("Chemical fertilizers", result.recommendations.artificial);
    section("Organic practices", result.recommendations.organic);
    section("Suitable crops", result.recommendations.suitableCrops);
  }

  doc.save(`soil-health-report-${Date.now()}.pdf`);
}
