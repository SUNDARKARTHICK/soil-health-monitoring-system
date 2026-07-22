import { Sparkles, ListChecks } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Recommendations } from "@/types/soil";

function RecommendationList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="text-sm font-medium">{title}</h4>
      <ul className="mt-1.5 space-y-1 text-sm text-bedrock/70 dark:text-parchment/70">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-chlorophyll-text dark:text-chlorophyll">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RecommendationPanel({ recommendations }: { recommendations: Recommendations }) {
  const isAi = recommendations.source === "ai";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recommendations</CardTitle>
          <span className="flex items-center gap-1 rounded-full bg-loam/5 px-2.5 py-1 text-xs text-bedrock/50 dark:bg-parchment/5 dark:text-parchment/50">
            {isAi ? <Sparkles size={12} /> : <ListChecks size={12} />}
            {isAi ? "AI-generated" : "Rule-based"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <RecommendationList title="Natural amendments" items={recommendations.natural} />
        <RecommendationList title="Chemical fertilizers" items={recommendations.artificial} />
        <RecommendationList title="Organic practices" items={recommendations.organic} />
        <RecommendationList title="Suitable crops" items={recommendations.suitableCrops} />
        <div className="border-t border-loam/10 pt-3 text-sm dark:border-parchment/10">
          <span className="text-bedrock/50 dark:text-parchment/50">Expected yield improvement: </span>
          {recommendations.expectedYieldImprovement}
        </div>
      </CardContent>
    </Card>
  );
}
