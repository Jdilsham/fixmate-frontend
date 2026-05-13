import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  CalendarDays,
  MapPin,
  Phone,
  Briefcase,
  User,
  Wallet,
  PencilLine,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function BookingSummary({
  bookingData,
  onConfirm,
  onCancel,
  onEdit,
  isSubmitting,
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
  const addressStarted = addressLine1 || city || province;
  const addressInvalid = addressStarted && !addressLine1?.trim();

  const fullAddress =
    [addressLine1, city, province].filter(Boolean).join(", ") ||
    "Default address will be used";

  const Row = ({ icon: Icon, label, children, highlight = false }) => (
    <div
      className={[
        "grid grid-cols-[44px_120px_minmax(0,1fr)] gap-3",
        "items-center px-4 py-3",
      ].join(" ")}
    >
      {/* ICON */}
      <div className="flex items-center justify-center">
        <div className="h-9 w-9 rounded-xl border border-border bg-background/60 dark:bg-background/30 backdrop-blur flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* LABEL */}
      <div className="text-xs font-medium text-muted-foreground">
        {label}
      </div>

      {/* VALUE */}
      <div
        className={[
          "min-w-0 text-sm",
          highlight ? "text-foreground font-semibold" : "text-foreground",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent
        className="
          max-w-lg overflow-hidden rounded-3xl
          border border-border bg-background/75 dark:bg-background/55
          backdrop-blur-xl shadow-2xl
        "
      >
        {/* top accent line */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-accent via-primary to-cyan-400" />

        <DialogHeader className="pt-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                Booking Summary
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Review details before confirming.
              </DialogDescription>
            </div>

            <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-background/60 dark:bg-background/35 px-3 py-1 text-[11px] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Preview
            </div>
          </div>
        </DialogHeader>

        {/* Details */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted/20 dark:bg-muted/15">
          <Row icon={User} label="Customer" highlight>
            {user?.firstName} {user?.lastName}
          </Row>
          <div className="h-px w-full bg-border/60" />

          <Row icon={Phone} label="Phone">
            <span className="break-words">
              {phone || user?.phone || "Not provided"}
            </span>
          </Row>
          <div className="h-px w-full bg-border/60" />

          <Row icon={MapPin} label="Address">
            <span className="break-words">{fullAddress}</span>
          </Row>
          <div className="h-px w-full bg-border/60" />

          <Row icon={Briefcase} label="Service" highlight>
            {service?.serviceTitle}
          </Row>
          <div className="h-px w-full bg-border/60" />

          <Row icon={CalendarDays} label="Date & Time" highlight>
            {formattedDateTime}
          </Row>

          {description && (
            <>
              <div className="h-px w-full bg-border/60" />
              <div className="px-4 py-3">
                <div className="grid grid-cols-[44px_120px_minmax(0,1fr)] gap-3 items-start">
                  {/* icon */}
                  <div className="flex items-start justify-center pt-1">
                    <div className="h-9 w-9 rounded-xl border border-border bg-background/60 dark:bg-background/30 backdrop-blur flex items-center justify-center">
                      <PencilLine className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* label */}
                  <div className="text-xs font-medium text-muted-foreground pt-2">
                    Notes
                  </div>

                  {/* value */}
                  <div
                    className="
                      rounded-xl border border-border
                      bg-background/55 dark:bg-background/30
                      px-3 py-2 text-sm text-foreground/90
                      max-h-28 overflow-auto
                      whitespace-pre-wrap break-words
                    "
                  >
                    {description}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="h-px w-full bg-border/60" />

          {/* TOTAL */}
          <div className="flex items-center justify-between gap-3 py-4 px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60 dark:bg-background/30">
                <Wallet className="h-4 w-4" />
              </span>
              <span className="font-medium">Total</span>
            </div>

            {pricingType === "HOURLY" ? (
              <div className="text-right">
                <p className="text-lg font-bold text-orange-500">
                  LKR {service?.hourlyRate}{" "}
                  <span className="text-sm font-semibold">/ hour</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Final cost depends on working time
                </p>
              </div>
            ) : (
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  Fixed price
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Provider will confirm after reviewing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onConfirm}
          disabled={addressInvalid || isSubmitting}
          variant="fixmate"
          size="lg"
          className="w-full sm:flex-1 rounded-2xl"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Booking is creating...
            </span>
          ) : (
            "Confirm Booking"
          )}
        </Button>
        <Button
          onClick={onEdit}
          variant="fixmateOutline"
          size="lg"
          className="w-full sm:w-44 rounded-2xl"
        >
          Edit
        </Button>
        </div>

        {addressInvalid && (
          <p className="mt-2 text-xs text-red-500">
            Address line is required if you start entering address details.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}