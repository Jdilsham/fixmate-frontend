import { useState } from "react";
import Footercard from "../components/footer";
import Header from "../components/header";
import EmployerCard from "../components/ServicesPage/employerCard";

export default function Services() {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  return (
    <div className="w-full bg-gradient-to-b from-[#A4E5EF]  to-[#B6E8F0] flex flex-col justify-center items-center">
      <Header />
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>
      <div className="w-full  flex justify-center items-center mb-16 relative gap-20">
        {/* Service selection dropdown  */}
        <div className="w-[500px] h-[62px]   relative   flex ">
          <select
            onChange={(e) => {
              setService(e.target.value);
              console.log(`${e.target.value}`);
            }}
            className="w-full h-[50px] bg-white rounded-[10px] p-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pl-[20px] text-[24px] font-normal outline-none"
          >
            <option defaultValue={""} disabled>
              Select a service
            </option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="carpenter">Carpenter</option>
            <option value="repairman">Equipment Repair</option>
            <option value="landscaper">Landscaping</option>
            <option value="mechanic">Vehicle Repair</option>
            <option value="tile">Tile Installation</option>
            <option value="cleaner">Cleaning Services</option>
            <option value="painter">Painting Services</option>
            <option value="tv">Tv Services</option>
            <option value="cushioning">Cushion works</option>
            <option value="mason">Mason work</option>
            <option value="welder">Welding</option>
            <option value="roofing">Roofing works</option>
            <option value="construction">Construction</option>


          </select>
        </div>
        {/* Location Search bar  */}
        <div className="w-[600px] h-[62px]   relative   flex">
          <input
          onChange={(e)=>{
            setLocation(e.target.value);
            console.log(`${e.target.value}`);
          }}
            type="text"
            name="search"
            placeholder="Search by Location"
            className="w-[calc(93%)] h-[50px] bg-white rounded-[10px] p-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pl-[20px] text-[24px] font-normal outline-none"
            id=""
          />
          <button
            onClick={() => console.log("search clicked")}
            className="w-[calc(10%)] h-[50px] bg-[#2C76A4] pl-0 absolute  right-10 rounded-[10px] text-[#FFFFFF] text-[24px] font-semibold ml-4"
          >
            <img
              src="/search.png "
              className="w-[30px] h-[30px] m-auto "
              alt="search icon"
            />
          </button>
        </div>
      </div>
      <div className="w-full  grid grid-cols-4 place-items-center gap-10  ">
        <EmployerCard
          employer={{
            name: "John Doe",
            description:
              "Experienced electrician specializing in residential and commercial projects.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Jane Smith",
            description:
              "Professional plumber with expertise in leak repairs and installations.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Mike Johnson",
            description:
              "Skilled carpenter offering custom furniture and home improvement services.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Sara Lee",
            description:
              "Expert mechanic providing reliable vehicle maintenance and repair.",
          }}
        />

        <EmployerCard
          employer={{
            name: "John Doe",
            description:
              "Experienced electrician specializing in residential and commercial projects.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Jane Smith",
            description:
              "Professional plumber with expertise in leak repairs and installations.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Mike Johnson",
            description:
              "Skilled carpenter offering custom furniture and home improvement services.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Sara Lee",
            description:
              "Expert mechanic providing reliable vehicle maintenance and repair.",
          }}
        />

        <EmployerCard
          employer={{
            name: "John Doe",
            description:
              "Experienced electrician specializing in residential and commercial projects.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Jane Smith",
            description:
              "Professional plumber with expertise in leak repairs and installations.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Mike Johnson",
            description:
              "Skilled carpenter offering custom furniture and home improvement services.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Sara Lee",
            description:
              "Expert mechanic providing reliable vehicle maintenance and repair.",
          }}
        />

        <EmployerCard
          employer={{
            name: "John Doe",
            description:
              "Experienced electrician specializing in residential and commercial projects.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Jane Smith",
            description:
              "Professional plumber with expertise in leak repairs and installations.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Mike Johnson",
            description:
              "Skilled carpenter offering custom furniture and home improvement services.",
          }}
        />
        <EmployerCard
          employer={{
            name: "Sara Lee",
            description:
              "Expert mechanic providing reliable vehicle maintenance and repair.",
          }}
        />
      </div>
      <Footercard />
    </div>
  );
}
