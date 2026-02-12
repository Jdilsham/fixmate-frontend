import Header from "../components/header";
import Footercard from "../components/footer";
import MissionCard from "../components/aboutpage/MissionCard";
import VisionCard from "../components/aboutpage/VissionCard";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors">
      <Header />

      {/* ===== HERO / ABOUT ===== */}
      <section className="relative overflow-hidden">
        {/* soft background accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-10 md:pb-14">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Trusted home services in Sri Lanka
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
                About <span className="text-accent">Us</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                FixMate is an on-demand home services platform designed to provide reliable,
                fast, and convenient services to people across Sri Lanka. We act as a trusted
                bridge between verified service professionals and customers for essential
                everyday services such as plumbing, electrical repairs, appliance fixing,
                cleaning, and more.
              </p>

              {/* quick stats */}
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                  <p className="text-2xl font-semibold">Fast</p>
                  <p className="mt-1 text-sm text-muted-foreground">Quick bookings</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                  <p className="text-2xl font-semibold">Safe</p>
                  <p className="mt-1 text-sm text-muted-foreground">Verified pros</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                  <p className="text-2xl font-semibold">Easy</p>
                  <p className="mt-1 text-sm text-muted-foreground">One platform</p>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-accent/25 via-transparent to-primary/15 blur-xl" />
              <div className="relative rounded-[28px] border border-border bg-background/60 p-3 shadow-xl">
                <img
                  src="/about3.jpg"
                  alt="About"
                  className="h-[340px] md:h-[420px] w-full rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>

              {/* floating badge */}
              <div className="absolute -bottom-5 left-6 rounded-2xl border border-border bg-background/80 backdrop-blur px-4 py-3 shadow-lg">
                <p className="text-sm font-medium">We connect customers & professionals</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Transparent • Reliable • Convenient
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION / VISION ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">What we stand for</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Our mission and vision guide how we build FixMate — focusing on trust,
              quality service, and a smooth experience for everyone.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl border border-border bg-background/60 shadow-lg hover:shadow-xl transition-shadow">
            <MissionCard />
          </div>

          <div className="rounded-2xl border border-border bg-background/60 shadow-lg hover:shadow-xl transition-shadow">
            <VisionCard />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <section className="bg-background pt-20 pb-24">
        <Footercard />
      </section>
    </div>
  );
}