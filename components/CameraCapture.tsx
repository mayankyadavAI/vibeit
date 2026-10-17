// components/CameraCapture.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';

interface CameraCaptureProps {
  onCaptureComplete: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCaptureComplete, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Activate the live hardware camera device stream
  useEffect(() => {
    let localStream: MediaStream | null = null;
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
          audio: false,
        });
        localStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error('Camera access failure:', err);
        setError('Could not access camera device. Please grant system permissions.');
      }
    }
    void startCamera();

    // Clean up tracking streams when component unmounts
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Force square cropping matrix layout for optimal portrait frame matching
        const size = Math.min(video.videoWidth || 720, video.videoHeight || 720);
        canvas.width = size;
        canvas.height = size;

        const startX = ((video.videoWidth || size) - size) / 2;
        const startY = ((video.videoHeight || size) - size) / 2;

        context.drawImage(video, startX, startY, size, size, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(dataUrl);
      }
    }
  };

  const acceptCapture = () => {
    if (capturedImage) {
      // Convert base64 data string back into a standard binary File blob
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCaptureComplete(file);
          closeCamera();
        });
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="border border-stone-200/90 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative bg-white/95">
        <button
          type="button"
          onClick={closeCamera}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 p-1.5 rounded-full border border-stone-200 bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close camera"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-stone-600 font-semibold">Biometric Studio</p>
          <h3 className="font-editorial text-2xl font-bold text-stone-900">Live Portrait Capture</h3>
        </div>

        {error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs mb-4 font-medium">
            {error}
          </div>
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black border border-stone-200 shadow-inner">
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                {/* Oval biometric alignment overlay */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-[75%] w-[60%] rounded-[50%] border-2 border-dashed border-amber-400/70 shadow-[0_0_20px_rgba(180,140,54,0.25)]" />
                </div>
                <div className="pointer-events-none absolute bottom-3 inset-x-0 text-center">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-white backdrop-blur-md font-medium">
                    Align face within frame
                  </span>
                </div>
              </>
            ) : (
              <img
                src={capturedImage}
                alt="Captured portrait matrix"
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        <div className="flex justify-center gap-3 mt-6">
          {!capturedImage ? (
            <button
              type="button"
              onClick={captureFrame}
              disabled={Boolean(error)}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-white font-semibold px-7 py-3 rounded-full hover:scale-105 disabled:opacity-50 transition-all text-xs font-mono uppercase tracking-wider shadow-xl shadow-stone-900/20 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-400" /> Capture Portrait
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="flex items-center gap-2 bg-stone-100 text-stone-700 font-semibold px-5 py-2.5 rounded-full hover:bg-stone-200 transition-all text-xs font-mono uppercase tracking-wider border border-stone-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                type="button"
                onClick={acceptCapture}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-white font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition-all text-xs font-mono uppercase tracking-wider shadow-xl shadow-stone-900/20 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3] text-amber-400" /> Confirm & Ingest
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
