import Footercard from "../components/footer";
import Header from "../components/header";
import EmployerCard from "../components/ServicesPage/employerCard";

export default function Services() {
  return (
    <div className="w-full h-full bg-gray-300 flex flex-col">
      <Header />
      <div className="w-full h-[380px] flex justify-center items-center gap-20 ">
        <EmployerCard employer={{ name: "John Doe", description: "Experienced electrician specializing in residential and commercial projects." }} />
        <EmployerCard employer={{ name: "Jane Smith", description: "Professional plumber with expertise in leak repairs and installations." }} />
        <EmployerCard employer={{ name: "Mike Johnson", description: "Skilled carpenter offering custom furniture and home improvement services." }} />
        <EmployerCard employer={{ name: "Sara Lee", description: "Expert mechanic providing reliable vehicle maintenance and repair." }} />
      
      </div>
    <Footercard />
    </div>
  );
}
