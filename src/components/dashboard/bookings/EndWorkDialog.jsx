import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EndWorkDialog({
  open,
  onClose,
  booking,
  elapsedSeconds,
  onFinalize,
}) {
  const [finalAmount, setFinalAmount] = useState("");

  useEffect(() => {
    if (!open) setFinalAmount("");
  }, [open]);

  if (!booking) return null;

  const workedHours = Number((elapsedSeconds / 3600).toFixed(2));
  const workedMinutes = Math.floor(elapsedSeconds / 60);

  const estimatedTotal =
    booking.paymentType === "HOURLY_RATE"
      ? booking.hourlyRate * workedHours
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
            <strong>
              {workedMinutes} min ({workedHours} hrs)
            </strong>
          </p>

          <p>
            <span className="text-muted-foreground">Pricing Type:</span>{" "}
            <strong>{booking.paymentType}</strong>
          </p>
        </div>

        {/* FIXED PRICE */}
        {booking.paymentType === "FIXED_PRICE" && (
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
        {booking.paymentType === "HOURLY_RATE" && (
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Hourly Rate:</span>{" "}
              <strong>Rs. {booking.hourlyRate}</strong>
            </p>

            <p>
              <span className="text-muted-foreground">Hours Worked:</span>{" "}
              <strong>{workedHours}</strong>
            </p>

            <p>
              <span className="text-muted-foreground">Estimated Total:</span>{" "}
              <strong>Rs. {estimatedTotal.toFixed(2)}</strong>
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
              if (booking.paymentType === "FIXED_PRICE") {
                onFinalize({
                  finalAmount: Number(finalAmount),
                });
              } else {
                onFinalize({
                  hourlyRate: booking.hourlyRate,
                  hoursWorked: workedHours,
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