import { useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import Footercard from "../components/footer";
import EmployerCard from "../components/ServicesPage/employerCard";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL;

const SERVICE_OPTIONS = [
  { value: "", label: "All services" },
  { value: "Landscaping", label: "Landscaping" },
  { value: "Electrical", label: "Electrical" },
  { value: "Cleaners", label: "Cleaners" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Color Washing", label: "Color Washing" },
  { value: "Masonry", label: "Masonry" },
  { value: "Vehicle Repair", label: "Vehicle Repair" },
  { value: "Tile Work", label: "Tile Work" },
  { value: "Cushion Works", label: "Cushion Works" },
  { value: "Carpentry", label: "Carpentry" },
  { value: "Welding", label: "Welding" },
  { value: "TV Repair", label: "TV Repair" },
  { value: "Equipment Repairing", label: "Equipment Repairing" },
  { value: "Roofing", label: "Roofing" },
  { value: "Contractors", label: "Contractors" },
];

const norm = (v) => String(v ?? "").trim().toLowerCase();

function getEmployeeServiceKey(emp) {
  return (
    emp?.serviceKey ||
    emp?.serviceType ||
    emp?.serviceCode ||
    emp?.service ||
    emp?.categoryKey ||
    emp?.serviceCategoryKey ||
    emp?.providerServiceKey ||
    emp?.providerService?.serviceKey ||
    emp?.providerService?.service ||
    ""
  );
}

function getEmployeeServiceName(emp) {
  return (
    emp?.serviceName ||
    emp?.category ||
    emp?.serviceCategory ||
    emp?.providerServiceName ||
    emp?.providerService?.serviceName ||
    emp?.providerService?.category ||
    ""
  );
}

function getEmployeeLocationText(emp) {
  return [
    emp?.location,
    emp?.city,
    emp?.district,
    emp?.area,
    emp?.address,
    emp?.addressLine,
    emp?.addressText,
    emp?.providerLocation,
    emp?.providerAddress,
    emp?.address?.city,
    emp?.address?.district,
    emp?.address?.fullAddress,
  ]
    .filter(Boolean)
    .join(" ");
}

function cn(...x) {
  return x.filter(Boolean).join(" ");
}

export default function Services() {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [debouncedLocation, setDebouncedLocation] = useState("");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    setService(params.get("service") || "");
    setLocation(params.get("location") || "");
  }, [locationHook.search]);

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

  const clearFilters = () => {
    setService("");
    setLocation("");
    navigate("?", { replace: true });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedLocation(location), 300);
    return () => clearTimeout(t);
  }, [location]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API}/api/user/services`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!response.ok) throw new Error("Failed to fetch service providers");

        const data = await response.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  const filteredEmployees = useMemo(() => {
    const s = norm(service);
    const l = norm(debouncedLocation);

    const selected = SERVICE_OPTIONS.find(o => o.value === service);
    const sLabel = norm(selected?.label || ""); // "Electrician" -> "electrician"

    return (employees || []).filter((emp) => {
      const empServiceKey = norm(getEmployeeServiceKey(emp));
      const empServiceName = norm(getEmployeeServiceName(emp));
      const empLoc = norm(getEmployeeLocationText(emp));

      const okService =
        !s ||
        empServiceKey === s ||
        empServiceKey.includes(s) ||
        empServiceName.includes(s) ||
        (sLabel && empServiceName.includes(sLabel));
      const okLoc = !l || empLoc.includes(l);

      return okService && okLoc;
    });
  }, [employees, service, debouncedLocation]);

  const activeFilterCount = (service ? 1 : 0) + (location ? 1 : 0);

  const serviceLabel =
    SERVICE_OPTIONS.find((o) => o.value === service)?.label || "All services";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="h-[520px] w-full bg-gradient-to-b from-slate-50 via-white to-background dark:hidden" />
          <div className="hidden dark:block h-[520px] w-full bg-gradient-to-b from-[#061826] via-[#061826] to-background" />

          <div className="absolute -top-10 left-[-120px] h-64 w-64 rounded-full blur-3xl bg-fuchsia-400/25 dark:bg-fuchsia-400/18" />
          <div className="absolute top-10 right-[-140px] h-72 w-72 rounded-full blur-3xl bg-cyan-400/25 dark:bg-cyan-400/18" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 h-72 w-[820px] rounded-full blur-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/18 to-emerald-400/20 dark:from-blue-400/16 dark:to-emerald-400/16" />

          <div
            className="absolute inset-0 h-[520px] opacity-[0.18] dark:opacity-[0.10]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <section className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-1 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Verified professionals • Trusted services
              </div>

              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
                Find the right expert{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500">
                  near you
                </span>
              </h1>

              <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl">
                Search by service and location. Open profiles instantly and compare prices.
              </p>
            </div>

            <div className="flex gap-3 lg:mt-2">
              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl px-4 py-3 shadow-sm min-w-[150px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/15 border border-black/10 dark:border-white/10 flex items-center justify-center">
                    <span className="text-sm">👥</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Providers</p>
                    <p className="text-xl font-semibold">
                      {loading ? "…" : filteredEmployees.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl px-4 py-3 shadow-sm min-w-[150px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/15 border border-black/10 dark:border-white/10 flex items-center justify-center">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active filters</p>
                    <p className="text-xl font-semibold">{activeFilterCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/85 dark:bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-50px_rgba(0,0,0,0.35)]">
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-4">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">
                    Service
                  </label>

                  <select
                    value={service}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="h-12 w-full bg-background/80 text-foreground border border-border rounded-2xl px-4 outline-none focus:ring-2 focus:ring-indigo-500/25 transition"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-8">
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">
                    Location
                  </label>

                  <div className="h-12 flex items-center gap-3 border border-border rounded-2xl px-4 bg-background/80 focus-within:ring-2 focus-within:ring-cyan-500/25 transition">
                    <div className="h-9 w-9 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 border border-black/10 dark:border-white/10 flex items-center justify-center">
                      <img src="/search.png" className="h-4 w-4 opacity-80" alt="" />
                    </div>

                    <input
                      value={location}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      placeholder="Type city or area (e.g., Galle, Matara...)"
                      className="h-full w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                    />

                    {(service || location) && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Active:</span>

                  <span
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border",
                      service
                        ? "border-indigo-500/25 bg-indigo-500/10 text-foreground"
                        : "border-black/10 dark:border-white/10 text-muted-foreground"
                    )}
                  >
                    {service ? `Service: ${serviceLabel}` : "Service: Any"}
                  </span>

                  <span
                    className={cn(
                      "text-xs px-3 py-1 rounded-full border",
                      location
                        ? "border-cyan-500/25 bg-cyan-500/10 text-foreground"
                        : "border-black/10 dark:border-white/10 text-muted-foreground"
                    )}
                  >
                    {location ? `Location: ${location}` : "Location: Any"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Search updates after you stop typing
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {loading ? "…" : filteredEmployees.length}
            </span>{" "}
            provider(s)
          </p>

          <div className="text-xs px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
            Sort: Recommended
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full max-w-[320px] rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-black/10 dark:bg-white/10 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-11 w-full bg-black/10 dark:bg-white/10 rounded-2xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-7 text-center">
            <p className="text-sm font-semibold text-red-600">
              Failed to load providers
            </p>
            <p className="mt-2 text-sm text-red-600/80">{error}</p>
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center">
            {filteredEmployees.map((employee) => (
              <EmployerCard key={employee.providerServiceId} employer={employee} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-10 text-center">
            <h3 className="text-lg font-semibold">No matches found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different service or location keyword.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-background hover:bg-black/5 dark:hover:bg-white/10 px-5 py-3 text-sm font-semibold transition"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="bg-background pt-16 pb-24">
        <Footercard />
      </section>
    </div>
  );
}