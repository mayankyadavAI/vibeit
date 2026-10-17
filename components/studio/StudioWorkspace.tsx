"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Camera, RotateCcw, Sparkles } from "lucide-react";
import { Dropzone } from "@/components/studio/Dropzone";
import { CategoryToggle } from "@/components/studio/CategoryToggle";
import { TrialSamples } from "@/components/studio/TrialSamples";
import { OutputCanvas } from "@/components/studio/OutputCanvas";
import CameraCapture from "@/components/CameraCapture";
import { AppNav } from "@/components/layout/AppNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { insforge } from "@/utils/insforge";
import { logTryOnGeneration } from "@/app/actions/history";
import type { ApparelCategory, UploadedAsset } from "@/types/tryon";

const PROCESSING_MESSAGES = [
  "AI is dressing your photo...",
  "Draping fabrics...",
  "Analyzing skin tone frames...",
];

export function StudioWorkspace() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [portrait, setPortrait] = useState<UploadedAsset | null>(null);
  const [garment, setGarment] = useState<UploadedAsset | null>(null);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [uploadingGarment, setUploadingGarment] = useState(false);
  const [category, setCategory] = useState<ApparelCategory>("upper_body");
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(PROCESSING_MESSAGES[0]);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-amber-400 border border-stone-800 shadow-md">
            <LoaderCircle className="h-6 w-6 animate-spin" />
          </div>
          <p className="font-editorial text-lg font-bold text-stone-900">Entering Atelier Studio...</p>
          <p className="text-xs font-mono text-stone-500 uppercase tracking-widest font-semibold">Calibrating Session</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!generating) return;
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % PROCESSING_MESSAGES.length;
      setStatus(PROCESSING_MESSAGES[index]);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [generating]);

  const uploadAsset = async (file: File, kind: "portrait" | "garment") => {
    if (!user) return;

    // Reset previous generation output whenever a new asset is added
    setResultUrl(null);
    setError(null);

    const previewUrl = URL.createObjectURL(file);
    const next: UploadedAsset = { file, previewUrl, storageUrl: null, storageKey: null };
    if (kind === "portrait") {
      setPortrait(next);
      setUploadingPortrait(true);
    } else {
      setGarment(next);
      setUploadingGarment(true);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${user.id}/${kind}/${Date.now()}-${safeName}`;
    const { data, error: uploadError } = await insforge.storage.from("tryon-assets").upload(path, file);

    if (kind === "portrait") setUploadingPortrait(false);
    else setUploadingGarment(false);

    if (uploadError || !data) {
      setError(uploadError?.message ?? "Upload to tryon-assets failed.");
      return;
    }

    const stored = { ...next, storageUrl: data.url, storageKey: data.key };
    if (kind === "portrait") setPortrait(stored);
    else setGarment(stored);
  };

  const handleCategoryChange = (newCategory: ApparelCategory) => {
    setCategory(newCategory);
    // Reset output when apparel zone changes
    setResultUrl(null);
  };

  const handleResetStudio = () => {
    setPortrait(null);
    setGarment(null);
    setResultUrl(null);
    setError(null);
  };

  const generateLook = async () => {
    if (!user || !portrait?.storageUrl || !garment?.storageUrl) {
      setError("Upload both a portrait and a garment before generating.");
      return;
    }

    setError(null);
    setGenerating(true);
    setResultUrl(null);
    setStatus(PROCESSING_MESSAGES[0]);

    try {
      const response = await fetch("/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImageUrl: portrait.storageUrl,
          garmentImageUrl: garment.storageUrl,
          category,
        }),
      });
      const payload = (await response.json()) as { success: boolean; resultUrl?: string; error?: string };
      if (!response.ok || !payload.success || !payload.resultUrl) {
        throw new Error(payload.error || "Try-on generation failed.");
      }
      setResultUrl(payload.resultUrl);
      await logTryOnGeneration({
        userId: user.id,
        category,
        originalPersonUrl: portrait.storageUrl,
        garmentUrl: garment.storageUrl,
        resultUrl: payload.resultUrl,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const hasActiveInputs = Boolean(portrait || garment || resultUrl);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] text-slate-900 flex flex-col">
        <AppNav />
        <div className="mx-auto grid max-w-7xl w-full gap-8 px-4 py-12 sm:px-8 lg:grid-cols-2">
          <div className="h-[620px] animate-pulse rounded-3xl bg-white border border-stone-200 shadow-sm" />
          <div className="h-[620px] animate-pulse rounded-3xl bg-white border border-stone-200 shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-slate-900 flex flex-col bg-mesh-radial">
      <AppNav />
      <main className="mx-auto grid max-w-7xl w-full gap-8 px-4 py-10 sm:px-8 lg:grid-cols-12 flex-1 items-start">
        {/* Left Column: Creative Controls */}
        <section className="glass-panel rounded-3xl border border-stone-200/90 bg-white/90 p-6 sm:p-8 lg:col-span-6 shadow-xl">
          {/* Dashboard Header Strip */}
          <div className="flex items-start justify-between gap-4 border-b border-stone-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  Atelier Control Suite
                </h1>
              </div>
              <p className="mt-1 text-xs text-stone-500 font-normal">
                Stage assets. Calibrate target zones. Compute photoreal drape.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveInputs ? (
                <button
                  type="button"
                  onClick={handleResetStudio}
                  title="Clear inputs and output"
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-stone-700 transition-all hover:border-stone-300 hover:text-stone-950 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 bg-stone-100 px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-stone-800 transition-all duration-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 hover:scale-105 shadow-sm cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
                Live Selfie
              </button>
            </div>
          </div>

          {/* Dropzones Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Dropzone
              label="Portrait Subject"
              hint="High-res portrait photography"
              previewUrl={portrait?.previewUrl ?? null}
              uploading={uploadingPortrait}
              onFile={(file) => void uploadAsset(file, "portrait")}
              onCameraClick={() => setShowCamera(true)}
            />
            <Dropzone
              label="Garment Specimen"
              hint="Flatlay or mannequin apparel"
              previewUrl={garment?.previewUrl ?? null}
              uploading={uploadingGarment}
              onFile={(file) => void uploadAsset(file, "garment")}
            />
          </div>

          {/* Category Selector */}
          <div className="mt-6">
            <CategoryToggle value={category} onChange={handleCategoryChange} />
          </div>

          {/* Preset Samples */}
          <div className="mt-6">
            <TrialSamples
              onSelectPortrait={(file) => uploadAsset(file, "portrait")}
              onSelectGarment={(file, suggestedCat) => {
                if (suggestedCat) setCategory(suggestedCat);
                return uploadAsset(file, "garment");
              }}
              selectedPortraitName={portrait?.file?.name}
              selectedGarmentName={garment?.file?.name}
              disabled={generating || uploadingPortrait || uploadingGarment}
            />
          </div>

          {/* Error Alert */}
          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700 font-medium">
              {error}
            </div>
          ) : null}

          {/* Primary Action Button */}
          <div className="mt-7">
            <button
              type="button"
              onClick={() => void generateLook()}
              disabled={generating || uploadingPortrait || uploadingGarment}
              className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-stone-900 px-6 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white border border-stone-800 shadow-xl shadow-stone-900/15 transition-all duration-300 hover:bg-stone-800 hover:scale-[1.01] disabled:opacity-60 cursor-pointer"
            >
              {generating ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-amber-400" aria-hidden="true" />
              ) : (
                <Sparkles className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-12" aria-hidden="true" />
              )}
              {generating ? "Synthesizing Couture Look..." : "Generate Couture Look"}
            </button>
          </div>
        </section>

        {/* Right Column: Output Viewport Canvas */}
        <div className="lg:col-span-6 sticky top-28">
          <OutputCanvas
            portraitUrl={portrait?.previewUrl ?? portrait?.storageUrl ?? null}
            garmentUrl={garment?.previewUrl ?? garment?.storageUrl ?? null}
            resultUrl={resultUrl}
            generating={generating}
            status={status}
            onClearResult={() => setResultUrl(null)}
          />
        </div>
      </main>

      {/* Hardware Camera Viewfinder Modal */}
      {showCamera ? (
        <CameraCapture
          onCaptureComplete={(file) => {
            void uploadAsset(file, "portrait");
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      ) : null}
    </div>
  );
}
