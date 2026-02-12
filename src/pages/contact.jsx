import Header from "../components/header";
import Footercard from "../components/footer";
import ContactCard from "../components/contactpage/contactCard";
import ContactForm from "@/components/contactpage/ContactForm";

export default function Contact() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* background blur accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 md:pt-28 pb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Support • Bookings • Partnerships
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
            Contact <span className="text-accent">Us</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
            FixMate is ready to provide the right solution according to your needs.
            Reach out anytime — we’ll respond quickly.
          </p>
        </div>
      </section>

      {/* ===== CONTACT CARDS ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Contact & Join Together
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-10">
          Choose the easiest way to reach us. We’re available via phone, WhatsApp, and email.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "/contactIcons/location.png", title: "Address", value: "Galle Road, Matara" },
            { icon: "/contactIcons/phone.png", title: "Phone", value: "+94 33 265 394" },
            { icon: "/contactIcons/whatsapp.png", title: "Whatsapp", value: "+94 74 258 889" },
            { icon: "/contactIcons/email.png", title: "Email", value: "support@fixmate.lk" },
          ].map((item, i) => (
            <div
              key={i}
              className="w-full rounded-2xl border border-border bg-background/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center p-4"
            >
              <ContactCard {...item} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== IMAGE + FORM ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-accent/25 via-transparent to-primary/15 blur-xl" />
            <div className="relative rounded-[28px] border border-border bg-background/60 p-3 shadow-xl">
              <img
                src="/contact.jpg"
                alt="Support"
                className="w-full h-[360px] md:h-[440px] rounded-2xl object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-6 rounded-2xl border border-border bg-background/80 backdrop-blur px-4 py-3 shadow-lg">
              <p className="text-sm font-medium">Friendly support team</p>
              <p className="text-xs text-muted-foreground mt-1">
                Fast replies • Clear communication
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-border bg-background/60 shadow-xl p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-semibold">Get In Touch</h3>
              <p className="mt-2 text-muted-foreground">
                Tell us what you need. We’ll get back to you quickly.
              </p>
            </div>

            <ContactForm />
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