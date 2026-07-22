const steps = [
  {
    depth: "0–15cm",
    title: "Enter your soil parameters",
    description:
      "Input pH, nitrogen, phosphorus, potassium, and organic matter, optionally temperature, humidity, and rainfall for a fuller picture.",
  },
  {
    depth: "15–40cm",
    title: "The model reads the profile",
    description:
      "A trained classifier compares your values against known healthy and unhealthy soil profiles and produces a confidence-scored prediction.",
  },
  {
    depth: "40cm+",
    title: "Get grounded recommendations",
    description:
      "See which parameters are out of range, what to add, natural or chemical, and which crops suit your current soil condition.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-display text-2xl font-medium md:text-3xl">How it works</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.depth} className="border-l-2 border-horizon-top pl-5">
            <span className="font-mono text-xs text-bedrock/40 dark:text-parchment/40">
              {step.depth}
            </span>
            <h3 className="mt-2 font-display text-lg font-medium">{step.title}</h3>
            <p className="mt-2 text-sm text-bedrock/60 dark:text-parchment/60">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
