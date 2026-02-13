import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProfessionalCard from "../components/BookingPage/ProfessionalCard";
import BookingForm from "../components/BookingPage/BookingForm";
import BookingSummary from "../components/BookingPage/BookingSummary";
import Header from "../components/header";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";

const API = import.meta.env.VITE_BACKEND_URL;

export default function BookProfessional() {
  const { providerServiceId } = useParams();

  const [service, setService] = useState(null);
  const [pricingType, setPricingType] = useState("HOURLY");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [showSummary, setShowSummary] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [address, setAddress] = useState(null);

  const token = localStorage.getItem("token");
  const isProvider = token?.includes("PROVIDER");

  /* ===================== LOAD SERVICE ===================== */
  useEffect(() => {
    if (!providerServiceId) return;

    fetch(`${API}/api/user/services`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((services) => {
        const selected = services.find(
          (s) => s.providerServiceId === Number(providerServiceId)
        );

        if (!selected) throw new Error();

        setService(selected);

        if (!selected.fixedPriceAvailable) setPricingType("HOURLY");
      })
      .catch(() => setError("Unable to load service details"));
  }, [providerServiceId]);

  /* ===================== LOAD USER ===================== */
  useEffect(() => {
    fetch(`${API}/api/customer/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUser)
      .catch(() => console.error("Failed to load user details"));
  }, []);

  /* ===================== LOAD ADDRESS ===================== */
  useEffect(() => {
    const endpoint = isProvider
      ? `${API}/api/provider/address`
      : `${API}/api/customer/address`;

    fetch(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setAddress)
      .catch(() => setAddress(null));
  }, [isProvider]);

  /* ===================== FINAL CONFIRM ===================== */
  const handleFinalConfirm = async () => {
    if (!bookingData) return;

    const {
      service,
      pricingType,
      scheduledAt,
      description,
      addressLine1,
      city,
      province,
      phone,
      latitude,
      longitude,
    } = bookingData;

    const payload = {
      providerServiceId: service.providerServiceId,
      scheduledAt,
      pricingType,
    };

    if (description?.trim()) payload.description = description;
    if (addressLine1) payload.addressLine1 = addressLine1;
    if (city) payload.city = city;
    if (province) payload.province = province;
    if (phone) payload.phone = phone;
    if (latitude != null) payload.latitude = latitude;
    if (longitude != null) payload.longitude = longitude;

    try {
      const res = await fetch(`${API}/api/customer/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 409) toast.error("This time slot is already booked ❌");
        else toast.error(errorText || "Booking failed");
        return;
      }

      toast.success("Booking confirmed 🎉");
      setShowSummary(false);
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  };

  /* ===================== UI STATES ===================== */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!service || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading service…
      </div>
    );
  }

  /* ===================== RENDER ===================== */
  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      {/* background behind everything */}
      <PageBackground interactive={false} />

      {/* ensure header is above background */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* page content above background */}
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* HERO */}
          <div className="pt-6 md:pt-7 pb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(255,159,67,0.45)]" />
              Bookings • Schedule • Secure
            </div>

            <div className="mt-3 flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                  Book a{" "}
                  <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Professional
                  </span>
                </h1>
                <p className="mt-1 text-sm md:text-base text-muted-foreground max-w-2xl">
                  Choose date & time, add notes, preview, then confirm.
                </p>
              </div>

              <div className="text-xs text-muted-foreground border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md px-3 py-2 rounded-full">
                Step 1 • Fill details → Step 2 • Preview → Step 3 • Confirm
              </div>
            </div>

            <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10">
            {/* LEFT */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md shadow-xl overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />
                <div className="p-4">
                  <ProfessionalCard service={service} />

                  <div className="mt-4 rounded-2xl border border-border/70 bg-background/40 dark:bg-background/25 backdrop-blur p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground mb-2">Tips</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Select a date to load available slots.</li>
                      <li>Add a short note about the issue.</li>
                      <li>Preview before final confirmation.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md shadow-xl overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-primary/70 via-indigo-400/60 to-emerald-400/60" />
                <div className="p-4 md:p-5">
                  <BookingForm
                    service={service}
                    pricingType={pricingType}
                    setPricingType={setPricingType}
                    user={user}
                    address={address}
                    onPreview={(data) => {
                      setBookingData(data);
                      setShowSummary(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showSummary && bookingData && (
        <BookingSummary
          bookingData={bookingData}
          onConfirm={handleFinalConfirm}
          onCancel={() => setShowSummary(false)}
          onEdit={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}