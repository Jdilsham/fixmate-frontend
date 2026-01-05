import { useState, useEffect } from "react";
import Header from "../components/header";
import Footercard from "../components/footer";
import EmployerCard from "../components/ServicesPage/employerCard";
import { EMPLOYEES } from "../data/EMPLOYEES";
import { useLocation } from "react-router-dom";

export default function Services() {
  const locationHook = useLocation();

  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const SERVICE_MAP = {
    landscaping: "landscaping",
    electrical: "electrician",
    cleaners: "cleaner",
    painting: "painter",
    plumbing: "plumber",
    masonry: "mason",
    "vehicle repair": "mechanic",
    carpentry: "carpenter",
    welding: "welder",
    roofing: "roofer",
    contractors: "contractor",
  };

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const categoryFromUrl = params.get("category");

    if (categoryFromUrl) {
      const normalized = SERVICE_MAP[categoryFromUrl.toLowerCase()];
      if (normalized) {
        setService(normalized);
      }
    }
  }, [locationHook.search]);

  const filteredEmployees = EMPLOYEES.filter((employee) => {
    const matchService = service === "" || employee.service === service;
    const matchLocation =
      location === "" ||
      employee.location.toLowerCase().includes(location.toLowerCase());

    return matchService && matchLocation;
  });

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header />

      {/* ================= PAGE HEADER ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-5xl font-semibold mb-4">Find professionals</h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Choose a service and location to discover verified experts near you.
        </p>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
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
              bg-background
              text-foreground
              border border-border
              rounded-xl
              px-4 py-3 
              outline-none
            "
          >
            <option value="">Select service</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="carpenter">Carpenter</option>
            <option value="mechanic">Vehicle Repair</option>
            <option value="mason">Masonry</option>
            <option value="painter">Painting</option>
          </select>

          {/* Location input */}
          <div
            className=" flex flex-1 items-center bg-background
                text-foreground gap-4 border border-border rounded-xl px-4"
          >
            <img src="/search.png" className="w-5 h-5 opacity-50" alt="" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter by location"
              className="
                w-full 
                bg-background
                text-foreground
                py-3
                outline-none
                placeholder:text-muted-foreground
              "
            />
          </div>

          {/* <button
            className="
              px-8 py-3
              rounded-xl
              bg-accent
              text-accent-foreground
              font-medium
              hover:brightness-110
              transition
            "
          >
            Search
          </button> */}
        </div>
      </section>

      {/* ================= RESULTS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployerCard key={employee.name} employer={employee} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No results found
            </p>
          )}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <section className="bg-background pt-32 pb-24">
        <Footercard />
      </section>
    </div>
  );
}
