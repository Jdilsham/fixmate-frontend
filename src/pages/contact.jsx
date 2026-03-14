import Header from "../components/header";
import Footercard from "../components/footer";
import ContactCard from "../components/contactpage/contactCard";
import ContactForm from "@/components/contactpage/ContactForm";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";

export default function Contact() {
  return (
    <div className="relative w-full min-h-screen text-foreground transition-colors overflow-x-hidden">
      <PageBackground interactive={false} />

      {/* Shared FixMate bubble background */}
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
        <div className="relative max-w-7xl mx-auto px-6 pt-24 md:pt-28 pb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(255,159,67,0.45)]" />
            Support • Bookings • Partnerships
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
            Contact{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Us
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            FixMate is ready to provide the right solution according to your needs.
            Reach out anytime — we’ll respond quickly.
          </p>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Contact & Join Together
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Choose the easiest way to reach us. We’re available via phone, WhatsApp, and email.
            </p>
          </div>

          <div className="rounded-full border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md px-4 py-2 text-sm text-muted-foreground">
            We reply fast ⚡
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "/contactIcons/location.png", title: "Address", value: "Galle Road, Matara" },
            { icon: "/contactIcons/phone.png", title: "Phone", value: "+94 33 265 394" },
            { icon: "/contactIcons/whatsapp.png", title: "Whatsapp", value: "+94 74 258 889" },
            { icon: "/contactIcons/email.png", title: "Email", value: "support@fixmate.lk" },
          ].map((item, i) => (
            <div
              key={i}
              className="group w-full rounded-2xl border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all p-4"
            >
              <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-accent/70 via-primary/60 to-transparent mb-3" />
              <div className="flex justify-center">
                <ContactCard {...item} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-accent/20 via-primary/10 to-cyan-400/10 blur-xl" />

            <div className="relative rounded-[28px] border border-border bg-background/45 dark:bg-background/30 backdrop-blur-md p-3 shadow-xl">
              <img
                src="/contact.jpg"
                alt="Support"
                className="w-full h-[360px] md:h-[440px] rounded-2xl object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-3 rounded-2xl bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-5 left-6 rounded-2xl border border-border bg-background/70 dark:bg-background/45 backdrop-blur-md px-4 py-3 shadow-lg">
              <p className="text-sm font-medium">Friendly support team</p>
              <p className="text-xs text-muted-foreground mt-1">
                Fast replies • Clear communication
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl border border-border bg-background/55 dark:bg-background/35 backdrop-blur-md shadow-xl p-6 md:p-8 overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Get In Touch
              </h3>
              <p className="mt-2 text-muted-foreground">
                Tell us what you need. We’ll get back to you quickly.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="relative pt-16 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <Footercard />
      </section>
    </div>
  );
}