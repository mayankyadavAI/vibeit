"use client";

import { DragEvent, useRef, useState } from "react";
import { UploadCloud, Camera } from "lucide-react";

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

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setActive(false);
    acceptFile(event.dataTransfer.files[0]);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
      className={`relative flex min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
        active
          ? "scale-[1.02] border-teal-400 bg-teal-400/10"
          : "border-slate-700 bg-slate-900/60 hover:scale-[1.02] hover:border-teal-400"
      }`}
      aria-label={label}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`${label} preview`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div
        className={`relative z-10 flex flex-col items-center gap-2 ${
          previewUrl ? "rounded-xl bg-slate-950/70 px-4 py-3" : ""
        }`}
      >
        <UploadCloud className="h-6 w-6 text-teal-300" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-400">
          {uploading ? "Uploading to tryon-assets..." : hint}
        </p>

        {onCameraClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCameraClick();
            }}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300 transition-all hover:bg-teal-400/20"
          >
            <Camera className="h-3.5 w-3.5" />
            Live Camera
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
    </button>
  );
}
