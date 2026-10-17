"use client";

import { DragEvent, useRef, useState } from "react";
import { UploadCloud, Camera, Check, RefreshCw } from "lucide-react";

interface DropzoneProps {
  label: string;
  hint: string;
  previewUrl: string | null;
  uploading: boolean;
  onFile: (file: File) => void;
  onCameraClick?: () => void;
}

export function Dropzone({
  label,
  hint,
  previewUrl,
  uploading,
  onFile,
  onCameraClick,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);

  const acceptFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    onFile(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActive(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
      className={`relative flex min-h-[240px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 transition-all duration-300 p-4 text-center cursor-pointer ${active
          ? "border-stone-900 bg-stone-50 scale-[1.01] shadow-lg"
          : previewUrl
            ? "border-stone-800 bg-white shadow-md"
            : "border-dashed border-stone-300 bg-white hover:border-stone-500 hover:bg-stone-50/80 shadow-sm"
        }`}
      aria-label={label}
    >
      {/* Background preview image if uploaded */}
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt={`${label} preview`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        </>
      ) : null}

      <div
        className={`relative z-10 flex flex-col items-center gap-2.5 ${previewUrl
            ? "mt-auto rounded-xl border border-stone-200/90 bg-white/95 px-4 py-2.5 backdrop-blur-md shadow-lg"
            : ""
          }`}
      >
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${previewUrl ? "border-stone-800 bg-stone-900 text-amber-400" : "border-stone-200 bg-stone-100 text-stone-800"
          } shadow-sm`}>
          {previewUrl ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <UploadCloud className="h-5 w-5" aria-hidden="true" />
          )}
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-stone-900">
            {label}
          </p>
          <p className="mt-0.5 text-[11px] text-stone-500 font-normal">
            {uploading ? "Ingesting to secure tensor vault..." : hint}
          </p>
        </div>

        {onCameraClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCameraClick();
            }}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-3.5 py-1 text-[11px] font-mono uppercase tracking-wider text-stone-800 font-semibold transition-all hover:bg-stone-900 hover:text-white hover:border-stone-900 hover:scale-105 cursor-pointer shadow-sm"
          >
            <Camera className="h-3 w-3" />
            Live Selfie
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => acceptFile(event.target.files?.[0])}
      />
    </div>
  );
}
