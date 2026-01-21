import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProfessionalCard from "../components/BookingPage/ProfessionalCard";
import BookingForm from "../components/BookingPage/BookingForm";
import BookingSummary from "../components/BookingPage/BookingSummary";
import Header from "../components/header";

const API = import.meta.env.VITE_BACKEND_URL;

export default function BookProfessional() {
  const { providerServiceId } = useParams();

  const [service, setService] = useState(null);
  const [pricingType, setPricingType] = useState("HOURLY");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [showSummary, setShowSummary] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  /* ===================== LOAD SERVICE ===================== */
  useEffect(() => {
    if (!providerServiceId) return;

    fetch(`${API}/api/user/services`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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

        if (!selected.fixedPriceAvailable) {
          setPricingType("HOURLY");
        }
      })
      .catch(() => {
        setError("Unable to load service details");
      });
  }, [providerServiceId]);

  /* ===================== LOAD USER ===================== */
  useEffect(() => {
    fetch(`${API}/api/customer/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUser)
      .catch(() => {
        console.error("Failed to load user details");
      });
  }, []);

  /* ===================== FINAL CONFIRM ===================== */
  const handleFinalConfirm = async () => {
    if (!bookingData) return;

    const {
      service,
      pricingType,
      date,
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
      scheduledAt: new Date(date).toISOString(),
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
      await fetch(`${API}/api/customer/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

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
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12">
        <h1 className="text-4xl font-semibold tracking-tight">
          Book a Professional
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review the service details and complete your booking
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <ProfessionalCard service={service} />

            <BookingForm
              service={service}
              pricingType={pricingType}
              setPricingType={setPricingType}
              user={user}
              onPreview={(data) => {
                setBookingData(data);
                setShowSummary(true);
              }}
            />
          </div>

          {/* SUMMARY DIALOG */}
          {showSummary && bookingData && (
            <BookingSummary
              bookingData={bookingData}
              onConfirm={handleFinalConfirm}
              onCancel={() => setShowSummary(false)}
              onEdit={() => setShowSummary(false)}
            />
          )}
        </div>
      </section>
    </div>
  );
}
