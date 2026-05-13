import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatWorkedTime } from "../../../../utils/time";
import { Clock3, Wallet, CheckCircle2 } from "lucide-react";

export default function EndWorkDialog({
  open,
  onClose,
  booking,
  elapsedSeconds,
  onFinalize,
}) {
  const [finalAmount, setFinalAmount] = useState("");

  useEffect(() => {
    if (!open) {
      setFinalAmount("");
    }
  }, [open]);

  if (!booking) return null;

  const pricingType = booking.paymentType?.toUpperCase();

  const hourlyRate = booking.hourlyRate;
  const estimatedTotal =
    pricingType === "HOURLY"
      ? Math.round((hourlyRate * elapsedSeconds) / 3600)
      : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        {/* Top gradient line */}
        <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Finish Job</DialogTitle>
          </DialogHeader>

          {/* Summary cards */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border bg-muted/15 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="rounded-xl border bg-background/60 p-2">
                  <Clock3 className="h-4 w-4" />
                </span>
                WORKED TIME
              </div>
              <p className="mt-2 text-base font-semibold">
                {formatWorkedTime(elapsedSeconds)}
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/15 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="rounded-xl border bg-background/60 p-2">
                  <Wallet className="h-4 w-4" />
                </span>
                PRICING TYPE
              </div>
              <p className="mt-2 text-base font-semibold">{pricingType}</p>
            </div>
          </div>

          {/* FIXED PRICE */}
          {pricingType === "FIXED" && (
            <div className="mt-5 rounded-2xl border bg-background/60 p-4">
              <label className="text-sm font-semibold">Final Amount (Rs.)</label>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the final price you agreed with the customer.
              </p>

              <div className="mt-3 relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  Rs.
                </span>

                <input
                  type="number"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  placeholder="0"
                  className="
                    w-full rounded-xl border bg-background
                    pl-10 pr-3 py-2.5 text-sm font-semibold
                    focus:outline-none focus:ring-2 focus:ring-primary/35
                  "
                />
              </div>
            </div>
          )}

          {/* HOURLY RATE */}
          {pricingType === "HOURLY" && (
            <div className="mt-5 rounded-2xl border bg-background/60 p-4">
              <p className="text-sm font-semibold">Hourly Summary</p>
              <p className="text-xs text-muted-foreground mt-1">
                We calculate the estimated total from tracked time.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border bg-muted/15 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Rate
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Rs. {Number(hourlyRate ?? 0).toLocaleString("en-LK")}
                  </p>
                </div>

                <div className="rounded-2xl border bg-muted/15 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatWorkedTime(elapsedSeconds)}
                  </p>
                </div>

                <div className="rounded-2xl border bg-emerald-500/10 p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Est. Total
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Rs. {Number(estimatedTotal ?? 0).toLocaleString("en-LK")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>

            <Button
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5"
              onClick={() => {
                if (pricingType === "FIXED") {
                  if (!finalAmount || Number(finalAmount) <= 0) {
                    alert("Enter valid final amount");
                    return;
                  }
                  onFinalize({ finalAmount: Number(finalAmount) });
                }

                if (pricingType === "HOURLY") {
                  if (!hourlyRate || Number(hourlyRate) <= 0) {
                    alert("Enter valid hourly rate");
                    return;
                  }
                  onFinalize({
                    hourlyRate: booking.hourlyRate,
                    workedSeconds: elapsedSeconds,
                  });
                }
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Finalize Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}