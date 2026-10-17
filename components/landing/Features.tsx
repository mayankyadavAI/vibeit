"use client";

import { ScanFace, Shirt, Sparkles, Wand2, Cpu, Eye, ShieldCheck, Layers3 } from "lucide-react";

const capabilities = [
  {
    icon: ScanFace,
    tag: "Biometric Radiance",
    title: "Skin-True Illumination & Complexion",
    copy: "Deep neural radiance caching preserves exact skin undertones, natural pores, and environmental key-lighting. No uncanny plastic bleaching.",
    accent: "from-amber-600/10 to-transparent",
    iconColor: "text-stone-900",
    iconBg: "bg-stone-100 border-stone-200",
    dotColor: "bg-amber-600",
    colSpan: "lg:col-span-7",
  },
  {
    icon: Shirt,
    tag: "Fabric Physics",
    title: "Weight & Micro-Crease Dynamics",
    copy: "Heavy virgin wools drape with true gravitational weight; liquid silks fluidly cascade around curves with authentic specular highlights.",
    accent: "from-stone-400/10 to-transparent",
    iconColor: "text-stone-900",
    iconBg: "bg-stone-100 border-stone-200",
    dotColor: "bg-stone-700",
    colSpan: "lg:col-span-5",
  },
  {
    icon: Layers3,
    tag: "Multi-Zone",
    title: "Zone-Specific Silhouettes",
    copy: "Isolate upper bodice, trousers/skirts, or full evening ensembles without shifting undisturbed garments or natural hair flow.",
    accent: "from-amber-600/10 to-transparent",
    iconColor: "text-stone-900",
    iconBg: "bg-stone-100 border-stone-200",
    dotColor: "bg-amber-600",
    colSpan: "lg:col-span-4",
  },
  {
    icon: Cpu,
    tag: "Architecture",
    title: "Sub-Second Neural Topology",
    copy: "Trained on millions of high-fashion catalog pairs, synthesizing photoreal drapes at lightning speeds.",
    accent: "from-stone-400/10 to-transparent",
    iconColor: "text-stone-900",
    iconBg: "bg-stone-100 border-stone-200",
    dotColor: "bg-stone-700",
    colSpan: "lg:col-span-4",
  },
  {
    icon: Sparkles,
    tag: "Master Output",
    title: "Editorial 4K Resolution Pipeline",
    copy: "Production-ready exports calibrated for digital lookbooks, luxury e-commerce PDP galleries, and high-res campaigns.",
    accent: "from-amber-600/10 to-transparent",
    iconColor: "text-stone-900",
    iconBg: "bg-stone-100 border-stone-200",
    dotColor: "bg-amber-600",
    colSpan: "lg:col-span-4",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 relative px-4 py-24 sm:px-8 bg-mesh-radial">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-700 font-bold">
              Couture Engineering
            </span>
          </div>
          <h2 className="mt-5 font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950">
            The Science Behind
            <span className="block font-editorial italic text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-700 to-amber-700">
              Photoreal Digital Drapery.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-stone-600 max-w-2xl font-normal">
            Every garment rendered by vibeIt undergoes algorithmic weight simulation, ray alignment, and micro-texture blending for uncompromising visual realism.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {capabilities.map((item) => (
            <article
              key={item.title}
              className={`glass-card group relative overflow-hidden rounded-3xl p-8 lg:p-10 ${item.colSpan}`}
            >
              {/* Vibrant top-corner gradient light */}
              <div
                className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br ${item.accent} blur-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.iconBg} ${item.iconColor} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-stone-200 bg-stone-100/90 px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-stone-700 font-semibold">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 font-editorial text-2xl font-bold tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-600 font-normal">
                    {item.copy}
                  </p>
                </div>

                {/* Micro accent corner line */}
                <div className="mt-8 flex items-center gap-2 pt-4 border-t border-stone-200/80 text-[11px] font-mono text-stone-500 font-semibold">
                  <span className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`} />
                  <span>Algorithmic fidelity verified</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
