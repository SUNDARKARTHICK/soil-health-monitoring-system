import { Hero } from "@/components/landing/hero";
import { FeatureCards } from "@/components/landing/feature-cards";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TechStack } from "@/components/landing/tech-stack";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <TechStack />
    </>
  );
}
