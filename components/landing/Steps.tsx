import { ImagePlus, Layers3, Palette } from "lucide-react";

const steps = [
  {
    icon: ImagePlus,
    title: "Upload",
    copy: "Drop a clear portrait. We lock pose, lighting, and identity before any styling begins.",
  },
  {
    icon: Layers3,
    title: "Select",
    copy: "Add the garment asset and choose upper, lower, or full-body so the drape lands in the right zone.",
  },
  {
    icon: Palette,
    title: "Style",
    copy: "Generate the look, compare before and after, then download a production-ready image asset.",
  },
];

export function Steps() {
  return (
    <section id="steps" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-300">Workflow</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Upload. Select. Style.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="relative rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                0{index + 1}
              </span>
              <step.icon className="mt-4 h-6 w-6 text-white" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
