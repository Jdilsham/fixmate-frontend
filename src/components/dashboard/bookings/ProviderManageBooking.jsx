import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatWorkedTime } from "../../../../utils/time";
import { ArrowLeft, Play, Square, Wallet, Clock3, User, Briefcase, Phone, StickyNote } from "lucide-react";

const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
};

function InfoItem({ icon: Icon, label, children }) {
  return (
    <div
      className="
        rounded-2xl border bg-background/40
        px-4 py-3
        flex items-start gap-3
        hover:bg-background/60
        transition
      "
    >
      <div className="mt-0.5 shrink-0 rounded-xl border bg-muted/30 p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="text-sm font-semibold text-foreground leading-relaxed break-words">
          {children}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-semibold tracking-wide border";

  if (status === "ACCEPTED") {
    return (
      <span className={`${base} bg-blue-500/15 text-blue-400 border-blue-500/20`}>
        ACCEPTED
      </span>
    );
  }
  if (status === "IN_PROGRESS") {
    return (
      <span
        className={`${base} bg-yellow-500/15 text-yellow-400 border-yellow-500/20`}
      >
        IN PROGRESS
      </span>
    );
  }
  if (status === "PAYMENT_PENDING") {
    return (
      <span
        className={`${base} bg-emerald-500/15 text-emerald-400 border-emerald-500/20`}
      >
        PAYMENT PENDING
      </span>
    );
  }

  return (
    <span className={`${base} bg-muted text-muted-foreground border-border`}>
      {String(status || "—").replaceAll("_", " ")}
    </span>
  );
}

export default function ProviderManageBooking({
  booking,
  providerPaymentInfo,
  providerPaymentLoading,
  elapsedSeconds,
  onBack,
  onStart,
  onEnd,
  onRequestPayment,
  onConfirmCash,
}) {
  // ---- empty state ----
  if (!booking) {
    return (
      <Card className="p-10 rounded-3xl border bg-card shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Manage Booking</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select a booking to start managing the job.
            </p>
          </div>

          <Button variant="outline" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="rounded-3xl border bg-muted/20 p-10 text-center">
          <p className="text-lg font-semibold">No booking selected</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select a booking and click <b>Manage</b>
          </p>
        </div>
      </Card>
    );
  }

  const status = booking?.status;

  // payment status normalization
  const paymentId = providerPaymentInfo?.paymentId ?? providerPaymentInfo?.id;
  const paymentStatus =
    providerPaymentInfo?.paymentStatus ?? providerPaymentInfo?.status;
  const paymentMethod = providerPaymentInfo?.paymentMethod;

  const showStart = status === "ACCEPTED";
  const showEnd = status === "IN_PROGRESS";
  const showPaymentPending = status === "PAYMENT_PENDING";

  return (
    <Card className="p-10 rounded-3xl border bg-card shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-3xl font-semibold tracking-tight">Manage Booking</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track job progress and manage payment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusPill status={status} />

          <Button variant="outline" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-3xl border bg-muted/15 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <InfoItem icon={User} label="Customer">
            {booking.customerName ?? "—"}
          </InfoItem>

          <InfoItem icon={Briefcase} label="Service">
            {booking.serviceTitle ?? booking.serviceName ?? "—"}
          </InfoItem>

          <InfoItem icon={Clock3} label="Scheduled At">
            {booking.scheduledAt
              ? new Date(booking.scheduledAt).toLocaleString()
              : "—"}
          </InfoItem>

          <InfoItem icon={Wallet} label="Pricing Type">
            {booking.paymentType ?? "—"}
          </InfoItem>

          {booking.paymentType === "HOURLY" ? (
            <InfoItem icon={Wallet} label="Hourly Rate">
              {formatPrice(booking.hourlyRate)}
            </InfoItem>
          ) : (
            <InfoItem icon={Wallet} label="Hourly Rate">
              —
            </InfoItem>
          )}

          <InfoItem icon={Phone} label="Phone">
            {booking.customerPhone ?? "—"}
          </InfoItem>

          <div className="md:col-span-2 xl:col-span-3">
            <InfoItem icon={StickyNote} label="Notes">
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {booking.description || "—"}
              </div>
            </InfoItem>
          </div>
        </div>
      </div>

      {/* Start Job */}
      {showStart && (
        <div className="flex items-center justify-between gap-4 rounded-3xl border bg-background/40 p-5">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Ready to start?</p>
            <p className="text-xs text-muted-foreground">
              Start the job to begin tracking time.
            </p>
          </div>

          <Button
            className="rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6"
            onClick={onStart}
          >
            <Play className="w-4 h-4" />
            Start Job
          </Button>
        </div>
      )}

      {/* In Progress: Timer + End */}
      {showEnd && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border bg-background/40 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border bg-muted/30 px-4 py-2 flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {formatWorkedTime(elapsedSeconds ?? 0)}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              Time is running while the job is in progress.
            </div>
          </div>

          <Button
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-6"
            onClick={onEnd}
          >
            <Square className="w-4 h-4" />
            End Work
          </Button>
        </div>
      )}

      {/* Payment Pending Section */}
      {showPaymentPending && (
        <div className="rounded-3xl border bg-emerald-500/10 p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-emerald-500">Job Completed</h3>
              <p className="text-sm text-muted-foreground">
                Review job summary and request payment
              </p>
            </div>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-500 border border-emerald-500/20">
              Ready for Payment
            </span>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border bg-muted/20 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Worked Time
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatWorkedTime(booking.workedSeconds ?? elapsedSeconds ?? 0)}
                </p>
              </div>

              {booking.paymentType === "HOURLY" && (
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Hourly Rate
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatPrice(booking.hourlyRate)}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border bg-emerald-500/10 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Final Amount
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-500">
                  {formatPrice(booking.paymentAmount)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {/* 1) No payment record yet */}
              {!paymentId && (
                <Button
                  size="lg"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                  onClick={onRequestPayment}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Request Payment
                </Button>
              )}

              {/* 2) Waiting customer payment */}
              {paymentId && ["REQUESTED", "PROCESSING"].includes(paymentStatus) && (
                <Button size="lg" variant="outline" disabled className="rounded-xl px-8">
                  ⏳ Waiting for customer payment
                </Button>
              )}

              {/* 3) Cash confirmation */}
              {paymentId &&
                paymentMethod === "CASH" &&
                paymentStatus === "CASH_WAITING_CONFIRMATION" && (
                  <Button
                    size="lg"
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-8"
                    onClick={onConfirmCash}
                  >
                    Confirm Cash Received
                  </Button>
                )}

              {/* 4) Paid/confirmed */}
              {paymentId && ["CONFIRMED", "SUCCESS", "PAID"].includes(paymentStatus) && (
                <Button size="lg" variant="outline" disabled className="rounded-xl px-8">
                  Payment Received ✅
                </Button>
              )}
            </div>

            {providerPaymentLoading && (
              <p className="text-xs text-muted-foreground mt-3 text-right">
                Loading payment info...
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}