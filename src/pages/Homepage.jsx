import { useState } from "react";
import Header from "../components/header";
import ServiceCard from "../components/homepage/serviceCard";
import QualityCard from "../components/homepage/qualitycard";
import Footercard from "../components/footer";
import { useNavigate } from "react-router-dom";




export default function Homepage() {

  const navigate = useNavigate();
  const SERVICES = [
    { title: "Landscaping", icon: "/serviceIcons/landscaping.png"},
    { title: "Electrical", icon: "/serviceIcons/electric.png" },
    { title: "Cleaners", icon: "/serviceIcons/cleaning.png" },
    { title: "Painting", icon: "/serviceIcons/painting.png" },
    { title: "Plumbing", icon: "/serviceIcons/plumbing.png" },
    { title: "Color Washing", icon: "/serviceIcons/colorwash.png" },
    { title: "Masonry", icon: "/serviceIcons/mason.png" },
    { title: "Vehicle Repair", icon: "/serviceIcons/mechanic.png" },
    { title: "Tile Work", icon: "/serviceIcons/tile.png" },
    { title: "Cushion Works", icon: "/serviceIcons/cushioning.png" },
    { title: "Carpentry", icon: "/serviceIcons/carpenter.png" },
    { title: "Welding", icon: "/serviceIcons/welding.png" },
    { title: "TV Repair", icon: "/serviceIcons/Tv.png" },
    { title: "Equipment Repairing", icon: "/serviceIcons/repairing.png" },
    { title: "Roofing", icon: "/serviceIcons/roofing.png" },
    { title: "Contractors", icon: "/serviceIcons/construction.png" },
  ];

  const [query, setQuery] = useState("");

  const filteredServices = SERVICES.filter((service) =>
    service.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors">
      <Header />

      
      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-36">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-transparent rounded-[40px]" />

        <img
          src="/fixmate logo.png"
          alt="FixMate"
          className="w-56 mb-20"
        />

        <h1 className="text-6xl md:text-7xl font-semibold leading-tight max-w-4xl">
          Reliable services,
          <br />
          <span className="text-accent">zero friction.</span>
        </h1>

        <p className="mt-8 text-xl text-muted-foreground max-w-xl">
          Find verified professionals for every job — instantly.
        </p>

        {/* ================= SEARCH ================= */}
        <div className="mt-16 w-full max-w-4xl mx-auto px-4">
          <div className="
            flex flex-col sm:flex-row
            items-stretch sm:items-center
            gap-3
            bg-card
            rounded-full
            border border-border
            px-5 py-3
          ">
            <div className="flex items-center flex-1 gap-4">
              <img
                src="/search.png"
                alt="search"
                className="w-5 h-5 opacity-50"
              />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search electricians, plumbers, mechanics..."
                className="
                  w-full
                  bg-transparent
                  outline-none
                  text-base sm:text-lg
                  placeholder:text-muted-foreground
                "
              />
            </div>

            <button
              className="
                w-full sm:w-auto
                px-8 py-3
                rounded-full
                bg-accent
                text-accent-foreground
                font-medium
                hover:brightness-110
                active:scale-95
                transition
              "
            >
              Find services
            </button>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-36">
        <h2 className="text-5xl font-serif mb-20">Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 place-items-center">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.title}
                imgsrc={service.icon}
                title={service.title}
                onClick={() => navigate(`/services?category=${service.title.toLowerCase()}`)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No services found
            </p>
          )}
        </div>
      </section>

      {/* ================= WHY FIXMATE ================= */}
      <section className="
        max-w-7xl mx-auto px-6 pb-40
        bg-card/10
        rounded-[48px]
      ">
        <h2 className="text-4xl font-serif text-center pt-24 mb-20">
          Why FixMate works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-24 place-items-center">
          {[
            ["/qualityIcons/verified.png", "Verified Experts", "Every professional is vetted."],
            ["/qualityIcons/range.png", "All-in-One", "One platform. Every service."],
            ["/qualityIcons/easybooking.png", "Fast Booking", "No friction. No waiting."],
            ["/qualityIcons/rating.png", "Real Reviews", "Trusted by real customers."],
            ["/qualityIcons/affordable.png", "Fair Pricing", "Transparent & competitive."],
            ["/qualityIcons/contact.png", "Always Available", "Support when you need it."],
          ].map(([img, title, desc]) => (
            <QualityCard
              key={title}
              imgsrc={img}
              title={title}
              description={desc}
            />
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <section className="relative mt-32 bg-background pt-32 pb-24">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background" />
        <Footercard />
      </section>
    </div>
  );
}
