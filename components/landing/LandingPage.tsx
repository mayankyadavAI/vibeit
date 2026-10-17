import { Footer } from "@/components/layout/Footer";
import { AppNav } from "@/components/layout/AppNav";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { RunwayShowcase } from "@/components/landing/RunwayShowcase";
import { Pricing } from "@/components/landing/Pricing";
import { Steps } from "@/components/landing/Steps";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 flex flex-col">
      <AppNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Steps />
        <RunwayShowcase />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
