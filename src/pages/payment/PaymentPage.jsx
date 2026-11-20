import { useState } from "react";
import Header from "../../components/header";
import PaymentForm from "./PaymentForm";
import PaymentSummary from "./PaymentSummary";
import PaymentSuccess from "./PaymentSuccess";

export default function PaymentPage() {
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState(null);

  function handlePay(paymentData) {
    setData(paymentData);
    setSuccess(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {!success ? (
          <div className="grid md:grid-cols-2 gap-10">
            <PaymentForm onPay={handlePay} />
            <PaymentSummary />
          </div>
        ) : (
          <PaymentSuccess data={data} />
        )}
      </div>
    </div>
  );
}
