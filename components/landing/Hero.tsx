"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { useAuth } from "@/components/providers/AuthProvider";

export function Hero() {
  const { user, loading } = useAuth();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-teal-300">
            Virtual fitting, perfected
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Dress any look.
            <span className="block text-teal-300">Instantly.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            vibeIt turns a portrait and a garment into a couture-grade try-on in seconds.
            Photoreal fabric drape, skin-true lighting, zero fitting-room friction.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push(user ? "/studio" : "/login")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:bg-teal-300 disabled:opacity-70"
            >
              Start a fitting
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href="#steps"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-teal-400 hover:text-teal-300"
            >
              See the workflow
            </a>
          </div>
        </div>
        <BeforeAfterSlider
          beforeSrc="/small_clothes_02_1a91c0fa5f.png"
          afterSrc="/sample_result.png"
          className="aspect-[3/4] max-h-[560px] w-full"
        />
      </div>
    </section>
  );
}
