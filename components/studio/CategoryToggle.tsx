"use client";

import { Shirt, Sparkles, Layers } from "lucide-react";
import type { ApparelCategory } from "@/types/tryon";

const options: { value: ApparelCategory; label: string; icon: typeof Shirt; sublabel: string }[] = [
  { value: "upper_body", label: "Upper Bodice", icon: Shirt, sublabel: "Tops, jackets, blazers" },
  { value: "lower_body", label: "Lower Silhouette", icon: Layers, sublabel: "Trousers, skirts, pants" },
  { value: "full_body", label: "Full Ensemble", icon: Sparkles, sublabel: "Dresses, suits, overcoats" },
];

interface CategoryToggleProps {
  value: ApparelCategory;
  onChange: (value: ApparelCategory) => void;
}

export function CategoryToggle({ value, onChange }: CategoryToggleProps) {
  return (
    <fieldset>
      <div className="mb-2.5 flex items-center justify-between">
        <legend className="text-xs font-mono uppercase tracking-[0.2em] text-stone-700 font-bold">
          Apparel Target Zone
        </legend>
        <span className="text-[10px] font-mono text-stone-500 font-semibold">3D Plane Segmentation</span>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-stone-100/90 p-1.5 border border-stone-200/90 shadow-inner">
        {options.map((option) => {
          const selected = option.value === value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`group flex flex-col items-center justify-center rounded-xl py-3 px-2 text-center transition-all duration-300 cursor-pointer ${
                selected
                  ? "bg-stone-900 text-white font-semibold shadow-sm scale-[1.01]"
                  : "bg-transparent text-stone-600 hover:text-stone-900 hover:bg-white/80"
              }`}
            >
              <Icon className={`h-4 w-4 mb-1 transition-transform group-hover:scale-110 ${selected ? "text-amber-400" : "text-stone-700"}`} />
              <span className="text-xs font-semibold tracking-tight">{option.label}</span>
              <span className={`text-[9px] font-mono tracking-normal mt-0.5 ${selected ? "text-stone-300" : "text-stone-500"}`}>
                {option.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
