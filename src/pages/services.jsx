import { useState, useEffect } from "react";
import Header from "../components/header";
import Footercard from "../components/footer";
import EmployerCard from "../components/ServicesPage/employerCard";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Services() {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= URL → STATE ================= */
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);

    setService(params.get("service") || "");
    setLocation(params.get("location") || "");
  }, [locationHook.search]);

  /* ================= STATE → API ================= */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (service) params.append("service", service);
        if (location) params.append("location", location);

        const response = await fetch(
          `${API}/api/user/services?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch service providers");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [service, location]);

  /* ================= HANDLERS ================= */
  const updateUrlParam = (key, value) => {
    const params = new URLSearchParams(locationHook.search);

    if (value) params.set(key, value);
    else params.delete(key);

    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleServiceChange = (value) => {
    setService(value);
    updateUrlParam("service", value);
  };

  const handleLocationChange = (value) => {
    setLocation(value);
    updateUrlParam("location", value);
  };

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
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row gap-6">
          {/* Service dropdown */}
          <select
            value={service}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full lg:w-[280px] bg-background text-foreground border border-border rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select service</option>

            <option value="landscaper">Landscaping</option>
            <option value="electrician">Electrician</option>
            <option value="cleaner">Cleaners</option>
            <option value="plumber">Plumber</option>
            <option value="painter">Color Washing</option>
            <option value="mason">Masonry</option>
            <option value="mechanic">Vehicle Repair</option>
            <option value="tiler">Tile Work</option>
            <option value="upholsterer">Cushion Works</option>
            <option value="carpenter">Carpentry</option>
            <option value="welder">Welding</option>
            <option value="tv_technician">TV Repair</option>
            <option value="equipment_repair">Equipment Repairing</option>
            <option value="roofer">Roofing</option>
            <option value="contractor">Contractors</option>
          </select>

          {/* Location input */}
          <div className="flex flex-1 items-center bg-background text-foreground gap-4 border border-border rounded-xl px-4">
            <img src="/search.png" className="w-5 h-5 opacity-50" alt="" />
            <input
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="Filter by location"
              className="w-full bg-background text-foreground py-3 outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* ================= RESULTS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center">
          {loading ? (
            <p className="col-span-full text-center text-muted-foreground">
              Loading...
            </p>
          ) : error ? (
            <p className="col-span-full text-center text-destructive">
              {error}
            </p>
          ) : employees.length > 0 ? (
            employees.map((employee) => (
              <EmployerCard
                key={employee.providerServiceId}
                employer={employee}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No service providers found.
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
