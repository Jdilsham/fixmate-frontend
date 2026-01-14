import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function BookingSummary() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Booking Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between text-base">
          <span className="opacity-70">Service</span>
          <span>Plumber</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="opacity-70">Date</span>
          <span>2026-01-10</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="opacity-70">Location</span>
          <span>Colombo</span>
        </div>

        <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-accent">LKR 3,500</span>
        </div>
      </CardContent>
    </Card>
  );
}
