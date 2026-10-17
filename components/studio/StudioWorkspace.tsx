"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Camera, RotateCcw } from "lucide-react";
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
      <div className="min-h-screen bg-slate-950">
        <AppNav />
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-2">
          <div className="h-[520px] animate-pulse rounded-3xl bg-slate-900" />
          <div className="h-[520px] animate-pulse rounded-3xl bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AppNav />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-white">Control dashboard</h1>
              <p className="mt-1 text-sm text-slate-400">Drop assets. Choose a zone. Compose the look.</p>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveInputs ? (
                <button
                  type="button"
                  onClick={handleResetStudio}
                  title="Clear inputs and output"
                  className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-400 transition-all hover:border-slate-700 hover:text-slate-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-400/10 px-3.5 py-1.5 text-xs font-semibold text-teal-300 transition-all duration-200 hover:bg-teal-400/20 hover:scale-[1.02]"
              >
                <Camera className="h-4 w-4" />
                Take Selfie
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Dropzone
              label="Portrait photo"
              hint="Drag a full-face portrait"
              previewUrl={portrait?.previewUrl ?? null}
              uploading={uploadingPortrait}
              onFile={(file) => void uploadAsset(file, "portrait")}
              onCameraClick={() => setShowCamera(true)}
            />
            <Dropzone
              label="Garment asset"
              hint="Drag apparel photography"
              previewUrl={garment?.previewUrl ?? null}
              uploading={uploadingGarment}
              onFile={(file) => void uploadAsset(file, "garment")}
            />
          </div>

          <div className="mt-6">
            <CategoryToggle value={category} onChange={handleCategoryChange} />
          </div>

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

          {error ? <p className="mt-4 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}

          <button
            type="button"
            onClick={() => void generateLook()}
            disabled={generating || uploadingPortrait || uploadingGarment}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:bg-teal-300 disabled:opacity-70"
          >
            {generating ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {generating ? "Generating look" : "Generate Look"}
          </button>
        </section>

        <OutputCanvas
          portraitUrl={portrait?.previewUrl ?? portrait?.storageUrl ?? null}
          garmentUrl={garment?.previewUrl ?? garment?.storageUrl ?? null}
          resultUrl={resultUrl}
          generating={generating}
          status={status}
          onClearResult={() => setResultUrl(null)}
        />
      </main>

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
