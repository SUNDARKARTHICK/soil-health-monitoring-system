"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const layers = [
  { label: "Topsoil", color: "bg-horizon-top", height: "h-10" },
  { label: "Subsoil", color: "bg-horizon-sub", height: "h-16" },
  { label: "Substratum", color: "bg-horizon-base", height: "h-24" },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center md:pt-24">
      <div>
        <span className="inline-block rounded-full bg-chlorophyll/10 px-3 py-1 text-xs font-medium text-chlorophyll-text dark:text-chlorophyll">
          Machine learning · Precision agriculture
        </span>

        <h1 className="mt-5 font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          Read your soil like a horizon profile.
        </h1>

        <p className="mt-5 max-w-md text-base text-bedrock/70 dark:text-parchment/70">
          Enter your soil&apos;s pH, nitrogen, phosphorus, and potassium
          levels. Get a confidence-scored health prediction, a plain-language
          explanation, and fertilizer recommendations, natural and chemical,
          in seconds.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/predict" className={buttonVariants({ size: "lg" })}>
            Check my soil <ArrowRight size={18} />
          </Link>
          <Link href="/about" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            How it works
          </Link>
        </div>
      </div>

      {/* Signature element: an animated soil-core cross-section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="overflow-hidden rounded-sh hairline-border bg-white/50 p-8 dark:bg-white/[0.03]">
          <p className="mb-4 font-mono text-xs uppercase tracking-wide text-bedrock/50 dark:text-parchment/50">
            Soil core sample — depth profile
          </p>
          <div className="flex flex-col gap-1">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
                className={`${layer.color} ${layer.height} flex items-end rounded-sm px-3 pb-2 origin-left`}
              >
                <span className="font-mono text-[11px] text-parchment/90">
                  {layer.label}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between font-mono text-xs text-bedrock/50 dark:text-parchment/50">
            <span>pH 6.8</span>
            <span>N 140</span>
            <span>K 100</span>
            <span className="text-chlorophyll-text dark:text-chlorophyll">Healthy</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
