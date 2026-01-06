import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export default function BookingForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">
          Booking Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="07XXXXXXXX"
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Service Date</label>
            <input
              type="date"
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <textarea
              rows="4"
              placeholder="Describe your requirement..."
              className="px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button className="min-w-[180px]">
              Confirm Booking
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
