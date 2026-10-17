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
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Quick Trial Samples</span>
        </div>
        <button
          type="button"
          disabled={disabled || Boolean(loadingId)}
          onClick={() => void handleTryPresetPair()}
          className="inline-flex items-center gap-1 rounded-full border border-teal-400/40 bg-teal-400/10 px-2.5 py-1 text-[11px] font-medium text-teal-300 transition-all duration-200 hover:bg-teal-400/20 disabled:opacity-50"
        >
          {loadingId === "preset-pair" ? (
            <LoaderCircle className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          Load Starter Pair
        </button>
      </div>

      <div className="space-y-3">
        {/* Sample Portraits */}
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-slate-400">Sample Portrait Models</p>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_PORTRAITS.map((item) => {
              const isLoading = loadingId === item.id;
              const isSelected = selectedPortraitName?.includes(item.filename.replace(".png", ""));

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled || Boolean(loadingId)}
                  onClick={() => void handleSelectSample(item, "portrait")}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-xl border p-1.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-teal-400 bg-teal-400/10 shadow-sm shadow-teal-500/20"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                  } disabled:opacity-50`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-950">
                    <img
                      src={item.url}
                      alt={item.label}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs">
                        <LoaderCircle className="h-4 w-4 animate-spin text-teal-400" />
                      </div>
                    ) : isSelected ? (
                      <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-slate-950">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    ) : null}
                  </div>
                  <span className="mt-1 line-clamp-1 w-full text-center text-[10px] font-medium text-slate-300">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sample Garments */}
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-slate-400">Sample Garments (Full Body)</p>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_GARMENTS.map((item) => {
              const isLoading = loadingId === item.id;
              const isSelected = selectedGarmentName?.includes(item.filename.replace(".png", ""));

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disabled || Boolean(loadingId)}
                  onClick={() => void handleSelectSample(item, "garment")}
                  className={`group relative flex flex-col items-center overflow-hidden rounded-xl border p-1.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-teal-400 bg-teal-400/10 shadow-sm shadow-teal-500/20"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                  } disabled:opacity-50`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-950">
                    <img
                      src={item.url}
                      alt={item.label}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs">
                        <LoaderCircle className="h-4 w-4 animate-spin text-teal-400" />
                      </div>
                    ) : isSelected ? (
                      <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-slate-950">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    ) : null}
                  </div>
                  <span className="mt-1 line-clamp-1 w-full text-center text-[10px] font-medium text-slate-300">
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
