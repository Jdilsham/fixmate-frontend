import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  initiatePayHereSandbox,
  confirmCashPayment,
} from "../../../../utils/payment";

export default function CustomerPaymentDialog({ open, onClose, paymentInfo, onCashConfirmed }) {
  const [method, setMethod] = useState("CARD"); // CARD | CASH
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMethod("CARD");
    setSubmitting(false);
  }, [open]);

  if (!paymentInfo) return null;

  const isCashWaiting = paymentInfo.paymentStatus === "CASH_WAITING_CONFIRMATION";
  // const isConfirmed = paymentInfo.paymentStatus === "CONFIRMED"; // (not used now, you can keep/remove)

  const handlePayCard = async () => {
    try {
      setSubmitting(true);

      const res = await initiatePayHereSandbox(paymentInfo.paymentId);
      const { checkoutUrl, fields } = res;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = checkoutUrl;

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error(e);
      toast.error("Payment initiation failed");
      setSubmitting(false);
    }
  };

  const handleConfirmCash = async () => {
    try {
      setSubmitting(true);

      await confirmCashPayment(paymentInfo.paymentId);

      toast.success("Cash payment confirmed. Waiting for provider confirmation.");
      onClose(false);

      if (onCashConfirmed) onCashConfirmed();
    } catch (e) {
      console.error(e);
      toast.error("Failed to confirm cash payment");
    } finally {
      setSubmitting(false);
    }
  };

  const money = Number(paymentInfo.amount ?? 0).toLocaleString("en-LK");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Required</DialogTitle>
        </DialogHeader>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <p><strong>Service:</strong> {paymentInfo.serviceName}</p>
          <p><strong>Provider:</strong> {paymentInfo.providerName}</p>
          <p><strong>Worked Time:</strong> {paymentInfo.workedTime}</p>
          <p><strong>Amount:</strong> Rs. {money}</p>
        </div>

        {/*Waiting message */}
        {isCashWaiting && (
          <div className="rounded-lg border bg-yellow-500/10 p-3 text-sm">
            <p className="font-semibold text-yellow-600">Waiting for provider confirmation</p>
            <p className="text-xs text-muted-foreground mt-1">
              You confirmed cash payment. Provider must confirm receiving the cash.
            </p>
          </div>
        )}

        {/* Method selector */}
        <div className="mt-5 space-y-2">
          <p className="text-sm font-medium">Select Payment Method</p>

          <div className="flex gap-2">
            {/*CARD button (LOCKED when waiting) */}
            <button
              type="button"
              onClick={() => !isCashWaiting && setMethod("CARD")}
              disabled={isCashWaiting}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isCashWaiting ? "opacity-50 cursor-not-allowed" : ""
              } ${
                method === "CARD"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-background hover:bg-muted"
              }`}
            >
              Card (PayHere)
            </button>

            {/*CASH button (LOCKED when waiting) */}
            <button
              type="button"
              onClick={() => !isCashWaiting && setMethod("CASH")}
              disabled={isCashWaiting}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                isCashWaiting ? "opacity-50 cursor-not-allowed" : ""
              } ${
                method === "CASH"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-background hover:bg-muted"
              }`}
            >
              Cash
            </button>
          </div>

          {/* Cash hint */}
          {method === "CASH" && !isCashWaiting && (
            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              Pay the provider in cash and then confirm here. Your payment will be marked as
              <strong> waiting for provider confirmation</strong>.
            </div>
          )}
        </div>

        {/*Actions (LOCKED when waiting)*/}
        <div className="mt-5">
          {isCashWaiting ? (
            <Button className="w-full" disabled>
              Waiting for Provider Confirmation...
            </Button>
          ) : method === "CARD" ? (
            <Button className="w-full" onClick={handlePayCard} disabled={submitting}>
              {submitting ? "Redirecting..." : `Pay Rs. ${money}`}
            </Button>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConfirmCash}
              disabled={submitting}
            >
              {submitting ? "Confirming..." : "I paid in cash (Confirm)"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}