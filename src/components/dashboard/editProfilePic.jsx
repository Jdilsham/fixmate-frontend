import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getAuthUser } from "../../../utils/auth";
import { Camera, UploadCloud, X, ZoomIn } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function EditImageModal({ onClose }) {
  const [image, setImage] = useState(null); // base64
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState("idle"); // idle | camera | edit
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /* =======================
     FILE UPLOAD
  ======================= */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setMode("edit");
    };
    reader.readAsDataURL(file);
  };

  /* =======================
     CAMERA
  ======================= */
  const startCamera = () => {
    setError(null);
    setMode("camera");
  };

  useEffect(() => {
    if (mode !== "camera") return;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setError("Camera access denied or unavailable");
        setMode("idle");
      }
    };

    start();
    return () => stopCamera();
  }, [mode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    setImage(canvas.toDataURL("image/png"));
    setMode("edit");
    stopCamera();
  };

  /* =======================
     UPLOAD (CUSTOMER FIRST)
  ======================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const auth = getAuthUser();
      if (!auth?.token) throw new Error("Not authenticated");

      // base64 → Blob
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "profile.png"); // MUST be "file"

      await axios.post(`${API}/api/user/profile/image`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to upload profile image");
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     CLEANUP
  ======================= */
  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10 w-full max-w-md overflow-hidden
          rounded-3xl border
          bg-white
          shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)]
          dark:bg-[#0b2333]
          dark:border-white/10
          dark:shadow-[0_28px_90px_-40px_rgba(0,0,0,0.75)]
        "
      >
        {/* Top gradient line (FixMate style) */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-400" />

        {/* Soft glow accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl dark:bg-cyan-400/10" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl dark:bg-indigo-400/10" />
        </div>

        <div className="relative p-6 md:p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Edit Profile Picture
              </h2>
              <p className="text-sm mt-1 text-slate-600 dark:text-white/70">
                Upload or capture a new profile photo
              </p>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                border border-slate-200 bg-white/70
                hover:bg-white
                transition
                dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10
              "
              aria-label="Close"
              type="button"
            >
              <X className="h-4 w-4 text-slate-700 dark:text-white/80" />
            </button>
          </div>

          {/* Preview */}
          <div className="mt-7 flex justify-center">
            {mode === "camera" && (
              <div
                className="
                  relative w-48 h-48 rounded-full overflow-hidden
                  border-4 border-slate-200 bg-black
                  dark:border-white/10
                "
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 dark:ring-white/10 rounded-full" />
              </div>
            )}

            {mode === "edit" && (
              <div
                className="
                  relative w-48 h-48 rounded-full overflow-hidden
                  border-4 border-slate-200 bg-slate-100
                  dark:border-white/10 dark:bg-white/5
                  flex items-center justify-center
                "
              >
                <img
                  src={image}
                  alt="preview"
                  className="select-none"
                  style={{ transform: `scale(${zoom})` }}
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5 dark:ring-white/10 rounded-full" />
              </div>
            )}

            {mode === "idle" && (
              <div
                className="
                  relative w-48 h-48 rounded-full
                  border-2 border-dashed
                  border-slate-300/70 bg-slate-50
                  dark:border-white/15 dark:bg-white/5
                  flex flex-col items-center justify-center gap-2
                "
              >
                <UploadCloud className="h-6 w-6 text-slate-500 dark:text-white/60" />
                <span className="text-sm text-slate-600 dark:text-white/70">
                  Choose image source
                </span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              className="
                mt-5 rounded-xl border p-3 text-sm text-red-600
                bg-red-50 border-red-200
                dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-200
              "
            >
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="mt-7 space-y-4">
            {mode === "edit" && (
              <div
                className="
                  rounded-2xl border p-4
                  bg-slate-50/80 border-slate-200
                  dark:bg-[#0f2a3a]/70 dark:border-white/10
                "
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-white/70">
                    <ZoomIn className="h-4 w-4" />
                    <span>Zoom</span>
                  </div>
                  <span className="text-slate-700 dark:text-white/80">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-primary"
                />

                <div className="mt-2 flex justify-between text-[11px] text-slate-500 dark:text-white/55">
                  <span>1x</span>
                  <span>2.5x</span>
                </div>
              </div>
            )}

            {mode !== "camera" && (
              <label
                className="
                  block rounded-2xl border p-4
                  bg-white/70 border-slate-200
                  hover:bg-white transition cursor-pointer
                  dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      h-10 w-10 rounded-2xl flex items-center justify-center
                      bg-slate-100 border border-slate-200
                      dark:bg-white/5 dark:border-white/10
                    "
                  >
                    <UploadCloud className="h-5 w-5 text-slate-600 dark:text-white/70" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Upload an image
                    </p>
                    <p className="text-xs text-slate-600 dark:text-white/65">
                      PNG, JPG up to your browser limit
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            <div>
              {mode !== "camera" && (
                <Button
                  variant="outline"
                  onClick={startCamera}
                  className="
                    rounded-xl
                    bg-white/60 hover:bg-white
                    dark:bg-white/5 dark:hover:bg-white/10
                    dark:border-white/10
                  "
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </Button>
              )}
              {mode === "camera" && (
                <Button onClick={capturePhoto} className="rounded-xl">
                  Capture
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="rounded-xl"
              >
                Cancel
              </Button>

              {/* Keep your existing button colors */}
              <Button
                onClick={handleSave}
                disabled={!image || saving}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}