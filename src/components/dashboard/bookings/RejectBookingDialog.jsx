// [&>button.absolute]:hidden

import { Dialog, DialogContent } from "@/components/ui/dialog";
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
          max-w-lg p-0 overflow-hidden rounded-3xl
          border bg-white text-slate-900
          shadow-[0_25px_90px_-50px_rgba(15,23,42,0.50)]
          dark:bg-[#071b26] dark:text-white dark:border-white/10
          dark:shadow-[0_40px_120px_-60px_rgba(34,211,238,0.20)]
          [&>button.absolute]:hidden
        "
      >
        {/* ===== FixMate TOP gradient line only (no rounded) ===== */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9F67] via-[#FFB37A] to-[#6EE7D8]" />

        {/* ===== Header ===== */}
        <div className="px-7 pt-6 pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Reject booking?
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
                Tell the customer why you can’t accept this request.
              </p>
            </div>

            {/* Close (FixMate style) */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                border border-black/10 bg-white
                text-slate-600
                hover:bg-slate-50 hover:text-slate-900
                transition
                dark:bg-white/5 dark:border-white/10 dark:text-white/70
                dark:hover:bg-white/10 dark:hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="px-7 py-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>

            {/* Textarea container */}
            <div
              className="
                rounded-2xl border border-black/10 bg-slate-50
                dark:border-white/10 dark:bg-white/5
              "
            >
              <textarea
                rows={5}
                maxLength={200}
                placeholder="Enter reason for rejection..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="
                  w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm
                  text-slate-900 placeholder:text-slate-500
                  outline-none
                  focus:ring-2 focus:ring-orange-400/25
                  dark:text-white/90 dark:placeholder:text-white/40
                  dark:focus:ring-cyan-400/25
                "
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/50">
              <span>Be polite & clear.</span>
              <span>{count}/200</span>
            </div>
          </div>

          {/* Soft warning box (optional but matches FixMate style) */}
          <div
            className="
              rounded-2xl border border-orange-200 bg-orange-50
              px-4 py-3 text-sm text-orange-800
              dark:border-orange-300/20 dark:bg-orange-400/10 dark:text-orange-200
            "
          >
            This action will reject the request and notify the customer.
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="px-7 py-5 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="fixmateOutline"
              onClick={onClose}
              className="rounded-full px-6"
            >
              Cancel
            </Button>

            <Button
              variant="fixmate"
              disabled={!reason.trim()}
              onClick={() => onConfirm(reason)}
              className="rounded-full px-6 disabled:opacity-60"
            >
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}