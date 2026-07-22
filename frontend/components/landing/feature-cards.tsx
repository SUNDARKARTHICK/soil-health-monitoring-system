import { Gauge, FlaskConical, Sprout, FileDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Gauge,
    title: "Confidence-scored predictions",
    description:
      "Every prediction comes with a confidence percentage and a risk level, from excellent to poor, not just a binary label.",
  },
  {
    icon: FlaskConical,
    title: "Parameter-level analysis",
    description:
      "See exactly which parameter, pH, N, P, K, is pulling your soil out of the healthy range, color-coded for quick reading.",
  },
  {
    icon: Sprout,
    title: "Natural and chemical recommendations",
    description:
      "Get organic amendments and chemical fertilizer options side by side, plus crops suited to your current soil profile.",
  },
  {
    icon: FileDown,
    title: "Downloadable reports",
    description:
      "Export a full PDF report with your inputs, prediction, charts, and recommendations, ready to share or archive.",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-display text-2xl font-medium md:text-3xl">
        Built for the questions farmers actually ask
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon size={20} className="text-chlorophyll" />
              <CardTitle className="mt-3">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-bedrock/60 dark:text-parchment/60">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
