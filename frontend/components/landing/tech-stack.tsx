const stack = [
  { layer: "Frontend", tools: "Next.js 15, React 19, TypeScript, Tailwind CSS" },
  { layer: "Motion", tools: "Framer Motion" },
  { layer: "Charts", tools: "Recharts" },
  { layer: "ML backend", tools: "FastAPI, scikit-learn, joblib" },
  { layer: "Reports", tools: "jsPDF, CSV export" },
];

export function TechStack() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-display text-2xl font-medium md:text-3xl">Technology stack</h2>
      <div className="mt-8 divide-y divide-loam/10 dark:divide-parchment/10">
        {stack.map((row) => (
          <div
            key={row.layer}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-mono text-sm text-bedrock/50 dark:text-parchment/50">
              {row.layer}
            </span>
            <span className="text-sm">{row.tools}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
