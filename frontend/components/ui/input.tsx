import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-sh bg-white/70 px-3 font-mono text-sm hairline-border",
          "dark:bg-white/[0.04] dark:text-parchment",
          "placeholder:text-bedrock/40 dark:placeholder:text-parchment/30",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
