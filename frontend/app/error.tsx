"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
      <AlertTriangle size={32} className="text-oxide" />
      <h2 className="font-display text-xl font-medium">Something went wrong</h2>
      <p className="text-sm text-bedrock/60 dark:text-parchment/60">
        This page hit an unexpected error. You can try again, or head back home.
      </p>
      <Button onClick={reset} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
