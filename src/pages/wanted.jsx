import { useEffect, useRef, useState } from "react";
import Header from "../components/header";
import Footercard from "../components/footer";
import JobCard from "../components/wantedPage/jobCard";

export default function Wanted() {
  const footerRef = useRef(null);
  const [hideFab, setHideFab] = useState(false);

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideFab(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full min-h-screen bg-background text-foreground relative">
      <Header />

      {/* ================= PAGE HEADER ================= */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-5xl font-semibold mb-4">
          Wanted Professionals
        </h1>
        <p className="text-lg text-muted-foreground">
          Job requests posted by individuals and businesses looking for
          skilled professionals.
        </p>
      </section>

      {/* ================= JOB LIST ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-40">
        <div className="flex flex-col gap-8">
          <JobCard
            profession="Electrician"
            description="Experienced electrician specializing in residential and commercial projects."
            location="New York, NY"
            contact="Contact Number"
          />

          <JobCard
            profession="Plumber"
            description="Skilled plumber with expertise in pipe repairs and installations."
            location="Los Angeles, CA"
            contact="Contact Number"
          />

          <JobCard
            profession="Carpenter"
            description="Professional carpenter offering custom furniture and home improvement services."
            location="Chicago, IL"
            contact="Contact Number"
          />

          <JobCard
            profession="Mechanic"
            description="Expert mechanic providing reliable vehicle maintenance and repair."
            location="Houston, TX"
            contact="Contact Number"
          />
        </div>
      </section>

      {/* ================= FLOATING ACTION BUTTON ================= */}
      <button
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-primary text-primary-foreground
          text-3xl font-light
          flex items-center justify-center
          shadow-lg
          transition-opacity duration-300
          ${hideFab ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
        onClick={() => {
          // TODO: open modal or navigate to create wanted notice
          console.log("Add wanted notice");
        }}
        aria-label="Add wanted notice"
      >
       <span className="leading-none -translate-y-[2px] font-bold">+</span>
      </button>

      {/* ================= FOOTER ================= */}
      <section
        ref={footerRef}
        className="bg-background pt-32 pb-24"
      >
        <Footercard />
      </section>
    </div>
  );
}
