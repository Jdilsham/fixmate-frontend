export default function PaymentSummary() {
  return (
    <div className="bg-card p-8 rounded-3xl border border-border">
      <h3 className="text-xl font-semibold mb-6">Payment Summary</h3>

      <div className="space-y-4 text-muted-foreground">
        <div className="flex justify-between">
          <span>Service Fee</span>
          <span>Rs. 2,500</span>
        </div>

        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span>Rs. 250</span>
        </div>

        <hr className="border-border" />

        <div className="flex justify-between font-semibold text-foreground text-lg">
          <span>Total</span>
          <span>Rs. 2,750</span>
        </div>
      </div>
    </div>
  );
}
