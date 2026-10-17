"use client";

import { Download, Sparkles, X } from "lucide-react";
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
    <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Output viewport</h2>
          <p className="text-sm text-slate-400">
            {resultUrl
              ? "Completed virtual fitting"
              : portraitUrl
              ? "Staged canvas • Awaiting generation"
              : "Pixel-perfect try-on canvas"}
          </p>
        </div>

        {resultUrl ? (
          <div className="flex items-center gap-2">
            {onClearResult ? (
              <button
                type="button"
                onClick={onClearResult}
                className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 transition-all hover:border-slate-700 hover:text-slate-200"
                title="Clear current result"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear result
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => void downloadImageAsset(resultUrl, "vibelt-tryon.png")}
              className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:bg-teal-300"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Image Asset
            </button>
          </div>
        ) : null}
      </div>

      {generating ? (
        <CanvasShimmer status={status} />
      ) : resultUrl && portraitUrl ? (
        <BeforeAfterSlider
          beforeSrc={portraitUrl}
          afterSrc={resultUrl}
          className="aspect-[3/4] w-full"
        />
      ) : resultUrl ? (
        <img
          src={resultUrl}
          alt="Generated try-on look"
          className="aspect-[3/4] w-full rounded-2xl object-cover"
        />
      ) : portraitUrl ? (
        /* Staged preview state: Shows currently selected portrait ready for try-on */
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <img
            src={portraitUrl}
            alt="Staged portrait awaiting generation"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-center">
            <div className="mx-auto flex max-w-sm flex-col items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-xl backdrop-blur-md">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/30">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold text-white">New Assets Staged</p>
              <p className="text-xs text-slate-400">
                {garmentUrl
                  ? "Portrait and garment are loaded. Click 'Generate Look' to drape fabric."
                  : "Upload a garment asset to complete your trial composition."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex aspect-[3/4] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-6 text-center">
          <p className="max-w-xs text-sm leading-6 text-slate-400">
            Your styled portrait will appear here. Upload a portrait and garment, then generate a look.
          </p>
        </div>
      )}
    </section>
  );
}
