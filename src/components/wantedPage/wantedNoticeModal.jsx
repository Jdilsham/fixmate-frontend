import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API = import.meta.env.VITE_BACKEND_URL;

export default function WantedNoticeModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    profession: "",
    requiredCount: 1,
    location: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/api/wanted`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onCreated();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-[560px] rounded-[28px] border border-black/10 dark:border-white/10
          bg-white/90 dark:bg-slate-950/70
          backdrop-blur-2xl
          shadow-[0_24px_90px_-55px_rgba(0,0,0,0.55)]
          overflow-hidden
        "
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-[80%] rounded-full blur-3xl bg-orange-300/20 dark:bg-cyan-500/10" />

        <DialogHeader className="pb-2">
          <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Post a{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Wanted Notice
            </span>
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Publish a recruitment notice to find skilled professionals.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Professional Needed
            </Label>
            <Input
              required
              value={formData.profession}
              onChange={(e) =>
                setFormData({ ...formData, profession: e.target.value })
              }
              className="
                h-12 rounded-2xl
                border-slate-300 dark:border-white/10
                bg-white/70 dark:bg-white/[0.05]
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus-visible:ring-2
                focus-visible:ring-orange-500/30 dark:focus-visible:ring-cyan-500/30
                focus-visible:border-orange-400 dark:focus-visible:border-cyan-400
              "
              placeholder="e.g. Electrician, Plumber, Carpenter"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Worker Count
              </Label>
              <Input
                type="number"
                min="1"
                required
                value={formData.requiredCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiredCount: parseInt(e.target.value) || 1,
                  })
                }
                className="
                  h-12 rounded-2xl
                  border-slate-300 dark:border-white/10
                  bg-white/70 dark:bg-white/[0.05]
                  text-slate-900 dark:text-white
                  focus-visible:ring-2
                  focus-visible:ring-orange-500/30 dark:focus-visible:ring-cyan-500/30
                  focus-visible:border-orange-400 dark:focus-visible:border-cyan-400
                "
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Location
              </Label>
              <Input
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="
                  h-12 rounded-2xl
                  border-slate-300 dark:border-white/10
                  bg-white/70 dark:bg-white/[0.05]
                  text-slate-900 dark:text-white
                  placeholder:text-slate-400 dark:placeholder:text-slate-500
                  focus-visible:ring-2
                  focus-visible:ring-orange-500/30 dark:focus-visible:ring-cyan-500/30
                  focus-visible:border-orange-400 dark:focus-visible:border-cyan-400
                "
                placeholder="e.g. Galle, Matara"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Description
            </Label>
            <Textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="
                min-h-[120px] rounded-2xl resize-none
                border-slate-300 dark:border-white/10
                bg-white/70 dark:bg-white/[0.05]
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                focus-visible:ring-2
                focus-visible:ring-orange-500/30 dark:focus-visible:ring-cyan-500/30
                focus-visible:border-orange-400 dark:focus-visible:border-cyan-400
              "
              placeholder="Describe the type of worker, job details, urgency, and any special requirements..."
            />
          </div>

          <DialogFooter className="pt-2 flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              className="
                rounded-2xl px-6
                border-slate-300 dark:border-white/10
                bg-white/70 dark:bg-white/[0.05]
                hover:bg-slate-100 dark:hover:bg-white/10
              "
            >
              Cancel
            </Button>

            <Button
              variant="fixmate"
              type="submit"
              className="rounded-2xl px-6"
            >
              Publish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}