import Header from "../components/header";
import Footercard from "../components/footer";
import MissionCard from "../components/aboutpage/MissionCard";
import VisionCard from "../components/aboutpage/VissionCard";

import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";

export default function About() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden text-foreground">
      <BubbleBackground
        className="absolute inset-0 -z-10 opacity-15 blur-[1px]"
        interactive={false}
        colors={{
          first: "255, 159, 67",
          second: "37, 99, 235",
          third: "34, 211, 238",
          fourth: "99, 102, 241",
        }}
      />

      <Header />

      <section className="relative">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-12 md:pb-16">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur-md px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Trusted home services in Sri Lanka
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
                About <span className="text-accent">Us</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                FixMate is an on-demand home services platform designed to provide reliable,
                fast, and convenient services to people across Sri Lanka. We act as a trusted
                bridge between verified service professionals and customers for essential
                everyday services such as plumbing, electrical repairs, appliance fixing,
                cleaning, and more.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                {[
                  { title: "Fast", desc: "Quick bookings" },
                  { title: "Safe", desc: "Verified pros" },
                  { title: "Easy", desc: "One platform" },
                ].map((s) => (
                  <div
                    key={s.title}
                    className="rounded-2xl border border-border bg-background/70 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-2xl font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-accent/25 via-transparent to-primary/20 blur-2xl" />
              <div className="relative rounded-[28px] border border-border bg-background/60 backdrop-blur-md p-3 shadow-xl">
                <img
                  src="/about3.jpg"
                  alt="About"
                  className="h-[340px] md:h-[420px] w-full rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>

              <div className="absolute -bottom-5 left-6 rounded-2xl border border-border bg-background/80 backdrop-blur-md px-4 py-3 shadow-lg">
                <p className="text-sm font-medium">
                  We connect customers & professionals
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Transparent • Reliable • Convenient
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          What we stand for
        </h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Our mission and vision guide how we build FixMate — focusing on trust,
          quality service, and a smooth experience for everyone.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border bg-background/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <MissionCard />
          </div>

          <div className="rounded-2xl border border-border bg-background/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
            <VisionCard />
          </div>
        </div>
      </section>

      <section className="relative pt-20 pb-24">
        <Footercard />
      </section>
    </div>
  );
}