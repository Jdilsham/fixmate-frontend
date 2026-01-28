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
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

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

    if (!date || !time) {
      toast.error("Please select service date and time");
      return;
    }

    // Combine date + time into ISO string
    const scheduledAt = new Date(
      `${date}T${time}:00`
    ).toISOString();

    onPreview({
      service,
      pricingType,
      scheduledAt,
      description,

      user,
      phone: formData.phone,

      addressLine1: formData.addressLine1,
      city: formData.city,
      province: formData.province,
    });
  };


  const TIME_SLOTS = [
    { label: "08:00 AM - 10:00 AM", value: "08:00" },
    { label: "10:00 AM - 12:00 PM", value: "10:00" },
    { label: "12:00 PM - 02:00 PM", value: "12:00" },
    { label: "02:00 PM - 04:00 PM", value: "14:00" },
    { label: "04:00 PM - 06:00 PM", value: "16:00" },
  ];

  const fetchAvailableSlots = async (selectedDate) => {
    if (!selectedDate) return;

    try {
      setSlotsLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/services/${service.providerServiceId}/available-slots?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setAvailableSlots(data);
    } catch {
      toast.error("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const isSlotInFuture = (slotValue) => {
    if (!date) return true;

    const now = new Date();
    const selectedDate = new Date(date);

 
    if (selectedDate.toDateString() !== now.toDateString()) {
      return true;
    }

   
    const [hours, minutes] = slotValue.split(":").map(Number);

    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime > now;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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

        {/* CITY */}
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

      </div>

      {/* ADDRESS stays FULL width */}
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


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* DATE */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">Service Date</label>
    <input
      type="date"
      value={date}
      onChange={(e) => {
        const selectedDate = e.target.value;
        setDate(selectedDate);

        if (date !== selectedDate) {
          setTime("");
        }

        fetchAvailableSlots(selectedDate);
      }}
      className="h-12 px-4 rounded-lg bg-background border border-input"
    />
  </div>

  {/* TIME SLOT */}
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">Service Time</label>
    <select
      value={time}
      disabled={!date || slotsLoading || availableSlots.length === 0}
      onChange={(e) => setTime(e.target.value)}
      className="h-12 px-4 rounded-lg bg-background border border-input disabled:opacity-50"
    >
      <option value="">Select a time slot</option>

      {slotsLoading && (
        <option disabled>Loading slots...</option>
      )}

      {!slotsLoading && date && availableSlots.length === 0 && (
        <option disabled>No available slots</option>
      )}

      {!slotsLoading &&
        TIME_SLOTS
          .filter(
            (slot) =>
              availableSlots.includes(slot.value) &&
              isSlotInFuture(slot.value)
          )
          .map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
    </select>
  </div>

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

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
