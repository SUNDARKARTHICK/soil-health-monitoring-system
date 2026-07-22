"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sprout } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/predict", label: "Predict" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-loam/10 bg-parchment/80 backdrop-blur-md dark:border-parchment/10 dark:bg-bedrock/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium">
          <Sprout size={20} className="text-chlorophyll" />
          Soil Health
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-bedrock/70 transition-colors hover:text-bedrock dark:text-parchment/70 dark:hover:text-parchment"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/predict" className={buttonVariants({ size: "sm" })}>
            Check my soil
          </Link>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-loam/10 px-6 pb-4 md:hidden dark:border-parchment/10">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sh px-2 py-2 text-sm hover:bg-loam/5 dark:hover:bg-parchment/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2">
              <ThemeToggle />
              <Link
                href="/predict"
                onClick={() => setOpen(false)}
                className={buttonVariants({ size: "sm", className: "grow ml-3" })}
              >
                Check my soil
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
