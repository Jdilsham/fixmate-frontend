import { useState } from "react";
import Header from "../components/header";
import Footercard from "../components/footer";
import EmployerCard from "../components/ServicesPage/employerCard";

export default function Services() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="w-full min-h-screen bg-[#EFEFEF] dark:bg-[#0B1E2A] text-[#112B3C] dark:text-[#EFEFEF]">
      <Header />

      
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-5xl font-semibold mb-4">
          Find professionals
        </h1>
        <p className="text-lg opacity-70 max-w-xl">
          Choose a service and location to discover verified experts near you.
        </p>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div
          className="
            bg-white/70 dark:bg-white/5
            backdrop-blur-md
            border border-black/10 dark:border-white/10
            rounded-2xl
            p-6
            flex flex-col lg:flex-row
            gap-6
          "
        >
          {/* Service dropdown */}
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="
              w-full lg:w-[280px]
              bg-transparent
              border border-black/10 dark:border-white/10
              rounded-xl
              px-4 py-3
              text-foreground
              outline-none
            "
          >
            <option value="" defaultChecked disabled>Select service</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="carpenter">Carpenter</option>
            <option value="repairman">Equipment Repair</option>
            <option value="landscaper">Landscaping</option>
            <option value="mechanic">Vehicle Repair</option>
            <option value="tile">Tile Installation</option>
            <option value="cleaner">Cleaning</option>
            <option value="painter">Painting</option>
            <option value="tv">TV Repair</option>
            <option value="cushioning">Cushion Works</option>
            <option value="mason">Masonry</option>
            <option value="welder">Welding</option>
            <option value="roofing">Roofing</option>
            <option value="construction">Construction</option>
          </select>

          {/* Location input */}
          <div className="flex flex-1 items-center gap-4 border border-black/10 dark:border-white/10 rounded-xl px-4">
            <img src="/search.png" className="w-5 h-5 opacity-50" alt="" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by location"
              className="
                w-full
                bg-transparent
                py-3
                outline-none
              "
            />
          </div>

          {/* CTA */}
          <button
            className="
              px-8 py-3
              rounded-xl
              bg-[#F66B0E]
              text-white
              font-medium
              hover:brightness-110
              transition
            "
          >
            Search
          </button>
        </div>
      </section>

      {/* ================= RESULTS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <EmployerCard
              key={i}
              employer={{
                name: ["John Doe", "Jane Smith", "Mike Johnson", "Sara Lee"][i % 4],
                description:
                  [
                    "Experienced electrician specializing in residential and commercial projects.",
                    "Professional plumber with expertise in leak repairs and installations.",
                    "Skilled carpenter offering custom furniture and home improvement services.",
                    "Expert mechanic providing reliable vehicle maintenance and repair.",
                  ][i % 4],
              }}
            />
          ))}
        </div>
      </section>

      {/* ================= FOOTER HOST ================= */}
      <section className="bg-[#112B3C] pt-32 pb-24">
        <Footercard />
      </section>
    </div>
  );
}
