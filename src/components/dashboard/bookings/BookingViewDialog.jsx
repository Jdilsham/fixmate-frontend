import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { getBookingStatusView } from "../../../../utils/bookingStatus";

const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
};

const safeText = (v) =>
  v === null || v === undefined || String(v).trim() === "" ? "—" : String(v);

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
      <DialogContent
        className="
          w-[96vw]
          min-w-[1100px]
          max-w-[1280px]
          max-h-[72vh]
          flex flex-col
          overflow-hidden
          rounded-3xl
          border
          bg-background
          shadow-2xl
        "
      >
        {/* ===== Header ===== */}
        <DialogHeader className="px-7 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                Booking Details
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Review booking information and current status.
              </p>
            </div>

            <span
              className={`
                inline-flex items-center gap-2
                rounded-full px-3 py-1
                text-xs font-semibold
                border
                ${status.className}
              `}
            >
              {status.label}
            </span>
          </div>
        </DialogHeader>

        {/* ===== Body ===== */}
        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-6">
          {/* Rejected banner (customer only) */}
          {booking.status === "REJECTED" && !isProvider && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm font-semibold text-red-600">Booking Rejected</p>

              <p className="mt-1 text-sm text-red-500">
                Reason:{" "}
                {booking.rejectionReason ??
                  booking.rejectReason ??
                  booking.reason ??
                  "No reason provided"}
              </p>

              {booking.rejectedAt && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Rejected at: {new Date(booking.rejectedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* ===== Top row: Overview + Payment & Work ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Overview" subtitle="Main booking information">
              <Row
                label="Service"
                value={safeText(isProvider ? booking.serviceTitle : booking.serviceName)}
              />
              <Row
                label={isProvider ? "Customer" : "Provider"}
                value={safeText(
                  isProvider ? booking.customerName : booking.providerName || "Not assigned"
                )}
              />
              <Row
                label="Scheduled At"
                value={safeText(format(new Date(booking.scheduledAt), "PPP, p"))}
              />
            </Section>

            <Section title="Payment & Work" subtitle="Pricing and amount details">
              <Row
                label="Pricing Type"
                value={safeText(booking.paymentType ?? booking.pricingType ?? "—")}
              />

              {/* Provider hourly rate (provider only, hourly only) */}
              {isProvider && booking.paymentType === "HOURLY" && (
                <Row
                  label="Hourly Price"
                  value={booking.hourlyRate ? `Rs. ${booking.hourlyRate}` : "—"}
                />
              )}

              <Row label="Amount">
                {typeof booking.paymentAmount === "number" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-base font-bold text-emerald-600">
                      {formatPrice(booking.paymentAmount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({String(booking.paymentType || "").replaceAll("_", " ")})
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">To be decided</span>
                )}
              </Row>
            </Section>
          </div>

{/* ===== Contact & Notes ===== */}
<Section title="Contact & Notes" subtitle="Communication and extra info">
  {/* Phone + Address (same row) */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Row
      label="Phone Number"
      value={safeText(isProvider ? booking.customerPhone : booking.phone)}
    />

    <Row label="Address">
      <div className="text-sm font-semibold leading-relaxed break-words whitespace-pre-wrap text-right">
        {safeText(isProvider ? booking.bookingAddress : booking.address)}
      </div>
    </Row>
  </div>

 {/* Additional Notes – full width, aligned with rows */}
<div className="py-2 border-b border-border">
  <div className="flex justify-between gap-8">
    <span className="text-sm text-muted-foreground shrink-0 w-[160px]">
      Additional Notes
    </span>

    <div
      className="
        w-full
        max-w-[80%]
        rounded-xl
        border
        bg-muted/20
        px-4 py-3
        text-sm font-medium text-foreground
        max-h-36
        overflow-auto
        whitespace-pre-wrap
        break-words
        leading-relaxed
      "
    >
      {safeText(booking.description || "—")}
    </div>
  </div>
</div>

{/* Location – immediately after, no extra gap */}
<Row
  label="Location"
  value={safeText(
    `${booking.latitude ?? "—"}, ${booking.longitude ?? "—"}`
  )}
/>
</Section>

          {/* Tip */}
          <div className="rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
            Tip: Use <span className="font-semibold text-foreground">Manage</span>{" "}
            from the bookings list to continue job actions.
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="px-7 py-4 border-t flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted transition"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="px-4 py-2">{children}</div>
    </div>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="py-2 flex items-start justify-between gap-8 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground shrink-0 w-[160px]">
        {label}
      </span>

      <span className="text-sm font-semibold text-foreground text-right leading-relaxed max-w-[80%] break-words">
        {children ?? value ?? "—"}
      </span>
    </div>
  );
}