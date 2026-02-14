import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { getBookingStatusView } from "../../../../utils/bookingStatus";
import { MapPin, X } from "lucide-react";

const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
};

const safeText = (v) =>
  v === null || v === undefined || String(v).trim() === "" ? "—" : String(v);

const pickFirst = (...vals) => {
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (!s || s === "null" || s === "undefined") continue;
    return v;
  }
  return null;
};

const toNum = (v) => {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const getLatLng = (booking) => {
  const lat = toNum(
    pickFirst(
      booking.latitude,
      booking.lat,
      booking.contactLatitude,
      booking.contact_latitude,
      booking.bookingLatitude,
      booking.booking_latitude
    )
  );

  const lng = toNum(
    pickFirst(
      booking.longitude,
      booking.lng,
      booking.contactLongitude,
      booking.contact_longitude,
      booking.bookingLongitude,
      booking.booking_longitude
    )
  );

  return { lat, lng, hasCoords: lat !== null && lng !== null };
};

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

  const addressText = safeText(
    isProvider ? booking.bookingAddress : booking.address
  );

  const phoneText = safeText(isProvider ? booking.customerPhone : booking.phone);

  const pricingType = safeText(booking.paymentType ?? booking.pricingType ?? "—");

  const { lat, lng, hasCoords } = getLatLng(booking);

  const openViewLocation = () => {
    if (!hasCoords) return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openDirections = () => {
    if (!hasCoords) return;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const getDisplayAmount = (b) => {
    const v = b?.paymentAmount ?? b?.amount ?? b?.finalAmount ?? b?.totalAmount ?? null;
    const n = toNum(v);
    return n;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          fixed
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2

          w-[96vw]
          min-w-[1100px]
          max-w-[1280px]
          max-h-[72vh]

          flex flex-col
          overflow-hidden
          rounded-3xl
          border border-black/5 dark:border-white/10

          bg-white/85
          dark:bg-[#0b1220]/95

          shadow-[0_25px_90px_-50px_rgba(15,23,42,0.45)]
          dark:shadow-[0_35px_120px_-70px_rgba(0,0,0,0.70)]
          backdrop-blur-xl

          [&>button.absolute]:hidden
        "
      >
        <div
          className="
            pointer-events-none absolute left-0 right-0 top-0 h-[5px]
            bg-gradient-to-r
            from-accent/80 
            via-primary/70 
            to-cyan-400/60
          "
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-36 -right-36 h-[520px] w-[520px] rounded-full bg-orange-400/12 blur-[150px] dark:hidden" />
          <div className="absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full bg-amber-400/10 blur-[160px] dark:hidden" />

          <div className="hidden dark:block absolute -top-44 -right-44 h-[620px] w-[620px] rounded-full bg-cyan-400/10 blur-[170px]" />
          <div className="hidden dark:block absolute -bottom-48 -left-48 h-[640px] w-[640px] rounded-full bg-emerald-400/10 blur-[190px]" />
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5 dark:ring-white/10" />
        <DialogHeader className="relative px-7 pt-6 pb-4 border-b border-black/5 dark:border-white/10">

          <DialogClose asChild>
            <button
              aria-label="Close"
              className="
                absolute right-5 top-5
                inline-flex items-center justify-center
                h-9 w-9
                rounded-full
                border border-black/10 dark:border-white/15
                bg-white/85 dark:bg-white/10
                text-slate-600 dark:text-slate-200
                transition-all duration-200
                hover:bg-orange-500/10 hover:text-orange-700
                dark:hover:bg-white/15 dark:hover:text-white
                focus:outline-none
                focus-visible:ring-2 focus-visible:ring-orange-400/40
                dark:focus-visible:ring-cyan-400/30
                active:scale-95
              "
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>

          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="min-w-0">
              <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
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

        <div className="relative flex-1 overflow-y-auto px-7 py-5 space-y-6">
          {booking.status === "REJECTED" && !isProvider && (
            <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-red-500 via-rose-400 to-red-600" />
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
              <Row label="Pricing Type" value={pricingType} />

              {isProvider && booking.paymentType === "HOURLY" && (
                <Row
                  label="Hourly Price"
                  value={booking.hourlyRate ? `Rs. ${booking.hourlyRate}` : "—"}
                />
              )}

            <Row label="Amount">
              {getDisplayAmount(booking) !== null ? (
                <span className="inline-flex items-center gap-2">
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(getDisplayAmount(booking))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({String(booking.paymentType ?? booking.pricingType ?? "").replaceAll("_", " ")})
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground">To be decided</span>
              )}
            </Row>
            </Section>
          </div>

          <Section title="Contact & Notes" subtitle="Communication and extra info">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Row label="Phone Number" value={phoneText} />

              <Row label="Address">
                <div className="text-sm font-semibold leading-relaxed break-words whitespace-pre-wrap text-right">
                  {addressText}
                </div>
              </Row>
            </div>

            <div className="py-2 border-b border-black/5 dark:border-white/10">
              <div className="flex justify-between gap-8">
                <span className="text-sm text-muted-foreground shrink-0 w-[160px]">
                  Additional Notes
                </span>

                <div
                  className="
                    w-full
                    max-w-[80%]
                    rounded-2xl
                    border border-black/5 dark:border-white/10
                    bg-white/70 dark:bg-white/5
                    px-4 py-3
                    text-sm font-medium text-foreground
                    max-h-36
                    overflow-auto
                    whitespace-pre-wrap
                    break-words
                    leading-relaxed

                    shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)]
                    dark:shadow-[0_18px_60px_-40px_rgba(0,0,0,0.65)]
                  "
                >
                  {safeText(booking.description || "—")}
                </div>
              </div>
            </div>

            <Row label="Location">
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="fixmateOutline"
                  onClick={openViewLocation}
                  disabled={!hasCoords}
                  className="
                    rounded-xl
                    transition-all duration-200
                    hover:-translate-y-[1px]
                    focus-visible:ring-2 focus-visible:ring-primary/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  View Location
                </Button>

                <Button
                  type="button"
                  onClick={openDirections}
                  disabled={!hasCoords}
                  className="
                    rounded-xl
                    bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
                    dark:bg-gradient-to-r dark:from-cyan-500 dark:via-sky-500 dark:to-emerald-500
                    text-white
                    hover:brightness-110
                    transition-all duration-200
                    active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed
                    dark:ring-1 dark:ring-white/10
                  "
                >
                  Get Directions
                </Button>
              </div>
            </Row>

            {!hasCoords && (
              <div className="mt-2 flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/10 bg-white/55 dark:bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Location not available for this booking.
                </div>
              </div>
            )}
          </Section>


          <div className="relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 text-sm text-muted-foreground">
            <div
              className="
                absolute left-0 right-0 top-0 h-[3px]
                bg-gradient-to-r
                from-orange-500 via-amber-400 to-orange-600
                dark:from-cyan-400 dark:via-sky-500 dark:to-emerald-400
              "
            />
            Tip: Use <span className="font-semibold text-foreground">Manage</span>{" "}
            from the bookings list to continue job actions.
          </div>
        </div>

        <div className="relative px-7 py-4 border-t border-black/5 dark:border-white/10 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex items-center justify-center
              rounded-xl px-4 py-2
              text-sm font-medium
              text-muted-foreground
              transition-all duration-200
              hover:text-orange-700
              hover:bg-orange-500/10
              dark:hover:text-cyan-200
              dark:hover:bg-white/10
              focus:outline-none
              focus-visible:ring-2 focus-visible:ring-orange-400/40
              dark:focus-visible:ring-cyan-400/30
              active:scale-95
            "
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
    <div
      className="
        relative
        rounded-3xl
        border border-black/5 dark:border-white/10
        bg-white/75 dark:bg-white/5
        dark:backdrop-blur-xl
        shadow-[0_18px_60px_-45px_rgba(15,23,42,0.35)]
        dark:shadow-[0_30px_90px_-60px_rgba(0,0,0,0.70)]
        overflow-hidden
      "
    >
      <div className="px-4 py-3 border-b border-black/5 dark:border-white/10">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="px-4 py-2">{children}</div>
    </div>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="py-2 flex items-start justify-between gap-8 border-b border-black/5 dark:border-white/10 last:border-b-0">
      <span className="text-sm text-muted-foreground shrink-0 w-[160px]">
        {label}
      </span>

      <span className="text-sm font-semibold text-foreground text-right leading-relaxed max-w-[80%] break-words">
        {children ?? value ?? "—"}
      </span>
    </div>
  );
}