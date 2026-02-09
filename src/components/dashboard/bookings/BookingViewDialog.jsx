import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { getBookingStatusView } from "../../../../utils/bookingStatus";

export default function BookingViewDialog({
  open,
  onClose,
  booking,
  mode,
  onManage,
  onRequestPayment,
}) {
  if (!booking) return null;

  const isProvider = mode === "PROVIDER";
  const status = getBookingStatusView(booking);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        {booking.status === "REJECTED" && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-600">
              Booking Rejected
            </p>

            <p className="mt-1 text-sm text-red-500">
              Reason: {booking.rejectionReason}
            </p>

            {booking.rejectedAt && (
              <p className="mt-1 text-xs text-gray-500">
                Rejected at: {new Date(booking.rejectedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4 text-sm">
          {/* STATUS */}
          <Row label="Status">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </Row>

          {/* COMMON */}
          <Row
            label="Service"
            value={isProvider ? booking.serviceTitle : booking.serviceName}
          />

          <Row
            label={isProvider ? "Customer" : "Provider"}
            value={
              isProvider
                ? booking.customerName
                : booking.providerName || "Not assigned"
            }
          />

          <Row
            label="Scheduled At"
            value={format(new Date(booking.scheduledAt), "PPP, p")}
          />

          {/* PROVIDER ONLY */}
          {isProvider && (
            <>
              <Row label="Pricing Type" value={booking.paymentType} />

              {booking.paymentType === "HOURLY" && (
                <Row
                  label="Hourly Price"
                  value={
                    booking.hourlyRate
                      ? `Rs. ${booking.hourlyRate}`
                      : "—"
                  }
                />
              )}

              <Row
                label="Amount"
                value={
                  booking.paymentAmount
                    ? `Rs. ${booking.paymentAmount}`
                    : "To be decided"
                }
              />

              <Row label="Phone Number" value={booking.customerPhone} />
              <Row label="Address" value={booking.bookingAddress} />

              <Row
                label="Additional Notes"
                value={booking.description || "—"}
              />

              <Row
                label="Location"
                value={`${booking.latitude}, ${booking.longitude}`}
              />
            </>
          )}

          {/* CUSTOMER ONLY */}
          {!isProvider && (
            <>
              <Row label="Pricing Type" value={booking.pricingType} />
              <Row label="Phone Number" value={booking.phone} />
              <Row label="Address" value={booking.address} />

              <Row
                label="Amount"
                value={
                  booking.amount ? `Rs. ${booking.amount}` : "To be decided"
                }
              />

              {booking.description && (
                <Row label="Additional Notes" value={booking.description} />
              )}
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          {/* MANAGE BOOKING (before finalize) */}
          {!booking.paymentStatus && !booking.paymentAmount && (
            <button
              onClick={() => {
                onClose(false);
                onManage?.(booking);
              }}
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Manage Booking
            </button>
          )}

          {/* REQUEST PAYMENT (amount set, not requested yet) */}
          {!booking.paymentStatus && booking.paymentAmount && (
            <button
              onClick={() => {
                onClose(false);
                onRequestPayment?.(booking);
              }}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Request Payment
            </button>
          )}

          {/* PAYMENT REQUESTED */}
          {booking.paymentStatus === "REQUESTED" && (
            <span className="text-sm font-semibold text-blue-500">
              Payment Requested
            </span>
          )}

          {/* PAYMENT PAID / CONFIRMED */}
          {(booking.paymentStatus === "PAID" ||
            booking.paymentStatus === "CONFIRMED") && (
            <span className="text-sm font-semibold text-green-500">
              Payment Completed
            </span>
          )}
        </div>
        
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">
        {children ?? value ?? "—"}
      </span>
    </div>
  );
}
