"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { FeatureImportance } from "@/types/soil";

const BAR_COLOR = "#5B3A29";

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
}

export function FeatureImportanceChart({ data }: FeatureImportanceChartProps) {
  const sorted = [...data].sort((a, b) => b.importance - a.importance);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why the model decided this</CardTitle>
        <p className="mt-1 text-sm text-bedrock/50 dark:text-parchment/50">
          Feature importance from the trained Decision Tree — which parameters influenced this
          prediction the most.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sorted} layout="vertical" margin={{ left: 16 }}>
              <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
              <YAxis type="category" dataKey="feature" width={90} />
              <Tooltip formatter={(value: number) => `${Math.round(value * 100)}%`} />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {sorted.map((entry) => (
                  <Cell key={entry.feature} fill={BAR_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
