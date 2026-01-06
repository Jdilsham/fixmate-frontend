import Header from "../components/header";
import Footercard from "../components/footer";

import ProfessionalCard from "../components/BookingPage/ProfessionalCard";
import BookingForm from "../components/BookingPage/BookingForm";
import BookingSummary from "../components/BookingPage/BookingSummary";

export default function BookProfessional() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header />

      {/* ================= PAGE HEADER ================= */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-5xl font-semibold mb-4">
          Book Professional
        </h1>
        <p className="text-lg text-muted-foreground">
          Fill in the details below to book a professional service.
        </p>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-40 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
          <ProfessionalCard />
          <BookingForm />
        </div>

        <div>
          <BookingSummary />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <section className="bg-background pt-32 pb-24">
        <Footercard />
      </section>
    </div>
  );
}
