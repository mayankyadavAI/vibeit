import { Footer } from "@/components/layout/Footer";
import { AppNav } from "@/components/layout/AppNav";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Pricing } from "@/components/landing/Pricing";
import { Steps } from "@/components/landing/Steps";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <AppNav />
      <main>
        <Hero />
        <Features />
        <Steps />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
