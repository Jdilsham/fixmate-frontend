import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function BookingForm({ service, pricingType, user, onPreview }) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
  addressLine1: "",
  city: "",
  province: "",
  phone: user?.phone || "",
});


  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      address: user.address || "",
    }));
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a service date");
      return;
    }

    onPreview({
  service,
  pricingType,
  date,
  description,

  addressLine1: formData.addressLine1 || undefined,
  city: formData.city || undefined,
  province: formData.province || undefined,
  phone: formData.phone || undefined,

  latitude: null,   // future-ready
  longitude: null,  // future-ready
});

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
              value={`${formData.firstName} ${formData.lastName}`}
              placeholder="Enter your name"
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Phone (UI only for now) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              value={`${formData.phone}`}
              placeholder="07XXXXXXXX"
              className="h-12 px-4 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="No. 123 Main St, City"
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
            <Button type="submit" disabled={loading} className="min-w-[180px]">
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
