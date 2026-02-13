import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Calendar, Clock, Phone, MapPin, CreditCard, FileText, User } from "lucide-react";

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

  // Load customer data from backend (NO LOGIC CHANGE)
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

    const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

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

    if (selectedDate.toDateString() !== now.toDateString()) return true;

    const [hours, minutes] = slotValue.split(":").map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime > now;
  };

  const inputBase =
    "h-10 w-full rounded-lg px-3 bg-background/70 dark:bg-background/35 border border-input/80 " +
    "placeholder:text-muted-foreground/70 text-foreground " +
    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition";

  const labelBase = "text-xs font-medium text-muted-foreground flex items-center gap-2";

  return (
    <Card className="w-full rounded-2xl border border-border bg-card/60 dark:bg-card/45 shadow-lg overflow-hidden">
      {/* TOP */}
      <CardHeader className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Booking Details
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Fill your details, choose a slot, then preview before confirming.
            </p>
          </div>

          {/* small status pill */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur px-3 py-1.5 text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Secure booking
          </div>
        </div>
      </CardHeader>

      {/* BODY + STICKY FOOTER */}
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* content */}
          <div className="flex flex-col gap-4">
            {/* NAME */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>
                <User className="h-4 w-4" />
                Your Name
              </label>
              <input
                readOnly
                value={`${user.firstName} ${user.lastName}`}
                className={`${inputBase} opacity-90`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PHONE */}
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputBase}
                />
              </div>

              {/* CITY */}
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>
                  <MapPin className="h-4 w-4" />
                  City
                </label>
                <input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputBase}
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>
                <MapPin className="h-4 w-4" />
                Address
              </label>
              <input
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                className={inputBase}
                placeholder="House no, street, area…"
              />
            </div>

            {/* divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-1" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DATE */}
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>
                  <Calendar className="h-4 w-4" />
                  Service Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    setDate(selectedDate);

                    if (date !== selectedDate) setTime("");

                    fetchAvailableSlots(selectedDate);
                  }}
                  className={inputBase}
                />
              </div>

              {/* TIME */}
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>
                  <Clock className="h-4 w-4" />
                  Service Time
                </label>
                <select
                  value={time}
                  disabled={!date || slotsLoading || availableSlots.length === 0}
                  onChange={(e) => setTime(e.target.value)}
                  className={`${inputBase} disabled:opacity-50`}
                >
                  <option value="">Select a time slot</option>

                  {slotsLoading && <option disabled>Loading slots...</option>}

                  {!slotsLoading && date && availableSlots.length === 0 && (
                    <option disabled>No available slots</option>
                  )}

                  {!slotsLoading &&
                    TIME_SLOTS.filter(
                      (slot) =>
                        availableSlots.includes(slot.value) && isSlotInFuture(slot.value)
                    ).map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>
                <CreditCard className="h-4 w-4" />
                Payment Method
              </label>
              <select
                value={pricingType}
                onChange={(e) => setPricingType(e.target.value)}
                className={inputBase}
              >
                <option value="HOURLY">Hourly</option>
                <option value="FIXED">Fixed</option>
              </select>

              {/* helpful note */}
              <p className="text-[11px] text-muted-foreground mt-1">
                {pricingType === "HOURLY"
                  ? "Hourly price will be calculated based on working time."
                  : "Fixed price will be confirmed by the provider."}
              </p>
            </div>

            {/* NOTES */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>
                <FileText className="h-4 w-4" />
                Additional Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg px-3 py-2 bg-background/70 dark:bg-background/35 border border-input/80 resize-none
                           placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30
                           focus:border-primary/30 transition"
                placeholder="Optional: describe the issue briefly…"
              />
            </div>
          </div>

          {/* STICKY FOOTER CTA */}
          <div className="mt-5 sticky bottom-0 pt-4 pb-4 bg-gradient-to-t from-background/80 via-background/40 to-transparent dark:from-background/50 dark:via-background/20">
          <Button
            type="submit"
            variant="fixmate"
            size="lg"
            disabled={loading}
            className="w-full h-11 rounded-2xl"
          >
            Confirm Booking
          </Button>

            <p className="mt-2 text-[11px] text-muted-foreground text-center">
              You’ll review a summary before final confirmation.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}