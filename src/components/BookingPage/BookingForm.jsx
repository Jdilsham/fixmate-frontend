import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function BookingForm({ service, pricingType }) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a service date");
      return;
    }

    const payload = {
      providerServiceId: service.providerServiceId,
      pricingType,
      scheduledAt: new Date(date).toISOString(),
      description,
    };

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/customer/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const data = await res.json();
      console.log("Booking success:", data);

      alert("Booking confirmed 🎉");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">
          Booking Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Name (UI only for now) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Phone (UI only for now) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="07XXXXXXXX"
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Service Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your requirement..."
              className="px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[180px]"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
