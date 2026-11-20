import { useState } from "react";

export default function PaymentForm({ onPay }) {
  const [cardType, setCardType] = useState("credit");
  const [form, setForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");

  //  CARD NUMBER FORMAT: 1234 5678 9012 3456
  function handleCardNumber(e) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    value = value.replace(/(.{4})/g, "$1 ").trim();

    setForm({ ...form, number: value });
  }

  //  EXPIRY FORMAT: MM/YY
  function handleExpiry(e) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 4);

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setForm({ ...form, expiry: value });
  }

  function submitPayment() {
    if (!form.number || !form.name || !form.expiry || !form.cvv) {
      setError("All card details are required");
      return;
    }

    setError("");
    onPay({
      ...form,
      cardType,
      amount: 2750,
    });
  }

  return (
    <div className="bg-card p-8 rounded-3xl border border-border shadow-lg">
      <h2 className="text-2xl font-semibold mb-2">Complete Payment</h2>
      <p className="text-muted-foreground mb-6">
        Secure payment powered by FixMate
      </p>

      {/* Credit / Debit */}
      <div className="flex gap-4 mb-6">
        {["credit", "debit"].map((type) => (
          <button
            key={type}
            onClick={() => setCardType(type)}
            className={`flex-1 py-3 rounded-xl border transition
              ${
                cardType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border-border"
              }`}
          >
            {type === "credit" ? "Credit Card" : "Debit Card"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="space-y-4">
       <input
        className="w-full px-4 py-3 rounded-xl border border-input bg-background"
        placeholder="Card Number"
        value={form.number}
        onChange={handleCardNumber}

        autoComplete="off"
        name="card-number"
        inputMode="numeric"
      />


        <input
          className="w-full px-4 py-3 rounded-xl border border-input bg-background"
          placeholder="Cardholder Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="px-4 py-3 rounded-xl border border-input bg-background"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={handleExpiry}

            autoComplete="off"
            name="card-expiry"
            inputMode="numeric"
          />


          <input
            className="px-4 py-3 rounded-xl border border-input bg-background"
            placeholder="CVV"
            type="password"
            maxLength={3}
            value={form.cvv}
            autoComplete="off"
            name="card-cvv"
            onChange={(e) =>
              setForm({ ...form, cvv: e.target.value.replace(/\D/g, "") })
            }
          />
        </div>
      </div>

      {error && (
        <p className="text-destructive text-sm mt-4">{error}</p>
      )}

      <button
        onClick={submitPayment}
        className="w-full mt-8 py-4 rounded-2xl bg-accent text-accent-foreground font-semibold text-xl hover:opacity-90"
      >
        Pay Rs. 2,750
      </button>

      <p className="text-sm text-muted-foreground mt-4">
        🔒 Encrypted & secure payment
      </p>
    </div>
  );
}
