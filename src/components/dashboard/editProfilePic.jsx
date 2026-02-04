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
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="relative bg-background rounded-3xl p-7 w-[400px] shadow-2xl z-10">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold">
          Edit Profile Picture
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload or capture a new profile photo
        </p>
      </div>

      {/* Preview */}
      <div className="flex justify-center mt-7">
        {mode === "camera" && (
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-muted bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {mode === "edit" && (
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-muted bg-muted flex items-center justify-center">
            <img
              src={image}
              alt="preview"
              className="select-none"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        )}

        {mode === "idle" && (
          <div className="w-48 h-48 rounded-full border-2 border-dashed border-muted/60 bg-muted/40 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Choose image source
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mt-4 text-center">
          {error}
        </p>
      )}

      {/* Controls */}
      <div className="mt-7 space-y-4">
        {mode === "edit" && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
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
          </div>
        )}

        {mode !== "camera" && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="
              w-full text-sm
              file:mr-3 file:rounded-full file:border-0
              file:bg-muted file:px-4 file:py-2
              file:text-xs file:font-medium
              hover:file:bg-muted/80
              cursor-pointer
            "
          />
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
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
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

}
