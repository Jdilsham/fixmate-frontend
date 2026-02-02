import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AvailabilityConfirmDialog({
  open,
  onClose,
  onConfirm,
  nextState,
}) {
  if (!open) return null;

  const disabling = nextState === false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card border shadow-xl p-6 space-y-5">

        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${
              disabling
                ? "bg-red-500/10 text-red-500"
                : "bg-green-500/10 text-green-500"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {disabling
                ? "Temporarily disable availability?"
                : "Re-enable availability?"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              This action only affects booking availability.
            </p>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-xl border bg-muted/40 p-4 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
            <span>
              All your services will be{" "}
              <strong>
                {disabling ? "temporarily unavailable" : "available again"}
              </strong>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
            <span>
              Customers{" "}
              {disabling
                ? "won’t be able to see your services"
                : "can book your services"}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
            <span>You can change this anytime</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
            <span>
              <strong>Account approval is not affected</strong>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className={
              disabling
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }
          >
            {disabling ? "Disable Availability" : "Enable Availability"}
          </Button>
        </div>
      </div>
    </div>
  );
}
