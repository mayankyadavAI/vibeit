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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={closeCamera}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-teal-400 mb-4">Live Portrait Studio</h3>

        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm mb-4">
            {error}
          </div>
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black border border-slate-700">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
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

        <div className="flex justify-center gap-4 mt-6">
          {!capturedImage ? (
            <button
              type="button"
              onClick={captureFrame}
              disabled={Boolean(error)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm"
            >
              <Camera className="w-4 h-4" /> Snap Snapshot
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="flex items-center gap-2 bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-all text-sm border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" /> Retake
              </button>
              <button
                type="button"
                onClick={acceptCapture}
                className="flex items-center gap-2 bg-teal-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:bg-teal-300 transition-all text-sm"
              >
                <Check className="w-4 h-4" /> Save Portrait
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
