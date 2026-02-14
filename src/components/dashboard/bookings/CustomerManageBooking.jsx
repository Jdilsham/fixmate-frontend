import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomerPaymentDialog from "../payments/CustomerPaymentDialog";
import { getCustomerPayment } from "../../../../utils/payment";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";


export default function CustomerManageBooking({ booking, onBack }) {
  if (!booking) {
    return (
      <Card className="p-8 rounded-2xl text-center">
        <p className="text-muted-foreground">No booking selected</p>
        <Button className="mt-4" onClick={onBack}>
          Back
        </Button>
      </Card>
    );
  }

  const status = booking.status;

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const statusMessage = {
    PENDING: "Waiting for provider to accept your booking.",
    ACCEPTED: "Provider has accepted your booking.",
    IN_PROGRESS: "Work is currently in progress.",
    PAYMENT_PENDING: "Payment is required to complete the booking.",
    COMPLETED: "Booking completed successfully.",
    REJECTED: "This booking was rejected by the provider.",
  }[status];


    useEffect(() => {
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
    }, [booking]);


    useEffect(() => {
        if (!booking) return;
        if (booking.status !== "PAYMENT_PENDING") return;

        const interval = setInterval(async () => {
            try {
            const updatedPayment = await getCustomerPayment(booking.bookingId);
            setPaymentInfo(updatedPayment);

            if (updatedPayment.paymentStatus === "PAID") {
                clearInterval(interval);
                toast.success("Payment completed successfully 🎉");
            }
            } catch {
            // silent
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [booking.bookingId, booking.status]);


  return (
    <Card className="p-8 rounded-2xl space-y-6">

      {/* HEADER */}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Manage Booking</h2>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted">
        {paymentInfo?.paymentStatus === "PAID"
            ? "COMPLETED"
            : status.replace("_", " ")}
        </span>
      </div>

      {/* STATUS MESSAGE */}
      <div className="rounded-xl bg-muted/40 p-4 text-sm">
        {statusMessage}
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

        <Detail label="Service">
          {booking.serviceName}
        </Detail>

        <Detail label="Provider">
          {booking.providerName || "Not assigned"}
        </Detail>

        <Detail label="Scheduled At">
          {booking.scheduledAt
            ? new Date(booking.scheduledAt).toLocaleString()
            : "—"}
        </Detail>

        <Detail label="Pricing Type">
         {booking.pricingType || "—"}
        </Detail>

        <Detail label="Phone">
            {booking.phone || "—"}
        </Detail>

        <Detail label="Notes">
          {booking.description || "—"}
        </Detail>
      </div>

      {/* BACK */}
      <div className="pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to My Bookings
        </Button>
      </div>

    {status === "PAYMENT_PENDING" && (
    <div className="mt-8 rounded-2xl border bg-blue-500/10 p-6">

        <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-500">
            Payment Required
        </h3>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
            Pending
        </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm
                        rounded-xl bg-background p-4 border">

       <Detail label="Worked Time">
        {paymentInfo?.workedTime
            ? paymentInfo.workedTime.replace(/^00:/, "")
            : "—"}
        </Detail>

        <Detail label="Amount">
            <span className="text-xl font-bold text-blue-600">
                Rs. {paymentInfo?.amount ?? "—"}
            </span>
        </Detail>
        </div>

        <div className="mt-6 flex justify-end">
            {paymentInfo?.paymentStatus !== "PAID" && (
            <div className="mt-6 flex justify-end">
                <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => setPaymentOpen(true)}
                >
                Pay Now
                </Button>
            </div>
            )}
        </div>

        <CustomerPaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        paymentInfo={paymentInfo}
        />
    </div>
    )}

    </Card>
  );
}

function Detail({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold">
        {children}
      </p>
    </div>
  );
}