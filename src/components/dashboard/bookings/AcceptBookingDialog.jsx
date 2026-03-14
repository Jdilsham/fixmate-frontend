import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X, CheckCircle2 } from "lucide-react";

export default function AcceptBookingDialog({
  open,
  booking,
  loading,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95vw] max-w-md p-0 overflow-hidden rounded-3xl
          border bg-background text-foreground
          shadow-[0_24px_80px_-40px_rgba(2,6,23,0.45)]
          dark:shadow-[0_26px_90px_-45px_rgba(34,211,238,0.18)]

          [&>button.absolute]:hidden
        "
      >
        {/* Top Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

        {/* Header */}
        <div className="relative px-6 py-5 border-b">
          {/* soft glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl dark:hidden" />
            <div className="hidden dark:block absolute -top-20 -right-20 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="hidden dark:block absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-sky-500/10 blur-3xl" />
          </div>

          <div className="relative flex items-start justify-between gap-4">
            <DialogHeader className="p-0 space-y-1">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Accept booking?
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Please confirm before accepting this request.
              </p>
            </DialogHeader>

            {/* Close button */}
            <button
              onClick={onClose}
              className="
                inline-flex items-center justify-center
                h-9 w-9 rounded-full
                border bg-background/70 backdrop-blur
                hover:bg-muted transition
                text-muted-foreground hover:text-foreground
                dark:border-white/10 dark:bg-white/5
              "
              aria-label="Close"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Booking Preview */}
          <div
            className="
              rounded-2xl border p-4
              bg-muted/30
              dark:bg-white/5 dark:border-white/10
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  mt-0.5 h-10 w-10 rounded-2xl flex items-center justify-center
                  border bg-background
                  dark:bg-white/5 dark:border-white/10
                "
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-emerald-400" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold truncate">
                    {booking?.customerName || "Customer"}
                  </p>

                  <span
                    className="
                      text-xs font-semibold px-2.5 py-1 rounded-full
                      border bg-background
                      text-muted-foreground
                      dark:bg-white/5 dark:border-white/10
                    "
                  >
                    #{booking?.bookingId ?? "—"}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  {booking?.customerPhone || "—"}
                </p>

                <p
                  className="text-sm text-muted-foreground mt-1 truncate"
                  title={booking?.bookingAddress || ""}
                >
                  {booking?.bookingAddress || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div
            className="
              rounded-2xl border px-4 py-3 text-sm
              bg-orange-50/70 border-orange-200 text-orange-900
              dark:bg-sky-500/10 dark:border-sky-400/20 dark:text-sky-100
            "
          >
            After accepting, you are responsible for completing this job.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="secondary"
            className="
                rounded-full
                border border-slate-300
                bg-white text-slate-700
                shadow-sm
                hover:bg-slate-100 hover:text-slate-900
                focus:ring-2 focus:ring-orange-400/40

                dark:border-white/10
                dark:bg-white/5
                dark:text-white/80
                dark:hover:bg-white/10
                "
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Cancel
          </Button>

          {/* FixMate theme: orange in light, blue/cyan/teal in dark */}
          <Button
            className="
              rounded-full text-white
              bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
              hover:brightness-110
              dark:bg-gradient-to-r dark:from-sky-500 dark:via-cyan-400 dark:to-teal-400
              dark:hover:brightness-105
              dark:ring-1 dark:ring-white/10
              disabled:opacity-60
            "
            onClick={onConfirm}
            disabled={loading || !booking}
            type="button"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Accepting...
              </span>
            ) : (
              "Yes, Accept"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}