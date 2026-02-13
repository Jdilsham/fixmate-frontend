import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatWorkedTime } from "../../../../utils/time";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finish Job</DialogTitle>
        </DialogHeader>

        {/* WORK SUMMARY */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Worked Time:</span>{" "}
            <strong>{formatWorkedTime(elapsedSeconds)}</strong>
          </p>

          <p>
            <span className="text-muted-foreground">Pricing Type:</span>{" "}
            <strong>{pricingType}</strong>
          </p>
        </div>

        {/* FIXED PRICE */}
        {pricingType === "FIXED" && (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">
              Final Amount (Rs.)
            </label>
            <input
              type="number"
              value={finalAmount}
              onChange={(e) => setFinalAmount(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Enter final price"
            />
          </div>
        )}

        {/* HOURLY RATE */}
        {pricingType === "HOURLY" && (
          <div className="mt-4 space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Hourly Rate:</span>{" "}
              <strong>Rs. {hourlyRate}</strong>
            </p>

            <p>
              <span className="text-muted-foreground">Time Worked:</span>{" "}
              <strong>{formatWorkedTime(elapsedSeconds)}</strong>
            </p>

            <p>
              <span className="text-muted-foreground">Estimated Total:</span>{" "}
              <strong className="text-green-500">
                Rs. {estimatedTotal}
              </strong>
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
            Finalize Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}