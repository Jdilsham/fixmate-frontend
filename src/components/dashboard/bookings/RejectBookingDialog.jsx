// [&>button.absolute]:hidden

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

export default function RejectBookingDialog({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const count = useMemo(() => reason.trim().length, [reason]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-lg p-0 overflow-hidden rounded-3xl border
          bg-white/95 border-black/10 backdrop-blur-xl
          shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)]
          dark:bg-[#05161f]/95 dark:border-white/10
          dark:shadow-[0_40px_120px_-60px_rgba(34,211,238,0.25)]
        "
      >
        {/* ===== Header ===== */}
        <div className="relative px-6 pt-6 pb-5">
          {/* accents */}
          <div className="pointer-events-none absolute inset-0">
            {/* light */}
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-orange-400/18 blur-3xl dark:hidden" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-400/14 blur-3xl dark:hidden" />

            {/* dark */}
            <div className="hidden dark:block absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />
            <div className="hidden dark:block absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
          </div>

          <DialogHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  Reject Booking
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  Tell the customer why you can’t accept this request.
                </DialogDescription>
              </div>

              {/* Close button (hover + dark mode polish) */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="
                  group inline-flex h-10 w-10 items-center justify-center rounded-full
                  border transition-all duration-200
                  bg-white/70 border-black/10 text-slate-600
                  hover:bg-white hover:scale-105
                  hover:shadow-[0_8px_30px_-10px_rgba(15,23,42,0.35)]
                  focus:outline-none focus:ring-2 focus:ring-orange-400/35

                  dark:bg-white/5 dark:border-white/10 dark:text-white/70
                  dark:hover:bg-cyan-500/15 dark:hover:text-white
                  dark:hover:ring-1 dark:hover:ring-cyan-400/40
                  dark:hover:shadow-[0_0_0_6px_rgba(34,211,238,0.08)]
                  dark:focus:ring-cyan-400/30
                "
              >
                <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
              </button>
            </div>
          </DialogHeader>
        </div>

        {/* ===== Body ===== */}
        <div className="px-6 pb-6 pt-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>

            {/* Textarea (premium + clear dark mode) */}
            <div
              className="
                rounded-2xl p-[1.5px]
                bg-gradient-to-r
                from-orange-400/45 via-amber-300/35 to-orange-400/45
                dark:from-cyan-400/40 dark:via-blue-500/35 dark:to-teal-400/35
              "
            >
              <div
                className="
                  rounded-2xl bg-white/95
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
                  dark:bg-[#071b26]
                  dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                "
              >
                <textarea
                  rows={5}
                  placeholder="Enter reason for rejection..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="
                    w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm
                    text-foreground placeholder:text-muted-foreground
                    outline-none
                    focus:ring-2 focus:ring-orange-400/30
                    dark:text-white/90 dark:placeholder:text-white/40
                    dark:focus:ring-cyan-400/30
                  "
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Be polite & clear.</span>
              <span>{count}/200</span>
            </div>
          </div>

          {/* ===== Actions ===== */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="fixmateOutline"
              onClick={onClose}
              className="rounded-2xl px-6"
            >
              Cancel
            </Button>

            {/* FixMate rule: dark mode NOT orange */}
            <Button
              variant="fixmate"
              disabled={!reason.trim()}
              onClick={() => onConfirm(reason)}
              className="
                rounded-2xl px-6
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:bg-gradient-to-r dark:from-blue-600 dark:via-cyan-500 dark:to-teal-500
                dark:hover:brightness-105 dark:ring-1 dark:ring-white/10
                dark:shadow-[0_16px_55px_-30px_rgba(34,211,238,0.28)]
              "
            >
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}