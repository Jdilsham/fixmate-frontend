import { useNavigate } from "react-router-dom";
import DarkmodeToggle from "./darkmodeToggle";

export default function Header() {
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", path: "/", display: "md" },
    { label: "Services", path: "/services", display: "md" },
    { label: "Wanted", path: "/wanted", display: "md" },
    { label: "About", path: "/about", display: "lg" },
    { label: "Contact", path: "/contact", display: "lg" },
  ];

  const navButtonClass = "hidden md:inline-block";
  const navButtonClassLg = "hidden lg:inline-block";

  return (
    <div className="w-full h-[120px] flex z-96">
      <div className="w-[calc(60%)] h-[100px] text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-25">
        {navLinks.map(({ label, path, display }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={display === "lg" ? navButtonClassLg : navButtonClass}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-[calc(40%)] h-[100px] text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-8">
        <button
          onClick={() => navigate("/login")}
          className="w-[150px] h-[50px] backdrop-blur-xl rounded-[20px] flex justify-center items-center text-[28px] p-0 font-medium text-[#101010] hover:bg-[#101010]/60 hover:text-white transition-all duration-300"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-[150px] h-[50px] backdrop-blur-xl rounded-[20px] flex justify-center items-center text-[28px] p-0 font-medium text-[#101010] bg-white/30 hover:bg-[#101010]/60 hover:text-white transition-all duration-300"
        >
          Signup
        </button>
        <DarkmodeToggle />
      </div>
    </div>
  );
}
