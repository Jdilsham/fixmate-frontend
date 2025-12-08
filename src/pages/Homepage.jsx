import Header from "../components/header";

import ServiceCard from "../components/homepage/serviceCard";
import QualityCard from "../components/homepage/qualitycard";
import Footercard from "../components/footer";

export default function Homepage() {
  return (
    <div className="w-full h-full">

      {/* first quarter - main components */}

      <div className="w-full h-full flex flex-col bg-[url('/background.jpg')] bg-center  bg-no-repeat">
        <Header />
        <div className="pl-[134px]">
          <img src="/fixmate logo.png" alt="fixmate logo not available" />
        </div>
        <div className="text-[#ffffff] text-[58px] font-semibold leading-[70px] pl-[112px] pt-[327px] absolute">
          Reliable Service,
          <br />  Right at your Doorstep
        </div>
        <div className="text-[#ffffff] text-[34px] font-semibold leading-[70px] pl-[112px] pt-[510px] absolute">
          Find Skilled Professionals Instantly
        </div>
        {/* Search bar  */}
        <div className="w-[773px] h-[62px]   absolute leading-[70px]  pl-[112px] pt-[600px] flex">
          <input
            type="text"
            name="search"
            placeholder="Search For Services"
            className="w-[calc(93%)] h-[50px] bg-amber-50 rounded-[10px] p-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pl-[20px] text-[24px] font-normal outline-none"
            id=""
          />
          <button
            onClick={() => console.log("search clicked")}
            className="w-[calc(7%)] h-[50px] bg-[#FF5C00] pl-0 absolute  right-10 rounded-[10px] text-[#FFFFFF] text-[24px] font-semibold ml-4"
          ></button>
        </div>
      </div>

      {/* second quarter - services */}
      <div className="w-full h-full  flex  flex-col  ">
        <span className="text-[64px] font-serif text-center  ">
          Our Services
        </span>
        <div className="w-full h-[300px]   flex justify-center items-center space-x-25  pl-8 pt-8 pb-8">
          <ServiceCard
            imgsrc="/serviceIcons/landscaping.png"
            title="Landscaping"
          />

          <ServiceCard imgsrc="/serviceIcons/plumbing.png" title="Plumbing" />
          <ServiceCard
            imgsrc="/serviceIcons/mechanic.png"
            title="Vehicle Repair"
          />

          <ServiceCard imgsrc="/serviceIcons/carpenter.png" title="Carpentry" />
          <ServiceCard
            imgsrc="/serviceIcons/repairing.png"
            title="Equipment Repairing"
          />
        </div>
        <div className="w-full h-[300px]   flex justify-center items-center space-x-25  pl-8 pt-8 pb-8">
          <ServiceCard imgsrc="/serviceIcons/electric.png" title="Electrical" />
          <ServiceCard
            imgsrc="/serviceIcons/colorwash.png"
            title="Color Washing"
          />
          <ServiceCard imgsrc="/serviceIcons/tile.png" title="Tile work" />
          <ServiceCard imgsrc="/serviceIcons/welding.png" title="Welding" />
          <ServiceCard imgsrc="/serviceIcons/roofing.png" title="Roofing" />
        </div>
        <div className="w-full h-[300px]   flex justify-center items-center space-x-25  pl-8 pt-8 pb-8">
          <ServiceCard imgsrc="/serviceIcons/cleaning.png" title="Cleaners" />
          <ServiceCard imgsrc="/serviceIcons/mason.png" title="Masonry" />
          <ServiceCard
            imgsrc="/serviceIcons/cushioning.png"
            title="Cushion Works"
          />
          <ServiceCard imgsrc="/serviceIcons/Tv.png" title="TV Repair" />
          <ServiceCard
            imgsrc="/serviceIcons/construction.png"
            title="contractors"
          />
        </div>
      </div>
      {/* third quarter - why to choose us */}
      <div className="w-full h-full   flex flex-col ">
        <span className="text-[48px] font-serif text-center pt-20">
          Why Choose FixMate?
        </span>
        <div className="w-full h-[400px]   flex justify-center items-center space-x-25  pl-8 pt-8 pb-8">
          <QualityCard
            imgsrc="/qualityIcons/trusted.png"
            title="Verified & Trusted Technicians"
            description="We verify every technician to ensure reliability and safety."
          />
          <QualityCard
            imgsrc="/qualityIcons/easy.png"
            title="Fast & Easy Booking"
            description="Book any service in minutes with the simple interface."
          />
          <QualityCard
            imgsrc="/qualityIcons/quick.png"
            title="Affordable Pricing"
            description="Fair prices designed to fit your budget without compromising quality."
          />
        </div>
        <div className="w-full h-[400px]   flex justify-center items-center space-x-25  pl-8 pt-8 pb-8">
          <QualityCard
            imgsrc="/qualityIcons/trusted.png"
            title="Wide Range of Services"
            description="From plumbing to landscaping, we cover it all."
          />
          <QualityCard
            imgsrc="/qualityIcons/quick.png"
            title="Ratings & Reviews"
            description="Choose technicians based on real customer feedback."
          />
          <QualityCard
            imgsrc="/qualityIcons/easy.png"
            title="Customer Support"
            description="We help you resolve any issues quickly and efficiently."
          />
        </div>
      </div>
      {/* fourth quarter - footer */}
      <div className="w-full h-[800px] bg-[url('/footer.png')] bg-cover bg-bottom flex justify-center items-center">
        <Footercard />
      </div>

    </div>
  );
}
