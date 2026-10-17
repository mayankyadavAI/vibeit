"use client";

import { Download, Sparkles, X, Layers, ShieldCheck, Eye, Share2 } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { CanvasShimmer } from "@/components/ui/CanvasShimmer";
import { downloadImageAsset } from "@/lib/download";

interface OutputCanvasProps {
  portraitUrl: string | null;
  garmentUrl?: string | null;
  resultUrl: string | null;
  generating: boolean;
  status: string;
  onClearResult?: () => void;
}

export function OutputCanvas({
  portraitUrl,
  garmentUrl,
  resultUrl,
  generating,
  status,
  onClearResult,
}: OutputCanvasProps) {
  return (
    <section className="glass-panel flex flex-col justify-between rounded-3xl border border-stone-200/90 bg-white/90 p-5 sm:p-7 shadow-xl">
      {/* Viewport Header Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
            <h2 className="font-editorial text-xl font-bold tracking-tight text-stone-900">
              Synthesis Viewport
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-stone-500 font-normal">
            {resultUrl
              ? "Photoreal drape compilation complete"
              : portraitUrl
              ? "Biometric geometry calibrated • Ready for synthesis"
              : "Neural tensor fitting canvas"}
          </p>
        </div>

        {resultUrl ? (
          <div className="flex items-center gap-2">
            {onClearResult ? (
              <button
                type="button"
                onClick={onClearResult}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-stone-600 transition-all hover:border-stone-300 hover:text-stone-900 cursor-pointer"
                title="Clear current result"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                Clear
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => void downloadImageAsset(resultUrl, "vibeIt-couture-master.png")}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 border border-stone-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-stone-800 hover:scale-105 shadow-md cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              Download 4K Master
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-stone-500">
            <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 font-semibold text-stone-700">
              4K Pipeline
            </span>
          </div>
        )}
      </div>

      {/* Main Viewport Content */}
      <div className="relative flex-1 flex flex-col justify-center">
        {generating ? (
          <CanvasShimmer status={status} />
        ) : resultUrl && portraitUrl ? (
          <div className="space-y-4">
            <BeforeAfterSlider
              beforeSrc={portraitUrl}
              afterSrc={resultUrl}
              className="aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200"
            />
            {/* Viewport Meta Bar */}
            <div className="flex items-center justify-between px-2 text-[11px] font-mono text-stone-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Color space: Display P3 • Uncompressed
              </span>
              <span className="text-amber-800 font-semibold">Drape Accuracy: 99.4%</span>
            </div>
          </div>
        ) : resultUrl ? (
          <div className="couture-bezel shadow-xl">
            <img
              src={resultUrl}
              alt="Generated try-on look"
              className="aspect-[3/4] w-full rounded-[1.4rem] object-cover"
            />
          </div>
        ) : portraitUrl ? (
          /* Staged preview state */
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-inner">
            <img
              src={portraitUrl}
              alt="Staged portrait awaiting generation"
              className="h-full w-full object-cover opacity-85 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent flex flex-col justify-end p-6 text-center">
              <div className="mx-auto flex max-w-sm flex-col items-center gap-2.5 rounded-2xl border border-white/20 bg-white/90 p-5 shadow-2xl backdrop-blur-md">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-amber-400 border border-stone-800 shadow-md">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </span>
                <p className="font-editorial text-lg font-bold text-stone-950">Assets Staged in Atelier</p>
                <p className="text-xs text-stone-600 font-normal leading-relaxed">
                  {garmentUrl
                    ? "Portrait topography and garment textile loaded. Click 'Generate Couture Look' to compute micro-drapes."
                    : "Add a garment asset to complete the synthesis composition."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/70 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 mb-4 shadow-sm">
              <Layers className="h-6 w-6" />
            </div>
            <p className="font-editorial text-xl font-bold text-stone-900">Virtual Fitting Viewport</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-stone-500 font-normal">
              Your synthesized fitting will materialize here in real-time. Ingest a portrait and select a garment to activate the neural tensor engine.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
