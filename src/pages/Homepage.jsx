import { useState } from "react";
import Header from "../components/header";
import ServiceCard from "../components/homepage/serviceCard";

export default function Homepage() {
  const [search, getsearch] = useState("");

  return (
    <div className="w-full h-full">
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
            onChange={(e) => {
              getsearch(e.target.value);
            }}
            placeholder="Search For Services"
            className="w-[calc(93%)] h-[50px] bg-amber-50 rounded-[10px] p-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pl-[20px] text-[24px] font-normal outline-none"
            id=""
          />
          <button
            onClick={() => console.log("search clicked")}
            className="w-[calc(7%)] h-[50px] bg-[#2C76A4] pl-0 absolute  right-10 rounded-[10px] text-[#FFFFFF] text-[24px] font-semibold ml-4"
          >
            <img
              className="w-[30px] h-[31px] m-auto"
              src="/search.png"
              alt=""
            />
          </button>
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center flex-col pt-20  ">
        <span className="text-[64px] font-serif pt-10 ">Our Services</span>
        <div className="w-full h-[360px]  flex justify-center items-center space-x-8 pl-8 pt-8 pb-8">
          <ServiceCard
            imgsrc="/serviceIcons/landscaping.png"
            title="Landscaping"
          />
          <ServiceCard imgsrc="/serviceIcons/electric.png" title="Electrical" />
          <ServiceCard imgsrc="/serviceIcons/cleaning.png" title="Cleaning" />
          <ServiceCard imgsrc="/serviceIcons/plumbing.png" title="Plumbing" />
          <ServiceCard imgsrc="/serviceIcons/carpenter.png" title="Carpentry" />
        </div>
        <div className="w-full h-[360px]  flex justify-center items-center space-x-8 pl-8 pt-8 pb-8">
          <ServiceCard
            imgsrc="/serviceIcons/landscaping.png"
            title="Landscaping"
          />
          <ServiceCard imgsrc="/serviceIcons/electric.png" title="Electrical" />
          <ServiceCard imgsrc="/serviceIcons/cleaning.png" title="Cleaning" />
          <ServiceCard imgsrc="/serviceIcons/plumbing.png" title="Plumbing" />
          <ServiceCard imgsrc="/serviceIcons/carpenter.png" title="Carpentry" />
        </div>
        <div className="w-full h-[360px]  flex justify-center items-center space-x-8 pl-8 pt-8 pb-8">
          <ServiceCard
            imgsrc="/serviceIcons/landscaping.png"
            title="Landscaping"
          />
          <ServiceCard imgsrc="/serviceIcons/electric.png" title="Electrical" />
          <ServiceCard imgsrc="/serviceIcons/cleaning.png" title="Cleaning" />
          <ServiceCard imgsrc="/serviceIcons/plumbing.png" title="Plumbing" />
          <ServiceCard imgsrc="/serviceIcons/carpenter.png" title="Carpentry" />
        </div>
      </div>
    </div>
  );
}
