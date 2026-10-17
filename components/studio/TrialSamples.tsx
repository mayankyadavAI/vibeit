"use client";

import { useState } from "react";
import { Sparkles, Check, LoaderCircle } from "lucide-react";
import type { ApparelCategory } from "@/types/tryon";

interface SampleItem {
  id: string;
  label: string;
  url: string;
  filename: string;
  category?: ApparelCategory;
}

const SAMPLE_PORTRAITS: SampleItem[] = [
  {
    id: "portrait-1",
    label: "Model Alpha",
    url: "/samples/portfolio/small_clothes_01_10be1e1a9b.png",
    filename: "sample_model_alpha.png",
  },
  {
    id: "portrait-2",
    label: "Model Beta",
    url: "/samples/portfolio/small_clothes_02_1a91c0fa5f.png",
    filename: "sample_model_beta.png",
  },
  {
    id: "portrait-3",
    label: "Model Gamma",
    url: "/samples/portfolio/small_clothes_04_441e848298.png",
    filename: "sample_model_gamma.png",
  },
];

const SAMPLE_GARMENTS: SampleItem[] = [
  {
    id: "garment-1",
    label: "Couture Look A",
    url: "/samples/garment/small_clothes_reference_full_body_05_6364e97f94.png",
    filename: "sample_garment_look_a.png",
    category: "full_body",
  },
  {
    id: "garment-2",
    label: "Couture Look B",
    url: "/samples/garment/small_clothes_reference_full_body_06_ec697568e1.png",
    filename: "sample_garment_look_b.png",
    category: "full_body",
  },
  {
    id: "garment-3",
    label: "Couture Look C",
    url: "/samples/garment/small_clothes_reference_full_body_09_e7651cae37.png",
    filename: "sample_garment_look_c.png",
    category: "full_body",
  },
];

interface TrialSamplesProps {
  onSelectPortrait: (file: File) => Promise<void>;
  onSelectGarment: (file: File, suggestedCategory?: ApparelCategory) => Promise<void>;
  selectedPortraitName?: string | null;
  selectedGarmentName?: string | null;
  disabled?: boolean;
}

export function TrialSamples({
  onSelectPortrait,
  onSelectGarment,
  selectedPortraitName,
  selectedGarmentName,
  disabled = false,
}: TrialSamplesProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSelectSample = async (item: SampleItem, type: "portrait" | "garment") => {
    if (disabled || loadingId) return;
    setLoadingId(item.id);
    try {
      const response = await fetch(item.url);
      if (!response.ok) throw new Error(`Could not load sample ${item.label}`);
      const blob = await response.blob();
      const file = new File([blob], item.filename, { type: "image/png" });

      if (type === "portrait") {
        await onSelectPortrait(file);
      } else {
        await onSelectGarment(file, item.category);
      }
    } catch (err) {
      console.error("Failed to load trial sample:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleTryPresetPair = async () => {
    if (disabled || loadingId) return;
    setLoadingId("preset-pair");
    try {
      const portraitItem = SAMPLE_PORTRAITS[0];
      const garmentItem = SAMPLE_GARMENTS[0];

      const [pRes, gRes] = await Promise.all([
        fetch(portraitItem.url),
        fetch(garmentItem.url),
      ]);
      const [pBlob, gBlob] = await Promise.all([pRes.blob(), gRes.blob()]);

      const pFile = new File([pBlob], portraitItem.filename, { type: "image/png" });
      const gFile = new File([gBlob], garmentItem.filename, { type: "image/png" });

      await onSelectPortrait(pFile);
      await onSelectGarment(gFile, garmentItem.category);
    } catch (err) {
      console.error("Failed to load preset trial pair:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-stone-200/90 bg-white/90 p-4 sm:p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-stone-900 text-amber-400 border border-stone-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-stone-900">
              Couture Preset Library
            </span>
            <p className="text-[10px] text-stone-500 font-normal">One-click benchmark pairings</p>
          </div>
        </div>
        <button
          type="button"
          disabled={disabled || Boolean(loadingId)}
          onClick={() => void handleTryPresetPair()}
          className="group inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-stone-800 transition-all duration-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 hover:scale-105 disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loadingId === "preset-pair" ? (
            <LoaderCircle className="h-3 w-3 animate-spin text-stone-700" />
          ) : (
            <Sparkles className="h-3 w-3 text-stone-700 transition-transform group-hover:rotate-12 group-hover:text-amber-400" />
          )}
          Load Benchmark Pair
        </button>
      </div>

      <div className="space-y-4">
        {/* Sample Portraits */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
              Curated Model Portraits
            </p>
            <span className="text-[10px] font-mono text-stone-500 font-semibold">Lighting calibrated</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {SAMPLE_PORTRAITS.map((item) => {
              const isLoading = loadingId === item.id;
              const isSelected = selectedPortraitName?.includes(item.filename.replace(".png", ""));

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled || Boolean(loadingId)}
                  onClick={() => void handleSelectSample(item, "portrait")}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-xl border p-1.5 text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-stone-900 bg-stone-50 shadow-md ring-2 ring-stone-900/20 scale-[1.01]"
                      : "border-stone-200/90 bg-stone-50/90 hover:border-stone-400 hover:bg-white"
                  } disabled:opacity-50`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100">
                    <img
                      src={item.url}
                      alt={item.label}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xs">
                        <LoaderCircle className="h-5 w-5 animate-spin text-stone-700" />
                      </div>
                    ) : isSelected ? (
                      <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-amber-400 shadow-md">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    ) : null}
                  </div>
                  <span className="mt-1.5 line-clamp-1 w-full text-center text-[10px] font-mono uppercase tracking-wider font-semibold text-stone-700 group-hover:text-stone-900">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sample Garments */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-mono uppercase tracking-wider text-stone-700 font-bold">
              Runway Garments (Full Length)
            </p>
            <span className="text-[10px] font-mono text-stone-500 font-semibold">Couture textiles</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {SAMPLE_GARMENTS.map((item) => {
              const isLoading = loadingId === item.id;
              const isSelected = selectedGarmentName?.includes(item.filename.replace(".png", ""));

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled || Boolean(loadingId)}
                  onClick={() => void handleSelectSample(item, "garment")}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-xl border p-1.5 text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-stone-900 bg-stone-50 shadow-md ring-2 ring-stone-900/20 scale-[1.01]"
                      : "border-stone-200/90 bg-stone-50/90 hover:border-stone-400 hover:bg-white"
                  } disabled:opacity-50`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100">
                    <img
                      src={item.url}
                      alt={item.label}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xs">
                        <LoaderCircle className="h-5 w-5 animate-spin text-stone-700" />
                      </div>
                    ) : isSelected ? (
                      <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-amber-400 shadow-md">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    ) : null}
                  </div>
                  <span className="mt-1.5 line-clamp-1 w-full text-center text-[10px] font-mono uppercase tracking-wider font-semibold text-stone-700 group-hover:text-stone-900">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
