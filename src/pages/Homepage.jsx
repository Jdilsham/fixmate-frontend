import { useState } from "react";
import Header from "../components/header";
import ServiceCard from "../components/homepage/serviceCard";
import QualityCard from "../components/homepage/qualitycard";
import Footercard from "../components/footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";

export default function Homepage() {
  const navigate = useNavigate();

  const SERVICES = [
    { key: "landscaper", title: "Landscaping", icon: "/serviceIcons/landscaping.png" },
    { key: "electrician", title: "Electrical", icon: "/serviceIcons/electric.png" },
    { key: "cleaner", title: "Cleaners", icon: "/serviceIcons/cleaning.png" },
    { key: "plumber", title: "Plumbing", icon: "/serviceIcons/plumbing.png" },
    { key: "painter", title: "Color Washing", icon: "/serviceIcons/colorwash.png" },
    { key: "mason", title: "Masonry", icon: "/serviceIcons/mason.png" },
    { key: "mechanic", title: "Vehicle Repair", icon: "/serviceIcons/mechanic.png" },
    { key: "tiler", title: "Tile Work", icon: "/serviceIcons/tile.png" },
    { key: "upholsterer", title: "Cushion Works", icon: "/serviceIcons/cushioning.png" },
    { key: "carpenter", title: "Carpentry", icon: "/serviceIcons/carpenter.png" },
    { key: "welder", title: "Welding", icon: "/serviceIcons/welding.png" },
    { key: "tv_technician", title: "TV Repair", icon: "/serviceIcons/Tv.png" },
    { key: "equipment_repair", title: "Equipment Repairing", icon: "/serviceIcons/repairing.png" },
    { key: "roofer", title: "Roofing", icon: "/serviceIcons/roofing.png" },
    { key: "contractor", title: "Contractors", icon: "/serviceIcons/construction.png" },
  ];

  const [query, setQuery] = useState("");

  const filteredServices = SERVICES.filter((service) =>
    service.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-screen text-foreground overflow-x-hidden">
      <PageBackground />
      <Header />

      {/* ================= HERO (FULL WIDTH DESIGN) ================= */}
      <section className="relative w-full">
        
        <div className="w-full px-6 md:px-12 lg:px-16 pt-24 md:pt-28 pb-16">
          <div className="max-w-6xl mx-auto">
            <img src="/fixmate logo.png" alt="FixMate" className="w-44 sm:w-52 md:w-56" />

            <div className="mt-10 max-w-4xl">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
                Reliable services,
                <br />
                <span className="text-accent">zero friction.</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Find verified professionals for every job — instantly.
              </p>

              {/* Search */}
              <div className="mt-10 w-full max-w-3xl">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card/70 backdrop-blur rounded-2xl border border-border/60 px-4 sm:px-5 py-3 shadow-[0_16px_50px_-28px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center flex-1 gap-3">
                    <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/15">
                      <img src="/search.png" alt="search" className="w-5 h-5 opacity-70" />
                    </div>

                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      type="text"
                      placeholder="Search electricians, plumbers, mechanics..."
                      className="w-full bg-transparent outline-none text-base sm:text-lg placeholder:text-muted-foreground/80"
                    />
                  </div>
                  <Button
                    variant="fixmate"
                    size="lg"
                    className="w-full sm:w-auto rounded-2xl px-7"
                  >
                    Find services
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="px-3 py-1 rounded-full bg-card/60 border border-border/60">Verified pros</span>
                  <span className="px-3 py-1 rounded-full bg-card/60 border border-border/60">Fast booking</span>
                  <span className="px-3 py-1 rounded-full bg-card/60 border border-border/60">Transparent pricing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* divider */}
      <div className="h-10" />
      </section>

      {/* ================= SERVICES ================= */}
      <section className="w-full">
        <div className="w-full px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-4xl sm:text-5xl font-serif tracking-tight">Services</h2>
                <p className="mt-3 text-muted-foreground max-w-2xl">
                  Browse popular categories or search above to find what you need.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>{filteredServices.length} results</span>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/20 backdrop-blur px-4 sm:px-6 md:px-8 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7 md:gap-9 place-items-center">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <div key={service.key} className="w-full transition hover:-translate-y-1 duration-200">
                      <ServiceCard
                        imgsrc={service.icon}
                        title={service.title}
                        onClick={() => navigate(`/services?service=${service.key.toLowerCase()}`)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No services found</p>
                    <p className="mt-2 text-sm text-muted-foreground/80">
                      Try a different keyword (e.g., “Plumbing”, “Repair”, “Roofing”).
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY FIXMATE ================= */}
      <section className="w-full">
        <div className="w-full px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-[44px] border border-border/60 bg-card/20 backdrop-blur">
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />

              <div className="px-6 md:px-10 pt-16 md:pt-20">
                <h2 className="text-3xl sm:text-4xl font-serif text-center tracking-tight">
                  Why FixMate works
                </h2>
                <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
                  Built for speed, trust, and a smooth experience from search to booking.
                </p>
              </div>

              <div className="px-6 md:px-10 pb-12 md:pb-16 pt-12 md:pt-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 place-items-center">
                  {[
                    ["/qualityIcons/verified.png", "Verified Experts", "Every professional is vetted."],
                    ["/qualityIcons/range.png", "All-in-One", "One platform. Every service."],
                    ["/qualityIcons/easybooking.png", "Fast Booking", "No friction. No waiting."],
                    ["/qualityIcons/rating.png", "Real Reviews", "Trusted by real customers."],
                    ["/qualityIcons/affordable.png", "Fair Pricing", "Transparent & competitive."],
                    ["/qualityIcons/contact.png", "Always Available", "Support when you need it."],
                  ].map(([img, title, desc]) => (
                    <div key={title} className="w-full transition hover:-translate-y-1 duration-200">
                      <QualityCard imgsrc={img} title={title} description={desc} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <section className="w-full pt-10 pb-16">
        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <Footercard />
          </div>
        </div>
      </section>
    </div>
  );
}