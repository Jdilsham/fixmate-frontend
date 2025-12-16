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
          <br /> Right at your Doorstep
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
            className="w-[calc(7%)] h-[50px] bg-[#2C76A4] pl-0 absolute  right-10 rounded-[10px] text-[#FFFFFF] text-[24px] font-semibold ml-4"
          >
            <img
              src="/search.png "
              className="w-[30px] h-[30px] m-auto "
              alt="search icon"
            />
          </button>
        </div>
      </div>

      {/* second quarter - services */}
      <div className="w-full   flex  flex-col justify-center items-center bg-gradient-to-b from-[#B6E8F0] to-[#FFFFFF]">
        <p className="text-[64px] font-serif text-center  ">Our Services</p>
        <div className="w-full flex justify-center items-center ">
          <div
            className="w-full  grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10 pb-20 pl-10
         pr-10"
          >
            <div className="w-[220px] h-full   flex flex-col justify-center items-center space-y-8  ">
              <ServiceCard
                imgsrc="/serviceIcons/landscaping.png"
                title="Landscaping"
              />
              <ServiceCard
                imgsrc="/serviceIcons/electric.png"
                title="Electrical"
              />
              <ServiceCard
                imgsrc="/serviceIcons/cleaning.png"
                title="Cleaners"
              />
            </div>
            <div className="w-[220px] h-full   flex flex-col justify-center items-center space-y-8 ">
              <ServiceCard
                imgsrc="/serviceIcons/plumbing.png"
                title="Plumbing"
              />
              <ServiceCard
                imgsrc="/serviceIcons/colorwash.png"
                title="Color Washing"
              />
              <ServiceCard imgsrc="/serviceIcons/mason.png" title="Masonry" />
            </div>
            <div className="w-[220px] h-full   flex flex-col justify-center items-center space-y-8">
              <ServiceCard
                imgsrc="/serviceIcons/mechanic.png"
                title="Vehicle Repair"
              />
              <ServiceCard imgsrc="/serviceIcons/tile.png" title="Tile work" />
              <ServiceCard
                imgsrc="/serviceIcons/cushioning.png"
                title="Cushion Works"
              />
            </div>
            <div className="w-[220px] h-full   flex flex-col justify-center items-center space-y-8">
              <ServiceCard
                imgsrc="/serviceIcons/carpenter.png"
                title="Carpentry"
              />
              <ServiceCard imgsrc="/serviceIcons/welding.png" title="Welding" />
              <ServiceCard imgsrc="/serviceIcons/Tv.png" title="TV Repair" />
            </div>
            <div className="w-[220px] h-full   flex flex-col justify-center items-center space-y-8">
              <ServiceCard
                imgsrc="/serviceIcons/repairing.png"
                title="Equipment Repairing"
              />
              <ServiceCard imgsrc="/serviceIcons/roofing.png" title="Roofing" />
              <ServiceCard
                imgsrc="/serviceIcons/construction.png"
                title="contractors"
              />
            </div>
          </div>
        </div>
      </div>
      {/* third quarter - why to choose us */}
      <div className="w-full    flex flex-col ">
        <span className="text-[48px] font-serif text-center pt-20">
          Why Choose FixMate?
        </span>
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-10 pb-20 pt-10   ">
          <div className="w-[360px]    flex flex-col justify-center items-center space-y-15 ">
            <QualityCard
              imgsrc="/qualityIcons/verified.png"
              title="Verified & Trusted Technicians"
              description="We verify every technician to ensure reliability and safety."
            />
            <QualityCard
              imgsrc="/qualityIcons/range.png"
              title="Wide Range of Services"
              description="From plumbing to landscaping, we cover it all."
            />
          </div>
          <div className="w-[360px]    flex flex-col justify-center items-center space-y-15">
            <QualityCard
              imgsrc="/qualityIcons/easybooking.png"
              title="Fast & Easy Booking"
              description="Book any service in minutes with the simple interface."
            />
            <QualityCard
              imgsrc="/qualityIcons/rating.png"
              title="Ratings & Reviews"
              description="Choose technicians based on real customer feedback."
            />
          </div>
          <div className="w-[360px]    flex flex-col justify-center items-center space-y-15">
            <QualityCard
              imgsrc="/qualityIcons/affordable.png"
              title="Affordable Pricing"
              description="Fair prices designed to fit your budget without compromising quality."
            />
            <QualityCard
              imgsrc="/qualityIcons/contact.png"
              title="Customer Support"
              description="We help you resolve any issues quickly and efficiently."
            />
          </div>
        </div>
      </div>
      {/* fourth quarter - footer */}
      <div className="w-full h-[500px] bg-cover bg-bottom flex justify-center items-center">
        <Footercard />
      </div>
    </div>
  );
}
