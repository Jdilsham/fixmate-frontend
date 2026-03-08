import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import MapPicker from "../maps/MapPicker";

const API = import.meta.env.VITE_BACKEND_URL;

const TIME_SLOTS = [
  { label: "08:00 AM - 10:00 AM", value: "08:00" },
  { label: "10:00 AM - 12:00 PM", value: "10:00" },
  { label: "12:00 PM - 02:00 PM", value: "12:00" },
  { label: "02:00 PM - 04:00 PM", value: "14:00" },
  { label: "04:00 PM - 06:00 PM", value: "16:00" },
];

export default function SmartBookingModal({
  open,
  onClose,
  serviceOptions = [],
}) {
  const token = localStorage.getItem("token");

  const [pricingType, setPricingType] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [description, setDescription] = useState("");

  const [customer, setCustomer] = useState(null);
  const [phone, setPhone] = useState("");

  const [mapOpen, setMapOpen] = useState(false);
  const [coords, setCoords] = useState({
    lat: null,
    lng: null,
  });
  const [pinAddress, setPinAddress] = useState({
    addressLine1: "",
    city: "",
    province: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");



  const explanation =
    pricingType === "HOURLY"
      ? "FixMate first looks for nearby available providers for the selected service. Then it compares hourly rates among the nearest matching providers and automatically assigns the best option."
      : pricingType === "FIXED"
      ? "FixMate finds available verified providers for the selected service and automatically assigns the nearest matching provider."
      : "Choose a pricing type. For hourly bookings, FixMate compares nearby providers and hourly rates. For fixed bookings, FixMate selects the nearest matching provider.";

  const selectedServiceLabel = useMemo(() => {
    return (
      serviceOptions.find((opt) => String(opt.value) === String(serviceId))
        ?.label || "Not Selected"
    );
  }, [serviceOptions, serviceId]);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      if (!open || !token) return;

      try {
        const res = await fetch(`${API}/api/customer/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setCustomer(data);
        setPhone(data?.phone || "");
      } catch {
        // silent fail
      }
    };

    fetchCustomerProfile();
  }, [open, token]);

  useEffect(() => {
    if (!open) {
      setPricingType("");
      setServiceId("");
      setScheduledDate("");
      setScheduledTime("");
      setDescription("");
      setCustomer(null);
      setPhone("");
      setMapOpen(false);
      setCoords({ lat: null, lng: null });
      setPinAddress({
        addressLine1: "",
        city: "",
        province: "",
      });
      setSuccess(null);
      setError("");
    }
  }, [open]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`
      );

      if (!res.ok) return;

      const data = await res.json();
      const addr = data?.address || {};

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
        addressLine1 = display
          ? display.split(",").slice(0, 3).join(", ").trim()
          : "";
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

  const buildScheduledAt = () => {
    if (!scheduledDate || !scheduledTime) return null;
    return new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!serviceId) {
      setError("Please select a service.");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setError("Please select service date and time.");
      return;
    }

    if (!pricingType) {
      setError("Please select a pricing type.");
      return;
    }

    if (!coords.lat || !coords.lng) {
      setError("Please pick your location on the map.");
      return;
    }

    if (!pinAddress.addressLine1 || !pinAddress.province) {
      setError("Please select a valid location so address can be detected.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        serviceId: Number(serviceId),
        scheduledAt: buildScheduledAt(),
        description: description || "",
        pricingType,
        addressLine1: pinAddress.addressLine1,
        addressLine2: "",
        province: pinAddress.province,
        city: pinAddress.city || "",
        phone: phone || "",
        latitude: Number(coords.lat),
        longitude: Number(coords.lng),
      };

      const res = await fetch(`${API}/api/customer/bookings/smart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Smart booking failed");
      }

      setSuccess(data);
      toast.success("Smart booking created successfully");
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err) {
      setError(err?.message || "Smart booking failed");
      toast.error(err?.message || "Smart booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-semibold">Smart Booking</h2>
            <p className="text-sm text-white/60">
              Let FixMate choose the best provider automatically
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 p-6">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#12314e] p-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-xl">
                  ⚡
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Auto Match Booking</h3>
                  <p className="text-sm text-white/70">
                    Best provider selected automatically
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">
                  Selected Service
                </p>
                <p className="mt-2 text-2xl font-bold text-cyan-300">
                  {selectedServiceLabel}
                </p>

                <p className="mt-4 text-xs uppercase tracking-wide text-white/50">
                  Booking mode
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-400">
                  {pricingType || "Not Selected"}
                </p>

                <p className="text-sm text-white/60 mt-1">
                  Smart provider selection enabled
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Selection Rule</span>
                  <span className="text-emerald-400 font-medium">Automatic</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Provider Type</span>
                  <span className="text-white/90">Verified & Available</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Priority</span>
                  <span className="text-white/90">
                    {pricingType === "HOURLY"
                      ? "Nearest + Hourly"
                      : pricingType === "FIXED"
                      ? "Nearest"
                      : "Select pricing type"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0f2a41] p-5">
              <h3 className="text-sm font-semibold text-cyan-300">
                How smart booking works
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                {explanation}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0f2a41] p-5">
              <h3 className="text-sm font-semibold text-white/90">Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/70 list-disc list-inside">
                <li>Select the required service type.</li>
                <li>Pick your exact location on the map.</li>
                <li>Choose the booking date and time carefully.</li>
                <li>Review the summary before final confirmation.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#12314e] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Booking Details
                </h3>
                <p className="mt-1 text-sm text-white/65">
                  Fill your details and let FixMate select the right provider.
                </p>
              </div>

              <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Secure booking
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none"
                >
                  <option value="">
                    {serviceOptions.length ? "Select a service" : "Loading services..."}
                  </option>
                  {serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Your Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    customer
                      ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                      : ""
                  }
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none opacity-90"
                  placeholder="Loading customer name..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Address (from pin)
                </label>
                <input
                  type="text"
                  value={pinAddress.addressLine1}
                  readOnly
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none opacity-90"
                  placeholder="Select location on map..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    City (from pin)
                  </label>
                  <input
                    type="text"
                    value={pinAddress.city}
                    readOnly
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none opacity-90"
                    placeholder="Auto detected..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Province (from pin)
                  </label>
                  <input
                    type="text"
                    value={pinAddress.province}
                    readOnly
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none opacity-90"
                    placeholder="Auto detected..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Location (Pin on Map)
                </label>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setMapOpen((s) => !s)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
                  >
                    {mapOpen ? "Hide Map" : "Pick Location"}
                  </button>

                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
                  >
                    Use My Location
                  </button>

                  <div className="text-[11px] text-white/60">
                    {coords.lat && coords.lng
                      ? `Selected: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
                      : "No location selected"}
                  </div>
                </div>

                {mapOpen && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                    <MapPicker
                      value={coords}
                      onChange={(p) => {
                        setCoords(p);
                        reverseGeocode(p.lat, p.lng);
                      }}
                    />
                  </div>
                )}

                <p className="mt-2 text-[11px] text-white/50">
                  Booking uses only the selected pin address.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Service Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Service Time
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none"
                  >
                    <option value="">Select a time slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Pricing Type
                </label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 outline-none"
                >
                  <option value="">Select pricing type</option>
                  <option value="HOURLY">Hourly</option>
                  <option value="FIXED">Fixed</option>
                </select>

                <p className="mt-2 text-xs text-white/50">
                  {pricingType === "HOURLY"
                    ? "FixMate compares nearby providers and hourly rates."
                    : pricingType === "FIXED"
                    ? "FixMate selects the nearest matching provider."
                    : "Choose how this booking should be matched."}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none resize-none"
                  placeholder="Optional: briefly describe what you need..."
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  <p className="font-semibold">Smart booking created successfully.</p>
                  <p className="mt-1">Booking ID: {success.bookingId}</p>
                  <p>Assigned Provider: {success.providerName}</p>
                  <p>Service: {success.serviceName}</p>
                  <p>Status: {success.status}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Confirm Smart Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}