import { useNavigate } from "react-router-dom";

export default function PaymentSuccess({ data }) {
  const navigate = useNavigate();

  // ✅ IMPORTANT: prevent crash
  if (!data) return null;

  return (
    <div className="max-w-xl mx-auto bg-card p-10 rounded-3xl text-center shadow-lg">
      <div className="flex justify-center mb-4">
         <img
          src="/payment icons/payment.png"
          alt="Payment Success"
          className="w-20 h-20"
        />
  </div>

      <h2 className="text-3xl font-semibold mt-6">
        Payment Successful
      </h2>

      <p className="text-muted-foreground mt-2">
        {data.cardType} card payment completed
      </p>

      <div className="mt-6 text-left space-y-2">
        <p>
          Amount: <strong>Rs. {data.amount}</strong>
        </p>
        <p>
          Card: **** **** **** {data.number.slice(-4)}
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 w-full py-3 rounded-xl bg-primary text-primary-foreground"
      >
        Back to Home
      </button>
    </div>
  );
}
