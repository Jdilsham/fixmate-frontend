import { useNavigate } from "react-router-dom";

import { useState } from "react";
import DarkmodeToggle from "./darkmodeToggle";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[120px] flex z-96 ">
      <div className="w-[calc(60%)] h-[100px]  text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-25 ">
        <button
          onClick={() => navigate("/")}
          className="hidden md:inline-block "
        >
          Home
        </button>
        <button
          onClick={() => navigate("/services")}
          className="hidden md:inline-block "
        >
          Services
        </button>
        <button
          onClick={() => navigate("/wanted")}
          className="hidden md:inline-block "
        >
          Wanted
        </button>
        <button
          onClick={() => navigate("/about")}
          className="hidden lg:inline-block "
        >
          About
        </button>
        <button
          onClick={() => navigate("/contact")}
          className="hidden lg:inline-block "
        >
          Contact
        </button>
      </div>
      <div className="w-[calc(40%)] h-[100px]  text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-8 ">
        <button
          onClick={() => navigate("/login")}
          className="w-[150px] h-[50px]    backdrop-blur-xl rounded-[20px] flex justify-center items-center text-[28px] p-0 font-medium text-[#101010]  hover:bg-[#101010]/60 hover:text-white transition-all duration-300  "
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-[150px] h-[50px]    backdrop-blur-xl rounded-[20px] flex justify-center items-center text-[28px] p-0 font-medium text-[#101010] bg-white/30 hover:bg-[#101010]/60 hover:text-white transition-all duration-300 "
        >
          signup
        </button>
        <DarkmodeToggle />
      </div>
    </div>
  );
}
