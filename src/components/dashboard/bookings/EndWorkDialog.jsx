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
  const [hourlyRate, setHourlyRate] = useState("");

  useEffect(() => {
    if (!open) {
      setFinalAmount("");
      setHourlyRate("");
    }
  }, [open]);

  if (!booking) return null;

  const pricingType = booking.paymentType?.toUpperCase();
  const workedHours = Number((elapsedSeconds / 3600).toFixed(2));
  const workedMinutes = Math.floor(elapsedSeconds / 60);

  const estimatedTotal =
    pricingType === "HOURLY"
      ? (hourlyRate * workedHours).toFixed(2)
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
            <div>
              <label className="font-medium">Hourly Rate (Rs.)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 mt-1"
              />
            </div>

            <p>
              <span className="text-muted-foreground">Hours Worked:</span>{" "}
              <strong>{workedHours}</strong>
            </p>

            <p>
              <span className="text-muted-foreground">Estimated Total:</span>{" "}
              <strong>Rs. {estimatedTotal || "0.00"}</strong>
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
                  hourlyRate: Number(hourlyRate),
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