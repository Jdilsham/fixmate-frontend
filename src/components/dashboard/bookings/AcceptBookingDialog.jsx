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
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        className="
          w-[calc(100vw-2rem)] max-w-[560px]
          p-0 overflow-hidden rounded-3xl
          border bg-background text-foreground
          shadow-[0_24px_80px_-40px_rgba(2,6,23,0.45)]
          dark:shadow-[0_26px_90px_-45px_rgba(34,211,238,0.18)]
          sm:w-full
          [&>button.absolute]:hidden
        "
      >
        <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

        <div className="relative max-h-[85vh] overflow-y-auto">
          <div className="relative px-5 py-5 border-b sm:px-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl dark:hidden" />
              <div className="hidden dark:block absolute -top-20 -right-20 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="hidden dark:block absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-sky-500/10 blur-3xl" />
            </div>

            <div className="relative flex items-start justify-between gap-4">
              <DialogHeader className="p-0 space-y-1 text-left">
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  Accept booking?
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Please confirm before accepting this request.
                </p>
              </DialogHeader>

              <button
                onClick={onClose}
                className="
                  inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                  border bg-background/70 backdrop-blur
                  text-muted-foreground transition hover:bg-muted hover:text-foreground
                  dark:border-white/10 dark:bg-white/5
                "
                aria-label="Close"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-5 py-5 space-y-4 sm:px-6">
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
                    mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl
                    border bg-background
                    dark:bg-white/5 dark:border-white/10
                  "
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="truncate font-semibold">
                      {booking?.customerName || "Customer"}
                    </p>

                    <span
                      className="
                        inline-flex w-fit items-center
                        rounded-full border bg-background px-2.5 py-1
                        text-xs font-semibold text-muted-foreground
                        dark:bg-white/5 dark:border-white/10
                      "
                    >
                      #{booking?.bookingId ?? "—"}
                    </span>
                  </div>

                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {booking?.customerPhone || "—"}
                  </p>

                  <p
                    className="mt-1 break-words text-sm text-muted-foreground"
                    title={booking?.bookingAddress || ""}
                  >
                    {booking?.bookingAddress || "—"}
                  </p>
                </div>
              </div>
            </div>

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

          <div className="border-t px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                className="
                  w-full rounded-full
                  border border-slate-300
                  bg-white text-slate-700
                  shadow-sm
                  hover:bg-slate-100 hover:text-slate-900
                  focus:ring-2 focus:ring-orange-400/40
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-white/80
                  dark:hover:bg-white/10
                  sm:w-auto
                "
                onClick={onClose}
                disabled={loading}
                type="button"
              >
                Cancel
              </Button>

              <Button
                className="
                  w-full rounded-full text-white
                  bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
                  hover:brightness-110
                  dark:bg-gradient-to-r dark:from-sky-500 dark:via-cyan-400 dark:to-teal-400
                  dark:hover:brightness-105
                  dark:ring-1 dark:ring-white/10
                  disabled:opacity-60
                  sm:w-auto
                "
                onClick={onConfirm}
                disabled={loading || !booking}
                type="button"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Accepting...
                  </span>
                ) : (
                  "Yes, Accept"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
