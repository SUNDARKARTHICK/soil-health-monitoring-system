"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ParameterAnalysis } from "@/types/soil";

interface ParameterRadarChartProps {
  parameters: ParameterAnalysis[];
}

// Normalize each parameter to a 0-100 scale relative to its own ideal range,
// so pH (0-14) and Nitrogen (0-300) can share one radar without one axis
// dwarfing the others.
function normalize(param: ParameterAnalysis): number {
  const mid = (param.idealMin + param.idealMax) / 2;
  const span = param.idealMax - param.idealMin || 1;
  const distanceFromMid = Math.abs(param.value - mid) / span;
  return Math.max(0, Math.round(100 - distanceFromMid * 50));
}

export function ParameterRadarChart({ parameters }: ParameterRadarChartProps) {
  const data = parameters.map((p) => ({
    parameter: p.label,
    score: normalize(p),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="currentColor" className="text-loam/10 dark:text-parchment/10" />
              <PolarAngleAxis dataKey="parameter" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#7A9B6E" fill="#7A9B6E" fillOpacity={0.35} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
