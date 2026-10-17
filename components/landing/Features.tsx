import { ScanFace, Shirt, Sparkles, Wand2 } from "lucide-react";

const features = [
  {
    icon: ScanFace,
    title: "Skin-true lighting",
    copy: "The model preserves complexion, pose, and camera grain so the garment feels photographed, not pasted.",
  },
  {
    icon: Shirt,
    title: "Fabric-aware drape",
    copy: "Silks, knits, and structured tailoring inherit weight, folds, and shadow from the source garment.",
  },
  {
    icon: Wand2,
    title: "Zone-precise styling",
    copy: "Target upper, lower, or full-body looks without disturbing the rest of the portrait.",
  },
  {
    icon: Sparkles,
    title: "Studio-grade output",
    copy: "Download pixel-perfect assets ready for lookbooks, PDP galleries, and social drops.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-300">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A fitting room that never closes.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:border-teal-400/50 hover:scale-[1.02]"
            >
              <feature.icon className="h-6 w-6 text-teal-300" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
