import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomerPaymentDialog from "../payments/CustomerPaymentDialog";
import { getCustomerPayment } from "../../../../utils/payment";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Phone, MapPin, Calendar as CalIcon, Briefcase, Wallet, StickyNote, User } from "lucide-react";

const safeText = (v) =>
  v === null || v === undefined || String(v).trim() === "" ? "—" : String(v);

const formatDateTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
};

const statusBadgeClass = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING") return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25";
  if (s === "ACCEPTED") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25";
  if (s === "IN_PROGRESS") return "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/25";
  if (s === "PAYMENT_PENDING") return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25";
  if (s === "COMPLETED") return "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/25";
  if (s === "REJECTED") return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/25";
  return "bg-muted text-muted-foreground border-border";
};

export default function CustomerManageBooking({ booking, onBack }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const status = booking?.status;

  const statusMessage = useMemo(() => {
    return {
      PENDING: "Waiting for provider to accept your booking.",
      ACCEPTED: "Provider has accepted your booking.",
      IN_PROGRESS: "Work is currently in progress.",
      PAYMENT_PENDING: "Payment is required to complete the booking.",
      COMPLETED: "Booking completed successfully.",
      REJECTED: "This booking was rejected by the provider.",
    }[String(status || "").toUpperCase()] || "—";
  }, [status]);

  // load payment info when payment pending
  useEffect(() => {
    if (!booking?.bookingId) return;
    if (booking?.status !== "PAYMENT_PENDING") return;

    const loadPayment = async () => {
      try {
        const payment = await getCustomerPayment(booking.bookingId);
        setPaymentInfo(payment);
      } catch {
        toast.error("Failed to load payment details");
      }
    };

    loadPayment();
  }, [booking?.bookingId, booking?.status]);

  // poll payment status
  useEffect(() => {
    if (!booking?.bookingId) return;
    if (booking?.status !== "PAYMENT_PENDING") return;

    const interval = setInterval(async () => {
      try {
        const updatedPayment = await getCustomerPayment(booking.bookingId);
        setPaymentInfo(updatedPayment);

        if (updatedPayment?.paymentStatus === "PAID") {
          clearInterval(interval);
          toast.success("Payment completed successfully 🎉");
        }
      } catch {
        // silent
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [booking?.bookingId, booking?.status]);

  if (!booking) {
    return (
      <Card className="relative overflow-hidden rounded-3xl border bg-card/55 backdrop-blur-xl p-8 text-center shadow-lg">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />
        <p className="text-muted-foreground">No booking selected</p>
        <Button className="mt-4 rounded-full" onClick={onBack}>
          Back
        </Button>
      </Card>
    );
  }

  const displayStatus =
    paymentInfo?.paymentStatus === "PAID" ? "COMPLETED" : (booking.status || "—");

  return (
    <Card className="relative overflow-hidden rounded-3xl border bg-card/55 backdrop-blur-xl shadow-lg">
      {/* top gradient line */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

      <div className="p-6 md:p-8 space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight">Manage Booking</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Booking #{booking.bookingId ?? "—"}
            </p>
          </div>

          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(
              displayStatus
            )}`}
          >
            {String(displayStatus).replaceAll("_", " ")}
          </span>
        </div>

        {/* STATUS MESSAGE */}
        <div className="rounded-2xl border bg-muted/20 p-4 text-sm">
          {statusMessage}
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left block */}
          <div className="rounded-2xl border bg-background/40 p-5 space-y-4">
            <SectionTitle icon={Briefcase} title="Service & Schedule" />
            <InfoRow icon={Briefcase} label="Service" value={safeText(booking.serviceName)} />
            <InfoRow icon={CalIcon} label="Scheduled At" value={formatDateTime(booking.scheduledAt)} />
            <InfoRow icon={Wallet} label="Pricing Type" value={safeText(booking.pricingType).replaceAll("_", " ")} />
            <InfoRow icon={Wallet} label="Amount" value={formatPrice(booking.amount)} />
          </div>

          {/* Right block */}
          <div className="rounded-2xl border bg-background/40 p-5 space-y-4">
            <SectionTitle icon={User} title="People & Contact" />
            <InfoRow icon={User} label="Provider" value={safeText(booking.providerName)} />
            <InfoRow icon={Phone} label="Provider Phone" value={safeText(booking.providerPhone)} />
            <InfoRow icon={Phone} label="Your Phone" value={safeText(booking.phone)} />
            <InfoRow icon={MapPin} label="Address" value={safeText(booking.address)} />
            <InfoRow icon={MapPin} label="City" value={safeText(booking.city)} />
          </div>

          {/* Notes full width */}
          <div className="lg:col-span-2 rounded-2xl border bg-background/40 p-5">
            <SectionTitle icon={StickyNote} title="Notes" />
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">
              {safeText(booking.description)}
            </p>
          </div>
        </div>

        {/* BACK */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <Button variant="secondary" className="rounded-full" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Bookings
          </Button>
        </div>

        {/* PAYMENT REQUIRED */}
        {booking.status === "PAYMENT_PENDING" && (
          <div className="rounded-3xl border bg-blue-500/10 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Payment Required
              </h3>

              <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25">
                {paymentInfo?.paymentStatus === "PAID" ? "Paid" : "Pending"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl bg-background/60 p-4 border">
              <MiniStat
                label="Worked Time"
                value={
                  paymentInfo?.workedTime
                    ? String(paymentInfo.workedTime).replace(/^00:/, "")
                    : "—"
                }
              />
              <MiniStat
                label="Amount"
                value={
                  paymentInfo?.amount !== null && paymentInfo?.amount !== undefined
                    ? `Rs. ${Number(paymentInfo.amount).toLocaleString("en-LK")}`
                    : "—"
                }
                strong
              />
              <MiniStat
                label="Payment Status"
                value={safeText(paymentInfo?.paymentStatus)}
              />
            </div>

            {paymentInfo?.paymentStatus !== "PAID" && (
              <div className="mt-5 flex justify-end">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setPaymentOpen(true)}
                >
                  Pay Now
                </Button>
              </div>
            )}

            <CustomerPaymentDialog
              open={paymentOpen}
              onClose={() => setPaymentOpen(false)}
              paymentInfo={paymentInfo}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-xl border bg-muted/30 p-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-xl border bg-muted/30 p-2 shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, strong }) {
  return (
    <div className="rounded-2xl border bg-background/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 ${strong ? "text-xl font-bold text-blue-700 dark:text-blue-300" : "text-sm font-semibold"}`}>
        {value}
      </p>
    </div>
  );
}