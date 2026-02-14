import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import Header from "../components/header";
import Footercard from "../components/footer";
import JobCard from "../components/wantedPage/jobCard";
import { Button } from "@/components/ui/button";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";

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
    <div className="relative w-full min-h-screen text-foreground overflow-x-hidden">
      <PageBackground />

      <Header />

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-5xl font-semibold mb-4">Wanted Professionals</h1>
        <p className="text-lg text-muted-foreground">
          Job requests posted by individuals and businesses looking for skilled professionals.
        </p>
      </section>

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

      <Button
        variant="fixmate"
        size="icon-lg"
        aria-label="Add wanted notice"
        onClick={() => {
          console.log("Add wanted notice");
        }}
        className={`
          fixed bottom-6 right-6 z-50
          rounded-2xl
          transition-all duration-300
          ${hideFab ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <section ref={footerRef} className="pt-32 pb-24">
        <Footercard />
      </section>
    </div>
  );
}