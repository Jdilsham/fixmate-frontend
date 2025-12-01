import { href, Navigate, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex  ">
      <div className="w-[calc(60%)] h-[80px] bg-red-300 text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-25 ">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/wanted">Wanted</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
      <div className="w-[calc(40%)] h-[80px]  text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-15 ">
        <a href="/login">Login</a>
        <button
          // onClick={}
          className="w-[250px] h-[41px] "
        >
          signup
        </button>
        <button>theme</button>
      </div>
    </div>
  );
}
