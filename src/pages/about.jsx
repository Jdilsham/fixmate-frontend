import Header from "../components/header";
import Footercard from "../components/footer";
import MissionCard from "../components/aboutpage/MissionCard";
import VisionCard from "../components/aboutpage/VissionCard";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors">
      <Header />

      {/* About Section */}
       <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
         <h1 className="text-6xl md:text-7xl font-semibold leading-tight max-w-4xl">
             About
           <span className="text-accent">   Us</span>
         </h1>

         <p className="mt-10 text-xl text-muted-foreground max-w-xl">
          FixMate is an on-demand home services platform designed to provide reliable, fast, and convenient services to people across Sri Lanka.
          We act as a trusted bridge between verified service professionals and customers for essential everyday services such as plumbing, electrical repairs, appliance fixing, cleaning, and more.
         </p>
        </div>

         <img
          src="/about3.jpg"
          alt="About"
          classNmae="rounded-xl shadow-lg"
        />  
      </section>

       <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* Mission Card - Left */}
        <MissionCard />

        {/* Vision Card - Right */}
        <VisionCard />

      </div>
    </div>

        {/* ================= FOOTER ================= */}
            <section className="bg-background pt-32 pb-24">
               <Footercard />
            </section>


    </div>
  );
}
