import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function BookingForm({
  service,
  pricingType,
  setPricingType,
  user,
  address,
  onPreview,
}) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    addressLine1: "",
    city: "",
    province: "",
    phone: "",
  });

  // Load customer data from backend (NO UI CHANGE)
  useEffect(() => {
  if (!address) return;

  setFormData({
    addressLine1: address.addressLine1 || "",
    city: address.city || "",
    province: address.province || "",
    phone: address.phone || user?.phone || "",
  });
}, [address, user]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;

    onPreview({
  service,
  pricingType,
  date,
  description,

  user,
  phone: formData.phone,

  addressLine1: formData.addressLine1,
  city: formData.city,
  province: formData.province,
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
          {/* NAME */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Your Name</label>
            <input
              readOnly
              value={`${user.firstName} ${user.lastName}`}
              className="h-12 px-4 rounded-lg bg-background border border-input"
            />
          </div>

          {/* PHONE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="h-12 px-4 rounded-lg bg-background border border-input"
            />
          </div>

          {/* ADDRESS */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Address</label>
            <input
              value={formData.addressLine1}
              onChange={(e) =>
                setFormData({ ...formData, addressLine1: e.target.value })
              }
              className="h-12 px-4 rounded-lg bg-background border border-input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">City</label>
            <input
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="h-12 px-4 rounded-lg bg-background border border-input"
            />
          </div>

          {/* DATE  */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Service Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 px-4 rounded-lg bg-background border border-input"
            />
          </div>

          {/* PAYMENT */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Payment Method</label>
            <select
              value={pricingType}
              onChange={(e) => setPricingType(e.target.value)}
              className="h-12 px-4 rounded-lg bg-background border border-input"
            >
              <option value="HOURLY">Hourly</option>
              <option value="FIXED">Fixed</option>
            </select>
          </div>

          {/* NOTES  */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-3 rounded-lg bg-background border border-input resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
