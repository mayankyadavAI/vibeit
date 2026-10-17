"use client";

import type { ApparelCategory } from "@/types/tryon";

const options: { value: ApparelCategory; label: string }[] = [
  { value: "upper_body", label: "Upper body" },
  { value: "lower_body", label: "Lower body" },
  { value: "full_body", label: "Full body" },
];

interface CategoryToggleProps {
  value: ApparelCategory;
  onChange: (value: ApparelCategory) => void;
}

export function CategoryToggle({ value, onChange }: CategoryToggleProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-slate-300">Apparel zone</legend>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                selected
                  ? "border-teal-400 bg-teal-400 text-slate-950"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-teal-400 hover:scale-[1.02]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
