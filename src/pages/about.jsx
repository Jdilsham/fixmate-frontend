import Header from "../components/header";
import Footercard from "../components/footer";
import MissionCard from "../components/aboutpage/MissionCard";
import VisionCard from "../components/aboutpage/VissionCard";
import PageBackground from "@/components/animate-ui/components/backgrounds/PageBackground"; 
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function About() {
  const { dark } = useTheme();

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-foreground">
      <PageBackground interactive={false} />

    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-10 left-[-120px] h-64 w-64 rounded-full blur-3xl bg-fuchsia-400/25 dark:bg-fuchsia-400/18" />

      <div className="absolute top-10 right-[-140px] h-72 w-72 rounded-full blur-3xl bg-cyan-400/25 dark:bg-cyan-400/18" />

      <div className="absolute top-40 left-1/2 -translate-x-1/2 h-72 w-[820px] rounded-full blur-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/18 to-emerald-400/20 dark:from-blue-400/16 dark:via-indigo-400/14 dark:to-emerald-400/16" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[760px] rounded-full blur-3xl bg-gradient-to-r from-orange-300/20 via-amber-200/18 to-yellow-200/18 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-emerald-500/10" />

      <div
        className="absolute inset-0 opacity-[0.10] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>

      <Header />

      <section className="relative">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-12 md:pb-16">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(255,159,67,0.45)]" />
                Trusted home services in Sri Lanka
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
                About{" "}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Us
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                FixMate is an on-demand home services platform designed to provide reliable,
                fast, and convenient services to people across Sri Lanka. We act as a trusted
                bridge between verified service professionals and customers for essential
                everyday services such as plumbing, electrical repairs, appliance fixing,
                cleaning, and more.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                {[
                  { title: "Fast", desc: "Quick bookings" },
                  { title: "Safe", desc: "Verified pros" },
                  { title: "Easy", desc: "One platform" },
                ].map((s, idx) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="group rounded-2xl border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md p-4 shadow-sm hover:shadow-lg transition-all"
                  >
                    <p className="text-2xl font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>

                    <div className="pointer-events-none mt-3 h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-accent/70 via-primary/60 to-transparent" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className={[
                  "absolute -inset-6 rounded-[32px] blur-2xl",
                  dark
                    ? "bg-gradient-to-br from-accent/20 via-primary/10 to-emerald-400/10"
                    : "bg-gradient-to-br from-accent/25 via-primary/15 to-cyan-400/15",
                ].join(" ")}
              />

              <div className="relative rounded-[28px] border border-border bg-background/45 dark:bg-background/30 backdrop-blur-md p-3 shadow-xl">
                <img
                  src="/about3.jpg"
                  alt="About"
                  className="h-[340px] md:h-[420px] w-full rounded-2xl object-cover"
                  loading="lazy"
                />

                <div className="pointer-events-none absolute inset-3 rounded-2xl bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-5 left-6 rounded-2xl border border-border bg-background/70 dark:bg-background/45 backdrop-blur-md px-4 py-3 shadow-lg">
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
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              What we stand for
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Our mission and vision guide how we build FixMate — focusing on trust,
              quality service, and a smooth experience for everyone.
            </p>
          </div>

          <div className="rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md px-4 py-2 text-sm text-muted-foreground">
            Mission • Vision • Values
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />
            <div className="p-1">
              <MissionCard />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative rounded-2xl border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="h-1 w-full bg-gradient-to-r from-primary/70 via-indigo-400/60 to-emerald-400/60" />
            <div className="p-1">
              <VisionCard />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative pt-16 pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <Footercard />
      </section>
    </div>
  );
}