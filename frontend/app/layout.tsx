import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { QueryProvider } from "@/lib/query-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Soil Health Monitoring System | ML-Powered Soil Analysis",
    template: "%s | Soil Health Monitoring",
  },
  description:
    "Predict soil health from pH, nitrogen, phosphorus, and potassium levels. Get confidence-scored predictions, fertilizer recommendations, and suitable crop suggestions, powered by machine learning.",
  keywords: [
    "soil health monitoring",
    "machine learning agriculture",
    "soil pH nitrogen potassium",
    "fertilizer recommendation system",
    "precision agriculture",
  ],
  openGraph: {
    title: "Soil Health Monitoring System",
    description:
      "ML-powered soil health prediction and fertilizer recommendations for farmers, researchers, and agriculture students.",
    type: "website",
    siteName: "Soil Health Monitoring",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soil Health Monitoring System",
    description: "ML-powered soil health prediction and fertilizer recommendations.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-body`}
      >
        <ThemeProvider>
          <QueryProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
              <Footer />
            </div>
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
