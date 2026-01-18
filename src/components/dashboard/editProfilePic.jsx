import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getAuthUser } from "../../../utils/auth";

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

      await axios.post(
        `${API}/api/user/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );



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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-background rounded-2xl p-6 w-[380px] shadow-xl z-10">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Edit Profile Picture
        </h2>

        {/* Preview */}
        <div className="flex justify-center">
          {mode === "camera" && (
            <div className="w-48 h-48 rounded-full overflow-hidden border bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {mode === "edit" && (
            <div className="w-48 h-48 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
              <img
                src={image}
                alt="preview"
                className="select-none"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          )}

          {mode === "idle" && (
            <div className="w-48 h-48 rounded-full border bg-muted flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Choose image source
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-3 text-center">
            {error}
          </p>
        )}

        {/* Controls */}
        <div className="mt-4 space-y-3">
          {mode === "edit" && (
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          )}

          {mode !== "camera" && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center gap-3 mt-6">
          <div>
            {mode !== "camera" && (
              <Button variant="outline" onClick={startCamera}>
                Use Camera
              </Button>
            )}
            {mode === "camera" && (
              <Button onClick={capturePhoto}>
                Capture
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!image || saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
