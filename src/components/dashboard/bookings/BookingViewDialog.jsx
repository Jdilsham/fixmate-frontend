import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

export default function BookingViewDialog({ open, onClose, booking }) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">

          <Row label="Status">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                booking.status === "PENDING"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : booking.status === "ACCEPTED"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {booking.status}
            </span>
          </Row>

          <Row label="Service" value={booking.serviceName} />
          <Row label="Provider" value={booking.providerName || "Not assigned"} />

          <Row
            label="Scheduled At"
            value={format(new Date(booking.scheduledAt), "PPP, p")}
          />

          <Row label="Pricing Type" value={booking.pricingType} />
          <Row label="Phone Number" value={booking.phone} />
          <Row label="Address" value={booking.address} />

          {booking.description && (
            <Row label="Additional Notes" value={booking.description} />
          )}

          <Row
            label="Amount"
            value={booking.amount ? `Rs. ${booking.amount}` : "To be decided"}
          />
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
        {children ?? value}
      </span>
    </div>
  );
}
