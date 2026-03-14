import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, ShieldCheck, Timer, X } from "lucide-react";

export default function StartJobConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[calc(100vw-2rem)] max-w-sm p-0 overflow-hidden
          rounded-3xl border
          bg-white
          shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)]
          dark:bg-[#0b2333]
          dark:border-white/10
          dark:shadow-[0_28px_90px_-40px_rgba(0,0,0,0.75)]

          [&>button.absolute]:hidden
        "
      >

        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-400" />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl dark:bg-cyan-400/10" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl dark:bg-indigo-400/10" />
        </div>

        <div className="relative p-6">
          <DialogHeader className="space-y-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="
                    shrink-0 p-2 rounded-full ring-1
                    bg-green-500/10 text-green-600 ring-green-500/20
                    dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20
                  "
                >
                  <PlayCircle className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Start Job
                  </DialogTitle>
                  <p className="text-sm mt-1 text-slate-600 dark:text-white/70">
                    Confirm before starting the timer.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onClose(false)}
                className="
                  inline-flex h-9 w-9 items-center justify-center rounded-full
                  border border-slate-200 bg-white/70
                  hover:bg-white transition
                  disabled:opacity-50 disabled:pointer-events-none
                  dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10
                "
                aria-label="Close"
                type="button"
                disabled={loading}
              >
                <X className="h-4 w-4 text-slate-700 dark:text-white/80" />
              </button>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed">
              Are you sure you want to start this job?
              <br />
              <span className="text-slate-600 dark:text-white/70">
                Once started, the job timer will begin and cannot be undone.
              </span>
            </p>

            <div
              className="
                rounded-2xl border p-4 space-y-2 text-sm
                bg-slate-50/80 border-slate-200
                dark:bg-[#0f2a3a]/70 dark:border-white/10
              "
            >
              <div className="flex items-start gap-2">
                <Timer className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-cyan-300" />
                <span className="text-slate-700 dark:text-white/80">
                  Timer starts immediately
                </span>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-cyan-300" />
                <span className="text-slate-700 dark:text-white/80">
                  Action can’t be undone after start
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => onClose(false)}
              disabled={loading}
              className="
                rounded-xl
                dark:bg-white/10 dark:hover:bg-white/15 dark:text-white
              "
            >
              Cancel
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Starting..." : "Yes, Start Job"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}