import Header from "../components/header";
import Footercard from "../components/footer";
import JobCard from "../components/wantedPage/jobCard";

export default function Wanted() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header />

      {/* ================= PAGE HEADER ================= */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-5xl font-semibold mb-4">
          Wanted Professionals
        </h1>
        <p className="text-lg text-muted-foreground">
          Job requests posted by individuals and businesses looking
          for skilled professionals.
        </p>
      </section>

      {/* ================= JOB LIST ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-40">
        <div className="flex flex-col gap-8">
          <JobCard
            profession="Electrician"
            description="Experienced electrician specializing in residential and commercial projects."
            location="New York, NY"
            contact="Contact Number: 123-456-7890"
          />

          <JobCard
            profession="Plumber"
            description="Skilled plumber with expertise in pipe repairs and installations."
            location="Los Angeles, CA"
            contact="Contact Number: 987-654-3210"
          />

          <JobCard
            profession="Carpenter"
            description="Professional carpenter offering custom furniture and home improvement services."
            location="Chicago, IL"
            contact="Contact Number: 555-123-4567"
          />

          <JobCard
            profession="Mechanic"
            description="Expert mechanic providing reliable vehicle maintenance and repair."
            location="Houston, TX"
            contact="Contact Number: 444-987-6543"
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <section className="bg-background pt-32 pb-24">
        <Footercard />
      </section>
    </div>
  );
}
