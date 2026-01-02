import Header from "../components/header";
import Footercard from "../components/footer";
import ContactCard from "../components/contactpage/contactCard";
import ContactForm from "../components/contactpage/contactForm";


export default function About() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors">
      <Header />
     
      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-22">
         <h1 className="text-6xl md:text-7xl font-semibold leading-tight max-w-4xl">
             Contact
           <span className="text-accent">   Us</span>
         </h1>

         <p className="mt-8 text-xl text-muted-foreground max-w-xl">
          Fixmate is ready to provide the right solution according <br/>to your needs.
         </p>

      </section>

         {/* ==============Contact & Join Together============== */}
         <div className="max-w-7xl mx-auto px-6 pb-36">
            <h2 className="text-[48px] font-serif text-center mb-12">
                Contact & Join Together
            </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <ContactCard
            icon="/contactIcons/location.png"
            title="Address"
            value="Galle Road, Matara"
          />
          <ContactCard
            icon="/contactIcons/phone.png"
            title="Phone"
            value="+94 33 265 394"
          />
          <ContactCard
            icon="/contactIcons/whatsapp.png"
            title="Whatsapp"
            value="+94 74 258 889"
          />
          <ContactCard
            icon="/contactIcons/email.png"
            title="Email"
            value="support@fixmate.lk"
          />
        </div>
      </div>

     <section className="max-w-7xl mx-auto px-6 pt-20p b-24 flex flex-col lg:flex-row gap-16 items-center">
        <img
          src="/contact.jpg"
          alt="Support"
          className="w-full max-w-md rounded-xl"
        />

      <ContactForm/>
      </section>
      



    {/* ================= FOOTER ================= */}
      <section className="bg-background pt-32 pb-24">
         <Footercard />
      </section>
    </div>
  );
}
