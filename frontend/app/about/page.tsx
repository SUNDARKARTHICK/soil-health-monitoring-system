export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-medium">About this project</h1>
      <p className="mt-4 text-bedrock/70 dark:text-parchment/70">
        Soil Health Monitoring is a machine-learning system that predicts
        whether a soil sample is healthy or unhealthy from its pH, nitrogen,
        phosphorus, potassium, and organic matter levels, and turns that
        prediction into practical guidance: what to add, natural or
        chemical, and what to grow.
      </p>

      <h2 className="mt-10 font-display text-xl font-medium">Who it&apos;s for</h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-bedrock/70 dark:text-parchment/70">
        <li>Farmers making fertilizer decisions between seasons</li>
        <li>Agricultural researchers screening sample batches</li>
        <li>Agriculture students learning soil parameter ranges</li>
        <li>Government agriculture officers doing field assessments</li>
      </ul>

      <h2 className="mt-10 font-display text-xl font-medium">How the model works</h2>
      <p className="mt-3 text-bedrock/70 dark:text-parchment/70">
        A decision tree classifier, trained with scikit-learn, is served
        behind a FastAPI endpoint. It&apos;s loaded once at startup and
        evaluates each request in milliseconds, no GPU or external
        AI service required.
      </p>
    </section>
  );
}
