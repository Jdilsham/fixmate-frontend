import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfessionalCard from "../components/BookingPage/ProfessionalCard";
import BookingForm from "../components/BookingPage/BookingForm";

const API = import.meta.env.VITE_BACKEND_URL;

export default function BookProfessional() {
  const { providerServiceId } = useParams();
  const [service, setService] = useState(null);
  const [pricingType, setPricingType] = useState("HOURLY");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!providerServiceId) return;

    fetch(`${API}/api/user/services`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load services");
        return res.json();
      })
      .then((services) => {
        const selected = services.find(
          (s) => s.providerServiceId === Number(providerServiceId)
        );

        if (!selected) throw new Error("Service not found");

        setService(selected);

        if (!selected.fixedPriceAvailable) {
          setPricingType("HOURLY");
        }
      })
      .catch(() => {
        setError("Unable to load service details");
      });
  }, [providerServiceId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading service…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* PAGE HEADER */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-12">
        <h1 className="text-4xl font-semibold tracking-tight">
          Book a Professional
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review the service details and complete your booking
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT: Provider + Form */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <ProfessionalCard service={service} />

            <BookingForm
              service={service}
              pricingType={pricingType}
              setPricingType={setPricingType}
            />
          </div>

          {/* RIGHT: Reserved for future summary */}
          <aside className="hidden lg:block" />
        </div>
      </section>
    </div>
  );
}
