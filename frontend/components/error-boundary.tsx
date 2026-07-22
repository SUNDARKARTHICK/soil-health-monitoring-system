"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
          <AlertTriangle size={32} className="text-oxide" />
          <h2 className="font-display text-xl font-medium">Something went wrong</h2>
          <p className="text-sm text-bedrock/60 dark:text-parchment/60">
            This part of the page hit an unexpected error. Reloading usually fixes it.
          </p>
          <Button onClick={() => this.setState({ hasError: false })} variant="secondary">
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
