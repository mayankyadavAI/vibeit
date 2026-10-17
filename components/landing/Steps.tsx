"use client";

import { ImagePlus, Layers3, Palette, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    phase: "PHASE 01",
    num: "01",
    title: "Portrait Biometric Calibration",
    subtitle: "Identity & Light Field Lock",
    copy: "Upload a clean portrait. Our vision model establishes 3D facial planes, shoulder topology, and ambient light direction so identity remains intact.",
    icon: ImagePlus,
    tag: "3D Plane Matrix",
    color: "text-amber-500",
    bg: "bg-stone-900 border-stone-800",
    badge: "text-stone-900 font-bold",
    dot: "bg-amber-600",
  },
  {
    phase: "PHASE 02",
    num: "02",
    title: "Garment Extraction & Silhouette",
    subtitle: "Fabric Physics & Zone Mask",
    copy: "Select your desired garment and designate the apparel zone—upper, lower, or full-length. The engine segments textile boundaries instantly.",
    icon: Layers3,
    tag: "Zone Boundary Mapping",
    color: "text-amber-500",
    bg: "bg-stone-900 border-stone-800",
    badge: "text-stone-900 font-bold",
    dot: "bg-amber-600",
  },
  {
    phase: "PHASE 03",
    num: "03",
    title: "Couture Drape & Synthesis",
    subtitle: "Instant Ray-Traced Realism",
    copy: "Synthesize the final fitting. Compare micro-creases in the interactive viewport, inspect fabric tension, and download production-ready 4K assets.",
    icon: Palette,
    tag: "Tensor Synthesis",
    color: "text-amber-500",
    bg: "bg-stone-900 border-stone-800",
    badge: "text-stone-900 font-bold",
    dot: "bg-stone-900",
  },
];

export function Steps() {
  return (
    <section id="steps" className="scroll-mt-24 relative px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 shadow-sm">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-700 font-semibold">
              The Three-Stage Protocol
            </span>
          </div>
          <h2 className="mt-5 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950">
            From Raw Asset to
            <span className="block font-editorial italic text-stone-700">
              Couture Masterpiece.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-stone-600 max-w-2xl font-normal">
            A frictionless pipeline engineered to replace expensive physical photoshoot cycles with instantaneous digital fittings.
          </p>
        </div>

        {/* Workflow Cards with Connecting Illuminations */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {/* Refined connecting subtle stone line */}
          <div className="pointer-events-none absolute top-1/2 left-0 right-0 h-px bg-stone-200 hidden md:block -translate-y-12" />

          {steps.map((step) => (
            <article
              key={step.num}
              className="glass-card group relative flex flex-col justify-between rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-sm hover:border-stone-400 hover:shadow-xl transition-all"
            >
              {/* Card Top Strip */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-stone-900 font-semibold">
                    {step.phase}
                  </span>
                  <span className="font-editorial text-3xl font-bold text-stone-300 group-hover:text-stone-700 transition-colors">
                    {step.num}
                  </span>
                </div>

                {/* Icon Box */}
                <div className={`mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${step.bg} ${step.color} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <p className="mt-6 text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold">
                  {step.subtitle}
                </p>
                <h3 className="mt-1 font-editorial text-2xl font-bold text-stone-900 group-hover:text-stone-950 transition-colors">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600 font-normal">
                  {step.copy}
                </p>
              </div>

              {/* Tag pill at bottom */}
              <div className="mt-8 pt-6 border-t border-stone-200/80 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-semibold">
                  {step.tag}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${step.dot} shadow-sm`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
