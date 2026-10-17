"use client";

import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { useAuth } from "@/components/providers/AuthProvider";

export function Hero() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleStart = () => {
    if (loading) return;
    router.push(user ? "/studio" : "/login");
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32 bg-mesh-radial">
      {/* Radiant ambient background light orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-amber-600/5 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-stone-300/20 blur-[140px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7">
            {/* Luxury Monogram Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 backdrop-blur-xl shadow-xs">
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-stone-700 font-bold">
                HAUTE COUTURE × NEURAL TOPOLOGY
              </span>
            </div>

            {/* Editorial Title */}
            <h1 className="font-editorial text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl lg:text-7xl leading-[1.08]">
              Dress Any Look.
              <span className="block mt-1 font-editorial italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-amber-700">
                In Instant Photoreal Splendor.
              </span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-stone-600 font-normal">
              vibeIt transforms a single portrait and garment into runway-grade fittings in seconds.
              Experience genuine fabric weight, micro-crease shadow mapping, and skin-true luminance with zero fitting-room friction.
            </p>

            {/* Action Bar */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleStart}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-stone-900 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-stone-900/15 hover:bg-stone-800 hover:scale-[1.02] border border-stone-800 transition-all duration-300 disabled:opacity-70 cursor-pointer"
              >
                Enter Virtual Atelier
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </button>

              <a
                href="#steps"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-wider text-stone-800 shadow-xs hover:border-stone-400 hover:bg-stone-50 transition-all duration-300 cursor-pointer"
              >
                Inspect Protocol
              </a>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-stone-200/80 pt-8 max-w-lg">
              <div>
                <p className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">99.4%</p>
                <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">Drape Accuracy</p>
              </div>
              <div className="border-l border-stone-200/80 pl-4">
                <p className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">&lt; 1.2s</p>
                <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">Neural Latency</p>
              </div>
              <div className="border-l border-stone-200/80 pl-4">
                <p className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">4K HDR</p>
                <p className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-stone-500 font-semibold">Asset Fidelity</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Comparison Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backing decorative glow */}
              <div className="absolute -inset-4 rounded-3xl bg-amber-600/5 blur-2xl opacity-60" />
              
              <BeforeAfterSlider
                beforeSrc="/small_clothes_02_1a91c0fa5f.png"
                afterSrc="/sample_result.png"
                className="aspect-[3/4] max-h-[560px] w-full"
              />

              {/* Verified Badge Overlay */}
              <div className="mt-4 flex items-center justify-between px-2 text-[11px] font-mono text-stone-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-stone-700" />
                  Preserves biometric geometry
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-700" />
                  Studio lighting matched
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Brand & Atelier Endorsements */}
        <div className="mt-20 border-y border-stone-200/80 py-8">
          <p className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-stone-500 font-semibold mb-6">
            ENGINEERED FOR INDEPENDENT DESIGNERS, DIGITAL HOUSES & CREATIVE STUDIOS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-70 hover:opacity-100 transition-all duration-500">
            <span className="font-editorial text-lg tracking-[0.2em] font-semibold text-stone-700 hover:text-stone-950">MAISON LUMIÈRE</span>
            <span className="font-editorial text-lg tracking-[0.2em] font-semibold text-stone-700 hover:text-stone-950">VOGUE TECH</span>
            <span className="font-editorial text-lg tracking-[0.2em] font-semibold text-stone-700 hover:text-stone-950">ATELIER NOIR</span>
            <span className="font-editorial text-lg tracking-[0.2em] font-semibold text-stone-700 hover:text-stone-950">MODA DIGITAL</span>
            <span className="font-editorial text-lg tracking-[0.2em] font-semibold text-stone-700 hover:text-stone-950">PARIS RUNWAY LAB</span>
          </div>
        </div>
      </div>
    </section>
  );
}
