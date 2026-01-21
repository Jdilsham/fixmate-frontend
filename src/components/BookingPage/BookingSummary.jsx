import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
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
    date,
    description,
    addressLine1,
    city,
    province,
    phone,
    user,
  } = bookingData;

  // Address logic:
  // - If user provided ANY address field, require at least addressLine1
  const addressStarted = addressLine1 || city || province;
  const addressInvalid = addressStarted && !addressLine1?.trim();

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Booking Summary
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-sm">
          {/* CUSTOMER */}
          {user && (
            <div className="flex justify-between">
              <span className="opacity-70">Customer</span>
              <span>
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}

          {/* SERVICE */}
          <div className="flex justify-between">
            <span className="opacity-70">Service</span>
            <span>{service.serviceTitle}</span>
          </div>

          {/* DATE */}
          <div className="flex justify-between">
            <span className="opacity-70">Date</span>
            <span>{new Date(date).toDateString()}</span>
          </div>

          {/* ADDRESS (optional) */}
          {(addressLine1 || city || province) && (
            <div className="flex justify-between">
              <span className="opacity-70">Address</span>
              <span className="text-right max-w-[60%]">
                {[addressLine1, city, province].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {/* PHONE (optional) */}
          {phone && (
            <div className="flex justify-between">
              <span className="opacity-70">Phone</span>
              <span>{phone}</span>
            </div>
          )}

          {/* NOTES */}
          {description && (
            <div className="flex justify-between">
              <span className="opacity-70">Additional Info</span>
              <span className="text-right max-w-[60%]">
                {description}
              </span>
            </div>
          )}

          {/* TOTAL */}
          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Total</span>
            {pricingType === "HOURLY" ? (
              <span>LKR {service.hourlyRate} / hour</span>
            ) : (
              <span>Fixed price (to be confirmed)</span>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={onConfirm}
                disabled={addressInvalid}
              >
                Confirm Booking
              </Button>

              <Button
                variant="outline"
                className="flex-1"
                onClick={onEdit}
              >
                Edit
              </Button>
            </div>

            {addressInvalid && (
              <p className="text-xs text-red-500 text-center">
                Address line is required to confirm this booking
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
