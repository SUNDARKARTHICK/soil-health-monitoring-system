import Link from "next/link";
import { Sprout, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-loam/10 bg-parchment dark:border-parchment/10 dark:bg-bedrock">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-medium">
              <Sprout size={18} className="text-chlorophyll" />
              Soil Health Monitoring
            </div>
            <p className="mt-3 max-w-xs text-sm text-bedrock/60 dark:text-parchment/60">
              A machine-learning system that reads soil parameters the way an
              agronomist reads a horizon profile, layer by layer.
            </p>
          </div>

          <div>
            <h4 className="font-body text-sm font-medium">Navigate</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-bedrock/60 dark:text-parchment/60">
              <Link href="/predict" className="hover:text-bedrock dark:hover:text-parchment">
                Run a prediction
              </Link>
              <Link href="/about" className="hover:text-bedrock dark:hover:text-parchment">
                About the project
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-body text-sm font-medium">Developer</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-bedrock/60 dark:text-parchment/60">
              <span>Built as a full-stack ML portfolio project</span>
              <div className="flex gap-3 pt-1">
                <Github size={18} />
                <Linkedin size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-loam/10 pt-6 text-xs text-bedrock/40 dark:border-parchment/10 dark:text-parchment/40">
          © {new Date().getFullYear()} Soil Health Monitoring System. Built with Next.js, FastAPI, and scikit-learn.
        </div>
      </div>
    </footer>
  );
}
