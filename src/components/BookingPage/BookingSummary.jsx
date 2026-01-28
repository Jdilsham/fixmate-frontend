import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function BookingSummary({
  bookingData,
  onConfirm,
  onCancel,
  onEdit,
}) {
  const {
    service,
    pricingType,
    scheduledAt,
    description,
    addressLine1,
    city,
    province,
    phone,
    user,
  } = bookingData;

  const formattedDateTime = scheduledAt
  ? new Date(scheduledAt).toLocaleString("en-LK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  : "—";


  // Address rules:
  // If user starts entering address, addressLine1 becomes mandatory
  const addressStarted = addressLine1 || city || province;
  const addressInvalid = addressStarted && !addressLine1?.trim();

  const fullAddress =
    [addressLine1, city, province].filter(Boolean).join(", ") ||
    "Default address will be used";

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Booking Summary
          </DialogTitle>
          <DialogDescription>
            Review your booking details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col divide-y divide-border/50 text-sm rounded-xl border bg-muted/30">
          {/* CUSTOMER (ALWAYS) */}
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-start py-3 px-4">
            <span className="text-muted-foreground">Customer</span>
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          {/* PHONE (ALWAYS) */}
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-start py-3 px-4">
            <span className="opacity-70">Phone</span>
            <span>{phone || user?.phone || "Not provided"}</span>
          </div>

          {/* ADDRESS (ALWAYS) */}
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-start py-3 px-4">
            <span className="opacity-70">Address</span>
            <span className="break-words">
              {fullAddress}
            </span>

          </div>

          {/* SERVICE */}
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-start py-3 px-4">
            <span className="opacity-70">Service</span>
            <span>{service.serviceTitle}</span>
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-start py-3 px-4">
            <span className="opacity-70">Date & Time</span>
            <span>{formattedDateTime}</span>
          </div>

          {/* NOTES */}
          {description && (
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-start py-3 px-4">
              <span className="opacity-70">Additional Info</span>
              <span className="text-right max-w-[60%]">{description}</span>
            </div>
          )}

          {/* TOTAL */}
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-center py-3 px-4 border-t">
            <span className="text-muted-foreground">Total</span>

            {pricingType === "HOURLY" ? (
              <span className="text-lg font-bold text-orange-500">
                LKR {service.hourlyRate} / hour
              </span>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                Fixed price (to be confirmed)
              </span>
            )}
          </div>
        </div>

        {/* ACTIONS (outside details card) */}
<div className="mt-6 flex justify-center gap-3">
  <Button
    className="h-11 w-40 text-base font-semibold shadow-md"
    onClick={onConfirm}
    disabled={addressInvalid}
  >
    Confirm Booking
  </Button>

  <Button
    variant="ghost"
    className="h-11 w-40 text-base"
    onClick={onEdit}
  >
    Edit
  </Button>
</div>


      </DialogContent>
    </Dialog>
  );
}
