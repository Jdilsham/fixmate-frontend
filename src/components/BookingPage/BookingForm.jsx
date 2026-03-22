import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  User,
} from "lucide-react";
import MapPicker from "../maps/MapPicker";

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

  const [formData, setFormData] = useState({ phone: "" });

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [mapOpen, setMapOpen] = useState(false);

  const [pinAddress, setPinAddress] = useState({
    addressLine1: "",
    city: "",
    province: "",
  });

  useEffect(() => {
    setFormData((p) => ({
      ...p,
      phone: address?.phone || user?.phone || "",
    }));

    if (address?.latitude && address?.longitude) {
      setCoords({
        lat: Number(address.latitude),
        lng: Number(address.longitude),
      });
    }
  }, [address, user]);

  const uniqueParts = (arr) => {
    const seen = new Set();
    const out = [];
    for (const item of arr) {
      const v = String(item || "").trim();
      if (!v) continue;
      const key = v.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(v);
    }
    return out;
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`
      );
      if (!res.ok) return;

      const data = await res.json();
      const addr = data?.address || {};

      // city should NOT fallback to suburb/neighbourhood
      let city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.city_district ||
        addr.county ||
        "";

      const province = addr.state || addr.region || "";
      const suburbLike = addr.suburb || addr.neighbourhood || addr.hamlet || "";

      const parts = [
        addr.house_number,
        addr.road,
        addr.neighbourhood,
        addr.suburb,
        addr.hamlet,
      ]
        .filter(Boolean)
        .join(", ");

      let addressLine1 = parts;
      if (!addressLine1) {
        const display = (data?.display_name || "").trim();
        addressLine1 = display ? display.split(",").slice(0, 3).join(", ").trim() : "";
      }

      if (
        city &&
        suburbLike &&
        city.trim().toLowerCase() === suburbLike.trim().toLowerCase()
      ) {
        city = "";
      }

      setPinAddress({
        addressLine1: addressLine1 || suburbLike || "",
        city: city || "",
        province: province || "",
      });
    } catch {
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
        setMapOpen(true);
        toast.success("Location selected");
      },
      () => toast.error("Unable to get your location. Please pick on the map."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !time) {
      toast.error("Please select service date and time");
      return;
    }

    if (!coords.lat || !coords.lng) {
      toast.error("Please pick your location on the map");
      return;
    }

    // Require pin address so we NEVER fall back to user address
    if (!pinAddress.addressLine1 || !pinAddress.province) {
      toast.error("Please select a location on the map (address not found)");
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

      addressLine1: pinAddress.addressLine1,
      addressLine2: "",
      city: pinAddress.city,
      province: pinAddress.province,

      latitude: coords.lat ? coords.lat.toFixed(8) : null,
      longitude: coords.lng ? coords.lng.toFixed(8) : null,
    });
  };

  const inputBase =
    "h-10 w-full rounded-lg px-3 bg-background/70 dark:bg-background/35 border border-input/80 " +
    "placeholder:text-muted-foreground/70 text-foreground " +
    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition";

  const labelBase =
    "text-xs font-medium text-muted-foreground flex items-center gap-2";

  return (
    <Card className="w-full rounded-2xl border border-border bg-card/60 dark:bg-card/45 shadow-lg overflow-hidden">
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

          <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur px-3 py-1.5 text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Secure booking
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
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

            {/* PHONE */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={inputBase}
              />
            </div>

            {/* PIN ADDRESS (readonly) */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>
                <MapPin className="h-4 w-4" />
                Address (from pin)
              </label>
              <input
                value={pinAddress.addressLine1}
                readOnly
                className={`${inputBase} opacity-90`}
                placeholder="Select location on map…"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>
                  <MapPin className="h-4 w-4" />
                  City (from pin)
                </label>
                <input
                  value={pinAddress.city}
                  readOnly
                  className={`${inputBase} opacity-90`}
                  placeholder="Auto detected…"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelBase}>
                  <MapPin className="h-4 w-4" />
                  Province (from pin)
                </label>
                <input
                  value={pinAddress.province}
                  readOnly
                  className={`${inputBase} opacity-90`}
                  placeholder="Auto detected…"
                />
              </div>
            </div>

            {/* LOCATION */}
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>
                <MapPin className="h-4 w-4" />
                Location (Pin on Map)
              </label>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="fixmateOutline"
                  className="
                    rounded-xl
                    transition-all duration-200
                    hover:-translate-y-[1px]
                    hover:bg-primary/10
                    hover:border-primary/40
                    hover:text-primary
                    focus-visible:ring-2 focus-visible:ring-primary/30
                    active:translate-y-0
                  "
                  onClick={() => setMapOpen((s) => !s)}
                >
                  {mapOpen ? "Hide Map" : "Pick Location"}
                </Button>

                <Button
                  type="button"
                  variant="fixmateOutline"
                  className="
                    rounded-xl
                    transition-all duration-200
                    hover:-translate-y-[1px]
                    hover:bg-primary/10
                    hover:border-primary/40
                    hover:text-primary
                    focus-visible:ring-2 focus-visible:ring-primary/30
                    active:translate-y-0
                  "
                  onClick={useMyLocation}
                >
                  Use My Location
                </Button>

                <div className="text-[11px] text-muted-foreground">
                  {coords.lat && coords.lng
                    ? `Selected: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(
                        6
                      )}`
                    : "No location selected"}
                </div>
              </div>

              {mapOpen && (
                <div className="mt-2">
                  <MapPicker
                    value={coords}
                    onChange={(p) => {
                      setCoords(p);
                      reverseGeocode(p.lat, p.lng);
                    }}
                  />
                </div>
              )}

              <p className="text-[11px] text-muted-foreground">
                Booking uses ONLY the selected pin address (saved user address is ignored).
              </p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-1" />

            {/* DATE + TIME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        availableSlots.includes(slot.value) &&
                        isSlotInFuture(slot.value)
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