import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

export default function BookingViewDialog({ open, onClose, booking }) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <Row label="Status" value={booking.status} />
          <Row label="Customer" value={booking.customerName} />
          <Row label="Phone" value={booking.bookingPhone} />
          <Row label="Service" value={booking.serviceTitle} />
          <Row
            label="Scheduled At"
            value={format(new Date(booking.scheduledAt), "PPpp")}
          />
          <Row label="Payment Type" value={booking.paymentType} />
          <Row
            label="Amount"
            value={booking.paymentAmount ?? "To be decided"}
          />
          <Row label="Address" value={booking.bookingAddress} />

          {booking.description && (
            <Row label="Notes" value={booking.description} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
