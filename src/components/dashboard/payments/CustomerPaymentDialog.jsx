import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { initiatePayHereSandbox } from "../../../../utils/payment";
import toast from "react-hot-toast";

export default function CustomerPaymentDialog({ open, onClose, paymentInfo }) {
  if (!paymentInfo) return null;

  const handlePay = async () => {
    try {
      const res = await initiatePayHereSandbox(paymentInfo.paymentId);
      console.log("PayHere response:", res);

      
      const { checkoutUrl, fields } = res;

      
      console.log("Submitting PayHere fields:", fields);

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
    }
  };



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Required</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p><strong>Service:</strong> {paymentInfo.serviceName}</p>
          <p><strong>Provider:</strong> {paymentInfo.providerName}</p>
          <p><strong>Worked Time:</strong> {paymentInfo.workedTime}</p>
          <p><strong>Amount:</strong> Rs. {paymentInfo.amount}</p>

          <Button className="w-full mt-4" onClick={handlePay}>
            Pay Rs. {paymentInfo.amount}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
